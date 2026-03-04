# ============================================================
# EXP02: INCEPTION V3 WITH ENHANCED AUGMENTATION
# Based on 04_train_models.py — inception_v3 only
# Change: stronger / richer training augmentation pipeline
# ============================================================

import os
import time
import copy
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from datetime import datetime
from tqdm import tqdm
import multiprocessing

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms, models
from torchvision.transforms import functional as F
from PIL import Image

# ============================================================
# GPU CHECK
# ============================================================

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"\nUsing device: {device}")
if torch.cuda.is_available():
    print(f"GPU: {torch.cuda.get_device_name(0)}")
    mem = torch.cuda.get_device_properties(0).total_memory
    print(f"VRAM: {mem / 1e9:.1f} GB")
else:
    print("WARNING: No GPU detected! Training will be extremely slow.")
    input("Press Enter to continue anyway, or Ctrl+C to abort...")


# ============================================================
# CONFIGURATION
# ============================================================

class Config:
    CURRENT_MODEL = 'inception_v3'

    # Paths
    BASE_PATH = r"C:\Users\Doruk\OneDrive\Masaüstü\Graduation Project\Bird Dataset Processed"
    TRAIN_CSV = r"C:\Users\Doruk\OneDrive\Masaüstü\Graduation Project\Bird Dataset Processed\train.csv"
    VAL_CSV = r"C:\Users\Doruk\OneDrive\Masaüstü\Graduation Project\Bird Dataset Processed\val.csv"
    TEST_CSV = r"C:\Users\Doruk\OneDrive\Masaüstü\Graduation Project\Bird Dataset Processed\test.csv"
    SAVE_DIR = r"C:\Users\Doruk\OneDrive\Masaüstü\Graduation Project\Bird Dataset Processed\models\exp02_augmentation"

    # CSV column names
    IMAGE_PATH_COL = 'image_path'
    LABEL_COL = 'label'
    SPECIES_COL = 'species'

    # Training parameters
    NUM_CLASSES = 23

    # Phase 1: Frozen backbone, train only classifier head
    FREEZE_EPOCHS = 5
    HEAD_LR = 1e-3

    # Phase 2: Unfreeze all layers, fine-tune with differential LR
    FINETUNE_EPOCHS = 20
    BACKBONE_LR = 1e-5
    FINETUNE_HEAD_LR = 1e-4

    WEIGHT_DECAY = 1e-4
    GRAD_CLIP_MAX_NORM = 1.0

    BATCH_SIZE = 16

    # Early stopping (applied during fine-tuning phase)
    PATIENCE = 7
    MIN_DELTA = 0.001

    # Data loading
    NUM_WORKERS = 4
    PIN_MEMORY = True

    # Random seed
    SEED = 42


# Set seeds for reproducibility
torch.manual_seed(Config.SEED)
np.random.seed(Config.SEED)
if torch.cuda.is_available():
    torch.cuda.manual_seed(Config.SEED)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

# Create save directory
os.makedirs(Config.SAVE_DIR, exist_ok=True)


# ============================================================
# VERIFY PATHS
# ============================================================

print("\n" + "=" * 70)
print("VERIFYING SETUP")
print("=" * 70)

paths_to_check = [
    ('Base path', Config.BASE_PATH),
    ('Train CSV', Config.TRAIN_CSV),
    ('Val CSV', Config.VAL_CSV),
    ('Test CSV', Config.TEST_CSV),
]

all_paths_ok = True
for name, path in paths_to_check:
    exists = os.path.exists(path)
    status = "OK" if exists else "MISSING"
    print(f"  [{status}] {name}: {path}")
    if not exists:
        all_paths_ok = False

if not all_paths_ok:
    print("\nERROR: Some paths don't exist!")
    exit(1)

print("\nAll paths verified!")


# ============================================================
# PRINT CONFIGURATION
# ============================================================

print("\n" + "=" * 70)
print("CONFIGURATION")
print("=" * 70)
print(f"  Model:              {Config.CURRENT_MODEL.upper()}")
print(f"  Label Smoothing:    {Config.LABEL_SMOOTHING}")
print(f"  Batch size:         {Config.BATCH_SIZE}")
print(f"  Phase 1 (frozen):   {Config.FREEZE_EPOCHS} epochs, head LR={Config.HEAD_LR}")
print(f"  Phase 2 (finetune): {Config.FINETUNE_EPOCHS} epochs, backbone LR={Config.BACKBONE_LR}, head LR={Config.FINETUNE_HEAD_LR}")
print(f"  Weight decay:       {Config.WEIGHT_DECAY}")
print(f"  Grad clip norm:     {Config.GRAD_CLIP_MAX_NORM}")
print(f"  Early stop:         patience={Config.PATIENCE}")
print(f"  Workers:            {Config.NUM_WORKERS}")
print(f"  Save directory:     {Config.SAVE_DIR}")
print(f"  Augmentation:       ENHANCED (exp02)")


# ============================================================
# DATA TRANSFORMS  —  ENHANCED AUGMENTATION  (inception_v3 → 299x299)
# ============================================================
# Compared with exp01:
#   + RandomVerticalFlip
#   + RandomRotation (±20°)
#   + RandomGrayscale
#   + RandomPerspective
#   + RandomErasing (after ToTensor)
#   + Wider ColorJitter range
# Val/test transforms are intentionally unchanged.
# ============================================================

def get_transforms():
    img_size = 299
    resize_size = 342

    train_transform = transforms.Compose([
        # Spatial augmentations
        transforms.RandomResizedCrop(img_size, scale=(0.5, 1.0), ratio=(0.75, 1.33)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomVerticalFlip(p=0.1),
        transforms.RandomRotation(degrees=20),
        transforms.RandomPerspective(distortion_scale=0.3, p=0.3),

        # Colour augmentations (wider than exp01 baseline)
        transforms.ColorJitter(brightness=0.4, contrast=0.4, saturation=0.3, hue=0.1),
        transforms.RandomGrayscale(p=0.05),

        # Convert to tensor and normalise
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225]),

        # Randomly erase a rectangular patch (simulates occlusion)
        transforms.RandomErasing(p=0.3, scale=(0.02, 0.15), ratio=(0.3, 3.3), value=0),
    ])

    val_transform = transforms.Compose([
        transforms.Resize(resize_size),
        transforms.CenterCrop(img_size),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225])
    ])

    return train_transform, val_transform


# ============================================================
# DATASET CLASS
# ============================================================

class BirdDataset(Dataset):
    def __init__(self, csv_file, image_path_col, label_col, transform=None):
        self.data = pd.read_csv(csv_file)
        self.image_path_col = image_path_col
        self.label_col = label_col
        self.transform = transform
        self.failed_count = 0

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        img_path = self.data.iloc[idx][self.image_path_col]
        label = int(self.data.iloc[idx][self.label_col])

        try:
            image = Image.open(img_path).convert('RGB')
        except Exception as e:
            self.failed_count += 1
            if self.failed_count <= 5:
                print(f"  Warning: Error loading {img_path}: {e}")
            image = Image.new('RGB', (299, 299), (128, 128, 128))

        if self.transform:
            image = self.transform(image)

        return image, label


# ============================================================
# MODEL DEFINITION  (inception_v3 only)
# ============================================================

def get_model(num_classes, pretrained=True):
    print(f"\n  Loading inception_v3 with pretrained weights...")
    model = models.inception_v3(weights='IMAGENET1K_V1' if pretrained else None)

    for param in model.parameters():
        param.requires_grad = False

    model.AuxLogits.fc = nn.Linear(model.AuxLogits.fc.in_features, num_classes)
    model.fc = nn.Linear(model.fc.in_features, num_classes)

    return model


def unfreeze_model(model):
    for param in model.parameters():
        param.requires_grad = True
    print(f"  All layers unfrozen for fine-tuning.")


def get_parameter_groups(model, backbone_lr, head_lr, weight_decay):
    head_params = list(model.fc.parameters()) + list(model.AuxLogits.fc.parameters())
    backbone_params = [p for name, p in model.named_parameters()
                       if not name.startswith('fc') and 'AuxLogits.fc' not in name]

    return [
        {'params': [p for p in backbone_params if p.requires_grad],
         'lr': backbone_lr, 'weight_decay': weight_decay},
        {'params': [p for p in head_params if p.requires_grad],
         'lr': head_lr, 'weight_decay': weight_decay},
    ]


def count_parameters(model):
    total = sum(p.numel() for p in model.parameters())
    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    return total, trainable


# ============================================================
# EARLY STOPPING
# ============================================================

class EarlyStopping:
    def __init__(self, patience=7, min_delta=0.001):
        self.patience = patience
        self.min_delta = min_delta
        self.counter = 0
        self.best_loss = None
        self.early_stop = False

    def __call__(self, val_loss):
        if self.best_loss is None:
            self.best_loss = val_loss
        elif val_loss > self.best_loss - self.min_delta:
            self.counter += 1
            print(f"    Early stopping counter: {self.counter}/{self.patience}")
            if self.counter >= self.patience:
                self.early_stop = True
        else:
            self.best_loss = val_loss
            self.counter = 0
        return self.early_stop


# ============================================================
# TRAINING FUNCTION (single phase)
# ============================================================

def train_phase(model, train_loader, val_loader, criterion,
                optimizer, scheduler, num_epochs, device, save_dir,
                phase_name, history, best_acc, best_epoch, start_time,
                early_stopping=None):

    print(f"\n{'=' * 70}")
    print(f"  {phase_name}: INCEPTION_V3 (Enhanced Augmentation)")
    print(f"{'=' * 70}")
    print(f"  Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    best_model_wts = copy.deepcopy(model.state_dict())

    for epoch in range(num_epochs):
        epoch_start = time.time()
        global_epoch = len(history['train_loss']) + 1

        print(f"\n  --- {phase_name} Epoch {epoch + 1}/{num_epochs} (Global: {global_epoch}) ---")

        # ========== TRAINING ==========
        model.train()
        running_loss = 0.0
        running_corrects = 0
        total_samples = 0

        train_pbar = tqdm(train_loader, desc="    Train",
                          bar_format='{l_bar}{bar:30}{r_bar}')

        for inputs, labels in train_pbar:
            inputs = inputs.to(device, non_blocking=True)
            labels = labels.to(device, non_blocking=True)

            optimizer.zero_grad()

            outputs, aux_outputs = model(inputs)
            loss1 = criterion(outputs, labels)
            loss2 = criterion(aux_outputs, labels)
            loss = loss1 + 0.4 * loss2

            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=Config.GRAD_CLIP_MAX_NORM)
            optimizer.step()

            _, preds = torch.max(outputs, 1)
            batch_size = inputs.size(0)
            running_loss += loss.item() * batch_size
            running_corrects += torch.sum(preds == labels.data).item()
            total_samples += batch_size

            train_pbar.set_postfix({
                'loss': f'{loss.item():.4f}',
                'acc': f'{running_corrects / total_samples:.3f}'
            })

        epoch_train_loss = running_loss / len(train_loader.dataset)
        epoch_train_acc = running_corrects / len(train_loader.dataset)

        # ========== VALIDATION ==========
        model.eval()
        running_loss = 0.0
        running_corrects = 0

        val_pbar = tqdm(val_loader, desc="    Val  ",
                        bar_format='{l_bar}{bar:30}{r_bar}')

        with torch.no_grad():
            for inputs, labels in val_pbar:
                inputs = inputs.to(device, non_blocking=True)
                labels = labels.to(device, non_blocking=True)

                outputs = model(inputs)
                loss = criterion(outputs, labels)

                _, preds = torch.max(outputs, 1)
                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data).item()

        epoch_val_loss = running_loss / len(val_loader.dataset)
        epoch_val_acc = running_corrects / len(val_loader.dataset)

        if isinstance(scheduler, optim.lr_scheduler.CosineAnnealingLR):
            scheduler.step()
        elif isinstance(scheduler, optim.lr_scheduler.ReduceLROnPlateau):
            scheduler.step(epoch_val_loss)

        current_lr = optimizer.param_groups[-1]['lr']
        backbone_lr_val = optimizer.param_groups[0]['lr'] if len(optimizer.param_groups) > 1 else current_lr

        history['train_loss'].append(epoch_train_loss)
        history['train_acc'].append(epoch_train_acc)
        history['val_loss'].append(epoch_val_loss)
        history['val_acc'].append(epoch_val_acc)
        history['lr'].append(current_lr)

        epoch_time = time.time() - epoch_start
        elapsed = time.time() - start_time

        print(f"    Train Loss: {epoch_train_loss:.4f} | Train Acc: {epoch_train_acc:.4f}")
        print(f"    Val Loss:   {epoch_val_loss:.4f} | Val Acc:   {epoch_val_acc:.4f}")
        print(f"    Head LR: {current_lr:.6f} | Backbone LR: {backbone_lr_val:.6f} | Time: {epoch_time / 60:.1f}m | Total: {elapsed / 60:.1f}m")

        if epoch_val_acc > best_acc:
            best_acc = epoch_val_acc
            best_epoch = global_epoch
            best_model_wts = copy.deepcopy(model.state_dict())

            checkpoint_path = os.path.join(save_dir, 'inception_v3_best.pth')
            torch.save({
                'epoch': global_epoch,
                'model_state_dict': model.state_dict(),
                'optimizer_state_dict': optimizer.state_dict(),
                'best_acc': best_acc,
                'history': history
            }, checkpoint_path)
            print(f"    >>> NEW BEST! Saved (acc: {best_acc:.4f})")

        if early_stopping is not None:
            if early_stopping(epoch_val_loss):
                print(f"\n  EARLY STOPPING at {phase_name} epoch {epoch + 1}")
                print(f"  Best accuracy: {best_acc:.4f} at global epoch {best_epoch}")
                break

    model.load_state_dict(best_model_wts)
    return model, history, best_acc, best_epoch


# ============================================================
# EVALUATION FUNCTION
# ============================================================

def evaluate_model(model, test_loader, device):
    print(f"\n  Evaluating on test set...")

    model.eval()
    model.to(device)

    all_preds = []
    all_labels = []
    all_probs = []

    with torch.no_grad():
        for inputs, labels in tqdm(test_loader, desc="    Test "):
            inputs = inputs.to(device, non_blocking=True)
            outputs = model(inputs)
            probs = torch.softmax(outputs, dim=1)
            _, preds = torch.max(outputs, 1)

            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.numpy())
            all_probs.extend(probs.cpu().numpy())

    all_preds = np.array(all_preds)
    all_labels = np.array(all_labels)
    all_probs = np.array(all_probs)

    from sklearn.metrics import (accuracy_score, precision_score,
                                 recall_score, f1_score,
                                 top_k_accuracy_score)

    accuracy = accuracy_score(all_labels, all_preds)
    precision = precision_score(all_labels, all_preds, average='weighted', zero_division=0)
    recall = recall_score(all_labels, all_preds, average='weighted', zero_division=0)
    f1 = f1_score(all_labels, all_preds, average='weighted', zero_division=0)
    top5_acc = top_k_accuracy_score(all_labels, all_probs, k=5)

    return {
        'accuracy': accuracy,
        'top5_accuracy': top5_acc,
        'precision': precision,
        'recall': recall,
        'f1_score': f1,
        'predictions': all_preds,
        'labels': all_labels,
        'probabilities': all_probs
    }


# ============================================================
# PLOTTING FUNCTIONS
# ============================================================

def plot_training_history(history, save_dir):
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    epochs = range(1, len(history['train_loss']) + 1)

    axes[0].plot(epochs, history['train_loss'], 'b-', label='Train Loss', linewidth=2)
    axes[0].plot(epochs, history['val_loss'], 'r-', label='Val Loss', linewidth=2)
    if Config.FREEZE_EPOCHS < len(history['train_loss']):
        axes[0].axvline(x=Config.FREEZE_EPOCHS + 0.5, color='green', linestyle='--',
                        alpha=0.7, label='Unfreeze point')
    axes[0].set_xlabel('Epoch')
    axes[0].set_ylabel('Loss')
    axes[0].set_title('INCEPTION_V3 (Enhanced Augmentation) - Loss', fontweight='bold')
    axes[0].legend()
    axes[0].grid(True, alpha=0.3)

    axes[1].plot(epochs, history['train_acc'], 'b-', label='Train Acc', linewidth=2)
    axes[1].plot(epochs, history['val_acc'], 'r-', label='Val Acc', linewidth=2)
    if Config.FREEZE_EPOCHS < len(history['train_loss']):
        axes[1].axvline(x=Config.FREEZE_EPOCHS + 0.5, color='green', linestyle='--',
                        alpha=0.7, label='Unfreeze point')
    axes[1].set_xlabel('Epoch')
    axes[1].set_ylabel('Accuracy')
    axes[1].set_title('INCEPTION_V3 (Enhanced Augmentation) - Accuracy', fontweight='bold')
    axes[1].legend()
    axes[1].grid(True, alpha=0.3)

    plt.tight_layout()
    save_path = os.path.join(save_dir, 'inception_v3_augmentation_training_history.png')
    plt.savefig(save_path, dpi=150, bbox_inches='tight')
    plt.close()
    print(f"  Training history saved: {save_path}")


def plot_confusion_matrix(labels, predictions, class_names, save_dir):
    from sklearn.metrics import confusion_matrix

    cm = confusion_matrix(labels, predictions)
    cm_normalized = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]

    plt.figure(figsize=(14, 12))
    plt.imshow(cm_normalized, interpolation='nearest', cmap='Blues')
    plt.title('Confusion Matrix - INCEPTION_V3 (Enhanced Augmentation)', fontsize=14, fontweight='bold')
    plt.colorbar(label='Proportion')

    tick_marks = np.arange(len(class_names))
    plt.xticks(tick_marks, class_names, rotation=90, fontsize=7)
    plt.yticks(tick_marks, class_names, fontsize=7)
    plt.xlabel('Predicted')
    plt.ylabel('True')

    plt.tight_layout()
    save_path = os.path.join(save_dir, 'inception_v3_augmentation_confusion_matrix.png')
    plt.savefig(save_path, dpi=150, bbox_inches='tight')
    plt.close()
    print(f"  Confusion matrix saved: {save_path}")


# ============================================================
# MAIN FUNCTION
# ============================================================

def main():
    model_name = Config.CURRENT_MODEL

    print("\n" + "#" * 70)
    print(f"#  EXP02 - INCEPTION V3 WITH ENHANCED AUGMENTATION")
    print("#" * 70)

    label_mapping_path = os.path.join(Config.BASE_PATH, 'label_mapping.csv')
    label_map_df = pd.read_csv(label_mapping_path)
    class_names = label_map_df.sort_values('label')['species'].tolist()
    print(f"\n  Number of classes: {len(class_names)}")

    train_df = pd.read_csv(Config.TRAIN_CSV)
    sample_paths = train_df[Config.IMAGE_PATH_COL].sample(3, random_state=42).tolist()
    print(f"\n  Quick path check:")
    for p in sample_paths:
        exists = os.path.exists(p)
        short = "..." + p[-50:] if len(p) > 50 else p
        print(f"    {'OK' if exists else 'MISSING'}: {short}")
        if not exists:
            print("\n  ERROR: Image paths don't exist! Check your CSV.")
            exit(1)

    train_transform, val_transform = get_transforms()

    print(f"\n  Creating datasets...")
    train_dataset = BirdDataset(Config.TRAIN_CSV, Config.IMAGE_PATH_COL, Config.LABEL_COL, transform=train_transform)
    val_dataset   = BirdDataset(Config.VAL_CSV,   Config.IMAGE_PATH_COL, Config.LABEL_COL, transform=val_transform)
    test_dataset  = BirdDataset(Config.TEST_CSV,  Config.IMAGE_PATH_COL, Config.LABEL_COL, transform=val_transform)

    print(f"    Train: {len(train_dataset):,} images")
    print(f"    Val:   {len(val_dataset):,} images")
    print(f"    Test:  {len(test_dataset):,} images")

    use_persistent = Config.NUM_WORKERS > 0

    train_loader = DataLoader(train_dataset, batch_size=Config.BATCH_SIZE, shuffle=True,
                              num_workers=Config.NUM_WORKERS, pin_memory=Config.PIN_MEMORY,
                              persistent_workers=use_persistent)
    val_loader   = DataLoader(val_dataset,   batch_size=Config.BATCH_SIZE, shuffle=False,
                              num_workers=Config.NUM_WORKERS, pin_memory=Config.PIN_MEMORY,
                              persistent_workers=use_persistent)
    test_loader  = DataLoader(test_dataset,  batch_size=Config.BATCH_SIZE, shuffle=False,
                              num_workers=Config.NUM_WORKERS, pin_memory=Config.PIN_MEMORY,
                              persistent_workers=use_persistent)

    model = get_model(Config.NUM_CLASSES, pretrained=True)
    model = model.to(device)

    total_params, trainable_params = count_parameters(model)
    print(f"\n  Total parameters:     {total_params:,}")
    print(f"  Trainable parameters: {trainable_params:,} (head only)")

    criterion = nn.CrossEntropyLoss()

    # ========================================================
    # PHASE 1: Train only the classifier head (backbone frozen)
    # ========================================================

    print("\n" + "=" * 70)
    print("  PHASE 1: TRAINING CLASSIFIER HEAD (backbone frozen)")
    print("=" * 70)

    head_params = [p for p in model.parameters() if p.requires_grad]
    optimizer_phase1 = optim.Adam(head_params, lr=Config.HEAD_LR, weight_decay=Config.WEIGHT_DECAY)
    scheduler_phase1 = optim.lr_scheduler.CosineAnnealingLR(
        optimizer_phase1, T_max=Config.FREEZE_EPOCHS, eta_min=Config.HEAD_LR * 0.1
    )

    history = {'train_loss': [], 'train_acc': [], 'val_loss': [], 'val_acc': [], 'lr': []}
    start_time = time.time()

    model, history, best_acc, best_epoch = train_phase(
        model=model, train_loader=train_loader, val_loader=val_loader,
        criterion=criterion, optimizer=optimizer_phase1, scheduler=scheduler_phase1,
        num_epochs=Config.FREEZE_EPOCHS, device=device, save_dir=Config.SAVE_DIR,
        phase_name="PHASE 1 (Frozen)", history=history,
        best_acc=0.0, best_epoch=0, start_time=start_time, early_stopping=None
    )

    phase1_time = time.time() - start_time
    print(f"\n  Phase 1 complete. Best val acc: {best_acc:.4f} at epoch {best_epoch}")
    print(f"  Phase 1 time: {phase1_time / 60:.1f} minutes")

    # ========================================================
    # PHASE 2: Fine-tune all layers with differential LR
    # ========================================================

    print("\n" + "=" * 70)
    print("  PHASE 2: FINE-TUNING ALL LAYERS (differential learning rates)")
    print("=" * 70)

    unfreeze_model(model)

    total_params2, trainable_params2 = count_parameters(model)
    print(f"  Trainable parameters: {trainable_params2:,} (all layers)")

    param_groups = get_parameter_groups(
        model, backbone_lr=Config.BACKBONE_LR,
        head_lr=Config.FINETUNE_HEAD_LR, weight_decay=Config.WEIGHT_DECAY
    )

    optimizer_phase2 = optim.Adam(param_groups)
    scheduler_phase2 = optim.lr_scheduler.CosineAnnealingLR(
        optimizer_phase2, T_max=Config.FINETUNE_EPOCHS, eta_min=Config.BACKBONE_LR * 0.1
    )

    early_stopping = EarlyStopping(patience=Config.PATIENCE, min_delta=Config.MIN_DELTA)

    model, history, best_acc, best_epoch = train_phase(
        model=model, train_loader=train_loader, val_loader=val_loader,
        criterion=criterion, optimizer=optimizer_phase2, scheduler=scheduler_phase2,
        num_epochs=Config.FINETUNE_EPOCHS, device=device, save_dir=Config.SAVE_DIR,
        phase_name="PHASE 2 (Fine-tune)", history=history,
        best_acc=best_acc, best_epoch=best_epoch, start_time=start_time,
        early_stopping=early_stopping
    )

    total_time = time.time() - start_time

    final_path = os.path.join(Config.SAVE_DIR, 'inception_v3_augmentation_final.pth')
    torch.save({
        'model_state_dict': model.state_dict(),
        'best_acc': best_acc,
        'history': history,
        'training_time': total_time,
        'label_smoothing': Config.LABEL_SMOOTHING,
        'augmentation': 'enhanced'
    }, final_path)

    print(f"\n  Training complete for INCEPTION_V3 (enhanced augmentation)")
    print(f"  Total time: {total_time / 60:.1f} minutes")
    print(f"  Best epoch: {best_epoch}, Best val acc: {best_acc:.4f}")

    test_metrics = evaluate_model(model, test_loader, device)

    print("\n" + "=" * 70)
    print("  FINAL RESULTS: INCEPTION_V3 (Enhanced Augmentation)")
    print("=" * 70)
    print(f"  Validation Accuracy:  {best_acc:.4f} ({best_acc * 100:.2f}%)")
    print(f"  Test Accuracy:        {test_metrics['accuracy']:.4f} ({test_metrics['accuracy'] * 100:.2f}%)")
    print(f"  Top-5 Accuracy:       {test_metrics['top5_accuracy']:.4f} ({test_metrics['top5_accuracy'] * 100:.2f}%)")
    print(f"  Precision:            {test_metrics['precision']:.4f}")
    print(f"  Recall:               {test_metrics['recall']:.4f}")
    print(f"  F1 Score:             {test_metrics['f1_score']:.4f}")
    print(f"  Training Time:        {total_time / 60:.1f} minutes")

    plot_training_history(history, Config.SAVE_DIR)
    plot_confusion_matrix(test_metrics['labels'], test_metrics['predictions'],
                          class_names, Config.SAVE_DIR)

    results = {
        'experiment': 'exp02_augmentation',
        'model': model_name,
        'label_smoothing': Config.LABEL_SMOOTHING,
        'augmentation': 'enhanced',
        'total_parameters': total_params2,
        'batch_size': Config.BATCH_SIZE,
        'freeze_epochs': Config.FREEZE_EPOCHS,
        'finetune_epochs': len(history['train_loss']) - Config.FREEZE_EPOCHS,
        'total_epochs': len(history['train_loss']),
        'head_lr': Config.HEAD_LR,
        'backbone_lr': Config.BACKBONE_LR,
        'val_accuracy': best_acc,
        'test_accuracy': test_metrics['accuracy'],
        'top5_accuracy': test_metrics['top5_accuracy'],
        'precision': test_metrics['precision'],
        'recall': test_metrics['recall'],
        'f1_score': test_metrics['f1_score'],
        'training_time_min': total_time / 60,
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }

    results_csv_path = os.path.join(Config.SAVE_DIR, 'exp02_results.csv')
    pd.DataFrame([results]).to_csv(results_csv_path, index=False)
    print(f"\n  Results saved to: {results_csv_path}")

    torch.cuda.empty_cache()

    print("\n" + "=" * 70)
    print("  DONE!")
    print("=" * 70)

    return model, history, test_metrics


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == '__main__':
    multiprocessing.freeze_support()
    model, history, metrics = main()


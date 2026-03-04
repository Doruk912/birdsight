# ============================================================
# EXP03: FINDING THE OPTIMAL FREEZE EPOCH COUNT
# Model: Inception V3
# Strategy: Run one full train-then-finetune trial per candidate
#            freeze epoch count. Each trial starts from fresh
#            pretrained weights so results are directly comparable.
# Candidates: FREEZE_EPOCH_CANDIDATES (see Config below)
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
    # ── Freeze-epoch candidates to evaluate ──────────────────
    # train head for N epochs, then fine-tune all layers
    FREEZE_EPOCH_CANDIDATES = [7, 9, 11, 13]

    # ── Fixed training settings ───────────────────────────────
    FINETUNE_EPOCHS = 20       # phase-2 budget (early-stop may cut it short)
    HEAD_LR         = 1e-3     # phase-1 learning rate
    BACKBONE_LR     = 1e-5     # phase-2 backbone lr
    FINETUNE_HEAD_LR= 1e-4     # phase-2 head lr
    WEIGHT_DECAY    = 1e-4
    GRAD_CLIP_MAX_NORM = 1.0
    BATCH_SIZE      = 16
    NUM_CLASSES     = 23

    # Early stopping (phase 2 only)
    PATIENCE  = 7
    MIN_DELTA = 0.001

    # ── Paths ─────────────────────────────────────────────────
    BASE_PATH = r"C:\Users\Doruk\OneDrive\Masaüstü\Graduation Project\Bird Dataset Processed"
    TRAIN_CSV = r"C:\Users\Doruk\OneDrive\Masaüstü\Graduation Project\Bird Dataset Processed\train.csv"
    VAL_CSV   = r"C:\Users\Doruk\OneDrive\Masaüstü\Graduation Project\Bird Dataset Processed\val.csv"
    TEST_CSV  = r"C:\Users\Doruk\OneDrive\Masaüstü\Graduation Project\Bird Dataset Processed\test.csv"
    SAVE_DIR  = r"C:\Users\Doruk\OneDrive\Masaüstü\Graduation Project\Bird Dataset Processed\models\exp03_freeze_epochs"

    # ── CSV column names ───────────────────────────────────────
    IMAGE_PATH_COL = 'image_path'
    LABEL_COL      = 'label'

    # ── Reproducibility ───────────────────────────────────────
    NUM_WORKERS = 4
    PIN_MEMORY  = True
    SEED        = 42


# Set seeds
torch.manual_seed(Config.SEED)
np.random.seed(Config.SEED)
if torch.cuda.is_available():
    torch.cuda.manual_seed(Config.SEED)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark     = False

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
    ('Val CSV',   Config.VAL_CSV),
    ('Test CSV',  Config.TEST_CSV),
]

all_paths_ok = True
for name, path in paths_to_check:
    exists = os.path.exists(path)
    print(f"  [{'OK' if exists else 'MISSING'}] {name}: {path}")
    if not exists:
        all_paths_ok = False

if not all_paths_ok:
    print("\nERROR: Some paths are missing!")
    exit(1)

print("\nAll paths verified!")


# ============================================================
# PRINT EXPERIMENT PLAN
# ============================================================

print("\n" + "=" * 70)
print("EXP03 — FREEZE EPOCH SEARCH PLAN")
print("=" * 70)
print(f"  Model:               INCEPTION_V3")
print(f"  Candidates:          {Config.FREEZE_EPOCH_CANDIDATES}")
print(f"  Fine-tune epochs:    up to {Config.FINETUNE_EPOCHS} (early stop patience={Config.PATIENCE})")
print(f"  Batch size:          {Config.BATCH_SIZE}")
print(f"  Phase-1 head LR:     {Config.HEAD_LR}")
print(f"  Phase-2 backbone LR: {Config.BACKBONE_LR}  |  head LR: {Config.FINETUNE_HEAD_LR}")
print(f"  Weight decay:        {Config.WEIGHT_DECAY}")
print(f"  Save directory:      {Config.SAVE_DIR}")
print(f"\n  Total trials: {len(Config.FREEZE_EPOCH_CANDIDATES)}")
print("=" * 70)


# ============================================================
# DATA TRANSFORMS  (inception_v3 → 299×299)
# ============================================================

def get_transforms():
    img_size    = 299
    resize_size = 342

    train_transform = transforms.Compose([
        transforms.RandomResizedCrop(img_size, scale=(0.7, 1.0), ratio=(0.85, 1.15)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.1, hue=0.05),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225])
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
# DATASET
# ============================================================

class BirdDataset(Dataset):
    def __init__(self, csv_file, image_path_col, label_col, transform=None):
        self.data          = pd.read_csv(csv_file)
        self.image_path_col = image_path_col
        self.label_col     = label_col
        self.transform     = transform
        self.failed_count  = 0

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        img_path = self.data.iloc[idx][self.image_path_col]
        label    = int(self.data.iloc[idx][self.label_col])

        try:
            image = Image.open(img_path).convert('RGB')
        except Exception as e:
            self.failed_count += 1
            if self.failed_count <= 5:
                print(f"  Warning: cannot load {img_path}: {e}")
            image = Image.new('RGB', (299, 299), (128, 128, 128))

        if self.transform:
            image = self.transform(image)

        return image, label


# ============================================================
# MODEL HELPERS
# ============================================================

def build_fresh_model(num_classes: int):
    """Return a fresh inception_v3 with frozen backbone and re-initialised heads."""
    model = models.inception_v3(weights='IMAGENET1K_V1')

    for param in model.parameters():
        param.requires_grad = False

    model.AuxLogits.fc = nn.Linear(model.AuxLogits.fc.in_features, num_classes)
    model.fc           = nn.Linear(model.fc.in_features,           num_classes)

    return model


def unfreeze_all(model):
    for param in model.parameters():
        param.requires_grad = True


def differential_param_groups(model, backbone_lr, head_lr, weight_decay):
    head_params     = list(model.fc.parameters()) + list(model.AuxLogits.fc.parameters())
    backbone_params = [p for name, p in model.named_parameters()
                       if not name.startswith('fc') and 'AuxLogits.fc' not in name]
    return [
        {'params': [p for p in backbone_params if p.requires_grad],
         'lr': backbone_lr, 'weight_decay': weight_decay},
        {'params': [p for p in head_params if p.requires_grad],
         'lr': head_lr,     'weight_decay': weight_decay},
    ]


def count_params(model):
    total     = sum(p.numel() for p in model.parameters())
    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    return total, trainable


# ============================================================
# EARLY STOPPING
# ============================================================

class EarlyStopping:
    def __init__(self, patience=7, min_delta=0.001):
        self.patience   = patience
        self.min_delta  = min_delta
        self.counter    = 0
        self.best_loss  = None
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
            self.counter   = 0
        return self.early_stop


# ============================================================
# CORE TRAINING LOOP  (one epoch step)
# ============================================================

def run_epoch(model, loader, criterion, optimizer, is_train, device):
    """Run one full epoch. Returns (avg_loss, accuracy)."""
    if is_train:
        model.train()
    else:
        model.eval()

    running_loss     = 0.0
    running_corrects = 0
    total_samples    = 0

    desc = "    Train" if is_train else "    Val  "
    pbar = tqdm(loader, desc=desc, bar_format='{l_bar}{bar:30}{r_bar}')

    ctx = torch.enable_grad() if is_train else torch.no_grad()
    with ctx:
        for inputs, labels in pbar:
            inputs = inputs.to(device, non_blocking=True)
            labels = labels.to(device, non_blocking=True)

            if is_train:
                optimizer.zero_grad()

            if is_train and model.training:
                # inception_v3 returns (main, aux) during training
                outputs, aux_outputs = model(inputs)
                loss = criterion(outputs, labels) + 0.4 * criterion(aux_outputs, labels)
            else:
                outputs = model(inputs)
                loss    = criterion(outputs, labels)

            if is_train:
                loss.backward()
                torch.nn.utils.clip_grad_norm_(model.parameters(),
                                               max_norm=Config.GRAD_CLIP_MAX_NORM)
                optimizer.step()

            _, preds     = torch.max(outputs, 1)
            batch_size    = inputs.size(0)
            running_loss += loss.item() * batch_size
            running_corrects += torch.sum(preds == labels.data).item()
            total_samples    += batch_size

            pbar.set_postfix({
                'loss': f'{loss.item():.4f}',
                'acc' : f'{running_corrects / total_samples:.3f}'
            })

    avg_loss = running_loss / len(loader.dataset)
    accuracy = running_corrects / len(loader.dataset)
    return avg_loss, accuracy


# ============================================================
# SINGLE TRIAL  (one freeze-epoch count)
# ============================================================

def run_trial(freeze_epochs: int,
              train_loader, val_loader,
              criterion, trial_save_dir: str) -> dict:
    """
    Run one complete two-phase training trial for `freeze_epochs`.
    Returns a dict with best val_acc, per-epoch history, and timing.
    """

    print(f"\n{'#' * 70}")
    print(f"#  TRIAL: freeze_epochs = {freeze_epochs}")
    print(f"{'#' * 70}")

    os.makedirs(trial_save_dir, exist_ok=True)
    start_time = time.time()

    # ── Fresh model every trial ───────────────────────────────
    torch.manual_seed(Config.SEED)
    if torch.cuda.is_available():
        torch.cuda.manual_seed(Config.SEED)

    model = build_fresh_model(Config.NUM_CLASSES).to(device)
    _, trainable = count_params(model)
    print(f"  Trainable params (head only): {trainable:,}")

    history = {
        'train_loss': [], 'train_acc': [],
        'val_loss':   [], 'val_acc':   [],
        'phase': []          # 1 = frozen, 2 = fine-tune
    }

    best_val_acc   = 0.0
    best_epoch_num = 0
    best_weights   = copy.deepcopy(model.state_dict())

    # ── PHASE 1: head warm-up (skip if freeze_epochs == 0) ───
    if freeze_epochs > 0:
        print(f"\n  ── Phase 1: head warm-up for {freeze_epochs} epoch(s) ──")

        head_params_p1   = [p for p in model.parameters() if p.requires_grad]
        optimizer_p1     = optim.Adam(head_params_p1,
                                      lr=Config.HEAD_LR,
                                      weight_decay=Config.WEIGHT_DECAY)
        scheduler_p1     = optim.lr_scheduler.CosineAnnealingLR(
            optimizer_p1, T_max=freeze_epochs,
            eta_min=Config.HEAD_LR * 0.1
        )

        for epoch in range(freeze_epochs):
            global_ep = len(history['train_loss']) + 1
            print(f"\n  [P1] Epoch {epoch + 1}/{freeze_epochs}  (global {global_ep})")

            tr_loss, tr_acc = run_epoch(model, train_loader, criterion,
                                        optimizer_p1, is_train=True, device=device)
            vl_loss, vl_acc = run_epoch(model, val_loader, criterion,
                                        optimizer_p1, is_train=False, device=device)
            scheduler_p1.step()

            history['train_loss'].append(tr_loss)
            history['train_acc'].append(tr_acc)
            history['val_loss'].append(vl_loss)
            history['val_acc'].append(vl_acc)
            history['phase'].append(1)

            elapsed = time.time() - start_time
            print(f"    Train: loss={tr_loss:.4f}  acc={tr_acc:.4f} | "
                  f"Val: loss={vl_loss:.4f}  acc={vl_acc:.4f} | "
                  f"Elapsed: {elapsed / 60:.1f}m")

            if vl_acc > best_val_acc:
                best_val_acc   = vl_acc
                best_epoch_num = global_ep
                best_weights   = copy.deepcopy(model.state_dict())
                print(f"    >>> NEW BEST (phase 1): {best_val_acc:.4f}")

        print(f"\n  Phase 1 done. Best val acc so far: {best_val_acc:.4f}")

    else:
        print("\n  freeze_epochs=0 → skipping phase 1 entirely.")

    # ── PHASE 2: fine-tune all layers ─────────────────────────
    print(f"\n  ── Phase 2: fine-tuning all layers (up to {Config.FINETUNE_EPOCHS} epochs) ──")

    unfreeze_all(model)
    _, trainable_all = count_params(model)
    print(f"  Trainable params (all layers): {trainable_all:,}")

    param_groups  = differential_param_groups(
        model,
        backbone_lr  = Config.BACKBONE_LR,
        head_lr      = Config.FINETUNE_HEAD_LR,
        weight_decay = Config.WEIGHT_DECAY
    )
    optimizer_p2  = optim.Adam(param_groups)
    scheduler_p2  = optim.lr_scheduler.CosineAnnealingLR(
        optimizer_p2, T_max=Config.FINETUNE_EPOCHS,
        eta_min=Config.BACKBONE_LR * 0.1
    )
    early_stop    = EarlyStopping(patience=Config.PATIENCE, min_delta=Config.MIN_DELTA)

    for epoch in range(Config.FINETUNE_EPOCHS):
        global_ep = len(history['train_loss']) + 1
        print(f"\n  [P2] Epoch {epoch + 1}/{Config.FINETUNE_EPOCHS}  (global {global_ep})")

        tr_loss, tr_acc = run_epoch(model, train_loader, criterion,
                                    optimizer_p2, is_train=True, device=device)
        vl_loss, vl_acc = run_epoch(model, val_loader, criterion,
                                    optimizer_p2, is_train=False, device=device)
        scheduler_p2.step()

        history['train_loss'].append(tr_loss)
        history['train_acc'].append(tr_acc)
        history['val_loss'].append(vl_loss)
        history['val_acc'].append(vl_acc)
        history['phase'].append(2)

        current_lr   = optimizer_p2.param_groups[-1]['lr']
        backbone_lr_ = optimizer_p2.param_groups[0]['lr']
        elapsed      = time.time() - start_time
        print(f"    Train: loss={tr_loss:.4f}  acc={tr_acc:.4f} | "
              f"Val: loss={vl_loss:.4f}  acc={vl_acc:.4f} | "
              f"Head LR={current_lr:.6f}  Backbone LR={backbone_lr_:.6f} | "
              f"Elapsed: {elapsed / 60:.1f}m")

        if vl_acc > best_val_acc:
            best_val_acc   = vl_acc
            best_epoch_num = global_ep
            best_weights   = copy.deepcopy(model.state_dict())

            ckpt_path = os.path.join(trial_save_dir, 'best.pth')
            torch.save({
                'freeze_epochs':     freeze_epochs,
                'epoch':             global_ep,
                'model_state_dict':  model.state_dict(),
                'best_val_acc':      best_val_acc,
            }, ckpt_path)
            print(f"    >>> NEW BEST (phase 2): {best_val_acc:.4f}  — saved.")

        if early_stop(vl_loss):
            print(f"\n  Early stopping triggered at phase-2 epoch {epoch + 1}.")
            break

    total_time = time.time() - start_time

    # Restore best weights before returning
    model.load_state_dict(best_weights)
    torch.cuda.empty_cache()

    result = {
        'freeze_epochs':    freeze_epochs,
        'best_val_acc':     best_val_acc,
        'best_epoch':       best_epoch_num,
        'total_epochs':     len(history['train_loss']),
        'phase2_epochs':    sum(1 for p in history['phase'] if p == 2),
        'training_time_min': total_time / 60,
        'history':          history,
        'model':            model,
    }

    print(f"\n  Trial complete — freeze_epochs={freeze_epochs} | "
          f"best_val_acc={best_val_acc:.4f} | "
          f"time={total_time / 60:.1f}m")

    return result


# ============================================================
# PER-TRIAL PLOT
# ============================================================

def plot_trial_history(history: dict, freeze_epochs: int, save_dir: str):
    """Loss + accuracy curves for a single trial, with phase boundary."""
    epochs = range(1, len(history['train_loss']) + 1)

    fig, axes = plt.subplots(1, 2, figsize=(14, 5))

    axes[0].plot(epochs, history['train_loss'], 'b-', label='Train Loss', linewidth=2)
    axes[0].plot(epochs, history['val_loss'],   'r-', label='Val Loss',   linewidth=2)
    if freeze_epochs > 0 and freeze_epochs < len(history['train_loss']):
        axes[0].axvline(x=freeze_epochs + 0.5, color='green', linestyle='--',
                        alpha=0.7, label='Unfreeze point')
    axes[0].set_xlabel('Epoch')
    axes[0].set_ylabel('Loss')
    axes[0].set_title(f'Freeze={freeze_epochs} — Loss', fontweight='bold')
    axes[0].legend(); axes[0].grid(True, alpha=0.3)

    axes[1].plot(epochs, history['train_acc'], 'b-', label='Train Acc', linewidth=2)
    axes[1].plot(epochs, history['val_acc'],   'r-', label='Val Acc',   linewidth=2)
    if freeze_epochs > 0 and freeze_epochs < len(history['train_loss']):
        axes[1].axvline(x=freeze_epochs + 0.5, color='green', linestyle='--',
                        alpha=0.7, label='Unfreeze point')
    axes[1].set_xlabel('Epoch')
    axes[1].set_ylabel('Accuracy')
    axes[1].set_title(f'Freeze={freeze_epochs} — Accuracy', fontweight='bold')
    axes[1].legend(); axes[1].grid(True, alpha=0.3)

    plt.tight_layout()
    save_path = os.path.join(save_dir, f'freeze_{freeze_epochs}_history.png')
    plt.savefig(save_path, dpi=150, bbox_inches='tight')
    plt.close()
    print(f"  History plot saved: {save_path}")


# ============================================================
# SUMMARY PLOT  (all candidates on one figure)
# ============================================================

def plot_summary(all_results: list, save_dir: str):
    """
    Two-panel summary:
      Left  — val accuracy curves for all trials overlaid
      Right — bar chart of best val accuracy per freeze-epoch count
    """
    fig, axes = plt.subplots(1, 2, figsize=(16, 6))

    colours = plt.cm.tab10(np.linspace(0, 1, len(all_results)))

    # ── Left: val accuracy curves ─────────────────────────────
    for res, col in zip(all_results, colours):
        fe      = res['freeze_epochs']
        val_acc = res['history']['val_acc']
        epochs  = range(1, len(val_acc) + 1)
        axes[0].plot(epochs, val_acc, linewidth=2, color=col,
                     label=f'freeze={fe}  (best={res["best_val_acc"]:.4f})')

    axes[0].set_xlabel('Epoch')
    axes[0].set_ylabel('Validation Accuracy')
    axes[0].set_title('Val Accuracy per Freeze-Epoch Count', fontweight='bold')
    axes[0].legend(fontsize=8)
    axes[0].grid(True, alpha=0.3)

    # ── Right: best val accuracy bar chart ────────────────────
    freeze_labels = [str(r['freeze_epochs']) for r in all_results]
    best_accs     = [r['best_val_acc']       for r in all_results]
    bar_colours   = [col for col in colours]

    bars = axes[1].bar(freeze_labels, best_accs, color=bar_colours, edgecolor='black',
                       linewidth=0.8, alpha=0.85)
    axes[1].set_xlabel('Freeze Epochs (Phase 1)')
    axes[1].set_ylabel('Best Validation Accuracy')
    axes[1].set_title('Best Val Accuracy vs Freeze Epochs', fontweight='bold')
    axes[1].set_ylim(max(0, min(best_accs) - 0.05), min(1.0, max(best_accs) + 0.05))
    axes[1].grid(True, axis='y', alpha=0.3)

    # Annotate bars with accuracy values
    for bar, acc in zip(bars, best_accs):
        axes[1].text(bar.get_x() + bar.get_width() / 2,
                     bar.get_height() + 0.002,
                     f'{acc:.4f}', ha='center', va='bottom',
                     fontsize=9, fontweight='bold')

    # Highlight the best candidate
    best_idx = int(np.argmax(best_accs))
    bars[best_idx].set_edgecolor('gold')
    bars[best_idx].set_linewidth(3)

    plt.tight_layout()
    save_path = os.path.join(save_dir, 'exp03_freeze_epoch_summary.png')
    plt.savefig(save_path, dpi=150, bbox_inches='tight')
    plt.close()
    print(f"\n  Summary plot saved: {save_path}")


# ============================================================
# MAIN
# ============================================================

def main():
    print("\n" + "#" * 70)
    print("#  EXP03 — OPTIMAL FREEZE EPOCH SEARCH  (Inception V3)")
    print("#" * 70)

    # ── Quick image-path sanity check ─────────────────────────
    train_df     = pd.read_csv(Config.TRAIN_CSV)
    sample_paths = train_df[Config.IMAGE_PATH_COL].sample(3, random_state=42).tolist()
    print(f"\n  Quick path check:")
    for p in sample_paths:
        exists = os.path.exists(p)
        short  = "..." + p[-50:] if len(p) > 50 else p
        print(f"    {'OK' if exists else 'MISSING'}: {short}")
        if not exists:
            print("\n  ERROR: Image paths don't exist! Check your CSV.")
            exit(1)

    # ── Datasets & loaders (shared across all trials) ─────────
    train_transform, val_transform = get_transforms()

    train_dataset = BirdDataset(Config.TRAIN_CSV, Config.IMAGE_PATH_COL,
                                Config.LABEL_COL, transform=train_transform)
    val_dataset   = BirdDataset(Config.VAL_CSV,   Config.IMAGE_PATH_COL,
                                Config.LABEL_COL, transform=val_transform)

    print(f"\n  Train: {len(train_dataset):,} images | Val: {len(val_dataset):,} images")

    use_persistent = Config.NUM_WORKERS > 0
    train_loader = DataLoader(train_dataset, batch_size=Config.BATCH_SIZE, shuffle=True,
                              num_workers=Config.NUM_WORKERS, pin_memory=Config.PIN_MEMORY,
                              persistent_workers=use_persistent)
    val_loader   = DataLoader(val_dataset,   batch_size=Config.BATCH_SIZE, shuffle=False,
                              num_workers=Config.NUM_WORKERS, pin_memory=Config.PIN_MEMORY,
                              persistent_workers=use_persistent)

    # Loss (standard — same as base script)
    criterion = nn.CrossEntropyLoss()

    # ── Run one trial per candidate ───────────────────────────
    experiment_start = time.time()
    all_results      = []

    for freeze_epochs in Config.FREEZE_EPOCH_CANDIDATES:
        trial_dir = os.path.join(Config.SAVE_DIR, f'freeze_{freeze_epochs}')
        result    = run_trial(
            freeze_epochs  = freeze_epochs,
            train_loader   = train_loader,
            val_loader     = val_loader,
            criterion      = criterion,
            trial_save_dir = trial_dir,
        )
        all_results.append(result)

        # Per-trial plot
        plot_trial_history(result['history'], freeze_epochs, trial_dir)

        # Flush GPU memory between trials
        del result['model']
        torch.cuda.empty_cache()

    total_experiment_time = time.time() - experiment_start

    # ── Compile results table ─────────────────────────────────
    rows = []
    for r in all_results:
        rows.append({
            'freeze_epochs':      r['freeze_epochs'],
            'best_val_acc':       r['best_val_acc'],
            'best_epoch':         r['best_epoch'],
            'total_epochs':       r['total_epochs'],
            'phase2_epochs_used': r['phase2_epochs'],
            'training_time_min':  round(r['training_time_min'], 2),
        })

    results_df = pd.DataFrame(rows).sort_values('best_val_acc', ascending=False)

    csv_path = os.path.join(Config.SAVE_DIR, 'exp03_results.csv')
    results_df.to_csv(csv_path, index=False)

    # ── Summary plot ──────────────────────────────────────────
    plot_summary(all_results, Config.SAVE_DIR)

    # ── Print leaderboard ─────────────────────────────────────
    best_row       = results_df.iloc[0]
    optimal_freeze = int(best_row['freeze_epochs'])

    print("\n" + "=" * 70)
    print("  EXP03 — RESULTS LEADERBOARD")
    print("=" * 70)
    print(f"  {'Freeze Epochs':<16} {'Best Val Acc':<16} {'Total Epochs':<14} "
          f"{'Phase-2 Used':<14} {'Time (min)'}")
    print("  " + "-" * 68)
    for _, row in results_df.iterrows():
        marker = "  ◀ BEST" if int(row['freeze_epochs']) == optimal_freeze else ""
        print(f"  {int(row['freeze_epochs']):<16} {row['best_val_acc']:.4f}{'':10} "
              f"{int(row['total_epochs']):<14} {int(row['phase2_epochs_used']):<14} "
              f"{row['training_time_min']:.1f}{marker}")

    print("\n" + "=" * 70)
    print(f"  CONCLUSION: optimal freeze_epochs = {optimal_freeze}")
    print(f"  Best val accuracy achieved:         {best_row['best_val_acc']:.4f} "
          f"({best_row['best_val_acc'] * 100:.2f}%)")
    print(f"  Total experiment time:              {total_experiment_time / 60:.1f} minutes")
    print(f"  Results CSV:                        {csv_path}")
    print("=" * 70)

    return results_df, all_results


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == '__main__':
    multiprocessing.freeze_support()
    results_df, all_results = main()


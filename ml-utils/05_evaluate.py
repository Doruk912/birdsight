# ============================================================
# BIRD SPECIES CLASSIFICATION - DETAILED EVALUATION
# ============================================================

import os
import multiprocessing
import warnings
warnings.filterwarnings('ignore')

import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from datetime import datetime
from tqdm import tqdm

import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms, models
from PIL import Image

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    top_k_accuracy_score,
    confusion_matrix,
    classification_report,
    roc_curve,
    auc,
    roc_auc_score,
    average_precision_score,
)
from sklearn.preprocessing import label_binarize

# ============================================================
# CONFIGURATION
# ============================================================

class Config:
    BASE_PATH    = r"C:\Users\Doruk\OneDrive\Masaüstü\Graduation Project\Bird Dataset Processed"
    TEST_CSV     = r"C:\Users\Doruk\OneDrive\Masaüstü\Graduation Project\Bird Dataset Processed\test.csv"
    MODELS_DIR   = r"C:\Users\Doruk\OneDrive\Masaüstü\Graduation Project\models"
    OUTPUT_DIR   = r"C:\Users\Doruk\OneDrive\Masaüstü\Graduation Project\evaluation"

    LABEL_MAP    = r"C:\Users\Doruk\OneDrive\Masaüstü\Graduation Project\Bird Dataset Processed\label_mapping.csv"

    IMAGE_PATH_COL = 'image_path'
    LABEL_COL      = 'label'

    NUM_CLASSES  = 23
    BATCH_SIZE   = 32
    NUM_WORKERS  = 4
    PIN_MEMORY   = True
    SEED         = 42


# ============================================================
# DEVICE
# ============================================================

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"\nUsing device: {device}")
if torch.cuda.is_available():
    print(f"GPU: {torch.cuda.get_device_name(0)}")


# ============================================================
# DATASET
# ============================================================

class BirdDataset(Dataset):
    """Lightweight dataset for evaluation – no augmentation."""

    def __init__(self, csv_file, image_path_col, label_col, transform=None):
        self.data = pd.read_csv(csv_file)
        self.image_path_col = image_path_col
        self.label_col      = label_col
        self.transform      = transform

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        img_path = self.data.iloc[idx][self.image_path_col]
        label    = int(self.data.iloc[idx][self.label_col])
        try:
            image = Image.open(img_path).convert('RGB')
        except Exception:
            image = Image.new('RGB', (224, 224), (128, 128, 128))
        if self.transform:
            image = self.transform(image)
        return image, label


# ============================================================
# TRANSFORMS
# ============================================================

def get_val_transform(model_name: str):
    if model_name == 'inception_v3':
        return transforms.Compose([
            transforms.Resize(342),
            transforms.CenterCrop(299),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406],
                                  [0.229, 0.224, 0.225]),
        ])
    return transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406],
                              [0.229, 0.224, 0.225]),
    ])


# ============================================================
# MODEL LOADER
# ============================================================

def load_model(model_name: str, model_path: str, num_classes: int):
    """
    Rebuild the model architecture and load saved weights.
    Supports: mobilenet_v2, resnet50, densenet121, inception_v3, vgg16
    """
    if model_name == 'mobilenet_v2':
        model = models.mobilenet_v2(weights=None)
        model.classifier[1] = nn.Linear(model.classifier[1].in_features, num_classes)

    elif model_name == 'resnet50':
        model = models.resnet50(weights=None)
        model.fc = nn.Linear(model.fc.in_features, num_classes)

    elif model_name == 'densenet121':
        model = models.densenet121(weights=None)
        model.classifier = nn.Linear(model.classifier.in_features, num_classes)

    elif model_name == 'inception_v3':
        model = models.inception_v3(weights=None, aux_logits=True, transform_input=True)
        model.AuxLogits.fc = nn.Linear(model.AuxLogits.fc.in_features, num_classes)
        model.fc = nn.Linear(model.fc.in_features, num_classes)

    elif model_name == 'vgg16':
        model = models.vgg16(weights=None)
        model.classifier = nn.Sequential(
            nn.Linear(25088, 4096), nn.ReLU(inplace=True), nn.Dropout(0.5),
            nn.Linear(4096, 512),  nn.ReLU(inplace=True), nn.Dropout(0.3),
            nn.Linear(512, num_classes)
        )

    else:
        raise ValueError(f"Unknown model: {model_name}. "
                         "Supported: mobilenet_v2, resnet50, densenet121, inception_v3, vgg16")

    checkpoint = torch.load(model_path, map_location=device)
    state_dict = checkpoint.get('model_state_dict', checkpoint)
    model.load_state_dict(state_dict)
    model.to(device)
    model.eval()
    best_acc = checkpoint.get('best_acc', None)
    print(f"  Loaded {model_name} from {model_path}")
    if best_acc is not None:
        print(f"  Checkpoint best val acc: {best_acc:.4f}")
    return model


# ============================================================
# INFERENCE
# ============================================================

def run_inference(model, model_name: str, data_loader, num_classes: int):
    """Run model over the full data loader and collect predictions/probs/labels."""
    model.eval()
    all_preds  = []
    all_labels = []
    all_probs  = []

    with torch.no_grad():
        for inputs, labels in tqdm(data_loader, desc=f"    Inference [{model_name}]"):
            inputs = inputs.to(device, non_blocking=True)
            outputs = model(inputs)
            probs = torch.softmax(outputs, dim=1)
            _, preds = torch.max(outputs, 1)

            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.numpy())
            all_probs.extend(probs.cpu().numpy())

    return (np.array(all_labels),
            np.array(all_preds),
            np.array(all_probs))


# ============================================================
# METRICS
# ============================================================

def compute_metrics(labels, preds, probs, class_names):
    """Compute a comprehensive set of metrics."""
    num_classes = len(class_names)
    classes     = list(range(num_classes))

    accuracy     = accuracy_score(labels, preds)
    precision_w  = precision_score(labels, preds, average='weighted', zero_division=0)
    recall_w     = recall_score(labels, preds, average='weighted', zero_division=0)
    f1_w         = f1_score(labels, preds, average='weighted', zero_division=0)
    precision_m  = precision_score(labels, preds, average='macro', zero_division=0)
    recall_m     = recall_score(labels, preds, average='macro', zero_division=0)
    f1_m         = f1_score(labels, preds, average='macro', zero_division=0)
    top3_acc     = top_k_accuracy_score(labels, probs, k=3)
    top5_acc     = top_k_accuracy_score(labels, probs, k=5) if num_classes >= 5 else None

    # Per-class metrics
    per_class_precision = precision_score(labels, preds, average=None, zero_division=0, labels=classes)
    per_class_recall    = recall_score(labels, preds, average=None, zero_division=0, labels=classes)
    per_class_f1        = f1_score(labels, preds, average=None, zero_division=0, labels=classes)

    # Per-class accuracy
    cm = confusion_matrix(labels, preds, labels=classes)

    # Top-3-aware confusion matrix:
    # if true class is in top-3 predictions -> count as correct (diagonal),
    # otherwise assign to top-1 predicted class.
    top_k = min(3, num_classes)
    top3_idx = np.argsort(probs, axis=1)[:, -top_k:][:, ::-1]
    top3_effective_preds = np.where(
        (top3_idx == labels[:, None]).any(axis=1),
        labels,
        top3_idx[:, 0],
    )
    cm_top3 = confusion_matrix(labels, top3_effective_preds, labels=classes)

    per_class_acc = cm.diagonal() / cm.sum(axis=1).clip(min=1)

    # Sample counts
    per_class_support = cm.sum(axis=1)

    # Macro ROC-AUC (OvR)
    labels_bin = label_binarize(labels, classes=classes)
    try:
        roc_auc_macro = roc_auc_score(labels_bin, probs, average='macro', multi_class='ovr')
    except Exception:
        roc_auc_macro = None

    # Mean Average Precision
    try:
        map_score = average_precision_score(labels_bin, probs, average='macro')
    except Exception:
        map_score = None

    per_class_df = pd.DataFrame({
        'class':     class_names,
        'accuracy':  per_class_acc,
        'precision': per_class_precision,
        'recall':    per_class_recall,
        'f1':        per_class_f1,
        'support':   per_class_support.astype(int),
    })

    return {
        'accuracy':         accuracy,
        'top3_accuracy':    top3_acc,
        'top5_accuracy':    top5_acc,
        'precision_w':      precision_w,
        'recall_w':         recall_w,
        'f1_w':             f1_w,
        'precision_m':      precision_m,
        'recall_m':         recall_m,
        'f1_m':             f1_m,
        'roc_auc_macro':    roc_auc_macro,
        'map_score':        map_score,
        'confusion_matrix': cm,
        'confusion_matrix_top3': cm_top3,
        'per_class':        per_class_df,
        'labels_bin':       labels_bin,
        'class_report':     classification_report(labels, preds,
                                                   target_names=class_names,
                                                   zero_division=0),
    }


# ============================================================
# PLOTTING HELPERS
# ============================================================

def _save(fig, path):
    fig.savefig(path, dpi=150, bbox_inches='tight')
    plt.close(fig)
    print(f"    Saved: {path}")


def plot_confusion_matrix(cm, class_names, model_name, save_dir, normalize=True):
    """
    Full annotated confusion matrix.
    Cells are coloured by row-normalised proportion;
    each cell shows  count  (top) and  % (bottom).
    """
    n = len(class_names)
    cm_norm = cm.astype('float') / cm.sum(axis=1, keepdims=True).clip(min=1)

    cell_w = max(0.55, 12 / n)
    fig_size = float(max(14, n * cell_w))
    fig, ax = plt.subplots(figsize=(fig_size, fig_size * 0.88))

    im = ax.imshow(cm_norm, interpolation='nearest', cmap='Blues', vmin=0, vmax=1)
    cbar = fig.colorbar(im, ax=ax, fraction=0.046, pad=0.04)
    cbar.set_label('Row-normalised proportion', fontsize=11)

    tick_marks = np.arange(n)
    ax.set_xticks(tick_marks)
    ax.set_yticks(tick_marks)
    ax.set_xticklabels(class_names, rotation=90, fontsize=max(5, 9 - n // 8))
    ax.set_yticklabels(class_names, fontsize=max(5, 9 - n // 8))

    # Annotate each cell with count and %
    threshold = 0.5
    for i in range(n):
        for j in range(n):
            count = cm[i, j]
            pct   = cm_norm[i, j] * 100
            color = 'white' if cm_norm[i, j] > threshold else 'black'
            if count > 0:
                ax.text(j, i, f'{count}\n({pct:.0f}%)',
                        ha='center', va='center',
                        fontsize=max(4, 7 - n // 8),
                        color=color, fontweight='bold' if i == j else 'normal')

    ax.set_xlabel('Predicted Label', fontsize=13, labelpad=10)
    ax.set_ylabel('True Label', fontsize=13, labelpad=10)
    ax.set_title(f'Confusion Matrix — {model_name.upper()}', fontsize=14, fontweight='bold', pad=14)

    plt.tight_layout()
    _save(fig, os.path.join(save_dir, f'{model_name}_confusion_matrix.png'))


def plot_top3_confusion_matrix(cm_top3, class_names, model_name, save_dir, normalize=True):
    """
    Top-3-aware confusion matrix.
    A sample is counted as correct (diagonal) if true class is in top-3.
    Otherwise it is assigned to the top-1 predicted class.
    """
    n = len(class_names)
    cm_norm = cm_top3.astype('float') / cm_top3.sum(axis=1, keepdims=True).clip(min=1)

    cell_w = max(0.55, 12 / n)
    fig_size = float(max(14, n * cell_w))
    fig, ax = plt.subplots(figsize=(fig_size, fig_size * 0.88))

    im = ax.imshow(cm_norm, interpolation='nearest', cmap='Purples', vmin=0, vmax=1)
    cbar = fig.colorbar(im, ax=ax, fraction=0.046, pad=0.04)
    cbar.set_label('Row-normalised proportion', fontsize=11)

    tick_marks = np.arange(n)
    ax.set_xticks(tick_marks)
    ax.set_yticks(tick_marks)
    ax.set_xticklabels(class_names, rotation=90, fontsize=max(5, 9 - n // 8))
    ax.set_yticklabels(class_names, fontsize=max(5, 9 - n // 8))

    threshold = 0.5
    for i in range(n):
        for j in range(n):
            count = cm_top3[i, j]
            pct = cm_norm[i, j] * 100
            color = 'white' if cm_norm[i, j] > threshold else 'black'
            if count > 0:
                ax.text(j, i, f'{count}\n({pct:.0f}%)',
                        ha='center', va='center',
                        fontsize=max(4, 7 - n // 8),
                        color=color, fontweight='bold' if i == j else 'normal')

    ax.set_xlabel('Effective Predicted Label (Top-3 rule)', fontsize=13, labelpad=10)
    ax.set_ylabel('True Label', fontsize=13, labelpad=10)
    ax.set_title(f'Top-3 Confusion Matrix — {model_name.upper()}', fontsize=14, fontweight='bold', pad=14)

    plt.tight_layout()
    _save(fig, os.path.join(save_dir, f'{model_name}_top3_confusion_matrix.png'))


def plot_per_class_metrics(per_class_df, model_name, save_dir):
    """Horizontal bar chart for per-class F1 / Precision / Recall / Accuracy."""
    df = per_class_df.sort_values('f1', ascending=True)
    n  = len(df)
    bar_h = max(0.25, 8 / n)
    fig_h = float(max(8, n * bar_h * 4.5))

    fig, axes = plt.subplots(1, 4, figsize=(20, fig_h), sharey=True)
    metrics_cols = [('accuracy', '#4C9BE8'), ('precision', '#F4A261'),
                    ('recall',   '#2EC4B6'), ('f1',        '#E71D36')]

    for ax, (col, color) in zip(axes, metrics_cols):
        bars = ax.barh(df['class'], df[col], color=color, alpha=0.85, edgecolor='white')
        ax.set_xlim(0, 1.05)
        ax.axvline(df[col].mean(), color='black', linestyle='--', linewidth=1.2,
                   alpha=0.7, label=f'Mean={df[col].mean():.3f}')
        # Annotate bar values
        for bar, val in zip(bars, df[col]):
            ax.text(min(val + 0.01, 1.0), bar.get_y() + bar.get_height() / 2,
                    f'{val:.2f}', va='center', ha='left',
                    fontsize=max(5, 8 - n // 12))
        ax.set_xlabel(col.capitalize(), fontsize=11)
        ax.set_title(col.capitalize(), fontsize=12, fontweight='bold')
        ax.legend(fontsize=8)
        ax.grid(axis='x', alpha=0.3)
        ax.tick_params(axis='y', labelsize=max(5, 8 - n // 12))

    fig.suptitle(f'Per-Class Metrics — {model_name.upper()}',
                 fontsize=14, fontweight='bold', y=1.01)
    plt.tight_layout()
    _save(fig, os.path.join(save_dir, f'{model_name}_per_class_metrics.png'))


def plot_top_confusions(cm, class_names, model_name, save_dir, top_n=20):
    """Bar chart of the most-confused class pairs (off-diagonal)."""
    n = len(class_names)
    pairs = []
    for i in range(n):
        for j in range(n):
            if i != j and cm[i, j] > 0:
                pairs.append((cm[i, j], class_names[i], class_names[j]))
    pairs.sort(reverse=True)
    pairs = pairs[:top_n]

    if not pairs:
        return

    counts = [p[0] for p in pairs]
    labels = [f'{p[1]}\n→ {p[2]}' for p in pairs]

    fig, ax = plt.subplots(figsize=(12, float(max(6, len(pairs) * 0.45))))
    bars = ax.barh(labels[::-1], counts[::-1], color='#E63946', alpha=0.82, edgecolor='white')
    for bar, val in zip(bars, counts[::-1]):
        ax.text(val + 0.3, bar.get_y() + bar.get_height() / 2,
                str(val), va='center', ha='left', fontsize=9)
    ax.set_xlabel('Number of misclassified samples', fontsize=11)
    ax.set_title(f'Top-{top_n} Confused Pairs — {model_name.upper()}',
                 fontsize=13, fontweight='bold')
    ax.grid(axis='x', alpha=0.3)
    plt.tight_layout()
    _save(fig, os.path.join(save_dir, f'{model_name}_top_confusions.png'))


def plot_roc_curves(labels_bin, probs, class_names, model_name, save_dir):
    """Macro-average + per-class ROC curves (OvR)."""
    num_classes = len(class_names)
    fpr_dict, tpr_dict, roc_auc_dict = {}, {}, {}

    for i in range(num_classes):
        fpr_dict[i], tpr_dict[i], _ = roc_curve(labels_bin[:, i], probs[:, i])
        roc_auc_dict[i] = auc(fpr_dict[i], tpr_dict[i])

    # Macro average
    all_fpr = np.unique(np.concatenate([fpr_dict[i] for i in range(num_classes)]))
    mean_tpr = np.zeros_like(all_fpr)
    for i in range(num_classes):
        mean_tpr += np.interp(all_fpr, fpr_dict[i], tpr_dict[i])
    mean_tpr /= num_classes
    macro_auc = auc(all_fpr, mean_tpr)

    cols = min(5, num_classes)
    rows = (num_classes + cols - 1) // cols
    fig, axes = plt.subplots(rows, cols,
                             figsize=(cols * 3.8, rows * 3.5))
    axes_flat = np.array(axes).flatten()

    cmap = plt.cm.get_cmap('tab20', num_classes)
    for i, (ax, name) in enumerate(zip(axes_flat, class_names)):
        ax.plot(fpr_dict[i], tpr_dict[i], color=cmap(i),
                lw=2, label=f'AUC={roc_auc_dict[i]:.3f}')
        ax.plot([0, 1], [0, 1], 'k--', lw=0.8)
        ax.set_xlim([0, 1]); ax.set_ylim([0, 1.02])
        ax.set_title(name, fontsize=8, fontweight='bold')
        ax.legend(fontsize=7, loc='lower right')
        ax.set_xlabel('FPR', fontsize=7)
        ax.set_ylabel('TPR', fontsize=7)
        ax.tick_params(labelsize=6)

    for ax in axes_flat[num_classes:]:
        ax.set_visible(False)

    fig.suptitle(
        f'ROC Curves (OvR) — {model_name.upper()}  |  Macro AUC = {macro_auc:.4f}',
        fontsize=13, fontweight='bold', y=1.01
    )
    plt.tight_layout()
    _save(fig, os.path.join(save_dir, f'{model_name}_roc_curves.png'))


def plot_confidence_distribution(probs, labels, preds, model_name, save_dir):
    """
    Histogram of max-confidence values split into correct vs. wrong,
    plus an ECE-style reliability diagram.
    """
    max_conf     = probs.max(axis=1)
    correct_mask = (preds == labels)

    fig, axes = plt.subplots(1, 2, figsize=(14, 5))

    # Confidence histogram
    ax = axes[0]
    bins = np.linspace(0, 1, 26)
    ax.hist(max_conf[correct_mask],  bins=bins, alpha=0.7, color='#2DC653', label='Correct')
    ax.hist(max_conf[~correct_mask], bins=bins, alpha=0.7, color='#E63946', label='Wrong')
    ax.set_xlabel('Max Softmax Confidence', fontsize=11)
    ax.set_ylabel('Sample Count', fontsize=11)
    ax.set_title(f'Confidence Distribution — {model_name.upper()}',
                 fontsize=12, fontweight='bold')
    ax.legend()
    ax.grid(alpha=0.3)

    # Reliability diagram
    ax2 = axes[1]
    n_bins    = 10
    bin_edges = np.linspace(0, 1, n_bins + 1)
    bin_acc, bin_conf_vals, bin_counts = [], [], []

    for lo, hi in zip(bin_edges[:-1], bin_edges[1:]):
        mask: np.ndarray = (max_conf >= lo) & (max_conf < hi)
        if mask.sum() > 0:
            bin_acc.append(correct_mask[mask].mean())
            bin_conf_vals.append(max_conf[mask].mean())
            bin_counts.append(int(mask.sum()))
        else:
            bin_acc.append(None)
            bin_conf_vals.append((lo + hi) / 2)
            bin_counts.append(0)

    bin_centers = [(lo + hi) / 2 for lo, hi in zip(bin_edges[:-1], bin_edges[1:])]
    valid = [a is not None for a in bin_acc]
    valid_centers = [c for c, v in zip(bin_centers, valid) if v]
    valid_acc     = [a for a, v in zip(bin_acc, valid) if v]
    valid_counts  = [cnt for cnt, v in zip(bin_counts, valid) if v]

    bar_colors = ['#E63946' if abs(a - c) > 0.1 else '#2DC653'
                  for a, c in zip(valid_acc, valid_centers)]
    ax2.bar(valid_centers, valid_acc, width=0.08,
            color=bar_colors, alpha=0.8, edgecolor='white', label='Accuracy')
    ax2.plot([0, 1], [0, 1], 'k--', lw=1.2, label='Perfect calibration')
    ax2.set_xlabel('Confidence Bin', fontsize=11)
    ax2.set_ylabel('Accuracy', fontsize=11)
    ax2.set_title(f'Reliability Diagram — {model_name.upper()}',
                  fontsize=12, fontweight='bold')
    ax2.set_xlim(0, 1); ax2.set_ylim(0, 1)
    ax2.legend(); ax2.grid(alpha=0.3)

    ece = sum(abs(a - c) * cnt for a, c, cnt in
              zip(valid_acc, valid_centers, valid_counts)) / len(labels)
    ax2.text(0.05, 0.93, f'ECE = {ece:.4f}', transform=ax2.transAxes,
             fontsize=10, color='navy',
             bbox=dict(boxstyle='round,pad=0.3', facecolor='lightyellow', alpha=0.8))

    plt.tight_layout()
    _save(fig, os.path.join(save_dir, f'{model_name}_confidence_distribution.png'))
    return ece


def plot_class_accuracy_vs_support(per_class_df, model_name, save_dir):
    """Scatter: per-class accuracy vs sample count (bubble size & colour = F1)."""
    df = per_class_df
    fig, ax = plt.subplots(figsize=(11, 7))
    sc = ax.scatter(df['support'], df['accuracy'],
                    s=df['f1'] * 300 + 20,
                    c=df['f1'], cmap='RdYlGn', alpha=0.8,
                    edgecolors='grey', linewidths=0.5, vmin=0, vmax=1)
    cbar = plt.colorbar(sc, ax=ax)
    cbar.set_label('F1 Score', fontsize=10)

    for _, row in df.iterrows():
        ax.annotate(row['class'],
                    xy=(row['support'], row['accuracy']),
                    fontsize=7, alpha=0.85,
                    xytext=(4, 2), textcoords='offset points')

    ax.set_xlabel('Support (sample count)', fontsize=11)
    ax.set_ylabel('Per-class Accuracy', fontsize=11)
    ax.set_title(f'Accuracy vs. Support — {model_name.upper()}\n'
                 f'(bubble size ∝ F1 score)',
                 fontsize=12, fontweight='bold')
    ax.grid(alpha=0.3)
    plt.tight_layout()
    _save(fig, os.path.join(save_dir, f'{model_name}_accuracy_vs_support.png'))


def plot_summary_radar(metrics_dict, save_dir):
    """Radar chart comparing multiple models across key metrics."""
    if len(metrics_dict) < 2:
        return

    radar_metrics = ['accuracy', 'f1_w', 'precision_w', 'recall_w', 'top3_accuracy']
    labels_radar  = ['Accuracy', 'F1 (W)', 'Precision (W)', 'Recall (W)', 'Top-3 Acc']
    N = len(radar_metrics)

    angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
    angles += angles[:1]

    fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(polar=True))
    cmap = plt.cm.get_cmap('tab10', len(metrics_dict))

    for idx, (model_name, m) in enumerate(metrics_dict.items()):
        values = [m.get(k, 0) or 0 for k in radar_metrics]
        values += values[:1]
        ax.plot(angles, values, 'o-', lw=2, label=model_name.upper(), color=cmap(idx))
        ax.fill(angles, values, alpha=0.08, color=cmap(idx))

    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(labels_radar, fontsize=11)
    ax.set_ylim(0, 1)
    ax.set_yticks([0.2, 0.4, 0.6, 0.8, 1.0])
    ax.set_yticklabels(['0.2', '0.4', '0.6', '0.8', '1.0'], fontsize=8)
    ax.set_title('Model Comparison — Radar Chart',
                 fontsize=14, fontweight='bold', pad=18)
    ax.legend(loc='upper right', bbox_to_anchor=(1.3, 1.12), fontsize=10)
    ax.grid(True)
    plt.tight_layout()
    _save(fig, os.path.join(save_dir, 'model_comparison_radar.png'))


def plot_model_comparison_bar(metrics_dict, save_dir):
    """Grouped bar chart comparing models across key metrics."""
    if len(metrics_dict) < 2:
        return

    bar_metrics = {
        'Accuracy':        'accuracy',
        'Top-3 Acc':       'top3_accuracy',
        'F1 (Weighted)':   'f1_w',
        'Precision (W)':   'precision_w',
        'Recall (W)':      'recall_w',
        'ROC-AUC (Macro)': 'roc_auc_macro',
    }

    model_names = list(metrics_dict.keys())
    x     = np.arange(len(bar_metrics))
    width = 0.75 / len(model_names)

    fig, ax = plt.subplots(figsize=(14, 6))
    cmap = plt.cm.get_cmap('tab10', len(model_names))

    for i, name in enumerate(model_names):
        vals   = [metrics_dict[name].get(col) or 0 for col in bar_metrics.values()]
        offset = (i - len(model_names) / 2 + 0.5) * width
        bars   = ax.bar(x + offset, vals, width, label=name.upper(),
                        color=cmap(i), alpha=0.85, edgecolor='white')
        for bar, val in zip(bars, vals):
            ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.005,
                    f'{val:.3f}', ha='center', va='bottom', fontsize=7.5)

    ax.set_xticks(x)
    ax.set_xticklabels(list(bar_metrics.keys()), fontsize=10)
    ax.set_ylim(0, 1.08)
    ax.set_ylabel('Score', fontsize=11)
    ax.set_title('Model Comparison', fontsize=14, fontweight='bold')
    ax.legend(fontsize=10)
    ax.grid(axis='y', alpha=0.3)
    plt.tight_layout()
    _save(fig, os.path.join(save_dir, 'model_comparison_bar.png'))


# ============================================================
# PRINT HELPERS
# ============================================================

def print_section(title):
    print(f"\n{'=' * 70}")
    print(f"  {title}")
    print('=' * 70)


def print_metrics_summary(model_name, m):
    print_section(f"RESULTS — {model_name.upper()}")
    print(f"  Accuracy:            {m['accuracy']:.4f}  ({m['accuracy']*100:.2f}%)")
    print(f"  Top-3 Accuracy:      {m['top3_accuracy']:.4f}")
    if m['top5_accuracy'] is not None:
        print(f"  Top-5 Accuracy:      {m['top5_accuracy']:.4f}")
    print()
    print(f"  Weighted Precision:  {m['precision_w']:.4f}")
    print(f"  Weighted Recall:     {m['recall_w']:.4f}")
    print(f"  Weighted F1:         {m['f1_w']:.4f}")
    print()
    print(f"  Macro Precision:     {m['precision_m']:.4f}")
    print(f"  Macro Recall:        {m['recall_m']:.4f}")
    print(f"  Macro F1:            {m['f1_m']:.4f}")
    if m['roc_auc_macro'] is not None:
        print(f"  ROC-AUC (Macro):     {m['roc_auc_macro']:.4f}")
    if m['map_score'] is not None:
        print(f"  mAP (Macro):         {m['map_score']:.4f}")
    print()
    print("  Per-class summary (sorted by F1 ↓):")
    df = m['per_class'].sort_values('f1', ascending=False)
    print(df.to_string(index=False, float_format=lambda x: f'{x:.3f}'))
    print()
    print("  Full classification report:")
    print(m['class_report'])


# ============================================================
# PER-MODEL EVALUATION PIPELINE
# ============================================================

def evaluate_single_model(model_name, model_path, test_loader,
                           class_names, output_dir):
    """Load one model, run inference, compute metrics, produce all plots."""
    print_section(f"EVALUATING: {model_name.upper()}")

    model_out_dir = os.path.join(output_dir, model_name)
    os.makedirs(model_out_dir, exist_ok=True)

    # Load model
    model = load_model(model_name, model_path, Config.NUM_CLASSES)

    # Inference
    labels, preds, probs = run_inference(model, model_name, test_loader, Config.NUM_CLASSES)

    # Metrics
    metrics = compute_metrics(labels, preds, probs, class_names)

    # Print summary
    print_metrics_summary(model_name, metrics)

    # ----- Visualisations -----
    print(f"\n  Generating visualisations → {model_out_dir}")

    # 1. Annotated confusion matrix (counts + %)
    plot_confusion_matrix(
        metrics['confusion_matrix'], class_names,
        model_name, model_out_dir
    )

    # 1b. Top-3-aware confusion matrix (true label in top-3 => correct)
    plot_top3_confusion_matrix(
        metrics['confusion_matrix_top3'], class_names,
        model_name, model_out_dir
    )

    # 2. Per-class horizontal bar charts (accuracy / precision / recall / F1)
    plot_per_class_metrics(metrics['per_class'], model_name, model_out_dir)

    # 3. Top-20 most confused class pairs
    plot_top_confusions(
        metrics['confusion_matrix'], class_names,
        model_name, model_out_dir
    )

    # 4. Per-class ROC curves (OvR)
    plot_roc_curves(
        metrics['labels_bin'], probs,
        class_names, model_name, model_out_dir
    )

    # 5. Confidence distribution + reliability diagram (ECE)
    ece = plot_confidence_distribution(probs, labels, preds, model_name, model_out_dir)
    metrics['ece'] = ece
    print(f"    ECE (Expected Calibration Error): {ece:.4f}")

    # 6. Accuracy vs. support bubble scatter
    plot_class_accuracy_vs_support(metrics['per_class'], model_name, model_out_dir)

    # ----- Save per-class metrics CSV -----
    csv_path = os.path.join(model_out_dir, f'{model_name}_per_class_metrics.csv')
    metrics['per_class'].to_csv(csv_path, index=False)
    print(f"    Per-class metrics CSV: {csv_path}")

    # Free GPU memory
    del model
    torch.cuda.empty_cache()

    return metrics


# ============================================================
# COMPARISON TABLE
# ============================================================

def save_comparison_table(all_results, output_dir):
    """Save a single CSV comparing all evaluated models."""
    rows = []
    for model_name, m in all_results.items():
        rows.append({
            'model':          model_name,
            'accuracy':       round(m['accuracy'], 5),
            'top3_accuracy':  round(m['top3_accuracy'], 5),
            'top5_accuracy':  round(m['top5_accuracy'], 5) if m['top5_accuracy'] else None,
            'precision_w':    round(m['precision_w'], 5),
            'recall_w':       round(m['recall_w'], 5),
            'f1_w':           round(m['f1_w'], 5),
            'precision_m':    round(m['precision_m'], 5),
            'recall_m':       round(m['recall_m'], 5),
            'f1_m':           round(m['f1_m'], 5),
            'roc_auc_macro':  round(m['roc_auc_macro'], 5) if m['roc_auc_macro'] else None,
            'map_score':      round(m['map_score'], 5) if m['map_score'] else None,
            'ece':            round(m.get('ece', 0), 5),
            'evaluated_at':   datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        })
    df = pd.DataFrame(rows)
    csv_path = os.path.join(output_dir, 'evaluation_comparison.csv')
    df.to_csv(csv_path, index=False)
    print_section("COMPARISON TABLE")
    print(df.to_string(index=False))
    print(f"\n  Saved: {csv_path}")


# ============================================================
# MAIN — ADD / REMOVE MODELS HERE
# ============================================================

def main():
    """
    ================================================================
    CONFIGURE YOUR MODELS HERE
    ================================================================
    Each entry is:
        'model_name': 'path/to/checkpoint.pth'

    Supported model names:
        mobilenet_v2, resnet50, densenet121, inception_v3, vgg16

    To add a model, uncomment its line (or add a new one).
    To remove a model, comment it out.
    ================================================================
    """
    models_to_evaluate = {
        'mobilenet_v2': os.path.join(Config.MODELS_DIR, 'mobilenet_v2_best.pth'),
        'resnet50':     os.path.join(Config.MODELS_DIR, 'resnet50_best.pth'),
        'densenet121':  os.path.join(Config.MODELS_DIR, 'densenet121_best.pth'),
        'inception_v3': os.path.join(Config.MODELS_DIR, 'inception_v3_best.pth'),
        'vgg16':        os.path.join(Config.MODELS_DIR, 'vgg16_best.pth'),
    }

    # ---- Validate paths ----
    print_section("PATH VERIFICATION")
    missing = False
    for path in [Config.TEST_CSV, Config.LABEL_MAP]:
        status = 'OK' if os.path.exists(path) else 'MISSING'
        print(f"  [{status}] {path}")
        if status == 'MISSING':
            missing = True

    valid_models = {}
    for name, path in models_to_evaluate.items():
        status = 'OK' if os.path.exists(path) else 'MISSING'
        print(f"  [{status}] {name}: {path}")
        if status == 'OK':
            valid_models[name] = path
        else:
            missing = True

    if not valid_models:
        print("\n  ERROR: No valid model checkpoints found. Aborting.")
        return
    if missing:
        print("\n  WARNING: Some paths are missing. Continuing with valid models only.")

    # ---- Load class names ----
    label_map_df = pd.read_csv(Config.LABEL_MAP)
    class_names  = label_map_df.sort_values('label')['species'].tolist()
    print(f"\n  Classes ({len(class_names)}): {class_names}")

    # ---- Output directory ----
    os.makedirs(Config.OUTPUT_DIR, exist_ok=True)
    print(f"\n  Output directory: {Config.OUTPUT_DIR}")

    # ---- Evaluate each model ----
    np.random.seed(Config.SEED)
    torch.manual_seed(Config.SEED)

    all_results = {}

    for model_name, model_path in valid_models.items():
        # Each model may need a different transform (inception_v3 uses 299px)
        transform = get_val_transform(model_name)
        test_dataset = BirdDataset(
            Config.TEST_CSV,
            Config.IMAGE_PATH_COL,
            Config.LABEL_COL,
            transform=transform,
        )
        test_loader = DataLoader(
            test_dataset,
            batch_size=Config.BATCH_SIZE,
            shuffle=False,
            num_workers=Config.NUM_WORKERS,
            pin_memory=Config.PIN_MEMORY,
            persistent_workers=Config.NUM_WORKERS > 0,
        )
        print(f"\n  Test set size: {len(test_dataset):,} images")

        metrics = evaluate_single_model(
            model_name, model_path,
            test_loader, class_names,
            Config.OUTPUT_DIR,
        )
        all_results[model_name] = metrics

    # ---- Cross-model comparison plots (only when >1 model evaluated) ----
    print_section("GENERATING COMPARISON PLOTS")
    plot_summary_radar(all_results, Config.OUTPUT_DIR)
    plot_model_comparison_bar(all_results, Config.OUTPUT_DIR)

    # ---- Aggregate comparison CSV ----
    save_comparison_table(all_results, Config.OUTPUT_DIR)

    print_section("EVALUATION COMPLETE")
    print(f"  All outputs saved to: {Config.OUTPUT_DIR}")


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == '__main__':
    multiprocessing.freeze_support()
    main()


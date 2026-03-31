"""
Application configuration — model settings, species list, and device detection.
"""

import os
import csv
import torch

# ──────────────────────────────────────────────
# Device
# ──────────────────────────────────────────────

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ──────────────────────────────────────────────
# Model
# ──────────────────────────────────────────────

MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "model")
MODEL_PATH = os.environ.get(
    "ML_MODEL_PATH",
    os.path.join(MODEL_DIR, "inception_v3_best.pth"),
)

NUM_CLASSES = 30

LABEL_MAP_PATH = os.environ.get(
    "ML_LABEL_MAP_PATH",
    os.path.join(MODEL_DIR, "label_mapping.csv"),
)

# ──────────────────────────────────────────────
# Species list — order must match training labels
# ──────────────────────────────────────────────


def _load_species_list() -> list[str]:
    """Load label->species mapping from CSV and enforce contiguous labels."""
    if not os.path.exists(LABEL_MAP_PATH):
        raise FileNotFoundError(
            f"Label map not found at {LABEL_MAP_PATH}. "
            "Set ML_LABEL_MAP_PATH or place label_mapping.csv in model/."
        )

    with open(LABEL_MAP_PATH, "r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames or []
        if "label" not in fieldnames or "species" not in fieldnames:
            raise ValueError(
                f"Label map at {LABEL_MAP_PATH} must contain 'label' and 'species' columns."
            )

        rows: list[tuple[int, str]] = []
        for row in reader:
            rows.append((int(row["label"]), row["species"]))

    rows.sort(key=lambda x: x[0])

    labels = [label for label, _ in rows]
    expected = list(range(len(rows)))
    if labels != expected:
        raise ValueError(
            f"Labels in {LABEL_MAP_PATH} must be contiguous starting at 0. "
            f"Found {labels[:5]}...{labels[-5:] if len(labels) > 5 else labels}"
        )

    return [species for _, species in rows]


SPECIES_LIST: list[str] = _load_species_list()

# Quick sanity check
assert len(SPECIES_LIST) == NUM_CLASSES, (
    f"SPECIES_LIST has {len(SPECIES_LIST)} entries but NUM_CLASSES is {NUM_CLASSES}. "
    f"Check ML_LABEL_MAP_PATH={LABEL_MAP_PATH}"
)

# Index ↔ species helpers
INDEX_TO_SPECIES: dict[int, str] = {i: s for i, s in enumerate(SPECIES_LIST)}
SPECIES_TO_INDEX: dict[str, int] = {s: i for i, s in enumerate(SPECIES_LIST)}

# ──────────────────────────────────────────────
# Inference defaults
# ──────────────────────────────────────────────

DEFAULT_TOP_K = 5
MAX_TOP_K = 10

# ──────────────────────────────────────────────
# Image preprocessing (Inception V3)
# ──────────────────────────────────────────────

IMAGE_SIZE = 299
RESIZE_SIZE = 342
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

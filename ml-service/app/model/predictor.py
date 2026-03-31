"""
Predictor — image preprocessing and inference logic.

Stateless functions that operate on a pre-loaded model instance.
"""

import logging
from io import BytesIO

import torch
import torch.nn as nn
from PIL import Image
from torchvision import transforms

from app.config import (
    DEVICE,
    IMAGE_SIZE,
    IMAGENET_MEAN,
    IMAGENET_STD,
    INDEX_TO_SPECIES,
    RESIZE_SIZE,
)
from app.schemas.prediction import PredictionItem

logger = logging.getLogger(__name__)

# Build the transform pipeline once (stateless, thread-safe)
_transform = transforms.Compose(
    [
        transforms.Resize(RESIZE_SIZE),
        transforms.CenterCrop(IMAGE_SIZE),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
    ]
)


def preprocess_image(image_bytes: bytes) -> torch.Tensor:
    """
    Read raw bytes into a PIL Image, apply Inception V3 preprocessing,
    and return a batch-of-1 tensor on the configured device.
    """
    image = Image.open(BytesIO(image_bytes)).convert("RGB")
    tensor = _transform(image)  # (C, H, W)
    return tensor.unsqueeze(0).to(DEVICE)  # (1, C, H, W)


def predict(model: nn.Module, image_bytes: bytes, top_k: int = 5) -> list[PredictionItem]:
    """
    Run inference on a single image and return the top-k predictions
    sorted by descending confidence.
    """
    input_tensor = preprocess_image(image_bytes)

    with torch.no_grad():
        outputs = model(input_tensor)
        probabilities = torch.softmax(outputs, dim=1)
        top_probs, top_indices = torch.topk(probabilities, top_k)

    top_probs = top_probs.squeeze().cpu().tolist()
    top_indices = top_indices.squeeze().cpu().tolist()

    # Handle single-result case (top_k == 1 → scalars, not lists)
    if not isinstance(top_probs, list):
        top_probs = [top_probs]
        top_indices = [top_indices]

    results: list[PredictionItem] = []
    for prob, idx in zip(top_probs, top_indices):
        results.append(
            PredictionItem(
                species=INDEX_TO_SPECIES[idx],
                confidence=round(prob, 6),
            )
        )

    return results

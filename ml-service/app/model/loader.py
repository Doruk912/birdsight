"""
Model loader — builds the Inception V3 architecture and loads trained weights.

The model is loaded once at application startup and reused across all requests.
"""

import logging

import torch
import torch.nn as nn
from torchvision import models

from app.config import DEVICE, MODEL_PATH, NUM_CLASSES

logger = logging.getLogger(__name__)


def load_model() -> nn.Module:
    """
    Construct an Inception V3 model, load the saved checkpoint, and
    return the model in eval mode on the configured device.

    Raises:
        FileNotFoundError: If the model file does not exist at MODEL_PATH.
        RuntimeError: If the checkpoint cannot be loaded.
    """
    logger.info("Loading Inception V3 model from %s …", MODEL_PATH)

    # Build architecture (no pretrained weights — we load our own)
    model = models.inception_v3(weights=None)
    model.AuxLogits.fc = nn.Linear(model.AuxLogits.fc.in_features, NUM_CLASSES)
    model.fc = nn.Linear(model.fc.in_features, NUM_CLASSES)

    # Load trained checkpoint
    checkpoint = torch.load(MODEL_PATH, map_location=DEVICE, weights_only=False)
    model.load_state_dict(checkpoint["model_state_dict"])

    model.to(DEVICE)
    model.eval()

    best_acc = checkpoint.get("best_acc", "N/A")
    logger.info("Model loaded — best training accuracy: %s", best_acc)

    return model

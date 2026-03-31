"""
Prediction route — accepts an image and returns top-K species predictions.
"""

import logging

from fastapi import APIRouter, File, Query, Request, UploadFile, HTTPException

from app.config import DEFAULT_TOP_K, MAX_TOP_K
from app.model.predictor import predict
from app.schemas.prediction import PredictionResponse

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/predict", response_model=PredictionResponse)
async def predict_species(
    request: Request,
    file: UploadFile = File(..., description="Bird image to classify"),
    top_k: int = Query(DEFAULT_TOP_K, ge=1, le=MAX_TOP_K, description="Number of top predictions"),
) -> PredictionResponse:
    """
    Upload a bird image and receive the top-K species predictions
    with confidence scores.
    """
    # Validate model availability
    model = getattr(request.app.state, "model", None)
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Service is starting up.")

    # Validate content type
    content_type = file.content_type or ""
    if not content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail=f"Expected an image file, got '{content_type}'.")

    # Read image bytes
    image_bytes = await file.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    logger.info("Predicting species for '%s' (%d bytes, top_k=%d)", file.filename, len(image_bytes), top_k)

    try:
        predictions = predict(model, image_bytes, top_k=top_k)
    except Exception as exc:
        logger.exception("Prediction failed for '%s'", file.filename)
        raise HTTPException(status_code=500, detail="Prediction failed. The image may be corrupted.") from exc

    return PredictionResponse(predictions=predictions)

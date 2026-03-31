"""
Pydantic schemas for prediction request / response.
"""

from pydantic import BaseModel


class PredictionItem(BaseModel):
    """A single species prediction."""

    species: str
    confidence: float


class PredictionResponse(BaseModel):
    """Top-K prediction results for a single image."""

    predictions: list[PredictionItem]

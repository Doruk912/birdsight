"""
Health-check route — used by monitoring and readiness probes.
"""

from fastapi import APIRouter, Request

router = APIRouter()


@router.get("/health")
async def health_check(request: Request) -> dict:
    """
    Returns service status and whether the model is loaded.
    """
    model_loaded = hasattr(request.app.state, "model") and request.app.state.model is not None
    return {
        "status": "healthy" if model_loaded else "degraded",
        "model_loaded": model_loaded,
    }

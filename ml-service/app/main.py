"""
BirdSight ML Service — FastAPI application.

Loads the Inception V3 bird species classifier at startup and
exposes a /predict endpoint for image classification.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.model.loader import load_model
from app.routes.health import router as health_router
from app.routes.predict import router as predict_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the model once on startup; release on shutdown."""
    logger.info("Starting BirdSight ML Service …")
    app.state.model = load_model()
    logger.info("Model ready — accepting requests.")
    yield
    logger.info("Shutting down ML Service.")
    app.state.model = None


app = FastAPI(
    title="BirdSight ML Service",
    description="Bird species classification using Inception V3",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow the backend to call us
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(health_router, tags=["Health"])
app.include_router(predict_router, tags=["Prediction"])

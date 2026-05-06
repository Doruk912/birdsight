# BirdSight — ML Service

A lightweight FastAPI inference server that wraps the trained InceptionV3 bird-species classifier. On startup it loads the PyTorch model into memory and then serves prediction requests from the backend. It is intentionally stateless — the backend is the only client.

For details on how the model was trained, see [ml-utils/README.md](../ml-utils/README.md).

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [How It Works](#how-it-works)
- [API Endpoints](#api-endpoints)
- [Request & Response Schema](#request--response-schema)
- [Image Preprocessing](#image-preprocessing)
- [Model Files](#model-files)
- [Configuration](#configuration)
- [Running Locally](#running-locally)
- [Project Structure](#project-structure)

---

## Tech Stack

| Component       | Detail                                               |
|-----------------|------------------------------------------------------|
| **Language**    | Python 3.12+                                         |
| **Framework**   | FastAPI                                              |
| **Server**      | Uvicorn (ASGI)                                       |
| **ML Runtime**  | PyTorch (CPU or CUDA)                                |
| **Vision**      | torchvision (transforms)                             |
| **Image I/O**   | Pillow (PIL)                                         |
| **Uploads**     | python-multipart                                     |
| **Model**       | InceptionV3 — 30 species (89.3% accuracy)            |

---

## How It Works

```
POST /predict (multipart image)
      │
      ▼
Validate content-type & non-empty bytes
      │
      ▼
preprocess_image()
  ├─ PIL.Image.open → convert to RGB
  ├─ Resize to 342 px (shorter side)
  ├─ CenterCrop to 299 × 299
  ├─ ToTensor
  └─ Normalize (ImageNet mean/std)
      │
      ▼
model(tensor) [torch.no_grad()]
      │
      ▼
softmax → topk(top_k)
      │
      ▼
Map indices → species names (INDEX_TO_SPECIES)
      │
      ▼
Return PredictionResponse [{species, confidence}, ...]
```

**Model lifecycle** — the FastAPI `lifespan` context manager loads the model once at startup and assigns it to `app.state.model`. All requests share the same in-memory model. On shutdown the reference is released.

**Device detection** — the service automatically uses CUDA if a GPU is available, otherwise falls back to CPU.

---

## API Endpoints

### `GET /health`

Returns `{"status": "ok"}` when the service is running. Used by the backend to verify availability.

### `POST /predict`

Upload a bird image and receive the top-K species predictions sorted by descending confidence.

**Query Parameters**

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `top_k` | integer | `5` | 1–10 | Number of predictions to return |

**Form Fields**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | `UploadFile` | ✅ | Bird image (JPEG, PNG, WebP, etc.) |

---

## Request & Response Schema

**Request example (curl):**

```bash
curl -X POST "http://localhost:8000/predict?top_k=3" \
     -F "file=@robin.jpg"
```

**Response — `PredictionResponse`:**

```json
{
  "predictions": [
    { "species": "Erithacus rubecula", "confidence": 0.923741 },
    { "species": "Turdus merula",      "confidence": 0.042817 },
    { "species": "Parus major",        "confidence": 0.018503 }
  ]
}
```

**Error responses:**

| Status | Condition |
|--------|-----------|
| `400` | Non-image content-type or empty file |
| `500` | Image corrupted or inference failed |
| `503` | Model not yet loaded (service starting) |

---

## Image Preprocessing

The preprocessing pipeline matches the transform used during training:

| Step | Detail |
|------|--------|
| Convert to RGB | Strips alpha channel / handles greyscale |
| Resize | Shorter side → 342 px |
| CenterCrop | 299 × 299 (InceptionV3 input size) |
| ToTensor | Scales pixel values to [0, 1] |
| Normalize | Mean `[0.485, 0.456, 0.406]`, Std `[0.229, 0.224, 0.225]` |

The transform is built once at module load time (stateless, thread-safe).

---

## Model Files

Place the following files in the `model/` directory before starting:

| File | Description |
|------|-------------|
| `model/inception_v3_best.pth` | Trained InceptionV3 weights (30-class head) |
| `model/label_mapping.csv` | CSV with columns `label` (integer) and `species` (scientific name) |

**`label_mapping.csv` format:**

```csv
label,species
0,Accipiter nisus
1,Acridotheres tristis
...
29,Turdus merula
```

Labels must be contiguous starting at 0. The service validates this on startup. The weights are produced by `ml-utils/10_exp04_combined.py` — they are not committed to the repository.

---

## Configuration

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `ML_MODEL_PATH` | `model/inception_v3_best.pth` | Path to the `.pth` weights file |
| `ML_LABEL_MAP_PATH` | `model/label_mapping.csv` | Path to the label mapping CSV |

Inference constants (in `app/config.py`):

| Constant | Value | Description |
|----------|-------|-------------|
| `NUM_CLASSES` | `30` | Number of output classes |
| `DEFAULT_TOP_K` | `5` | Default predictions per request |
| `MAX_TOP_K` | `10` | Maximum allowed `top_k` |
| `IMAGE_SIZE` | `299` | CenterCrop target (px) |
| `RESIZE_SIZE` | `342` | Resize target before crop (px) |

---

## Running Locally

**Prerequisites:** Python 3.12+, pip, model files in `model/`.

```powershell
cd ml-service
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The service starts on **`http://localhost:8000`**.

**Verify:**

```powershell
curl http://localhost:8000/health
```

**Interactive docs:** `http://localhost:8000/docs` (Swagger UI)

---

## Project Structure

```
ml-service/
├── requirements.txt          # Python dependencies
├── model/                    # Model artefacts (not in git)
│   ├── inception_v3_best.pth # Trained weights
│   └── label_mapping.csv     # Label → species mapping
└── app/
    ├── main.py               # FastAPI app, lifespan, middleware
    ├── config.py             # Paths, device, species list, constants
    ├── model/
    │   ├── loader.py         # Loads the InceptionV3 model
    │   └── predictor.py      # Preprocessing + inference
    ├── routes/
    │   ├── health.py         # GET /health
    │   └── predict.py        # POST /predict
    └── schemas/
        └── prediction.py     # Pydantic response models
```

---

<p align="center">
  <strong>FastAPI · PyTorch InceptionV3 · 30 Species · 89.3% Accuracy</strong>
</p>

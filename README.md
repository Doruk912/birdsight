# BirdSight

A full-stack citizen-science bird observation and identification platform. Users photograph birds, receive AI-powered species suggestions from a custom-trained deep learning model, submit sightings to a shared community feed, and collaborate on identifying species through a community consensus system.

---

## Features

- **AI Species Identification** — Upload a bird photo and get instant top-5 species predictions from a custom InceptionV3 model trained on 150,000 images across 30 species (89.3% accuracy, 96.0% top-3).
- **Community Identification** — Submit, discuss, and refine species identifications with other users. Observations are promoted to **Research Grade** when more than two-thirds of the community agrees at species level.
- **Interactive Map** — Explore all sightings on a MapLibre GL map with heatmap, cluster, and individual-point layers.
- **Taxonomy Browser** — Navigate the full bird taxonomy tree (Class → Order → Family → Genus → Species) with per-taxon stats, top observers, and top identifiers.
- **Observation Feed** — Filterable, paginated observation list supporting text search, quality grade, taxon, user, date range, and geographic bounding-box filters.
- **User Profiles** — Per-user observation count and unique species count, with a recent-observations grid.
- **Secure Authentication** — JWT access tokens (in-memory) + httpOnly refresh-token cookies with silent re-authentication.
- **Self-contained Storage** — All images are stored in a local MinIO instance; no dependency on external CDNs.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Browser                            │
│              Next.js 16 / React 19 / TypeScript         │
│                  http://localhost:3000                   │
└──────────────────────────┬──────────────────────────────┘
                           │ /api/* (rewrite proxy)
                           ▼
┌─────────────────────────────────────────────────────────┐
│                Spring Boot 4 / Java 21                  │
│                  http://localhost:8080                   │
│                                                         │
│  ┌──────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│  │  Auth /  │ │ Observations │ │  Taxonomy / Comments  │ │
│  │  Users   │ │  + Identify  │ │  + ML Proxy           │ │
│  └──────────┘ └──────────────┘ └──────────────────────┘ │
└──────┬──────────────┬───────────────────────┬───────────┘
       │              │                       │
       ▼              ▼                       ▼
┌────────────┐  ┌──────────────┐   ┌──────────────────────┐
│ PostgreSQL │  │    MinIO     │   │   FastAPI ML Service  │
│  + PostGIS │  │ (images S3)  │   │  InceptionV3 / PyTorch│
│  port 5432 │  │  port 9000   │   │    http://localhost:8000│
└────────────┘  └──────────────┘   └──────────────────────┘
```

---

## Repository Layout

| Directory | Description | README |
|-----------|-------------|--------|
| [`backend/`](./backend) | Spring Boot REST API — auth, observations, identifications, taxonomy, storage | [backend/README.md](./backend/README.md) |
| [`frontend/`](./frontend) | Next.js web client — all pages, components, and API service layer | [frontend/README.md](./frontend/README.md) |
| [`ml-service/`](./ml-service) | FastAPI inference server — serves the trained InceptionV3 model | [ml-service/README.md](./ml-service/README.md) |
| [`ml-utils/`](./ml-utils) | Offline training pipeline — dataset download, preprocessing, training, evaluation | [ml-utils/README.md](./ml-utils/README.md) |

---

## Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| Docker & Docker Compose | Any recent version |
| Java | 21+ |
| Maven | Included via `mvnw` wrapper |
| Node.js | 20+ |
| Python | 3.12+ |

You also need the ML model weights (`inception_v3_best.pth`) and label mapping (`label_mapping.csv`) placed in `ml-service/model/`. See [ml-service/README.md](./ml-service/README.md) for details.

---

### 1 — Clone the repository

```powershell
git clone https://github.com/Doruk912/birdsight.git
cd birdsight
```

### 2 — Start infrastructure (PostgreSQL + MinIO)

```powershell
docker compose up -d
```

This starts:
- **PostgreSQL 17 + PostGIS** on port `5432`
- **MinIO** on port `9000` (API) and `9001` (web console)
- **minio-init** — one-shot container that creates the `images` bucket with public-read access

### 3 — Start the backend

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Spring Boot starts on port `8080`. Flyway runs all 15 migrations automatically on first start (schema creation + seed data).

### 4 — Start the frontend

```powershell
cd frontend
npm install
npm run dev
```

Next.js starts on port `3000`. All `/api/*` calls are transparently proxied to `localhost:8080`.

### 5 — Start the ML service

```powershell
cd ml-service
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

FastAPI starts on port `8000`. The model is loaded into memory on startup.

---

## Port Reference

| Service | Port | URL |
|---------|------|-----|
| Frontend (Next.js) | `3000` | http://localhost:3000 |
| Backend (Spring Boot) | `8080` | http://localhost:8080 |
| ML Service (FastAPI) | `8000` | http://localhost:8000 |
| PostgreSQL | `5432` | `jdbc:postgresql://localhost:5432/birdsight` |
| MinIO API | `9000` | http://localhost:9000 |
| MinIO Console | `9001` | http://localhost:9001 |

---

## Infrastructure

Docker Compose manages the stateful services. Data is persisted in named Docker volumes:

| Volume | Contents |
|--------|----------|
| `birdsight-db-data` | PostgreSQL data directory |
| `birdsight-minio-data` | MinIO object storage |

To reset all data:

```powershell
docker compose down -v
```

---

## Sub-project Documentation

Each component has its own detailed README:

- **[Backend →](./backend/README.md)** — API endpoint reference, JWT auth flow, Flyway migration list, quality-grade consensus logic, configuration.
- **[Frontend →](./frontend/README.md)** — Page map, component architecture, service layer, silent-refresh auth design.
- **[ML Service →](./ml-service/README.md)** — Inference pipeline, preprocessing, API schema, model file placement.
- **[ML Utils →](./ml-utils/README.md)** — Dataset, model benchmarking, fine-tuning experiments, per-class performance results.

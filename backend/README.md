# BirdSight — Backend

Spring Boot REST API that powers the BirdSight bird-observation platform. It handles user authentication, observation lifecycle management (create, read, update, delete), community identification with quality-grade consensus, taxonomy browsing, image storage via MinIO, and reverse geocoding via OpenStreetMap Nominatim. It also proxies prediction requests to the ML Service.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Package Architecture](#package-architecture)
- [API Endpoints](#api-endpoints)
- [Authentication & Security](#authentication--security)
- [Data Layer](#data-layer)
- [Quality Grade Logic](#quality-grade-logic)
- [Image Storage](#image-storage)
- [ML Service Integration](#ml-service-integration)
- [Configuration](#configuration)
- [Running Locally](#running-locally)
- [Project Structure](#project-structure)

---

## Tech Stack

| Component             | Detail                                               |
|-----------------------|------------------------------------------------------|
| **Language**          | Java 21                                              |
| **Framework**         | Spring Boot 4.0.3                                    |
| **Build Tool**        | Maven (Maven Wrapper included)                       |
| **Database**          | PostgreSQL 17 + PostGIS 3.5 (spatial queries)        |
| **ORM**               | Spring Data JPA + Hibernate Spatial                  |
| **Migrations**        | Flyway                                               |
| **Security**          | Spring Security + JJWT 0.13.0                        |
| **Object Storage**    | MinIO (S3-compatible, Java SDK 8.6.0)                |
| **HTTP Client**       | OkHttp 4.12.0 (ML Service & Nominatim calls)         |
| **Validation**        | Spring Boot Starter Validation (Bean Validation)     |
| **Boilerplate**       | Lombok                                               |
| **Geocoding**         | OpenStreetMap Nominatim (reverse geocoding)          |

---

## Package Architecture

All application code lives under `com.birdsight`.

```
com.birdsight/
├── auth/               # Login, register, token refresh, logout
├── user/               # User profiles, avatar upload, statistics
├── observation/        # Core observation CRUD, filtering, map endpoint
├── identification/     # Community species identifications & withdrawal
├── comment/            # Observation comments
├── taxonomy/           # Bird taxonomy tree, search, stats
├── ml/                 # Proxy controller + HTTP client for the ML Service
├── storage/            # MinIO wrapper (StorageService) + avatar endpoint
├── security/           # JWT filter chain, JwtService, UserDetails impl
├── config/             # MinIO, Jackson, Nominatim property beans
├── startup/            # MockImageMigrationRunner (syncs seed images → MinIO)
└── common/             # Shared utilities and base response types
```

### Package Descriptions

| Package | Responsibility |
|---|---|
| `auth` | Issues / validates JWTs; manages refresh-token rotation |
| `user` | CRUD for user profiles; password change; per-user observation stats |
| `observation` | Central domain: create / read / update observations; paginated list with 10+ filter dimensions; lightweight map response; per-user feeds |
| `identification` | Submit / withdraw species identifications; triggers quality-grade re-evaluation on every change |
| `comment` | Simple comment CRUD scoped to an observation |
| `taxonomy` | Full bird taxonomy tree (Class → Order → Family → Genus → Species); search by name; top observers / identifiers per taxon |
| `ml` | Forwards multipart image uploads to the ML Service and returns ranked predictions to the frontend |
| `storage` | Abstracts MinIO operations (upload, delete, presigned URL generation); handles avatar uploads separately |
| `security` | Stateless JWT filter, per-request principal extraction, security filter chain wiring |
| `config` | `@ConfigurationProperties` beans for MinIO, JWT, and Nominatim |
| `startup` | `ApplicationRunner` that scans mock-observation images on startup and downloads any externally hosted URLs into MinIO |
| `common` | Shared mappers, pagination helpers, error response structure |

---

## API Endpoints

### Authentication — `/api/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/auth/register` | Public | Create a new account |
| `POST` | `/api/auth/login` | Public | Obtain access + refresh tokens |
| `POST` | `/api/auth/refresh` | Cookie | Exchange refresh-token cookie for a new access token |
| `POST` | `/api/auth/logout` | Bearer | Invalidate refresh token & clear cookie |

### Users — `/api/v1/users`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/v1/users/{id}` | Public | Get user profile |
| `PUT` | `/api/v1/users/{id}` | Bearer (owner) | Update display name / bio |
| `PUT` | `/api/v1/users/{id}/password` | Bearer (owner) | Change password |
| `POST` | `/api/v1/users/{id}/avatar` | Bearer (owner) | Upload avatar image |
| `DELETE` | `/api/v1/users/{id}/avatar` | Bearer (owner) | Remove avatar |

### Observations — `/api/v1/observations`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/v1/observations` | Public | Paginated list with filters (search, grade, taxon, user, date range, bounding box) |
| `POST` | `/api/v1/observations` | Bearer | Create observation (multipart: images + metadata) |
| `GET` | `/api/v1/observations/{id}` | Public | Full observation detail |
| `PUT` | `/api/v1/observations/{id}` | Bearer (owner) | Edit description / date / images |
| `DELETE` | `/api/v1/observations/{id}` | Bearer (owner) | Delete observation |
| `GET` | `/api/v1/observations/map` | Public | Lightweight markers for the map view |
| `GET` | `/api/v1/observations/user/{userId}/stats` | Public | Observation count + unique species count for a user |

### Identifications — `/api/v1/observations/{id}/identifications`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/v1/observations/{id}/identifications` | Public | List identifications for an observation |
| `POST` | `/api/v1/observations/{id}/identifications` | Bearer | Submit a species identification |
| `DELETE` | `/api/v1/observations/{id}/identifications/{identId}` | Bearer (owner) | Withdraw an identification |

### Comments — `/api/v1/observations/{id}/comments`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/v1/observations/{id}/comments` | Public | List comments for an observation |
| `POST` | `/api/v1/observations/{id}/comments` | Bearer | Post a comment |
| `DELETE` | `/api/v1/observations/{id}/comments/{commentId}` | Bearer (owner) | Delete a comment |

### Taxonomy — `/api/v1/taxa`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/v1/taxa` | Public | Paginated taxon search (name, rank, parent) |
| `GET` | `/api/v1/taxa/{id}` | Public | Full taxon detail + ancestry breadcrumb |
| `GET` | `/api/v1/taxa/{id}/children` | Public | Direct children of a taxon node |
| `GET` | `/api/v1/taxa/{id}/observations` | Public | Recent observations for a taxon |
| `GET` | `/api/v1/taxa/{id}/top-observers` | Public | Top observers for a taxon |
| `GET` | `/api/v1/taxa/{id}/top-identifiers` | Public | Top identifiers for a taxon |

### ML Service Proxy — `/api/v1/ml`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/ml/predict` | Bearer | Forward an image to the ML Service, return top-K species predictions |

---

## Authentication & Security

BirdSight uses a **dual-token** stateless auth flow:

| Token | Storage | Lifetime | Purpose |
|-------|---------|----------|---------|
| **Access token** (JWT) | In-memory only (frontend `tokenStore`) | 15 minutes | Bearer header on every authenticated request |
| **Refresh token** (JWT) | `httpOnly; SameSite=Lax` cookie | 7 days | Silent re-authentication without re-login |

**Flow:**

1. `POST /api/auth/login` → backend issues access token (body) + refresh token (cookie).
2. Frontend stores access token in memory; browser stores the cookie automatically.
3. On 401 responses, the frontend `apiClient` silently calls `POST /api/auth/refresh` to get a new access token, then retries the original request.
4. `POST /api/auth/logout` invalidates the refresh token server-side and clears the cookie.

The `JwtAuthenticationFilter` runs on every request, reads the `Authorization: Bearer <token>` header, and populates the `SecurityContext`. Protected routes are enforced in `SecurityConfig`.

---

## Data Layer

### Flyway Migrations

Schema and seed data are managed entirely by Flyway. Migrations run automatically on startup.

| Version | Description |
|---------|-------------|
| V1 | Create `users` table |
| V2 | Insert initial mock users |
| V3 | Update mock user password hashes |
| V4 | Add `avatar_url` column to users |
| V5 | Enable PostGIS extension; create taxonomy tables |
| V6 | Create `observations` table (with PostGIS `POINT` geometry) |
| V7 | Create `identifications` table |
| V8 | Create `comments` table |
| V9 | Seed core bird taxonomy (30 species, 7 ranks) |
| V10 | Seed mock observations from iNaturalist |
| V11 | Nullify legacy external avatar URLs |
| V12 | Add `Class Aves` node and additional taxon fields |
| V13 | Insert full bird taxonomy with taxon images (~3 MB) |
| V14 | Insert final mock users |
| V15 | Insert final mock observations (~145 KB) |

### Spatial Data

Observation coordinates are stored as a PostGIS `geometry(Point, 4326)` column. Hibernate Spatial enables JPQL / Criteria API predicates on geometric types (bounding-box filtering on the map endpoint).

---

## Quality Grade Logic

Every observation carries one of two quality grades: **Needs ID** or **Research Grade**.

Grade is re-evaluated every time an identification is submitted or withdrawn:

1. Collect all **non-withdrawn** identifications for the observation.
2. Find the **community taxon** — the lowest taxon in the tree that is an ancestor of (or equal to) more than two-thirds of all identifications.
3. If the community taxon is at **Species** rank and two or more users have agreed, the grade becomes **Research Grade**; otherwise it stays **Needs ID**.
4. Identifications submitted *after* a disagreement was already present are evaluated against the consensus at the time they were submitted (chronological disagreement logic), so valid follow-on agreements are never incorrectly penalised.

---

## Image Storage

All user-uploaded images (observation photos and avatars) are stored in a **MinIO** `images` bucket. The `StorageService` wraps the MinIO Java SDK and exposes:

- `upload(bucketName, objectKey, inputStream, contentType)` — stores an object and returns its public URL.
- `delete(bucketName, objectKey)` — removes an object.

On startup, `MockImageMigrationRunner` scans all seed-observation image URLs. Any URL pointing to an external host (e.g., iNaturalist CDN) is downloaded and re-uploaded to the local MinIO instance so the platform is fully self-contained.

The MinIO bucket is created with **anonymous read** access by the `minio-init` container in Docker Compose, so image URLs are publicly accessible without presigned tokens.

---

## ML Service Integration

The `MLServiceClient` uses OkHttp to forward multipart image data to the ML Service's `POST /predict` endpoint and returns the top-K predictions. The `MLController` exposes this as a backend endpoint (`POST /api/v1/ml/predict`) so the frontend never contacts the ML Service directly, keeping the CORS surface minimal.

---

## Configuration

All properties are in `src/main/resources/application.properties` and support environment variable overrides.

| Property | Env Variable | Default | Description |
|----------|-------------|---------|-------------|
| `spring.datasource.url` | `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/birdsight` | PostgreSQL JDBC URL |
| `spring.datasource.username` | `SPRING_DATASOURCE_USERNAME` | `birdsight_user` | DB username |
| `spring.datasource.password` | `SPRING_DATASOURCE_PASSWORD` | `birdsight_pass` | DB password |
| `app.jwt.secret` | `JWT_SECRET` | (dev default) | 256-bit HMAC-SHA secret |
| `app.jwt.access-token-expiration` | — | `900000` ms (15 min) | Access token TTL |
| `app.jwt.refresh-token-expiration` | — | `604800000` ms (7 days) | Refresh token TTL |
| `app.jwt.refresh-cookie-name` | — | `refresh_token` | Cookie name |
| `app.minio.endpoint` | `MINIO_ENDPOINT` | `http://localhost:9000` | MinIO server URL |
| `app.minio.access-key` | `MINIO_ACCESS_KEY` | `birdsight_minio` | MinIO access key |
| `app.minio.secret-key` | `MINIO_SECRET_KEY` | `birdsight_minio_secret` | MinIO secret key |
| `app.minio.bucket-name` | `MINIO_BUCKET_NAME` | `images` | Storage bucket |
| `app.ml-service.url` | `ML_SERVICE_URL` | `http://localhost:8000` | ML Service base URL |
| `app.ml-service.timeout` | — | `30000` ms | ML Service request timeout |
| `app.nominatim.enabled` | `NOMINATIM_ENABLED` | `true` | Enable reverse geocoding |
| `app.nominatim.base-url` | `NOMINATIM_BASE_URL` | `https://nominatim.openstreetmap.org` | Nominatim base URL |
| `app.nominatim.timeout-millis` | `NOMINATIM_TIMEOUT_MILLIS` | `3000` | Nominatim request timeout |

---

## Running Locally

### Prerequisites

- Java 21+
- Maven (or use the included `mvnw` / `mvnw.cmd` wrapper)
- Docker & Docker Compose (for PostgreSQL + MinIO)

### Steps

**1. Start infrastructure services**

From the repository root:

```powershell
docker compose up -d
```

This starts:
- PostgreSQL (port `5432`) — database + PostGIS
- MinIO (port `9000` API / `9001` Console)
- `minio-init` — creates the `images` bucket with public-read access

**2. Start the backend**

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The API starts on **`http://localhost:8080`**. Flyway runs all migrations automatically on first start.

**3. Verify**

```powershell
curl http://localhost:8080/api/auth/health
```

---

## Project Structure

```
backend/
├── pom.xml                                # Maven build descriptor
├── mvnw / mvnw.cmd                        # Maven wrapper scripts
└── src/
    ├── main/
    │   ├── java/com/birdsight/
    │   │   ├── BirdSightApplication.java  # Entry point
    │   │   ├── auth/                      # Authentication domain
    │   │   ├── user/                      # User management domain
    │   │   ├── observation/               # Observation domain
    │   │   ├── identification/            # Identification domain
    │   │   ├── comment/                   # Comments domain
    │   │   ├── taxonomy/                  # Taxonomy domain
    │   │   ├── ml/                        # ML Service proxy
    │   │   ├── storage/                   # MinIO integration
    │   │   ├── security/                  # JWT filter chain
    │   │   ├── config/                    # Property beans
    │   │   ├── startup/                   # Startup tasks
    │   │   └── common/                    # Shared utilities
    │   └── resources/
    │       ├── application.properties     # App configuration
    │       └── db/migration/              # Flyway SQL migrations (V1–V15)
    └── test/                              # Unit & integration tests
```

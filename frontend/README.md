# BirdSight — Frontend

Next.js 16 / React 19 / TypeScript web client for the BirdSight bird-observation platform. It provides the full user-facing experience: submitting observations with AI-assisted species identification, community identification and discussion, an interactive map, taxonomy browsing, user profiles, and account management.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [App Structure](#app-structure)
- [Key Pages](#key-pages)
- [Frontend Architecture](#frontend-architecture)
- [Authentication Flow](#authentication-flow)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Project Structure](#project-structure)

---

## Tech Stack

| Component              | Detail                                              |
|------------------------|-----------------------------------------------------|
| **Framework**          | Next.js 16                                          |
| **UI Library**         | React 19                                            |
| **Language**           | TypeScript 5                                        |
| **Styling**            | Tailwind CSS 4 + vanilla CSS                        |
| **Font**               | Geist (via `geist` npm package)                     |
| **Icons**              | Lucide React                                        |
| **Map**                | MapLibre GL 5 + react-map-gl 8                      |
| **Image Cropping**     | react-image-crop 11                                 |
| **Date Picker**        | react-day-picker 9                                  |
| **Linting**            | ESLint 9 + eslint-config-next                       |

---

## App Structure

The app uses the Next.js 13+ App Router. All source lives under `app/`.

```
app/
├── layout.tsx              # Root layout (AuthProvider, global styles)
├── page.tsx                # Landing page (/)
├── globals.css             # Global CSS reset + design tokens
│
├── (auth)/                 # Auth route group (no navbar)
│   ├── login/              # /login
│   └── register/           # /register
│
├── observations/
│   ├── page.tsx            # /observations — paginated, filterable list
│   ├── [id]/               # /observations/:id — detail view
│   └── new/                # /observations/new — create observation
│
├── map/                    # /map — interactive bird sighting map
├── identify/               # /identify — community identification queue
├── taxonomy/               # /taxonomy — taxonomy browser + detail
├── profile/                # /profile/:id — user profile page
├── settings/               # /settings — account settings
│
├── components/
│   ├── auth/               # Login / register forms
│   ├── landing/            # Hero, HowItWorks, RecentObservations sections
│   ├── observation/        # ObservationCard, ObservationDetail, EditModal, etc.
│   ├── observations/       # Observations page filter bar, list layout
│   ├── explore/            # Map component, cluster/heatmap layers
│   ├── identify/           # Identify modal and activity feed
│   └── shared/             # UserAvatar, UserDropdown (cross-cutting)
│
├── lib/                    # Service layer (API calls)
│   ├── apiClient.ts        # Authenticated fetch wrapper with silent refresh
│   ├── authService.ts      # login / logout / register
│   ├── observationService.ts # Observations, identifications, comments, stats
│   ├── taxonomyService.ts  # Taxa search and detail
│   ├── mlService.ts        # ML species prediction proxy
│   └── userService.ts      # User profile and avatar management
│
├── context/
│   └── AuthContext.tsx     # React context: current user + token management
│
├── hooks/
│   └── useAuth.ts          # Convenience hook for AuthContext
│
├── types/
│   ├── auth.ts             # Auth request/response types
│   ├── explore.ts          # Observation, identification, taxon, map types
│   └── landing.ts          # Landing-page-specific types
│
└── constants/              # Shared string constants
```

---

## Key Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — hero, how-it-works walkthrough, live recent observations feed |
| `/observations` | Paginated observation list with 10+ filter dimensions (text, grade, taxon, user, date range, bounding box) |
| `/observations/:id` | Full observation detail: photo gallery, activity feed (identifications + comments), community taxon, quality grade, mini-map |
| `/observations/new` | Multi-step new-observation wizard: photo upload with crop, AI species suggestions, taxon search, date/time, location picker |
| `/map` | Interactive MapLibre GL map — heatmap → cluster → point layers, sidebar with filtered observation cards |
| `/identify` | Community identification queue filtered to observations the current user has not yet identified |
| `/taxonomy` | Browsable bird taxonomy tree with search, per-taxon stats (observations, top observers, top identifiers) |
| `/profile/:id` | User profile — hero banner, stats cards (observation count, species count), recent observation grid |
| `/settings` | Account settings — update display name, bio, avatar, change password |
| `/login` / `/register` | Authentication forms |

---

## Frontend Architecture

### API Client (`lib/apiClient.ts`)

A thin `fetch` wrapper with three responsibilities:

1. **Bearer injection** — reads the access token from the in-memory `tokenStore` and adds an `Authorization` header automatically.
2. **Silent refresh** — on a `401` response, it calls `POST /api/auth/refresh` (which sends the httpOnly cookie automatically), stores the new access token, and retries the original request once.
3. **Error normalisation** — maps HTTP error responses into typed `ApiError` instances, including validation error details.

The access token is **never written to `localStorage` or `sessionStorage`** — it lives only in the module-level `_accessToken` variable, so it is cleared on tab close.

### Auth Context (`context/AuthContext.tsx`)

Wraps the entire app via `layout.tsx`. On mount it attempts a silent token refresh to restore the session from the httpOnly cookie. It exposes:

- `user` — the currently authenticated user (or `null`)
- `login(credentials)` / `logout()` — mutate both the context and the token store
- `isLoading` — signals whether the initial session check is still in progress

### Service Layer (`lib/`)

Each file in `lib/` maps to a domain:

| Service | Key functions |
|---------|---------------|
| `apiClient.ts` | `apiClient.get/post/put/delete/postForm/putForm`, `tokenStore`, `ApiError` |
| `authService.ts` | `login`, `logout`, `register` |
| `observationService.ts` | `fetchAllObservations`, `fetchObservationDetail`, `fetchMapObservations`, `createObservation`, `updateObservation`, `addIdentification`, `withdrawIdentification`, `addComment`, `fetchUserStats` |
| `taxonomyService.ts` | `fetchTaxon`, `fetchTaxonChildren`, `fetchTaxonObservations`, `fetchTopObservers`, `fetchTopIdentifiers` |
| `mlService.ts` | `predictSpecies` — posts an image to the backend ML proxy and returns ranked predictions |
| `userService.ts` | `fetchUser`, `updateUser`, `uploadAvatar`, `deleteAvatar`, `changePassword` |

### API Proxy (Next.js rewrites)

All `/api/*` requests are rewritten to `http://localhost:8080/api/*` via `next.config.ts`, so the frontend never exposes the backend's host/port directly.

---

## Authentication Flow

```
Page load
  │
  ▼
AuthContext mounts → POST /api/auth/refresh (with httpOnly cookie)
  ├─ 200 → store access token in memory; set user state
  └─ 4xx → user is unauthenticated

Authenticated request
  │
  ├─ apiClient injects Bearer token
  ├─ 200 → proceed normally
  └─ 401 → silent refresh → retry once
              └─ Still 401 → clear token; throw ApiError(401)

Logout
  │
  └─ POST /api/auth/logout → backend clears cookie + invalidates refresh token
       └─ tokenStore.clear() + user = null
```

---

## Environment Variables

Create a `.env.local` file in the `frontend/` directory if you need to override the API base URL:

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `""` (empty — uses Next.js rewrites) | Override to point directly at a remote backend |

When `NEXT_PUBLIC_API_URL` is empty (the default), all `/api/*` calls are handled by the Next.js rewrite proxy defined in `next.config.ts`, which forwards them to `http://localhost:8080`.

---

## Running Locally

**Prerequisites:** Node.js 20+ and npm.

```powershell
cd frontend
npm install
npm run dev
```

The app starts on **`http://localhost:3000`**.

**Other scripts:**

| Script | Command | Description |
|--------|---------|-------------|
| Dev server | `npm run dev` | Hot-reload development server |
| Production build | `npm run build` | Compile and optimise for production |
| Production server | `npm run start` | Serve the production build |
| Lint | `npm run lint` | Run ESLint across all source files |

---

## Project Structure

```
frontend/
├── package.json            # Dependencies and scripts
├── next.config.ts          # Next.js config (API rewrite proxy)
├── tsconfig.json           # TypeScript configuration
├── eslint.config.mjs       # ESLint configuration
├── postcss.config.mjs      # PostCSS / Tailwind config
├── public/                 # Static assets (favicon, images)
└── app/                    # All application source (App Router)
    ├── layout.tsx
    ├── page.tsx
    ├── globals.css
    ├── (auth)/
    ├── observations/
    ├── map/
    ├── identify/
    ├── taxonomy/
    ├── profile/
    ├── settings/
    ├── components/
    ├── lib/
    ├── context/
    ├── hooks/
    ├── types/
    └── constants/
```

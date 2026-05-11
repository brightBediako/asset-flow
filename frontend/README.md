# AssetFlow frontend

React (Vite) client for AssetFlow. Uses session cookies (`withCredentials`) against the Spring Boot API.

## Prerequisites

- Node.js 22+ (matches repo tooling)
- Backend running (default **http://localhost:8080**)

## Setup

```bash
npm install
```

## Environment

Copy the example file and adjust if needed:

```bash
cp .env.example .env
```

| Variable            | Typical local value         | Notes                                                                                                              |
| ------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `VITE_API_BASE_URL` | `"/api"`                    | Relative URL: Vite dev server **proxies** `/api` and `/uploads` to `http://localhost:8080` (see `vite.config.ts`). |
| `VITE_API_BASE_URL` | `http://localhost:8080/api` | Use when you do not rely on the proxy (e.g. custom tooling).                                                       |

## Run locally

```bash
npm run dev
```

Default dev URL: **http://localhost:3000** (see `package.json` `dev` script).

Ensure `CORS_ALLOWED_ORIGINS` on the backend includes your dev origin (e.g. `http://localhost:3000`) so the browser can send cookies.

## Build

```bash
npm run build
npm run preview   # optional: serve production build
```

## Roles and navigation

- **`SUPER_ADMIN` / `ORG_ADMIN`** – dashboard, org/users/assets (as permitted), bookings, maintenance, etc.
- **`USER`** – after login, the app routes to **Book an asset** (`/app/book`); **My Bookings** and **Profile** are available from the sidebar.

Do not bookmark only `/app` as a standard user: the dashboard there is admin-oriented; the app redirects `USER` to the booking flow.

## Documentation

- Repo overview and API: [../README.md](../README.md), [../API.md](../API.md)

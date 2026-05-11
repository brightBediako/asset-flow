# AssetFlow

A centralized API for organizations to manage, track, and book shared physical assets. Multi-tenant, role-based, with audit logging.

## Overview

- **Organizations** – tenants; own users and assets
- **Users & roles** – email/password auth, role-based access (`SUPER_ADMIN`, `ORG_ADMIN`, `USER`)
- **Assets & categories** – per-organization assets; categories can be **per organization** or **global** (`organization_id` null on `asset_category` for system-wide categories created by `SUPER_ADMIN`)
- **Bookings** – request, approve/reject, check-in/check-out; pricing fields in GHS where applicable
- **Maintenance** – records per asset
- **Audit logs** – read-only activity logs per organization

## Tech stack

- Java 25, Spring Boot 4
- Spring Data JPA, PostgreSQL
- Spring Security (session-based auth, BCrypt, `ASSETFLOW_SESSION` cookie)
- Spring Actuator (health, info)
- Optional: [dotenv-java](https://github.com/cdimascio/dotenv-java) loads a project-root `.env` when present

## Prerequisites

- JDK 25
- Maven
- PostgreSQL (e.g. local on port 5432)

## Local setup (without Docker)

1. **Database**

   Create a database named `assetflow` (or set `DB_URL` accordingly):

   ```sql
   CREATE DATABASE assetflow;
   ```

   Reference DDL aligned with JPA lives at **`src/main/resources/db/schema.sql`**. New installs should use definitions there (including nullable `asset_category.organization_id` for global categories).

   **Existing databases** that still have `asset_category.organization_id NOT NULL` should run once:

   ```sql
   ALTER TABLE asset_category ALTER COLUMN organization_id DROP NOT NULL;
   ```

   On startup, the app also attempts this compatibility step for PostgreSQL/H2 when the datasource is available.

2. **Backend configuration**

   Environment variables (or `.env` in the project root if you use one):

   - `DB_URL` (default: `jdbc:postgresql://localhost:5432/assetflow`)
   - `DB_USERNAME` (default: `postgres`)
   - `DB_PASSWORD` (required for PostgreSQL; set in your environment)
   - `CORS_ALLOWED_ORIGINS` (comma-separated; default includes `http://localhost:5173` and `http://localhost:3000`)
   - Optional: `JPA_DDL_AUTO`, `SERVER_PORT`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (seeded `SUPER_ADMIN` when no user with that email exists)

3. **Run backend**

   ```bash
   mvn spring-boot:run
   ```

   API base URL: **http://localhost:8080**  
   API routes are under **`/api`** (see [API.md](API.md)).

## Frontend (React)

The SPA lives in **`frontend/`**. See **[frontend/README.md](frontend/README.md)** for install, dev server port, and API proxy notes.

## API

Full endpoint list and auth flow: **[API.md](API.md)**  

Postman collection: [postman/AssetFlow-API.postman_collection.json](postman/AssetFlow-API.postman_collection.json)

## Roles and access (summary)

- Roles are seeded at startup when missing: `SUPER_ADMIN`, `ORG_ADMIN`, `USER`.
- A default `SUPER_ADMIN` is created if no user exists with `app.seed.admin.email` (see `application.properties`).
- **Fine-grained rules** (which HTTP methods and paths each role may call) are defined in `SecurityConfig.java`. The [API.md](API.md) table is the high-level map; behavior for assets, categories, and public catalog endpoints follows the security filter chain.

## Production deployment notes

1. Set `DB_PASSWORD` from a secret manager (do not hardcode).
2. Set `CORS_ALLOWED_ORIGINS` to your frontend domain(s).
3. Put TLS at the reverse proxy/load balancer and set:
   - `SESSION_COOKIE_SECURE=true`
   - `SESSION_COOKIE_SAME_SITE=none` (only when frontend and backend are cross-site over HTTPS)

## Project structure

```
src/main/java/com/assetflow/assetflow/
├── AssetflowApplication.java
├── config/          # Security, CORS, seeding, schema compatibility
├── controller/      # REST endpoints
├── service/
├── repository/
├── entity/
├── dto/
└── exception/

src/main/resources/
├── application.properties
└── db/schema.sql    # PostgreSQL reference schema
```

## License

Proprietary.

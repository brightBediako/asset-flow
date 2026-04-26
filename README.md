# AssetFlow

A centralized API for organizations to manage, track, and book shared physical assets. Multi-tenant, role-based, with audit logging.

## Overview

- **Organizations** – tenants; own users and assets
- **Users & roles** – email/password auth, role-based access
- **Assets & categories** – per-organization, with status (Available, Reserved, In Use, Under Maintenance)
- **Bookings** – request, approve/reject, check-in/check-out
- **Maintenance** – records per asset
- **Audit logs** – read-only activity logs per organization

## Tech stack

- Java 25, Spring Boot 4
- Spring Data JPA, PostgreSQL
- Spring Security (session-based auth, BCrypt)

## Prerequisites

- JDK 25
- Maven
- Node.js 22+
- PostgreSQL (e.g. local on port 5432)

## Local setup (without Docker)

1. **Database**

   Create a database named `assetflow` (or update `application.properties`):

   ```sql
   CREATE DATABASE assetflow;
   ```

2. **Backend configuration**

   Set environment variables:

   - `DB_URL` (default: `jdbc:postgresql://localhost:5432/assetflow`)
   - `DB_USERNAME` (default: `postgres`)
   - `DB_PASSWORD` (required)
   - `SPRING_PROFILES_ACTIVE` (`dev` or `prod`, default `dev`)
   - `CORS_ALLOWED_ORIGINS` (comma-separated, default `http://localhost:5173`)
   - Optional: `JPA_DDL_AUTO`, `SERVER_PORT`

3. **Run backend**

   ```bash
   mvn spring-boot:run
   ```

   API base URL: **http://localhost:8080**

## Frontend (React)

A frontend app is available in `frontend/`.

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Configure env:

   ```bash
   cp .env.example .env
   ```

   - `VITE_API_BASE_URL` points to the backend API, e.g. `http://localhost:8080/api`

3. Start frontend:

   ```bash
   npm run dev
   ```

   Frontend URL: **http://localhost:5173**

## Docker quick start

Run the full stack (Postgres + backend + frontend):

```bash
docker compose up --build
```

- Frontend: `http://localhost:8081`
- Backend API: `http://localhost:8080/api`

## API

Full endpoint list and auth flow: **[API.md](API.md)**  

Postman collection: [postman/AssetFlow-API.postman_collection.json](postman/AssetFlow-API.postman_collection.json)

## Roles and access

- Seed roles in the `role` table (for example): `SUPER_ADMIN`, `ORG_ADMIN`, `USER`.
- Assign `SUPER_ADMIN` to at least one user; this role can manage roles, users, and organizations.
- Access rules:
  - Public: `/api/auth/**` (register, login, me)
  - `SUPER_ADMIN` only: `/api/roles/**`, `/api/users/**`, `/api/organizations/**`
  - Authenticated (any role): other `/api/**` endpoints

## Production deployment notes

1. Set `SPRING_PROFILES_ACTIVE=prod`.
2. Set `DB_PASSWORD` from a secret manager (do not hardcode).
3. Set `CORS_ALLOWED_ORIGINS` to your frontend domain(s).
4. Keep `JPA_DDL_AUTO=validate` in production and manage schema changes via Flyway SQL migrations in `src/main/resources/db/migration`.
5. Put TLS at the reverse proxy/load balancer and set:
   - `SESSION_COOKIE_SECURE=true`
   - `SESSION_COOKIE_SAME_SITE=none` (only when frontend/backend are cross-site over HTTPS)

## Project structure

```
src/main/java/com/assetflow/assetflow/
├── AssetflowApplication.java
├── config/          # Security, CORS
├── controller/      # REST endpoints
├── service/
├── repository/
├── entity/
├── dto/
└── exception/
```

## License

Proprietary.

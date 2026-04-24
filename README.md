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
- PostgreSQL (e.g. local on port 5432)

## Setup

1. **Database**

   Create a database named `assetflow` (or update `application.properties`):

   ```sql
   CREATE DATABASE assetflow;
   ```

2. **Configuration**

   Edit `src/main/resources/application.properties` if needed:

   - `spring.datasource.url` – JDBC URL
   - `spring.datasource.username` – DB user
   - `spring.datasource.password` – provided via `DB_PASSWORD` env var (falls back to a local default)
   - `spring.jpa.hibernate.ddl-auto` – driven by `JPA_DDL_AUTO` env var (`update` in dev, `none`/`validate` in prod)

3. **Run**

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

   - `VITE_API_BASE_URL` points to the backend API
   - `VITE_USE_MOCK_DATA=true` runs UI against local mock data

3. Start frontend:

   ```bash
   npm run dev
   ```

   Frontend URL: **http://localhost:5173**

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

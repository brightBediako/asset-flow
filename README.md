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
   - `spring.datasource.username` / `spring.datasource.password` – DB credentials

3. **Run**

   ```bash
   mvn spring-boot:run
   ```

   API base URL: **http://localhost:8080**

## API

Full endpoint list and auth flow: **[API.md](API.md)**  

Postman collection: [postman/AssetFlow-API.postman_collection.json](postman/AssetFlow-API.postman_collection.json)

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

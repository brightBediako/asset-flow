# AssetFlow API

Base URL: **http://localhost:8080**

## Overview

| Area            | Base path                   | Auth |
|-----------------|-----------------------------|------|
| Auth            | `/api/auth`                 | Public (login/register); `/me` requires login |
| Organizations   | `/api/organizations`        | Required |
| Users           | `/api/users`                | Required |
| Roles           | `/api/roles`                | Required |
| Asset categories| `/api/asset-categories`     | Required |
| Assets          | `/api/assets`               | Required |
| Bookings        | `/api/bookings`             | Required |
| Maintenance     | `/api/maintenance-records`  | Required |
| Audit logs      | `/api/audit-logs`           | Required |

## Auth flow

1. **Register** – `POST /api/auth/register`  
   Body: `email`, `password`, `fullName`, `roleId`, optional `organizationId`.

2. **Login** – `POST /api/auth/login`  
   Body: `email`, `password`.  
   Response sets session cookie; send the same cookie with other requests.

3. **Current user** – `GET /api/auth/me`  
   Returns the authenticated user (requires session from login).

## Endpoints by resource

### Auth

| Method | Path                 | Description |
|--------|----------------------|-------------|
| POST   | `/api/auth/register` | Create user (roleId required) |
| POST   | `/api/auth/login`    | Authenticate, set session |
| GET    | `/api/auth/me`      | Current user |

### Organizations

| Method | Path                       | Description |
|--------|----------------------------|-------------|
| GET    | `/api/organizations`        | List all |
| GET    | `/api/organizations/{id}`   | Get by id |
| POST   | `/api/organizations`        | Create |
| PUT    | `/api/organizations/{id}`   | Update |
| DELETE | `/api/organizations/{id}`   | Delete |

### Roles

| Method | Path                 | Description |
|--------|----------------------|-------------|
| GET    | `/api/roles`         | List all |
| GET    | `/api/roles/{id}`    | Get by id |
| POST   | `/api/roles`         | Create |
| PUT    | `/api/roles/{id}`    | Update |
| DELETE | `/api/roles/{id}`    | Delete |

### Users

| Method | Path                 | Description |
|--------|----------------------|-------------|
| GET    | `/api/users`         | List all; optional `?organizationId=` |
| GET    | `/api/users/{id}`    | Get by id |
| POST   | `/api/users`         | Create (expects passwordHash) |
| PUT    | `/api/users/{id}`    | Update |
| DELETE | `/api/users/{id}`    | Delete |

### Asset categories

| Method | Path                            | Description |
|--------|----------------------------------|-------------|
| GET    | `/api/asset-categories`          | List all; optional `?organizationId=` |
| GET    | `/api/asset-categories/{id}`    | Get by id |
| POST   | `/api/asset-categories`         | Create |
| PUT    | `/api/asset-categories/{id}`    | Update |
| DELETE | `/api/asset-categories/{id}`    | Delete |

### Assets

| Method | Path                 | Description |
|--------|----------------------|-------------|
| GET    | `/api/assets`        | List all; optional `?organizationId=` |
| GET    | `/api/assets/{id}`   | Get by id |
| POST   | `/api/assets`        | Create (status: AVAILABLE, RESERVED, IN_USE, UNDER_MAINTENANCE) |
| PUT    | `/api/assets/{id}`   | Update |
| DELETE | `/api/assets/{id}`    | Delete |

### Bookings

| Method | Path                 | Description |
|--------|----------------------|-------------|
| GET    | `/api/bookings`      | List all; optional `?organizationId=` |
| GET    | `/api/bookings/{id}` | Get by id |
| POST   | `/api/bookings`      | Create (status: PENDING, APPROVED, REJECTED, COMPLETED) |
| PUT    | `/api/bookings/{id}` | Update |
| DELETE | `/api/bookings/{id}` | Delete |

### Maintenance records

| Method | Path                              | Description |
|--------|------------------------------------|-------------|
| GET    | `/api/maintenance-records`         | List all; optional `?organizationId=` |
| GET    | `/api/maintenance-records/{id}`    | Get by id |
| POST   | `/api/maintenance-records`         | Create |
| PUT    | `/api/maintenance-records/{id}`    | Update |
| DELETE | `/api/maintenance-records/{id}`    | Delete |

### Audit logs

| Method | Path                       | Description |
|--------|----------------------------|-------------|
| GET    | `/api/audit-logs`           | List by org; required `?organizationId=`; optional `page`, `size` (default 20) |
| GET    | `/api/audit-logs/{id}`     | Get by id |

## Postman

Use the collection for ready-made requests:

- **File:** [postman/AssetFlow-API.postman_collection.json](postman/AssetFlow-API.postman_collection.json)

1. Import the JSON in Postman.
2. Set **baseUrl** to `http://localhost:8080` (or your server) in collection variables.
3. Run **Auth → Login** (or **Register** first) so the session cookie is stored.
4. Other requests will use the cookie automatically.

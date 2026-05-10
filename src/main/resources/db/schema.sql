-- AssetFlow PostgreSQL schema
-- Synced with JPA entities (Organization, Role, User, AssetCategory, Asset, Booking, MaintenanceRecord, AuditLog).
-- Status columns use VARCHAR to match @Enumerated(EnumType.STRING). Hibernate ddl-auto=update will align similarly.

-- Organizations (tenants)
CREATE TABLE IF NOT EXISTS organization (
    id                   BIGSERIAL PRIMARY KEY,
    name                 VARCHAR(255) NOT NULL,
    location             VARCHAR(255),
    contact_email        VARCHAR(255),
    contact_phone_number VARCHAR(40),
    created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Roles — referenced by user.role_id
CREATE TABLE IF NOT EXISTS role (
    id   BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO role (name) VALUES ('SUPER_ADMIN'), ('ORG_ADMIN'), ('USER')
ON CONFLICT (name) DO NOTHING;

-- User (reserved name — always quote in SQL: "user")
CREATE TABLE IF NOT EXISTS "user" (
    id              BIGSERIAL PRIMARY KEY,
    organization_id BIGINT REFERENCES organization(id) ON DELETE CASCADE,
    role_id         BIGINT NOT NULL REFERENCES role(id) ON DELETE RESTRICT,
    email           VARCHAR(255) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255),
    job_title       VARCHAR(120),
    phone_number    VARCHAR(40),
    location        VARCHAR(255),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (email)
);
CREATE INDEX IF NOT EXISTS idx_user_organization_id ON "user"(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_role_id ON "user"(role_id);

-- Asset categories (per organization)
CREATE TABLE IF NOT EXISTS asset_category (
    id              BIGSERIAL PRIMARY KEY,
    organization_id BIGINT REFERENCES organization(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, name)
);
CREATE INDEX IF NOT EXISTS idx_asset_category_organization_id ON asset_category(organization_id);

-- Assets
CREATE TABLE IF NOT EXISTS asset (
    id                BIGSERIAL PRIMARY KEY,
    organization_id   BIGINT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    category_id       BIGINT REFERENCES asset_category(id) ON DELETE SET NULL,
    name              VARCHAR(255) NOT NULL,
    description       TEXT,
    status            VARCHAR(32) NOT NULL DEFAULT 'AVAILABLE',
    image_url         VARCHAR(500),
    price_per_day_ghs NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_asset_status CHECK (status IN (
        'AVAILABLE', 'RESERVED', 'IN_USE', 'UNDER_MAINTENANCE'
    ))
);
CREATE INDEX IF NOT EXISTS idx_asset_organization_id ON asset(organization_id);
CREATE INDEX IF NOT EXISTS idx_asset_category_id ON asset(category_id);
CREATE INDEX IF NOT EXISTS idx_asset_status ON asset(status);

-- Bookings
CREATE TABLE IF NOT EXISTS booking (
    id               BIGSERIAL PRIMARY KEY,
    organization_id  BIGINT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    asset_id         BIGINT NOT NULL REFERENCES asset(id) ON DELETE CASCADE,
    user_id          BIGINT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    approved_by_id   BIGINT REFERENCES "user"(id) ON DELETE SET NULL,
    start_time       TIMESTAMPTZ NOT NULL,
    end_time         TIMESTAMPTZ NOT NULL,
    number_of_days   INTEGER NOT NULL DEFAULT 1,
    total_price_ghs  NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status           VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    checked_in_at    TIMESTAMPTZ,
    checked_out_at   TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_booking_times CHECK (end_time > start_time),
    CONSTRAINT chk_booking_status CHECK (status IN (
        'PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'
    ))
);
CREATE INDEX IF NOT EXISTS idx_booking_organization_id ON booking(organization_id);
CREATE INDEX IF NOT EXISTS idx_booking_asset_id ON booking(asset_id);
CREATE INDEX IF NOT EXISTS idx_booking_user_id ON booking(user_id);
CREATE INDEX IF NOT EXISTS idx_booking_asset_times ON booking(asset_id, start_time, end_time);

-- Maintenance records
CREATE TABLE IF NOT EXISTS maintenance_record (
    id              BIGSERIAL PRIMARY KEY,
    organization_id BIGINT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    asset_id        BIGINT NOT NULL REFERENCES asset(id) ON DELETE CASCADE,
    created_by_id   BIGINT REFERENCES "user"(id) ON DELETE SET NULL,
    description     TEXT NOT NULL,
    started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_maintenance_record_organization_id ON maintenance_record(organization_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_record_asset_id ON maintenance_record(asset_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_record_dates ON maintenance_record(asset_id, started_at, completed_at);

-- Audit log
CREATE TABLE IF NOT EXISTS audit_log (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT REFERENCES "user"(id) ON DELETE SET NULL,
    organization_id BIGINT REFERENCES organization(id) ON DELETE CASCADE,
    action          VARCHAR(50) NOT NULL,
    entity_type     VARCHAR(50) NOT NULL,
    entity_id       BIGINT,
    details         JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_organization_id ON audit_log(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);

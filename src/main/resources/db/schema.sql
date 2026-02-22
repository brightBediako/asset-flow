-- AssetFlow PostgreSQL schema
-- Core entities: Organization, Role, User, AssetCategory, Asset, Booking, MaintenanceRecord, AuditLog
-- Aligned with MVP entity relationship summary (Organization as tenant boundary).

-- Enums for status (Role is a table; see below). Idempotent: safe to re-run.
DO $$ BEGIN
    CREATE TYPE asset_status AS ENUM ('AVAILABLE', 'RESERVED', 'IN_USE', 'UNDER_MAINTENANCE');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Organizations (tenants) — central entity for multi-tenant isolation
CREATE TABLE IF NOT EXISTS organization (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Role — defines user permissions; one Role has many Users
CREATE TABLE IF NOT EXISTS role (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(50) NOT NULL UNIQUE
);
INSERT INTO role (name) VALUES ('SUPER_ADMIN'), ('ORG_ADMIN'), ('STAFF')
ON CONFLICT (name) DO NOTHING;

-- User — many Users belong to one Organization, many Users belong to one Role
CREATE TABLE IF NOT EXISTS "user" (
    id              BIGSERIAL PRIMARY KEY,
    organization_id BIGINT REFERENCES organization(id) ON DELETE CASCADE,
    role_id         BIGINT NOT NULL REFERENCES role(id) ON DELETE RESTRICT,
    email           VARCHAR(255) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(email)
);
CREATE INDEX IF NOT EXISTS idx_user_organization_id ON "user"(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_role_id ON "user"(role_id);

-- Asset categories (per organization)
CREATE TABLE IF NOT EXISTS asset_category (
    id              BIGSERIAL PRIMARY KEY,
    organization_id BIGINT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organization_id, name)
);
CREATE INDEX IF NOT EXISTS idx_asset_category_organization_id ON asset_category(organization_id);

-- Assets
CREATE TABLE IF NOT EXISTS asset (
    id              BIGSERIAL PRIMARY KEY,
    organization_id BIGINT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    category_id     BIGINT REFERENCES asset_category(id) ON DELETE SET NULL,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    status          asset_status NOT NULL DEFAULT 'AVAILABLE',
    image_url       VARCHAR(500),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_asset_organization_id ON asset(organization_id);
CREATE INDEX IF NOT EXISTS idx_asset_category_id ON asset(category_id);
CREATE INDEX IF NOT EXISTS idx_asset_status ON asset(status);

-- Booking — many Bookings belong to one Organization, one Asset, one User; no overlapping bookings per asset
CREATE TABLE IF NOT EXISTS booking (
    id             BIGSERIAL PRIMARY KEY,
    organization_id BIGINT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    asset_id       BIGINT NOT NULL REFERENCES asset(id) ON DELETE CASCADE,
    user_id        BIGINT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    approved_by_id BIGINT REFERENCES "user"(id) ON DELETE SET NULL,
    start_time     TIMESTAMPTZ NOT NULL,
    end_time       TIMESTAMPTZ NOT NULL,
    status         booking_status NOT NULL DEFAULT 'PENDING',
    checked_in_at  TIMESTAMPTZ,
    checked_out_at TIMESTAMPTZ,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_booking_times CHECK (end_time > start_time)
);
CREATE INDEX IF NOT EXISTS idx_booking_organization_id ON booking(organization_id);
CREATE INDEX IF NOT EXISTS idx_booking_asset_id ON booking(asset_id);
CREATE INDEX IF NOT EXISTS idx_booking_user_id ON booking(user_id);
CREATE INDEX IF NOT EXISTS idx_booking_asset_times ON booking(asset_id, start_time, end_time);

-- MaintenanceRecord — many MaintenanceRecords belong to one Organization, one Asset (asset under maintenance cannot be booked)
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

-- Audit log (user actions: asset creation, booking creation, status changes)
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

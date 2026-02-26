// AssetFlow DBML schema
// Core entities: Organization, Role, User, AssetCategory, Asset, Booking, MaintenanceRecord, AuditLog

Project asset_flow {
  database_type: 'PostgreSQL'
  Note: 'AssetFlow core schema defined in DBML (source of truth for ERD & SQL)'
}

enum asset_status {
  AVAILABLE
  RESERVED
  IN_USE
  UNDER_MAINTENANCE
}

enum booking_status {
  PENDING
  APPROVED
  REJECTED
  COMPLETED
}

Table organization {
  id bigint [pk, increment]
  name varchar(255) [not null]
  created_at timestamptz [not null, default: `now()`]

  Note: 'Organizations (tenants) — central entity for multi-tenant isolation'
}

Table role {
  id bigint [pk, increment]
  name varchar(50) [not null, unique]

  Note: 'Defines user permissions; seed roles: SUPER_ADMIN, ORG_ADMIN, STAFF'
}

Table "user" as User {
  id bigint [pk, increment]
  organization_id bigint
  role_id bigint [not null]
  email varchar(255) [not null, unique]
  password_hash varchar(255) [not null]
  full_name varchar(255)
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    organization_id [name: 'idx_user_organization_id']
    role_id [name: 'idx_user_role_id']
  }

  Note: 'Application users. Physical table is quoted in PostgreSQL as "user".'
}

Table asset_category {
  id bigint [pk, increment]
  organization_id bigint [not null]
  name varchar(100) [not null]
  created_at timestamptz [not null, default: `now()`]

  indexes {
    organization_id [name: 'idx_asset_category_organization_id']
    (organization_id, name) [unique, name: 'asset_category_organization_id_name_key']
  }

  Note: 'Per-organization asset groupings (e.g. Vehicles, Laptops, Rooms).'
}

Table asset {
  id bigint [pk, increment]
  organization_id bigint [not null]
  category_id bigint
  name varchar(255) [not null]
  description text
  status asset_status [not null, default: 'AVAILABLE']
  image_url varchar(500)
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    organization_id [name: 'idx_asset_organization_id']
    category_id [name: 'idx_asset_category_id']
    status [name: 'idx_asset_status']
  }

  Note: 'Track individual assets and their lifecycle state.'
}

Table booking {
  id bigint [pk, increment]
  organization_id bigint [not null]
  asset_id bigint [not null]
  user_id bigint [not null]
  approved_by_id bigint
  start_time timestamptz [not null]
  end_time timestamptz [not null]
  status booking_status [not null, default: 'PENDING']
  checked_in_at timestamptz
  checked_out_at timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    organization_id [name: 'idx_booking_organization_id']
    asset_id [name: 'idx_booking_asset_id']
    user_id [name: 'idx_booking_user_id']
    (asset_id, start_time, end_time) [name: 'idx_booking_asset_times']
  }

  checks {
    `end_time > start_time` [name: 'chk_booking_times']
  }

  Note: 'Bookings per asset; no overlapping bookings per asset enforced at the application/SQL level.'
}

Table maintenance_record {
  id bigint [pk, increment]
  organization_id bigint [not null]
  asset_id bigint [not null]
  created_by_id bigint
  description text [not null]
  started_at timestamptz [not null, default: `now()`]
  completed_at timestamptz
  created_at timestamptz [not null, default: `now()`]

  indexes {
    organization_id [name: 'idx_maintenance_record_organization_id']
    asset_id [name: 'idx_maintenance_record_asset_id']
    (asset_id, started_at, completed_at) [name: 'idx_maintenance_record_dates']
  }

  Note: 'Records planned or reactive maintenance; assets under maintenance should not be bookable.'
}

Table audit_log {
  id bigint [pk, increment]
  user_id bigint
  organization_id bigint
  action varchar(50) [not null]
  entity_type varchar(50) [not null]
  entity_id bigint
  details jsonb
  created_at timestamptz [not null, default: `now()`]

  indexes {
    user_id [name: 'idx_audit_log_user_id']
    organization_id [name: 'idx_audit_log_organization_id']
    created_at [name: 'idx_audit_log_created_at']
  }

  Note: 'User actions such as asset creation, booking changes, and status transitions.'
}

// Relationships & referential actions

Ref: User.organization_id > organization.id [delete: cascade]
Ref: User.role_id > role.id [delete: restrict]

Ref: asset_category.organization_id > organization.id [delete: cascade]

Ref: asset.organization_id > organization.id [delete: cascade]
Ref: asset.category_id > asset_category.id [delete: set null]

Ref: booking.organization_id > organization.id [delete: cascade]
Ref: booking.asset_id > asset.id [delete: cascade]
Ref: booking.user_id > User.id [delete: cascade]
Ref: booking.approved_by_id > User.id [delete: set null]

Ref: maintenance_record.organization_id > organization.id [delete: cascade]
Ref: maintenance_record.asset_id > asset.id [delete: cascade]
Ref: maintenance_record.created_by_id > User.id [delete: set null]

Ref: audit_log.user_id > User.id [delete: set null]
Ref: audit_log.organization_id > organization.id [delete: cascade]


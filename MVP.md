**AssetFlow**.

This is designed to:

* Be realistically buildable in one semester
* Demonstrate Advanced Software competence
* Avoid scope explosion
* Still look commercially viable

Anything outside this list is Phase 2.

---

# AssetFlow MVP Feature Scope

## 1. Core Objective of MVP

Deliver a working multi tenant asset booking system that:

* Supports multiple organizations
* Allows asset registration
* Enables booking and return
* Prevents double booking
* Enforces role based access
* Provides basic reporting

No AI. No complex analytics. No mobile app. No microservices.

---

# 2. MVP Functional Features

## 2.1 Authentication and Authorization

Included:

* User registration per organization
* Login with JWT
* Role based access control

  * Super Admin
  * Organization Admin
  * Staff/User

Not included:

* OAuth
* Social login
* Multi factor authentication

---

## 2.2 Organization Management

Included:

* Create organization
* Assign users to organization
* Role assignment

Not included:

* Organization billing integration
* Branding customization

---

## 2.3 Asset Management

Included:

* Add asset
* Edit asset
* Delete asset
* Asset category
* Asset status

  * Available
  * Reserved
  * In Use
  * Under Maintenance

Not included:

* QR code scanning
* Asset depreciation tracking
* Asset insurance integration

---

## 2.4 Booking System (Core Intelligence)

Included:

* Create booking request
* Approve or reject booking
* Start and end time
* Conflict detection
* Change asset status automatically
* Check in and check out process
* Booking status

  * Pending
  * Approved
  * Rejected
  * Completed

Critical logic required:

* No overlapping bookings allowed
* Transaction safe booking creation

Not included:

* Payment integration
* Automated penalties
* Calendar sync with Google

---

## 2.5 Maintenance Tracking (Basic)

Included:

* Log maintenance record
* Mark asset under maintenance
* Prevent booking during maintenance

Not included:

* Predictive maintenance
* Automatic scheduling

---

## 2.6 Reporting (Basic Analytics)

Included:

* List all bookings
* Filter by date
* Count total bookings per asset
* List late returns

Not included:

* Advanced analytics dashboard
* Data visualization graphs
* Export to Excel

---

## 2.7 Audit Logging (Basic)

Included:

* Log user actions

  * Asset creation
  * Booking creation
  * Status changes

Not included:

* Full event sourcing
* Advanced compliance tracking

---

# 3. MVP Non Functional Scope

Must Include:

* Layered architecture
* Clean separation of concerns
* DTO usage
* Proper validation
* Exception handling
* Database indexing on foreign keys
* Pagination on large queries
* Transaction management on booking

---

# 4. What Makes This MVP Strong

It demonstrates:

* Multi tenant data isolation
* Concurrency safe booking logic
* Role based access control
* Proper REST API structure
* Normalized database design
* SaaS ready architecture

This is enough to defend Advanced Software level.

---

# 5. What You Must Not Add in MVP

Do not add:

* AI modules
* Machine learning
* Microservices
* Real time websocket updates
* Mobile app
* Payment gateways
* Complex dashboards

Those are distractions.

---

# 7. Final MVP Definition in One Sentence

AssetFlow MVP is a multi tenant SaaS platform that allows organizations to manage, book, and monitor shared assets securely with conflict controlled scheduling and role based access.

---


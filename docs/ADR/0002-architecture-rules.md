# ADR-0002 — Architecture Rules Decision

## Status

Accepted

Locked

---

## Decision Date

2026

---

## Title

Momenta Architecture Rules

---

## Context

Momenta is designed as a long-term, production-grade application.

The project must:

* remain maintainable for years
* support future expansion
* avoid architectural drift
* prevent business logic from spreading into UI
* support a single developer workflow
* support future team growth
* remain understandable after long periods of inactivity

Historically, many applications become difficult to maintain because responsibilities become mixed across layers.

Momenta must avoid this.

---

# Decision

Momenta adopts strict layered architecture.

Responsibilities are clearly separated.

Each layer owns a specific concern.

No layer may violate its boundary.

---

# Core Rule

UI only displays.

Domain decides.

Repository manages data.

Service executes side effects.

Every critical operation is logged.

Every system is controlled from a single source.

SDKs are abstracted behind providers.

Control must not be lost as the codebase grows.

---

# Layer Ownership

## UI Layer

Responsibilities:

* rendering
* user interaction
* animation
* presentation

UI must never own:

* business logic
* premium decisions
* reminder calculations
* date calculations
* database access
* SDK calls

---

## Domain Layer

Responsibilities:

* product rules
* business logic
* calculations
* validations
* product decisions

Examples:

* overdue logic
* reminder eligibility
* insight generation
* category rules
* premium entitlement rules

The domain layer is the source of truth.

---

## Repository Layer

Responsibilities:

* reading data
* writing data
* persistence abstraction

Repositories own:

* SQLite access
* storage access
* import/export persistence

Repositories do not own business decisions.

---

## Service Layer

Responsibilities:

* orchestration
* side effects
* coordination

Examples:

* create moment workflow
* schedule reminder workflow
* update widget workflow
* audit logging workflow

Services coordinate systems.

Services do not own UI.

---

## Platform Layer

Responsibilities:

* notifications
* widgets
* billing SDK
* crash SDK
* analytics SDK
* secure storage

Platform integrations must be abstracted.

---

# Single Source Principle

Every global rule must have one owner.

Examples:

Theme:

* one owner

Localization:

* one owner

Premium plans:

* one owner

Reminder rules:

* one owner

Widget definitions:

* one owner

Feature flags:

* one owner

Global duplication is forbidden.

---

# Registry Principle

Global systems must use registries.

Examples:

* Category Registry
* Plan Registry
* Widget Registry
* Notification Registry
* Content Registry
* Settings Registry
* Analytics Registry

Registries prevent scattered logic.

---

# Business Logic Rule

Business logic is forbidden inside:

* screens
* components
* hooks created only for UI
* widgets

Business logic belongs to:

* domain
* services

only.

---

# Time Rule

Momenta is a time-based application.

All date calculations must use the Time Engine.

Forbidden:

new calculations inside screens.

Allowed:

Time Engine outputs.

---

# Premium Rule

Premium decisions must go through:

Premium Gate.

Forbidden:

if (isPremium)

scattered across the app.

Premium checks must be centralized.

---

# SDK Rule

No SDK may be called directly from:

* screens
* components
* domain

SDK access must go through providers.

Examples:

Billing Provider

Analytics Provider

Crash Provider

Notification Provider

Widget Provider

---

# Logging Rule

Every critical operation must be observable.

Examples:

* moment created
* moment deleted
* reminder scheduled
* widget refreshed
* migration started
* migration failed

Critical operations must produce logs.

---

# Error Rule

Errors must be mapped.

Developer receives:

* technical detail

User receives:

* localized human message

Raw errors are forbidden.

---

# Offline-first Rule

Every core product feature must function without internet.

The application must assume:

* no connection
* unstable connection
* airplane mode

Core functionality must continue working.

---

# Extensibility Rule

New features must be removable.

Before adding a feature:

Ask:

Can this be removed later without breaking the app?

If not:

the design must be reconsidered.

---

# Testability Rule

Every domain rule must be testable.

Examples:

* reminder logic
* insight logic
* premium logic
* category logic

Untestable logic is considered incomplete.

---

# Future Growth Rule

Future additions:

* cloud sync
* shared timelines
* AI features
* Apple Intelligence
* Siri integrations

must be added through dedicated domains.

Future growth must not modify core architectural boundaries.

---

# Consequences

Positive:

* predictable structure
* easier maintenance
* easier onboarding
* easier debugging
* safer scaling

Negative:

* slightly more upfront structure
* more discipline required

These tradeoffs are accepted.

---

# Final Statement

Momenta architecture is locked.

Any proposal that violates:

* layer ownership
* registry ownership
* single source principle
* SDK abstraction
* offline-first principle

requires a new ADR and architectural review.

Otherwise this architecture remains the standard.

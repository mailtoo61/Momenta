# Codex Agent Rules

## Purpose

This document defines how AI coding agents may work inside the Momenta codebase.

The goal is:

* predictable modifications
* minimal blast radius
* architectural safety
* maintainable patches
* reliable reviews

AI agents are powerful but must operate under strict constraints.

---

# Momenta Rule Hierarchy

The following documents are authoritative:

1. MOMENTA_BLUEPRINT.md
2. ARCHITECTURE.md
3. ROADMAP.md
4. ADR documents
5. REGISTRIES.md
6. CONTRIBUTING.md
7. This document

If a change conflicts with any higher document, the change must be rejected.

---

# Agent Role

The AI agent is not a product owner.

The AI agent is not an architect.

The AI agent is an implementation engineer.

The agent must implement within existing architecture.

The agent must not redesign the application without explicit instruction.

---

# Default Engineering Mindset

Assume:

* production application
* real users
* long-term maintenance
* future scaling
* future monetization

Avoid:

* shortcuts
* temporary hacks
* quick fixes
* hidden side effects

---

# Minimal Blast Radius Rule

Every change must affect the smallest possible surface.

Preferred:

* modify one file

Acceptable:

* modify a small group of related files

Avoid:

* touching unrelated systems

---

# Protected Systems

The following systems are protected.

Changes require explicit approval.

* architecture boundaries
* folder structure
* registries
* monetization contracts
* database schema
* migrations
* premium gates
* provider abstractions
* localization architecture
* theme architecture

---

# Forbidden Actions

Agents must never:

* delete large sections of code without justification
* bypass repositories
* bypass services
* bypass providers
* bypass premium gates
* hardcode UI text
* hardcode colors
* hardcode limits
* add business logic to UI
* add direct SDK usage

---

# Registry Rule

Before adding new constants ask:

Should this belong in a registry?

Examples:

* categories
* plans
* widgets
* notifications
* settings
* insight templates

Global constants belong in registries.

---

# Localization Rule

All user-facing text must use localization keys.

Forbidden:

raw strings inside screens.

Required:

translation keys.

---

# Theme Rule

All visual values must come from theme tokens.

Forbidden:

random colors

random spacing

random typography

Required:

theme system

semantic tokens

---

# Premium Rule

Premium decisions must go through:

Premium Gate

Plan Registry

Never scatter premium logic.

---

# SDK Rule

No direct SDK usage.

All SDK integrations must pass through:

* SDK Abstraction Layer
* Provider Registry

Examples:

Billing

Analytics

Crash

Notifications

Widgets

---

# Repository Rule

Repositories own persistence.

Agents must not:

* write SQLite code inside screens
* access storage from UI

Repositories only.

---

# Service Rule

Complex workflows belong in services.

Examples:

create moment

schedule reminder

update widget

restore purchase

Services orchestrate systems.

---

# Time Rule

All date calculations belong to Time Engine.

Forbidden:

custom date math in screens.

custom date math in widgets.

---

# Logging Rule

Critical operations must be logged.

Examples:

* create
* update
* delete
* archive
* restore
* migration
* reminder scheduling

If a critical operation is introduced, logging should be considered mandatory.

---

# Testing Rule

Every business rule change should include test impact analysis.

Verify:

* existing tests
* new tests if required

No unverified business rule changes.

---

# Migration Rule

Database migrations are high risk.

Agents must:

* explain migration purpose
* preserve existing data
* include rollback considerations
* verify version handling

---

# Provider Rule

Provider contracts are protected.

Changing a provider interface requires review.

Examples:

Billing Provider

Analytics Provider

Crash Provider

Notification Provider

Widget Provider

---

# Widget Rule

Widgets are a core Momenta feature.

Agents must not:

* calculate business logic inside widgets
* duplicate reminder logic inside widgets
* duplicate time logic inside widgets

Widgets display snapshots only.

---

# Import / Export Rule

Import and export contracts are versioned.

Agents must not:

* break older versions
* silently change schemas

Contract changes require version review.

---

# Accessibility Rule

Every UI modification must consider:

* VoiceOver
* Dynamic Type
* Reduce Motion
* contrast

Accessibility regressions are bugs.

---

# Performance Rule

Before introducing new code ask:

* does it increase renders?
* does it increase memory usage?
* does it affect widget refresh?
* does it affect reminder reliability?

Performance is part of correctness.

---

# Security Rule

Agents must not expose:

* private notes
* sensitive moments
* analytics secrets
* premium entitlement data

Security regressions are blockers.

---

# Required Patch Format

When making a change:

1. Problem
2. Root Cause
3. Files Changed
4. Implementation
5. Risks
6. Verification
7. Regression Assessment

This structure should be used whenever practical.

---

# Required Verification

Before declaring success verify:

* type safety
* architecture compliance
* localization compliance
* theme compliance
* premium compliance
* registry compliance

---

# Escalation Rule

If a requested change would violate:

* architecture
* registries
* provider contracts
* database contracts
* premium contracts

the agent should explain the conflict before implementation.

---

# Final Rule

The safest change that solves the problem is preferred over the largest change that solves the problem.

Maintainability is more important than cleverness.

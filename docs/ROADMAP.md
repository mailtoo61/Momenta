# Momenta Roadmap

## Purpose

This roadmap defines the implementation order of Momenta.

Rules:

* Build foundations before features.
* Build architecture before UI polish.
* Build systems before monetization.
* Build reliability before scale.
* Never skip phases.
* Never introduce business logic into UI.

---

# Phase 0 — Product Constitution & Project Foundation

## Goal

Lock the project rules before feature development.

## Deliverables

* MOMENTA_BLUEPRINT.md
* ARCHITECTURE.md
* ROADMAP.md
* ADR structure
* strict TypeScript configuration
* Expo SDK 56 setup
* React Native 0.85 setup
* Node.js 22.13.x minimum
* repository initialization

## Exit Criteria

* project rules are documented
* architecture is frozen
* coding standards are frozen

---

# Phase 1 — Foundation Centers

## Goal

Create all central management systems.

## Deliverables

* Configuration Center
* Feature Flag System
* Theme System
* Design Tokens
* Semantic Colors
* i18n Foundation
* Localization Dictionaries
* Design Language Foundation

## Exit Criteria

* no hardcoded text
* no hardcoded colors
* no hardcoded limits

---

# Phase 2 — App Shell

## Goal

Create the application shell.

## Deliverables

* Navigation Contract
* Zustand Store Foundation
* App Providers
* Empty States
* Error States
* Loading States
* Settings Skeleton
* Onboarding Skeleton

## Exit Criteria

* application launches
* navigation works
* shell structure frozen

---

# Phase 3 — Moments Domain

## Goal

Create Momenta's core entity.

## Deliverables

* Moment model
* Moment categories
* Category Registry
* Preset Templates
* Quick Add
* Moment creation flow
* Moment editing flow
* Moment deletion flow

## Exit Criteria

* moments can be created
* moments can be edited
* moments can be archived

---

# Phase 4 — Persistence Layer

## Goal

Persist data safely.

## Deliverables

* SQLite setup
* Repositories
* Migration Engine
* Archive System
* Soft Delete
* Undo System
* Recovery Foundation

## Exit Criteria

* data survives restart
* migrations work
* archive/restore works

---

# Phase 5 — Time Engine

## Goal

Create the centralized time system.

## Deliverables

* Elapsed calculations
* Countdown calculations
* Timezone handling
* Locale formatting
* Recurring rules
* Reminder calculations

## Exit Criteria

* all date calculations use Time Engine

---

# Phase 6 — Reminder System

## Goal

Build reliable reminder infrastructure.

## Deliverables

* Reminder Rule Center
* Notification Engine
* Reminder Scheduling
* Reliability Checker
* App Lifecycle Hooks

## Exit Criteria

* reminders schedule correctly
* reminders survive app restarts

---

# Phase 7 — Home Experience

## Goal

Create the first usable product experience.

## Deliverables

* Home Screen
* Upcoming Moments
* Overdue Moments
* Recent Moments
* Quick Add Entry Point

## Exit Criteria

* user can use app daily

---

# Phase 8 — Widget Foundation

## Goal

Build Momenta's core differentiator.

## Deliverables

* Widget Registry
* Snapshot Engine
* Small Widget
* Medium Widget
* Countdown Widget
* Elapsed Widget

## Exit Criteria

* widgets display real moment data
* widgets update correctly

---

# Phase 9 — Content & Insight Engine

## Goal

Make Momenta feel alive.

## Deliverables

* Content Registry
* Insight Rules
* Smart Suggestions
* Contextual Messages

## Exit Criteria

* insights generated without AI

---

# Phase 10 — Analytics & Observability

## Goal

Understand product behavior.

## Deliverables

* Logger
* Audit Trail
* Analytics
* UX Telemetry
* Crash Reporting

## Exit Criteria

* critical operations observable

---

# Phase 11 — Monetization Foundation

## Goal

Prepare business model.

## Deliverables

* Plan Registry
* Premium Gates
* Free Limits
* RevenueCat Provider
* Restore Purchase

## Exit Criteria

* monetization architecture complete

---

# Phase 12 — Release Readiness

## Goal

Prepare for App Store release.

## Deliverables

* App Store Metadata
* Screenshots
* Privacy Review
* QA Review
* Performance Review
* Release Checklist

## Exit Criteria

* production-ready build
* App Store submission ready

---

# Long-Term Future

Future phases may include:

* Cloud Sync
* Shared Timelines
* Family Spaces
* Advanced Widgets
* AI-assisted Insights
* Apple Intelligence integrations
* Siri/App Intents
* Calendar integrations

These are not MVP requirements.

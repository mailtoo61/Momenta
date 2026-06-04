# Contributing Guide

## Purpose

This document defines the engineering standards for Momenta.

Every contributor, AI coding agent, automation tool, and future developer must follow these rules.

These rules exist to preserve consistency, maintainability, reliability, and long-term product quality.

---

# Project Philosophy

Momenta is a premium personal life timeline companion.

The goal is not to ship features as quickly as possible.

The goal is to build a product that remains maintainable for years.

Every code change must prioritize:

1. reliability
2. simplicity
3. maintainability
4. scalability
5. user trust

before speed.

---

# Architecture First

Before writing code ask:

* Which domain owns this?
* Which service owns this?
* Which registry owns this?
* Does this violate the Core Rule?

Architecture comes before implementation.

---

# Momenta Core Rule

UI only displays.

Domain decides.

Repository manages data.

Service executes side effects.

Every critical operation is logged.

Every system is controlled from a single source.

SDKs are abstracted behind providers.

Control must not be lost as the codebase grows.

---

# Forbidden Practices

The following practices are forbidden.

## Hardcoded UI Text

Forbidden:

Text strings directly inside screens.

Required:

Localization keys.

---

## Hardcoded Colors

Forbidden:

Random hex colors inside components.

Required:

Theme tokens.

---

## Direct Database Access

Forbidden:

SQLite queries inside screens.

Required:

Repository access.

---

## Direct SDK Usage

Forbidden:

RevenueCat, analytics, crash reporting, notifications, widgets, or future SDKs directly inside UI.

Required:

Provider abstraction.

---

## Business Logic Inside UI

Forbidden:

Date calculations.

Reminder calculations.

Premium decisions.

Insight generation.

Domain rules.

Required:

Domain layer ownership.

---

## Duplicate Logic

Forbidden:

The same business rule existing in multiple places.

Required:

Single Source of Truth.

---

# File Ownership Rules

Every file must have a clear owner.

Examples:

Theme:

* shared/theme

Localization:

* shared/i18n

Categories:

* domain/categories

Plans:

* domain/monetization

Reminder Rules:

* domain/reminders

Widgets:

* domain/widgets

Global rules must never be scattered.

---

# Registry Rule

Before adding a new global concept ask:

Should this be a registry?

Examples:

* categories
* plans
* widgets
* notifications
* settings
* content templates

Most global systems should use registries.

---

# New Feature Checklist

Before creating a feature verify:

1. domain ownership exists
2. registry ownership exists
3. localization exists
4. theme tokens exist
5. analytics plan exists
6. logging plan exists
7. error mapping exists
8. tests can be written

If not:

the feature is incomplete.

---

# Service Rule

Services own orchestration.

Examples:

create moment

update moment

archive moment

restore moment

schedule reminder

refresh widget snapshot

Services coordinate systems.

Services do not render UI.

---

# Repository Rule

Repositories own persistence.

Repositories may:

* read
* write
* update
* delete
* archive

Repositories may not:

* calculate business rules
* decide premium access
* generate insights

---

# Time Rule

Momenta is a time-based product.

All date calculations must use Time Engine.

Forbidden:

Date calculations inside screens.

Date calculations inside widgets.

Date calculations duplicated in services.

Allowed:

Time Engine outputs.

---

# Premium Rule

Premium access must go through Premium Gate.

Forbidden:

Scattered premium checks.

Required:

Centralized entitlement checks.

---

# Logging Rule

Critical operations must be logged.

Examples:

* moment created
* moment updated
* moment archived
* reminder scheduled
* widget refreshed
* migration executed

Logging is mandatory.

---

# Analytics Rule

Analytics must be meaningful.

Track:

* user actions
* feature adoption
* onboarding completion

Do not track:

* private moment content
* sensitive user information

Privacy takes priority.

---

# Error Handling Rule

Every user-facing error must be:

* localized
* human-readable
* actionable

Raw technical messages are forbidden.

---

# Accessibility Rule

Every screen must support:

* VoiceOver
* Dynamic Type
* sufficient contrast
* Reduce Motion

Accessibility is required.

---

# Performance Rule

Before merging a feature ask:

* Does it increase render count?
* Does it increase memory usage?
* Does it affect widget performance?
* Does it affect reminder reliability?

Performance is a feature.

---

# Testing Rule

Every business rule must be testable.

Required test categories:

* reminder logic
* premium logic
* category logic
* widget snapshot logic
* migration logic

Untested business logic is incomplete.

---

# Pull Request Standards

Every change must include:

## Purpose

What problem is being solved?

## Scope

Which files changed?

## Risk

What could break?

## Verification

How was it tested?

---

# AI Agent Rules

AI-generated code is not automatically accepted.

Every AI change must:

* respect architecture
* respect registries
* respect localization
* respect theme tokens
* respect premium gates
* respect logging
* respect testing standards

AI code is reviewed by the same standards as human code.

---

# Long-Term Rule

Optimize for:

* maintainability
* predictability
* replacement cost
* future growth

Do not optimize for:

* shortcuts
* temporary hacks
* one-off solutions

Temporary solutions become permanent problems.

---

# Final Statement

Every contributor is responsible for preserving:

* architecture quality
* code quality
* user trust
* product consistency

If a proposed change violates these principles, the change should be rejected or redesigned.

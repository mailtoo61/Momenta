# Environments

## Purpose

This document defines environment management for Momenta.

The goal is:

* predictable builds
* safe releases
* environment isolation
* reproducible deployments

Momenta must never rely on implicit environment behavior.

Every build must know exactly which environment it belongs to.

---

# Environment Philosophy

Momenta uses environment separation to prevent:

* accidental production changes
* test data leakage
* incorrect analytics reporting
* incorrect monetization behavior
* unstable releases

Environment isolation is mandatory.

---

# Supported Environments

Momenta supports:

1. Development
2. Preview
3. Production

No additional environments should be created without architectural review.

---

# Development Environment

Purpose:

Local development.

---

Characteristics:

* local machine
* debug enabled
* internal tools enabled
* verbose logging
* mock data allowed
* testing features allowed

---

Allowed:

* debug console
* migration reset tools
* provider diagnostics
* experimental widgets

---

Forbidden:

* production analytics reporting
* production billing

---

Environment Name:

development

---

# Preview Environment

Purpose:

Internal testing.

Beta verification.

Pre-release validation.

---

Characteristics:

* production-like behavior
* release candidate testing
* QA testing
* stakeholder review

---

Allowed:

* release candidate builds
* production simulations
* subscription testing

---

Forbidden:

* experimental unstable features

---

Environment Name:

preview

---

# Production Environment

Purpose:

Public App Store releases.

---

Characteristics:

* user-facing
* stable
* optimized
* monitored

---

Forbidden:

* debug UI
* test purchases
* internal tools
* experimental behavior

---

Environment Name:

production

---

# Environment Ownership

Environment selection must be centralized.

No feature should decide its own environment.

Environment state belongs to:

Environment Manager

---

# Build Profiles

Required build profiles:

development

preview

production

---

Every build profile must define:

* environment name
* bundle identifier
* release channel
* logging behavior
* feature flag defaults

---

# Bundle Identifier Policy

Production bundle identifiers are protected.

Changes require review.

Example:

com.momenta.app

---

# Configuration Source

Configuration must come from:

Configuration Center

Environment Manager

---

Forbidden:

hardcoded environment checks.

---

Bad:

if (**DEV**)

scattered throughout the application.

---

Good:

environmentManager.isDevelopment()

---

# Environment Variables

Environment variables must be centralized.

Examples:

APP_ENV

APP_VERSION

BUILD_NUMBER

ANALYTICS_ENABLED

CRASH_REPORTING_ENABLED

BILLING_ENABLED

---

# Secret Management

Secrets must never be hardcoded.

Examples:

API keys

RevenueCat keys

Analytics keys

Crash provider keys

---

Secrets belong to environment configuration.

---

# Logging Policy

Development:

debug

info

warn

error

---

Preview:

info

warn

error

---

Production:

warn

error

---

Verbose logging is forbidden in production.

---

# Analytics Policy

Development:

disabled by default

---

Preview:

enabled

testing mode

---

Production:

enabled

production mode

---

Analytics behavior must be environment aware.

---

# Crash Reporting Policy

Development:

optional

---

Preview:

enabled

---

Production:

enabled

mandatory

---

# Billing Policy

Development:

mock purchases allowed

---

Preview:

sandbox purchases

---

Production:

real purchases

---

Billing behavior must be isolated.

---

# Feature Flag Policy

Development:

all experimental flags may be enabled.

---

Preview:

selected feature testing.

---

Production:

approved features only.

---

Feature Flags must not replace environments.

---

# Notification Policy

Development:

test notifications allowed.

---

Preview:

full reminder validation.

---

Production:

real user reminders.

---

# Widget Policy

Development:

diagnostic widgets allowed.

---

Preview:

release candidate widgets.

---

Production:

approved widgets only.

---

# Debug Console Policy

Development:

visible.

---

Preview:

protected access.

---

Production:

hidden.

---

# Internal Tools Policy

Examples:

* migration tools
* snapshot viewer
* provider diagnostics

Development:

enabled

Preview:

restricted

Production:

disabled

---

# Database Policy

Development:

reset allowed.

---

Preview:

migration validation.

---

Production:

no destructive resets.

---

# Release Channel Policy

Development

↓

Preview

↓

Production

---

Changes should move through environments in order.

Skipping environments is discouraged.

---

# App Store Builds

Only production builds may be submitted.

Preview builds must never be submitted.

Development builds must never be submitted.

---

# Environment Verification Checklist

Before release verify:

* correct environment selected
* correct bundle identifier
* correct build profile
* correct analytics configuration
* correct billing configuration
* correct feature flags
* correct crash reporting

---

# Environment Testing

Every environment must verify:

* startup
* navigation
* reminders
* widgets
* purchases
* exports
* imports

---

# Environment Safety Rule

If environment identity is uncertain:

assume the build is unsafe.

Do not release.

---

# Final Rule

Environment behavior must be:

explicit

predictable

centralized

auditable

No feature may secretly behave differently across environments.

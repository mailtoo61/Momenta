# Release Process

## Purpose

This document defines the official release workflow for Momenta.

The goal is:

* predictable releases
* repeatable releases
* low-risk deployments
* App Store readiness
* release confidence

No production release should occur outside this process.

---

# Release Philosophy

Releases should be:

* boring
* predictable
* repeatable
* documented

Unexpected behavior is considered a release failure.

---

# Release Pipeline

Development

↓

Internal Validation

↓

Preview

↓

QA Approval

↓

Release Candidate

↓

Production

↓

Post Release Verification

---

No stage should be skipped.

---

# Release Types

Momenta supports:

* Patch Release
* Minor Release
* Major Release

---

# Patch Release

Examples:

* bug fixes
* localization fixes
* UI fixes
* crash fixes

Version example:

1.0.1

---

# Minor Release

Examples:

* new widgets
* new categories
* new insight rules

Version example:

1.1.0

---

# Major Release

Examples:

* sync system
* cloud architecture
* family spaces
* large product changes

Version example:

2.0.0

---

# Development Stage

Purpose:

Build the feature.

Requirements:

* architecture compliant
* localization compliant
* registry compliant
* theme compliant

Before moving forward:

* code review completed
* tests pass

---

# Internal Validation Stage

Purpose:

Developer verification.

Verify:

* feature behavior
* navigation
* logging
* analytics
* widget behavior

Output:

validated feature

---

# Preview Stage

Purpose:

Release simulation.

Preview builds should behave like production.

Verify:

* onboarding
* reminders
* widgets
* exports
* imports
* premium gates

---

# QA Approval Stage

Purpose:

Formal verification.

Use:

QA_CHECKLIST.md

All required items must pass.

---

# Release Candidate Stage

Purpose:

Final candidate.

Requirements:

* feature complete
* no blocker bugs
* crash review completed
* privacy review completed

Only critical fixes are allowed.

---

# Production Stage

Purpose:

Public release.

Requirements:

* production environment
* production build profile
* production configuration

---

# Post Release Verification

Immediately after release verify:

* startup
* navigation
* reminders
* widgets
* analytics
* purchases
* restore purchases

If issues appear:

activate rollback strategy.

---

# Release Roles

For a solo developer:

Developer performs all roles.

For future teams:

Roles may be separated.

---

Roles:

Developer

Reviewer

QA

Release Manager

---

# Release Readiness Checklist

Before release verify:

* ROADMAP phase complete
* QA complete
* accessibility complete
* localization complete
* performance review complete

---

# Versioning Policy

Format:

MAJOR.MINOR.PATCH

Examples:

1.0.0

1.1.0

1.1.1

---

# Build Number Policy

Every App Store submission requires:

incremented build number.

Build numbers must never move backward.

---

# Changelog Policy

Every release requires:

release notes

changelog entry

version summary

---

# Release Notes Template

Version:

Date:

Highlights:

Bug Fixes:

Performance:

Known Issues:

---

# Feature Flag Review

Before release verify:

* experimental flags disabled
* debug flags disabled
* internal features hidden

Production must only expose approved features.

---

# Localization Review

Verify:

* Turkish complete
* English complete
* no missing keys
* screenshots updated

---

# Widget Review

Verify:

* widget rendering
* widget privacy
* widget deep links
* widget snapshots

Widgets are a release blocker area.

---

# Reminder Review

Verify:

* scheduling
* rescheduling
* cancellation
* overdue handling

Reminder reliability is critical.

---

# Premium Review

Verify:

* paywall
* premium gates
* restore purchases
* entitlement updates

---

# Analytics Review

Verify:

* approved events only
* no sensitive content
* correct environment

---

# Crash Review

Verify:

* no known startup crashes
* no known widget crashes
* no known reminder crashes

---

# Privacy Review

Verify:

* privacy policy current
* privacy labels current
* SDK inventory current

---

# Accessibility Review

Verify:

* VoiceOver
* Dynamic Type
* Reduce Motion
* contrast

Accessibility regressions block release.

---

# Performance Review

Verify:

* startup performance
* memory usage
* widget refresh behavior
* reminder scheduling performance

---

# Rollback Strategy

If severe issues occur:

1. identify issue
2. disable affected feature flag if possible
3. prepare hotfix
4. release patch

Never patch blindly.

---

# Hotfix Process

Allowed only for:

* crashes
* data loss
* premium failures
* reminder failures
* widget failures

Hotfixes still require verification.

---

# App Store Submission Review

Before submission verify:

* metadata
* screenshots
* privacy links
* support links
* legal text

---

# Production Release Gate

Release is allowed only if:

* QA passed
* privacy passed
* accessibility passed
* widget review passed
* reminder review passed
* crash review passed

Otherwise release is blocked.

---

# Final Rule

Shipping is not success.

Reliable shipping is success.

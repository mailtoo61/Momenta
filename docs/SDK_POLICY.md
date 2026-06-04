# SDK Policy

## Purpose

This document defines how third-party SDKs are evaluated, integrated, maintained, replaced, and removed in Momenta.

The goal is:

* maintain architectural control
* avoid vendor lock-in
* protect privacy
* reduce technical debt
* preserve long-term maintainability

SDK usage is a strategic decision, not a convenience decision.

---

# Core Principle

No SDK is allowed to become a dependency of the product architecture.

Momenta owns the architecture.

SDKs are replaceable implementation details.

---

# SDK Lifecycle

Every SDK follows:

Evaluation

↓

Approval

↓

Integration

↓

Monitoring

↓

Maintenance

↓

Replacement or Removal

---

No SDK should bypass this process.

---

# Approved Integration Pattern

All SDKs must be integrated through:

SDK Abstraction Layer

↓

Provider Registry

↓

Provider Implementation

↓

SDK

---

Never:

UI

↓

SDK

Direct access is forbidden.

---

# Required SDK Categories

Momenta currently anticipates:

* Billing
* Analytics
* Crash Reporting
* Notifications
* Widgets
* Secure Storage

Additional categories require review.

---

# Billing SDK Policy

Current target:

RevenueCat-ready architecture.

Rules:

* UI must not know RevenueCat exists
* Domain must not know RevenueCat exists
* BillingProvider owns implementation

Future replacement must be possible.

Examples:

RevenueCat

StoreKit

Future provider

---

# Analytics SDK Policy

Analytics must be abstracted.

Examples:

Firebase Analytics

PostHog

Mixpanel

Amplitude

Future provider

---

Analytics events must come from:

Analytics Event Registry

Only.

---

# Crash Reporting SDK Policy

Crash reporting must be abstracted.

Examples:

Sentry

Crashlytics

Bugsnag

Future provider

---

Crash SDKs must not expose sensitive content.

---

# Notification SDK Policy

Notification providers must be replaceable.

Examples:

Expo Notifications

OneSignal

Future providers

---

Reminder logic must never depend on notification provider implementation.

---

# Widget Provider Policy

Widget implementation must be isolated.

Widget business logic must never live inside provider code.

Providers display snapshots only.

---

# Secure Storage Policy

Sensitive values must use storage abstraction.

Examples:

entitlements

tokens

future credentials

---

Direct storage usage is discouraged.

---

# SDK Evaluation Criteria

Every new SDK must be evaluated for:

1. architecture fit
2. privacy impact
3. maintenance burden
4. App Store impact
5. replacement cost
6. licensing cost
7. ecosystem health

---

# SDK Approval Checklist

Before integration verify:

* provider abstraction exists
* health monitoring exists
* kill switch exists
* privacy reviewed
* architecture reviewed

---

# SDK Governance Record

Every SDK must have:

* purpose
* owner
* version
* integration date
* provider owner
* replacement strategy

Documented.

---

# SDK Health Monitoring

Every SDK should support:

health status

Examples:

healthy

degraded

disabled

failed

---

Visible in:

Debug Dashboard

---

# SDK Kill Switch

Every critical SDK should support disablement.

Examples:

analytics

crash reporting

billing

---

Goal:

reduce production risk.

---

# Privacy Requirements

Before adding an SDK verify:

What data is collected?

Where is it stored?

Who receives it?

Can it be disabled?

---

No SDK may collect private moment content.

---

# Data Minimization Rule

Collect the minimum amount of information required.

More data is not automatically better.

---

# Vendor Lock-In Rule

SDK-specific logic must remain isolated.

Future replacement should affect:

Provider Implementation

only.

---

# Cost Review Policy

Every SDK should be reviewed periodically for:

* pricing
* limits
* usage growth
* alternatives

---

# SDK Removal Policy

Before removing an SDK verify:

* replacement path
* migration plan
* data implications
* analytics implications

---

# SDK Version Policy

Do not upgrade blindly.

Before upgrading:

* review changelog
* review breaking changes
* review privacy changes
* review App Store implications

---

# Experimental SDK Policy

Experimental SDKs may exist only in:

development

preview

Never automatically in production.

---

# App Store Review Policy

SDK usage must remain compatible with:

* App Store Review Guidelines
* Privacy Labels
* Privacy Manifest requirements

---

# Required Documentation

Every SDK integration requires:

* provider implementation
* health monitor
* kill switch
* architecture review
* documentation update

---

# Forbidden

Forbidden:

* direct SDK usage in UI
* direct SDK usage in domain
* hardcoded SDK dependencies
* SDK-specific business logic
* sensitive data leakage

---

# Final Rule

An SDK should be easy to add.

An SDK should be easy to remove.

If removing an SDK would break the architecture,

the integration was done incorrectly.

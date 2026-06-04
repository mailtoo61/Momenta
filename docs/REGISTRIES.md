# Registries

## Purpose

This document defines all central registries in Momenta.

A registry is a single source of truth for a product rule, configuration set, or global system.

Registries prevent scattered logic, duplicated constants, inconsistent UI, and future maintenance problems.

---

# Registry Rule

If something is used in more than one place, controlled by product decisions, localized, premium-gated, themed, or likely to change later, it must be managed through a registry.

Do not hardcode global rules inside screens, components, services, or repositories.

---

# Required Registries

## 1. App Config Registry

Owns:

* app name
* app version metadata
* default locale
* default theme
* default reminder windows
* max local log size
* default timezone behavior

---

## 2. Feature Flag Registry

Owns:

* widgets enabled
* premium enabled
* weekly summary enabled
* export enabled
* import enabled
* debug console enabled
* future AI enabled
* cloud sync enabled

---

## 3. i18n Registry

Owns:

* supported languages
* fallback language
* translation namespaces
* missing key behavior
* locale formatting rules

Launch languages:

* Turkish
* English

Future languages:

* German
* Spanish
* French
* Arabic

---

## 4. Theme Registry

Owns:

* light theme
* dark theme
* system theme behavior
* semantic color mapping
* typography tokens
* spacing tokens
* radius tokens
* shadow tokens

---

## 5. Semantic Color Registry

Owns meaning-based colors.

Examples:

* family
* health
* vehicle
* home
* finance
* pet
* self
* warning
* success
* danger
* muted
* premium

No component should use random color values.

---

## 6. Category Registry

Owns all moment categories.

Initial categories:

* family
* health
* vehicle
* self
* home
* finance
* pet
* custom

Each category defines:

* id
* label key
* icon key
* semantic color
* default reminder behavior
* privacy sensitivity
* widget eligibility

---

## 7. Preset Template Registry

Owns quick-start moment templates.

Examples:

* vehicle inspection
* car maintenance
* doctor appointment
* dentist check
* call mother
* exercise
* pet vaccination
* insurance renewal

Each preset defines:

* id
* title key
* category id
* default recurrence
* default reminder offsets
* privacy sensitivity
* widget eligibility

---

## 8. Reminder Rule Registry

Owns reminder rules.

Examples:

* today
* tomorrow
* one week before
* one month before
* overdue
* long time no action

Each rule defines:

* id
* rule type
* offset
* eligibility
* notification copy key
* priority

---

## 9. Notification Copy Registry

Owns notification message templates.

Rules:

* localized
* category-aware
* privacy-safe
* non-spammy
* calm tone

No notification copy should be hardcoded inside scheduling code.

---

## 10. Insight Template Registry

Owns micro insight templates.

Examples:

* long time no action
* upcoming maintenance
* overdue reminder
* quiet category
* weekly rhythm

Each insight defines:

* id
* trigger rule
* category eligibility
* text key
* priority
* privacy sensitivity

---

## 11. Widget Registry

Owns all widget definitions.

Each widget defines:

* id
* name key
* supported sizes
* supported modes
* premium status
* required data
* privacy behavior
* theme compatibility

---

## 12. Widget Theme Registry

Owns widget visual themes.

Each theme defines:

* id
* name key
* premium status
* background style
* typography style
* accent behavior
* supported widget sizes

---

## 13. Widget Snapshot Registry

Owns snapshot contract definitions.

Each snapshot type defines:

* id
* schema version
* required fields
* optional fields
* privacy rules
* fallback state

Widgets display snapshots.
Widgets do not calculate business logic.

---

## 14. Plan Registry

Owns monetization plans.

Plans:

* free
* weekly
* monthly
* lifetime

Each plan defines:

* id
* entitlement id
* moment limit
* widget limit
* premium widget access
* premium theme access
* export access
* future sync access
* weekly summary access

---

## 15. Premium Gate Registry

Owns premium feature gates.

Examples:

* unlimited moments
* premium widgets
* premium themes
* advanced insights
* export
* future sync
* weekly summary

Every premium check must go through the Premium Gate.

---

## 16. Settings Registry

Owns all settings items.

Sections:

* appearance
* language
* notifications
* widgets
* privacy
* data
* premium
* about

Each setting defines:

* id
* label key
* description key
* type
* default value
* visibility rule
* premium rule if needed

---

## 17. Empty State Registry

Owns empty/loading/error UI states.

Examples:

* no moments
* no upcoming
* no overdue
* no widget selected
* notification denied
* premium locked
* export unavailable

Each state defines:

* id
* title key
* description key
* action key
* illustration key if any

---

## 18. Error Code Registry

Owns error codes and user-safe messages.

Examples:

* MOMENT_CREATE_FAILED
* REMINDER_SCHEDULE_FAILED
* WIDGET_SNAPSHOT_FAILED
* MIGRATION_FAILED
* IMPORT_INVALID_FILE
* PREMIUM_ACCESS_DENIED

Each error defines:

* code
* severity
* user message key
* developer message
* recovery suggestion

---

## 19. Analytics Event Registry

Owns analytics event names.

Examples:

* onboarding_started
* onboarding_completed
* moment_created
* reminder_enabled
* widget_selected
* premium_gate_viewed
* paywall_opened

Rules:

* no sensitive moment content
* no private notes
* no personal relationship text

---

## 20. Audit Event Registry

Owns internal audit event names.

Examples:

* migration_started
* migration_completed
* moment_archived
* reminder_rescheduled
* widget_snapshot_updated

Audit events help debug product behavior.

---

## 21. SDK Provider Registry

Owns SDK provider selection.

Provider types:

* billing
* analytics
* crash
* notification
* widget
* secure storage

Each provider defines:

* id
* enabled
* health check
* kill switch support
* privacy notes

---

## 22. App Store Metadata Registry

Owns store listing metadata.

Includes:

* app name
* subtitle
* description
* keywords
* screenshot copy
* privacy text
* subscription copy

Must support localization.

---

## 23. Release Registry

Owns release metadata.

Includes:

* version
* build number
* changelog
* release notes
* environment
* release channel

---

## 24. Import / Export Contract Registry

Owns versioned data contracts.

Each contract defines:

* version
* schema
* validation rules
* migration path
* supported file types

---

## 25. App Intent / Deep Link Registry

Owns internal route targets.

Examples:

* open moment detail
* open add moment
* open widget settings
* open notification settings
* open paywall

Deep links must not be hardcoded.

---

# Registry Implementation Rules

Each registry must:

* be typed
* be testable
* have stable ids
* avoid duplicated labels
* reference i18n keys instead of raw strings
* reference semantic tokens instead of raw colors
* support future extension

---

# Registry Testing Requirements

Tests must verify:

* no duplicate ids
* all i18n keys exist
* all semantic colors exist
* all premium gates resolve
* all referenced categories exist
* all widget snapshot schemas are valid
* all settings items have labels
* all analytics events are approved

---

# Forbidden

Forbidden:

* hardcoded limits in screens
* hardcoded copy in services
* hardcoded widget definitions
* scattered premium checks
* duplicated category definitions
* random config constants
* untyped registries

---

# Final Rule

If a product rule changes, it should usually change in one registry, not across the application.

# Folder Structure

## Purpose

This document defines the physical project structure of Momenta.

The goal is:

* predictable organization
* scalable growth
* clear ownership
* minimal architectural drift

Every file must belong to a defined owner.

No random folders should be introduced.

---

# Root Structure

src/
docs/
assets/
scripts/
tests/

---

# src/

Main application source code.

Contains:

app/
shared/
domain/
data/
services/
platform/
features/

---

# app/

Application bootstrap layer.

Responsibilities:

* app entry
* providers
* navigation root
* app initialization
* startup orchestration

Contains:

app/
providers/
navigation/
bootstrap/

Business logic is forbidden.

---

# shared/

Reusable global systems.

Contains:

shared/
theme/
i18n/
config/
featureFlags/
analytics/
logger/
errors/
accessibility/
motion/
haptics/
utils/

---

# shared/theme/

Owns:

* colors
* typography
* spacing
* radius
* shadows

---

# shared/i18n/

Owns:

* localization keys
* translations
* localization helpers

Supported:

* tr
* en

Future:

* de
* es
* fr
* ar

---

# shared/config/

Owns:

* app constants
* environment config
* build config

No feature-specific logic.

---

# shared/featureFlags/

Owns:

* feature switches
* rollout flags
* experimental flags

---

# shared/logger/

Owns:

* debug
* info
* warn
* error

logging.

---

# shared/errors/

Owns:

* error codes
* error mapping
* user-facing error messages

---

# shared/accessibility/

Owns:

* accessibility helpers
* accessibility labels
* accessibility utilities

---

# shared/motion/

Owns:

* animation tokens
* motion presets

---

# shared/haptics/

Owns:

* haptic presets
* haptic helpers

---

# domain/

Owns business logic.

Contains:

domain/
moments/
reminders/
insights/
widgets/
monetization/
settings/
privacy/
time/

Domain decides.

Domain never renders UI.

---

# domain/moments/

Owns:

* moment models
* validations
* category relationships
* moment rules

---

# domain/reminders/

Owns:

* reminder rules
* scheduling decisions
* reminder eligibility

---

# domain/insights/

Owns:

* insight generation
* content rules
* suggestion logic

---

# domain/widgets/

Owns:

* widget definitions
* widget rules
* widget registries

---

# domain/monetization/

Owns:

* plans
* premium gates
* entitlements

---

# domain/settings/

Owns:

* settings models
* settings definitions

---

# domain/privacy/

Owns:

* privacy rules
* sensitive content rules

---

# domain/time/

Owns:

* elapsed calculations
* countdown calculations
* timezone handling
* recurring logic

All date calculations belong here.

---

# data/

Persistence layer.

Contains:

data/
sqlite/
migrations/
repositories/
import/
export/
recovery/

---

# data/sqlite/

Owns:

* database initialization
* database versioning

---

# data/migrations/

Owns:

* schema migrations

---

# data/repositories/

Owns:

* repository implementations

Examples:

* momentRepository
* settingsRepository
* widgetRepository

---

# data/import/

Owns:

* import contracts
* import validation

---

# data/export/

Owns:

* export contracts
* export generators

---

# data/recovery/

Owns:

* recovery workflows
* repair utilities

---

# services/

Orchestration layer.

Contains:

services/
moments/
reminders/
widgets/
analytics/
audit/

Examples:

* createMomentService
* archiveMomentService
* scheduleReminderService
* updateWidgetSnapshotService

Services coordinate systems.

---

# platform/

Platform integrations.

Contains:

platform/
notifications/
widgets/
billing/
analytics/
crash/
storage/
device/

---

# platform/notifications/

Notification providers.

---

# platform/widgets/

Widget providers.

---

# platform/billing/

RevenueCat or future billing providers.

---

# platform/analytics/

Analytics providers.

---

# platform/crash/

Crash reporting providers.

---

# platform/storage/

Secure storage providers.

---

# platform/device/

Device capability checks.

Examples:

* Face ID
* notifications
* widget support

---

# features/

UI presentation layer.

Contains:

features/
onboarding/
home/
moments/
settings/
paywall/
debug/

---

# features/onboarding/

Onboarding screens.

---

# features/home/

Home experience.

---

# features/moments/

Moment screens.

Examples:

* create
* detail
* edit

---

# features/settings/

Settings screens.

---

# features/paywall/

Premium experience.

---

# features/debug/

Internal debug tools.

Production hidden.

---

# assets/

Contains:

assets/
images/
icons/
illustrations/
widgets/
fonts/

---

# scripts/

Automation scripts.

Examples:

* validation
* code generation
* QA helpers

---

# tests/

Contains:

tests/
unit/
integration/
contracts/

---

# Naming Rules

Folders:

kebab-case

Files:

camelCase

Components:

PascalCase

---

# Forbidden Folders

Do not create:

helpers/
common/
misc/
temp/
random/
new/

These become dumping grounds.

---

# Final Rule

Every file must answer:

Who owns this?

If ownership is unclear:

the file is in the wrong place.

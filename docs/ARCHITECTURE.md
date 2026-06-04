# Momenta Architecture

## 1. Architecture Goal

Momenta is designed as a production-grade, offline-first, widget-first iOS-focused app built with Expo SDK 56, React Native 0.85, React 19.2.3, React Native Web 0.21.0, Node.js 22.13.x minimum, TypeScript, and a Windows development workflow.

The architecture must remain modular, testable, observable, and easy to extend.

## 2. Core Architecture Rule

UI only displays.
Domain decides.
Repository manages data.
Service runs side effects.
Every critical operation is logged.
Every system is controlled from a single source.
SDKs are abstracted behind providers.
Control must not be lost as the codebase grows.

## 3. Layered Architecture

Momenta uses a layered architecture:

src/
app/
shared/
domain/
data/
services/
platform/
features/

## 4. Folder Responsibilities

### app/

Owns app entry, routing, navigation shell, providers, and app bootstrapping.

Must not contain business logic.

### shared/

Owns reusable foundations:

* theme
* design tokens
* i18n
* config
* feature flags
* logger
* analytics contracts
* error mapping
* accessibility helpers
* haptics
* motion tokens

### domain/

Owns product logic.

Main domains:

* moments
* reminders
* insights
* widgets
* monetization
* settings
* privacy

Domain code must not directly call SQLite, SDKs, UI components, or platform APIs.

### data/

Owns persistence.

Includes:

* SQLite setup
* migrations
* repositories
* data validators
* import/export contracts
* recovery helpers

UI must never talk directly to SQLite.

### services/

Owns side effects and orchestration.

Examples:

* create moment service
* reminder scheduling service
* widget snapshot update service
* analytics tracking service
* audit log service

### platform/

Owns platform integrations.

Examples:

* notifications
* widgets
* RevenueCat provider
* crash reporting provider
* device capabilities
* secure storage
* future iCloud bridge

Platform APIs must be wrapped behind adapters/providers.

### features/

Owns screen-level presentation.

Examples:

* onboarding
* home
* add moment
* moment detail
* settings
* paywall
* debug

Feature screens can call services and selectors, but cannot own global rules.

## 5. Data Flow

Correct flow:

UI
→ service
→ domain
→ repository
→ SQLite

Side effects:

service
→ logger
→ audit log
→ notification provider
→ widget snapshot provider
→ analytics provider

Incorrect flow:

UI
→ SQLite

UI
→ SDK

UI
→ notification API

UI
→ billing SDK

These are forbidden.

## 6. Central Registries

Momenta must use central registries for:

* app configuration
* feature flags
* i18n keys
* theme tokens
* semantic colors
* category definitions
* reminder rules
* insight templates
* notification copy
* widget definitions
* widget themes
* premium plans
* premium gates
* SDK providers
* analytics events
* error codes
* empty states
* onboarding steps
* settings items
* export/import contracts

No screen owns global product rules.

## 7. State Management

Momenta uses one state management contract.

Recommended:

* local UI state: React state
* app/domain state: Zustand or equivalent single state system
* persistent state: SQLite via repositories

State rules:

* no duplicated domain state
* no screen-owned global state
* no business logic inside stores
* stores expose state and simple actions only
* services orchestrate complex flows

## 8. Persistence

SQLite is the primary local database.

Stored data:

* moments
* moment events
* categories
* reminder plans
* widget snapshots
* settings
* audit logs
* migration metadata
* premium entitlement cache

Database rules:

* migrations are versioned
* repositories isolate SQL
* import/export contracts are versioned
* soft delete is preferred over destructive delete
* recovery path must exist for failed migrations

## 9. Time Engine

Momenta is time-based; therefore all date and time logic must be centralized.

The Time Engine owns:

* current time provider
* timezone handling
* DST handling
* locale date formatting
* elapsed time
* countdown time
* recurring logic
* overdue logic
* upcoming logic

No screen should calculate time directly.

## 10. Reminder Architecture

Reminder flow:

moment created or updated
→ reminder rules evaluated
→ reminder plan saved
→ notification scheduled
→ audit log recorded
→ widget snapshot refreshed

Reminder rules are centralized.

Supported reminder concepts:

* today
* tomorrow
* one week before
* one month before
* overdue
* long time no action

If notification permission is denied, app must still show upcoming and overdue moments inside the app.

## 11. Widget Architecture

Widgets are a core surface of Momenta.

Rules:

* widgets do not calculate business logic
* widgets display prepared snapshots
* app generates widget snapshots
* snapshots are privacy-safe
* sensitive moments are hidden unless user allows them
* widget themes come from registry
* premium widgets are controlled by premium gate

Widget data flow:

domain state
→ widget snapshot service
→ widget snapshot storage
→ widget provider
→ widget display

## 12. Monetization Architecture

Momenta supports:

* Free
* Weekly
* Monthly
* Lifetime

Payment does not need to be active in the first build, but architecture must be ready.

Rules:

* all limits live in Plan Registry
* all premium checks go through Premium Gate
* RevenueCat or future billing SDK is behind Billing Provider
* restore purchase flow is mandatory before release
* paywall copy is centralized
* subscription legal text is centralized

## 13. SDK Architecture

No third-party SDK may be used directly in UI or domain code.

SDKs must use:

* SDK Abstraction Layer
* Provider Registry
* SDK Health Monitor
* SDK Kill Switch
* Third-Party SDK Governance

Provider examples:

* BillingProvider
* AnalyticsProvider
* CrashProvider
* NotificationProvider
* WidgetProvider

Replacing an SDK must not require rewriting UI or domain logic.

## 14. Logging & Observability

Momenta must include structured logging.

Log levels:

* debug
* info
* warn
* error

Each critical action should record:

* operation name
* module
* result
* timestamp
* error code if failed

Logs must not store sensitive user text.

## 15. Audit Trail

Audit Trail records important product events.

Examples:

* moment_created
* moment_updated
* moment_archived
* reminder_scheduled
* reminder_failed
* widget_snapshot_updated
* premium_gate_blocked
* migration_started
* migration_completed
* migration_failed

Audit Trail is for debugging and reliability, not user tracking.

## 16. Error Handling

Errors must be mapped.

Developer sees:

* module
* technical reason
* stack/context if available

User sees:

* simple localized message
* safe recovery option

No raw technical error should be shown to the user.

## 17. Privacy Architecture

Privacy rules:

* account is not required
* data is local by default
* analytics must not collect moment content
* logs must not expose sensitive text
* widgets must respect privacy settings
* export/import must validate data
* third-party SDK data usage must be documented

## 18. Accessibility

Momenta must support:

* VoiceOver labels
* Dynamic Type
* sufficient contrast
* Reduce Motion
* large touch targets
* readable widgets
* localized accessibility text

Accessibility is not a final polish task; it is part of the architecture.

## 19. Testing Strategy

Required test areas:

* i18n missing keys
* theme token usage
* category registry
* reminder calculations
* timezone behavior
* premium limits
* widget snapshots
* SQLite migrations
* import/export contracts
* SDK provider contracts
* repository behavior
* service orchestration

## 20. Performance Budget

Momenta must remain fast and light.

Targets:

* fast cold start
* minimal unnecessary renders
* lightweight widget snapshots
* low memory usage
* no heavy background processing
* battery-safe reminders
* responsive interactions

## 21. Release Architecture

Release system must include:

* dev / preview / production environments
* build profiles
* versioning rules
* changelog
* release notes
* App Store metadata files
* screenshot text files
* privacy manifest registry
* App Review checklist

## 22. MVP Architecture Scope

First MVP includes:

* onboarding
* create moment
* list moments
* category registry
* basic reminder
* elapsed/countdown display
* settings
* local SQLite storage
* basic widget snapshot architecture
* i18n TR/EN
* theme tokens
* logger
* plan registry placeholder

First MVP excludes:

* full sync
* AI
* complex profile
* social features
* heavy dashboard
* many widget types
* active subscription rollout
* full admin system

## 23. Forbidden Practices

Forbidden:

* hardcoded UI text
* screen-owned business logic
* direct SQLite calls from UI
* direct SDK calls from UI/domain
* duplicated reminder calculations
* duplicated time calculations
* scattered premium checks
* scattered config constants
* unlogged critical operations
* unversioned database changes
* sensitive text inside logs or analytics

## 24. Final Architecture Check

Every feature must answer:

1. Is it controlled from a central registry?
2. Does it respect the Momenta Core Rule?
3. Does UI contain business logic?
4. Does it work offline?
5. Is it logged?
6. Is it testable?
7. Is it privacy-safe?
8. Is it i18n-ready?
9. Is it premium-ready?
10. Can it be removed or replaced without breaking the app?

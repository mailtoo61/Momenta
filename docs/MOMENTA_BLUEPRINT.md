# Momenta Blueprint

## 1. Product Identity

**App Name:** Momenta

**Product Type:** Premium personal life timeline companion

**Core Idea:**
Momenta is a calm, premium, offline-first time awareness app that helps users remember important things in their life without becoming a todo app, habit tracker, or classic reminder app.

**Product Promise:**
Remember what matters. See how long it has been. Know what is coming.

## 2. Locked Technology Stack

Momenta must be built with:

* Expo SDK 56
* React Native 0.85
* React 19.2.3
* React Native Web 0.21.0
* Node.js minimum 22.13.x
* TypeScript
* Windows development environment
* Production-grade architecture

## 3. Momenta Core Rule

* UI only displays.
* Domain decides.
* Repository manages data.
* Service runs side effects.
* Every critical operation is logged.
* Every system is controlled from a single source.
* SDKs are abstracted behind providers.
* Control must not be lost as the codebase grows.

## 4. Product Constitution

Momenta must always remain:

* Simple, but not empty
* Premium, but not heavy
* Offline-first
* User-focused
* Low-friction
* Fast to use
* Widget-first
* Privacy-first
* Expandable
* Easy to control from central registries

Momenta must not become:

* A todo app
* A generic reminder app
* A habit tracker clone
* A bloated productivity dashboard
* A social network
* An AI chatbot-first app

## 5. Foundation 100 — Final System List

### Product & UX

1. Product Constitution
2. Single Source of Truth
3. i18n / Localization
4. Theme System
5. Design Token System
6. Semantic Color System
7. Design Language System
8. Accessibility Layer
9. Motion System
10. Haptic Engine
11. Empty State System
12. Smart Onboarding
13. User Trust Layer
14. Widget-first Experience
15. Privacy-first UX

### Architecture

16. Domain-Driven Architecture
17. Scalable Folder Architecture
18. State Management Contract
19. Navigation Contract
20. Dependency Injection Layer
21. Service Layer
22. Repository Pattern
23. Single Responsibility Rule
24. Modular Domain Boundaries
25. Architecture Decision Records
26. Configuration Center
27. Feature Flag System
28. Remote Config Ready Layer
29. SDK Abstraction Layer
30. Provider Registry

### Data & Storage

31. Offline-first Core
32. SQLite Layer
33. Migration System
34. Backup Ready Layer
35. Sync Ready Layer
36. Data Export Architecture
37. Import Architecture
38. Versioned Data Contracts
39. Recovery System
40. Data Integrity Validator
41. Duplicate Detection
42. Merge System
43. Soft Delete System
44. Archive System
45. Undo System

### Time Engine

46. Central Time Engine
47. Timezone Handling
48. DST Handling
49. Locale Date Formatting
50. Recurring Logic
51. Elapsed Time Engine
52. Notification Engine
53. Reminder Rule Center
54. Reminder Reliability Checker
55. App Lifecycle Engine

### Widget Platform

56. Widget-first Architecture
57. Widget Registry
58. Widget Snapshot System
59. Widget Customization Layer
60. Widget Theme Layer
61. Widget Refresh Policy
62. Widget Content Safety Rules
63. Widget Deep Linking
64. Widget Premium Layer
65. Widget Analytics Layer

### Content & Intelligence

66. Content Registry
67. Micro Insight Engine
68. Smart Category Registry
69. Search Engine
70. Quick Add System
71. Template / Preset System
72. Future AI Boundary

### Monetization

73. Monetization Layer
74. Plan Registry
75. Premium Gate
76. RevenueCat-ready Architecture
77. Restore Purchase System
78. Subscription Value Guard
79. Paywall Compliance Layer
80. Subscription Legal Layer

### Analytics & Observability

81. Event Log / Audit Trail
82. Logger System
83. Crash Reporting
84. UX Telemetry
85. Analytics System
86. SDK Health Monitor
87. SDK Kill Switch
88. Internal Debug Console

### Security & Privacy

89. Privacy Manifest Registry
90. Third-Party SDK Governance
91. Consent & Tracking Policy
92. Security Layer
93. Sensitive Moment Protection
94. Face ID / Local Lock Ready Layer

### Operations & Release

95. App Store Metadata System
96. Screenshot / Preview Pipeline
97. Performance Budget
98. Test & Contract System
99. Release Governance
100. Build & Environment Governance

## 6. Implementation Order

The 100 foundation items must not be implemented randomly. Momenta must be built in phases.

### Phase 0 — Project Constitution & Technical Baseline

Goal: Lock the project rules before writing product logic.

Includes:

* Product Constitution
* Locked technology stack
* Momenta Core Rule
* Scalable folder architecture
* TypeScript strictness
* Architecture Decision Records
* Build and environment governance
* Basic documentation structure

Output:

* `docs/MOMENTA_BLUEPRINT.md`
* `docs/ARCHITECTURE.md`
* `docs/DECISIONS/`
* base Expo SDK 56 project
* strict TypeScript configuration

### Phase 1 — Foundation Centers

Goal: Create the central control systems.

Includes:

* Single Source of Truth
* Configuration Center
* Feature Flag System
* i18n / Localization
* Theme System
* Design Token System
* Semantic Color System
* Design Language System

Output:

* central theme tokens
* localization dictionaries
* configuration registry
* feature flag registry
* no hardcoded UI text rule

### Phase 2 — App Shell & UX Skeleton

Goal: Build the basic app shell without business complexity.

Includes:

* Navigation Contract
* State Management Contract
* Empty State System
* Smart Onboarding
* App Settings Center
* Accessibility Layer
* Motion System
* Haptic Engine

Output:

* onboarding shell
* home shell
* settings shell
* navigation structure
* shared UI components

### Phase 3 — Domain Core

Goal: Build Momenta’s real product heart.

Includes:

* Domain-Driven Architecture
* Modular Domain Boundaries
* moments domain
* Smart Category Registry
* Template / Preset System
* Quick Add System
* Search Engine
* User Trust Layer

Output:

* create moment
* list moments
* category system
* quick add flow
* preset moment templates

### Phase 4 — Data & Persistence

Goal: Make Momenta offline-first and durable.

Includes:

* SQLite Layer
* Migration System
* Repository Pattern
* Offline-first Core
* Data Integrity Validator
* Soft Delete System
* Archive System
* Undo System

Output:

* local persistent database
* moment repository
* migration runner
* archive/delete/restore behavior
* data validation

### Phase 5 — Time & Reminder Engine

Goal: Make time calculations correct and centralized.

Includes:

* Central Time Engine
* Timezone Handling
* DST Handling
* Locale Date Formatting
* Recurring Logic
* Elapsed Time Engine
* Notification Engine
* Reminder Rule Center
* Reminder Reliability Checker
* App Lifecycle Engine

Output:

* elapsed/countdown calculations
* upcoming/overdue states
* local notifications
* reminder scheduling
* reminder reliability checks

### Phase 6 — Content & Insight Engine

Goal: Make Momenta feel alive without becoming an AI app.

Includes:

* Content Registry
* Micro Insight Engine
* Notification Copy Registry
* Widget Content Safety Rules
* Future AI Boundary

Output:

* rule-based insights
* localized insight text
* category-aware micro messages
* safe widget copy rules

### Phase 7 — Widget Platform

Goal: Build the core differentiator.

Includes:

* Widget-first Architecture
* Widget Registry
* Widget Snapshot System
* Widget Customization Layer
* Widget Theme Layer
* Widget Refresh Policy
* Widget Deep Linking
* Widget Premium Layer
* Widget Analytics Layer

Output:

* small widget support
* selected moment widget
* elapsed/countdown widget
* widget snapshot data
* widget settings

### Phase 8 — Monetization Foundation

Goal: Prepare monetization without forcing it too early.

Includes:

* Monetization Layer
* Plan Registry
* Premium Gate
* RevenueCat-ready Architecture
* Restore Purchase System
* Subscription Value Guard
* Paywall Compliance Layer
* Subscription Legal Layer
* Store Copy / Paywall Copy Registry

Output:

* Free / Weekly / Monthly / Lifetime plan model
* central limits
* premium feature gates
* restore purchase placeholder
* RevenueCat provider abstraction

### Phase 9 — Observability & Debugging

Goal: Make the app understandable when something breaks.

Includes:

* Event Log / Audit Trail
* Logger System
* Crash Reporting
* UX Telemetry
* Analytics System
* SDK Health Monitor
* SDK Kill Switch
* Internal Debug Console

Output:

* structured logs
* audit events
* analytics abstraction
* hidden debug console
* provider health screen

### Phase 10 — Privacy, Security & Trust

Goal: Protect user data and prepare for App Store review.

Includes:

* Privacy Manifest Registry
* Privacy-first UX
* Third-Party SDK Governance
* Consent & Tracking Policy
* Security Layer
* Sensitive Moment Protection
* Face ID / Local Lock Ready Layer
* Data Retention & Reset Policy

Output:

* privacy registry
* local data reset
* sensitive widget visibility controls
* future Face ID-ready structure

### Phase 11 — Backup, Import, Export & Recovery

Goal: Prepare for long-term user data ownership.

Includes:

* Backup Ready Layer
* Sync Ready Layer
* Data Export Architecture
* Import Architecture
* Versioned Data Contracts
* Recovery System
* Duplicate Detection
* Merge System

Output:

* export-ready contract
* import-ready validation
* recovery flow
* duplicate handling model

### Phase 12 — App Store & Release Readiness

Goal: Prepare Momenta for real release.

Includes:

* App Store Metadata System
* Screenshot / Preview Pipeline
* Performance Budget
* Test & Contract System
* Release Governance
* Build & Environment Governance
* App Review checklist

Output:

* release checklist
* metadata files
* screenshot copy plan
* test suite
* build profiles
* versioning rules

## 7. Central Registries Required

Momenta must use central registries for:

* app config
* feature flags
* i18n keys
* theme tokens
* semantic colors
* categories
* reminder rules
* notification copy
* insight templates
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

No screen should own global rules.

## 8. Monetization Model

Momenta will support:

* Free
* Weekly
* Monthly
* Lifetime

This payment system does not need to be fully active on day one, but the architecture must support it from the beginning.

All plan limits must be controlled from a single Plan Registry.

Examples:

* free moment limit
* free widget limit
* premium widget access
* premium themes
* weekly summary access
* export access
* future sync access

## 9. Widget Product Rules

Widgets are a core product surface, not a side feature.

Widgets must be:

* glanceable
* calm
* readable
* user-controlled
* safe for private content
* customizable but not chaotic
* connected to the same domain logic as the app

Widget must never calculate its own business logic.
It must display a prepared widget snapshot.

## 10. Privacy Rules

Momenta must be privacy-first.

* Account is not required.
* User data stays local by default.
* Sensitive moments must not appear on widgets unless the user allows it.
* Analytics must not collect private moment content.
* Logs must not expose sensitive user text.
* Import/export must validate data safely.
* Future SDKs must be reviewed before integration.

## 11. SDK Rules

No SDK can be used directly inside UI or domain code.

SDKs must go through:

* SDK Abstraction Layer
* Provider Registry
* SDK Health Monitor
* SDK Kill Switch
* Third-Party SDK Governance

Examples:

* Billing provider
* Analytics provider
* Crash provider
* Notification provider
* Widget provider

## 12. Quality Rules

Momenta must include contract tests for:

* i18n missing keys
* theme token usage
* category registry
* reminder calculations
* timezone behavior
* premium limits
* widget snapshot generation
* SQLite migrations
* import/export contracts
* SDK provider contracts

## 13. First MVP Scope

The first realistic MVP should include only:

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
* logging
* plan registry placeholder

The first MVP should not include:

* full sync
* AI
* heavy dashboard
* complex profile
* social features
* full admin panel
* too many widget types
* complex subscription rollout

## 14. Final Rule

Every new feature must answer these questions before implementation:

1. Is it controlled from a central registry?
2. Does it violate the Momenta Core Rule?
3. Does UI contain business logic?
4. Does it work offline?
5. Is it logged?
6. Is it testable?
7. Is it privacy-safe?
8. Is it i18n-ready?
9. Is it future premium-ready?
10. Can it be removed or replaced without breaking the app?

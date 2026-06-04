Momenta Project Context
Project

Momenta

Product Definition

Momenta is a personal life timeline companion.

Momenta helps users remember important life events through:

moments
reminders
widgets
time awareness

Momenta is not:

a todo app
a habit tracker
a project manager
a social network
an AI chatbot

Core promise:

Remember What Matters.

Technology Stack

Platform:

iOS First

Framework:

Expo SDK 56
React Native 0.85
React 19.2.3
TypeScript

Development Environment:

Windows
VS Code
Codex

Node.js:

22.13.x minimum
Core Product Principles
Offline-first
Widget-first
Privacy-first
Localization-first
Accessibility-first
Premium quality UX
Core Architecture Rule

UI only displays.

Domain decides.

Repository manages data.

Service executes side effects.

Every critical operation is logged.

Every system is controlled from a single source.

SDKs are abstracted.

Main Domains
Moments
Reminders
Insights
Widgets
Monetization
Settings
Analytics
Privacy
Storage

Primary storage:

SQLite

Architecture:

Repository Pattern

Migration-based evolution

Widget Philosophy

Widgets are a primary product feature.

Widgets:

do not calculate business logic
display snapshots only
support privacy levels
deep link into the application
Reminder Philosophy

Reminder logic is centralized.

Time calculations belong to:

Time Engine

Reminder rules belong to:

Reminder Registry

Registry Philosophy

Global rules must be centralized.

Examples:

Category Registry
Widget Registry
Plan Registry
Settings Registry
Analytics Registry
Notification Registry
Localization

Launch:

Turkish
English

Future:

German
Spanish
French
Arabic

No hardcoded UI text.

Theme System

Single source of truth.

Supports:

Light
Dark
System

Uses:

design tokens
semantic colors
Monetization

Architecture supports:

Free
Weekly
Monthly
Lifetime

RevenueCat-ready.

Premium access controlled through:

Premium Gate

MVP Scope

Included:

Moments
Reminders
Time Awareness
Small Widget
Medium Widget
Search
Archive
Settings

Excluded:

AI
Cloud Sync
Family Spaces
Siri
Calendar Integration
Required Reading

Always read first:

PROJECT_CONTEXT.md
docs/CODEX_AGENT_RULES.md

Read additionally when needed:

Architecture:

docs/ARCHITECTURE.md

Database:

docs/DATABASE_SCHEMA.md

Widgets:

docs/REGISTRIES.md
docs/APP_FLOWS.md

Release:

docs/RELEASE_PROCESS.md
Final Rule

Protect architecture.

Protect product identity.

Prefer minimal blast radius.

Do not introduce complexity without clear user value.
# ADR-0001 — Technology Stack Decision

## Status

Accepted

Locked

---

## Decision Date

2026

---

## Title

Momenta Technology Stack Decision

---

## Context

Momenta is a premium personal life timeline companion.

The application must:

* be maintainable by a small team or a single developer
* support long-term growth
* remain cost efficient
* support iOS-first development
* support widgets
* support notifications
* support offline-first architecture
* support future monetization
* support future cloud synchronization
* support App Store requirements
* support rapid iteration

The technology stack must maximize product velocity while minimizing operational complexity.

---

# Decision

Momenta will be built using:

* Expo SDK 56
* React Native 0.85
* React 19.2.3
* React Native Web 0.21.0
* TypeScript
* Node.js minimum 22.13.x

Development environment:

* Windows workstation
* VS Code
* Codex-assisted workflow

Target platform:

* iOS first

Secondary targets:

* Android later
* Web optional future

---

# Frontend Decision

## Selected

React Native + Expo

---

## Reasoning

Advantages:

* fast development
* strong ecosystem
* TypeScript support
* OTA updates
* notification support
* widget ecosystem support
* modern architecture support
* lower maintenance cost
* easier onboarding

Compared to native Swift:

* faster iteration
* lower development cost
* smaller codebase

Compared to Flutter:

* stronger alignment with React ecosystem
* easier integration with planned architecture
* stronger Expo workflow

---

# Language Decision

## Selected

TypeScript

---

## Reasoning

Advantages:

* type safety
* refactoring safety
* contract enforcement
* better Codex compatibility
* reduced runtime errors

Plain JavaScript is not allowed.

---

# Database Decision

## Selected

SQLite

---

## Reasoning

Momenta is offline-first.

Requirements:

* local persistence
* reliability
* migration support
* low operational cost
* no mandatory backend

SQLite satisfies all MVP requirements.

---

# State Management Decision

## Selected

Zustand

---

## Reasoning

Advantages:

* simple
* scalable
* low boilerplate
* TypeScript friendly
* easy domain separation

Redux is considered unnecessary complexity for MVP.

---

# Navigation Decision

## Selected

Expo Router

---

## Reasoning

Advantages:

* Expo-native workflow
* filesystem routing
* predictable structure
* scalable navigation

---

# Monetization Decision

## Selected

RevenueCat-ready architecture

---

## Reasoning

RevenueCat will not be required in the first build.

However:

* entitlement architecture
* plan registry
* premium gates

must be compatible with RevenueCat.

---

# Notification Decision

## Selected

Expo Notifications

---

## Reasoning

Requirements:

* local reminders
* future remote notifications
* notification scheduling

Expo Notifications satisfies MVP requirements.

---

# Widget Decision

## Selected

Expo SDK 56 widget ecosystem

---

## Reasoning

Widgets are a core Momenta product surface.

Requirements:

* Home Screen widgets
* Lock Screen widgets
* widget customization
* widget snapshots

The architecture must be widget-first from the beginning.

---

# Backend Decision

## MVP

No backend required.

---

## Reasoning

Momenta is:

* offline-first
* privacy-first
* local-data-first

The first release must work entirely on-device.

Future cloud services may be added later.

---

# Analytics Decision

Analytics must be abstracted.

No analytics SDK may be called directly from UI.

Analytics Provider abstraction is mandatory.

---

# Crash Reporting Decision

Crash reporting must be abstracted.

No crash SDK may be called directly from UI.

Crash Provider abstraction is mandatory.

---

# SDK Policy

All SDKs must pass through:

* SDK Abstraction Layer
* Provider Registry
* SDK Health Monitor
* SDK Kill Switch

Direct SDK usage is forbidden.

---

# Consequences

Positive:

* faster development
* lower costs
* easier maintenance
* easier onboarding
* strong offline support
* strong widget support

Negative:

* dependency on Expo ecosystem
* some native features may require custom native work later

These tradeoffs are accepted.

---

# Final Statement

This technology stack is locked for Momenta.

Any proposal to replace:

* Expo
* React Native
* TypeScript
* SQLite

must include a written ADR explaining:

* why change is needed
* migration cost
* architectural impact
* long-term benefit

Otherwise the stack remains unchanged.

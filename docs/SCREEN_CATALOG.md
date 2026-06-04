# Screen Catalog

## Purpose

This document defines every official screen in Momenta.

The goal is:

* prevent screen sprawl
* maintain navigation consistency
* define ownership
* preserve product simplicity

Every screen must have:

* a purpose
* an owner
* a domain relationship
* a clear user value

If a screen cannot justify its existence, it should not exist.

---

# Screen Classification

Momenta screens are grouped into:

1. Core Product Screens
2. Supporting Screens
3. Premium Screens
4. Internal Screens
5. Future Screens

---

# CORE PRODUCT SCREENS

These screens define the product.

Removing them would damage Momenta.

---

## Onboarding Screen

Purpose:

Introduce product value.

Owner:

features/onboarding

Primary Domains:

moments

settings

widgets

---

Responsibilities:

* explain product
* create first moment
* introduce reminders
* introduce widgets

---

## Home Screen

Purpose:

Product hub.

Owner:

features/home

Primary Domains:

moments

reminders

insights

widgets

---

Responsibilities:

* upcoming moments
* overdue moments
* recent moments
* insights
* quick actions

---

Question Home answers:

What matters right now?

---

## Add Moment Screen

Purpose:

Create new moment.

Owner:

features/moments

Primary Domains:

moments

categories

reminders

---

Responsibilities:

* title
* category
* reminder setup
* notes
* save

---

## Moment Detail Screen

Purpose:

View a moment.

Owner:

features/moments

Primary Domains:

moments

reminders

widgets

time

---

Responsibilities:

* elapsed time
* countdown
* reminder status
* archive
* edit

---

## Edit Moment Screen

Purpose:

Modify existing moment.

Owner:

features/moments

Primary Domains:

moments

reminders

---

Responsibilities:

* update
* recalculate reminders
* refresh widget snapshots

---

## Search Screen

Purpose:

Find moments quickly.

Owner:

features/search

Primary Domains:

moments

categories

---

Responsibilities:

* title search
* category search
* note search

---

# SUPPORTING SCREENS

Support the product experience.

---

## Archive Screen

Purpose:

View archived moments.

Owner:

features/archive

Primary Domains:

moments

---

Responsibilities:

* restore
* delete permanently

---

## Categories Screen

Purpose:

Manage categories.

Owner:

features/categories

Primary Domains:

categories

---

Responsibilities:

* view categories
* custom categories
* category preferences

---

## Widget Gallery Screen

Purpose:

Discover widgets.

Owner:

features/widgets

Primary Domains:

widgets

premium

---

Responsibilities:

* widget browsing
* widget preview
* widget selection

---

## Widget Configuration Screen

Purpose:

Customize widgets.

Owner:

features/widgets

Primary Domains:

widgets

settings

---

Responsibilities:

* theme
* mode
* selected moment
* layout

---

## Notification Settings Screen

Purpose:

Reminder preferences.

Owner:

features/settings

Primary Domains:

reminders

settings

---

Responsibilities:

* notification behavior
* reminder preferences

---

## Appearance Screen

Purpose:

Theme control.

Owner:

features/settings

Primary Domains:

settings

theme

---

Responsibilities:

* light mode
* dark mode
* system mode

---

## Language Screen

Purpose:

Language selection.

Owner:

features/settings

Primary Domains:

settings

i18n

---

Responsibilities:

* language selection
* localization preview

---

## Privacy Screen

Purpose:

Privacy management.

Owner:

features/settings

Primary Domains:

privacy

---

Responsibilities:

* widget privacy
* sensitive moments
* data controls

---

## Data Screen

Purpose:

User data controls.

Owner:

features/settings

Primary Domains:

data

---

Responsibilities:

* export
* import
* reset

---

## About Screen

Purpose:

Product information.

Owner:

features/settings

---

Responsibilities:

* version
* changelog
* support
* legal

---

# PREMIUM SCREENS

---

## Paywall Screen

Purpose:

Premium conversion.

Owner:

features/paywall

Primary Domains:

premium

---

Responsibilities:

* plans
* benefits
* restore purchase

---

## Premium Features Screen

Purpose:

Show premium value.

Owner:

features/paywall

Primary Domains:

premium

---

Responsibilities:

* premium widgets
* premium themes
* premium insights

---

# INTERNAL SCREENS

Never visible to normal users.

---

## Debug Dashboard

Purpose:

Development diagnostics.

Owner:

features/debug

---

Responsibilities:

* logs
* feature flags
* provider status
* migrations

---

## Audit Viewer

Purpose:

Audit event review.

Owner:

features/debug

---

Responsibilities:

* audit inspection

---

## Widget Snapshot Viewer

Purpose:

Widget diagnostics.

Owner:

features/debug

---

Responsibilities:

* snapshot verification

---

# FUTURE SCREENS

Not MVP.

Reserved.

---

## Sync Screen

Future.

---

## Siri Integration Screen

Future.

---

## Calendar Integration Screen

Future.

---

## Family Spaces Screen

Future.

---

## Shared Timeline Screen

Future.

---

# SETTINGS INFORMATION ARCHITECTURE

Settings

├── Appearance
├── Language
├── Notifications
├── Widgets
├── Privacy
├── Data
├── Premium
└── About

---

# MVP SCREEN SET

Only these are required for MVP:

1. Onboarding
2. Home
3. Add Moment
4. Moment Detail
5. Edit Moment
6. Search
7. Archive
8. Widget Gallery
9. Widget Configuration
10. Settings
11. Paywall (placeholder)
12. About

Everything else can wait.

---

# Screen Ownership Rule

Each screen must have:

* one owner
* one purpose
* one primary responsibility

No screen should become a dumping ground.

---

# Final Rule

Before creating a new screen ask:

Can this be solved inside an existing screen?

If yes:

do not create a new screen.

New screens increase complexity and must be justified.

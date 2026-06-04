# Naming Conventions

## Purpose

This document defines naming standards for Momenta.

Consistent naming improves:

* readability
* maintainability
* onboarding
* searchability
* refactoring safety

Naming is architecture.

---

# General Rule

Names should be:

* descriptive
* predictable
* consistent
* stable

Avoid:

* abbreviations
* unclear names
* temporary names
* personal naming styles

---

# Language Rule

All code identifiers must be English.

Examples:

Good:

Moment

ReminderPlan

WidgetSnapshot

PremiumGate

Bad:

Hatirlatma

WidgetVerisi

AnlikGorunum

---

# Folder Naming

Use:

kebab-case

Examples:

add-moment

widget-gallery

notification-settings

premium-features

Good:

features/widget-gallery

Bad:

features/WidgetGallery

features/widget_gallery

---

# File Naming

Use:

camelCase

Examples:

momentRepository.ts

createMomentService.ts

widgetRegistry.ts

timeEngine.ts

Good:

scheduleReminderService.ts

Bad:

ScheduleReminder.ts

schedule_reminder.ts

---

# Component Naming

Use:

PascalCase

Examples:

HomeScreen

MomentCard

WidgetPreview

PremiumGateBanner

---

# Screen Naming

Always end with:

Screen

Examples:

HomeScreen

AddMomentScreen

MomentDetailScreen

SearchScreen

---

# Service Naming

Always end with:

Service

Examples:

createMomentService

archiveMomentService

scheduleReminderService

updateWidgetSnapshotService

---

# Repository Naming

Always end with:

Repository

Examples:

momentRepository

settingsRepository

widgetRepository

---

# Registry Naming

Always end with:

Registry

Examples:

categoryRegistry

widgetRegistry

planRegistry

notificationRegistry

---

# Provider Naming

Always end with:

Provider

Examples:

billingProvider

analyticsProvider

notificationProvider

widgetProvider

---

# Engine Naming

Always end with:

Engine

Examples:

timeEngine

insightEngine

notificationEngine

---

# Validator Naming

Always end with:

Validator

Examples:

momentValidator

importValidator

categoryValidator

---

# Mapper Naming

Always end with:

Mapper

Examples:

momentMapper

errorMapper

---

# Hook Naming

Always begin with:

use

Examples:

useTheme

useLocalization

useMomentSearch

---

# Store Naming

Always begin with:

use

Always end with:

Store

Examples:

useSettingsStore

useMomentStore

useWidgetStore

---

# Interface Naming

Do not use:

I prefixes

Bad:

IMoment

IReminder

Good:

Moment

ReminderPlan

WidgetSnapshot

---

# Type Naming

Use PascalCase.

Examples:

Moment

ReminderRule

PremiumPlan

AuditEvent

---

# Enum Naming

Use PascalCase.

Examples:

ReminderPriority

MomentPrivacyLevel

PremiumPlanType

---

# Constant Naming

Use:

UPPER_SNAKE_CASE

Examples:

MAX_WIDGETS_FREE

DEFAULT_REMINDER_DAYS

APP_VERSION

---

# Boolean Naming

Must read like a question.

Examples:

isPremium

isArchived

isDeleted

hasReminder

canExport

supportsWidgets

Bad:

premium

archive

export

---

# Event Naming

Use:

past tense

Examples:

moment_created

moment_updated

moment_archived

reminder_scheduled

widget_snapshot_generated

---

# Analytics Event Naming

Format:

object_action

Examples:

moment_created

widget_selected

premium_gate_opened

paywall_viewed

---

# Audit Event Naming

Format:

object_action

Examples:

migration_started

migration_completed

reminder_rescheduled

---

# i18n Key Naming

Format:

domain.section.key

Examples:

home.header.title

home.empty.description

moment.create.button

widget.gallery.title

settings.language.title

---

# Error Code Naming

Format:

DOMAIN_ERROR_NAME

Examples:

MOMENT_CREATE_FAILED

REMINDER_SCHEDULE_FAILED

WIDGET_SNAPSHOT_FAILED

IMPORT_INVALID_FILE

---

# Registry ID Naming

Use:

lowercase-kebab-case

Examples:

vehicle-maintenance

doctor-visit

pet-vaccination

family

health

---

# Feature Flag Naming

Format:

featureEnabled

Examples:

widgetsEnabled

premiumEnabled

exportEnabled

futureAiEnabled

---

# Theme Token Naming

Format:

category.property

Examples:

color.primary

color.warning

spacing.md

radius.lg

shadow.card

---

# Database Table Naming

Use:

snake_case

Examples:

moments

categories

reminder_plans

widget_snapshots

audit_logs

---

# Database Column Naming

Use:

camelCase

Examples:

createdAt

updatedAt

deletedAt

isArchived

isDeleted

---

# Migration Naming

Format:

YYYYMMDD_description

Examples:

20260701_initial_schema

20260710_add_widget_snapshots

20260718_add_archive_support

---

# ADR Naming

Format:

ADR-XXXX-title

Examples:

ADR-0001-tech-stack

ADR-0002-architecture-rules

---

# Documentation Naming

Use:

UPPERCASE_WITH_UNDERSCORES

Examples:

MOMENTA_BLUEPRINT.md

APP_FLOWS.md

DATABASE_SCHEMA.md

---

# Forbidden Names

Forbidden:

helper

helpers

common

misc

temp

new

test2

final

finalFinal

ultimate

random

stuff

manager

util

utils2

---

# Naming Stability Rule

Once public ids exist:

* category ids
* registry ids
* analytics ids
* audit ids
* export contract ids

they should not be renamed casually.

Stable identifiers are part of the product contract.

---

# Final Rule

When naming something ask:

Would a new developer understand this name instantly?

If not,

choose a better name.

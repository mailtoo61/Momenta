# App Flows

## Purpose

This document defines the official user flows of Momenta.

The goal is:

* predictable user experience
* consistent navigation
* low-friction interactions
* clear onboarding
* scalable product behavior

All future features should integrate into these flows rather than creating isolated experiences.

---

# Product Experience Principle

Momenta should feel:

* calm
* fast
* personal
* lightweight
* trustworthy

Momenta should never feel:

* overwhelming
* complicated
* corporate
* noisy
* task-manager-like

---

# First Launch Flow

## Goal

Get the user to value as quickly as possible.

---

Flow:

App Launch

↓

Welcome

↓

Value Proposition

↓

Create First Moment

↓

Reminder Selection

↓

Widget Introduction

↓

Home Screen

---

Success Criteria:

User creates at least one moment.

---

# Onboarding Flow

## Screen 1

Title:

Remember What Matters

Purpose:

Explain the product.

---

## Screen 2

Title:

Track Important Moments

Examples:

* vehicle inspection
* dentist visit
* call parents
* maintenance

---

## Screen 3

Title:

Stay Aware Of Time

Examples:

* elapsed time
* countdowns
* reminders

---

## Screen 4

Create First Moment

Required.

User must experience value.

---

## Screen 5

Widget Introduction

Optional.

Do not force installation.

---

## Completion

Home Screen

---

# Home Flow

Home is the product hub.

---

Sections:

Upcoming

↓

Overdue

↓

Recent Moments

↓

Insights

↓

Quick Actions

---

Goals:

* understand status immediately
* identify important items
* take action quickly

---

# Quick Add Flow

Goal:

Create a moment in seconds.

---

Flow:

Quick Add

↓

Title

↓

Category

↓

Reminder

↓

Save

---

Target:

Less than 10 seconds.

---

# Create Moment Flow

Flow:

Create Moment

↓

Title

↓

Category

↓

Optional Notes

↓

Reminder Configuration

↓

Widget Eligibility

↓

Save

---

Result:

Moment created

Reminder scheduled

Widget snapshot refreshed

Audit event created

---

# Edit Moment Flow

Flow:

Open Moment

↓

Edit

↓

Save

↓

Reminder recalculation

↓

Widget snapshot refresh

↓

Audit log entry

---

# Archive Flow

Flow:

Moment

↓

Archive

↓

Confirmation

↓

Archive Repository

↓

Audit Log

---

Result:

Moment removed from active lists.

---

# Restore Flow

Flow:

Archive

↓

Select Moment

↓

Restore

↓

Active List

---

Result:

Moment visible again.

---

# Delete Flow

Flow:

Moment

↓

Delete

↓

Confirmation

↓

Soft Delete

↓

Undo Window

---

Result:

Recoverable deletion.

---

# Search Flow

Flow:

Search

↓

Query

↓

Results

↓

Moment Detail

---

Supported:

* title
* category
* notes

---

# Reminder Flow

Flow:

Reminder Trigger

↓

Notification

↓

Open App

↓

Moment Detail

↓

Take Action

---

Examples:

Done

Reschedule

Dismiss

---

# Overdue Flow

Flow:

Home

↓

Overdue Section

↓

Moment

↓

Action

---

Purpose:

Reduce forgotten items.

---

# Insight Flow

Flow:

Insight Appears

↓

User Reads

↓

Optional Action

---

Examples:

3 days without exercise

Vehicle maintenance approaching

Family category quiet recently

---

Insights should be helpful, not judgmental.

---

# Widget Flow

Flow:

Widget Display

↓

Tap Widget

↓

Open App

↓

Relevant Moment

---

Widgets must always deep-link correctly.

---

# Widget Setup Flow

Flow:

Widget Settings

↓

Select Widget

↓

Select Theme

↓

Select Mode

↓

Save

---

Modes:

Elapsed

Countdown

Minimal

Compact

---

# Settings Flow

Sections:

Appearance

Language

Notifications

Widgets

Privacy

Data

Premium

About

---

Goal:

Everything configurable from one place.

---

# Premium Flow

Flow:

Premium Gate

↓

Paywall

↓

Plan Selection

↓

Purchase

↓

Entitlement Update

↓

Feature Unlock

---

Restore Purchase always available.

---

# Export Flow

Flow:

Settings

↓

Export Data

↓

Format Selection

↓

Generate File

↓

Share / Save

---

Formats:

JSON

CSV

Future formats

---

# Import Flow

Flow:

Settings

↓

Import Data

↓

Validation

↓

Preview

↓

Confirm

↓

Import

---

Invalid imports must fail safely.

---

# Notification Permission Flow

Flow:

User Creates Reminder

↓

Permission Explanation

↓

System Permission Request

↓

Granted or Denied

---

If denied:

show in-app upcoming reminders.

Never block the product.

---

# Privacy Flow

Flow:

Settings

↓

Privacy

↓

Sensitive Moment Settings

↓

Widget Visibility

↓

Data Controls

---

Goal:

User trust.

---

# Face ID Future Flow

Future:

Settings

↓

Privacy

↓

Face ID Protection

↓

Protected Moments

---

Not MVP.

Architecture-ready only.

---

# Debug Flow

Internal only.

Hidden.

Accessible only in debug or protected mode.

---

Contains:

Logs

Audit Events

Widget Snapshots

Reminder Queue

Feature Flags

Migration Status

---

Never visible in production.

---

# Error Recovery Flow

Failure

↓

User-Friendly Message

↓

Recovery Option

↓

Retry or Safe Exit

---

Raw technical errors are forbidden.

---

# Empty State Flow

No Moments

↓

Explanation

↓

Create First Moment

---

No Upcoming

↓

Calm Empty State

↓

Optional Suggestion

---

Empty states should feel intentional.

---

# Future Flows

Reserved:

* cloud sync
* family spaces
* calendar integration
* Apple Intelligence
* Siri/App Intents

Future features must integrate into existing flows.

---

# Final Rule

Every screen must answer:

Why does this exist?

If a screen cannot justify its place in a user flow, it should not exist.

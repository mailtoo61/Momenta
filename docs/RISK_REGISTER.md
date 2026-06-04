# Risk Register

## Purpose

This document identifies, tracks, and manages risks that could negatively impact Momenta.

The goal is:

* risk awareness
* proactive mitigation
* architectural resilience
* long-term sustainability

Risks should be reviewed periodically.

Ignoring risk does not remove risk.

---

# Risk Classification

Each risk contains:

* ID
* Category
* Description
* Impact
* Likelihood
* Mitigation
* Owner

---

Impact:

Low

Medium

High

Critical

---

Likelihood:

Low

Medium

High

---

# Product Risks

## RISK-001

Category:

Product Identity

Description:

Momenta gradually becomes a todo app.

Impact:

Critical

Likelihood:

Medium

Mitigation:

PRODUCT_RULES.md

Feature acceptance review.

Owner:

Product

---

## RISK-002

Category:

Product Identity

Description:

Momenta becomes a habit tracker clone.

Impact:

High

Likelihood:

Medium

Mitigation:

Product boundary enforcement.

Owner:

Product

---

## RISK-003

Category:

Feature Bloat

Description:

Too many features reduce clarity.

Impact:

High

Likelihood:

High

Mitigation:

Feature acceptance checklist.

Owner:

Product

---

# Reminder Risks

## RISK-010

Category:

Reminder Reliability

Description:

Reminder schedules become inaccurate.

Impact:

Critical

Likelihood:

Medium

Mitigation:

Time Engine

Reminder QA

Reminder Reliability Checker

Owner:

Engineering

---

## RISK-011

Category:

Reminder Reliability

Description:

Timezone changes break reminders.

Impact:

High

Likelihood:

Medium

Mitigation:

Central Time Engine

Timezone tests

Owner:

Engineering

---

## RISK-012

Category:

Reminder Reliability

Description:

DST transitions create incorrect reminders.

Impact:

Medium

Likelihood:

Medium

Mitigation:

DST validation tests

Owner:

Engineering

---

# Widget Risks

## RISK-020

Category:

Widget Reliability

Description:

Widget data becomes stale.

Impact:

High

Likelihood:

Medium

Mitigation:

Snapshot architecture

Refresh policy

Owner:

Engineering

---

## RISK-021

Category:

Widget Privacy

Description:

Sensitive content appears in widgets.

Impact:

Critical

Likelihood:

Low

Mitigation:

Privacy levels

Widget safety rules

Owner:

Engineering

---

## RISK-022

Category:

Widget Experience

Description:

Widgets become cluttered.

Impact:

Medium

Likelihood:

Medium

Mitigation:

UI UX System

Widget review process

Owner:

Design

---

# Data Risks

## RISK-030

Category:

Data Integrity

Description:

Database corruption.

Impact:

Critical

Likelihood:

Low

Mitigation:

Recovery System

Migration validation

Owner:

Engineering

---

## RISK-031

Category:

Migration

Description:

Migration causes data loss.

Impact:

Critical

Likelihood:

Medium

Mitigation:

Migration tests

Rollback strategy

Owner:

Engineering

---

## RISK-032

Category:

Import Export

Description:

Invalid imports damage user data.

Impact:

High

Likelihood:

Medium

Mitigation:

Validation layer

Versioned contracts

Owner:

Engineering

---

# Monetization Risks

## RISK-040

Category:

Billing

Description:

Premium access incorrectly granted.

Impact:

High

Likelihood:

Medium

Mitigation:

Premium Gate

Entitlement tests

Owner:

Engineering

---

## RISK-041

Category:

Billing

Description:

Restore purchases fail.

Impact:

Critical

Likelihood:

Medium

Mitigation:

Restore testing

Provider abstraction

Owner:

Engineering

---

## RISK-042

Category:

Monetization

Description:

Premium provides insufficient value.

Impact:

High

Likelihood:

Medium

Mitigation:

Subscription Value Guard

Owner:

Product

---

# Privacy Risks

## RISK-050

Category:

Privacy

Description:

Sensitive content leaks through logs.

Impact:

Critical

Likelihood:

Low

Mitigation:

Logging policy

Privacy review

Owner:

Engineering

---

## RISK-051

Category:

Privacy

Description:

Analytics captures private content.

Impact:

Critical

Likelihood:

Low

Mitigation:

Analytics governance

Owner:

Engineering

---

# SDK Risks

## RISK-060

Category:

Vendor Lock-In

Description:

Architecture depends on a specific SDK.

Impact:

High

Likelihood:

Medium

Mitigation:

Provider abstraction

Owner:

Architecture

---

## RISK-061

Category:

SDK Failure

Description:

Third-party SDK outage.

Impact:

Medium

Likelihood:

Medium

Mitigation:

Kill Switch

Health Monitor

Owner:

Engineering

---

# Performance Risks

## RISK-070

Category:

Performance

Description:

Application startup becomes slow.

Impact:

High

Likelihood:

Medium

Mitigation:

Performance budget

Owner:

Engineering

---

## RISK-071

Category:

Performance

Description:

Widget refresh becomes expensive.

Impact:

Medium

Likelihood:

Medium

Mitigation:

Snapshot architecture

Owner:

Engineering

---

## RISK-072

Category:

Battery

Description:

Reminder system consumes excessive battery.

Impact:

High

Likelihood:

Low

Mitigation:

Lifecycle controls

Owner:

Engineering

---

# App Store Risks

## RISK-080

Category:

App Store

Description:

App Review rejection.

Impact:

High

Likelihood:

Medium

Mitigation:

APP_STORE_READINESS.md

Owner:

Release

---

## RISK-081

Category:

App Store

Description:

Subscription compliance issue.

Impact:

Critical

Likelihood:

Medium

Mitigation:

Subscription review

Owner:

Release

---

# Quality Risks

## RISK-090

Category:

Testing

Description:

Critical flows are not tested.

Impact:

Critical

Likelihood:

Medium

Mitigation:

QA Checklist

Contract tests

Owner:

Engineering

---

## RISK-091

Category:

Regression

Description:

New features break existing behavior.

Impact:

High

Likelihood:

High

Mitigation:

Regression testing

Owner:

Engineering

---

# Team Risks

## RISK-100

Category:

Knowledge

Description:

Architecture knowledge exists only in memory.

Impact:

High

Likelihood:

High

Mitigation:

Documentation-first culture

Owner:

Architecture

---

## RISK-101

Category:

Maintenance

Description:

Project becomes difficult to understand after long inactivity.

Impact:

High

Likelihood:

Medium

Mitigation:

ADR system

Blueprint

Documentation

Owner:

Architecture

---

# Risk Review Schedule

Review:

* every major phase
* every release candidate
* every major architectural decision

---

# Escalation Rule

Critical risks require:

* mitigation plan
* owner
* review

before release.

---

# Final Rule

A known risk without a mitigation plan is not a managed risk.

It is a future problem waiting to happen.

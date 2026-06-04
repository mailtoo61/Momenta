# QA Checklist

## Purpose

This document defines the mandatory quality assurance process for Momenta.

Every phase, milestone, release candidate, beta build, and production build must pass this checklist.

No feature is considered complete until it passes QA.

---

# QA Philosophy

Momenta is:

* offline-first
* widget-first
* reminder-driven
* privacy-first

Therefore QA must focus on:

* reliability
* correctness
* consistency
* user trust

over visual polish alone.

---

# Universal QA Rule

Every feature must be verified for:

* functionality
* localization
* accessibility
* performance
* privacy
* logging
* analytics
* failure handling

before approval.

---

# Product Constitution QA

Verify:

* product still aligns with Momenta vision
* no todo app behavior introduced
* no habit tracker behavior introduced
* no productivity dashboard bloat introduced
* widget-first philosophy preserved

Pass / Fail

---

# Localization QA

Verify:

* no hardcoded text
* all keys resolved
* Turkish translations exist
* English translations exist
* fallback behavior works

Check:

* Home
* Add Moment
* Detail
* Settings
* Paywall
* Widgets

Pass / Fail

---

# Theme QA

Verify:

* light theme works
* dark theme works
* semantic colors resolve correctly
* no hardcoded colors introduced
* contrast remains readable

Pass / Fail

---

# Accessibility QA

Verify:

* VoiceOver labels exist
* Dynamic Type scales correctly
* touch targets are large enough
* Reduce Motion respected
* widgets remain readable

Pass / Fail

---

# Navigation QA

Verify:

* every route loads
* back navigation works
* deep links resolve correctly
* widget links resolve correctly
* notification links resolve correctly

Pass / Fail

---

# Moment Domain QA

Verify:

* create moment
* update moment
* archive moment
* restore moment
* delete moment

Verify:

* category assignment
* preset assignment
* timestamps

Pass / Fail

---

# Category Registry QA

Verify:

* every category appears correctly
* category colors resolve correctly
* category icons resolve correctly
* localization exists

Pass / Fail

---

# Reminder Engine QA

Verify:

* reminder creation
* reminder update
* reminder deletion
* reminder reschedule

Verify:

* today
* tomorrow
* one week before
* one month before
* overdue

Pass / Fail

---

# Time Engine QA

Verify:

* elapsed calculations
* countdown calculations
* timezone changes
* locale formatting
* recurring calculations
* DST transitions

Pass / Fail

---

# Widget QA

Verify:

* small widget
* medium widget
* large widget

Verify:

* snapshot updates
* privacy rules
* category rendering
* premium widgets
* selected moment widgets

Pass / Fail

---

# Widget Customization QA

Verify:

* theme switching
* compact mode
* minimal mode
* countdown mode
* elapsed mode

Pass / Fail

---

# Notification QA

Verify:

* notification scheduling
* notification cancellation
* notification updates
* permission denied state

Verify:

* no duplicate notifications
* no missing notifications

Pass / Fail

---

# SQLite QA

Verify:

* database creation
* database upgrade
* migration execution
* migration rollback recovery

Pass / Fail

---

# Repository QA

Verify:

* create
* read
* update
* delete
* archive
* restore

Pass / Fail

---

# Import QA

Verify:

* valid imports
* invalid imports
* duplicate imports
* corrupted imports

Pass / Fail

---

# Export QA

Verify:

* JSON export
* CSV export
* future export contracts

Pass / Fail

---

# Premium QA

Verify:

* Free plan
* Weekly plan
* Monthly plan
* Lifetime plan

Verify:

* premium gates
* limits
* widgets
* themes

Pass / Fail

---

# RevenueCat QA

When enabled verify:

* purchase
* restore purchase
* entitlement sync
* subscription expiration

Pass / Fail

---

# Analytics QA

Verify:

* event firing
* event naming
* event deduplication

Verify:

* no sensitive data collected

Pass / Fail

---

# Logging QA

Verify:

* critical operations logged
* errors logged
* warning paths logged

Verify:

* no sensitive content logged

Pass / Fail

---

# Crash Reporting QA

Verify:

* crash capture
* startup error capture
* service failure capture

Pass / Fail

---

# Settings QA

Verify:

* language switching
* theme switching
* notification settings
* widget settings
* privacy settings

Pass / Fail

---

# Privacy QA

Verify:

* no private content exposed
* widget privacy respected
* export privacy respected
* analytics privacy respected

Pass / Fail

---

# Performance QA

Verify:

* cold start
* navigation speed
* widget refresh speed
* reminder scheduling speed

Verify:

* no excessive memory usage
* no UI jank

Pass / Fail

---

# Battery QA

Verify:

* reminder engine efficiency
* widget refresh efficiency
* background activity efficiency

Pass / Fail

---

# Offline QA

Verify:

* create moment offline
* edit moment offline
* archive moment offline
* reminders continue working
* widgets continue working

Pass / Fail

---

# Internal Debug QA

Verify:

* logs visible
* migrations visible
* reminder queue visible
* widget snapshots visible

Verify:

* debug tools hidden from production

Pass / Fail

---

# Release Candidate QA

Before release verify:

* all critical flows pass
* no blocker bugs remain
* crash-free testing completed
* localization completed
* accessibility completed

Pass / Fail

---

# App Store QA

Verify:

* screenshots updated
* metadata updated
* privacy policy updated
* terms updated
* release notes updated

Pass / Fail

---

# Final Release Gate

A release may proceed only if:

* all critical items pass
* no blocker issues exist
* privacy review passes
* accessibility review passes
* widget review passes
* reminder review passes

Otherwise release is blocked.

---

# Final Rule

If QA is skipped:

the feature is not complete.

If QA fails:

the release is not ready.

Momenta quality standards are mandatory.

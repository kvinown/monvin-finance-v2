# Atlas Product Roadmap

> Version: 1.0
> Status: Active

---

# Purpose

This document defines the long-term evolution of Atlas.

The roadmap is organized by **product capabilities**, not deadlines.

Atlas is a long-term personal project. Progress is driven by product maturity rather than release schedules.

---

# Roadmap Philosophy

Each phase introduces a new capability.

A phase is considered complete when the capability is stable, tested, and integrated into the overall system.

Features should only be added if they strengthen the vision of Atlas as a **Personal Financial Operating System (PFOS)**.

---

# Product Lifecycle

```
Foundation
        ↓
Core Finance
        ↓
Collaboration
        ↓
Planning
        ↓
Analytics
        ↓
Automation
        ↓
Artificial Intelligence
        ↓
Platform
```

Each phase builds on the previous one.

---

# Phase 1 — Foundation

**Status:** In Progress

## Goal

Build the technical foundation of Atlas.

## Capabilities

- Authentication
- User Profile
- Theme (Light/Dark)
- Settings
- PostgreSQL + Prisma
- Supabase Integration
- NextAuth (Auth.js)
- Responsive Layout
- Design System
- Server Actions
- Feature-Based Architecture

## Success Criteria

- Users can securely sign in.
- Core architecture is stable.
- Database schema is established.
- Development workflow is documented.

---

# Phase 2 — Core Finance

**Status:** Planned

## Goal

Enable complete personal financial tracking.

## Capabilities

- Wallet Management
- Income Tracking
- Expense Tracking
- Transfers Between Wallets
- Categories
- Notes
- Attachments (Future)
- Current Balance
- Transaction History
- Search & Filters

## Success Criteria

- Every financial movement is recorded.
- Wallet balances remain consistent.
- Dashboard reflects real-time financial status.

---

# Phase 3 — Collaboration

**Status:** Planned

## Goal

Support collaborative financial activities.

## Capabilities

- Friend System
- Friend Requests
- P2P Transfers
- Shared Vault
- Vault Members
- Vault Contributions
- Vault Progress
- Activity History

## Success Criteria

- Users can manage shared financial goals.
- P2P transfers are atomic and auditable.
- Collaboration remains secure and intuitive.

---

# Phase 4 — Planning

**Status:** Planned

## Goal

Help users plan future financial activities.

## Capabilities

- Savings Goals
- Budget Planning
- Wishlist
- Bills
- Subscription Tracking
- Calendar
- Recurring Transactions
- Financial Reminders

## Success Criteria

- Users can plan upcoming expenses.
- Financial goals become measurable.
- Recurring events reduce manual work.

---

# Phase 5 — Analytics

**Status:** Planned

## Goal

Transform financial records into meaningful insights.

## Capabilities

- Spending Trends
- Income Trends
- Cash Flow Analysis
- Category Breakdown
- Monthly Reports
- Yearly Reports
- Net Worth
- Financial Health Score

## Success Criteria

- Users understand where money comes from and where it goes.
- Reports support better financial decisions.

---

# Phase 6 — Automation

**Status:** Planned

## Goal

Reduce repetitive financial tasks.

## Capabilities

- CSV Import
- Receipt OCR
- Scheduled Transactions
- Smart Categorization
- Bank Import (Future)
- Notification Engine

## Success Criteria

- Daily bookkeeping requires minimal manual input.
- Data entry becomes faster and more reliable.

---

# Phase 7 — Artificial Intelligence

**Status:** Planned

## Goal

Provide proactive financial assistance.

## Capabilities

- Spending Insights
- Cash Flow Forecast
- Goal Recommendations
- Budget Suggestions
- AI Chat Assistant
- Smart Search
- Personalized Financial Advice

## Success Criteria

- AI provides useful recommendations without altering financial records.
- Insights are explainable and based on existing data.

---

# Phase 8 — Platform

**Status:** Planned

## Goal

Prepare Atlas for long-term sustainability and extensibility.

## Capabilities

- Public API (Optional)
- Plugin Architecture
- Data Export
- Data Import
- Backup & Restore
- Multi-Device Synchronization
- Offline Support
- Performance Optimization

## Success Criteria

- Atlas becomes resilient and extensible.
- User data remains portable and recoverable.

---

# Future Ideas

Ideas that may be explored in the future.

- Investment Portfolio
- Cryptocurrency Tracking
- Asset Management
- Loan Management
- Insurance Tracking
- Tax Reporting
- Family Accounts
- Business Accounts
- Financial Journal
- Achievement System

These ideas are intentionally separated from the active roadmap.

---

# Prioritization Principles

When choosing the next feature, prioritize:

1. Financial correctness
2. User value
3. Integration with existing modules
4. Maintainability
5. Development simplicity

Avoid implementing isolated features that do not support the overall product vision.

---

# Definition of Done

A roadmap item is considered complete only when:

- Architecture documented
- Database updated
- Business logic implemented
- UI completed
- Validation implemented
- Error handling implemented
- Tests completed
- Documentation updated

Implementation alone does not mark a feature as complete.

---

# Guiding Principle

> Atlas grows by adding capabilities, not by accumulating disconnected features.

Every new capability should strengthen Atlas as a Personal Financial Operating System.
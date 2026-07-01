# System Overview

> Version: 1.0
> Last Updated: June 2026
> Status: Active

---

# Overview

Atlas is a modern personal financial management platform designed for a single primary user while supporting collaborative financial workflows with trusted people (friends, partner, family).

Unlike traditional expense trackers, Atlas aims to become a complete financial operating system that centralizes every aspect of personal finance in one application.

The application focuses on simplicity in daily usage while maintaining a highly extensible architecture for future modules.

---

# Vision

Atlas should become the only application required to manage personal finances.

Instead of opening multiple applications for:

- Bank balances
- E-Wallet balances
- Savings
- Shared savings
- Debt tracking
- Financial analytics
- Wishlist
- Investments

everything should be available inside Atlas.

---

# Core Philosophy

Atlas follows these principles.

## 1. Personal First

The application is designed primarily for personal use.

Every feature must provide direct value to the owner before considering scalability for public users.

Complex enterprise features should never reduce usability.

---

## 2. Data Integrity Above Everything

Financial data is permanent.

Incorrect balances are unacceptable.

Every architectural decision must prioritize:

- consistency
- traceability
- atomicity
- auditability

No shortcut should compromise financial accuracy.

---

## 3. Modular Growth

Every module should be independently developed.

Future modules must not require rewriting previous ones.

Examples:

Wallet module should not know about Investment module.

Savings module should not depend on Shared Vault implementation.

---

## 4. User Experience Matters

Atlas should feel like a native mobile application.

Performance is a feature.

Animations should be subtle.

Interactions should feel instant.

---

## 5. Simplicity Over Feature Creep

Adding features is easy.

Maintaining them is difficult.

Every new feature must answer:

> Does this solve a real problem that occurs repeatedly?

If not, reconsider adding it.

---

# Product Goals

Atlas aims to solve these daily problems.

- Where did my money go?
- How much money do I actually own?
- How much debt do I have?
- How much savings have I accumulated?
- How much money is shared with others?
- Am I following my budget?
- Can I afford my wishlist?
- What is my financial trend over time?

---

# Scope

## Phase 1

Foundation

- Authentication
- Dashboard
- Wallet Management
- Categories
- Income
- Expense
- Transfers
- Friends
- Shared Vault
- Savings Goals

---

## Phase 2

Personal Finance Expansion

- Budget Planning
- Wishlist
- Debt Tracking
- Financial Calendar
- Recurring Transactions
- Analytics
- Notifications

---

## Phase 3

Advanced Finance

- Investment Portfolio
- OCR Receipt Scanner
- AI Insights
- Forecasting
- Export & Backup

---

# Primary Modules

Atlas consists of several independent modules.

## Authentication

Responsible for:

- User registration
- Login
- Session management
- OAuth providers

Future providers can be added without changing business logic.

---

## Wallet

Stores every financial account.

Examples:

- Bank
- Cash
- E-Wallet
- Credit Card
- PayLater

Wallets represent where money exists.

---

## Transaction

Responsible for recording:

- Income
- Expense
- Transfer

Transactions are immutable records.

Historical transactions should never disappear.

---

## Savings

Represents money intentionally separated from daily spending.

Supports:

- Goals
- Progress
- Deadlines

---

## Friend

Represents trusted users.

Friends enable:

- Transfers
- Shared Vault
- Future collaboration

---

## Shared Vault

Collaborative savings.

Multiple users contribute to one financial goal.

Example:

Trip to Japan

Members:

- Kevin
- Pelin

Both can contribute independently.

---

## Analytics

Transforms financial data into useful insights.

Examples:

Monthly spending

Category distribution

Cash flow

Saving rate

Budget comparison

---

# High-Level Architecture

```
                    Client

          Next.js App Router

                    │

        Server Components

                    │

          Server Actions / API

                    │

            Business Layer

                    │

             Prisma Client

                    │

          PostgreSQL (Supabase)

                    │

          Storage / Realtime
```

---

# Technology Stack

## Frontend

- Next.js 15
- React 19
- TypeScript
- TailwindCSS
- Shadcn UI
- Lucide Icons

---

## Backend

- Next.js Route Handlers
- Server Actions
- Auth.js

---

## Database

- PostgreSQL
- Prisma ORM
- Supabase

---

## Development

- Antigravity IDE
- Gemini Pro
- Stitch MCP
- Supabase MCP

---

# System Principles

## Stateless Server

Business logic should never depend on in-memory state.

All important state belongs in the database.

---

## Server-First

Whenever possible:

- Fetch on server
- Validate on server
- Mutate on server

Client should remain lightweight.

---

## Type Safety

Every layer must use TypeScript.

Avoid "any".

End-to-end type safety is preferred.

---

## Feature Isolation

Each feature owns:

- Components
- Services
- Hooks
- Actions
- Validators
- Types

Features should not directly depend on each other.

---

# Data Ownership

Each module owns its own data.

Wallet module

owns

- Wallet
- Balance

Transaction module

owns

- Transaction
- Transaction Item

Savings module

owns

- Savings Goal
- Contribution

Friend module

owns

- Friendship

Shared Vault

owns

- Vault
- Vault Members
- Vault Transactions

This separation reduces coupling.

---

# Security Principles

Authentication is mandatory.

Authorization must always be checked server-side.

Never trust client input.

Every mutation must validate input.

Passwords are never stored in plain text.

---

# Performance Goals

Page load should feel instant.

Prefer:

- Server Components
- Streaming
- Lazy Loading
- Pagination
- Optimistic Updates

Avoid unnecessary client rendering.

---

# Design Principles

The UI should feel inspired by:

- Apple Wallet
- Linear
- Notion
- Arc Browser

Characteristics:

- Clean
- Spacious
- Minimal
- Modern
- Mobile-first

---

# Future Expansion

Atlas is intentionally designed for future modules without requiring significant architectural changes.

Potential future modules include:

- Investment Portfolio
- Crypto Tracking
- Gold Assets
- Insurance
- Loan Management
- AI Financial Assistant
- Receipt OCR
- Financial Forecasting
- Export to Excel/PDF
- Cloud Backup

---

# Success Criteria

Atlas is considered successful when:

- Daily financial recording takes less than 30 seconds.
- Financial data is always accurate.
- Every balance is traceable.
- Shared financial activities remain transparent.
- New modules can be added without rewriting the core architecture.

---

# Guiding Principle

> Atlas is not built to become the largest finance application.
> Atlas is built to become the most reliable personal financial operating system for its owner.
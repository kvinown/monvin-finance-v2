# Clean Architecture

> Version: 1.0
> Status: Active

---

# Purpose

This document defines the architectural rules for Atlas.

Its purpose is to ensure every feature is built consistently regardless of whether the implementation is written by a human developer or an AI coding assistant.

The architecture prioritizes:

- Simplicity
- Scalability
- Maintainability
- Readability
- Type Safety

Atlas intentionally avoids unnecessary enterprise patterns while remaining extensible for future growth.

---

# Architectural Philosophy

Atlas follows **Feature-Driven Clean Architecture**.

Instead of separating files by technical type (controllers, models, repositories), Atlas organizes code around business capabilities.

This keeps related files close together and reduces cognitive load.

Every feature should be independently understandable.

---

# Core Principles

## 1. Feature First

Every business capability lives inside its own feature.

Example:

```

features/
wallet/
transaction/
friend/
vault/
savings/

```

A feature owns everything it needs.

---

## 2. Separation of Responsibilities

Each layer has exactly one responsibility.

| Layer | Responsibility |
|---------|----------------|
| UI | Display data |
| Action | Receive requests |
| Service | Business rules |
| Repository | Database communication |
| Validator | Input validation |
| Type | Shared typing |

---

## 3. Server First

Whenever possible:

- Data fetching occurs on the server.
- Validation occurs on the server.
- Mutations occur on the server.

The client should focus only on interaction.

---

## 4. Business Logic Never Lives in Components

React Components should never contain:

- financial calculations
- database logic
- validation
- permission checking

Components should only display data.

---

# Folder Structure

```

src/

features/

auth/

dashboard/

wallet/

transaction/

friend/

vault/

savings/

analytics/

settings/

shared/

components/

lib/

```

---

# Feature Structure

Every feature follows the same structure.

```

wallet/

actions/

components/

hooks/

repositories/

services/

validators/

types/

constants/

utils/

index.ts

```

---

# Responsibilities

## Components

Responsible for UI only.

Allowed:

- rendering
- event binding
- displaying loading state

Not allowed:

- Prisma
- fetch
- business logic

---

## Actions

Actions are entry points for mutations.

Responsibilities:

- receive input
- authenticate user
- validate input
- call service
- return result

Actions should remain thin.

---

## Services

Services contain business logic.

Example:

```

Transfer Money

Check ownership

Check balance

Create transaction

Update balances

Create audit log

Return response

```

Services should never know anything about React.

---

## Repositories

Repositories isolate Prisma queries.

Responsibilities:

- create
- update
- delete
- query

Repositories should not contain business logic.

---

## Validators

Every input must have a validator.

Use

- Zod

Validators should be reusable.

---

## Types

Contains

- DTO
- Interfaces
- Shared Types

Avoid duplicated types.

---

# Request Flow

```

User

↓

Component

↓

Server Action

↓

Validator

↓

Service

↓

Repository

↓

Prisma

↓

PostgreSQL

```

Every mutation follows this flow.

---

# Dependency Rules

Allowed

```

Component

↓

Action

↓

Service

↓

Repository

↓

Prisma

```

Not Allowed

```

Component

↓

Prisma

```

---

Not Allowed

```

Component

↓

Database

```

---

Not Allowed

```

Service

↓

React Hook

```

---

# Shared Code

Shared utilities belong inside

```

src/shared

```

Examples:

```

Currency Formatter

Date Formatter

Logger

Config

Constants

```

Business-specific code should never live here.

---

# Error Handling

Errors should never be thrown directly to the UI.

Preferred flow

```

Database Error

↓

Repository Error

↓

Service Error

↓

Action

↓

Friendly UI Message

```

Unexpected errors should be logged.

---

# Validation Strategy

Every mutation must validate.

Flow

```

Input

↓

Zod

↓

Business Validation

↓

Database

```

Example

User enters amount

↓

Amount > 0

↓

Wallet exists

↓

Wallet belongs to user

↓

Balance sufficient

↓

Execute transfer

---

# Transactions

Financial operations must be atomic.

Always use

```

prisma.$transaction()

```

Examples

Transfer

P2P

Shared Vault Contribution

Savings Allocation

Never partially update financial data.

---

# State Management

Prefer

Server State

↓

React Query (if required)

↓

Local State

↓

URL State

Avoid unnecessary global state.

Use Context only for UI concerns.

---

# Authentication

Authentication belongs at Action level.

Never trust client authentication.

Every mutation verifies:

- user exists
- session valid
- ownership

---

# Authorization

Ownership must always be checked.

Example

User edits wallet

↓

Wallet belongs to user?

↓

YES

↓

Continue

NO

↓

403

---

# Logging

Important events should be logged.

Examples

Login

Password Change

Wallet Deleted

Transfer

Vault Contribution

Future Audit Log module will consume these events.

---

# Performance

Prefer

Server Components

Streaming

Pagination

Optimistic Updates

Avoid

Over-fetching

Nested queries without need

Duplicate API calls

---

# Naming Convention

Actions

```

createWallet()

```

Services

```

WalletService

```

Repositories

```

WalletRepository

```

Validators

```

wallet.schema.ts

```

Components

```

WalletCard.tsx

```

---

# AI Rules

When generating code:

- Never bypass Service Layer.
- Never access Prisma inside Components.
- Never duplicate validation.
- Never mix business logic with UI.
- Prefer composition over inheritance.
- Explain architectural trade-offs before introducing new patterns.

---

# Architecture Checklist

Every feature should answer YES to all questions.

- Is UI independent?
- Is validation reusable?
- Is business logic isolated?
- Is Prisma isolated?
- Can the feature be tested independently?
- Can another AI understand this feature within five minutes?
- Is the feature consistent with every other module?

If any answer is NO, the implementation should be reconsidered.

---

# Guiding Principle

> Code should be organized around business capabilities, not framework limitations.

The architecture should make future development easier, not merely satisfy today's requirements.
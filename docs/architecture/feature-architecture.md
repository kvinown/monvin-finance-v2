# Feature Architecture

> Version: 1.0
> Status: Active

---

# Purpose

Atlas is built using a **Feature-Driven Architecture**.

Instead of organizing code by technical layers (components, hooks, utils, etc.), Atlas organizes code around business capabilities.

Every feature should be independently understandable, testable, and maintainable.

The goal is to make adding new features easier without affecting existing modules.

---

# Why Feature-Driven?

Traditional projects usually look like this.

```

components/

hooks/

utils/

services/

pages/

```

As the project grows, related files become scattered across the repository.

Finding everything related to a Wallet feature requires opening many folders.

Atlas avoids this problem.

Instead, every feature owns everything it needs.

---

# Feature Definition

A feature represents one business capability.

Examples:

- Authentication
- Wallet
- Transaction
- Savings
- Friend
- Shared Vault
- Analytics
- Dashboard

Each feature should solve exactly one business problem.

---

# Project Structure

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

calendar/

wishlist/

settings/

shared/

```

---

# Shared Module

The shared module contains code that is **not business specific**.

Examples:

- Button
- Modal
- Currency Formatter
- Date Formatter
- Theme
- Config
- Logger

Never move Wallet logic into shared.

---

# Standard Feature Structure

Every feature follows exactly the same structure.

```

wallet/

README.md

actions/

components/

hooks/

services/

repositories/

validators/

schemas/

types/

constants/

utils/

lib/

tests/

index.ts

```

---

# Folder Responsibilities

## README

Describes the feature.

Contains

- Purpose
- Database Tables
- Public APIs
- Dependencies
- Future Improvements

Every feature should have one.

---

## actions

Server Actions.

Responsibilities

- Authenticate
- Validate
- Call Service
- Return Response

Actions should remain thin.

---

## components

UI only.

Allowed

- rendering
- event handling
- loading state

Forbidden

- Prisma
- SQL
- business logic

---

## hooks

Reusable React Hooks.

Examples

```

useWallet()

useWalletBalance()

```

Hooks should never mutate the database directly.

---

## services

Business logic.

Examples

Transfer Money

Calculate Balance

Move Savings

Create Shared Vault

Services are framework-independent.

---

## repositories

Responsible for database communication.

Repositories isolate Prisma queries.

Examples

```

WalletRepository

TransactionRepository

```

---

## validators

Contains Zod validation.

Every mutation must have validation.

Example

```

Create Wallet

Update Wallet

Delete Wallet

```

---

## schemas

Shared schema definitions.

Examples

```

WalletType

Currency

Enums

```

---

## types

Contains

DTO

Interfaces

API Response

Shared Types

Avoid duplicated definitions.

---

## constants

Business constants.

Examples

Wallet Limits

Maximum Members

Supported Currency

Never hardcode values inside services.

---

## utils

Small helper functions.

Examples

Currency Formatting

Date Formatting

Balance Formatting

Utility functions should remain pure.

---

## lib

Feature-specific libraries.

Examples

Wallet Calculator

Transfer Engine

Balance Engine

Unlike utils, lib may contain more complex logic.

---

## tests

Contains

Unit Tests

Integration Tests

Feature tests

Every important service should have tests.

---

# Public API

Each feature exposes only one entry point.

Example

```

wallet/

index.ts

```

Exports

```

components

hooks

actions

types

```

Internal implementation should remain private.

---

# Dependency Rules

Allowed

```

Wallet

↓

Shared

```

Allowed

```

Transaction

↓

Wallet

```

Not Allowed

```

Wallet

↓

Analytics

```

Analytics depends on Wallet.

Wallet never depends on Analytics.

Dependencies always point downward.

---

# Communication Between Features

Features communicate through Services.

Example

```

Transfer

↓

Wallet Service

↓

Transaction Service

```

Never import database models directly between features.

---

# Feature Ownership

Every database table belongs to exactly one feature.

Example

Wallet Feature

Owns

- Wallet

Transaction Feature

Owns

- Transaction

Savings Feature

Owns

- SavingsGoal

Friend Feature

Owns

- Friendship

Vault Feature

Owns

- Vault
- VaultMember

This avoids unclear ownership.

---

# Creating a New Feature

Every new feature must answer:

1. What problem does it solve?
2. Which tables does it own?
3. Which services does it expose?
4. Which existing features depend on it?
5. Can it be tested independently?

Only then should implementation begin.

---

# Feature Lifecycle

Every feature follows the same lifecycle.

```

Requirement

↓

Architecture

↓

Database

↓

Validation

↓

Business Logic

↓

Server Action

↓

UI

↓

Testing

↓

Documentation

```

Skipping steps is discouraged.

---

# Feature Checklist

Before a feature is merged:

- README exists
- Validation completed
- Tests written
- Business logic isolated
- No Prisma inside UI
- Documentation updated
- Types exported
- Loading state implemented
- Error state implemented
- Empty state implemented

---

# Example

Wallet

```

wallet/

README.md

actions/

create-wallet.ts

update-wallet.ts

components/

WalletCard.tsx

WalletList.tsx

WalletForm.tsx

services/

WalletService.ts

repositories/

WalletRepository.ts

validators/

wallet.schema.ts

hooks/

useWallet.ts

tests/

wallet.service.test.ts

```

---

# Guiding Principle

A feature should feel like a small independent application.

If a developer opens only one feature folder, they should understand how that feature works without navigating the rest of the project.
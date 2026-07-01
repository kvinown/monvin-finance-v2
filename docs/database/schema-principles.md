# Database Schema Principles

> Version: 1.0
> Status: Active

---

# Purpose

This document defines the database philosophy and design principles for Atlas.

The goal is not merely to create tables, but to establish a financial data model that is:

- Reliable
- Auditable
- Extensible
- Consistent
- Easy to maintain

Financial data is permanent.

Every schema decision must prioritize data integrity over development convenience.

---

# Database Philosophy

Atlas follows three primary principles.

1. Every financial event must be recorded.
2. Every balance must be explainable.
3. Every relationship must be explicit.

The database should always be able to answer:

> Why does this wallet currently have this balance?

without relying on application memory.

---

# Source of Truth

The **Transaction Ledger** is the source of truth.

Wallet balance is **derived** from transactions.

For performance reasons, Wallet may store a cached balance.

However:

Cached Balance ≠ Source of Truth.

If inconsistency occurs:

Ledger always wins.

---

# Design Goals

The schema should support:

- Personal finance
- Collaborative finance
- Savings
- Shared Vaults
- Future investments
- Future AI analytics

without major schema redesign.

---

# Core Principles

## UUID Everywhere

Every table uses UUID.

Never use incremental integers.

Benefits

- safer exposure through APIs
- easier synchronization
- easier future offline support

---

## Immutable Financial Records

Transactions should never be deleted.

If a mistake occurs,

create a correcting transaction.

Avoid destructive updates.

---

## Explicit Relationships

Never rely on implicit references.

Every relationship must use foreign keys.

Bad

```
walletId string
```

Good

```
walletId UUID

FOREIGN KEY

Wallet(id)
```

---

## Normalization

Prefer normalized data.

Avoid duplicated information.

Example

Bad

Transaction

- wallet_name

Good

Transaction

↓

Wallet

↓

Bank

---

## Separation of Concerns

Each table owns one concept.

Examples

Wallet

owns

Wallet information

Transaction

owns

financial movement

Friendship

owns

social connection

Vault

owns

shared savings

---

# Table Ownership

Every table belongs to exactly one feature.

| Feature | Tables |
|----------|--------|
| Auth | User, Session, Account |
| Wallet | Wallet |
| Transaction | Transaction |
| Savings | SavingsGoal, SavingsContribution |
| Friend | Friendship |
| Vault | Vault, VaultMember |
| Analytics | Materialized Views (future) |

Ownership prevents unclear responsibilities.

---

# Naming Convention

Tables

Singular

Example

Wallet

Transaction

Vault

Friendship

Columns

camelCase

Example

createdAt

updatedAt

walletId

transactionType

Prisma models follow PascalCase.

Database tables may use snake_case through @@map if needed.

---

# Primary Keys

Every table includes

- id
- createdAt
- updatedAt

id is UUID.

createdAt defaults to now().

updatedAt updates automatically.

---

# Soft Delete Policy

Atlas prefers **soft delete** for business entities.

Examples

Wallet

Category

Vault

Use

deletedAt

instead of deleting rows.

Financial records should never be deleted.

---

# Auditability

Every important financial action should be reproducible.

The database should answer:

- Who created it?
- When?
- Why?
- Which wallet changed?
- Which transaction caused the change?

Future AuditLog module will expand this.

---

# Financial Model

Atlas uses a ledger-inspired model.

Money never appears magically.

Every balance change originates from a transaction.

Example

Salary

↓

Income Transaction

↓

Wallet Balance

Transfer

↓

Expense

↓

Income

↓

Two linked records

Shared Vault Deposit

↓

Wallet

↓

Vault

↓

Two ledger entries

---

# Transaction Integrity

Every financial mutation must execute inside

Prisma Transaction

```
prisma.$transaction()
```

Examples

- Wallet Transfer
- P2P Transfer
- Shared Vault Deposit
- Savings Allocation

Never allow partial updates.

---

# Balance Strategy

Wallet stores

currentBalance

only as cache.

Whenever balance validation is required,

ledger calculation takes precedence.

Future reconciliation jobs may recalculate balances.

---

# Enum Strategy

Use enums only for stable concepts.

Examples

WalletType

TransactionType

FriendStatus

VaultRole

Avoid enums for user-generated values.

Example

Bank Name

should be stored as text.

---

# Currency Strategy

Initially

Only IDR.

Schema should remain extensible.

Future

Currency

Exchange Rate

Multi Currency

without redesign.

---

# Category Strategy

Categories are customizable.

System categories

cannot be removed.

User categories

belong to one user.

---

# Friend System

Friendship is symmetric.

One friendship exists between two users.

Avoid duplicated rows.

Preferred

Kevin

↓

Pelin

Status

Accepted

Not

Kevin

↓

Pelin

Pelin

↓

Kevin

---

# Shared Vault

Vaults are many-to-many.

Users

↓

VaultMember

↓

Vault

Never store member arrays.

Membership must be normalized.

---

# Future Investment Module

The schema should already anticipate

Assets

Portfolio

Holding

Market Price

Performance

without changing Wallet.

---

# Future AI Module

AI never writes directly into financial tables.

AI produces

Insights

Recommendations

Forecasts

stored separately.

Financial truth always remains inside Transaction tables.

---

# Constraints

Every table should define

Primary Key

Foreign Key

Unique Constraint

Check Constraint where appropriate

Examples

Wallet Name unique per user.

Friendship unique per user pair.

Vault member unique.

Savings contribution amount > 0.

---

# Database Evolution

Schema changes must be

Backward compatible

Whenever possible.

Never remove columns

without migration strategy.

Prefer additive changes.

---

# Migration Principles

Every migration should answer

Why?

What changes?

How to rollback?

Every migration should include meaningful names.

Example

20260701_add_vault_members

instead of

migration2

---

# Source of Truth Summary

Atlas stores financial truth in

Transaction Ledger.

Everything else is derived.

Wallet

Savings

Vault

Analytics

Dashboard

all depend on transactions.

---

# Guiding Principle

> Financial data should always be explainable.

If a balance cannot be traced back to one or more transactions,

the schema design is considered incorrect.
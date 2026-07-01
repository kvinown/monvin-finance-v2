# Database Migration Strategy

> Version: 1.0
> Status: Active

---

# Purpose

This document defines how Atlas evolves its database schema over time.

Database migrations are treated as architectural changes, not merely generated SQL files.

Every migration must preserve:

- Data Integrity
- Backward Compatibility
- Auditability
- Reproducibility

Financial systems should never perform destructive schema changes without a clear migration strategy.

---

# Philosophy

A migration is a permanent record of how the database evolved.

Future developers (or AI assistants) should be able to understand:

- Why the migration exists
- What changed
- Which feature required the change
- Whether rollback is possible

---

# Migration Workflow

Every schema change follows this process.

```

Requirement

↓

Architecture Review

↓

Update schema.prisma

↓

Generate Migration

↓

Review SQL

↓

Test on Local Database

↓

Run Automated Tests

↓

Apply to Supabase

↓

Update Documentation

```

Skipping any step is discouraged.

---

# Source of Truth

The Prisma Schema (`schema.prisma`) is the primary source of truth for the application schema.

Migration files represent the history of changes.

Never manually edit production tables without creating a migration.

---

# Naming Convention

Migration names should describe the business change.

Good

```

20260701_add_wallet_table

20260715_add_shared_vault

20260801_add_friendship_indexes

```

Bad

```

migration1

fix

update

new

```

Migration names should answer:

> What feature introduced this change?

---

# Migration Principles

Every migration should satisfy these principles.

## 1. Atomic

A migration should represent one logical change.

Good

Add Vault Members

Bad

Add Vault

Rename Wallet

Delete Categories

Update Users

(all in one migration)

---

## 2. Small

Small migrations are easier to:

- Review
- Test
- Rollback

Prefer multiple focused migrations over one large migration.

---

## 3. Reversible

Whenever possible,

design migrations that can be safely rolled back.

Avoid irreversible operations unless absolutely necessary.

---

## 4. Backward Compatible

Prefer additive changes.

Good

Add nullable column

↓

Deploy

↓

Populate data

↓

Make required

Bad

Drop column immediately.

---

# Safe Schema Changes

Preferred operations

✅ Add Table

✅ Add Column

✅ Add Index

✅ Add Foreign Key

✅ Add Constraint

These operations generally have low risk.

---

# Risky Schema Changes

Require additional review.

Examples

Rename Table

Rename Column

Drop Constraint

Drop Column

Change Data Type

Large Data Migration

---

# Dangerous Operations

Avoid whenever possible.

Examples

DROP TABLE

DELETE ALL DATA

DROP COLUMN

CASCADE DELETE

Changing Primary Keys

These operations should only occur after explicit approval.

---

# Data Migration

Some migrations require transforming existing data.

Example

```

Old Wallet Type

BANK

↓

New Wallet Type

CHECKING_ACCOUNT

```

This requires:

Schema Migration

+

Data Migration

Treat them as separate steps.

---

# Production Safety

Never assume production data is clean.

Before applying a migration,

consider:

NULL values

Duplicate records

Unexpected states

Legacy data

---

# SQL Review

Every generated SQL migration should be reviewed manually.

Checklist

- Correct constraints
- Correct indexes
- No accidental drops
- No unnecessary table recreation
- Proper foreign keys

Never assume generated SQL is perfect.

---

# Prisma Workflow

Preferred commands

Development

```bash
pnpm prisma migrate dev
```

Production

```bash
pnpm prisma migrate deploy
```

Never use

```bash
prisma db push
```

on production environments.

`db push` bypasses migration history and should only be used for prototypes or disposable databases.

---

# Supabase Workflow

Recommended deployment sequence.

```

Local PostgreSQL

↓

Migration Testing

↓

Commit Migration

↓

Push Repository

↓

Apply Migration

↓

Supabase

```

Never modify production schema directly using the Supabase SQL Editor unless it is an emergency.

If emergency SQL is executed,

create an equivalent Prisma migration immediately afterward to restore migration history.

---

# Feature-Based Migrations

Each migration should relate to one feature.

Examples

Wallet

Friend

Vault

Savings

Analytics

This makes the migration history easier to understand.

---

# Rollback Strategy

If a deployment fails,

prefer creating a corrective migration rather than deleting migration history.

Migration history should remain immutable.

---

# Seed Data

Seed data should never be mixed into schema migrations.

Examples

System Categories

Default Settings

Supported Wallet Types

should be inserted using Prisma Seed scripts.

---

# Index Changes

Indexes may evolve over time.

Adding indexes is preferred over premature optimization.

Every new index should have a measurable performance justification.

---

# Large Tables

Future tables such as

Transaction

Ledger

AuditLog

may contain millions of rows.

Schema changes affecting these tables require additional review.

Consider:

- Lock duration
- Execution time
- Query impact

---

# Documentation

Every migration should include documentation.

Recommended format

```

Feature

Reason

Affected Tables

Risk Level

Rollback Strategy

```

---

# AI Rules

When generating migrations,

AI should:

- Explain why the migration exists.
- Describe potential risks.
- Suggest rollback considerations.
- Avoid destructive operations.
- Preserve existing data.
- Review generated SQL before execution.

---

# Migration Checklist

Before merging a migration,

confirm:

- Schema updated
- Migration generated
- SQL reviewed
- Local tests passed
- Seed unaffected
- Documentation updated
- No destructive operations
- Backward compatibility considered

---

# Guiding Principle

> Migrations are part of the application's architecture.

They should document the evolution of the system, not merely modify the database.
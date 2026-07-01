# Database Indexing Strategy

> Version: 1.0
> Status: Active

---

# Purpose

This document defines how indexes are designed and maintained within Atlas.

Indexes exist to improve query performance while preserving write efficiency.

An index is a performance optimization, not a default requirement.

Every index must have a measurable purpose.

---

# Philosophy

Atlas follows a **Query-Driven Index Strategy**.

Indexes are created based on how the application retrieves data, not simply because a column "looks important."

Every index should answer:

> Which query becomes faster because of this index?

If no answer exists, the index should not exist.

---

# Principles

## 1. Query First

Never design indexes before understanding the query.

Good

Dashboard needs recent wallet transactions.

↓

Create

(walletId, transactionDate DESC)

Bad

Index transactionDate because "it might help."

---

## 2. Keep Indexes Minimal

Indexes consume:

- Disk space
- Memory
- Insert performance
- Update performance

More indexes do not automatically mean better performance.

---

## 3. Measure Before Optimizing

Only add indexes for:

- Frequently executed queries
- Large datasets
- Slow query plans

Avoid premature optimization.

---

# Index Categories

Atlas uses four categories of indexes.

---

## Primary Index

Automatically created.

Every table has one primary key.

Example

```
id
```

---

## Unique Index

Used to enforce uniqueness.

Examples

User email

User username

Wallet name (per user)

Friendship pair

Vault membership

---

## Foreign Key Index

Foreign keys should generally be indexed.

Examples

walletId

userId

vaultId

categoryId

transactionId

These columns are frequently used in joins.

---

## Composite Index

The preferred optimization strategy.

Composite indexes should reflect actual filtering and sorting patterns.

Example

```
(walletId, transactionDate DESC)
```

instead of

```
(walletId)

(transactionDate)
```

---

# Dashboard Queries

The dashboard is expected to execute the following frequently.

Recent Transactions

```
WHERE walletId = ?

ORDER BY transactionDate DESC
```

Recommended

```
(walletId, transactionDate DESC)
```

---

Wallet Summary

```
WHERE userId = ?
```

Recommended

```
(userId)
```

---

Savings Overview

```
WHERE userId = ?

AND status = ACTIVE
```

Recommended

```
(userId, status)
```

---

Shared Vault

```
WHERE vaultId = ?
```

Recommended

```
(vaultId)
```

---

Friend List

```
WHERE userId = ?

AND status = ACCEPTED
```

Recommended

```
(userId, status)
```

---

# Transaction Table

The Transaction table will eventually become the largest table in Atlas.

Design indexes carefully.

Recommended

```
(walletId, transactionDate DESC)

(userId, transactionDate DESC)

(categoryId)

(type)

(referenceId)

(createdAt DESC)
```

Avoid indexing every numeric column.

---

# Wallet Table

Recommended

```
(userId)

(type)

(isArchived)

(userId, name)
```

---

# Friendship Table

Recommended

```
(userId)

(friendId)

(userId, status)

(friendId, status)
```

Unique

```
(userAId, userBId)
```

---

# Shared Vault

Recommended

Vault

```
(ownerId)
```

VaultMember

```
(vaultId)

(userId)

(vaultId, userId)
```

Composite uniqueness prevents duplicate memberships.

---

# Savings

Recommended

```
(userId)

(status)

(targetDate)
```

---

# Analytics

Analytics will eventually aggregate large datasets.

Avoid querying raw transactions repeatedly.

Future optimization may include:

- Materialized Views
- Summary Tables
- Scheduled Aggregation

---

# Covering Indexes

When possible, prefer composite indexes that satisfy both filtering and ordering.

Example

```
WHERE walletId = ?

ORDER BY createdAt DESC
```

Recommended

```
(walletId, createdAt DESC)
```

instead of two separate indexes.

---

# Partial Indexes

Use PostgreSQL partial indexes for highly selective queries.

Example

Only active wallets.

```
WHERE archived = false
```

Example

Only active savings goals.

```
WHERE status = 'ACTIVE'
```

This reduces index size.

---

# Soft Delete

Tables using soft delete should consider indexing active records.

Example

```
WHERE deletedAt IS NULL
```

Instead of scanning deleted records.

---

# Search

Atlas is not intended to be a full-text search engine.

For Phase 1,

simple indexed lookup is sufficient.

Examples

Wallet name

Category

Friend username

Future versions may introduce PostgreSQL Full Text Search if required.

---

# UUID Considerations

UUID primary keys are larger than integers.

Benefits outweigh the storage cost.

Do not replace UUIDs with integers for perceived performance gains.

Instead:

- Use proper indexes.
- Optimize queries.
- Avoid unnecessary joins.

---

# Read vs Write Balance

Atlas is primarily read-heavy.

Typical usage

- Dashboard
- Analytics
- History
- Reports

This justifies additional read optimization where necessary.

However,

avoid indexing columns that change frequently unless query performance requires it.

---

# Performance Review

Indexes should be reviewed periodically.

Questions

- Is this index still used?
- Does it improve query plans?
- Is it duplicated?
- Does it slow writes unnecessarily?

Unused indexes should be removed.

---

# Monitoring

Use PostgreSQL tools to inspect performance.

Examples

- EXPLAIN ANALYZE
- pg_stat_user_indexes
- pg_stat_statements

Optimize based on actual query statistics, not assumptions.

---

# AI Rules

When proposing a new index,

AI must explain:

- Which query benefits?
- Why a composite index is chosen?
- Whether an existing index already satisfies the query?
- Expected trade-offs.

Never create indexes without justification.

---

# Index Checklist

Before adding an index,

confirm:

- Query identified
- Execution plan reviewed
- Existing indexes checked
- Composite index considered
- Write impact acceptable
- Documentation updated

---

# Guiding Principle

> Indexes exist to accelerate real user interactions, not to satisfy theoretical optimization.

Every index should solve a measurable performance problem while keeping the system simple and maintainable.
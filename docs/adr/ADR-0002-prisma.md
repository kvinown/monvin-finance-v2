# ADR-0002: Adopt Prisma as the Primary ORM

> **Status:** Accepted  
> **Date:** 2026-06-30  
> **Decision Makers:** Project Owner  
> **Related Documents:**
>
> - `docs/database/schema-principles.md`
> - `docs/database/migration-strategy.md`
> - `docs/database/indexing.md`
> - `0003-adopt-supabase.md`

---

# Context

Atlas uses PostgreSQL as its primary database.

The project requires:

- Strong TypeScript integration
- Reliable schema management
- Predictable migrations
- Excellent developer experience
- AI-friendly code generation
- Long-term maintainability

Atlas also uses Supabase as the managed PostgreSQL platform.

However, Atlas intentionally separates **database infrastructure** from **database access**.

---

# Decision

Atlas adopts **Prisma ORM** as the primary database access layer.

Prisma is responsible for:

- Schema definition
- Type-safe database queries
- Database migrations
- Relationship mapping
- Transaction management
- Generated TypeScript client

Application code should access PostgreSQL exclusively through Prisma.

Direct SQL should be limited to exceptional cases.

---

# Why Prisma

Prisma aligns with Atlas's engineering goals.

## Type Safety

Prisma generates fully typed database models.

Benefits include:

- Compile-time validation
- Better autocomplete
- Fewer runtime errors
- Easier refactoring

---

## Single Source of Truth

The database schema is maintained in:

```
schema.prisma
```

The Prisma schema represents the canonical structure of the application database.

All migrations originate from this schema.

---

## Excellent Developer Experience

Prisma provides:

- Simple query syntax
- Clear model definitions
- Automatic client generation
- Helpful error messages

This reduces development complexity.

---

## AI-Friendly

Prisma has extensive public documentation and widespread adoption.

Benefits:

- Higher quality AI-generated code
- More reliable implementation examples
- Consistent query patterns

Atlas is intentionally optimized for AI-assisted development.

---

## Relationship Modeling

Atlas contains complex relationships such as:

- Users ↔ Friends
- Users ↔ Shared Vaults
- Wallets ↔ Transactions
- Transactions ↔ Categories
- Vaults ↔ Members

Prisma provides clear and maintainable relation definitions.

---

## Transaction Support

Financial applications require strong consistency.

Prisma supports database transactions through:

```ts
prisma.$transaction()
```

Atlas uses transactions for:

- Wallet transfers
- P2P transfers
- Savings deposits
- Shared Vault contributions

Atomic operations are mandatory for financial integrity.

---

## Migration Support

Prisma Migrate provides:

- Versioned migrations
- Roll-forward strategy
- Local development support
- Team collaboration

Schema evolution becomes predictable.

---

# Alternatives Considered

## Drizzle ORM

Advantages

- Lightweight
- SQL-first
- Excellent performance

Reasons not selected

- Smaller ecosystem.
- Fewer AI examples.
- More manual schema management.

---

## Kysely

Advantages

- Strong SQL builder
- Flexible

Reasons not selected

- No integrated migration workflow.
- Requires more manual configuration.

---

## Raw SQL

Advantages

- Maximum control
- Maximum performance

Reasons not selected

- Higher maintenance cost.
- Reduced readability.
- Increased risk of inconsistency.
- Less suitable for AI-generated code.

Raw SQL remains acceptable for highly optimized queries.

---

## Supabase JavaScript Client Only

Advantages

- Simple setup
- Direct Supabase integration

Reasons not selected

- Business logic becomes tightly coupled to Supabase.
- No centralized schema definition.
- Less suitable for large domain models.

Supabase is treated as infrastructure, not the application's data access layer.

---

# Responsibilities

Prisma is responsible for:

- Database models
- Query execution
- Transactions
- Migrations
- Type generation

Prisma is not responsible for:

- Business validation
- Authorization
- Authentication
- Domain logic

These responsibilities belong to the application layer.

---

# Raw SQL Policy

Raw SQL is permitted only when Prisma cannot reasonably support the required functionality.

Examples include:

- Complex reporting queries
- PostgreSQL Full-Text Search
- Materialized Views
- Advanced indexing strategies
- Database-specific optimizations

Every raw SQL query should include a comment explaining why Prisma was not sufficient.

---

# Migration Strategy

Schema changes must follow this process:

```
Modify schema.prisma
        ↓
Generate Migration
        ↓
Review Migration
        ↓
Apply Migration
        ↓
Update Prisma Client
        ↓
Test
```

Database changes must never be performed manually in production.

---

# Architectural Principles

Atlas follows these principles:

- Schema-first development
- Type-safe queries
- Explicit relationships
- Atomic transactions
- Minimal raw SQL
- One Prisma Client instance

---

# AI Engineering Notes

When generating database code:

- Always use Prisma Client.
- Prefer Prisma relations over manual joins.
- Use transactions for multi-step financial operations.
- Do not bypass Prisma without justification.
- Follow the existing Prisma schema.
- Generate type-safe queries.

If raw SQL is necessary, explain the reason.

---

# Future Review

This decision should be revisited only if:

- Prisma no longer supports Atlas requirements.
- PostgreSQL support significantly changes.
- A future ORM provides substantial advantages without increasing complexity.

Until then, Prisma remains the official ORM.

---

# Decision Summary

Atlas adopts **Prisma ORM** because it provides a type-safe, schema-first, AI-friendly, and maintainable data access layer that aligns with the project's long-term architecture while keeping database infrastructure independent from application logic.
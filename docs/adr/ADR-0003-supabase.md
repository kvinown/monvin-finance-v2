# ADR-0003: Adopt Supabase as the Managed PostgreSQL Platform

> **Status:** Accepted
>
> **Date:** 2026-06-30
>
> **Decision Makers:** Project Owner
>
> **Related Documents**
>
> - ADR-0001: Adopt Next.js
> - ADR-0002: Adopt Prisma
> - docs/database/schema-principles.md
> - docs/database/migration-strategy.md

---

# Context

Atlas requires a production-ready PostgreSQL platform that provides:

- Reliable managed infrastructure
- Automatic backups
- High availability
- Monitoring
- Database management
- Secure networking
- Long-term scalability

The project intentionally separates:

- Infrastructure
- Application
- Domain Logic

Database hosting should remain independent from application code.

---

# Decision

Atlas adopts **Supabase** as the managed PostgreSQL platform.

Supabase is responsible for:

- PostgreSQL hosting
- Database availability
- Backups
- Connection pooling
- Database monitoring
- SQL editor
- Migration history
- Storage (Future)
- Realtime (Future)

Application code does **not** communicate directly with Supabase.

All application database access must go through Prisma ORM.

---

# Architecture

```
                Next.js
                     │
                     ▼
              Business Layer
                     │
                     ▼
                 Prisma ORM
                     │
                     ▼
              PostgreSQL Database
                     ▲
                     │
            Supabase Platform
```

Supabase manages the database.

Prisma accesses the database.

The application never bypasses Prisma.

---

# Why Supabase

Supabase provides an excellent PostgreSQL platform without requiring Atlas to manage infrastructure.

Benefits include:

- Managed PostgreSQL
- Daily backups
- Monitoring
- Easy administration
- Excellent local development support
- Database branching
- Secure connection management

---

# Responsibilities

Supabase is responsible for:

- PostgreSQL server
- Storage
- Backup
- Restore
- Monitoring
- Availability
- Performance tools
- SQL Editor

Supabase is **not** responsible for:

- Business Logic
- Validation
- Domain Rules
- UI
- API Layer

---

# Database Access Policy

Official access path:

```
Application

↓

Prisma Client

↓

PostgreSQL

↓

Supabase Infrastructure
```

Application code should never use:

```ts
supabase.from(...)
```

unless explicitly documented.

Prisma is the only supported database access layer.

---

# Authentication

Atlas currently uses:

- Auth.js (NextAuth)

Supabase Auth is intentionally **not** used.

Reasons:

- Authentication remains framework-independent.
- Better integration with Next.js.
- Easier migration in the future.
- Clear separation of responsibilities.

This decision may be revisited later if requirements change.

---

# Storage

Supabase Storage is approved for future use.

Potential use cases:

- Receipt uploads
- Profile pictures
- Shared Vault attachments
- Document storage

Storage access should be encapsulated inside dedicated services.

Application code should not access Storage directly.

---

# Realtime

Realtime is currently outside the MVP scope.

Possible future features:

- Shared Vault updates
- Friend activity
- Collaborative saving
- Notifications

Realtime adoption requires a separate ADR.

---

# Edge Functions

Supabase Edge Functions are not adopted.

Business logic belongs inside the Next.js application.

Edge Functions should only be considered when:

- Infrastructure requirements demand them.
- Latency becomes a problem.
- External integrations require them.

---

# Row Level Security (RLS)

Atlas will initially rely on application-layer authorization.

RLS is **disabled for MVP** to reduce complexity.

Future evaluation:

- Public APIs
- Multi-client access
- External integrations

If enabled later, RLS policies must complement—not replace—application authorization.

---

# Migration Strategy

Database schema changes follow this workflow:

```
Update schema.prisma
        ↓
Generate Prisma Migration
        ↓
Review SQL
        ↓
Apply Migration
        ↓
Supabase Database Updated
```

Production schema changes should always be version-controlled.

Manual production changes are prohibited.

---

# Alternatives Considered

## Self-Hosted PostgreSQL

Advantages

- Complete control

Reasons not selected

- Higher operational overhead.
- Backup management.
- Infrastructure maintenance.

---

## Neon

Advantages

- Excellent serverless PostgreSQL

Reasons not selected

- Supabase provides a richer ecosystem.
- Better tooling for long-term project management.

---

## Railway PostgreSQL

Advantages

- Easy deployment

Reasons not selected

- Smaller ecosystem.
- Fewer database management features.

---

## PlanetScale

Reasons not selected

- Atlas standardizes on PostgreSQL.

---

# Consequences

Positive

- Managed infrastructure
- Automatic backups
- Excellent administration tools
- Reliable PostgreSQL
- Future Storage support
- Future Realtime support

Negative

- Platform dependency
- Vendor-specific features should be used carefully.

These trade-offs are acceptable.

---

# AI Engineering Notes

When generating code:

- Never query Supabase directly for application data.
- Always use Prisma Client.
- Treat Supabase as infrastructure.
- Keep business logic inside Next.js.
- Do not introduce Supabase Auth.
- Do not introduce Supabase Edge Functions without a new ADR.

---

# Future Review

This decision should be revisited if:

- Atlas becomes multi-region.
- Atlas requires global edge compute.
- Authentication strategy changes.
- Infrastructure requirements exceed Supabase capabilities.

Until then, Supabase remains the official managed PostgreSQL platform.

---

# Decision Summary

Atlas adopts **Supabase** as the managed PostgreSQL platform while using **Prisma ORM** as the exclusive database access layer.

Supabase provides infrastructure.

Prisma provides data access.

Next.js provides business logic.

Each layer has a single responsibility.
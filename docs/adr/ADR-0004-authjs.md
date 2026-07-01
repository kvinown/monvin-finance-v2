# ADR-0004: Adopt Auth.js as the Authentication Framework

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
> - ADR-0003: Adopt Supabase
> - docs/architecture/system-overview.md
> - docs/engineering/security.md

---

# Context

Atlas requires a modern authentication solution that supports:

- Email & Password authentication
- Google OAuth
- Secure session management
- Server Components
- App Router
- Prisma integration
- Future authentication providers

Authentication should remain independent from the underlying database platform.

Atlas is a long-term project that may evolve in infrastructure without requiring changes to the authentication layer.

---

# Decision

Atlas adopts **Auth.js** (formerly NextAuth.js) as the official authentication framework.

Auth.js is responsible for:

- User authentication
- OAuth providers
- Credentials authentication
- Session management
- User identity
- Authentication middleware

Application authentication must be implemented exclusively through Auth.js.

---

# Architecture

```
Browser
    │
    ▼
Auth.js
    │
    ▼
Prisma Adapter
    │
    ▼
PostgreSQL
    ▲
    │
Supabase Platform
```

Authentication is an application concern.

Supabase remains responsible only for database infrastructure.

---

# Supported Authentication Methods

## MVP

Supported:

- Email & Password
- Google OAuth

---

## Planned

Future providers may include:

- GitHub
- Microsoft
- Apple
- Discord

Authentication providers should remain configurable through Auth.js.

---

# Session Strategy

Atlas uses:

- Database-backed sessions

Reasons:

- Secure session invalidation
- Multi-device support
- Centralized session management

Session data is stored using the Prisma Adapter.

---

# Prisma Adapter

Auth.js integrates with PostgreSQL using the official Prisma Adapter.

The adapter manages authentication-related models such as:

- User
- Account
- Session
- VerificationToken

These models are considered part of the authentication infrastructure.

Business logic should not be embedded within these models.

---

# Why Auth.js

## Native Next.js Integration

Auth.js is designed specifically for Next.js.

Benefits include:

- App Router support
- Middleware integration
- Server Components compatibility
- Route Handlers support

---

## Provider Ecosystem

Auth.js supports many OAuth providers.

Examples:

- Google
- GitHub
- Microsoft
- Apple
- Discord

Adding new providers requires minimal architectural changes.

---

## Framework Independence

Authentication remains independent of the database platform.

This enables future migration from Supabase to another PostgreSQL provider without changing the authentication flow.

---

## Excellent TypeScript Support

Auth.js provides:

- Strong typing
- Session typing
- User typing
- Adapter typing

This aligns with Atlas's TypeScript-first approach.

---

## AI-Friendly

Auth.js is widely adopted.

Benefits include:

- Extensive documentation
- Reliable AI-generated implementations
- Community support

---

# Why Not Supabase Auth

Supabase Auth is intentionally not adopted.

Reasons include:

## Separation of Concerns

Authentication should not depend on the database hosting platform.

---

## Reduced Vendor Lock-In

Keeping authentication independent makes future infrastructure migration easier.

---

## Better Next.js Integration

Auth.js offers tighter integration with:

- Server Components
- Middleware
- App Router
- Route Handlers

---

## Consistent Architecture

Atlas follows a layered architecture:

```
Next.js

↓

Auth.js

↓

Business Layer

↓

Prisma

↓

PostgreSQL

↓

Supabase
```

Each layer has a single responsibility.

---

# Authorization

Authentication and authorization are separate concerns.

Auth.js determines:

- Who the user is.

The application determines:

- What the user can access.

Authorization rules belong to the application layer.

---

# Security Principles

Authentication must support:

- Secure password hashing
- Session expiration
- CSRF protection
- Secure cookies
- HTTPS-only deployment
- OAuth state validation

Sensitive authentication logic must never be implemented manually when Auth.js already provides it.

---

# User Model

Business user data belongs to the application's `User` model.

Authentication metadata managed by Auth.js should remain separate from business logic whenever possible.

Examples of business data:

- Display Name
- Username
- Preferences
- Currency
- Theme

Authentication metadata includes:

- OAuth accounts
- Sessions
- Verification tokens

---

# Future Authentication Features

Possible future enhancements include:

- Passkeys (WebAuthn)
- Two-Factor Authentication (2FA)
- Device Management
- Trusted Devices
- Login History
- Active Session Management

These features should be implemented within the Auth.js ecosystem whenever feasible.

---

# Alternatives Considered

## Supabase Auth

Advantages

- Integrated with Supabase
- Easy setup
- Managed authentication

Reasons not selected

- Tighter coupling to Supabase.
- Less flexibility if infrastructure changes.
- Authentication becomes dependent on the hosting platform.

---

## Clerk

Advantages

- Rich user management
- Excellent developer experience

Reasons not selected

- Additional recurring cost.
- External dependency.
- Less control over authentication data.

---

## Better Auth

Advantages

- Modern authentication library
- Good developer experience

Reasons not selected

- Smaller ecosystem.
- Lower maturity compared to Auth.js.

---

## Custom Authentication

Advantages

- Full control

Reasons not selected

- Higher maintenance burden.
- Increased security risks.
- Reinventing established authentication patterns.

---

# AI Engineering Notes

When generating authentication code:

- Always use Auth.js.
- Always use the Prisma Adapter.
- Never implement custom authentication flows unless explicitly required.
- Use Route Handlers for authentication endpoints.
- Keep authentication logic isolated from business logic.
- Do not introduce Supabase Auth.

---

# Future Review

This decision should be revisited if:

- Auth.js is no longer actively maintained.
- Next.js authentication architecture changes significantly.
- Atlas requires authentication capabilities beyond Auth.js.

Until then, Auth.js remains the official authentication framework.

---

# Decision Summary

Atlas adopts **Auth.js** as the official authentication framework because it provides seamless Next.js integration, strong TypeScript support, excellent provider flexibility, and clear separation between authentication, business logic, and infrastructure.

Authentication belongs to the application.

Infrastructure belongs to Supabase.

Data access belongs to Prisma.

Each layer has one responsibility.
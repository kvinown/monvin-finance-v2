# Security Guidelines

> Version: 1.0
> Status: Active

---

# Purpose

This document defines the security principles and implementation guidelines for Atlas.

Atlas stores sensitive financial information.

Security is therefore considered a core product feature rather than an optional enhancement.

Every engineering decision should consider confidentiality, integrity, and availability.

---

# Security Philosophy

Atlas follows three security principles.

1. Never trust the client.

2. Protect financial integrity.

3. Minimize attack surface.

Security should be built into the architecture instead of being added later.

---

# Security Layers

Atlas security consists of multiple independent layers.

```
Browser

↓

Authentication

↓

Authorization

↓

Validation

↓

Business Rules

↓

Database

↓

Infrastructure

```

Every layer validates independently.

Never assume previous layers have already validated data.

---

# Authentication

Authentication answers:

> Who is this user?

Atlas uses:

- Auth.js
- Credentials Provider
- Google OAuth

Authentication must occur before accessing protected resources.

Unauthenticated users should never reach business logic.

---

# Authorization

Authorization answers:

> Can this user perform this action?

Authentication alone is insufficient.

Every mutation must verify ownership.

Examples

User edits wallet

↓

Wallet belongs to current user?

↓

YES

↓

Continue

NO

↓

403 Forbidden

Never rely on client-side ownership checks.

---

# Validation

Every input must be validated.

Validation occurs before business logic.

Preferred flow

```
Client

↓

Zod Validation

↓

Business Validation

↓

Database

```

Validation includes:

- Required fields
- Data types
- Business rules
- Limits

---

# Server Actions

Server Actions are trusted entry points.

Responsibilities:

- Verify session
- Validate input
- Call services
- Return safe responses

Server Actions should never contain business logic.

---

# Business Rule Protection

Business rules are security rules.

Examples

Balance cannot become invalid.

Transfer amount must be positive.

Wallet must belong to current user.

Savings contribution cannot exceed available balance.

These checks belong inside Services.

---

# Financial Integrity

Financial operations require extra protection.

Requirements

- Atomic transactions
- Rollback on failure
- Immutable history
- Traceable balance

Never allow partial financial updates.

Always use

```
prisma.$transaction()
```

for financial mutations.

---

# Database Security

Prisma is the only database access layer.

Avoid raw SQL unless absolutely necessary.

If raw SQL is required:

- Parameterize queries
- Explain why Prisma is insufficient
- Document the reason

---

# Password Security

Passwords should:

- Never be stored in plain text
- Be hashed using bcrypt
- Never be logged
- Never be returned through APIs

Password reset tokens should expire automatically.

---

# Session Security

Sessions should:

- Expire automatically
- Be invalidated on logout
- Be stored securely
- Never expose sensitive data

Session payload should contain only essential information.

---

# Secret Management

Never hardcode secrets.

Examples

API Keys

OAuth Secrets

Database URLs

Encryption Keys

Use environment variables.

Production secrets should never appear inside the repository.

---

# API Security

Server Actions are preferred.

If Route Handlers are required:

- Validate every request
- Authenticate every request
- Authorize every request

Return only necessary data.

---

# Principle of Least Privilege

Every feature receives the minimum access required.

Examples

Wallet Service

Can access wallet data.

Should not modify friendships.

Analytics

Can read transactions.

Should not modify transactions.

Permissions should remain narrow.

---

# Sensitive Data

Sensitive information includes:

- Passwords
- Email verification tokens
- OAuth tokens
- Financial balances
- Financial history

Avoid exposing these through logs or unnecessary API responses.

---

# Logging

Logs should help debugging without leaking sensitive information.

Allowed

Wallet ID

Transaction ID

User ID

Timestamp

Forbidden

Passwords

Tokens

Access Secrets

Credit Card Numbers

---

# Error Messages

Users should receive friendly errors.

Good

```
Invalid credentials.
```

Bad

```
User exists but password hash comparison failed.
```

Internal details belong in logs, not UI.

---

# Rate Limiting

Sensitive operations should eventually support rate limiting.

Examples

Login

Password Reset

Friend Requests

Vault Invitations

OTP Verification

This can be introduced in a future phase.

---

# Duplicate Submission Protection

Financial actions should prevent accidental duplication.

Examples

Double-click transfer

Repeated form submission

Browser refresh

Future versions may implement idempotency keys.

---

# Race Conditions

Concurrent financial updates should be handled safely.

Examples

Two simultaneous transfers

Two vault deposits

Savings allocation

Transactions must remain consistent.

---

# File Uploads

Future modules may allow uploads.

Requirements

- Validate file type
- Validate file size
- Generate unique filenames
- Never trust original filenames

Store uploads using Supabase Storage.

---

# Auditability

Every important action should be traceable.

Examples

Wallet Created

Wallet Deleted

Transfer Completed

Friend Accepted

Vault Member Added

Future AuditLog module will expand this capability.

---

# Third-Party Services

Only trusted providers should be used.

Examples

Google OAuth

Supabase

Vercel

Future integrations should undergo security review.

---

# AI Rules

AI must never:

- bypass authentication
- bypass authorization
- bypass validation
- expose secrets
- disable security checks
- remove financial safeguards

AI should explain security implications whenever architecture changes.

---

# Anti-Patterns

Avoid

❌ Trusting client-provided user IDs

❌ Performing authorization in React Components

❌ Logging passwords

❌ Returning stack traces

❌ Skipping validation

❌ Updating balances outside transactions

❌ Storing secrets in source code

---

# Security Checklist

Before merging code,

verify:

- Authentication implemented
- Authorization implemented
- Validation completed
- Financial operations atomic
- Secrets externalized
- Error messages safe
- Logging reviewed
- Sensitive data protected

---

# Future Security Roadmap

Future enhancements include:

- Two-Factor Authentication (2FA)
- Device Management
- Login Notifications
- Audit Log Dashboard
- Session History
- Idempotency Keys
- Encryption for selected fields
- Security Monitoring

---

# Guiding Principle

> Security is not a feature added after development.

It is a responsibility embedded in every layer of Atlas.
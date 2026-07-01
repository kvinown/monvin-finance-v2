# Coding Standards

> Version: 1.0
> Status: Active

---

# Purpose

This document defines the official coding standards for Atlas.

The objective is to ensure that every line of code written by humans or AI follows the same engineering principles.

Consistency is more valuable than cleverness.

Readable code is more valuable than short code.

Maintainable code is more valuable than "smart" code.

---

# Engineering Philosophy

Atlas follows five engineering values.

1. Readability

2. Simplicity

3. Type Safety

4. Maintainability

5. Predictability

Whenever a trade-off exists,

choose the option that improves long-term maintenance.

---

# Core Principles

## Code Is Read More Than Written

Code should optimize for future readers.

Avoid unnecessary abstractions.

Avoid surprising implementations.

---

## Explicit Is Better Than Implicit

Prefer

```ts
const totalBalance = wallet.currentBalance
```

instead of

```ts
const t = wallet.b
```

Variables should describe intent.

---

## Small Functions

Functions should do one thing.

Good

```
Create Wallet

Validate Wallet

Calculate Balance
```

Bad

```
Create Wallet

Validate

Upload Image

Send Email

Create Notification

Refresh Dashboard
```

inside one function.

---

## Single Responsibility

Every file should have one purpose.

If a file requires scrolling for several minutes,

consider splitting it.

---

# TypeScript Standards

TypeScript is mandatory.

Strict Mode must remain enabled.

---

## Never Use Any

Avoid

```ts
any
```

Preferred order

1. Type Inference

2. Interface

3. Generic

4. unknown

5. any (last resort)

---

## Prefer Interfaces

Use

```ts
interface Wallet
```

for object contracts.

Use

```ts
type
```

for unions and utility types.

---

## Strong Typing

Every function must define

- Input
- Output

Avoid implicit return types for public APIs.

---

## Enums

Use enums only for stable business concepts.

Examples

WalletType

FriendStatus

VaultRole

Avoid enums for dynamic values.

---

# React Standards

React Components should be pure.

Components render UI.

Business logic belongs elsewhere.

---

## Component Size

Preferred

Less than 200 lines.

If larger,

split into smaller components.

---

## Server Components First

Prefer Server Components.

Only use Client Components when interaction requires them.

---

## Hooks

Hooks should

- encapsulate reusable UI logic
- never access Prisma directly

---

## Props

Prefer explicit props.

Avoid large prop objects.

---

# Next.js Standards

Use App Router.

Use Server Actions whenever appropriate.

Avoid unnecessary API Routes.

---

## Data Fetching

Preferred

Server Components

↓

Server Actions

↓

Client Fetch

Use client fetching only when necessary.

---

# Server Actions

Server Actions should

- authenticate
- validate
- call service
- return response

They should not contain business logic.

---

# Prisma Standards

Never call Prisma inside React Components.

Prefer Repository Layer.

Always use transactions for financial operations.

Always select only required fields.

Avoid

```ts
include: {
    everything: true
}
```

---

# Validation

Every mutation must validate.

Use

Zod

Validation flow

```
Input

↓

Schema Validation

↓

Business Validation

↓

Database
```

Never trust client input.

---

# Error Handling

Errors should be categorized.

Validation Error

Authentication Error

Authorization Error

Business Error

Unexpected Error

Never expose internal errors to users.

---

# Logging

Log important events.

Examples

Login

Wallet Created

Transfer Completed

Vault Contribution

Unexpected Errors

Do not log sensitive information.

---

# Async Code

Prefer

async/await

Avoid nested Promise chains.

---

# Naming Convention

Variables

camelCase

Functions

verb + noun

Examples

```
createWallet()

deleteWallet()

calculateBalance()
```

Classes

PascalCase

Components

PascalCase

Hooks

```
useWallet()
```

Constants

UPPER_SNAKE_CASE

---

# Comments

Comments should explain

WHY

not

WHAT.

Bad

```ts
// Increment i
i++
```

Good

```ts
// Prevent duplicate transaction replay
```

Code should explain itself.

---

# Magic Values

Never hardcode business values.

Bad

```ts
if (amount > 10000000)
```

Good

```ts
MAX_TRANSFER_LIMIT
```

---

# Performance

Avoid unnecessary rendering.

Avoid unnecessary queries.

Avoid duplicated calculations.

Cache only when necessary.

Measure before optimizing.

---

# Reusability

Before writing new code,

ask

Can existing code solve this?

Avoid duplicate implementations.

---

# Testing Mindset

Every important business rule should be testable.

Write code that is easy to test.

Avoid hidden dependencies.

---

# AI Coding Rules

AI should never

- duplicate code
- bypass validation
- bypass services
- bypass repositories
- mix UI with business logic

AI should always

- explain architectural decisions
- reuse existing utilities
- respect feature boundaries
- preserve type safety

---

# Code Review Checklist

Before merging code,

verify

- Type safe
- No duplicated logic
- Validation implemented
- Tests updated
- Documentation updated
- Naming consistent
- Error handling implemented
- Loading state implemented
- Empty state implemented

---

# Guiding Principle

> Every line of code should make the next developer's job easier.

Future maintainability always takes precedence over short-term convenience.
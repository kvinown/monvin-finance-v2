# Testing Strategy

> Version: 1.0
> Status: Active

---

# Purpose

This document defines the testing philosophy and strategy for Atlas.

Testing exists to protect business correctness, especially for financial operations.

The objective is **confidence**, not test coverage.

Atlas values meaningful tests over a high number of tests.

---

# Philosophy

Not every line of code deserves a test.

Every important business rule does.

Testing effort should be proportional to business risk.

---

# Risk-Based Testing

Atlas prioritizes testing according to risk.

Highest Risk

- Money movement
- Balance calculation
- Ledger integrity
- P2P Transfer
- Shared Vault
- Savings Allocation
- Authentication
- Authorization

Medium Risk

- Dashboard Queries
- Reports
- Search
- Filters

Low Risk

- UI Components
- Icons
- Static Layout
- Styling

---

# Testing Pyramid

Atlas follows the classic testing pyramid.

```
                E2E
               10%

          Integration
              30%

      Business Logic
           60%
```

Business rules receive the highest testing investment.

---

# Testing Levels

## Unit Tests

Purpose

Verify isolated logic.

Examples

Currency Formatter

Balance Calculator

Interest Calculator

Validation Helpers

Unit tests should have no database dependency.

---

## Service Tests

The most important testing level.

Examples

Transfer Money

Create Wallet

Deposit Savings

Withdraw Savings

Accept Friend

Create Shared Vault

Services contain business rules and should be heavily tested.

---

## Integration Tests

Verify interaction between:

- Services
- Prisma
- Database
- Authentication

Examples

Transfer updates two wallets.

Friend request creates notification.

Savings allocation updates balance.

---

## End-to-End Tests

Verify complete user flows.

Examples

Register

↓

Create Wallet

↓

Create Transaction

↓

Dashboard Updates

↓

Logout

Only critical flows require E2E tests.

---

# What Should Be Tested

Always test:

- Financial calculations
- Permission checks
- Validation
- Authorization
- Data consistency
- Error handling
- Database transactions

---

# What Usually Doesn't Need Tests

Usually unnecessary

- Presentational Components
- Static Layouts
- Icons
- Typography
- Tailwind Classes

Unless they contain important logic.

---

# Financial Testing Rules

Financial operations must verify:

- Amount validation
- Balance updates
- Atomic transactions
- Rollback behavior
- Ledger consistency

Every money movement should have automated tests.

---

# Validation Testing

Every validator should have tests for:

Valid input

Invalid input

Missing fields

Boundary values

Unexpected values

---

# Authentication Testing

Verify

Login

Logout

Expired Session

Invalid Credentials

Unauthorized Access

---

# Authorization Testing

Always verify ownership.

Example

User A

tries editing

User B Wallet

↓

403 Forbidden

Never test only successful paths.

---

# Database Testing

Integration tests should verify:

Foreign Keys

Cascade Rules

Transactions

Unique Constraints

Indexes (when performance matters)

---

# Error Testing

Every important service should test:

Validation Error

Business Error

Unexpected Error

Rollback

Failure should be predictable.

---

# Performance Testing

Atlas does not require synthetic benchmarks.

Instead,

focus on identifying slow queries.

Use:

- EXPLAIN ANALYZE
- Query profiling
- Realistic datasets

Performance testing is driven by real bottlenecks.

---

# Mocking

Mock only external dependencies.

Examples

Google OAuth

Email

Notifications

File Storage

Avoid mocking Prisma in integration tests.

---

# Test Data

Use realistic data.

Example

Wallet

BCA

Salary

Groceries

Fuel

Vacation Savings

Avoid meaningless values like:

```
abc

123

foo

bar
```

---

# Test Naming

Describe behavior.

Good

```
should_transfer_money_between_two_wallets()

should_reject_negative_amount()

should_prevent_duplicate_friendship()
```

Bad

```
test1()

walletTest()

example()
```

---

# Arrange, Act, Assert

Preferred structure

```
Arrange

↓

Act

↓

Assert
```

Keep tests simple and readable.

---

# AI Rules

AI should recommend tests when:

- Business rules change
- Validation changes
- Financial logic changes
- Security changes

AI should not generate tests for trivial UI changes unless requested.

---

# Anti-Patterns

Avoid

❌ Testing implementation details

❌ Snapshot testing everything

❌ Mocking the entire application

❌ Testing third-party libraries

❌ Chasing 100% coverage

❌ Duplicate tests

---

# Definition of Tested

A feature is considered tested when:

- Business rules verified
- Validation verified
- Authorization verified
- Failure scenarios covered
- Happy path covered

Coverage percentage alone is not sufficient.

---

# Recommended Tools

Unit & Integration

- Vitest

React Components (when needed)

- Testing Library

E2E

- Playwright

Database

- PostgreSQL Test Database

These tools align with the Next.js ecosystem.

---

# Future Testing

Future improvements may include:

- Visual Regression Testing
- Accessibility Testing
- Load Testing
- Mutation Testing
- Continuous Performance Monitoring

---

# Testing Checklist

Before merging:

- Business rules tested
- Validation tested
- Authorization tested
- Financial operations verified
- No flaky tests
- Test names descriptive
- Realistic test data used

---

# Guiding Principle

> Test business behavior, not implementation details.

A good test gives confidence that users' financial data remains correct, even as the internal implementation evolves.
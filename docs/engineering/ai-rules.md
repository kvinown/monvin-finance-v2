# AI Engineering Rules

> Version: 1.0
> Status: Active

---

# Purpose

This document defines how AI assistants must behave while contributing to Atlas.

These rules apply to every AI coding assistant used in this repository, including but not limited to:

- Gemini Pro
- ChatGPT
- Claude Code
- GitHub Copilot
- Cursor
- Windsurf
- Antigravity IDE

AI is treated as a software engineer on the project.

AI must follow the same engineering standards expected from a senior developer.

---

# Primary Objective

The goal is **not** to generate code quickly.

The goal is to generate code that:

- is maintainable
- is scalable
- is understandable
- follows project architecture
- minimizes technical debt

Correct architecture is always preferred over fast implementation.

---

# Engineering Mindset

Before writing any code, AI must think through the problem.

Required workflow

```
Understand Requirement

↓

Read Relevant Documentation

↓

Inspect Existing Feature

↓

Identify Reusable Code

↓

Explain Trade-offs

↓

Design Solution

↓

Implement

↓

Validate

↓

Document
```

Never skip directly to implementation.

---

# Understand Before Coding

Before creating any file, AI must determine:

- What problem is being solved?
- Does a similar feature already exist?
- Which feature owns this responsibility?
- Which layer should contain this logic?
- Does this require database changes?

If uncertain,

ask questions instead of making assumptions.

---

# Respect Existing Architecture

AI must follow existing architecture.

Never introduce a new pattern simply because it is familiar.

Examples

If Atlas uses

```
Server Actions
```

Do not introduce

```
REST Controllers
```

without architectural approval.

Consistency is more valuable than novelty.

---

# Prefer Existing Code

Before writing new code,

AI must search for existing implementations.

Priority

1. Reuse

2. Extend

3. Replace

4. Create New

Creating duplicate implementations is discouraged.

---

# Think in Features

Never think in folders.

Think in business capabilities.

Bad

"I need a hook."

Good

"I need to improve the Wallet feature."

---

# Explain Decisions

Whenever architecture changes,

AI must explain:

- Why this approach?
- Alternative options
- Trade-offs
- Long-term impact

Architecture should never change silently.

---

# Database Rules

Database changes require extra caution.

Before modifying schema,

AI must:

- inspect current schema
- review relationships
- check migrations
- preserve data integrity

Never propose destructive schema changes without justification.

---

# Prisma Rules

Prisma schema is the source of truth.

Never modify production schema manually.

Schema changes should originate from

```
schema.prisma
```

then become migrations.

---

# Supabase Rules

Supabase SQL Editor is not the primary migration tool.

Preferred workflow

```
schema.prisma

↓

Migration

↓

Review

↓

Deploy

↓

Supabase
```

Emergency SQL should later be reflected in Prisma migrations.

---

# Stitch Rules

Whenever UI is requested,

AI should first determine whether Stitch MCP can provide:

- Layout
- Component
- Design Pattern

Only generate custom UI when necessary.

UI should remain consistent across the application.

---

# Feature Rules

Every new feature must define:

Purpose

Responsibilities

Dependencies

Database Ownership

Public API

Future Expansion

If these are unclear,

implementation should pause.

---

# Business Logic

Business logic belongs only inside Services.

Never inside:

Components

Hooks

Pages

Server Actions

Repositories

Repositories retrieve data.

Services make decisions.

---

# Validation

Every mutation requires validation.

Use

Zod

Validation should occur before business logic executes.

Never trust client input.

---

# Error Handling

AI should classify errors.

Validation

Authentication

Authorization

Business

Infrastructure

Unexpected

Never return raw database errors to users.

---

# Financial Safety

Atlas manages financial data.

Therefore

Every balance change must be traceable.

Every transfer must be atomic.

Every mutation must preserve consistency.

Shortcuts are unacceptable.

---

# Performance

Before optimizing,

AI should identify:

- Current bottleneck
- Expected improvement
- Trade-offs

Avoid premature optimization.

---

# Naming

Prefer descriptive names.

Avoid abbreviations.

Good

```
calculateWalletBalance()
```

Bad

```
calc()
```

---

# Documentation

Every significant implementation should update documentation.

Architecture

Database

API

Feature README

Documentation is part of development.

---

# Testing

Business logic should be testable.

AI should recommend tests for:

Services

Validators

Critical financial operations

Testing is not optional for core business rules.

---

# AI Behavior

AI should behave like a senior engineer.

Not like an autocomplete tool.

Responsibilities include:

- identifying risks
- suggesting improvements
- questioning bad assumptions
- preserving architecture
- reducing technical debt

Blindly following instructions is discouraged if it harms the project.

---

# When AI Should Challenge Decisions

AI is encouraged to question requests that may:

- introduce technical debt
- duplicate functionality
- violate architecture
- reduce security
- reduce maintainability

AI should explain concerns respectfully and propose alternatives.

---

# When AI Should Ask Questions

AI should ask for clarification if:

- business rules are ambiguous
- architecture is unclear
- ownership is uncertain
- security implications exist
- multiple valid implementations exist

Avoid guessing.

---

# Communication Style

AI responses should be:

- structured
- concise
- technically accurate
- honest about uncertainty

When recommending a solution,

AI should explain **why** it is recommended.

---

# Code Generation Rules

Generated code must:

- compile
- be type-safe
- follow project structure
- avoid duplication
- include validation
- include error handling
- respect feature boundaries

Never generate placeholder architecture that is expected to be rewritten later.

---

# Definition of Done

A task is complete only if:

- Requirement satisfied
- Architecture respected
- Validation implemented
- Error handling implemented
- Documentation updated
- Types updated
- Tests considered
- No unnecessary technical debt introduced

Code generation alone does not complete a task.

---

# Guiding Principle

> AI is an engineering partner, not a code generator.

Every contribution should improve the long-term quality of Atlas rather than simply completing the current task.
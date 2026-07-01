# Component Catalog

> Version: 1.0
> Status: Active

---

# Purpose

This document defines the reusable business components used throughout Atlas.

Atlas relies on **shadcn/ui** for foundational UI components (Button, Card, Dialog, Sheet, etc.) and **Stitch MCP** for layout generation.

This catalog defines only Atlas-specific business components.

The goal is to maximize consistency and component reuse.

---

# General Principles

Business components should:

- Represent one business concept.
- Encapsulate business logic presentation.
- Be reusable across multiple screens.
- Remain stateless whenever possible.
- Accept data through props only.

Business components should never directly fetch data.

---

# BalanceCard

## Purpose

Display a financial balance summary.

---

## Displays

- Title
- Amount
- Currency
- Trend (optional)

---

## Variants

- Default
- Compact
- Highlight

---

## Used In

- Dashboard
- Analytics
- Wallet Overview

---

## Business Rules

- Always display formatted currency.
- Negative values must be visually distinguishable.
- Do not expose raw numeric formatting.

---

## Future Enhancements

- Monthly comparison
- Percentage change
- AI Insight badge

---

# WalletCard

## Purpose

Represent a wallet.

---

## Displays

- Wallet Name
- Wallet Type
- Institution
- Current Balance

---

## Variants

- Default
- Compact
- Selectable

---

## Used In

- Wallet List
- Dashboard
- Transfer Form

---

## Business Rules

- Credit wallets may display negative balances.
- Archived wallets are visually distinguished.
- Sensitive information must never be displayed.

---

## Future Enhancements

- Institution logo
- Custom icon
- Favorite indicator

---

# TransactionItem

## Purpose

Represent a single transaction.

---

## Displays

- Amount
- Category
- Wallet
- Date
- Transaction Type

---

## Variants

- Standard
- Compact
- Selectable

---

## Used In

- Dashboard
- Transaction History
- Wallet Detail

---

## Business Rules

- Income and Expense should be clearly differentiated.
- Currency formatting is mandatory.
- Transaction status should be visible if applicable.

---

## Future Enhancements

- Receipt attachment
- Location
- AI-generated tags

---

# SavingsGoalCard

## Purpose

Represent a personal savings goal.

---

## Displays

- Goal Name
- Target Amount
- Current Amount
- Progress

---

## Variants

- Default
- Compact

---

## Used In

- Savings
- Dashboard

---

## Business Rules

- Progress is calculated from contributions.
- Progress cannot exceed target without explicit support.

---

## Future Enhancements

- Estimated completion date
- Monthly contribution recommendation

---

# VaultCard

## Purpose

Represent a Shared Vault.

---

## Displays

- Vault Name
- Members
- Progress
- Target Amount

---

## Variants

- Default
- Compact

---

## Used In

- Shared Vault List
- Dashboard

---

## Business Rules

- Progress updates automatically.
- Member count must remain accurate.

---

## Future Enhancements

- Recent contributor
- Milestone indicator

---

# FriendCard

## Purpose

Represent a friend connection.

---

## Displays

- Display Name
- Username
- Status

---

## Variants

- Friend
- Pending
- Invitation

---

## Used In

- Friends
- Shared Vault Invitation
- P2P Transfer

---

## Business Rules

- Relationship status must be explicit.
- Duplicate invitations are prohibited.

---

# SummaryStat

## Purpose

Display a single KPI.

---

## Displays

- Label
- Value
- Trend (optional)

---

## Variants

- Default
- Compact

---

## Used In

- Dashboard
- Analytics

---

## Business Rules

- Always display consistent formatting.
- Values should be comparable.

---

# ProgressIndicator

## Purpose

Visualize financial progress.

---

## Displays

- Current Progress
- Percentage
- Target

---

## Used In

- Savings
- Shared Vault

---

## Business Rules

- Percentage is derived from current and target values.
- Values should never exceed 100% unless explicitly allowed.

---

# EmptyState

## Purpose

Guide users when no data is available.

---

## Displays

- Illustration (optional)
- Title
- Description
- Suggested Action

---

## Used In

- Every feature module

---

## Business Rules

- Every empty state must encourage the next action.
- Avoid technical language.

---

# SectionHeader

## Purpose

Provide a consistent section heading.

---

## Displays

- Title
- Subtitle (optional)
- Action Button (optional)

---

## Used In

- Dashboard
- Wallets
- Analytics
- Friends
- Shared Vault

---

## Business Rules

- Titles should be concise.
- Actions should be relevant to the section.

---

# Component Evolution

When introducing a new business component:

1. Verify that no existing component fulfills the same purpose.
2. Prefer extending an existing component.
3. Keep components focused on a single business concept.
4. Document the component in this catalog before implementation.

---

# AI Instructions

Before generating UI:

1. Read this catalog.
2. Reuse existing business components whenever possible.
3. Do not create duplicate components.
4. Use shadcn/ui for foundational UI elements.
5. Use Stitch MCP for layout generation.

---

# Guiding Principle

> Every business concept should have exactly one primary reusable component.

Consistency is achieved through reuse, not duplication.
# Atlas User Flow

> Version: 1.0
> Status: Active

---

# Purpose

This document describes the primary user journeys within Atlas.

Instead of focusing on page navigation, Atlas models user flows around **user goals**.

Every feature should help users accomplish a meaningful financial task.

---

# User Journey Philosophy

Users do not open Atlas because they want to use a feature.

They open Atlas because they want to achieve a financial goal.

Examples:

- Check available money
- Record an expense
- Save for a vacation
- Transfer money
- Review monthly spending
- Plan next month's budget

Every screen should help complete one of these goals.

---

# Primary User Journey

```
Open Atlas
      ↓
Authenticate
      ↓
Dashboard
      ↓
Choose Financial Goal
      ↓
Complete Action
      ↓
Dashboard Updated
```

The dashboard is always the user's home and source of truth.

---

# Dashboard Flow

## Goal

Understand current financial status.

```
Login
      ↓
Dashboard
      ↓
View Total Balance
      ↓
View Wallet Summary
      ↓
View Recent Transactions
      ↓
View Savings Progress
      ↓
Choose Next Action
```

Users should understand their financial position within a few seconds.

---

# Wallet Management Flow

## Goal

Manage available sources of funds.

```
Dashboard
      ↓
Wallets
      ↓
Create Wallet
      ↓
Select Wallet Type
      ↓
Enter Initial Balance
      ↓
Save
      ↓
Wallet Appears on Dashboard
```

Supported wallet types:

- Cash
- Bank
- E-Wallet
- Credit / PayLater

---

# Income Flow

## Goal

Record incoming money.

```
Dashboard
      ↓
New Transaction
      ↓
Income
      ↓
Select Wallet
      ↓
Select Category
      ↓
Enter Amount
      ↓
Optional Note
      ↓
Save
      ↓
Dashboard Updated
```

Result:

- Transaction recorded
- Wallet balance updated
- Analytics updated

---

# Expense Flow

## Goal

Record outgoing money.

```
Dashboard
      ↓
New Transaction
      ↓
Expense
      ↓
Select Wallet
      ↓
Category
      ↓
Amount
      ↓
Optional Note
      ↓
Save
      ↓
Balance Updated
```

Validation:

- Wallet ownership
- Positive amount
- Sufficient balance (except credit wallets)

---

# Wallet Transfer Flow

## Goal

Move money between personal wallets.

```
Dashboard
      ↓
Transfer
      ↓
Source Wallet
      ↓
Destination Wallet
      ↓
Amount
      ↓
Confirm
      ↓
Atomic Transaction
      ↓
Dashboard Updated
```

Results:

- Source decreases
- Destination increases
- Ledger updated

---

# Friend Flow

## Goal

Connect with another user.

```
Friends
      ↓
Search User
      ↓
Send Friend Request
      ↓
Waiting
      ↓
Accepted
      ↓
Friend List Updated
```

Friendship is required before collaborative features become available.

---

# P2P Transfer Flow

## Goal

Transfer money to another user.

```
Dashboard
      ↓
Transfer to Friend
      ↓
Select Friend
      ↓
Select Wallet
      ↓
Amount
      ↓
Confirm
      ↓
Atomic Transaction
      ↓
Both Dashboards Updated
```

Results:

Sender

- Expense

Receiver

- Income

Both users receive synchronized financial records.

---

# Savings Flow

## Goal

Allocate money toward a personal goal.

```
Dashboard
      ↓
Savings
      ↓
Choose Goal
      ↓
Deposit
      ↓
Select Wallet
      ↓
Amount
      ↓
Save
      ↓
Progress Updated
```

Money is separated from daily spending while remaining fully traceable.

---

# Shared Vault Flow

## Goal

Save money collaboratively.

```
Dashboard
      ↓
Create Shared Vault
      ↓
Invite Friends
      ↓
Friends Accept
      ↓
Vault Created
      ↓
Members Deposit
      ↓
Progress Updated
```

Each contribution is recorded independently.

---

# Analytics Flow

## Goal

Understand financial behavior.

```
Dashboard
      ↓
Analytics
      ↓
Choose Period
      ↓
View Charts
      ↓
Category Breakdown
      ↓
Cash Flow
      ↓
Insights
```

Analytics should help answer financial questions rather than simply display numbers.

---

# Budget Planning Flow (Future)

```
Planning
      ↓
Create Budget
      ↓
Allocate Categories
      ↓
Track Progress
      ↓
Receive Alerts
```

---

# Bills Flow (Future)

```
Bills
      ↓
Create Bill
      ↓
Recurring Schedule
      ↓
Reminder
      ↓
Payment
      ↓
History Updated
```

---

# Investment Flow (Future)

```
Portfolio
      ↓
Add Asset
      ↓
Track Holdings
      ↓
Update Prices
      ↓
Portfolio Performance
```

---

# AI Assistant Flow (Future)

```
Dashboard
      ↓
Ask AI
      ↓
Analyze Financial Data
      ↓
Generate Insight
      ↓
User Reviews Recommendation
```

AI never modifies financial data directly.

AI only provides insights and recommendations.

---

# Error Flows

Every primary flow should define failure scenarios.

Examples:

- Invalid session
- Validation failure
- Network interruption
- Insufficient balance
- Friend request already exists
- Vault invitation expired

Users should always receive actionable feedback.

---

# Navigation Principles

Atlas should minimize navigation depth.

Preferred:

```
Dashboard
      ↓
Feature
      ↓
Action
```

Avoid long navigation chains.

---

# UX Principles

Every flow should be:

- Simple
- Predictable
- Mobile-first
- Recoverable
- Fast

Users should never wonder what to do next.

---

# Flow Completion

A user flow is considered complete when:

- Business action succeeds
- Dashboard reflects the latest state
- User receives clear feedback
- No manual refresh is required

---

# Future User Journeys

Future flows may include:

- Receipt Scanning
- CSV Import
- Multi-device Sync
- Offline Recording
- AI Financial Planning
- Goal Simulation
- Investment Rebalancing

---

# Guiding Principle

> Every interaction in Atlas should help users make better financial decisions with the fewest possible steps.

User flows should optimize for clarity, confidence, and long-term usability rather than simply connecting pages.
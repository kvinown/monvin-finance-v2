# Interaction Patterns

> Version: 1.0
> Status: Active

---

# Purpose

This document defines the standard interaction patterns used throughout Atlas.

Atlas delegates visual implementation to **Stitch MCP**, while this document defines **how users interact with the application** and the required business behaviors.

These patterns ensure consistent interactions across all features.

---

# General Principles

Every interaction should be:

- Predictable
- Reversible (when possible)
- Fast
- Safe
- Accessible

Financial actions should prioritize correctness over speed.

---

# Standard Interaction Flow

Every business action follows this lifecycle:

```
User Action
      ↓
Validation
      ↓
Confirmation (if required)
      ↓
Processing
      ↓
Feedback
      ↓
UI Refresh
```

---

# Create Pattern

## Used For

- Wallet
- Savings Goal
- Shared Vault
- Friend Request

---

## Flow

```
Open Form
      ↓
Fill Information
      ↓
Validate
      ↓
Save
      ↓
Success Feedback
      ↓
Return Updated Data
```

---

## Rules

- Validate before submission.
- Keep user input when validation fails.
- Show success feedback after completion.

---

# Edit Pattern

## Used For

- Wallet
- Profile
- Settings
- Savings Goal

---

## Flow

```
Open Existing Data
      ↓
Edit
      ↓
Validate
      ↓
Save
      ↓
Refresh
```

---

## Rules

- Show original values.
- Save only modified fields where appropriate.
- Warn before leaving with unsaved changes.

---

# Delete Pattern

## Used For

- Wallet
- Savings Goal
- Friend
- Shared Vault (Owner)

---

## Flow

```
Delete
      ↓
Confirmation
      ↓
Delete / Archive
      ↓
Success
```

---

## Rules

Financial data should never be permanently deleted unless explicitly supported.

Prefer:

Archive

instead of

Delete.

---

# Transfer Pattern

## Used For

- Wallet Transfer
- P2P Transfer
- Savings Deposit

---

## Flow

```
Choose Source
      ↓
Choose Destination
      ↓
Enter Amount
      ↓
Review Summary
      ↓
Confirm
      ↓
Atomic Transaction
      ↓
Success
```

---

## Rules

Always display:

- Source
- Destination
- Amount
- Currency

Transfers should never execute immediately without user confirmation.

---

# Friend Request Pattern

## Flow

```
Search User
      ↓
Send Request
      ↓
Pending
      ↓
Accepted / Rejected
```

---

## Rules

- Prevent duplicate requests.
- Prevent adding yourself.
- Clearly indicate request status.

---

# Shared Vault Invitation

## Flow

```
Invite Member
      ↓
Pending
      ↓
Accepted
      ↓
Vault Updated
```

---

## Rules

Only accepted members can:

- View
- Contribute
- Participate

---

# Deposit Pattern

## Used For

- Savings
- Shared Vault

---

## Flow

```
Choose Wallet
      ↓
Enter Amount
      ↓
Review
      ↓
Confirm
      ↓
Success
```

---

## Rules

Deposits must always create a transaction record.

Balances update automatically.

---

# Archive Pattern

## Used For

- Wallet
- Savings Goal

---

## Flow

```
Archive
      ↓
Confirmation
      ↓
Hidden from Default Views
```

---

## Rules

Archived data remains recoverable.

---

# Search Pattern

## Requirements

Search should:

- Be responsive
- Ignore case
- Support partial matches

---

## Supported Modules

- Wallet
- Transaction
- Friends
- Shared Vault

---

# Filter Pattern

Filters should never modify data.

They only modify presentation.

Filters should always support reset.

---

# Loading Pattern

During processing:

- Disable duplicate submissions.
- Preserve current screen.
- Show progress.

Avoid blocking unrelated actions.

---

# Success Pattern

Every successful action should provide feedback.

Examples:

- Toast
- Success Banner
- Updated Data
- Progress Animation

Feedback should be brief and non-disruptive.

---

# Error Pattern

Errors should explain:

- What happened
- What the user can do next

Avoid exposing internal system messages.

---

# Empty State Pattern

Every empty state should include:

- Explanation
- Next Action

Example:

"No wallets found."

↓

"Create your first wallet."

---

# Offline Pattern

If offline:

- Inform the user.
- Prevent destructive actions.
- Retry automatically when possible.

---

# Permission Pattern

Users should only see actions they are authorized to perform.

Example:

Vault Owner

- Invite Members
- Archive Vault

Vault Member

- Contribute
- View History

---

# Confirmation Pattern

Confirmation is required for:

- Financial Transfers
- Archive
- Delete
- Leaving Unsaved Changes

Confirmation should summarize the action before execution.

---

# AI Instructions

When generating UI with Stitch MCP:

1. Use Stitch MCP for layout generation.
2. Apply the interaction pattern defined in this document.
3. Do not invent new interaction flows without justification.
4. Reuse existing interaction patterns whenever possible.
5. Keep interactions consistent across all modules.

---

# Guiding Principle

> Users should never need to learn a new interaction for the same type of action.

A transfer should behave like every other transfer.

A delete should behave like every other delete.

Consistency builds trust.
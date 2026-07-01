# ADR-0001: Adopt Next.js as the Application Framework

> **Status:** Accepted  
> **Date:** 2026-06-30  
> **Decision Makers:** Project Owner  
> **Related Documents:**
>
> - `docs/architecture/system-overview.md`
> - `docs/architecture/clean-architecture.md`
> - `docs/engineering/ai-rules.md`

---

# Context

Atlas is a long-term personal project designed as a **Personal Financial Operating System (PFOS)**.

The application requires:

- Modern React architecture
- Excellent TypeScript support
- Server-side rendering where appropriate
- API endpoints
- Authentication
- SEO for public pages (future)
- Fast deployment
- Excellent developer experience
- Strong AI-assisted development workflow

Because Atlas will continue evolving over many years, the framework must be stable, actively maintained, and widely supported.

---

# Decision

Atlas adopts **Next.js (App Router)** as the primary application framework.

The project will use:

- React
- App Router
- Server Components by default
- Client Components only when necessary
- Route Handlers for lightweight APIs
- Server Actions for mutations where appropriate

Next.js becomes the foundation of the entire application architecture.

---

# Why Next.js

Next.js provides several advantages aligned with Atlas's goals.

## Full-Stack Development

Atlas can implement:

- Frontend
- Backend APIs
- Authentication
- Middleware

inside a single application.

This simplifies development and deployment.

---

## React Ecosystem

React has the largest ecosystem among modern frontend frameworks.

Benefits include:

- Mature libraries
- Strong community
- Long-term stability
- Excellent TypeScript support

---

## App Router

App Router provides:

- Nested layouts
- Server Components
- Streaming
- Better routing organization

These features improve scalability for large applications.

---

## Server Components

Atlas will prefer Server Components whenever possible.

Benefits:

- Smaller client bundles
- Faster initial rendering
- Reduced JavaScript sent to the browser

Client Components should only be used when interactivity requires them.

---

## Server Actions

Server Actions simplify:

- Form submissions
- Mutations
- Validation
- Database operations

Whenever practical, Atlas should favor Server Actions over creating unnecessary API endpoints.

---

## Route Handlers

Route Handlers remain appropriate for:

- Public APIs
- Webhooks
- Third-party integrations
- Mobile clients (future)

Not every mutation needs a Route Handler.

---

## Excellent AI Compatibility

Next.js has extensive documentation and community examples.

This significantly improves:

- AI code generation quality
- Debugging assistance
- Availability of implementation patterns

---

## Deployment

Atlas will deploy primarily to **Vercel**.

Benefits include:

- Native Next.js support
- Preview deployments
- Edge capabilities (if needed)
- Minimal deployment configuration

The architecture should remain portable to other hosting providers if future requirements change.

---

# Alternatives Considered

## Laravel

Advantages

- Excellent backend framework
- Mature ecosystem

Reasons not selected

- Separate frontend stack required.
- Less aligned with the desired React-based architecture.

---

## Nuxt

Advantages

- Excellent developer experience
- Strong Vue ecosystem

Reasons not selected

- Atlas standardizes on React.
- Smaller ecosystem for the intended stack.

---

## Remix

Advantages

- Strong web fundamentals
- Good data loading model

Reasons not selected

- Smaller ecosystem.
- Less common in AI-generated examples compared to Next.js.

---

## SPA + Separate Backend

Advantages

- Clear separation of concerns

Reasons not selected

- Increased operational complexity.
- Duplicate authentication concerns.
- More infrastructure to maintain.

---

# Consequences

Positive

- Unified frontend and backend.
- Simplified deployment.
- Excellent TypeScript integration.
- Strong AI support.
- Large ecosystem.
- Long-term maintainability.

Negative

- Framework evolves quickly; periodic upgrades are expected.
- Developers must understand Server vs Client Components.
- Some framework abstractions require a learning curve.

These trade-offs are acceptable for Atlas.

---

# Architectural Principles

The following principles apply to all Atlas development.

- Server Components by default.
- Client Components only when necessary.
- Business logic belongs outside UI components.
- Prefer Server Actions for mutations.
- Prefer Route Handlers only when external access is required.
- Keep pages thin and feature modules self-contained.

---

# AI Engineering Notes

When generating code:

- Assume App Router.
- Never generate Pages Router code.
- Prefer Server Components.
- Use TypeScript.
- Use feature-based organization.
- Respect Clean Architecture boundaries.
- Avoid unnecessary client-side state.

If a solution requires a Client Component, explain why.

---

# Future Review

This decision should be revisited only if:

- Next.js is no longer actively maintained.
- React undergoes a major architectural shift.
- Atlas requires capabilities that cannot be reasonably implemented within Next.js.

Until then, Next.js remains the official application framework.

---

# Decision Summary

Atlas standardizes on **Next.js (App Router)** because it provides the best balance of developer experience, scalability, React ecosystem support, AI-assisted development, and long-term maintainability for a personal financial platform.
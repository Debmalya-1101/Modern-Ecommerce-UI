# AI Development Rules

This project is a personal Angular application built to feel close to enterprise frontend work without becoming hard to understand.

The goal is to stay:
- beginner-readable
- clean and modern
- scalable enough for growth
- disciplined without overengineering

## Coding Rules

- Use the latest Angular patterns that match the current project version.
- Prefer standalone components, standalone routing, and provider-based configuration.
- Keep components focused. A component should usually handle one screen section or one UI responsibility.
- Write simple TypeScript first. Avoid clever abstractions unless repetition is clearly becoming a maintenance problem.
- Prefer Angular `signal`-based local state for simple UI state.
- Use services for shared logic, data access, and cross-component coordination.
- Keep functions small and clearly named.
- Favor readable variable names over short names.
- Avoid `any`. Use explicit interfaces or type aliases when data shape matters.
- Co-locate files when it improves readability: component, template, style, spec.
- Keep comments rare and useful. Explain "why", not obvious syntax.
- Do not introduce advanced Angular APIs just to look modern. Use them only when they solve a real problem.

## UI Rules

- Use Angular Material for common UI building blocks once added to the app.
- Keep the UI responsive from the beginning. Test mobile, tablet, and desktop thinking early.
- Prefer simple layouts with clear spacing, strong hierarchy, and predictable behavior.
- Use SCSS for structure, variables, and reusable styling patterns.
- Avoid one-off style hacks when a reusable utility or shared variable would be clearer.
- Keep accessibility in mind:
  - semantic HTML first
  - proper button and form usage
  - visible focus states
  - readable color contrast
  - labels for inputs
- Avoid overcrowded pages. E-commerce screens should guide attention clearly.
- Build components so they are easy to restyle later.

## Architecture Rules

- Organize by feature when the app grows, not by technical file type alone.
- Keep a light structure at the start. Add folders only when they help navigation.
- Use this layering idea:
  - `pages` for route-level screens
  - `features` for business-focused UI sections
  - `shared` for reusable UI and utilities
  - `core` for app-wide services and singleton concerns
- Keep domain models simple and explicit.
- Do not create a state-management layer until shared state complexity actually justifies it.
- Prefer route-driven composition over large root components.
- Keep API-facing code separated from presentation logic.
- Reuse UI through shared components only when the reuse is real, not speculative.
- Add guards, interceptors, or resolvers only when the app needs them.

## Learning Documentation Rules

- Every meaningful feature should be documented in beginner-friendly language.
- Write explanations for a backend-heavy developer moving into Angular.
- When documenting a concept, include:
  - what it is
  - why it exists
  - where it is used in this project
  - a tiny example when possible
- Prefer short examples over theory-heavy explanations.
- Record architectural decisions, especially when choosing "simple now, scalable later".
- Explain why a feature was added, not just what files changed.
- Keep notes honest. If something is still a future plan, label it clearly as planned.
- Update the learning journal after adding routes, forms, services, shared components, or Material-based UI patterns.

## Decision Filter

Before adding new code, ask:

1. Is this understandable for someone still growing in Angular?
2. Is this aligned with modern Angular best practices?
3. Does this solve a real current need instead of a hypothetical future need?
4. Will this structure still make sense after adding several more features?
5. Can this be explained simply in the learning journal?

If the answer to most of these is "no", choose the simpler approach.

## Feature Implementation Rule

Every feature implementation must include:

1. Backend/service implementation
2. UI implementation
3. Routing implementation
4. Navigation integration (if applicable)
5. Loading states
6. Error states
7. Empty states (if applicable)
8. Responsive design

A feature is NOT considered complete if only services or infrastructure are implemented.

Every implemented feature must be visible and testable from the browser UI.
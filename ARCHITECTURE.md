# Architecture

## Purpose

This project is a personal Angular application intended to feel professional and enterprise-relevant while remaining easy to read and learn from.

The architecture should:
- support growth
- stay understandable
- use modern Angular patterns
- avoid unnecessary complexity

## Current State

The repository currently contains a very small Angular 21 application with:
- standalone application bootstrap
- root component
- router provider setup
- SCSS styling support

This is intentionally lightweight and is a good starting point.

## Architecture Goals

- Keep the first version simple.
- Let structure emerge from real features.
- Prefer clear boundaries over abstract patterns.
- Separate app-wide concerns from feature concerns.
- Build in a way that a backend-heavy developer can trace easily.

## Recommended Folder Direction

This is the intended structure as the app grows:

```text
src/
  app/
    core/
      services/
      models/
      layout/
    shared/
      components/
      directives/
      pipes/
      utils/
    features/
      home/
      products/
      cart/
      checkout/
    pages/
    app.config.ts
    app.routes.ts
    app.ts
```

Notes:
- `core` is for singleton or app-wide concerns.
- `shared` is for reusable building blocks used across features.
- `features` is for domain/business slices.
- `pages` can be used for route-level composition if that makes screens easier to scan.

This is a target direction, not a rule that must be fully created immediately.

## Layering Approach

### App Layer

Contains application startup and global configuration.

Examples:
- bootstrap logic
- router providers
- top-level layout setup

### Core Layer

Contains app-wide logic that should usually exist once.

Examples:
- API services
- authentication state if added later
- global layout helpers
- shared configuration models

Rule:
- `core` should not become a dumping ground for unrelated helpers

### Feature Layer

Contains business-focused functionality.

Examples:
- product listing
- product details
- cart
- checkout

Rule:
- each feature should own its components, services, and models when they are mostly feature-specific

### Shared Layer

Contains reusable pieces with no tight feature ownership.

Examples:
- reusable buttons or cards
- formatting helpers
- UI utilities

Rule:
- only move code into `shared` after real reuse appears

## Routing Strategy

Use route-based composition as the app grows.

Suggested direction:
- keep route definitions centralized in `app.routes.ts`
- lazy load route-level screens when there are enough features to justify it
- keep each route focused on a clear user task

Example future direction:

```ts
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.page').then((m) => m.HomePage)
  }
];
```

Why this is useful:
- better scalability
- smaller route-level mental model
- closer to real Angular application structure

## State Strategy

Start simple.

Recommended order:
1. local component state with `signal`
2. shared logic in services
3. introduce more formal shared state only if complexity becomes real

Why:
- many personal projects become harder to learn from when state patterns become too abstract too early
- Angular already gives enough tools for a clean small-to-medium app without extra state libraries

## UI Strategy

- Use standalone components for UI composition.
- Use Angular Material for standard interaction components once installed.
- Use SCSS for variables, spacing rules, and component styling.
- Keep responsive behavior part of the feature build, not a later fix.

## Data Flow Strategy

Recommended direction:
- components trigger user actions
- services manage fetching or business logic
- components render state

This keeps responsibilities easier to understand.

Simple mental model:

```text
User action -> Component -> Service -> State update -> UI rerender
```

## Enterprise-Relevant Practices Without Overengineering

This project should include professional habits such as:
- clear folder boundaries
- consistent naming
- typed models
- reusable UI patterns
- route-based organization
- accessibility awareness
- testable services and components

This project should avoid early complexity such as:
- deep inheritance
- premature generic abstractions
- too many shared utilities
- global state for everything
- creating architecture for features that do not exist yet

## Naming Direction

- Use feature names that match business language: `products`, `cart`, `checkout`
- Use clear suffixes when useful: `ProductCardComponent`, `CartService`
- Prefer descriptive file names over short clever ones

## Testing Direction

As features are added later:
- test important component behavior
- test service logic
- avoid shallow tests that only mirror Angular internals

Focus on:
- rendering states
- user interactions
- data mapping
- edge cases in cart and checkout flows

## Architectural Principle

Build the next clean step, not the final imagined system.

That principle keeps the project:
- readable for learning
- professional enough for interviews and portfolio discussion
- flexible enough to grow

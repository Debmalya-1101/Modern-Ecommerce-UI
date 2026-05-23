# Learning Journal

This file is for learning Angular by connecting each project change to a simple explanation.

Audience:
- a developer who is stronger in backend concepts than frontend frameworks
- someone who wants practical Angular understanding, not just definitions

## Current Starting Point

The project currently starts with a very small Angular 21 application using:
- standalone bootstrap
- routing setup
- SCSS styling
- a root component

That is a good foundation because it is modern, small, and easy to grow.

## Angular Concepts Explained Simply

### 1. Bootstrap Application

In many backend systems, there is an application entry point where the app starts and configuration gets wired together.

Angular has the same idea.

Current example from this project:

```ts
bootstrapApplication(App, appConfig);
```

What it means:
- `App` is the root UI component
- `appConfig` contains app-wide providers like the router
- Angular starts the browser app from here

Why this feature exists:
- It replaces older module-heavy startup patterns
- It is simpler for new Angular apps
- It keeps setup more explicit

Why it was added:
- This is the standard modern Angular entry pattern
- It keeps the app aligned with current Angular best practices

### 2. Standalone Components

A standalone component is a component that declares its own dependencies directly instead of being declared inside a large Angular module.

Small example:

```ts
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
```

What this means:
- the component can directly say what it needs
- `RouterOutlet` is imported where it is used
- there is less hidden wiring than older Angular patterns

Why this feature exists:
- better readability
- less ceremony
- easier file-by-file understanding

Why it was added:
- it makes the code easier for a beginner to trace
- it matches how modern Angular apps are commonly built

### 3. Router

The Angular router decides which screen should be shown for a URL.

Backend analogy:
- similar to route mapping in a server app
- instead of returning JSON or HTML from the server, Angular swaps frontend views

Small example:

```ts
export const routes: Routes = [];
```

Right now the routes are empty, which means the app has not started screen-based navigation yet.

Why this feature exists:
- lets the app have multiple screens
- supports feature-based navigation
- keeps page structure organized

Why it was added:
- even before real pages exist, setting up routing early creates a scalable base

### 4. Signals

Signals are Angular's modern reactive state primitive for local state.

Small example:

```ts
title = signal('modern-ecommerce-ui');
```

Think of a signal as:
- a value Angular can track
- when the value changes, the UI can react

Backend analogy:
- similar to holding state in memory and notifying dependent logic when it changes
- but built for UI updates

Why this feature exists:
- clear reactive state
- less boilerplate for simple component state
- aligns with current Angular direction

Why it was added:
- the starter app already uses a signal
- it introduces modern Angular state ideas in a small, safe way

### 5. Application Config Providers

Providers are how Angular registers shared capabilities.

Current example:

```ts
providers: [
  provideBrowserGlobalErrorListeners(),
  provideRouter(routes)
]
```

What this means:
- the app enables router support
- the app wires global browser error handling support

Backend analogy:
- similar to registering services or middleware during application startup

Why this feature exists:
- keeps setup centralized
- avoids hidden framework magic

Why it was added:
- it is the modern Angular way to register app-wide behavior

## Planned Concepts To Learn As The App Grows

These are not fully implemented yet, but they are likely to be added later.

### Angular Material

What it is:
- Angular's UI component library for buttons, forms, dialogs, tables, navigation, and more

Why it would be added:
- faster UI development
- consistent component behavior
- enterprise-relevant frontend experience

What to watch for:
- use Material where it helps
- do not let the UI become generic or crowded

### Feature-Based Folder Structure

What it is:
- grouping code by business feature such as `products`, `cart`, `checkout`

Why it would be added:
- easier scaling than one huge `components` folder
- closer to how larger applications stay maintainable

Backend analogy:
- similar to organizing backend code by domain instead of putting everything in one shared utilities area

### Services

What they are:
- classes that hold shared logic or data-access behavior

Why they would be added:
- keeps components focused on displaying data and handling UI events
- separates business logic from templates

### Reactive Forms

What they are:
- Angular's structured way to manage form state and validation

Why they would be added:
- checkout, login, profile, and search filters all benefit from structured forms

## Why This Project Direction Makes Sense

This project is trying to balance two goals:
- learn Angular in a practical way
- build something that resembles a real professional frontend codebase

That is why the project should:
- use modern Angular conventions
- stay readable
- avoid large-framework complexity too early
- introduce architecture gradually as real features appear

## Journal Update Template

When a new feature is added later, record it like this:

### Feature: Example Name

What was added:
- short plain-English summary

Why it was added:
- practical reason in the app

Angular concept behind it:
- routing, service, signal, form, Material component, guard, etc.

Simple example:

```ts
// tiny focused snippet
```

What I learned:
- 2 or 3 short bullets

## Current Takeaway

This app already uses a solid modern Angular foundation:
- standalone bootstrap
- provider-based app config
- router setup
- SCSS
- signal usage

That is enough to start cleanly without overengineering.

## Feature Update: Basic Application Shell

What was added:
- a header at the top of the app
- a responsive sidebar using Angular Material drawer navigation
- a footer at the bottom of the app
- a main content area connected to the Angular router
- a simple route-level placeholder page for shell content only

Why it was added:
- every larger frontend app needs a stable layout before real business pages are added
- it gives future product, cart, and checkout pages a place to render
- it introduces Angular Material navigation in a practical way
- it keeps the project enterprise-relevant without adding backend or feature complexity too early

### Standalone Components Explained Again

Simple idea:
- each component can declare what it needs by itself
- there is less hidden wiring than the older module-based style

Where this appears in this project:
- the root `App` component is standalone
- the route-level `ShellHomePage` component is standalone

Beginner-friendly example:

```ts
@Component({
  selector: 'app-shell-home-page',
  imports: [MatCardModule],
  templateUrl: './shell-home.page.html'
})
export class ShellHomePage {}
```

What to notice:
- `MatCardModule` is imported directly into the component
- the component does not need to be declared in an NgModule

Why this is useful:
- easier to trace dependencies
- easier to read one file at a time
- better fit for modern Angular projects

### Angular Material Usage Explained Simply

Angular Material is a ready-made UI component library for Angular.

In this shell, it is used for:
- `mat-toolbar` for the header
- `mat-drawer-container` and `mat-drawer` for the responsive sidebar
- `mat-nav-list` for navigation links
- `mat-card` for clean content blocks
- `mat-divider` for visual separation

Small example:

```html
<mat-drawer-container>
  <mat-drawer [mode]="isMobile() ? 'over' : 'side'">
    Sidebar content
  </mat-drawer>

  <mat-drawer-content>
    Main content
  </mat-drawer-content>
</mat-drawer-container>
```

What this means:
- Angular Material provides layout building blocks
- the sidebar can slide over the page on small screens
- the same structure can stay visible on larger screens

Why Angular Material was added here:
- navigation is a good early use case for Material
- it improves consistency without requiring lots of custom code
- it keeps the app closer to enterprise frontend practices

### Routing Basics Explained Simply

Routing means Angular decides which component should appear for a given URL path.

In this project, the shell stays in place and the routed page appears inside the main content area.

Small route example:

```ts
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/shell-home/shell-home.page').then((m) => m.ShellHomePage)
  }
];
```

What this means:
- `path: ''` is the default home route
- `loadComponent` tells Angular which standalone page to load
- the page is shown inside `<router-outlet />`

Template example:

```html
<main>
  <router-outlet />
</main>
```

Backend analogy:
- think of routing like mapping a URL to a handler
- but instead of returning server data directly, Angular displays a frontend component

Why routing was used even for a simple shell:
- it keeps the layout ready for future pages
- it teaches route-based composition early
- it avoids putting all future UI into one giant root component

### Responsive Sidebar Basics

The sidebar changes behavior based on screen size.

Simple idea:
- desktop: sidebar stays visible
- mobile: sidebar slides over the content

Small TypeScript example:

```ts
this.breakpointObserver.observe('(max-width: 768px)').subscribe(({ matches }) => {
  this.isMobile.set(matches);
  this.isSidebarOpen.set(!matches);
});
```

What this means:
- Angular watches the screen width
- when the screen is small, the app marks itself as mobile
- the sidebar mode changes based on that state

Why this feature was added:
- responsive layout is required for real frontend work
- it is easier to design responsiveness early than retrofit it later

## What I Learned From This Step

- a basic app shell is a structural feature, not a business feature
- standalone components stay readable even when Angular Material is added
- Angular routing becomes more useful when the main content area is separated from the layout shell
- Angular Material can be introduced gradually without making the app feel overbuilt

## Feature Update: Reusable Shared UI Components

What was added:
- a reusable loading spinner
- a reusable skeleton loader
- reusable button styling through a shared directive
- a reusable empty state component
- a reusable error state component
- a snackbar utility service
- a confirmation dialog component and service

Why it was added:
- future pages will need the same loading, feedback, and action patterns
- placing these pieces in `shared` avoids rebuilding them in every route page
- it keeps the project scalable without adding product logic yet

### Reusable Components Explained Simply

A reusable component is a UI building block you can use in many places.

Simple idea:
- write it once
- use it in multiple screens
- keep the design and behavior consistent

Examples from this project:
- `LoadingSpinnerComponent`
- `SkeletonLoaderComponent`
- `EmptyStateComponent`
- `ErrorStateComponent`

Small example:

```html
<app-empty-state
  title="No saved views yet"
  description="This reusable empty state can be shown anywhere data is missing."
></app-empty-state>
```

Why this is useful:
- route pages stay smaller
- repeated UI becomes consistent
- styling changes are easier later because one component can update many screens

### Dependency Injection Explained Simply

Dependency injection means Angular can give a class the tool or service it needs.

Instead of manually creating a service with `new`, Angular provides it.

Small example:

```ts
private readonly snackbarService = inject(SnackbarService);
```

What this means:
- the component needs snackbar behavior
- Angular creates or provides the service
- the component can use it without managing service creation itself

Backend analogy:
- similar to a framework giving a controller access to a registered service

Where this is used in the project:
- `ShellHomePage` injects the snackbar service
- `ShellHomePage` injects the confirmation dialog service
- shared services inject Angular Material services such as `MatSnackBar` and `MatDialog`

Why this matters:
- components stay focused on UI actions
- service logic can be reused across many screens
- shared behavior lives in one place

### Shared Architecture Explained Simply

The `shared` layer is for UI and utilities that are not owned by one business feature.

In this project, `shared` now contains:
- reusable UI components
- a button styling directive
- utility services for snackbar and confirmation dialog behavior

Simple mental model:

```text
pages use shared UI
shared UI stays generic
business features can adopt shared UI later
```

Why this structure helps:
- `pages` stay focused on screen composition
- `shared` holds repeatable UI patterns
- future `features` like products or cart can reuse the same building blocks

### Snackbar Utility Explained

The snackbar utility wraps Angular Material's snackbar service in a simpler project-level API.

Small example:

```ts
this.snackbarService.success('Saved successfully.');
```

Why this is helpful:
- components do not need to repeat snackbar configuration
- colors, duration, and position stay consistent
- the app gets one simple place to adjust feedback behavior later

### Confirmation Dialog Explained

A confirmation dialog is a reusable way to ask:
- should this action continue?
- or should the user cancel?

Small example:

```ts
this.confirmationDialogService.open({
  title: 'Confirm action',
  message: 'Do you want to continue?'
});
```

Why this is useful:
- future delete, reset, or submit actions can reuse the same pattern
- dialog wording and button structure stay consistent

## What I Learned From This Step

- shared components reduce duplication before feature pages grow
- dependency injection keeps components cleaner by moving repeated logic into services
- a `shared` folder is most useful when it contains real reused UI, not speculative code
- Angular Material can support reusable patterns beyond just page-level layout

## Feature Update: Backend Integration Foundation

What was added:
- environment configuration for backend URL and token storage key
- typed frontend models for auth, API responses, products, cart, wishlist, and orders
- a reusable API service layer
- auth service structure
- JWT interceptor structure
- error interceptor structure
- route guard structure for auth and admin access

Why it was added:
- the frontend needs a stable way to talk to the Spring Boot backend before real feature screens are built
- typed models make backend contracts easier to understand and safer to use
- interceptors and guards let shared auth behavior live in one place instead of every screen

### Services Explained Simply

A service is a class that holds reusable logic that should not live inside a component template.

In this project:
- `ApiService` handles generic HTTP requests
- `AuthService` handles login, signup, token state, and current user state
- `TokenStorageService` handles saving and reading the JWT

Small example:

```ts
login(request: LoginRequest): Observable<AuthResponse> {
  return this.apiService.post<AuthResponse, LoginRequest>('/auth/login', request);
}
```

Why this is useful:
- components stay focused on UI behavior
- backend logic is reused from one place
- changing API details later is easier

Spring Boot comparison:
- Angular services are similar to Spring `@Service` classes
- components are more like controllers/views combined at the UI level
- the service layer keeps business communication out of the screen code

### Interceptors Explained Simply

An interceptor is a shared place to inspect or modify every HTTP request or response.

Think of it like a filter around API calls.

In this project:
- the JWT interceptor adds `Authorization: Bearer <token>` to protected requests
- the error interceptor turns mixed backend errors into a more consistent frontend error shape

Small example idea:

```ts
provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor]))
```

What this means:
- every HTTP call goes through these interceptors
- you do not need to manually add the JWT header in every service
- error handling logic can stay centralized

Spring Boot comparison:
- Angular interceptors are similar to servlet filters or Spring security filters
- they sit around requests before the request reaches the main business code

### Observables Explained Simply

An observable is a value that arrives over time.

With HTTP calls, the value usually arrives once, later, after the backend responds.

Small example:

```ts
this.authService.login(request).subscribe((response) => {
  console.log(response.token);
});
```

What this means:
- the HTTP request starts
- the frontend waits for the backend response
- when the result arrives, the code inside `subscribe` runs

Simple mental model:
- method call returns a promise-like stream
- subscribe means "run this when the value arrives"

Spring Boot comparison:
- if you are used to synchronous service calls in Spring, observables feel more like asynchronous pipelines
- they are conceptually closer to `Mono` or `Flux` than to a plain Java method return
- for normal frontend HTTP, think of them like "async response containers"

### JWT Interceptor Explained

The JWT interceptor checks whether:
- a token exists
- the request is protected

If both are true, it adds the bearer token header automatically.

Why this is useful:
- avoids repeated header code in every API service
- keeps auth behavior consistent

Spring Boot comparison:
- this is similar in purpose to adding auth details in a client filter before requests reach secured backend endpoints

### Error Interceptor Explained

The backend reference shows that errors are not always returned in one consistent format.

Sometimes the backend returns:
- a wrapped JSON error
- a raw plain-text message
- a framework-level security error

The error interceptor helps by:
- reading the different backend shapes
- extracting one readable message
- turning `401` into a logout event

Why this matters:
- frontend screens can handle errors more consistently later
- backend inconsistency is hidden behind one shared frontend layer

### Shared Backend Foundation Architecture

The project now has a `core` layer for app-wide backend concerns.

Simple idea:
- `models` describe data
- `services` talk to the backend
- `interceptors` wrap requests and responses
- `guards` protect routes

Simple mental model:

```text
component -> service -> HttpClient -> interceptor -> backend
backend -> interceptor -> service -> component
```

Why this structure helps:
- route pages stay simpler
- backend communication is centralized
- auth behavior stays consistent across the app

### Environment Configuration Explained

Environment configuration stores app-wide values such as the backend base URL.

In this project it is used for:
- `apiBaseUrl`
- token storage key

Why this is useful:
- you can change backend hosts without rewriting many services
- local development and future deployment can use different settings

Spring Boot comparison:
- this is similar to using `application.yml` or `application.properties` for shared configuration values

## What I Learned From This Step

- a backend foundation can be added before business screens exist
- Angular services play a role similar to Spring services, but for frontend communication and state
- interceptors are a clean place for repeated HTTP behavior such as auth headers and error shaping
- observables are easier to understand when treated as asynchronous response streams

## Feature Update: Semantic Design System Colors

What was improved:
- primary buttons now use the main brand color more consistently
- secondary buttons use a clearer neutral outlined treatment
- tonal buttons use a softer muted brand tint
- danger buttons use a more clearly destructive red-brown tone
- snackbars now have consistent success, error, warning, and info variants

Why it was improved:
- semantic colors should communicate meaning, not just decoration
- shared UI patterns become easier to trust when the same meaning uses the same color language
- the app keeps its warm e-commerce aesthetic while becoming more consistent

### Angular Material Theming Explained Simply

Angular Material has its own theme system for colors, typography, and component behavior.

In this project:
- Material provides the base component structure
- shared SCSS adds project-specific semantic meaning on top

Simple idea:
- Material gives the starting design system
- project styles refine it for this app's brand and semantics

Small example:

```scss
@include mat.theme(
  (
    color: (
      primary: mat.$orange-palette,
      tertiary: mat.$blue-palette,
    )
  )
);
```

What this means:
- Angular Material gets a base color setup
- buttons, snackbars, and surfaces can then be adjusted with reusable app styles

Why this is useful:
- you do not style every component from scratch
- Material stays consistent
- app-level semantic styling can still reflect the brand

### Reusable Styling Concepts Explained Simply

Reusable styling means defining a style once and applying it in many places.

In this project, semantic styling now works like this:
- `primary` means main action
- `secondary` means supporting neutral action
- `tonal` means softer low-emphasis action
- `danger` means destructive action

For snackbars:
- `success` means a positive result
- `warning` means caution
- `error` means failure
- `info` means neutral message

Why this matters:
- users learn what colors mean
- new screens can reuse the same visual rules
- the UI feels more intentional and less random

### Semantic Colors Explained Simply

Semantic color means a color is chosen for meaning, not only for appearance.

Examples:
- primary button: "this is the main action"
- danger button: "this action can remove, delete, or cause loss"
- success snackbar: "something completed correctly"

That is better than choosing one-off colors every time because:
- meaning stays consistent
- accessibility review is easier
- future feature teams can reuse the same rules

## What I Learned From This Step

- a design system becomes stronger when color meaning is standardized
- Angular Material theming works well as a base layer, while shared SCSS handles app-specific semantics
- reusable styling is not just about saving time; it also improves consistency and clarity

## Feature Update: Scalable Feature Routing Structure

What was added:
- placeholder feature routes for home, products, product details, cart, checkout, orders, and profile
- lazy-loaded route files for each feature area
- standalone route components inside `features`
- sidebar navigation links for the new feature routes

Why it was added:
- the app needs route structure before real product and account screens are implemented
- feature-level routing keeps the app organized as more screens are added
- lazy loading helps keep the initial app smaller and cleaner

### Angular Routing Explained Simply

Angular routing decides which component appears for a given URL.

Simple idea:
- `/` shows the home route
- `/products` shows the products route
- `/products/42` shows the product details route for item `42`

Small example:

```ts
{
  path: 'products',
  loadChildren: () =>
    import('./features/products/products.routes').then((m) => m.PRODUCTS_ROUTES)
}
```

What this means:
- when the user visits `/products`
- Angular loads the products route configuration
- then Angular loads the correct standalone page component

Why this is useful:
- route structure stays centralized
- features can grow without making `app.routes.ts` too large

### Lazy Loading Explained Simply

Lazy loading means Angular does not load every feature page immediately on first app load.

Instead:
- it loads a feature only when that route is visited

Simple example:

```ts
loadChildren: () =>
  import('./features/checkout/checkout.routes').then((m) => m.CHECKOUT_ROUTES)
```

What this means:
- the checkout route files are not loaded until the user opens checkout
- the first app load stays lighter

Why this is useful:
- faster startup
- clearer feature separation
- closer to how real apps scale

### Standalone Route Components Explained Again

Each route page is still a standalone component.

That means:
- each page imports what it needs
- each page can be lazy loaded directly
- no large route NgModule is needed

Small example:

```ts
@Component({
  selector: 'app-products-page',
  imports: [RoutePlaceholderComponent],
  template: `...`
})
export class ProductsPage {}
```

Why this helps:
- each route is easier to read in isolation
- feature folders stay small and explicit

### Feature Route Organization Explained

The app now organizes routes by feature:
- `features/home`
- `features/products`
- `features/cart`
- `features/checkout`
- `features/orders`
- `features/profile`

The products feature also contains the product details route.

Why this structure is useful:
- related routes stay together
- future product-specific UI can live near product routes
- route growth follows business language instead of one large generic pages folder

### Backend Comparison: Routing and Controllers

If you are used to backend controller organization, think of Angular routes like frontend controller entry points.

Simple comparison:
- Angular route path: `/products`
- backend controller path: `/api/products`

Angular route purpose:
- decide which screen to show

Backend controller purpose:
- decide which server handler should process the request

Product details comparison:
- Angular route: `/products/:id`
- backend endpoint: `/api/products/{id}`

That is not the same layer, but the structure feels similar:
- path-based organization
- one area for listing
- one area for details

### Responsive Routing Behavior Explained

The app shell already supports mobile behavior through the sidebar.

With the new route links:
- desktop keeps the sidebar visible
- mobile closes the sidebar after navigation click

Why this matters:
- routing should feel natural on both large and small screens
- navigation behavior is part of route usability, not just route definitions

## What I Learned From This Step

- feature routing is easier to manage when each feature owns its own route file
- lazy loading keeps route growth cleaner and more scalable
- Angular route structure can feel familiar to a backend developer because it mirrors path-based organization

## Feature Update: Reusable E-commerce Product UI Components

What was added:
- product card
- product grid
- product badge
- product price display
- product image placeholder
- product rating display
- product category chip
- product skeleton loading state

Why it was added:
- product UI is one of the most repeated patterns in an e-commerce app
- building these as shared components keeps future category pages, search pages, and featured sections consistent
- the products route can now look like a real storefront using only mock data

### Reusable Component Architecture Explained Simply

Reusable component architecture means breaking a larger UI into smaller parts that each do one clear job.

In this project:
- `ProductCardComponent` is the main product display block
- `ProductGridComponent` arranges multiple cards
- smaller components handle pieces inside the card such as rating, price, badge, category, and image placeholder

Simple idea:
- one big screen becomes many small reusable parts
- each part stays easier to understand and reuse

Why this helps:
- the products page stays readable
- the same product card can later be used on home, category, search, and wishlist screens

### `@Input` Explained Simply

`@Input` lets a parent component pass data into a child component.

Small example:

```ts
@Input() label = 'Featured';
```

What this means:
- the component has a default value
- a parent can replace that value when using the component

Template example:

```html
<app-product-badge [label]="product.badge" />
```

Why this is useful:
- the badge component stays reusable
- different cards can show different labels without changing the badge component code

### Component Composition Explained Simply

Component composition means building one component by combining other smaller components.

In this project:
- `ProductCardComponent` composes:
  - `ProductBadgeComponent`
  - `ProductCategoryChipComponent`
  - `ProductImagePlaceholderComponent`
  - `ProductPriceDisplayComponent`
  - `ProductRatingDisplayComponent`

Simple mental model:

```text
product grid
  -> product card
    -> badge
    -> category chip
    -> image placeholder
    -> rating
    -> price
```

Why this matters:
- each piece stays focused
- visual consistency becomes easier
- updates to one piece can improve many screens

### Product Grid Explained

The product grid is the layout component that arranges many product cards.

Why it exists:
- product card logic should not also manage the full responsive layout
- the grid can decide how cards respond on desktop, tablet, and mobile

Small idea:
- card = one product
- grid = many products arranged together

### Product Skeleton Loading Explained

The product skeleton loading component is a placeholder version of the grid.

Why it exists:
- in real apps, products take time to load
- a skeleton shows the page structure before the data arrives

This improves perceived polish because:
- the screen looks intentional
- layout does not suddenly jump from empty to full

## What I Learned From This Step

- reusable product UI is easier to scale when the card is composed from smaller pieces
- `@Input` is one of the simplest ways to make components flexible without making them complex
- component composition keeps the code beginner-readable while still feeling enterprise-relevant

## Feature Update: Scalable Environment Configuration

What was added:
- explicit development environment
- explicit production environment
- a typed environment shape
- centralized app constants
- reusable API endpoint constants

Why it was added:
- configuration should live in one predictable place
- services should not depend on scattered hardcoded strings
- this makes the project feel closer to a real enterprise frontend while staying easy to follow

### Angular Environments Explained Simply

Angular environments are files that hold configuration values for different runtime situations.

In this project:
- development uses a local backend URL
- production uses a production-style backend URL placeholder

Simple idea:
- development config for local work
- production config for deployed app behavior

Small example:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080'
};
```

What this means:
- the app can read config values from one place
- the same code can behave differently depending on which environment file Angular builds with

### Comparison With Spring Boot `application.yml`

If you come from Spring Boot, Angular environment files are similar in purpose to `application.yml` or `application.properties`.

Simple comparison:
- Angular `environment.development.ts` is like a dev profile config
- Angular `environment.production.ts` is like a production profile config

They are not identical, but they solve a similar problem:
- keeping environment-specific values outside of normal business logic

### Why Centralized Config Matters

Centralized config means:
- backend base URLs live in one place
- token storage keys live in one place
- shared app constants live in one place
- API paths live in one place

Why this is useful:
- fewer magic strings
- easier updates later
- less risk of mismatched endpoint paths
- better readability for new developers

For example:
- if the backend host changes, you update config instead of hunting through many services
- if an endpoint path changes, one constants file can update multiple future services

### App Constants Explained

App constants are shared values that are not tied to one component.

Examples in this project:
- app name
- default currency code
- request timeout placeholder value

Why they help:
- they reduce repeated literals
- they keep shared values named clearly

### Endpoint Constants Explained

Endpoint constants store backend route paths in one reusable structure.

Small example:

```ts
API_ENDPOINTS.auth.login
```

What this means:
- services can reference a named endpoint instead of writing `'/auth/login'` everywhere

This is helpful because:
- naming becomes clearer
- duplication goes down
- future backend changes are easier to manage

### Beginner-Friendly Architecture Takeaway

The important pattern is:

```text
environment = where the backend lives
constants = shared app values
endpoint constants = backend route paths
services = code that uses those values
```

That separation keeps the app easier to understand.

## What I Learned From This Step

- environment files are the frontend version of profile-based app config
- centralized config makes service code cleaner and less fragile
- endpoint constants are a simple way to keep backend integration readable without overengineering

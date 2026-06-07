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

## Feature Update: Reusable API Infrastructure

What was added:
- a reusable `HttpWrapperService` around Angular `HttpClient`
- a centralized `ApiService` for shared request behavior
- typed API request and response models
- a shared loading state service
- reusable API error utilities
- mock placeholder feature API services for products, cart, wishlist, and orders

Why it was added:
- backend-facing code should grow in one predictable structure
- screens should not need to know request timing, base URLs, or error parsing details
- we still are not calling the real backend yet, so mock methods let the architecture grow safely first

### Angular Services Explained Simply

An Angular service is a class for reusable logic that should not live inside a component.

In this project:
- `HttpWrapperService` handles low-level HTTP concerns
- `ApiService` handles shared request behavior and mock request helpers
- `ProductsApiService`, `CartApiService`, `OrdersApiService`, and `WishlistApiService` represent feature-focused API access
- `ApiLoadingService` tracks whether API work is currently running

Simple idea:
- component = shows UI
- service = does reusable work

Why this helps:
- components stay smaller
- API logic stays in one place
- feature code becomes easier to test and replace later

### Dependency Injection Explained Again

Dependency injection means Angular provides a class with the tools it needs.

Small example:

```ts
private readonly apiService = inject(ApiService);
```

What this means:
- the class needs `ApiService`
- Angular creates or reuses the service instance
- the class can use it right away

Why this is useful:
- no manual `new ApiService(...)`
- shared services can be reused from many places
- wiring stays consistent across the app

Spring Boot comparison:
- this is similar to constructor injection with Spring-managed beans
- Angular services are frontend framework-managed objects in the same spirit

### `HttpClient` Explained Simply

`HttpClient` is Angular's built-in tool for making HTTP requests.

Small example:

```ts
return this.http.get<ProductDetail>('/api/products/1');
```

What this means:
- Angular sends a GET request
- the expected response shape is `ProductDetail`
- the result comes back as an observable

In this project, `HttpClient` is wrapped by `HttpWrapperService` so that:
- base URL handling stays in one place
- query param building stays in one place
- timeout behavior stays in one place

That keeps feature services cleaner.

### Why We Added a Wrapper Service

`HttpWrapperService` is not extra complexity for its own sake.

It exists because low-level concerns repeat:
- base URL joining
- query parameter creation
- timeout setup

By placing those in one service:
- `ApiService` can stay focused on request flow
- feature API services can stay focused on business resource shapes

### Centralized API Service Layer Explained

The centralized API layer in this project now looks like this:

```text
feature component
  -> feature API service
  -> ApiService
  -> HttpWrapperService
  -> HttpClient
```

Simple meaning:
- feature service knows what resource it wants
- `ApiService` knows shared request behavior
- `HttpWrapperService` knows low-level HTTP details

This is scalable, but still readable because each class has one main job.

### Mock Placeholder Methods Explained

We are still not calling the real backend.

So the feature API services currently return mock observables such as:
- mock product list
- mock product detail
- mock cart
- mock wishlist
- mock orders

Why this is useful:
- frontend architecture can be built before backend integration is turned on
- future screens can start using typed services without waiting for live APIs
- switching later is easier because the service contracts already exist

### Loading State Handling Explained

The `ApiLoadingService` tracks how many requests are active.

Simple idea:
- request starts
- loading count increases
- request ends
- loading count decreases

That gives the app one reusable place to answer:
- "Is any API work running right now?"

This is helpful for:
- global loading indicators
- page loading states
- disabling actions during requests

### Reusable Error Handling Explained

Backend errors are rarely perfectly consistent.

That is why `api-error.util.ts` was added.

Its job is to:
- normalize different error shapes
- return a readable frontend error message
- keep interceptor and service code simpler

This matters because:
- screens should not repeat error parsing logic
- backend inconsistencies should be handled centrally

### Observable Mental Model for API Calls

API calls return observables because the data arrives later.

Small example:

```ts
this.productsApiService.getProducts().subscribe((page) => {
  console.log(page.content);
});
```

Simple meaning:
- ask for data now
- receive it when the async work finishes

For mock methods, the same observable shape is used.
That is good because:
- real and mock APIs can look the same to the rest of the app
- switching from mock to live backend later causes less change

### Spring Boot Comparison

A useful comparison is:

```text
Angular component -> similar to UI controller/view layer
Angular service -> similar to Spring service bean
HttpClient call -> similar to a REST client call
interceptor -> similar to servlet filter or client interceptor
```

The layers are not identical, but the separation idea is familiar:
- UI layer should not contain transport details
- service layer should centralize reusable communication logic

## What I Learned From This Step

- Angular services are easiest to understand when each one has a single responsibility
- dependency injection in Angular plays a similar role to Spring bean injection
- `HttpClient` is powerful on its own, but a small wrapper makes larger apps easier to maintain
- mock API methods are useful when building structure before turning on real backend calls

## Feature Update: Mock Product Service Integration

What was added:
- a stronger reusable product model
- a mock product service using in-memory data
- a product listing page that now consumes service data
- a product details placeholder page that also consumes service data
- loading and error state handling on both product routes

Why it was added:
- the products page should learn to receive async data instead of owning hardcoded arrays
- product route pages should stay focused on UI while the service layer owns data retrieval
- this keeps the code ready for future backend integration without turning on real APIs yet

### Observables Explained Simply

An observable is a stream that gives you a value later.

For product loading, that means:
- ask the service for products now
- receive the products after the async work finishes

Small example:

```ts
this.productsApiService.getProducts().subscribe((products) => {
  console.log(products);
});
```

What this means:
- the page starts a request
- Angular waits for the observable to emit data
- when the data arrives, the code inside `subscribe` runs

Simple mental model:
- observable = "data will arrive later"

### Async Data Flow Explained

The product flow in this project now looks like this:

```text
component asks service for products
service returns an observable
component shows loading state
observable emits data or error
component updates the UI
```

That is the basic frontend async pattern.

Why this matters:
- frontend pages often start empty
- data arrives after a service call
- the UI needs to react to loading, success, or failure

### Component-Service Interaction Explained

The components do not create their own product data anymore.

Instead:
- `ProductsPage` asks `ProductsApiService` for a list
- `ProductDetailsPage` asks `ProductsApiService` for one product by id
- the service returns observables
- the component updates its local page state

Small example:

```ts
this.productsApiService.getProductDetail(routeId).subscribe({
  next: (productDetail) => {
    this.productState.set({
      data: productDetail,
      error: null,
      loading: false
    });
  }
});
```

What this means:
- service owns the data lookup
- component owns the screen state
- each layer has one clear job

### Why The Mock Product Service Is Useful

The mock product service uses in-memory data only.

That is useful because:
- we can practice the real data flow now
- we do not depend on backend availability
- the same page structure can later switch to live API calls with less rewriting

In this project, the mock service now handles:
- product list data
- product detail data
- "not found" errors for invalid product ids

### Loading State Integration Explained

The products page and product details page now both use a simple request state shape:
- `loading`
- `data`
- `error`

That gives each page a predictable flow:
- loading = show spinner or skeleton
- error = show error state
- data = show content

This is easier to read than mixing all conditions across many variables.

### Error State Integration Explained

Error handling is now visible in the product routes.

Examples:
- if the product list request fails later, the products page can show a retry state
- if a product id does not exist, the details page shows a clear error message

Why this is important:
- real apps must handle failure paths, not just happy paths
- users need feedback instead of blank screens

### Product Models Explained

The reusable product model now carries the fields both routes need:
- identity
- brand
- category
- price
- rating
- review count
- image label
- optional badge

Why this helps:
- the service and pages speak the same data language
- product UI mapping stays clearer
- future product screens can reuse the same model structure

### Beginner-Friendly Takeaway

The key idea is:

```text
service returns observable data
component listens to the observable
component decides what to render
```

That is one of the most common Angular patterns you will use.

## What I Learned From This Step

- observables become easier to understand when viewed as "data that arrives later"
- component-service interaction works best when services own data retrieval and components own UI state
- loading and error states are part of normal async UI design, not optional extras

## Feature Update: Authentication Foundation Structure

What was added:
- a clearer mock auth service flow
- stronger token storage utility support
- route guard integration for protected areas
- login state handling signals
- session restore structure on app startup
- auth interceptor structure for bearer token injection

Why it was added:
- authentication is a cross-app concern and should not be improvised inside pages later
- the project needs a clean mock auth flow before real backend login is enabled
- protected routes such as checkout, orders, and profile should already have guard structure

### Auth Flow Step-by-Step

The auth flow in this project now works like this:

1. The app starts.
2. Auth initialization runs once during startup.
3. `AuthService` checks local storage for a saved token.
4. If the token is missing, the app starts unauthenticated.
5. If the token exists and is still valid, the session is restored.
6. When login is called, mock credentials are validated.
7. A mock JWT token is created and stored.
8. The current user is derived from the token.
9. Protected routes can now pass their guard checks.
10. The auth interceptor can attach the bearer token to protected requests later.

That is the same shape a real backend auth flow would use, but with mock data for now.

### Route Guards Explained Simply

A route guard decides whether the user is allowed to enter a route.

Simple idea:
- user has session -> allow navigation
- user has no session -> redirect somewhere safe

Small example:

```ts
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  if (authService.isAuthenticated()) {
    return true;
  }

  return inject(Router).createUrlTree(['/']);
};
```

What this means:
- Angular checks the guard before opening the page
- the guard asks the auth service if the user is logged in
- the route is allowed or blocked

Where this is used now:
- checkout
- orders
- profile

### Interceptors Explained Again

An interceptor is a shared place that can inspect or change every HTTP request.

In this project, the auth interceptor:
- skips public requests
- adds `Authorization: Bearer <token>` to protected ones

Why this is useful:
- page and feature services do not repeat header logic
- auth behavior stays centralized

### Spring Boot Filter Comparison

If you come from Spring Boot, Angular interceptors feel very similar to filters.

Simple comparison:
- Angular interceptor wraps frontend HTTP requests
- Spring Boot filter wraps backend HTTP requests

Shared idea:
- both run around request processing
- both can add auth-related behavior
- both help keep repeated logic out of controllers or services

Difference:
- Angular interceptors run in the browser client
- Spring filters run on the server

### Login State Handling Explained

The auth service now tracks more than just the token.

It also tracks:
- whether auth work is loading
- whether startup restore is complete
- whether an auth error message exists

That is helpful because:
- the app can know when auth is still being restored
- future login forms can show loading or error feedback
- auth state stays centralized instead of scattered

### Session Persistence Explained

Session persistence means the app remembers a logged-in user after refresh.

In this project:
- the token is stored in local storage
- app startup runs `restoreSession()`
- expired tokens are cleared
- valid tokens rebuild the current user from the token payload

Why this matters:
- refreshing the browser should not automatically lose the session
- auth startup behavior becomes predictable

### Token Storage Utility Explained

`TokenStorageService` is intentionally small.

Its job is:
- save token
- read token
- clear token
- answer whether a token exists

Why keep it small:
- storage details stay separate from auth business logic
- `AuthService` can focus on session behavior instead of browser storage mechanics

### Beginner-Friendly Auth Architecture

The auth structure now looks like this:

```text
route/page
  -> AuthService
  -> TokenStorageService
  -> local storage

HttpClient request
  -> auth interceptor
  -> bearer token added when needed
```

And for protected navigation:

```text
route
  -> auth guard
  -> AuthService
  -> allow or block
```

That separation keeps each piece easier to understand.

## What I Learned From This Step

- route guards are the frontend equivalent of navigation protection checks
- interceptors are a clean place for shared auth request behavior
- session persistence is mostly about restoring and validating stored auth state at startup

## Feature Update: Backend Connectivity Verification

What was added:
- a small backend status service
- a live backend connectivity check using a safe public GET endpoint
- a compact dashboard card on the home page for connection status

Why it was added:
- it gives the frontend a quick way to verify whether the backend is reachable
- it helps separate "frontend bug" from "backend unavailable" during development
- it introduces a real `HttpClient` request flow without needing a business screen

### HttpClient Flow Explained Simply

`HttpClient` is Angular's built-in way to send HTTP requests.

In this feature, the flow is:

```text
HomePage
  -> BackendStatusService
  -> ApiService
  -> HttpWrapperService
  -> HttpClient
  -> backend endpoint
```

What this means:
- the page does not call the backend directly
- the service asks the shared API layer to make the request
- `HttpClient` sends the GET request in the browser

In this project, the connectivity check uses the public products endpoint as a safe probe.

### Observable Subscription Flow Explained

The page starts in a loading state, subscribes to the observable, and then updates the UI when a result arrives.

Small example:

```ts
this.backendStatusService.checkConnection().subscribe({
  next: (status) => {
    this.backendStatus.set({
      data: status,
      error: null,
      loading: false
    });
  },
  error: (error) => {
    this.backendStatus.set({
      data: null,
      error: error.message,
      loading: false
    });
  }
});
```

What this means:
- `subscribe` starts listening to the request result
- `next` runs when the backend responds successfully
- `error` runs when the request fails

That is why the card can show:
- loading
- connected
- failed

### Connected, Loading, Failed States Explained

This feature uses the same simple page-state shape used elsewhere:
- `loading`
- `data`
- `error`

That makes the UI easy to reason about:
- while loading, show the shared loading spinner
- when connected, show the green status card
- when failed, show the shared error state with retry

### Spring Boot Comparison: RestTemplate and WebClient

If you come from Spring Boot, `HttpClient` is conceptually similar to calling another service with `RestTemplate` or `WebClient`.

Simple comparison:
- Angular `HttpClient` sends requests from the browser client
- Spring `RestTemplate` or `WebClient` sends requests from the server

Mental model:
- Angular `HttpClient` + observable flow feels closer to `WebClient`
- both are async-friendly and stream-oriented

Difference:
- `HttpClient` runs in the frontend runtime
- `RestTemplate` and `WebClient` run in backend code

### Why The Service Layer Still Matters Here

Even though this is only one small status call, the page still uses a dedicated service.

Why:
- UI stays focused on rendering
- request details stay out of the component
- the connectivity check can be reused later if needed

## What I Learned From This Step

- `HttpClient` is easier to understand when you follow the request path from component to service to backend
- observable subscriptions power the loading, success, and failure UI flow
- small verification features are a practical way to test real backend connectivity without building a full business page

## Feature Update: Real Backend Authentication

What was changed:
- mock login was replaced with the real backend login API
- signup now uses the real backend signup API
- current-user refresh now uses the real `/auth/me` endpoint
- JWT storage, auth interceptor, guards, and logout flow were kept and connected to the live backend flow

Why it was changed:
- the authentication foundation was ready, but it was still using mock data
- the backend contract already exists for login, signup, and current-user lookup
- moving to real auth makes the route guards and interceptor meaningful in real usage

### JWT Flow Explained Simply

The JWT flow in this project now works like this:

1. The frontend sends `POST /auth/login` with `usernameOrEmail` and `password`.
2. The backend responds with a token.
3. The auth service stores that token in local storage.
4. The auth service keeps the token in Angular state too.
5. Protected requests automatically receive `Authorization: Bearer <token>`.
6. On refresh, the app reads the saved token and restores the session.
7. The app calls `/auth/me` to refresh current user information.
8. If the backend rejects the token with `401`, the app logs out.

That is the basic end-to-end JWT lifecycle on the frontend.

### Interceptor Execution Flow Explained

Interceptor flow means every outgoing request passes through shared request handlers before it leaves the app.

In this project, the request path is:

```text
component or service
  -> HttpClient
  -> JWT interceptor
  -> error interceptor
  -> backend
```

And the response path comes back through the interceptors too.

What the JWT interceptor does:
- checks whether the request is public
- checks whether a token exists
- adds the bearer token header for protected requests

What the error interceptor does:
- watches for backend errors
- normalizes them into a cleaner app error shape
- logs the user out on `401`

### Spring Security Filter Chain Comparison

If you come from Spring Boot, Angular interceptors are very similar in purpose to the Spring Security filter chain.

Simple comparison:
- Angular interceptor runs in the browser before the request reaches the backend
- Spring Security filter runs on the server before the request reaches the controller

Shared idea:
- both can inspect requests
- both can add or validate auth behavior
- both keep repeated auth logic out of normal business code

Difference:
- Angular interceptor adds the token to the outgoing request
- Spring Security filters validate the token after it arrives on the backend

### Real Login Flow Explained

The login method now does real backend work instead of returning a mock response.

Simple idea:
- call `/auth/login`
- store the returned token
- call `/auth/me`
- update the current user

Why that second call matters:
- the login response only contains token information
- `/auth/me` gives the frontend the actual current user data such as username, email, and role

### Session Restoration On Refresh

Session restoration now works with the real backend structure too.

The app startup flow is:
- read token from storage
- check whether it looks expired
- restore token into app state
- call `/auth/me` to refresh the current user

Why this helps:
- refresh does not immediately lose auth state
- user data stays closer to backend truth

### Loading and Error Handling In Auth

The auth service already had loading and error state signals, and they now wrap real backend calls.

That means:
- login can show loading state
- signup can show loading state
- backend auth failures can surface readable error messages

This is important because real auth APIs fail for real reasons:
- bad credentials
- duplicate signup values
- expired tokens
- backend unavailable

### Beginner-Friendly Takeaway

The main pattern is:

```text
auth service calls backend
backend returns token
token is stored
interceptor reuses token
guards use auth state
```

That is the core frontend authentication loop.

## What I Learned From This Step

- JWT auth becomes easier to follow when broken into login, storage, interceptor, guard, and restore steps
- Angular interceptors play a role similar to Spring Security filters, but on the client side
- real backend auth mainly changes the data source, while the surrounding auth architecture can stay mostly the same

## Feature Update: Complete Authentication Feature

What was added:
- a real login page at `/login`
- reactive form validation for username/email and password
- redirect-aware route guard behavior
- login and logout navigation entry points
- loading and error handling in the login UI
- profile/logout menu visibility based on session state

Why it was added:
- the auth infrastructure was not complete until users could actually reach and test it in the browser
- protected routes need a visible login path and a clear return flow after authentication
- enterprise-style frontend auth is not only services and interceptors; it also includes usable navigation and screen feedback

### Authentication Flow Step-by-Step

The full authentication flow now works like this:

1. A logged-out user clicks the login menu item or gets redirected from a protected route.
2. Angular opens `/login`.
3. The login page shows a reactive form with validation.
4. The user submits `usernameOrEmail` and `password`.
5. `AuthService.login()` calls the real backend login API.
6. The backend returns a JWT token.
7. The token is stored in local storage and also kept in Angular auth state.
8. The auth service calls `/auth/me` to load the current user.
9. The user is redirected to the protected page they originally wanted, or to `/profile`.
10. Future protected API requests receive the token from the interceptor.
11. On refresh, the app restores the saved session.
12. On logout, the token and current user state are cleared.

That is now a complete end-to-end frontend authentication loop.

### Reactive Forms Explained Simply

Reactive forms are Angular's structured way to manage form values and validation in TypeScript.

Small example:

```ts
protected readonly loginForm = this.formBuilder.nonNullable.group({
  usernameOrEmail: ['', [Validators.required]],
  password: ['', [Validators.required, Validators.minLength(6)]]
});
```

What this means:
- the form shape is defined in code
- validation rules live in the component
- Angular tracks whether fields are valid, touched, or invalid

Why this is useful:
- login validation stays predictable
- templates stay cleaner
- it scales better than manually checking input values

### Route Guards Explained Again

The route guard now does two important jobs:
- block unauthenticated access
- remember the route the user originally wanted

Small idea:

```ts
return router.createUrlTree(['/login'], {
  queryParams: { redirectTo: state.url }
});
```

What this means:
- if the user tries to open `/checkout`
- the app redirects to `/login?redirectTo=/checkout`
- after successful login, the app can send them back

This creates a more complete user experience than redirecting everyone to the home page.

### Interceptors Explained Again

The auth interceptor runs before protected HTTP requests leave the frontend.

Its job:
- look for a saved token
- skip public requests like login and product listing
- add `Authorization: Bearer <token>` to protected ones

The error interceptor runs on the way back and handles shared backend error behavior.

This is why services like cart, orders, or profile do not need to manually add auth headers.

### Spring Boot Filter Comparison

The Angular interceptor pattern is very close to Spring Boot filters in purpose.

Simple comparison:
- Angular interceptor: runs in the browser before requests leave the frontend
- Spring Security filter: runs on the backend before the request reaches the controller

Shared idea:
- both apply cross-cutting request logic
- both keep auth-related code out of normal feature handlers

Difference:
- Angular adds the token
- Spring Security validates the token

### Login UI Architecture Explained

The login feature now follows the same layered structure as the rest of the app:

```text
login page
  -> AuthService
  -> ApiService / HttpClient
  -> backend
```

And for navigation:

```text
protected route
  -> auth guard
  -> /login redirect
  -> successful login
  -> redirect back
```

Why this matters:
- the UI stays focused on rendering and form state
- the service stays focused on auth communication and session state
- the shell stays focused on navigation visibility

### Loading and Error States In The Login Screen

The login page now handles two important states:

- loading:
  - disable the submit button
  - show a progress spinner
- error:
  - show the backend error message
  - keep the form on screen for correction

That makes the screen usable in real backend conditions such as:
- wrong password
- bad username/email
- backend not reachable

## What I Learned From This Step

- a feature is only complete when services, routing, UI, and navigation all work together
- reactive forms make login validation easier to manage than manual input checks
- redirect-aware guards create a much better authentication experience than simple route blocking

## Feature Update: Dedicated Authentication Experience

What was added:
- dedicated login and signup pages
- a route-aware shell that gives `/login` and `/signup` their own cleaner layout
- header navigation that shows login and signup when logged out, and logout when authenticated
- remember-me session choice on login
- stronger validation and error feedback across both auth pages

Why it was added:
- the earlier login flow worked, but it still felt like a form placed inside the normal app shell
- real e-commerce apps usually give authentication its own focused screen experience
- dedicated auth pages improve first impression, clarity, and mobile usability

### Why The Earlier Login Experience Felt Basic

The earlier implementation already had the important backend pieces:
- auth service
- JWT storage
- interceptor
- guard
- login form

But the UX still felt basic because:
- the auth screens lived too closely inside the regular application shell
- signup did not feel as complete as login
- the visual hierarchy did not clearly say "this is a dedicated account experience"
- the header and navigation did not guide unauthenticated users strongly enough

The new version fixes that by separating the authentication experience from the normal shopping shell while still reusing the same auth service and guard structure.

### Reactive Forms Explained Simply

Reactive forms let Angular manage form values and validation in TypeScript instead of scattering checks around the template.

Small example:

```ts
protected readonly loginForm = this.formBuilder.nonNullable.group({
  usernameOrEmail: ['', [Validators.required]],
  password: ['', [Validators.required, Validators.minLength(6)]],
  rememberMe: [true]
});
```

What this means:
- the form structure is defined in one place
- validators are attached to each field
- Angular tracks whether each field is valid, touched, or invalid

Why this is useful:
- easier to read than manual DOM checks
- easier to test and grow
- works well for login, signup, checkout, and profile forms

Backend comparison:
- think of it like defining request validation rules close to a DTO or request object, but for frontend input state

### Form Validation Explained Simply

Form validation is how the UI checks input before sending it to the backend.

In the signup page, we validate:
- full name is required
- email is required and must look like an email
- password is required and must be long enough
- confirm password must match password

Small custom validator example:

```ts
function confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword ? null : { passwordMismatch: true };
}
```

What this means:
- Angular checks the whole form group
- the validator compares two related fields
- the template can show a friendly message when they do not match

Why this matters:
- users get feedback earlier
- fewer bad requests reach the backend
- the app feels more polished and trustworthy

### Authentication Routing Explained

Authentication routing means the app uses routes to guide people into login and signup flows correctly.

In this project:
- `/login` opens the sign-in page
- `/signup` opens the registration page
- protected routes use guards
- unauthenticated users are redirected to login
- after successful login, the app sends them back to the route they originally wanted

Simple flow:

```text
protected page
  -> auth guard
  -> /login?redirectTo=/checkout
  -> successful login
  -> navigate back to /checkout
```

Why this feels better:
- users do not lose context
- protected flows such as checkout feel intentional
- auth works like part of the app, not like a disconnected popup

### Dedicated Auth Page Architecture

The auth UX now has two layers:

```text
route-aware shell
  -> chooses auth layout or normal app layout

login/signup pages
  -> own the form UI and validation
  -> reuse AuthService for real backend communication
```

Why this is a good middle ground:
- more professional than putting every screen inside one identical shell
- simpler than building a large separate auth module with too much abstraction
- still easy for a beginner to trace

### Session Persistence And Remember Me

The login form now includes a remember-me checkbox.

Simple idea:
- checked: store token in `localStorage`
- unchecked: store token in `sessionStorage`

Why this is useful:
- users can choose whether the browser should remember them after it closes
- the auth service does not need to know storage details directly
- `TokenStorageService` stays responsible for browser storage behavior

### Beginner-Friendly Takeaway

The full auth experience now works like this:

1. User opens `/login` or `/signup`.
2. Angular shows a dedicated auth layout.
3. Reactive form validation checks the input.
4. The auth service calls the backend.
5. On login, the JWT is stored.
6. Guards and interceptors reuse that authenticated state.
7. The app redirects the user into the right protected area.

That is much closer to how a real production storefront handles authentication.

## What I Learned From This Step

- auth UX quality depends on layout and navigation, not only backend wiring
- reactive forms make login and signup much easier to keep readable
- validation is more maintainable when rules live in the form model instead of scattered template logic
- authentication routing becomes easier to understand when viewed as redirects around protected routes

## Feature Update: Product Catalog UI

What was added:
- a real `/products` catalog page instead of a placeholder learning screen
- responsive product grid and reusable product cards
- search, category filtering, and badge filtering using mock data
- browser-visible loading, empty, and error states
- query-param-driven catalog state so the page can be refreshed and shared

Why it was added:
- the products feature was not complete until it behaved like a browsable storefront page
- the project requirements call for a modern e-commerce listing experience
- this step connects service data, component state, routing, and shared UI in one practical feature

### Container Page And Presentational Components

The catalog page acts as the container component.

Simple idea:
- the page loads data
- the page tracks filter state
- shared UI components display the products

In this feature:
- `ProductsPage` is the container
- `ProductGridComponent` lays out the cards
- `ProductCardComponent` renders each product
- smaller shared components render badge, rating, price, and image placeholder

That separation is useful because:
- the page owns behavior
- the shared components stay reusable
- the templates stay easier to read

### Query Params Explained Simply

Query params are the values after `?` in a URL.

Example:

```text
/products?q=watch&badge=new
```

What this means:
- `q=watch` stores the search text
- `badge=new` stores the selected badge filter

Why this is useful:
- refreshing the page keeps the current catalog view
- copying the URL preserves the current filters
- browser back and forward navigation work more naturally

Backend comparison:
- similar to request query parameters in a Spring controller
- but here Angular reads them on the frontend and updates the screen

### Signals Plus Observable Loading

This feature uses both signals and observables together.

Simple idea:
- the HTTP-style mock request is still an observable
- the local UI state is stored in signals

Small example:

```ts
private readonly productState = signal(createInitialRequestState<ProductCardViewModel[]>([]));
```

What happens:
- the service returns an observable
- the page subscribes to it
- the signal updates loading, error, and product data
- the template reacts automatically

Why this combination makes sense:
- observables are a natural fit for async requests
- signals are a clean fit for local page state

### Loading, Empty, And Error States

A catalog page should not assume success every time.

This page now handles:
- loading: show product skeleton cards
- empty: show the shared empty state when no results match
- error: show the shared error state with retry

Small mental model:

```text
request starts -> loading
request succeeds with items -> grid
request succeeds with no items -> empty state
request fails -> error state
```

Why this matters:
- real frontend apps always have multiple async outcomes
- the user experience stays stable even when data is missing or broken

### Reusing Shared Product UI

The catalog did not build the card details from scratch.

It reused:
- product badge component
- product rating display
- product price display
- product image placeholder
- product grid layout

Why that matters:
- repeated UI stays consistent
- future pages like home or wishlist can reuse the same product card language
- feature pages stay smaller because small display logic lives in shared components

### Beginner-Friendly Takeaway

The catalog flow now looks like this:

```text
URL query params
  -> ProductsPage reads filters
  -> ProductsApiService returns filtered mock data
  -> signal state updates loading/data/error
  -> shared grid and card components render the result
```

That is a strong real-world Angular pattern:
- route state
- service layer
- async data handling
- reusable UI composition

## What I Learned From This Step

- a feature feels complete only when routing, UI, async states, and navigation all meet in one browser-visible flow
- query params are a practical way to keep catalog filters in sync with the URL
- signals work well for page state even when the data source still comes from observables

## Feature Update: Product Details Feature

What was added:
- a real `/products/:id` product details page
- large product media area with mock gallery selections
- product title, category, description, rating, price, and stock indicator
- add to cart and buy now actions
- loading and error handling for route-driven product fetches

Why it was added:
- the product catalog was incomplete without a destination page for each card
- product details pages are a core e-commerce route
- this step connects route parameters, service loading, and responsive UI in one feature

### Route Parameters Explained Simply

A route parameter is a dynamic value inside the URL path.

Example:

```text
/products/101
```

What this means:
- `/products` is the fixed route part
- `101` is the route parameter value
- Angular reads that value and uses it to load product `101`

In this feature, the parameter name is `id`.

Small example:

```ts
this.route.paramMap.subscribe((params) => {
  const routeId = Number(params.get('id'));
});
```

What this does:
- Angular watches the current route
- it reads the `id` from the URL
- the page uses that id to request the matching product details

Backend comparison:
- this is similar to a Spring Boot path variable like `@GetMapping("/products/{id}")`
- Angular is reading the path in the browser instead of on the server

### Why Route Parameters Matter Here

Using `/products/:id` is useful because:
- every product gets its own URL
- browser refresh still knows which product to show
- users can bookmark or share the product page
- the details page can load the correct product directly from the URL

That is why the route itself becomes the source of truth for which product is open.

### Observable Loading Plus Local State

The details page uses the route id to trigger the mock service call.

Simple flow:

```text
URL changes
  -> route parameter changes
  -> page reads id
  -> service loads product details
  -> UI shows loading, success, or error
```

Why this is useful:
- the component stays in sync with the URL
- the UI reacts correctly on refresh and direct navigation
- the same pattern can later connect to a real backend endpoint

### Shared Product UI Reuse

The details page reuses shared product display pieces instead of rebuilding them:
- product category chip
- product badge
- product rating display
- product price display
- product image placeholder

It also adds a reusable stock indicator component, which is a good pattern when the same stock messaging may appear in product cards, wishlist screens, or cart summaries later.

## What I Learned From This Step

- route parameters are the cleanest way to make one details page serve many products
- a page that depends on the URL should react to route changes, not only read the route once
- refresh-safe product details work because the URL already contains the product identity

---

## Feature Update: Real Product API Integration

**Date:** 2026-06-06
**Feature:** Replace all mock product data with real Spring Boot backend calls
**Status:** ✅ Complete

### What Was Done

The product catalog and product details pages were previously powered entirely by hardcoded mock data baked inside `ProductsApiService`. This session replaces all of that with real HTTP calls to the backend and cleans up the development-only controls that only worked with mock data.

---

### Concept 1: DTOs vs View Models

A common backend-developer question when learning frontend is: "Why do I need two separate interfaces for the same data?"

The answer is that **what the backend sends** and **what the UI needs** are often different shapes.

**DTO (Data Transfer Object)** — what the backend actually returns:

```ts
// ProductListDTO — exact shape from GET /api/products
export interface ProductListDTO {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
  active: boolean;
  brand: string;
  categoryName: string;
}
```

**View Model** — what the Angular product card component expects to render:

```ts
// ProductCardViewModel — what the product grid needs
export interface ProductCardViewModel {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;   // ← backend doesn't send this
  imageLabel: string;    // ← backend doesn't send this
}
```

The service maps DTO → View Model. The component never sees the raw DTO.

```ts
// In the service — private mapper
private mapToProductListItem(dto: ProductListDTO): ProductListItem {
  return {
    id: dto.id,
    name: dto.name,
    price: dto.price,
    imageUrl: dto.imageUrl,
    rating: dto.rating,
    active: dto.active,
    brand: dto.brand,
    categoryName: dto.categoryName,
    // Fields not in backend are omitted — they are optional in the model
  };
}
```

And in the page component — another layer of mapping from `ProductListItem` → `ProductCardViewModel`:

```ts
data: products.map((product) => ({
  id: product.id,
  name: product.name,
  brand: product.brand,
  category: product.categoryName,
  price: product.price,
  rating: product.rating,
  reviewCount: 0,            // Safe default — not in backend
  imageLabel: product.name,  // Derived from product name
})),
```

Each layer has one responsibility: the service knows about HTTP and DTOs, the page knows about the ViewModel the UI component expects.

---

### Concept 2: PageResponse — How Paginated APIs Work

The product list endpoint doesn't return a plain array. It returns a **paginated wrapper**:

```json
// What GET /api/products actually returns
{
  "content": [
    { "id": 1, "name": "Running Shoes", "price": 2499, ... },
    { "id": 2, "name": "Desk Lamp", "price": 1899, ... }
  ],
  "pageNumber": 0,
  "pageSize": 24,
  "totalElements": 58,
  "totalPages": 3,
  "last": false
}
```

This pattern is standard in backend APIs because returning thousands of records at once is too slow and too expensive.

In Angular, the service unwraps `.content` before returning data to the page:

```ts
getProducts(query?: ProductCatalogQuery): Observable<ProductListItem[]> {
  return this.apiService
    .get<PageResponse<ProductListDTO>>(API_ENDPOINTS.products.list, params, { trackLoading: true })
    .pipe(
      map((response) => response.content.map((dto) => this.mapToProductListItem(dto)))
      //              ↑ unwrap the array    ↑ convert each DTO to frontend model
    );
}
```

The `PageResponse<T>` interface is generic — the same wrapper shape is used for products, orders, admin tables, etc. The `T` just changes.

`totalElements` and `totalPages` are not used yet, but they will be needed when pagination controls (page 1, page 2...) are added later.

---

### Concept 3: Optional Fields and the `?` Operator

The backend public product API does not return several fields that the mock data invented:
- `reviewCount` — not in list or detail DTOs
- `badge` — no concept of badge in the backend
- `stockStatus` / `stockLabel` — only in admin DTOs
- `originalPrice` — no discount concept yet

The solution is to mark these fields as **optional** in TypeScript using `?`:

```ts
export interface ProductDetail {
  id: number;
  name: string;
  // ...required fields always present...
  stockStatus?: ProductStockStatus;  // ← optional, backend doesn't send this
  stockLabel?: string;               // ← optional, backend doesn't send this
  reviewCount?: number;              // ← optional, backend doesn't send this
}
```

Then in the template, guard the optional field before rendering it:

```html
<!-- Only show stock indicator if the backend sent stockStatus -->
@if (productDetail.stockStatus) {
  <app-product-stock-indicator
    [status]="productDetail.stockStatus"
    [label]="productDetail.stockLabel ?? 'Check availability'"
  />
}
```

The `??` operator (nullish coalescing) provides a fallback when the value is `null` or `undefined`:

```ts
productDetail.reviewCount ?? 0
// Returns: reviewCount if it exists, otherwise 0
```

This is safer than using `||` because `||` also replaces `0` and `false`, which might be valid values.

---

### Concept 4: URL as Source of Truth for Filter State

A filter like "show Electronics in category, sorted by price" could be stored two ways:

1. In a component signal only → **lost on browser refresh**
2. In the URL (`/products?category=Electronics`) → **survives refresh**

This project stores filters in the URL. The flow works like this:

```text
User changes a filter
  → updateCatalogFilters() updates URL query params via Router.navigate()
  → Angular Router emits a new queryParamMap
  → ngOnInit subscription reads the params and calls loadProducts()
  → Products load with the correct filter
```

```ts
// Reading filter state FROM the URL
ngOnInit(): void {
  this.route.queryParamMap
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((params) => {
      const filters = {
        searchTerm: params.get('q') ?? '',
        category: params.get('category') ?? 'all',
      };
      this.loadProducts(filters);
    });
}

// Writing filter state TO the URL
private updateCatalogFilters(changes: Partial<CatalogFilters>): void {
  void this.router.navigate([], {
    relativeTo: this.route,
    queryParams: {
      q: nextFilters.searchTerm || null,
      category: nextFilters.category !== 'all' ? nextFilters.category : null,
    },
  });
}
```

Setting a query param to `null` removes it from the URL cleanly. So `/products?category=all` becomes `/products`.

Browser back and forward also work because Angular Router manages URL history — clicking back restores the previous query params and re-triggers the subscription.

---

### Concept 5: Silent Background Calls with `trackLoading: false`

The product catalog needs to load two things on init:
1. The product grid (should show a skeleton while loading)
2. The category filter chips (should load quietly without disrupting the grid)

The `ApiLoadingService.track()` method is what triggers the loading skeleton. `trackLoading: false` bypasses it:

```ts
// Loads products — shows the skeleton spinner
getProducts(): Observable<ProductListItem[]> {
  return this.apiService.get(..., { trackLoading: true });
}

// Loads categories — runs silently in the background
getCatalogCategories(): Observable<string[]> {
  return this.apiService.get(..., { trackLoading: false }); // ← no spinner
}
```

In the page:

```ts
ngOnInit(): void {
  this.loadCategories(); // ← silent, background call
  this.route.queryParamMap.subscribe(...); // ← triggers product grid load
}

private loadCategories(): void {
  this.productsApiService.getCatalogCategories()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (categories) => this.categoryOptions.set(categories),
      error: () => {
        // Fail silently — categories missing is acceptable, products missing is not
      },
    });
}
```

The key rule: **critical UI blocking operations** use `trackLoading: true`. **Non-critical background fetches** use `trackLoading: false`.

---

### Files Changed This Session

| File | Summary |
|---|---|
| `core/models/product.model.ts` | Added `ProductListDTO` + `ProductDetailDTO` matching the backend. Made UI-only fields optional. |
| `core/services/products-api.service.ts` | Full rewrite — 300 lines of mock data removed, replaced with real HTTP calls. |
| `features/products/products.page.ts` | Removed `previewState` (mock-only). Async category loading. Cleaner filter handling. |
| `features/products/products.page.html` | Removed dev-only Preview State dropdown and Badge chips. Updated copy. |
| `features/products/product-details.page.ts` | Updated `galleryLabels` fallback to use `product.name`. |
| `features/products/product-details.page.html` | Guarded optional `stockStatus`, `reviewCount`. Updated copy. |

### What is Next

- **Pagination** — `totalPages` and `totalElements` are returned by the backend. A paginator component will let users browse beyond the first 24 results.
- **Real images** — `imageUrl` is returned from the backend. The image placeholder can be replaced with a real `<img>` tag.
- **Sort + price filter** — backend supports `?sortBy=price&order=asc&minPrice=1000`. UI controls for these come next.
- **Cart integration** — the "Add to Cart" button currently shows a snackbar. Next session wires it to `POST /api/cart/add`.

---

## Feature Update: Search, Filtering, and Pagination

What was added:
- Support for complex backend query parameters (`brand`, `minPrice`, `maxPrice`, `sortBy`, `order`, `page`, `size`)
- A slide-out filter drawer using Angular Material (`MatSidenavModule`) for mobile-friendly catalog browsing
- A paginator component using Angular Material (`MatPaginatorModule`)
- Syncing of complex filter state with the URL query parameters
- An aggregated response model (`PaginatedProducts`) mapping backend pagination metadata to the frontend

Why it was added:
- As the catalog grows, users need ways to find products efficiently
- A "products-first" visual layout demands filters be tucked away but easily accessible
- Real-world e-commerce requires stateful URLs (bookmarkable searches and filter states)

### URL as the Source of Truth

The most robust way to manage complex filtering in Angular is to make the URL the **single source of truth**.

Instead of:
`User clicks filter -> Component fetches data -> Component updates URL`

We do:
`User clicks filter -> Component updates URL -> Router detects URL change -> Component fetches data`

```ts
  private updateCatalogFilters(changes: Partial<CatalogFilters>): void {
    const nextFilters = { ...this.filters(), ...changes };
    
    // Reset page to 0 if any filter besides page/size changes
    if (changes.page === undefined && changes.size === undefined) {
      nextFilters.page = 0;
    }

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: nextFilters.searchTerm || null,
        brand: nextFilters.brand !== 'all' ? nextFilters.brand : null,
        page: nextFilters.page > 0 ? nextFilters.page : null,
        // ...
      },
    });
  }
```

Why this is important:
- **Refresh-safe:** The user can refresh the page, and the filters are perfectly restored.
- **Bookmarkable:** The user can copy the URL and send a specific search result to a friend.
- **Browser History:** The back button works naturally.

### Slide-Out Drawer for Filters

Real estate on an e-commerce page is valuable. Instead of permanently occupying the left 20% of the screen with filters, we used a `mat-drawer` (slide-out panel).

```html
<mat-drawer-container class="catalog-drawer-container" [hasBackdrop]="true">
  <mat-drawer position="end" [opened]="showFilterDrawer()" mode="over">
    <!-- Filter UI here -->
  </mat-drawer>
  
  <mat-drawer-content>
    <!-- Product Grid here -->
  </mat-drawer-content>
</mat-drawer-container>
```

Why this works well:
- It provides a wider layout for the actual products.
- The same component structure works for desktop and mobile without needing two separate filter blocks.
- It feels modern and interactive.

### Extracting Dynamic Options (Brands)

The backend doesn't always have dedicated `/brands` endpoints. Sometimes you have to derive available options from the catalog itself.

```ts
  getCatalogBrands(): Observable<string[]> {
    return this.apiService.get(..., { page: 0, size: 100 }, { trackLoading: false })
      .pipe(
        map((response) => {
          const allBrands = response.content.map(p => p.brand).filter(b => !!b);
          return [...new Set(allBrands)].sort();
        })
      );
  }
```

This runs silently in the background (`trackLoading: false`), meaning the main product grid doesn't wait for this to finish, keeping the perceived performance high.

### What is Next

- **Shopping Cart Implementation:** Building the client-side cart logic and connecting it to the backend `POST /api/cart/add`.

---

## Feature Design: Shopping Cart Architecture

**Date:** 2026-06-06
**Feature:** Design Client-Side Cart State Management, Components, and Routing
**Status:** 📋 Design Phase Complete

### What Was Done

Before writing any code, we mapped out the complete architecture for the Shopping Cart feature. In a modern Angular application, we avoid mixing server communication with UI logic and avoid wrapping state in heavy external frameworks. Instead, we use Angular Signals as lightweight, reactive data containers inside a shared Service.

---

### Concept 1: Writable Signals vs. Read-Only Signals

In backend systems, we protect internal state by making class fields `private` and exposing public getters. In Angular, we do the exact same thing with Signals.

- **Writable Signal (`signal`)**: Allows any code to change its value using `.set()` or `.update()`. We keep this `private` inside our service so components cannot randomly mutate the cart data.
- **Read-Only Signal (`asReadonly()`)**: Allows components to *read* values and react to changes, but prevents them from changing the values directly.

```ts
@Injectable({ providedIn: 'root' })
export class CartService {
  // Only the service can write to this
  private readonly _cart = signal<Cart>({ items: [], cartTotal: 0 });

  // Components can inject the service and read this
  public readonly cart = this._cart.asReadonly();
}
```

By separating read/write access, debugging state changes is trivial: you only have to look at the service methods (`addToCart`, `removeFromCart`), not every button or page template in the project.

---

### Concept 2: Computed Signals for Derived State

In database design, you don't store fields like `item_count` or `order_subtotal` if you can calculate them dynamically from the line items. Storing them invites desynchronization bugs.

In Angular, **Computed Signals** are the equivalent of database views or derived fields. They automatically calculate a value from other signals and **cache** the result. They only recalculate when their dependent signals change.

```ts
// Calculate total item count for the header badge
public readonly itemCount = computed(() => 
  this.cart().items.reduce((sum, item) => sum + item.quantity, 0)
);

// Calculate if the cart is empty for conditional UI display
public readonly isEmpty = computed(() => this.cart().items.length === 0);
```

If the cart items don't change, calling `itemCount()` returns the cached number instantly without running the `.reduce()` loop again.

---

### Concept 3: Immediate Updates & Optimistic UI

When a user clicks "+" to increase an item quantity, they expect the number to change *immediately*. Waiting for a backend API call (which might take 200–500ms) makes the app feel sluggish.

**Optimistic UI** means updating the local UI state *before* the server confirms the change, assuming the server operation will succeed.

If the operation fails, we rollback the UI state to what it was before and display a toast/snackbar warning.

```ts
public updateQuantity(itemId: number, quantity: number): void {
  // 1. Keep copy of previous state
  const previousCart = this._cart();

  // 2. Optimistically update local signal state immediately
  this._cart.update(current => {
    const updated = current.items.map(item => 
      item.itemId === itemId ? { ...item, quantity, total: item.price * quantity } : item
    );
    return { items: updated, cartTotal: updated.reduce((s, i) => s + i.total, 0) };
  });

  // 3. Make HTTP request in the background
  this.cartApi.updateItemQuantity(itemId, quantity).subscribe({
    next: (confirmedCart) => {
      this._cart.set(confirmedCart); // Sync with final server-side calculations
    },
    error: () => {
      this._cart.set(previousCart); // Rollback on failure!
      this.snackbar.error('Failed to update quantity.');
    }
  });
}
```

This ensures the user experience remains fast, while retaining transaction safety via rollback.

---

### Concept 4: Lazy Loading Routes

If we load all page components at startup, the initial download size of the application becomes bloated. **Lazy Loading** means loading a feature's code only when the user navigates to its URL.

In modern Angular, we register lazy-loaded feature routes directly in `app.routes.ts` by pointing to the feature routes file:

```ts
// In app.routes.ts
{
  path: 'cart',
  loadChildren: () => import('./features/cart/cart.routes').then(m => m.CART_ROUTES)
}
```

And in `features/cart/cart.routes.ts`, we register the sub-routes:

```ts
// In cart.routes.ts
export const CART_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./cart.page').then(m => m.CartPage)
  }
];
```

The browser only downloads the JavaScript files for the Cart screen when the user actually navigates to `/cart`.

---

### What I Learned From This Design

- Centralizing state in a shared service with readonly Signals creates a unidirectional data flow that is simple to trace and inspect.
- Computed signals prevent boilerplate calculation code in templates and keep page rendering fast.
- Optimistic state updates provide instant user feedback while retaining backend database consistency through error rollback handlers.

## Feature Update: Shopping Cart Implementation

What was added:
- Integrated real backend endpoints into `CartApiService`.
- Implemented `CartService` using Angular Signals to manage cart items and optimistic updates.
- Added a reactive cart badge to the `App` shell header that dynamically updates based on the items in the cart.
- Built a modern, responsive Cart Page featuring an empty state, loading state, item list, and order summary.

Why it was added:
- Enables the core e-commerce flow of selecting and purchasing items.
- Upgrades the placeholder mock data to a fully functional and reactive state system.

### `effect()` API Explained Simply

We utilized the `effect()` API in our `CartService` to react automatically when the user's authentication state changes. 

Small example:

```ts
constructor() {
  effect(() => {
    const isAuthenticated = this.authService.isAuthenticated();
    if (isAuthenticated) {
      this.loadCart();
    } else {
      this._cart.set({ items: [], cartTotal: 0 });
    }
  });
}
```

What this means:
- `effect()` automatically tracks any signals it reads inside its callback function.
    <!-- Product Grid here -->
  </mat-drawer-content>
</mat-drawer-container>
```

Why this works well:
- It provides a wider layout for the actual products.
- The same component structure works for desktop and mobile without needing two separate filter blocks.
- It feels modern and interactive.

### Extracting Dynamic Options (Brands)

The backend doesn't always have dedicated `/brands` endpoints. Sometimes you have to derive available options from the catalog itself.

```ts
  getCatalogBrands(): Observable<string[]> {
    return this.apiService.get(..., { page: 0, size: 100 }, { trackLoading: false })
      .pipe(
        map((response) => {
          const allBrands = response.content.map(p => p.brand).filter(b => !!b);
          return [...new Set(allBrands)].sort();
        })
      );
  }
```

This runs silently in the background (`trackLoading: false`), meaning the main product grid doesn't wait for this to finish, keeping the perceived performance high.

### What is Next

- **Shopping Cart Implementation:** Building the client-side cart logic and connecting it to the backend `POST /api/cart/add`.

---

## Feature Design: Shopping Cart Architecture

**Date:** 2026-06-06
**Feature:** Design Client-Side Cart State Management, Components, and Routing
**Status:** 📋 Design Phase Complete

### What Was Done

Before writing any code, we mapped out the complete architecture for the Shopping Cart feature. In a modern Angular application, we avoid mixing server communication with UI logic and avoid wrapping state in heavy external frameworks. Instead, we use Angular Signals as lightweight, reactive data containers inside a shared Service.

---

### Concept 1: Writable Signals vs. Read-Only Signals

In backend systems, we protect internal state by making class fields `private` and exposing public getters. In Angular, we do the exact same thing with Signals.

- **Writable Signal (`signal`)**: Allows any code to change its value using `.set()` or `.update()`. We keep this `private` inside our service so components cannot randomly mutate the cart data.
- **Read-Only Signal (`asReadonly()`)**: Allows components to *read* values and react to changes, but prevents them from changing the values directly.

```ts
@Injectable({ providedIn: 'root' })
export class CartService {
  // Only the service can write to this
  private readonly _cart = signal<Cart>({ items: [], cartTotal: 0 });

  // Components can inject the service and read this
  public readonly cart = this._cart.asReadonly();
}
```

By separating read/write access, debugging state changes is trivial: you only have to look at the service methods (`addToCart`, `removeFromCart`), not every button or page template in the project.

---

### Concept 2: Computed Signals for Derived State

In database design, you don't store fields like `item_count` or `order_subtotal` if you can calculate them dynamically from the line items. Storing them invites desynchronization bugs.

In Angular, **Computed Signals** are the equivalent of database views or derived fields. They automatically calculate a value from other signals and **cache** the result. They only recalculate when their dependent signals change.

```ts
// Calculate total item count for the header badge
public readonly itemCount = computed(() => 
  this.cart().items.reduce((sum, item) => sum + item.quantity, 0)
);

// Calculate if the cart is empty for conditional UI display
public readonly isEmpty = computed(() => this.cart().items.length === 0);
```

If the cart items don't change, calling `itemCount()` returns the cached number instantly without running the `.reduce()` loop again.

---

### Concept 3: Immediate Updates & Optimistic UI

When a user clicks "+" to increase an item quantity, they expect the number to change *immediately*. Waiting for a backend API call (which might take 200–500ms) makes the app feel sluggish.

**Optimistic UI** means updating the local UI state *before* the server confirms the change, assuming the server operation will succeed.

If the operation fails, we rollback the UI state to what it was before and display a toast/snackbar warning.

```ts
public updateQuantity(itemId: number, quantity: number): void {
  // 1. Keep copy of previous state
  const previousCart = this._cart();

  // 2. Optimistically update local signal state immediately
  this._cart.update(current => {
    const updated = current.items.map(item => 
      item.itemId === itemId ? { ...item, quantity, total: item.price * quantity } : item
    );
    return { items: updated, cartTotal: updated.reduce((s, i) => s + i.total, 0) };
  });

  // 3. Make HTTP request in the background
  this.cartApi.updateItemQuantity(itemId, quantity).subscribe({
    next: (confirmedCart) => {
      this._cart.set(confirmedCart); // Sync with final server-side calculations
    },
    error: () => {
      this._cart.set(previousCart); // Rollback on failure!
      this.snackbar.error('Failed to update quantity.');
    }
  });
}
```

This ensures the user experience remains fast, while retaining transaction safety via rollback.

---

### Concept 4: Lazy Loading Routes

If we load all page components at startup, the initial download size of the application becomes bloated. **Lazy Loading** means loading a feature's code only when the user navigates to its URL.

In modern Angular, we register lazy-loaded feature routes directly in `app.routes.ts` by pointing to the feature routes file:

```ts
// In app.routes.ts
{
  path: 'cart',
  loadChildren: () => import('./features/cart/cart.routes').then(m => m.CART_ROUTES)
}
```

And in `features/cart/cart.routes.ts`, we register the sub-routes:

```ts
// In cart.routes.ts
export const CART_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./cart.page').then(m => m.CartPage)
  }
];
```

The browser only downloads the JavaScript files for the Cart screen when the user actually navigates to `/cart`.

---

### What I Learned From This Design

- Centralizing state in a shared service with readonly Signals creates a unidirectional data flow that is simple to trace and inspect.
- Computed signals prevent boilerplate calculation code in templates and keep page rendering fast.
- Optimistic state updates provide instant user feedback while retaining backend database consistency through error rollback handlers.

## Feature Update: Shopping Cart Implementation

What was added:
- Integrated real backend endpoints into `CartApiService`.
- Implemented `CartService` using Angular Signals to manage cart items and optimistic updates.
- Added a reactive cart badge to the `App` shell header that dynamically updates based on the items in the cart.
- Built a modern, responsive Cart Page featuring an empty state, loading state, item list, and order summary.

Why it was added:
- Enables the core e-commerce flow of selecting and purchasing items.
- Upgrades the placeholder mock data to a fully functional and reactive state system.

### `effect()` API Explained Simply

We utilized the `effect()` API in our `CartService` to react automatically when the user's authentication state changes. 

Small example:

```ts
constructor() {
  effect(() => {
    const isAuthenticated = this.authService.isAuthenticated();
    if (isAuthenticated) {
      this.loadCart();
    } else {
      this._cart.set({ items: [], cartTotal: 0 });
    }
  });
}
```

What this means:
- `effect()` automatically tracks any signals it reads inside its callback function.
- Whenever `isAuthenticated()` (which is a computed signal) changes, Angular automatically re-runs this effect function.
- If the user logs in, we fetch their cart from the backend. If they log out, we clear the local cart data.

Why this is useful:
- We don't need to manually subscribe to an observable or manage an explicit event listener for login/logout actions.
- The logic declaratively states: "Whenever authentication status changes, adjust the cart accordingly."
- It integrates perfectly with Angular's reactive Signals model.

## Feature Update: Complex Signal State & Debouncing

What was added:
- a debounced API request queue (`CartRequestQueueService`)
- tracking item-level loading states in signals (`updatingItemIds`)
- local client-side persistence for "Save for Later"

Why it was added:
- rapid clicks on quantity pickers would cause race conditions on the backend API
- users need immediate UI feedback (optimistic UI), but if multiple requests stack up, the backend might fail or return stale state
- saving items for later is a common e-commerce feature, and using local signal state avoids creating a full backend API if one isn't ready

### Optimistic UI Explained Simply

Optimistic UI means the frontend updates the screen *before* the backend confirms the change.

Simple idea:
1. User clicks "+"
2. The UI instantly shows quantity + 1
3. A background request is sent to the server
4. If the server fails, the UI rolls back to the old value

Why this matters:
- the app feels extremely fast
- network latency doesn't block the user's workflow

### Debouncing Explained Simply

Debouncing means waiting a short time after the user *stops* interacting before taking an action.

Small RxJS example:
```ts
this.updateSubject.pipe(
  groupBy(req => req.itemId),
  mergeMap(group$ => group$.pipe(
    debounceTime(400),
    switchMap(req => this.api.updateQuantity(req))
  ))
).subscribe();
```

What this means:
- If a user clicks "+" 5 times quickly, we don't send 5 API requests
- The stream groups clicks by item ID, waits 400ms after the last click, and sends *only* the final quantity to the backend

Backend analogy:
- Similar to request batching or rate limiting

### Complex Signal State

Previously, the cart used one main `cart` signal. Now we use a set of item IDs to track which items are currently saving:

```ts
private readonly _updatingItemIds = signal<Set<number>>(new Set());

// Mark item as updating
this._updatingItemIds.update(set => new Set(set).add(itemId));
```

Why this is useful:
- We can disable specific buttons (like "Remove" or "Checkout") only for the item being processed, without freezing the entire page.

## What I Learned From This Step

- RxJS `switchMap` and `debounceTime` are powerful for controlling rapid user interactions
- Optimistic UI requires careful error handling to rollback state if the server fails
- Angular Signals make it very easy to track localized loading states (like `Set<number>`) and reactively disable buttons across the UI

## Aligning PUT Cart Item API to Backend Specifications

### Request Parameters vs. Request Body in Angular HTTP PUT

Backend-heavy developers are familiar with controllers matching query parameters (`@RequestParam`) or JSON bodies (`@RequestBody`). In our Angular client, we had originally mapped the cart item quantity update:
`PUT /api/cart/item/{itemId}`
to expect a JSON request body `UpdateCartItemRequest { quantity }`.
However, the backend API expects a request parameter (query parameter) `?quantity={n}` instead of a request body.

In Angular, we updated this using our centralized `ApiService.put` wrapper. Because `put` expects a request body as its second parameter, we pass `null` as the body and pass `quantity` as a query parameter inside the `params` options object.

Example configuration in `CartApiService`:
```ts
updateItemQuantity(itemId: number, quantity: number): Observable<Cart> {
  const params = { quantity };
  // Pass null for request body, and query parameters in the params argument
  return this.apiService.put<Cart, null>(
    API_ENDPOINTS.cart.item(itemId),
    null,
    params,
    { trackLoading: false }
  );
}
```

This properly formats the request as:
`PUT /api/cart/item/1?quantity=5`
with no payload body, matching the backend controller signature.

## Layout and Currency Spacing Refactoring in Cart Feature

### Why `:host { display: block; }` is Critical in Angular Layouts

For developers coming from backend frameworks, custom Angular elements (like `<app-cart-item>`) can seem like simple wrappers. However, by default, the browser treats custom HTML tags as `display: inline`. 

When elements are `display: inline`, they do not respect block height/width styles, padding, or flexbox alignments in the same way as standard block elements. This often leads to severe display issues, such as:
1. **Vertical Stretching**: Inline custom components placed inside a flex layout (like our product lists or sidebar) can stretch in unexpected ways because their block-level children are not correctly sized, causing massive white space gaps.
2. **Ignored Dimensions**: Children styling such as `height: 100%` will fail to resolve because the custom host parent has no block height.

By explicitly adding `:host { display: block; }` to our component stylesheets, we ensure that:
- The component acts as a block-level container in the DOM.
- The parent flex/grid containers can accurately calculate height and spacing.
- Inner elements configured with `height: 100%` resolve their size correctly relative to the parent.

### Overriding Default Component Dimensions

In our product cards, we use a shared `<app-product-image-placeholder>` component that defaults to a `minHeight` of `14rem` (224px). In the smaller layout of a cart list, this default height stretched the parent and pushed surrounding content away.

By passing `minHeight="100%"` to the placeholder component and styling it to take up the full container space, we force the image to fit precisely within the `100px`/`120px` square container using CSS `object-fit: cover`:

```html
<app-product-image-placeholder
  [src]="item.imageUrl"
  [label]="item.productName"
  minHeight="100%"
/>
```

```scss
app-product-image-placeholder {
  display: block;
  width: 100%;
  height: 100%;
}
```

This consistently restricts the image to a square aspect ratio and resolves awkward sizing.

### Overriding Default Component Dimensions

In our product cards, we use a shared `<app-product-image-placeholder>` component that defaults to a `minHeight` of `14rem` (224px). In the smaller layout of a cart list, this default height stretched the parent and pushed surrounding content away.

Instead of percentage height bindings (like `minHeight="100%"` which can trigger relative layout calculation bugs in some flex items), we pass `minHeight="0"` to the placeholder. This completely unbinds the `14rem` (224px) constraint. Combined with `height: 100%` on both the host and the image frame, it allows the component to fit exactly inside the `100px`/`120px` square container:

```html
<app-product-image-placeholder
  [src]="item.imageUrl"
  [label]="item.productName"
  minHeight="0"
/>
```

```scss
app-product-image-placeholder {
  display: block;
  width: 100%;
  height: 100%;
}
```

This consistently restricts the image to a square aspect ratio and resolves awkward sizing.

### Isolating Lists using Block Flow (`display: block`)

In modern e-commerce layouts, wrapping lists of items inside flex containers (`display: flex; flex-direction: column;`) can occasionally trigger vertical stretching issues in browsers if parent nodes are constrained or act as flex containers themselves. 

By changing `.cart-list` and `.cart-drawer__items` to use standard block layout (`display: block`) and spacing components with top/bottom padding or margins (like `margin-bottom: 1.5rem`), we ensure:
- Children (`app-cart-item` components) only occupy their natural height.
- Any vertical stretching by parent flex configurations is entirely avoided.
- Clear, tight, and reliable spacing between cart items.

### Consistent Application Currency

We aligned the Cart layout's currency formatters with the central application configuration (`APP_CONSTANTS.currencyCode`), reverting hardcoded `USD` displays back to `INR` (`₹`) and removing template divisions by 100 which incorrectly assumed price inputs were in cents.

## Sass Import Duplication Gotcha in Scoped Component Styles

### The Danger of `@use` or `@import` of Selector-Heavy Stylesheets

In Angular components, style encapsulation scopes all SCSS selectors inside a component's stylesheet to that component (using attributes like `[_nghost-ng-xxx]`). 

If you use `@use 'app.scss'` or `@import 'app.scss'` inside a component stylesheet, Sass will import **every single CSS selector** defined in `app.scss` and compile it directly into that component's stylesheet. 
Because the component styles are encapsulated, Angular will scope all of those compiled classes to the component's host!
For example, if `app.scss` defines:
```scss
:host {
  display: block;
  min-height: 100dvh;
}
```
And `cart-item.component.scss` imports `app.scss`, the output CSS compiled for `app-cart-item` will contain:
```css
[_nghost-ng-cartitem] {
  display: block;
  min-height: 100dvh;
}
```
This forces **every single cart item** to have a minimum height of `100dvh` (100% of the viewport height), creating massive empty gaps and breaking the layouts entirely! It also bloated our stylesheet file sizes, causing budget exceed warnings during the build.

### The Fix

Only import files that contain **Sass variables, mixins, or functions** (Sass partials that do NOT output CSS rules, typically prefixed with an underscore like `_variables.scss`).
Never `@use` or `@import` a layout/selector-heavy stylesheet (like `app.scss` or `styles.scss`) inside scoped component styles. CSS Custom Properties (variables) are globally available at runtime anyway, so Sass imports aren't needed to access them.

Removing the `@use '../../app.scss'` line instantly dropped stylesheet sizes, cleared the build warnings, and resolved the vertical spacing issue since `app-cart-item` and `app-cart-summary` heights now resolve to `auto` naturally.

## Feature Update: Checkout Integration

What was added:
- Integrated a checkout page using Angular Reactive Forms.
- Added client-side validation for Name, Email, Phone Number, and Address.
- Linked the frontend checkout to the backend API via `OrdersApiService.checkout`.
- Handled state (loading spinners) and routing (redirect to `/order-success` on success).

Why it was added:
- Completes the core shopping loop: Cart -> Checkout -> Success.
- Provides a real-world example of handling moderately complex form validation.

### Reactive Forms Explained Simply

Reactive Forms in Angular provide a model-driven approach to handling form inputs.

Instead of writing validation rules strictly in the HTML template (Template-driven forms), we define the form structure and its rules in the component class (`checkout.page.ts`).

Small example:
```ts
this.checkoutForm = this.fb.group({
  name: ['', [Validators.required]],
  email: ['', [Validators.required, Validators.email]]
});
```

What this means:
- `fb.group` creates a collection of form controls.
- Each control gets an initial value (e.g. `''` for empty string).
- We can easily attach synchronous validators (like `Validators.required` and `Validators.email`).
- In the template, we bind this logic using `[formGroup]="checkoutForm"` and `formControlName="name"`.

Why this is useful:
- Easier to unit test because the form model is in the component class.
- Allows complex cross-field validation if necessary.
- Synchronizes with Angular Material inputs to seamlessly display error states (`<mat-error>`).

### What I Learned From This Step
- Form building is very declarative and structured using `FormBuilder`.
- Combining `ReactiveFormsModule` with Angular Material makes displaying errors clean and accessible.
- A checkout flow needs optimistic/pessimistic UI handling—showing a loading spinner inside the submit button while the backend API (`post`) does its job prevents duplicate submissions.

## Feature Update: Checkout UI & Currency Enhancements

What was added:
- Dynamic currency formatting using centralized configuration (`APP_CONSTANTS.currencyCode`).
- Responsive styling that stretches Angular Material inputs to `100%` container width.
- Refined CSS grid distribution (`1.4fr 1fr` columns) on desktop to eliminate blank space.
- Theme integration mapping: using `--shell-surface`, `--shell-border`, and `--shell-accent` for consistent form focus states.

Why it was added:
- The app operates in INR (₹) whereas checkout prices were hardcoded to USD ($).
- Forms look flat and basic by default because Angular Material form fields default to a fixed inline width; stretching them to the full width of cards gives a modern, premium e-commerce look.
- Distributing whitespace more evenly creates a balanced visual layout that does not feel sparse.

### Localized Price Pipes in Templates

Using Angular's default `currency` pipe is straightforward, but hardcoding `'USD'` is problematic for localized applications. By using variables injected into component classes, we can support multi-currency or localized currency dynamically.

Example:
```ts
// In typescript component
protected readonly currencyCode = APP_CONSTANTS.currencyCode; // 'INR'
```

```html
<!-- In HTML template -->
<span>{{ price | currency:currencyCode:'symbol':'1.0-0' }}</span>
```

### Full-Width Material Inputs

Angular Material's `mat-form-field` has a default display behavior that limits its width. To stretch it across a grid column:
1. Target the component itself: `mat-form-field { width: 100%; }`.
2. Target the inner wrapper classes to add premium styling like custom hover backgrounds and custom focus colors using CSS variables.

Example:
```scss
mat-form-field {
  width: 100%;
  
  ::ng-deep .mat-mdc-text-field-wrapper {
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.6) !important;
  }
}
```

## Feature Update: Orders History & Details

What was added:
- Implementation of the `OrdersPage` to display a list of user orders.
- Creation of `OrderDetailPage` to show specific details for a single order.
- Routing setup including dynamic parameters for order IDs (`/orders/:id`).
- Backend integration via `OrdersApiService` to fetch live data.

Why it was added:
- Users need to be able to track their previous orders and view order details (what they bought, where it was shipped).
- It provides a real-world example of master-detail view implementation.
- Uses path variables in routing for dynamic content fetching.

### Dynamic Routing Parameters

A common requirement in web apps is to show a detail page based on an ID in the URL. Angular provides `ActivatedRoute` to read these parameters.

Example:
```ts
// In orders.routes.ts
{ path: ':id', loadComponent: () => import('./order-detail.page').then(m => m.OrderDetailPage) }
```

```ts
// In order-detail.page.ts
this.route.paramMap.subscribe(params => {
  const idParam = params.get('id');
  if (idParam) {
    this.loadOrderDetails(+idParam);
  }
});
```

What this means:
- The route `:id` is a placeholder for the actual order ID.
- The component subscribes to `paramMap` to get the ID when the route is loaded or changed.
- Based on the ID, the component fetches data from the backend.

### Master-Detail Architecture

This feature implements the Master-Detail pattern:
- **Master**: The `OrdersPage` shows a high-level summary list of all items.
- **Detail**: Clicking an item navigates to the `OrderDetailPage` which shows full information.

Why this is useful:
- Avoids overcrowding a single screen.
- Better performance since details are fetched only when needed.

### What I Learned From This Step
- `ActivatedRoute` is essential for building dynamic detail pages and reading URL parameters.
- Reusing the application's design system (custom variables like `--shell-surface`) maintains a consistent, premium look.
- Proper handling of loading and error states using signals provides a smoother user experience during API calls.

## Feature Update: Modern Authentication UX

What was improved:
- The developer-centric notes and metrics on `/login`, `/signup`, `/forgot-password`, and `/reset-password` were replaced with consumer-facing copy.
- The hero layout was updated to feature a premium background image (`auth_hero_showcase.png`) with a glassmorphism blur overlay (`backdrop-filter: blur(12px)`).
- The `reset-password.page.ts` component was updated to include a fully functional, reactive mock form.

Why it was improved:
- Real-world e-commerce applications focus heavily on brand perception and customer trust during authentication.
- Showing technical specs (e.g., "Real Backend JWT login") to end users breaks immersion.
- Interactive, polished forms (even with mock logic) provide a better foundation for when the real API integration is complete.

### Glassmorphism UI Explained Simply

Glassmorphism is a UI design trend where elements look like frosted glass.

In this project:
- A rich background image is used behind the `.auth-hero` card.
- A semi-transparent overlay sits on top of the feature highlights.
- `backdrop-filter: blur(12px)` applies the blur effect to the background visible through the overlay.

Small example:
```scss
.hero-highlights div {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

Why this is useful:
- It creates a sense of depth and modernity.
- It ensures text remains highly readable over complex or colorful background imagery without resorting to solid opaque boxes.

### Reactive Forms with Validation Explained

Reactive forms allow us to define form structure and validation rules directly in the component class instead of the HTML template.

In the `ResetPasswordPage`, we added:
- `password` control with minimum length validation.
- `confirmPassword` control.
- A custom validator `confirmPasswordValidator` to ensure both fields match.

Small example:
```ts
protected readonly resetForm = this.formBuilder.nonNullable.group(
  {
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  },
  {
    validators: confirmPasswordValidator
  }
);
```

Why this is useful:
- The logic is clean and testable.
- Form states (`invalid`, `touched`, `pending`) are managed synchronously by Angular.
- Adding custom multi-field validators (like password match checking) is straightforward and keeps the template free of complex logic.

### What I Learned From This Step
- Aesthetic updates combined with functional state mocking drastically improve the perceived quality of a frontend feature.
- `backdrop-filter` is a powerful CSS property for achieving modern, premium design aesthetics with minimal code.
- Reactive forms easily support complex cross-field validations (like matching passwords) without cluttering the component.

## Shell Layout and Global Search Modernization

What was improved:
- Consolidated the product catalog search with the header, making it the single source of search entry.
- Redesigned the header toolbar to feel modern and premium with glassmorphism and clear visual states.
- Removed the redundant left drawer on desktop screens, letting the main content occupy full width. On mobile, the left drawer remains as a slide-out menu.
- Added Material Icons next to navigation items in the mobile drawer for a cleaner visual language.
- Removed Checkout from direct navigation menus; it is now accessible only through the cart checkout button.
- Removed the secondary sub-nav completely, merging primary links directly into the header on desktop.

### Router-Based State Synchronization (URL as Single Source of Truth)

In backend development, route parameters decide what data to return. On the frontend, we can do the same to sync search inputs across different pages.

Instead of keeping search query variables in a local service or global state, we update the URL query parameter `q` (e.g. `/products?q=smartphone`).

In `App` component (root shell):
- We subscribe to the Router's `NavigationEnd` events.
- We extract the query param `q` from the active URL and update a local signal `searchQuery`.
- This ensures that if the user searches, or navigates backwards, or clears the search, the header search input automatically updates to stay in sync.

Small example:
```ts
this.router.events
  .pipe(filter(event => event instanceof NavigationEnd))
  .subscribe(() => {
    const urlTree = this.router.parseUrl(this.router.url);
    this.searchQuery.set(urlTree.queryParams['q'] || '');
  });
```

Why this is useful:
- Resolves search state across page transitions (searching from Home redirects to Products with query loaded).
- Solves browser back/forward buttons automatically since URL query parameters drive the UI.
- No complex state management library is needed; the router acts as the single source of truth.

### CSS `:focus-within` Selector Explained Simply

The `:focus-within` pseudo-class matches any parent element if any of its children are currently focused.

In this layout, our search container `.toolbar-search` contains an `<input>`. We want the container to have a border highlight and shadow glow when the user clicks inside the input.

Small example:
```scss
.toolbar-search {
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:focus-within {
    border-color: #b55f34;
    box-shadow: 0 0 0 4px rgba(181, 95, 52, 0.15);
  }
}
```

Why this is useful:
- Eliminates the need for JavaScript focus/blur listeners to toggle active classes on the wrapper element.
- CSS handles styling of container structures reactively and efficiently based on browser focus states.

### CSS Grid for Responsive Two-Row Headers

When building responsive interfaces, we sometimes need to stack layout components on mobile but keep them inline on desktop. Instead of duplicating elements in HTML, we can reposition them using CSS Grid.

In our mobile header toolbar:
- Row 1 shows Logo/Menu (left) and Cart Icon/Login (right).
- Row 2 shows the Search Bar spanning full width.

Small example:
```scss
@media (max-width: 768px) {
  .shell-toolbar {
    display: grid;
    grid-template-columns: auto 1fr;
    row-gap: 0.75rem;
  }

  .toolbar-left {
    grid-column: 1;
    grid-row: 1;
  }

  .toolbar-links {
    grid-column: 2;
    grid-row: 1;
    justify-self: end;
  }

  .toolbar-search {
    grid-column: 1 / span 2;
    grid-row: 2;
  }
}
```

Why this is useful:
- Keeps the HTML layout clean and dry (no duplication of elements for mobile vs desktop views).
- Extreme layout flexibility with minimal CSS selectors.

### What I Learned From This Step
- A persistent sidebar in desktop mode is not always ideal for e-commerce stores; hiding it creates a more spacious and premium storefront look.
- Synchronizing search with URL query parameters guarantees that bookmarks, page refreshes, and back/forward navigation work seamlessly.
- Grid template positioning lets us build complex responsive headers without modifying the DOM element ordering.
## Feature Update: Wishlist

What was added:
- Wishlist API service to perform HTTP calls to backend.
- Local Wishlist state management using Angular Signals.
- Wishlist page displaying all saved products.
- Wishlist toggle actions on Product cards and Product detail pages.
- Navigation links connecting the App Shell to the Wishlist page.

Why it was added:
- It's a core e-commerce feature allowing users to bookmark items for later.
- It provides an opportunity to practice shared component re-use (Product cards) and state management side-by-side with the Cart.

### State Management with Signals Explained Simply

We used Signals to track local Wishlist state in WishlistService while mirroring updates to the backend.

Small example:
`	s
  private readonly _wishlist = signal<Wishlist>({ items: [] });
  public readonly wishlist = this._wishlist.asReadonly();
  public readonly items = computed(() => this.wishlist().items);
`

What this means:
- The internal state is completely mutable by the service via set and update.
- External consumers (components) can only read the derived or readonly signals.

### Optimistic UI Updates

Optimistic updates mean we update the local Signal state immediately before the backend call finishes.

Why this is useful:
- The UI feels instantly responsive. The heart icon turns solid immediately without a loading delay.
- If the API call fails, we capture the failure in an RxJS error block, revert the local state back, and show a Snackbar error.

### What I Learned From This Step
- Optimistic updates dramatically improve the feel of the UI but require careful error handling to rollback if needed.
- Exposing a computed boolean from a service (like isInWishlist(id)) keeps component templates very clean compared to looping over arrays in the template.

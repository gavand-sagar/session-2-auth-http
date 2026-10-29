# Session 2 of 4 — Auth, Guards, Interceptors, Error and Loading States

| Session | Project | Builds |
|---------|---------|--------|
| 1 | session-1-architecture | folder structure, layout, environments, shared UI |
| **2** | **session-2-auth-http** (this one) | login, protected routes, interceptors, dashboard from the API |
| 3 | session-3-performance-testing | search and filters, OnPush, unit tests, production build |
| 4 | session-4-final-project | create / edit / delete with reactive forms |

This project is the **finished state of Session 2**. It starts from session 1 and adds a REST API.

## Run it

Two terminals:

```bash
npm install
npm run api
```

```bash
npm start
```

Open http://localhost:4200 and log in with **admin@shop.test / admin123**.
The fake API (`api/server.mjs`, port 3200) needs a token for every request except login.

**New since session 1:** `api/`, `proxy.conf.json`, `core/auth/`, `core/http/`, `core/errors/`, `features/auth/`, `features/products/data/product-api.ts`, `shared/ui/field-error.ts`, `shared/directives/`, `features/products/directives/`, `features/directives-demo/`.

---

**Duration:** 2 hours
**Goal:** students understand everything between "user opens a page" and "data is on screen", including when it fails.

## Topics

1. Lazy loading and authentication architecture
2. Route guards and HTTP interceptors
3. Error and loading-state strategies
4. Attribute directives

## Agenda

| Time | Part |
|------|------|
| 0:00 – 0:10 | 1a. Lazy loading |
| 0:10 – 0:25 | 1b. Authentication architecture |
| 0:25 – 0:40 | 2a. Route guards |
| 0:40 – 0:55 | 2b. HTTP interceptors |
| 0:55 – 1:05 | 3. Error and loading-state strategies |
| 1:05 – 1:15 | 4. Attribute directives |
| 1:15 – 1:25 | Break |
| 1:25 – 1:45 | **Lab 1:** turn session 1 into this project |
| 1:45 – 1:55 | **Lab 2:** directives |
| 1:55 – 2:00 | Takeaways + homework |

---

## 1a. Lazy loading (10 min)

```ts
// app.routes.ts
{ path: 'login',     loadComponent: () => import('./features/auth/login.page') },
{ path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.page') },
{ path: 'products',  loadChildren:  () => import('./features/products/products.routes') },
```

`loadComponent` loads one page, and `loadChildren` loads a whole feature's routes. The code downloads only on first visit.

**Show:** DevTools → Network → JS. Log in and watch only the dashboard chunk load. Click Products and a new chunk appears. `npm run build` lists them under **Lazy chunk files**.

---

## 1b. Authentication architecture (15 min)

**One service owns the session, and everyone else only reads it.**

```
LoginPage ──login()──► AuthService ──POST /api/auth/login──► API
                          │  token + user  (signals + localStorage)
                          ├──► authGuard        reads isLoggedIn()
                          ├──► authInterceptor  reads token()
                          └──► Shell            reads user()
```

**Show:** `core/auth/auth.service.ts`, then `features/auth/login.page.ts`.
- Log in and refresh. You're still logged in (localStorage).
- Click Logout. The session is cleared and you're back at `/login`.

**Say clearly:** frontend checks are for **user experience**. The **API** checks the token on every request. Try `http://localhost:3200/api/products` in the browser and you get 401.

---

## 2a. Route guards (15 min)

```ts
// app.routes.ts — protect the whole shell once, so every child page is protected
{ path: '', component: Shell, canActivate: [authGuard], children: [...] }
```

```ts
// core/auth/auth.guard.ts
export const authGuard: CanActivateFn = (_route, state) =>
  inject(AuthService).isLoggedIn()
    ? true
    : inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
```

**Show:**
1. Log out and type `/products` in the address bar. You land on `/login?returnUrl=%2Fproducts`.
2. Log in and you're taken back to `/products`.

Other guard types are `canDeactivate` (leaving, used in Session 4), `canMatch` and `canActivateChild`.

---

## 2b. HTTP interceptors (15 min)

```ts
// app.config.ts
provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor, errorInterceptor]))
```

| Interceptor | Job |
|-------------|-----|
| `authInterceptor` | adds `Authorization: Bearer <token>` |
| `loadingInterceptor` | counts requests in flight and shows the progress bar under the header |
| `errorInterceptor` | 401 → toast + logout. 0 → "server unreachable". 5xx → toast. Always re-throws. |

**Show:**
- The thin progress bar under the header on every request.
- In DevTools → Application → Local Storage, set `token` to `expired`, then refresh. You get a toast, a logout and the login page.
- Stop `npm run api` and click Products. You get a "Cannot reach the server" toast.

**Ask:** "Without interceptors, how many files would need the token code?" (Every file that calls the API.)

---

## 3. Error and loading-state strategies (10 min)

**Every data page has 4 states,** built from the same shared components:

```html
@if (loading())     { <app-loading /> }
@else if (error())  { <app-error [message]="error()" (retry)="load()" /> }
@else if (empty())  { <app-empty /> }
@else               { ...content... }
```

| Error | Handled by | User sees |
|-------|-----------|-----------|
| 401 on login | the login page | "Wrong email or password" |
| 401 elsewhere | `errorInterceptor` | toast + login page |
| 0 / 5xx | `errorInterceptor` + page | toast + error state with "Try again" |
| JS bug | `GlobalErrorHandler` | toast + error in console |

**Show:** stop the API, open Products, then start the API again and click **Try again**.

---

## 4. Attribute directives (10 min)

A directive adds behaviour to an element that is already on the page. A component is a directive that also has its own template.

```ts
@Directive({
  selector: '[appLowStock]',
  host: { '[class.low]': 'isLow()' },
})
export class LowStockDirective {
  stock = input.required<number>({ alias: 'appLowStock' });
  limit = input(5);
  isLow = computed(() => this.stock() < this.limit());
}
```

```html
<td [appLowStock]="p.stock">{{ p.stock }}</td>
```

| Directive | Where it's used | What it shows |
|-----------|-----------------|---------------|
| `appAutofocus` | email field on the login page | `inject(ElementRef)` + a lifecycle hook, no inputs |
| `appLowStock` | stock column in Products | an `input()` and the `host` property to add a class |
| `appConfirmClick` | Logout button in the header | listening to the host click and sending an `output()` |

**Show:**
1. Open the login page. The cursor is already in the email field.
2. Products: Mouse (4) and RxJS Handbook (2) are red. Hover over them for the tooltip. The table no longer has its own `p.stock < 5` check.
3. Click Logout. It asks first.
4. Open the **Directives** page: built-in `[class.x]`, `[style.x]`, `ngClass`, `ngStyle`, the 3 directives above, and 7 more small ones you can try.

**More small directives** (in `shared/directives/`, each about 15 lines, all on the Directives page):

| Directive | What it does | How it works |
|-----------|--------------|--------------|
| `[appShowPassword]` | show / hide a password (used on login) | `host: { '[type]': ... }` |
| `appDigitsOnly` | numbers only in an input | blocks other keys in `(keydown)` and `(paste)` |
| `appTrim` | removes spaces at both ends on blur (used on login email) | `inject(NgControl)` to update the form value |
| `[appCopy]` | copies a text on click | `navigator.clipboard`, then an `output()` |
| `(appClickOutside)` | tells you when the user clicks outside | `host: { '(document:click)': ... }` |
| `appImgFallback` | default picture when an image fails | `(error)` on the `img` |
| `appSingleClick` | ignores double clicks for 1 second | a simple lock flag |

**Folder rule** (same as pipes): generic directives go in `shared/directives/`, and a directive that knows a business rule stays in its feature (`appLowStock` is in `features/products/directives/`).

**Ask:** "Why put the confirm in a directive and not inside `logout()`?" (Any button can reuse it, and `AuthService` stays free of UI code.)

---

## Lab 1: turn session 1 into this project (20 min)

Start from **your session-1 app** (or a copy of `session-1-architecture`):

1. Copy `api/` and `proxy.conf.json`, add `"proxyConfig": "proxy.conf.json"` under `serve.options` in `angular.json`, and add `"api": "node api/server.mjs"` to the npm scripts.
2. `core/auth/auth.service.ts`: private `_token` and `_user` signals, `login()`, `logout()`, `isLoggedIn` computed, saved to localStorage.
3. `features/auth/login.page.ts`: a reactive form (email + password, both required) that navigates to `returnUrl` or `/dashboard`.
4. `core/auth/auth.guard.ts`, placed on the Shell route.
5. `core/http/interceptors.ts`: `authInterceptor` and `errorInterceptor` (handle 401 at minimum), registered in `app.config.ts` with `provideHttpClient`.
6. Replace `ProductService` with `ProductApi` (`GET /api/products`, `GET /api/stats`), and give both pages loading and error states.

**Done when:** `/dashboard` redirects to login when logged out, logging in shows the stats, and a broken token logs you out.

---

## Lab 2: directives (10 min)

In the same app:

1. `shared/directives/autofocus.directive.ts`: focus the element in `ngAfterViewInit`. Put it on the login email field.
2. `features/products/directives/low-stock.directive.ts`: input `appLowStock` (the stock) and `limit` (default 5). Add the `low` class with `host`. Use it in the product table instead of `[class.low]`.
3. `shared/directives/confirm-click.directive.ts`: on click, ask with `confirm()` and emit `confirmed` only if the user says yes. Use it on Logout.

**Done when:** the login page opens with the cursor in the email field, low stock is red in Products, and Logout asks before logging out.

**If you finish early:** pick two from the "More small directives" table and write them yourself without looking at the code. `appDigitsOnly` and `appSingleClick` are the easiest to start with.

---

## Takeaways

1. **Lazy load** every feature. One `AuthService` owns the session.
2. **Guards** decide who may enter a route. They're for UX, and the API enforces security.
3. **Interceptors** keep token, loading and common error handling in one place.
4. Every page shows **loading, error, empty and content** with the same shared components.
5. **Directives** add behaviour to existing elements. Generic ones go in `shared/`, rule-based ones stay in their feature.

## Homework

- Read `interview-prep/04-routing-forms-http.md` (Routing and HTTP parts) in **session-4-final-project**.
- Add a `loggingInterceptor` that prints `METHOD url status time` to the console.

# Level 2 Project 2 - REST API Automation with Integration Testing

## Date

2026-11-06

## Objective

Build `Level_02/challenge-02-rest-api-integration` as a standalone Playwright
project on the `AdvancePlaywrightFramework1x` core. The scenario must exercise
full CRUD on the JSONPlaceholder `/users` resource with Playwright's API request
context, validate response statuses, headers, schemas and payload values, and
integrate the API assertions with a frontend that renders the same data.

## Tools and Technologies Used

- Playwright Test + TypeScript (strict)
- Playwright `APIRequestContext` (`playwright.request.newContext`)
- AdvancePlaywrightFramework1x core: custom TTA HTML reporter, Winston logger,
  `UtilElementLocator`, `visualStep`
- `webServer` to launch a zero-dependency Node static server
- Vanilla HTML/CSS/JS frontend using `fetch`
- dotenv

## Steps Performed

1. Probed JSONPlaceholder with Node's `fetch` before writing the suite to learn
   the real behaviour of every endpoint and the CORS policy.
2. Confirmed `GET /users` returns 10 users, `GET /users/1` matches the known
   seed values, `GET /users?username=Bret` filters to one user and
   `GET /users/999` returns `404 {}`.
3. Confirmed `POST /users` returns `201` with generated id `11`, `PUT` and
   `PATCH` return the updated object, and `DELETE` returns `200 {}`.
4. Discovered that writes are not persisted: `GET /users/11` returns `404`
   immediately after the successful create.
5. Confirmed CORS reflects the local origin on both GET and the POST preflight,
   so a browser page can call the API directly.
6. Built a local frontend harness (`src/frontend`) that loads `GET /users` and
   renders a table, and whose create form performs `POST /users` and renders
   the response.
7. Added an `api` fixture bound to the API base URL and a `UsersFrontendPage`
   page object; started the frontend through Playwright `webServer`.
8. Ran the suite, fixed the only failure (HTTP/2 empty status text), and
   re-ran it green.

## Code Examples

API context fixture bound to JSONPlaceholder:

```ts
api: async ({ playwright }, use) => {
    const api = await playwright.request.newContext({
        baseURL: appConfig.apiBaseURL,
        extraHTTPHeaders: { Accept: 'application/json' },
    });
    await use(api);
    await api.dispose();
},
```

Capturing the API call made by the frontend:

```ts
const [response] = await Promise.all([
    page.waitForResponse(
        (res) => res.request().method() === 'POST' && new URL(res.url()).pathname === '/users',
    ),
    usersFrontendPage.submitCreateForm(newUser),
]);

expect(response.status()).toBe(201);
const created = (await response.json()) as ApiUser;
```

HTTP/2 status text fallback in the frontend:

```js
const text = response.statusText || STATUS_TEXT[response.status] || '';
els.apiStatus.textContent = `${response.status}${text ? ` ${text}` : ''}`;
```

## Challenges Faced

- JSONPlaceholder is a fake API and does not persist writes, so a user created
  with `request.post` cannot be read back or shown by a separate frontend.
- The site has no official user-facing frontend that renders the `/users`
  collection.
- Over HTTP/2 the Fetch API reports `Response.statusText` as an empty string,
  so the first version displayed `201` instead of `201 Created` and the
  integration assertion failed.
- The frontend is started by Playwright's `webServer`; it had to bind to
  `127.0.0.1:4173` and serve static files without extra dependencies.

## Solutions Implemented

- Built `src/frontend` as a small local consumer of the real API: the page loads
  `GET /users` and the create form performs `POST /users`, then renders the API
  response. This verifies both the request contract and the displayed data
  without mocking.
- `page.waitForResponse` captures the browser's POST so the test can assert
  status `201`, the echoed payload and the generated id `11`, then compare it
  with the rendered row.
- Added `assertUserShape` for the full nested user schema (address, geo,
  company) and `assertJsonResponse` for status plus `content-type`.
- Added a status-code-to-text map in the frontend so the API status label stays
  readable under HTTP/2.
- Documented the non-persistence limitation in both the project README and the
  integration spec.

## Key Learnings

- JSONPlaceholder simulates writes per request; it never stores them, so any
  UI consistency check for created data must consume the POST response itself.
- CORS on JSONPlaceholder reflects the caller's origin, which allows a static
  local page to call the API directly.
- `Response.statusText` is often empty for HTTP/2 responses, even when the
  status code is correct.
- Playwright `webServer` is a clean way to serve a local frontend for
  integration tests without adding a dev-server dependency.
- Running API tests and browser tests in the same project works well when the
  API fixture pins its own `baseURL` and `use.baseURL` points at the frontend.

## Testing and Verification

- `npm run typecheck` - passed with no errors.
- First `npx playwright test` - **9 passed, 1 failed**: the frontend displayed
  `201` because HTTP/2 `statusText` was empty.
- After the frontend fix, `npx playwright test` - **10 passed** (4.5s total,
  100% pass rate):
  - 8 API CRUD/contract tests
  - 2 frontend integration tests
- Confirmed the custom TTA report generated 3 step screenshots for the create
  flow and visually checked the rendered page (created user id `11`, `NEW`
  badge, `201 Created`).
- Verified port `4173` was released after the run, so the webServer cleanup
  works.

## Future Improvements

- Add negative contract tests (invalid query, malformed payload, unsupported
  method) using `failOnStatusCode: false`.
- Optionally add a small persistence layer to the local harness for a literal
  "create via a separate API call, then reload the UI" flow.
- Run the API suite against a local `json-server` for fully stateful CRUD.
- Add a CI matrix that runs `test:api` on every push and `test:integration`
  nightly.

# Challenge 02 (Level 2) - REST API Automation with Integration Testing

Playwright + TypeScript solution for **Level 2, Project 2**, built on the
[`AdvancePlaywrightFramework1x`](https://github.com/SathishQASelenium/AdvancePlaywrightFramework1x)
core (API request contexts, fixtures, Winston logging, visual steps, and the
**Custom TTA HTML reporter**).

## Targets

- **API under test:** <https://jsonplaceholder.typicode.com>
- **Frontend:** a small local harness (`src/frontend`) that consumes the real
  API and renders the users it returns. Playwright starts it automatically
  through `webServer` on `http://127.0.0.1:4173`.

## Scenario

1. **CRUD** every operation on the `/users` resource (GET, POST, PUT, PATCH,
   DELETE) with Playwright's `APIRequestContext`.
2. **Validate responses** against expected status codes, headers, JSON schema
   and payload values.
3. **Integrate** the API with the frontend: every user returned by
   `GET /users` must be rendered with the same id, name, username and email,
   and a user created through `POST /users` must appear in the table with the
   id and values returned by the API.

## Why the frontend is local

JSONPlaceholder is a fake REST API: it returns `201` for `POST /users` with a
generated `id`, but it does **not persist** writes (`GET /users/11` is `404`
right afterwards). There is also no official user-facing frontend on the site.
The integration harness therefore performs the `POST` itself and renders the
API response, which lets the suite verify the created payload end to end
without mocking the API.

The page also performs `GET /users` on load, so the read path is verified
against the live API on every run.

## Notes

- JSONPlaceholder reflects the requesting origin in its CORS headers, so the
  local page can call it directly from the browser.
- Over HTTP/2 `Response.statusText` is empty, so the frontend falls back to a
  status-code-to-text map to keep the `201 Created` label readable.

## Structure

```
challenge-02-rest-api-integration/
├─ src/
│  ├─ config/appConfig.ts                 # API base, frontend URL, known user
│  ├─ fixtures/test-base.ts               # `api` request context + page object
│  ├─ frontend/
│  │  ├─ server.js                        # zero-dependency static server
│  │  ├─ index.html
│  │  ├─ app.js                           # GET /users and POST /users
│  │  └─ styles.css
│  ├─ pages/
│  │  ├─ BasePage.ts
│  │  └─ UsersFrontendPage.ts
│  ├─ testdata/users.ts                   # POST / PUT / PATCH payloads
│  ├─ tests/
│  │  ├─ api/users-crud.spec.ts           # 8 API contract tests
│  │  └─ integration/users-frontend.spec.ts
│  └─ utils/
│     ├─ apiAssertions.ts                 # status, headers and user schema
│     ├─ CustomTTAReporter.ts             # copied from AdvancePlaywrightFramework1x
│     ├─ logger.ts
│     ├─ UtilElementLocator.ts
│     └─ visualStep.ts
├─ playwright.config.ts
├─ tsconfig.json
├─ .env.example
└─ package.json
```

## Setup and run

```bash
npm install
npx playwright install chromium

npm test                 # API + integration
npm run test:api         # JSONPlaceholder CRUD only
npm run test:integration # local frontend only
npm run typecheck
```

The frontend can also be started by hand with `npm run serve:frontend` and
opened at <http://127.0.0.1:4173>.

## API coverage

| Operation | Request | Assertions |
| --------- | ------- | ---------- |
| Read all | `GET /users` | 200, JSON content type, 10 users, full user schema, known user values |
| Read one | `GET /users/1` | 200, id/name/username/email, address and company values |
| Filter | `GET /users?username=Bret` | 200, exactly one matching user |
| Not found | `GET /users/999` | 404, empty JSON object |
| Create | `POST /users` | 201, echo of payload, generated id `11` |
| Replace | `PUT /users/1` | 200, echoed replacement payload |
| Partial update | `PATCH /users/1` | 200, changed name, preserved email/username/id |
| Delete | `DELETE /users/1` | 200, empty JSON object |

## Reports

- **Custom TTA report** - `tta-report/index.html` (latest), with one screenshot
  per `visualStep` for the integration tests.
- **Playwright HTML report** - `playwright-report/`, open with
  `npm run test:report`.

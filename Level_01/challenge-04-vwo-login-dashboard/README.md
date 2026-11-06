# Challenge 04 - VWO Login and Dashboard (Parallel Browsers)

Playwright + TypeScript solution for **Automation Challenge 4**, built on the
[`AdvancePlaywrightFramework1x`](https://github.com/SathishQASelenium/AdvancePlaywrightFramework1x)
core (Page Object Model, fixtures, Winston logging, visual steps, and the
**Custom TTA HTML reporter**).

## Scenario

1. Open <https://app.wingify.com/#/login>
2. Sign in with `r97ain68@1sec.email` / `Password@123`
3. Verify the dashboard is visible after login
4. Validate the user is displayed in the left panel
5. Click the user entry, select **Logout**
6. Verify the app logs out and navigates back to the login page

## Parallel browsers

`playwright.config.ts` defines two projects and two workers, so the same
scenario runs in Chromium and Firefox at the same time:

```ts
projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
],
workers: 2,
```

Run both side by side (headed shows two windows):

```bash
npm test                 # chromium + firefox, parallel, headless
npm run test:headed      # visible browser windows
npm run test:parallel    # explicit both projects, 2 workers
npm run test:chromium
npm run test:firefox
```

## App-specific behaviour handled

- This account lands on `#/setup/account-setup` immediately after login; the
  page object clicks the left-panel **Home** entry to reach `#/dashboard`.
- The dashboard opens onboarding overlays that create a blocking
  `.modal-backdrop`. `DashboardPage.dismissBlockingModals()` clicks
  **Ok, got it!** / the overlay close button, and `openProfileMenu()` retries if
  a late overlay intercepts the click.
- Left-panel profile button: `button[aria-label="Profile menu"]` (shows
  `TTA User`).
- Logout: `button.shell-sidebar-profile-logout` in the profile flyout.
- Logout returns to `https://app.wingify.com/#/login` with the login form
  visible.
- Firefox loads the dashboard and completes logout much slower than Chromium
  (tens of seconds), so the config uses a 300s test timeout and the post-logout
  URL wait is 90s.

## Structure

```
challenge-04-vwo-login-dashboard/
├─ src/
│  ├─ config/appConfig.ts              # baseURL, credentials, display name
│  ├─ fixtures/test-base.ts            # loginPage + dashboardPage fixtures
│  ├─ pages/
│  │  ├─ BasePage.ts
│  │  ├─ LoginPage.ts                  # #login-username / #login-password
│  │  └─ DashboardPage.ts              # Home, overlays, profile, logout
│  ├─ tests/
│  │  └─ challenge-04-vwo-login-dashboard.spec.ts
│  └─ utils/
│     ├─ CustomTTAReporter.ts          # copied from AdvancePlaywrightFramework1x
│     ├─ logger.ts
│     ├─ UtilElementLocator.ts
│     └─ visualStep.ts
├─ playwright.config.ts                # chromium + firefox, 2 workers
├─ tsconfig.json
├─ .env.example
└─ package.json
```

## Setup

```bash
npm install
npx playwright install chromium firefox
```

Optionally copy `.env.example` to `.env` to override credentials or the
expected display name.

## Reports

- **Custom TTA report** - `tta-report/index.html`, with per-step screenshots
  from `visualStep` for both browser runs.
- **Playwright HTML report** - `playwright-report/`, open with
  `npm run test:report`.

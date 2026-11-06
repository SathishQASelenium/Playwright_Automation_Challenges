# Automation Challenge 4 - VWO Login, Dashboard and Logout

## Date

2026-11-06

## Objective

Build `Level_01/challenge-04-vwo-login-dashboard` as a standalone Playwright
project on the `AdvancePlaywrightFramework1x` core (including the custom TTA
reporter). The scenario must log in to <https://app.wingify.com/#/login> with
the supplied credentials, verify the dashboard, verify the user is shown in the
left panel, log out from the profile menu, and return to the login page - all
running in **Chromium and Firefox in parallel**.

## Tools and Technologies Used

- Playwright Test 1.65 + TypeScript (strict)
- AdvancePlaywrightFramework1x core: custom TTA HTML reporter, Winston logger,
  `UtilElementLocator`, `visualStep`
- Page Object Model + custom Playwright fixtures
- Chromium and Firefox projects with 2 workers
- dotenv

## Steps Performed

1. Probed the live VWO app with Playwright scripts to learn the real flow.
2. Confirmed login selectors: `#login-username`, `#login-password`,
   `#js-login-btn`.
3. Discovered the post-login route is `#/setup/account-setup?accountId=...`;
   clicking the left-panel **Home** button reaches
   `#/dashboard?accountId=...`.
4. Identified the left-panel profile entry
   (`button[aria-label="Profile menu"]`, shows `TTA User`) and the logout
   button (`button.shell-sidebar-profile-logout`).
5. Found the dashboard onboarding overlays (Account Switcher / Wingz welcome)
   that create a blocking `.modal-backdrop`; implemented dismissal with
   **Ok, got it!** / close, plus retries around the profile click.
6. Created the standalone project with the framework core copied verbatim.
7. Installed Chromium and Firefox, ran `npm run typecheck`, then the suite.
8. Tuned timeouts after observing Firefox's much slower module loading and
   logout redirect.

## Code Examples

Reaching the dashboard from the setup landing route:

```ts
async ensureDashboard(): Promise<void> {
    if (!this.page.url().includes('/dashboard')) {
        await this.homeButton.click();
    }
    await expect(this.page).toHaveURL(/\/dashboard/, { timeout: 60_000 });
    await expect(this.campaignStatusHeading).toBeVisible({ timeout: 90_000 });
    await this.dismissBlockingModals();
}
```

Dismissing the blocking overlays:

```ts
const gotIt = this.page.getByRole('button', { name: /ok, got it!/i }).first();
if (await gotIt.isVisible().catch(() => false)) {
    await gotIt.click();
} else {
    await this.page.locator('button[aria-label="Close"]:visible').first().click();
}
```

Parallel browser projects:

```ts
projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
],
workers: 2,
```

## Challenges Faced

- Login does not land on the dashboard; this account goes to
  `#/setup/account-setup`. The Home sidebar entry is the reliable path to
  `#/dashboard`.
- The dashboard shows onboarding/account-switcher overlays whose
  `.modal-backdrop` intercepts pointer events. They can appear several seconds
  after the dashboard renders.
- The document title stays `Wingify Setup` in Firefox even when the dashboard
  is visible, so the title is not a valid readiness check.
- Firefox loads the app far slower than Chromium: dashboard readiness took
  80-96s, and logout redirect took 14-90s. The initial 25s waits failed.
- The app logs `disallowed MIME type ("text/html")` module errors in Firefox
  because some chunks are missing, but the shell still renders.

## Solutions Implemented

- `ensureDashboard()` checks the URL and clicks **Home** when needed.
- Readiness is asserted with the dashboard-specific **Campaigns status**
  heading instead of the document title.
- `dismissBlockingModals()` closes overlays; `openProfileMenu()` retries the
  click so late overlays cannot break the logout.
- Timeouts raised: 300s per test, 60s for the dashboard URL, 90s for the
  dashboard heading and the post-logout login URL.
- Left-panel user validation reads the profile button text and asserts it
  contains `TTA User`.
- Both browser projects run with `workers: 2`, so the scenario truly executes
  side by side.

## Key Learnings

- VWO's logout endpoint responds `302 POST /logout` and then the SPA performs a
  full reload; the visible redirect can lag by a long time in Firefox.
- The profile flyout renders `Configuration | Settings | Upgrade | Trash Bin |
  Product Updates | Logout`.
- Firefox-specific timing must be accounted for; asserting on content/URL with
  generous timeouts is more reliable than fixed sleeps.
- Running the same account in two browsers in parallel did not invalidate the
  other session in this environment.

## Testing and Verification

- `npm run typecheck` - passed with no errors.
- `npx playwright test --project=firefox` - **1 passed** (2m 40s) after the
  timeout fix.
- `npx playwright test` - **2 passed** in parallel:
  - chromium: 1m 11s, 100% pass
  - firefox: 3m 27s, 100% pass
- Custom TTA report generated with 12 step screenshots (6 per browser) and
  2 videos.

## Future Improvements

- Reduce Firefox runtime by blocking third-party analytics/YouTube requests in
  the test context.
- Add a `--grep` tag split so CI can run Chromium on every commit and Firefox
  nightly.
- Extract the shared framework core into a local package if more challenges
  copy the same utils.

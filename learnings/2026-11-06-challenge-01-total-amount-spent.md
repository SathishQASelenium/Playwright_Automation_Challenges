# Automation Challenge 1 - Total Amount Spent

## Date

2026-11-06

## Objective

Build `Level_01/challenge-01-total-amount-spent` as a standalone Playwright
project on top of the `AdvancePlaywrightFramework1x` core (including its custom
TTA HTML reporter). The test must log in to <https://demo.applitools.com> with
`Admin` / `Password@123`, verify the `app.html` dashboard, parse transaction
amounts into spent vs earned, and verify the monthly total is `1996.22`.

## Tools and Technologies Used

- Playwright Test 1.65 + TypeScript (strict)
- Node.js 24 / npm 11
- AdvancePlaywrightFramework1x as the project base
- Custom TTA HTML reporter (`CustomTTAReporter.ts`)
- Winston logger, `UtilElementLocator`, `visualStep` screenshot helper
- Page Object Model + custom Playwright fixtures
- dotenv for environment configuration

## Steps Performed

1. Inspected the framework repository: package.json, `playwright.config.ts`,
   `BasePage`, `LoginPage`, `test-base`, `UtilElementLocator`, `logger`,
   `visualStep`, and `CustomTTAReporter`.
2. Confirmed the Applitools demo DOM:
   - Login: `#username`, `#password`, `#log-in`
   - Dashboard: `app.html`, `Recent Transactions` table, amounts in the last
     column (e.g. `+ 1,250 USD`, `- 320 USD`).
3. Created the standalone project under `Level_01/challenge-01-total-amount-spent`
   with its own `package.json`, `playwright.config.ts`, `tsconfig.json`,
   `.env.example`, `.gitignore`, and README.
4. Copied the reusable framework core verbatim: `CustomTTAReporter.ts`,
   `logger.ts`, `UtilElementLocator.ts`, `visualStep.ts`.
5. Added challenge-specific code: `appConfig`, `BasePage`, `LoginPage`,
   `DashboardPage`, `test-base` fixtures, `MoneyUtil`, and the spec.
6. Installed dependencies and the Chromium build required by Playwright 1.65.
7. Ran `npm run typecheck` and `npx playwright test`.

## Code Examples

Signed amount parser and summary:

```ts
const AMOUNT_PATTERN = /^([+-])?\s*([\d,]+(?:\.\d+)?)\s*(?:USD)?$/i;

export function parseAmount(raw: string): ParsedAmount {
    const match = AMOUNT_PATTERN.exec(raw.replace(/\s+/g, ' ').trim());
    if (!match) throw new Error(`Unable to parse transaction amount: "${raw}"`);
    const [, sign, digits] = match;
    const value = Number(digits.replace(/,/g, ''));
    const amount = sign === '-' ? -value : value;
    return { raw, amount, direction: amount < 0 ? 'spent' : 'earned' };
}
```

Dashboard page object delegating to the util:

```ts
async summarizeTransactions(): Promise<MoneySummary> {
    const rawAmounts = await this.getAmountTexts();
    return summarizeAmounts(rawAmounts);
}
```

Assertion step:

```ts
await visualStep(page, 'Verify the monthly total is 1996.22', async () => {
    expect(summary.net).toBe(appConfig.expectedMonthlyTotal);
});
```

## Challenges Faced

- The framework targets TTACart (`app.thetestingacademy.com`), so its page
  objects and API suites were not reusable for `demo.applitools.com`.
- `git clone` failed with `Filename too long` on Windows until
  `core.longpaths=true` was enabled.
- Playwright resolved to 1.65, which needed Chromium revision 1254; older
  cached browsers were not compatible.
- The dashboard amounts are signed and mixed. `1996.22` is the net
  (earned minus spent), not the sum of the negative amounts (564.00).

## Solutions Implemented

- Kept only the framework core (config, reporter, logger, locator wrapper,
  visual steps, fixture pattern) and wrote new Applitools-specific page objects.
- Enabled long paths for the reference clone.
- Ran `npx playwright install chromium` for the resolved Playwright version.
- Implemented `MoneyUtil` to return `earned`, `spent`, and `net`, and asserted
  `net === 1996.22` while logging the spent/earned breakdown.

## Key Learnings

- The Applitools demo data nets to `1996.22`: earned `2560.22`, spent `564.00`.
- `visualStep` works with an extended `test` object as long as it is called
  inside a running test; screenshots are named `step-<index>-...` so the custom
  reporter maps them to the correct step.
- Playwright's TypeScript path aliases (`@pages`, `@utils`, ...) are resolved
  from `tsconfig.json` at runtime, so no extra bundler is needed.
- The custom TTA reporter writes a timestamped report plus `index.html`,
  `history.html`, screenshots, and video under `tta-report/`.

## Testing and Verification

- `npm run typecheck` - passed with no errors.
- `npx playwright test` on the resolved Chromium build - **1 passed**.
- Console output confirmed:
  `transactions=6 earned=2560.22 spent=564 net=1996.22`.
- Custom TTA report generated at
  `Level_01/challenge-01-total-amount-spent/tta-report/index.html` with 5 step
  screenshots and a video recording.

## Future Improvements

- Add a small unit test suite for `MoneyUtil` edge cases (comma separators,
  missing currency, malformed input).
- Add a `.github/workflows` job that runs `typecheck` and the challenge on push.
- When Level 2 challenges are provided, reuse the same core-copy approach and
  centralize shared framework files if duplication becomes a maintenance burden.

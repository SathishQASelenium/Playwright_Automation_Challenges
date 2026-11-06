# Challenge 01 - Total Amount Spent (Applitools Demo)

Playwright + TypeScript solution for **Automation Challenge 1**, built on the
[`AdvancePlaywrightFramework1x`](https://github.com/SathishQASelenium/AdvancePlaywrightFramework1x)
core (Page Object Model, fixtures, Winston logging, visual steps, and the
**Custom TTA HTML reporter**).

## Scenario

1. Open <https://demo.applitools.com>
2. Sign in with `Admin` / `Password@123`
3. Verify the `app.html` dashboard is displayed
4. Calculate the total amount spent this month
5. Parse and check **spent vs earned**
6. Verify the total is **1996.22**

## How the total is calculated

The `Recent Transactions` table mixes income and expenses:

| Signed amount | Direction |
| ------------- | --------- |
| `+ 1,250 USD` | earned    |
| `+ 952.23 USD`| earned    |
| `- 320 USD`   | spent     |
| `+ 17.99 USD` | earned    |
| `- 244 USD`   | spent     |
| `+ 340 USD`   | earned    |

`src/utils/MoneyUtil.ts` parses every amount into `{ amount, direction }` and
returns:

- `earned` = 2,560.22 (sum of positive amounts)
- `spent` = 564.00 (sum of the absolute negative amounts)
- `net` = 1,996.22 (`earned - spent`, the signed total of every transaction)

The spec asserts `net === 1996.22`.

## Structure

```
challenge-01-total-amount-spent/
├─ src/
│  ├─ config/appConfig.ts              # baseURL, credentials, expected total
│  ├─ fixtures/test-base.ts            # loginPage + dashboardPage fixtures
│  ├─ pages/
│  │  ├─ BasePage.ts                   # shared page scaffolding
│  │  ├─ LoginPage.ts                  # index.html login form
│  │  └─ DashboardPage.ts              # app.html transactions table
│  ├─ tests/
│  │  └─ challenge-01-total-amount-spent.spec.ts
│  └─ utils/
│     ├─ CustomTTAReporter.ts          # copied from AdvancePlaywrightFramework1x
│     ├─ logger.ts                     # Winston logger
│     ├─ UtilElementLocator.ts         # locator wrapper
│     ├─ visualStep.ts                 # step + screenshot attachment
│     └─ MoneyUtil.ts                  # parse / spent-vs-earned util
├─ playwright.config.ts
├─ tsconfig.json
├─ .env.example
└─ package.json
```

## Setup

```bash
npm install
npx playwright install chromium
```

Optionally copy `.env.example` to `.env`. The suite falls back to the public
demo credentials when no `.env` is present.

## Run

```bash
npm test                 # headless, chromium
npm run test:headed      # watch the flow
npm run test:ui          # Playwright UI mode
npm run typecheck        # tsc --noEmit
```

## Reports

- **Custom TTA report** - generated automatically at `tta-report/index.html`
  (each run also writes `tta-report/report_<timestamp>.html`, plus
  `history.html`). The report includes every `test.step` with inline
  screenshots captured by `visualStep`.
- **Playwright HTML report** - `playwright-report/`, open with
  `npm run test:report`.

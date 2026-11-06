# Challenge 02 - Web Tables Verification (DemoQA)

Playwright + TypeScript solution for **Automation Challenge 2**, built on the
[`AdvancePlaywrightFramework1x`](https://github.com/SathishQASelenium/AdvancePlaywrightFramework1x)
core (Page Object Model, fixtures, Winston logging, visual steps, and the
**Custom TTA HTML reporter**).

## Scenario

1. Navigate to <https://demoqa.com/webtables>
2. Click the **3rd Edit button by row position** (never `#edit-record-3`)
3. Update the record and verify the edit in the table
4. Click **Add**, create a new row, and verify it in the table
5. Verify all cell details

## Test data

The third row starts as:

```
Kierra | Gentry | 29 | kierra@example.com | 2000 | Legal
```

It is edited to:

```
Kierra | Gentry-Updated | 30 | kierra.updated@example.com | 9500 | Automation
```

New record added:

```
Sathish | Kumar A S | 42 | sathish_qc_lead@hotmail.com | 10000 | Automation Engineer
```

## Structure

```
challenge-02-web-tables-verification/
├─ src/
│  ├─ config/appConfig.ts              # baseURL + web tables path
│  ├─ fixtures/test-base.ts            # webTablesPage fixture
│  ├─ pages/
│  │  ├─ BasePage.ts                   # shared page scaffolding
│  │  └─ WebTablesPage.ts              # table, edit/add dialogs, row helpers
│  ├─ testdata/webTables.data.ts       # existing / updated / new record data
│  ├─ tests/
│  │  └─ challenge-02-web-tables-verification.spec.ts
│  └─ utils/
│     ├─ CustomTTAReporter.ts          # copied from AdvancePlaywrightFramework1x
│     ├─ logger.ts
│     ├─ UtilElementLocator.ts
│     └─ visualStep.ts
├─ playwright.config.ts
├─ tsconfig.json
├─ .env.example
└─ package.json
```

## Row-position addressing

`WebTablesPage` resolves every row through the table locator and its 1-based
position:

```ts
// 3rd row's Edit button - not #edit-record-3
await webTablesPage.openEditDialogForRow(3);

// inside the page object
await this.rows.nth(position - 1).getByTitle('Edit').click();
```

## Setup

```bash
npm install
npx playwright install chromium
```

## Run

```bash
npm test                 # headless, chromium
npm run test:headed      # watch the flow
npm run test:ui          # Playwright UI mode
npm run typecheck        # tsc --noEmit
```

## Reports

- **Custom TTA report** - `tta-report/index.html` (plus timestamped runs and
  `history.html`), with per-step screenshots from `visualStep`.
- **Playwright HTML report** - `playwright-report/`, open with
  `npm run test:report`.

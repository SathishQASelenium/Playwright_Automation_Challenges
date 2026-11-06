# Challenge 03 - Modal Dialogs (DemoQA)

Playwright + TypeScript solution for **Automation Challenge 3**, built on the
[`AdvancePlaywrightFramework1x`](https://github.com/SathishQASelenium/AdvancePlaywrightFramework1x)
core (Page Object Model, fixtures, Winston logging, visual steps, and the
**Custom TTA HTML reporter**).

## Scenario

1. Navigate to <https://demoqa.com/modal-dialogs>
2. Open the **Small Modal** and verify its title and body
3. Close the Small Modal
4. Open the **Large Modal** and verify its title and body
5. Close the Large Modal

## Verified content

**Small Modal**

```
Title: Small Modal
Body:  This is a small modal. It has very less content
```

**Large Modal**

```
Title: Large Modal
Body:  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
       Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
       when an unknown printer took a galley of type and scrambled it to make a type
       specimen book. It has survived not only five centuries, but also the leap into
       electronic typesetting, remaining essentially unchanged. It was popularised in
       the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
       and more recently with desktop publishing software like Aldus PageMaker
       including versions of Lorem Ipsum.
```

The expected strings live in `src/testdata/modalDialogs.data.ts` and the spec
asserts exact equality.

## Structure

```
challenge-03-modal-dialogs/
├─ src/
│  ├─ config/appConfig.ts              # baseURL + modal dialogs path
│  ├─ fixtures/test-base.ts            # modalDialogsPage fixture
│  ├─ pages/
│  │  ├─ BasePage.ts
│  │  └─ ModalDialogsPage.ts           # open / read / close both modals
│  ├─ testdata/modalDialogs.data.ts    # expected titles and bodies
│  ├─ tests/
│  │  └─ challenge-03-modal-dialogs.spec.ts
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

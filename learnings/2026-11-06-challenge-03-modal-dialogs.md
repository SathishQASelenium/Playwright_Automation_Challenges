# Automation Challenge 3 - Modal Dialogs Content

## Date

2026-11-06

## Objective

Build `Level_01/challenge-03-modal-dialogs` as a standalone Playwright project
on the `AdvancePlaywrightFramework1x` core (including the custom TTA reporter).
The test must open <https://demoqa.com/modal-dialogs>, verify the title and body
of the **Small Modal**, close it, then verify the title and body of the
**Large Modal** and close it.

## Tools and Technologies Used

- Playwright Test 1.65 + TypeScript (strict)
- AdvancePlaywrightFramework1x core: custom TTA HTML reporter, Winston logger,
  `UtilElementLocator`, `visualStep`
- Page Object Model + custom Playwright fixture
- dotenv

## Steps Performed

1. Inspected the live DemoQA modal DOM with a Playwright script:
   - Open buttons: `#showSmallModal`, `#showLargeModal`
   - Shared shell: `.modal-content`, title `.modal-title`, body `.modal-body`
   - Close buttons: `#closeSmallModal`, `#closeLargeModal`
   - Title ids: `#example-modal-sizes-title-sm` / `#example-modal-sizes-title-lg`
2. Captured the exact expected strings for both modals and stored them in
   `src/testdata/modalDialogs.data.ts`.
3. Created the standalone project with the framework core copied verbatim.
4. Wrote `ModalDialogsPage` with open / read / close methods and explicit
   visibility/hidden waits.
5. Installed dependencies, ran `npm run typecheck`, then `npx playwright test`.

## Code Examples

Open and assert the dialog is ready:

```ts
async openSmallModal(): Promise<void> {
    this.log.info('opening small modal');
    await this.smallModalButton.click();
    await expect(this.modal).toBeVisible();
    await expect(this.smallModalCloseButton).toBeVisible();
}
```

Read title/body through the shared locator wrapper:

```ts
async getModalTitle(): Promise<string> {
    return this.el.getInnerText(this.modalTitle);
}

async getModalBody(): Promise<string> {
    return this.el.getInnerText(this.modalBody);
}
```

Exact-content assertion in the spec:

```ts
expect(title).toBe(largeModalContent.title);
expect(body).toBe(largeModalContent.body);
```

## Challenges Faced

- Both modals share the same CSS classes, so the page object must wait for the
  size-specific close button before reading content; otherwise the previous
  modal's markup could still be matched.
- The Large Modal body is a single ~574-character paragraph; any whitespace or
  punctuation change breaks exact equality.
- DemoQA renders modals through React, so visibility assertions are needed
  after both opening and closing.

## Solutions Implemented

- Waited on `#closeSmallModal` / `#closeLargeModal` to confirm the correct
  modal is active before reading title/body.
- Stored the long Lorem Ipsum paragraph as a concatenated string constant to
  keep source readability while preserving exact text.
- Used `expect(...).toBeHidden()` after close, with `visualStep` screenshots
  capturing each state.

## Key Learnings

- The Small Modal body is `This is a small modal. It has very less content`.
- The Large Modal body is the standard Lorem Ipsum paragraph (574 characters).
- `#example-modal-sizes-title-sm` / `-lg` are stable title hooks if the CSS
  class-based locator ever becomes ambiguous.
- All 5 `visualStep` calls produced screenshots in the custom TTA report.

## Testing and Verification

- `npm run typecheck` - passed with no errors.
- `npx playwright test` - **1 passed** (4.5s).
- Console evidence:
  - `small modal title="Small Modal" body="This is a small modal. It has very less content"`
  - `large modal title="Large Modal" bodyLength=574`
- Custom TTA report generated at `tta-report/index.html` with 5 step
  screenshots and 1 video.

## Future Improvements

- Add a check that the dialog closes via the header `aria-label="Close"` button
  as an alternate path.
- Assert the modal size class (`modal-sm` vs `modal-lg`) in addition to content.
- Extract the shared framework core into a local package if more challenges
  copy the same utils.

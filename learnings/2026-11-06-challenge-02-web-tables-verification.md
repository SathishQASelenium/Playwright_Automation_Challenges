# Automation Challenge 2 - Web Tables Verification

## Date

2026-11-06

## Objective

Build `Level_01/challenge-02-web-tables-verification` as a standalone Playwright
project on the `AdvancePlaywrightFramework1x` core (including the custom TTA
reporter). The test must open <https://demoqa.com/webtables>, click the **3rd
Edit button by row position**, update the record, verify it, add a new record,
and verify every cell of the new row.

## Tools and Technologies Used

- Playwright Test 1.65 + TypeScript (strict)
- AdvancePlaywrightFramework1x core: custom TTA HTML reporter, Winston logger,
  `UtilElementLocator`, `visualStep`
- Page Object Model + custom Playwright fixtures
- dotenv

## Steps Performed

1. Inspected the live DemoQA DOM with a Playwright script:
   - Table headers: First Name, Last Name, Age, Email, Salary, Department, Action
   - 3 default rows; row 3 = `Kierra / Gentry / 29 / kierra@example.com / 2000 / Legal`
   - Edit and Delete are `span[title="Edit"]` / `span[title="Delete"]` inside the row
   - Add button `#addNewRecordButton`
   - Modal fields: `#firstName`, `#lastName`, `#userEmail`, `#age`, `#salary`,
     `#department`, submit `#submit`
2. Created the standalone project with the framework core copied verbatim.
3. Wrote `WebTablesPage` using row positions only:
   `rows.nth(position - 1).getByTitle('Edit')`.
4. Added `webTables.data.ts` with existing, updated, and new records plus
   `recordToCells()` for exact cell comparisons.
5. Installed dependencies, ran `npm run typecheck`, then `npx playwright test`.

## Code Examples

Position-based edit (no record ids):

```ts
async openEditDialogForRow(position: number): Promise<void> {
    this.log.info(`opening edit dialog for row ${position}`);
    await this.rows.nth(position - 1).getByTitle('Edit').click();
    await expect(this.modal).toBeVisible();
}
```

Polled row assertion that survives React re-render:

```ts
async expectRowValues(position: number, expected: string[]): Promise<void> {
    await expect.poll(() => this.getRowValues(position)).toEqual(expected);
}
```

Finding the new row by unique email and comparing all cells:

```ts
const cells = await webTablesPage.getRowValuesByEmail(newRecord.email);
expect(cells).toEqual(recordToCells(newRecord));
```

## Challenges Faced

- The Edit/Delete controls are unlabeled SVG icons, so text locators do not
  work; the stable hook is `title="Edit"` scoped to a row locator.
- The challenge explicitly forbids addressing records by generated ids
  (`#edit-record-3`), so all access had to be positional.
- DemoQA is React-rendered; after submit the DOM updates asynchronously, so a
  direct read could race the re-render.
- Table column order is First Name, Last Name, **Age, Email**, Salary,
  Department - easy to mismatch when asserting cells.

## Solutions Implemented

- Scoped `getByTitle('Edit')` to `rows.nth(position - 1)`.
- Used `expect.poll()` for row-value assertions and `toHaveCount()` for row
  count, removing the re-render race.
- Kept cell order in a single `recordToCells()` helper used by both data and
  assertions.
- Waited for the modal to be hidden after submit before asserting the table.

## Key Learnings

- Row-position addressing is robust on DemoQA because the table has no sorting
  or filtering enabled by default.
- The Add dialog and Edit dialog share the same form ids; one `fillRecordForm`
  works for both.
- `expect.poll` is the cleanest way to assert on text that updates after a
  React state change.
- All 5 `visualStep` calls produced screenshots in the custom TTA report.

## Testing and Verification

- `npm run typecheck` - passed with no errors.
- `npx playwright test` - **1 passed** (8.7s).
- Console evidence:
  - row 3 updated to `["Kierra","Gentry-Updated","30","kierra.updated@example.com","9500","Automation"]`
  - new record cells `["Sathish","Kumar A S","42","sathish_qc_lead@hotmail.com","10000","Automation Engineer"]`
- Custom TTA report generated at `tta-report/index.html` with 5 step
  screenshots and 1 video.

## Future Improvements

- Add a negative-path test for invalid email/age validation in the modal.
- Parameterize pagination (change rows-per-page and re-verify).
- Extract the shared framework core into a local package if more challenges
  copy the same utils.

/**
 * Automation Challenge 2 - Web Tables Verification.
 *
 *  1. Navigate to https://demoqa.com/webtables
 *  2. Click the 3rd Edit button (by row position, not record id)
 *  3. Update the record and verify the edit in the table
 *  4. Click Add, create a new row, and verify it in the table
 *  5. Verify all cell details
 */

import { test, expect } from '@fixtures/test-base';
import { visualStep } from '@utils/visualStep';
import { createLogger } from '@utils/logger';
import {
    existingThirdRow,
    newRecord,
    recordToCells,
    updatedThirdRow,
} from '@testdata/webTables.data';

const log = createLogger('challenge-02');

test.describe('@P0 @Regression Automation Challenge 2 - Web Tables Verification', () => {
    test('edits the 3rd row by position and adds a new record', async ({ page, webTablesPage }) => {
        await visualStep(page, 'Navigate to the web tables page', async () => {
            await webTablesPage.open();
            await webTablesPage.waitForLoaded();
            await webTablesPage.expectRowCount(3);
            log.info('web tables page loaded with 3 rows');
        });

        await visualStep(page, 'Click the 3rd Edit button by row position', async () => {
            await webTablesPage.expectRowValues(3, recordToCells(existingThirdRow));
            await webTablesPage.openEditDialogForRow(3);
            log.info('3rd row edit dialog opened');
        });

        await visualStep(page, 'Update the record and verify it in the table', async () => {
            await webTablesPage.fillRecordForm(updatedThirdRow);
            await webTablesPage.submitForm();
            await webTablesPage.expectRowValues(3, recordToCells(updatedThirdRow));
            log.info(`row 3 updated to ${JSON.stringify(recordToCells(updatedThirdRow))}`);
        });

        await visualStep(page, 'Add a new record and verify it appears', async () => {
            await webTablesPage.openAddDialog();
            await webTablesPage.fillRecordForm(newRecord);
            await webTablesPage.submitForm();
            await webTablesPage.expectRowCount(4);
            log.info('new record submitted');
        });

        await visualStep(page, 'Verify all cell details of the new record', async () => {
            const cells = await webTablesPage.getRowValuesByEmail(newRecord.email);
            expect(cells).toEqual(recordToCells(newRecord));
            log.info(`new record cells: ${JSON.stringify(cells)}`);
        });
    });
});

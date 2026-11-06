/**
 * Automation Challenge 3 - Verify the content of both the Small Modal and the
 * Large Modal.
 *
 *  1. Navigate to https://demoqa.com/modal-dialogs
 *  2. Open the Small Modal and verify its title and body
 *  3. Close the Small Modal
 *  4. Open the Large Modal and verify its title and body
 *  5. Close the Large Modal
 */

import { test, expect } from '@fixtures/test-base';
import { visualStep } from '@utils/visualStep';
import { createLogger } from '@utils/logger';
import { largeModalContent, smallModalContent } from '@testdata/modalDialogs.data';

const log = createLogger('challenge-03');

test.describe('@P0 @Regression Automation Challenge 3 - Modal dialogs', () => {
    test('verifies the small and large modal content', async ({ page, modalDialogsPage }) => {
        await visualStep(page, 'Navigate to the modal dialogs page', async () => {
            await modalDialogsPage.open();
            await modalDialogsPage.waitForLoaded();
            log.info('modal dialogs page loaded');
        });

        await visualStep(page, 'Open and verify the Small Modal', async () => {
            await modalDialogsPage.openSmallModal();

            const title = await modalDialogsPage.getModalTitle();
            const body = await modalDialogsPage.getModalBody();

            expect(title).toBe(smallModalContent.title);
            expect(body).toBe(smallModalContent.body);

            log.info(`small modal title="${title}" body="${body}"`);
        });

        await visualStep(page, 'Close the Small Modal', async () => {
            await modalDialogsPage.closeSmallModal();
            log.info('small modal closed');
        });

        await visualStep(page, 'Open and verify the Large Modal', async () => {
            await modalDialogsPage.openLargeModal();

            const title = await modalDialogsPage.getModalTitle();
            const body = await modalDialogsPage.getModalBody();

            expect(title).toBe(largeModalContent.title);
            expect(body).toBe(largeModalContent.body);
            expect(body).toContain('Lorem Ipsum');

            log.info(`large modal title="${title}" bodyLength=${body.length}`);
        });

        await visualStep(page, 'Close the Large Modal', async () => {
            await modalDialogsPage.closeLargeModal();
            log.info('large modal closed');
        });
    });
});

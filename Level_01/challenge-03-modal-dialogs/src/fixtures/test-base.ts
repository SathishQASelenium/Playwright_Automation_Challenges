/**
 * test-base - custom Playwright `test` pre-wired with this challenge's page
 * object.
 */

import { test as base } from '@playwright/test';
import { ModalDialogsPage } from '@pages/ModalDialogsPage';

export type TestFixture = {
    modalDialogsPage: ModalDialogsPage;
};

export const test = base.extend<TestFixture>({
    modalDialogsPage: async ({ page }, use) => {
        await use(new ModalDialogsPage(page));
    },
});

export { expect } from '@playwright/test';

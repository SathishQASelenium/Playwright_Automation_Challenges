/**
 * test-base - custom Playwright `test` pre-wired with this challenge's page
 * objects.
 *
 *   import { test, expect } from '@fixtures/test-base';
 *
 *   test('...', async ({ webTablesPage }) => { ... });
 */

import { test as base } from '@playwright/test';
import { WebTablesPage } from '@pages/WebTablesPage';

export type TestFixture = {
    webTablesPage: WebTablesPage;
};

export const test = base.extend<TestFixture>({
    webTablesPage: async ({ page }, use) => {
        await use(new WebTablesPage(page));
    },
});

export { expect } from '@playwright/test';

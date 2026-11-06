/**
 * test-base - custom Playwright `test` pre-wired with this challenge's page
 * objects. Specs ask for the page they need instead of constructing it:
 *
 *   import { test, expect } from '@fixtures/test-base';
 *
 *   test('...', async ({ loginPage, dashboardPage }) => { ... });
 *
 * Fixtures hand over constructed page objects, not opened ones; each spec
 * decides when to navigate.
 */

import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';

export type TestFixture = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
};

export const test = base.extend<TestFixture>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page));
    },
});

export { expect } from '@playwright/test';

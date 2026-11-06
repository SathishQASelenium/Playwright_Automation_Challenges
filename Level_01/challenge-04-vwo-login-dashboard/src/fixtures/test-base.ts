/**
 * test-base - custom Playwright `test` pre-wired with this challenge's page
 * objects.
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

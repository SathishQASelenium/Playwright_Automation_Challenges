/**
 * Automation Challenge 4 - Login and Dashboard Page Automation in
 * app.vwo.com, run in two browsers in parallel.
 *
 *  1. Open https://app.wingify.com/#/login
 *  2. Sign in with the provided credentials
 *  3. Verify the dashboard is visible after login
 *  4. Validate the user is displayed in the left panel
 *  5. Open the profile menu, click Logout
 *  6. Verify the application logged out and returned to the login page
 *
 * The chromium and firefox projects are configured to run in parallel.
 */

import { test, expect } from '@fixtures/test-base';
import { appConfig } from '@config/appConfig';
import { visualStep } from '@utils/visualStep';
import { createLogger } from '@utils/logger';

const log = createLogger('challenge-04');

test.describe('@P0 @Regression Automation Challenge 4 - VWO login and dashboard', () => {
    test('logs in, verifies the dashboard and user, then logs out', async ({ page, loginPage, dashboardPage }) => {
        await visualStep(page, 'Open the VWO login page', async () => {
            await loginPage.open();
            await loginPage.waitForLoaded();
            log.info('login page loaded');
        });

        await visualStep(page, 'Sign in with the provided credentials', async () => {
            log.info(`signing in as ${appConfig.credentials.username}`);
            await loginPage.loginAs(appConfig.credentials.username, appConfig.credentials.password);
        });

        await visualStep(page, 'Verify the dashboard is visible after login', async () => {
            await dashboardPage.ensureDashboard();
            log.info(`dashboard visible at ${page.url()}`);
        });

        await visualStep(page, 'Verify the user is displayed in the left panel', async () => {
            const profileName = await dashboardPage.getProfileName();
            expect(profileName).toContain(appConfig.expectedDisplayName);
            log.info(`left panel shows user "${profileName}"`);
        });

        await visualStep(page, 'Open the profile menu and log out', async () => {
            await dashboardPage.logout();
            log.info('logout clicked');
        });

        await visualStep(page, 'Verify the user is back on the login page', async () => {
            await expect(page).toHaveURL(/\/#\/login/, { timeout: 90_000 });
            await loginPage.waitForLoaded();
            log.info(`returned to login at ${page.url()}`);
        });
    });
});

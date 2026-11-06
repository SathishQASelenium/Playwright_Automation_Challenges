/**
 * Automation Challenge 1 - Calculate the total amount of money spent.
 *
 *  1. Open https://demo.applitools.com
 *  2. Sign in as Admin / Password@123
 *  3. Verify the app.html dashboard is displayed
 *  4. Parse every transaction amount into spent vs earned
 *  5. Verify the signed total is 1996.22
 */

import { test, expect } from '@fixtures/test-base';
import { appConfig } from '@config/appConfig';
import { visualStep } from '@utils/visualStep';
import { createLogger } from '@utils/logger';
import type { MoneySummary } from '@utils/MoneyUtil';

const log = createLogger('challenge-01');

test.describe('@P0 @Smoke Automation Challenge 1 - Total amount spent', () => {
    test('calculates the total amount spent this month', async ({ page, loginPage, dashboardPage }) => {
        await visualStep(page, 'Open the Applitools demo login page', async () => {
            await loginPage.open();
            await expect(page).toHaveTitle(/ACME Demo App/);
        });

        await visualStep(page, 'Sign in as Admin', async () => {
            log.info(`signing in as ${appConfig.credentials.username}`);
            await loginPage.loginAs(appConfig.credentials.username, appConfig.credentials.password);
        });

        await visualStep(page, 'Verify the app.html dashboard is displayed', async () => {
            await dashboardPage.waitForLoaded();
            log.info(`signed in as ${await dashboardPage.getLoggedInUser()}`);
        });

        let summary!: MoneySummary;

        await visualStep(page, 'Parse transactions into spent vs earned', async () => {
            const rowCount = await dashboardPage.getTransactionCount();
            expect(rowCount).toBeGreaterThan(0);

            summary = await dashboardPage.summarizeTransactions();

            log.info(
                `transactions=${summary.transactions.length} ` +
                `earned=${summary.earned} spent=${summary.spent} net=${summary.net}`,
            );

            expect(summary.transactions).toHaveLength(rowCount);
            expect(summary.earned).toBeGreaterThan(0);
            expect(summary.spent).toBeGreaterThan(0);
        });

        await visualStep(page, 'Verify the monthly total is 1996.22', async () => {
            log.info(`verifying net total ${summary.net} === ${appConfig.expectedMonthlyTotal}`);
            expect(summary.net).toBe(appConfig.expectedMonthlyTotal);
        });
    });
});

import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { summarizeAmounts, type MoneySummary } from '@utils/MoneyUtil';

/**
 * Applitools ACME demo dashboard (app.html).
 *
 * Owns the "Recent Transactions" table and hands the raw amount strings to
 * MoneyUtil, keeping the parsing/summing logic out of the spec.
 */
export class DashboardPage extends BasePage {
    static readonly PATH = '/app.html';

    private readonly recentTransactionsHeader: Locator;
    private readonly transactionRows: Locator;
    private readonly amountCells: Locator;
    private readonly loggedInUser: Locator;

    constructor(page: Page) {
        super(page, 'DashboardPage');
        this.recentTransactionsHeader = page.getByRole('heading', { name: 'Recent Transactions' });
        this.transactionRows = page.locator('table.table tbody tr');
        this.amountCells = page.locator('table.table tbody tr td:last-child');
        this.loggedInUser = page.locator('.logged-user-name');
    }

    async waitForLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/\/app\.html$/);
        await expect(this.recentTransactionsHeader).toBeVisible();
        await this.el.waitForPageLoad();
    }

    async getTransactionCount(): Promise<number> {
        return this.el.count(this.transactionRows);
    }

    async getAmountTexts(): Promise<string[]> {
        return this.el.getAllTexts(this.amountCells);
    }

    async summarizeTransactions(): Promise<MoneySummary> {
        const rawAmounts = await this.getAmountTexts();
        this.log.info(`parsed ${rawAmounts.length} transaction amounts`);
        return summarizeAmounts(rawAmounts);
    }

    async getLoggedInUser(): Promise<string> {
        return this.el.getInnerText(this.loggedInUser);
    }
}

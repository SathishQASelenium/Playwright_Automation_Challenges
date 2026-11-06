import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Storefront home page at https://www.automationexercise.com/.
 */
export class HomePage extends BasePage {
    static readonly PATH = '/';

    private readonly logo: Locator;

    constructor(page: Page) {
        super(page, 'HomePage');
        this.logo = page.locator('img[alt="Website for automation practice"]').first();
    }

    async open(): Promise<void> {
        await this.goto(HomePage.PATH);
    }

    async waitForLoaded(): Promise<void> {
        await expect(this.logo).toBeVisible();
        await expect(this.page.locator('a[href="/products"]:visible').first()).toBeVisible();
    }
}

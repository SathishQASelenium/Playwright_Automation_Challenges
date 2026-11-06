import { Locator, Page } from '@playwright/test';
import { UtilElementLocator } from '@utils/UtilElementLocator';
import { createLogger, type Logger } from '@utils/logger';

/**
 * NavBar - the storefront header shared by every page.
 *
 * Automation Exercise keeps the same navigation on the marketing, product,
 * cart, checkout and payment pages, so every page object gets one through
 * `BasePage`.
 */
export class NavBar {
    private readonly el: UtilElementLocator;
    private readonly log: Logger;

    private readonly productsLink: Locator;
    private readonly cartLink: Locator;
    private readonly logoutLink: Locator;
    private readonly loggedInLabel: Locator;

    constructor(page: Page) {
        this.el = new UtilElementLocator(page, 'NavBar');
        this.log = createLogger('NavBar');
        this.productsLink = page.locator('a[href="/products"]:visible').first();
        this.cartLink = page.locator('a[href="/view_cart"]:visible').first();
        this.logoutLink = page.locator('a[href="/logout"]:visible').first();
        this.loggedInLabel = page.locator('a:has-text("Logged in as"):visible').first();
    }

    async goToProducts(): Promise<void> {
        this.log.info('opening the Products page');
        await this.el.click(this.productsLink);
    }

    async goToCart(): Promise<void> {
        this.log.info('opening the Cart page');
        await this.el.click(this.cartLink);
    }

    async logout(): Promise<void> {
        this.log.info('clicking Logout');
        await this.el.click(this.logoutLink);
    }

    /** Header text such as `Logged in as TTA User`. */
    async getLoggedInText(): Promise<string> {
        return this.el.getInnerText(this.loggedInLabel);
    }

    async isLoggedIn(): Promise<boolean> {
        return this.el.isVisible(this.loggedInLabel);
    }

    async isLogoutVisible(): Promise<boolean> {
        return this.el.isVisible(this.logoutLink);
    }
}

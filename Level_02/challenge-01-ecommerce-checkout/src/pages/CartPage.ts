import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Shopping cart at https://www.automationexercise.com/view_cart.
 */
export class CartPage extends BasePage {
    static readonly PATH = '/view_cart';

    private readonly cartRows: Locator;
    private readonly checkoutButton: Locator;

    constructor(page: Page) {
        super(page, 'CartPage');
        this.cartRows = page.locator('#cart_info_table tbody tr');
        this.checkoutButton = page.locator('a.check_out');
    }

    async open(): Promise<void> {
        await this.goto(CartPage.PATH);
    }

    async getRowCount(): Promise<number> {
        return this.el.count(this.cartRows);
    }

    async getProductNames(): Promise<string[]> {
        return this.el.getAllTexts(this.cartRows.locator('.cart_description a'));
    }

    /**
     * Remove every item so a re-run of the suite starts from an empty cart
     * (the basket is stored server-side against the demo account).
     */
    async emptyCart(): Promise<void> {
        await this.open();

        for (let removed = 0; removed < 20; removed++) {
            const remaining = await this.cartRows.count();
            if (remaining === 0) {
                return;
            }

            const before = remaining;
            this.log.info(`removing cart item (${before} remaining)`);
            await this.el.click(this.cartRows.first().locator('.cart_quantity_delete'));
            await expect(this.cartRows).toHaveCount(before - 1);
        }

        await expect(this.cartRows).toHaveCount(0);
    }

    async expectLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/\/view_cart/);
        await expect(this.checkoutButton).toBeVisible();
    }

    async proceedToCheckout(): Promise<void> {
        this.log.info('clicking Proceed To Checkout');
        await this.el.click(this.checkoutButton);
    }
}

import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Checkout page at https://www.automationexercise.com/checkout.
 *
 * Reaching it requires a logged-in session; the page shows the delivery and
 * billing addresses and the order review table.
 */
export class CheckoutPage extends BasePage {
    static readonly PATH = '/checkout';

    private readonly deliveryAddress: Locator;
    private readonly reviewOrder: Locator;
    private readonly placeOrderLink: Locator;

    constructor(page: Page) {
        super(page, 'CheckoutPage');
        this.deliveryAddress = page.locator('#address_delivery');
        this.reviewOrder = page.locator('#cart_info');
        this.placeOrderLink = page.locator('a[href="/payment"]').filter({ hasText: 'Place Order' });
    }

    async expectLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/\/checkout/);
        await expect(this.deliveryAddress).toBeVisible();
        await expect(this.reviewOrder).toBeVisible();
        await expect(this.placeOrderLink).toBeVisible();
    }

    async getDeliveryAddress(): Promise<string> {
        return this.el.getInnerText(this.deliveryAddress);
    }

    async placeOrder(): Promise<void> {
        this.log.info('clicking Place Order');
        await this.el.click(this.placeOrderLink);
    }
}

import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Order confirmation page at
 * https://www.automationexercise.com/payment_done/<orderId>.
 */
export class OrderConfirmationPage extends BasePage {
    private readonly orderPlacedHeading: Locator;
    private readonly confirmationMessage: Locator;
    private readonly continueButton: Locator;

    constructor(page: Page) {
        super(page, 'OrderConfirmationPage');
        this.orderPlacedHeading = page.locator('[data-qa="order-placed"]');
        this.confirmationMessage = page.getByText('Congratulations! Your order has been confirmed!');
        this.continueButton = page.locator('[data-qa="continue-button"]');
    }

    async expectConfirmed(): Promise<void> {
        await expect(this.page).toHaveURL(/\/payment_done\/\d+/);
        await expect(this.orderPlacedHeading).toBeVisible();
        await expect(this.orderPlacedHeading).toHaveText(/order placed/i);
        await expect(this.confirmationMessage).toBeVisible();
        await expect(this.continueButton).toBeVisible();
    }

    /** Order id from the confirmation URL. */
    getOrderId(): string {
        return this.page.url().match(/\/payment_done\/(\d+)/)?.[1] ?? '';
    }

    async continueShopping(): Promise<void> {
        this.log.info('clicking Continue on the confirmation page');
        await this.el.click(this.continueButton);
    }
}

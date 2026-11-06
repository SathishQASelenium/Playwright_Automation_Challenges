import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type PaymentDetails = {
    nameOnCard: string;
    cardNumber: string;
    cvc: string;
    expiryMonth: string;
    expiryYear: string;
};

/**
 * Payment page at https://www.automationexercise.com/payment.
 *
 * The demo gateway accepts any syntactically valid card details and never
 * charges anything.
 */
export class PaymentPage extends BasePage {
    static readonly PATH = '/payment';

    private readonly nameOnCardInput: Locator;
    private readonly cardNumberInput: Locator;
    private readonly cvcInput: Locator;
    private readonly expiryMonthInput: Locator;
    private readonly expiryYearInput: Locator;
    private readonly payButton: Locator;

    constructor(page: Page) {
        super(page, 'PaymentPage');
        this.nameOnCardInput = page.locator('input[data-qa="name-on-card"]');
        this.cardNumberInput = page.locator('input[data-qa="card-number"]');
        this.cvcInput = page.locator('input[data-qa="cvc"]');
        this.expiryMonthInput = page.locator('input[data-qa="expiry-month"]');
        this.expiryYearInput = page.locator('input[data-qa="expiry-year"]');
        this.payButton = page.locator('button[data-qa="pay-button"]');
    }

    async expectLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/\/payment/);
        await expect(this.nameOnCardInput).toBeVisible();
        await expect(this.payButton).toBeVisible();
    }

    async payAndConfirmOrder(details: PaymentDetails): Promise<void> {
        this.log.info('filling the payment form');
        await this.el.fill(this.nameOnCardInput, details.nameOnCard);
        await this.el.fill(this.cardNumberInput, details.cardNumber);
        await this.el.fill(this.cvcInput, details.cvc);
        await this.el.fill(this.expiryMonthInput, details.expiryMonth);
        await this.el.fill(this.expiryYearInput, details.expiryYear);

        this.log.info('clicking Pay and Confirm Order');
        await this.el.click(this.payButton);
    }
}

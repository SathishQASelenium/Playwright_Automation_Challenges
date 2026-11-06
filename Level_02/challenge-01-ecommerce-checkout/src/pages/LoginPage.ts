import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login page at https://www.automationexercise.com/login.
 *
 *   const login = new LoginPage(page);
 *   await login.open();
 *   await login.loginAs('user@example.com', 'Password@123');
 */
export class LoginPage extends BasePage {
    static readonly PATH = '/login';

    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;

    constructor(page: Page) {
        super(page, 'LoginPage');
        this.emailInput = page.locator('input[data-qa="login-email"]');
        this.passwordInput = page.locator('input[data-qa="login-password"]');
        this.loginButton = page.locator('button[data-qa="login-button"]');
    }

    async open(): Promise<void> {
        await this.goto(LoginPage.PATH);
    }

    async waitForLoaded(): Promise<void> {
        await expect(this.emailInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.loginButton).toBeVisible();
    }

    async loginAs(email: string, password: string): Promise<void> {
        this.log.info(`loginAs ${email}`);
        await this.el.fill(this.emailInput, email);
        await this.el.fill(this.passwordInput, password);
        await this.el.click(this.loginButton);
    }

    async expectLoggedIn(): Promise<void> {
        await expect(this.page.locator('a:has-text("Logged in as"):visible').first()).toBeVisible();
    }
}

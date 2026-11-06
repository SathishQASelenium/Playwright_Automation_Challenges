import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * VWO (Wingify) login page at https://app.wingify.com/#/login.
 *
 *   const login = new LoginPage(page);
 *   await login.open();
 *   await login.loginAs('user@example.com', 'Password@123');
 */
export class LoginPage extends BasePage {
    static readonly PATH = '/#/login';

    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly signInButton: Locator;

    constructor(page: Page) {
        super(page, 'LoginPage');
        this.usernameInput = page.locator('#login-username');
        this.passwordInput = page.locator('#login-password');
        this.signInButton = page.locator('#js-login-btn');
    }

    async open(): Promise<void> {
        await this.goto(LoginPage.PATH);
    }

    async waitForLoaded(): Promise<void> {
        await expect(this.usernameInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.signInButton).toBeVisible();
    }

    async loginAs(username: string, password: string): Promise<void> {
        this.log.info(`loginAs ${username}`);
        await this.el.fill(this.usernameInput, username);
        await this.el.fill(this.passwordInput, password);
        await this.el.click(this.signInButton);
    }
}

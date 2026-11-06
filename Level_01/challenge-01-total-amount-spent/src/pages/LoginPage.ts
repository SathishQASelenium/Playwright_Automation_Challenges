import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Applitools ACME demo login screen (index.html).
 *
 *   const login = new LoginPage(page);
 *   await login.open();
 *   await login.loginAs('Admin', 'Password@123');
 */
export class LoginPage extends BasePage {
    static readonly PATH = '/';

    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly signInButton: Locator;

    constructor(page: Page) {
        super(page, 'LoginPage');
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.signInButton = page.locator('#log-in');
    }

    async open(): Promise<void> {
        await this.goto(LoginPage.PATH);
    }

    async loginAs(username: string, password: string): Promise<void> {
        this.log.info(`loginAs ${username}`);
        await this.el.fill(this.usernameInput, username);
        await this.el.fill(this.passwordInput, password);
        await this.el.click(this.signInButton);
    }
}

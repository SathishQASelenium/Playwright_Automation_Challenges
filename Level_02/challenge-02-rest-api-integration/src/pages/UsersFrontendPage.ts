import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type UiUser = {
    id: number;
    name: string;
    username: string;
    email: string;
};

/**
 * Local frontend harness that renders JSONPlaceholder users.
 *
 * The page fetches `GET /users` on load and its create form performs
 * `POST /users`, prepending the response to the table.
 */
export class UsersFrontendPage extends BasePage {
    static readonly PATH = '/';

    private readonly rows: Locator;
    private readonly createdRows: Locator;
    private readonly nameInput: Locator;
    private readonly usernameInput: Locator;
    private readonly emailInput: Locator;
    private readonly createButton: Locator;
    private readonly statusMessage: Locator;
    private readonly apiStatus: Locator;
    private readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page, 'UsersFrontendPage');
        this.rows = page.locator('[data-testid="user-row"]');
        this.createdRows = page.locator('[data-testid="user-row"][data-created="true"]');
        this.nameInput = page.locator('[data-testid="create-name"]');
        this.usernameInput = page.locator('[data-testid="create-username"]');
        this.emailInput = page.locator('[data-testid="create-email"]');
        this.createButton = page.locator('[data-testid="create-submit"]');
        this.statusMessage = page.locator('[data-testid="status-message"]');
        this.apiStatus = page.locator('[data-testid="api-status"]');
        this.errorMessage = page.locator('[data-testid="error-message"]');
    }

    async open(): Promise<void> {
        await this.goto(UsersFrontendPage.PATH);
    }

    async waitForUsersLoaded(): Promise<void> {
        await expect(this.statusMessage).toHaveAttribute('data-tone', 'success');
        await expect(this.rows.first()).toBeVisible();
    }

    async getRowCount(): Promise<number> {
        return this.el.count(this.rows);
    }

    /** All rendered rows, read from the table cells. */
    async getUsers(): Promise<UiUser[]> {
        return this.rows.evaluateAll((rows) =>
            rows.map((row) => {
                const read = (testId: string) =>
                    row.querySelector(`[data-testid="${testId}"]`)?.textContent?.trim() ?? '';

                return {
                    id: Number(row.getAttribute('data-user-id')),
                    name: read('user-name'),
                    username: read('user-username'),
                    email: read('user-email'),
                };
            }),
        );
    }

    /** The row prepended after a successful POST, including its API-assigned id. */
    async getCreatedUser(): Promise<UiUser> {
        const row = this.createdRows.first();
        await expect(row).toBeVisible();

        return row.evaluate((element) => {
            const read = (testId: string) =>
                element.querySelector(`[data-testid="${testId}"]`)?.textContent?.trim() ?? '';

            return {
                id: Number(element.getAttribute('data-user-id')),
                name: read('user-name'),
                username: read('user-username'),
                email: read('user-email'),
            };
        });
    }

    async waitForCreatedUser(): Promise<void> {
        await expect(this.createdRows.first()).toBeVisible();
    }

    async getStatusMessage(): Promise<string> {
        return this.el.getInnerText(this.statusMessage);
    }

    async getApiStatus(): Promise<string> {
        return this.el.getInnerText(this.apiStatus);
    }

    async isErrorVisible(): Promise<boolean> {
        return this.el.isVisible(this.errorMessage);
    }

    /** Fill the create form and submit it. The POST response is awaited by the test. */
    async submitCreateForm(user: { name: string; username: string; email: string }): Promise<void> {
        this.log.info(`creating user "${user.username}" through the frontend form`);
        await this.el.fill(this.nameInput, user.name);
        await this.el.fill(this.usernameInput, user.username);
        await this.el.fill(this.emailInput, user.email);
        await this.el.click(this.createButton);
    }
}

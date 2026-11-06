import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * VWO dashboard shell.
 *
 * This account lands on `#/setup/account-setup` right after login, so
 * `ensureDashboard` clicks the left-panel Home entry to reach `#/dashboard`.
 * The dashboard also shows onboarding overlays ("Account Switcher",
 * "Welcome to Wingz") that create a blocking `.modal-backdrop`; every
 * interaction that can be covered dismisses them first and retries.
 */
export class DashboardPage extends BasePage {
    private readonly homeButton: Locator;
    private readonly profileButton: Locator;
    private readonly logoutButton: Locator;
    private readonly campaignStatusHeading: Locator;
    private readonly backdrop: Locator;

    constructor(page: Page) {
        super(page, 'DashboardPage');
        this.homeButton = page.locator('button[aria-label="Go to Home"]:visible').first();
        this.profileButton = page.locator('button[aria-label="Profile menu"]:visible').first();
        this.logoutButton = page.locator('button.shell-sidebar-profile-logout:visible').first();
        this.campaignStatusHeading = page.getByRole('heading', { name: 'Campaigns status' }).first();
        this.backdrop = page.locator('.modal-backdrop');
    }

    /** Navigate from the post-login landing route to the dashboard and wait. */
    async ensureDashboard(): Promise<void> {
        if (!this.page.url().includes('/dashboard')) {
            this.log.info('post-login landing page is not the dashboard; clicking Home');
            await this.homeButton.click();
        }

        await expect(this.page).toHaveURL(/\/dashboard/, { timeout: 60_000 });
        await expect(this.campaignStatusHeading).toBeVisible({ timeout: 90_000 });

        await this.dismissBlockingModals();
    }

    /** Close onboarding/account-switcher overlays if they are present. */
    async dismissBlockingModals(): Promise<void> {
        for (let attempt = 0; attempt < 6; attempt++) {
            if ((await this.backdrop.count()) === 0) {
                return;
            }

            const gotIt = this.page.getByRole('button', { name: /ok, got it!/i }).first();

            if (await gotIt.isVisible().catch(() => false)) {
                this.log.info('dismissing account switcher modal');
                await gotIt.click();
            } else {
                const closeButton = this.page.locator('button[aria-label="Close"]:visible').first();
                if ((await closeButton.count()) === 0) {
                    return;
                }
                this.log.info('closing onboarding overlay');
                await closeButton.click({ force: true });
            }

            await this.page.waitForTimeout(1_000);
        }

        await expect(this.backdrop).toHaveCount(0);
    }

    /** Text of the profile entry shown in the left panel. */
    async getProfileName(): Promise<string> {
        return this.el.getInnerText(this.profileButton);
    }

    /** Open the left-panel profile flyout, retrying if an overlay blocks it. */
    async openProfileMenu(): Promise<void> {
        for (let attempt = 0; attempt < 4; attempt++) {
            await this.dismissBlockingModals();
            try {
                await this.profileButton.click({ timeout: 8_000 });
                await expect(this.logoutButton).toBeVisible();
                return;
            } catch {
                this.log.warn(`profile menu click attempt ${attempt + 1} blocked; retrying`);
                await this.page.waitForTimeout(1_000);
            }
        }

        await this.profileButton.click();
        await expect(this.logoutButton).toBeVisible();
    }

    async logout(): Promise<void> {
        await this.openProfileMenu();
        this.log.info('clicking Logout in the profile flyout');
        await this.logoutButton.click();
    }
}

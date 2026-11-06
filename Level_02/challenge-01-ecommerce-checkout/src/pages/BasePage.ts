import { Page } from '@playwright/test';
import { UtilElementLocator } from '@utils/UtilElementLocator';
import { createLogger, type Logger } from '@utils/logger';
import { NavBar } from '@components/NavBar';

/**
 * BasePage - shared scaffolding for every page object in this challenge.
 */
export abstract class BasePage {
    protected readonly page: Page;
    protected readonly el: UtilElementLocator;
    protected readonly log: Logger;
    readonly nav: NavBar;

    protected constructor(page: Page, scope: string) {
        this.page = page;
        this.el = new UtilElementLocator(page, scope);
        this.log = createLogger(scope);
        this.nav = new NavBar(page);
    }

    protected async goto(relativePath: string): Promise<void> {
        await this.page.goto(relativePath);
        await this.page.waitForLoadState('domcontentloaded');
    }
}

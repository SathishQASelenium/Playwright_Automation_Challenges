import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * DemoQA modal dialogs page.
 *
 * Small and Large modals share the same dialog shell; only the title, body,
 * and close button differ, so the page object exposes one content reader and
 * one close action per size.
 */
export class ModalDialogsPage extends BasePage {
    static readonly PATH = '/modal-dialogs';

    private readonly smallModalButton: Locator;
    private readonly largeModalButton: Locator;
    private readonly modal: Locator;
    private readonly modalTitle: Locator;
    private readonly modalBody: Locator;
    private readonly smallModalCloseButton: Locator;
    private readonly largeModalCloseButton: Locator;

    constructor(page: Page) {
        super(page, 'ModalDialogsPage');
        this.smallModalButton = page.locator('#showSmallModal');
        this.largeModalButton = page.locator('#showLargeModal');
        this.modal = page.locator('.modal-content');
        this.modalTitle = page.locator('.modal-title');
        this.modalBody = page.locator('.modal-body');
        this.smallModalCloseButton = page.locator('#closeSmallModal');
        this.largeModalCloseButton = page.locator('#closeLargeModal');
    }

    async open(): Promise<void> {
        await this.goto(ModalDialogsPage.PATH);
    }

    async waitForLoaded(): Promise<void> {
        await expect(this.smallModalButton).toBeVisible();
        await expect(this.largeModalButton).toBeVisible();
    }

    async openSmallModal(): Promise<void> {
        this.log.info('opening small modal');
        await this.smallModalButton.click();
        await expect(this.modal).toBeVisible();
        await expect(this.smallModalCloseButton).toBeVisible();
    }

    async openLargeModal(): Promise<void> {
        this.log.info('opening large modal');
        await this.largeModalButton.click();
        await expect(this.modal).toBeVisible();
        await expect(this.largeModalCloseButton).toBeVisible();
    }

    async getModalTitle(): Promise<string> {
        return this.el.getInnerText(this.modalTitle);
    }

    async getModalBody(): Promise<string> {
        return this.el.getInnerText(this.modalBody);
    }

    async closeSmallModal(): Promise<void> {
        await this.smallModalCloseButton.click();
        await expect(this.modal).toBeHidden();
    }

    async closeLargeModal(): Promise<void> {
        await this.largeModalCloseButton.click();
        await expect(this.modal).toBeHidden();
    }
}

import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import type { WebTableRecord } from '@testdata/webTables.data';

/**
 * DemoQA web tables page.
 *
 * Everything is addressed by ROW POSITION, never by the generated record ids
 * (e.g. #edit-record-3), so the flow matches the challenge requirement.
 */
export class WebTablesPage extends BasePage {
    static readonly PATH = '/webtables';

    private readonly table: Locator;
    private readonly rows: Locator;
    private readonly addButton: Locator;
    private readonly modal: Locator;
    private readonly submitButton: Locator;
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly emailInput: Locator;
    private readonly ageInput: Locator;
    private readonly salaryInput: Locator;
    private readonly departmentInput: Locator;

    constructor(page: Page) {
        super(page, 'WebTablesPage');
        this.table = page.locator('table');
        this.rows = this.table.locator('tbody tr');
        this.addButton = page.locator('#addNewRecordButton');
        this.modal = page.locator('.modal-content');
        this.submitButton = page.locator('#submit');

        this.firstNameInput = page.locator('#firstName');
        this.lastNameInput = page.locator('#lastName');
        this.emailInput = page.locator('#userEmail');
        this.ageInput = page.locator('#age');
        this.salaryInput = page.locator('#salary');
        this.departmentInput = page.locator('#department');
    }

    async open(): Promise<void> {
        await this.goto(WebTablesPage.PATH);
    }

    async waitForLoaded(): Promise<void> {
        await expect(this.table).toBeVisible();
        await expect(this.rows.first()).toBeVisible();
    }

    async getRowCount(): Promise<number> {
        return this.rows.count();
    }

    /** First six cells of a 1-based row position (Action column excluded). */
    async getRowValues(position: number): Promise<string[]> {
        const cells = await this.rows.nth(position - 1).locator('td').allInnerTexts();
        return cells.slice(0, 6).map((cell) => cell.trim());
    }

    async getAllRowValues(): Promise<string[][]> {
        const count = await this.getRowCount();
        const values: string[][] = [];
        for (let position = 1; position <= count; position++) {
            values.push(await this.getRowValues(position));
        }
        return values;
    }

    /** Click the Edit button inside the row at the given 1-based position. */
    async openEditDialogForRow(position: number): Promise<void> {
        this.log.info(`opening edit dialog for row ${position}`);
        await this.rows.nth(position - 1).getByTitle('Edit').click();
        await expect(this.modal).toBeVisible();
    }

    async openAddDialog(): Promise<void> {
        this.log.info('opening add record dialog');
        await this.addButton.click();
        await expect(this.modal).toBeVisible();
    }

    async fillRecordForm(record: WebTableRecord): Promise<void> {
        this.log.info(`filling record form for ${record.firstName} ${record.lastName}`);
        await this.el.fill(this.firstNameInput, record.firstName);
        await this.el.fill(this.lastNameInput, record.lastName);
        await this.el.fill(this.emailInput, record.email);
        await this.el.fill(this.ageInput, record.age);
        await this.el.fill(this.salaryInput, record.salary);
        await this.el.fill(this.departmentInput, record.department);
    }

    async submitForm(): Promise<void> {
        await this.submitButton.click();
        await expect(this.modal).toBeHidden();
    }

    async expectRowValues(position: number, expected: string[]): Promise<void> {
        await expect.poll(() => this.getRowValues(position)).toEqual(expected);
    }

    async expectRowCount(count: number): Promise<void> {
        await expect(this.rows).toHaveCount(count);
    }

    /** Find a row by its Email cell and return the first six cells. */
    async getRowValuesByEmail(email: string): Promise<string[]> {
        const count = await this.getRowCount();
        for (let position = 1; position <= count; position++) {
            const values = await this.getRowValues(position);
            if (values[3] === email) {
                return values;
            }
        }
        throw new Error(`No row found with email "${email}"`);
    }
}

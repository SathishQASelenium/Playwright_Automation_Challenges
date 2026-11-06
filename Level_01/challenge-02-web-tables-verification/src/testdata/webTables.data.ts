/**
 * Test data for the DemoQA web tables challenge.
 *
 * Column order rendered by the table:
 * First Name | Last Name | Age | Email | Salary | Department | Action
 */

export interface WebTableRecord {
    firstName: string;
    lastName: string;
    age: string;
    email: string;
    salary: string;
    department: string;
}

export const TABLE_HEADERS = [
    'First Name',
    'Last Name',
    'Age',
    'Email',
    'Salary',
    'Department',
    'Action',
] as const;

/** Third row as loaded from https://demoqa.com/webtables. */
export const existingThirdRow: WebTableRecord = {
    firstName: 'Kierra',
    lastName: 'Gentry',
    age: '29',
    email: 'kierra@example.com',
    salary: '2000',
    department: 'Legal',
};

/** Values used to overwrite the third row through its Edit dialog. */
export const updatedThirdRow: WebTableRecord = {
    firstName: 'Kierra',
    lastName: 'Gentry-Updated',
    age: '30',
    email: 'kierra.updated@example.com',
    salary: '9500',
    department: 'Automation',
};

/** New record added via the Add dialog. */
export const newRecord: WebTableRecord = {
    firstName: 'Sathish',
    lastName: 'Kumar A S',
    age: '42',
    email: 'sathish_qc_lead@hotmail.com',
    salary: '10000',
    department: 'Automation Engineer',
};

/** First six cells of a row, in table column order. */
export function recordToCells(record: WebTableRecord): string[] {
    return [
        record.firstName,
        record.lastName,
        record.age,
        record.email,
        record.salary,
        record.department,
    ];
}

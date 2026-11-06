import { APIResponse, expect } from '@playwright/test';

export type JsonRecord = Record<string, unknown>;

/** Assert the transport-level contract shared by every JSONPlaceholder response. */
export function assertJsonResponse(response: APIResponse, expectedStatus: number): void {
    expect(response.status()).toBe(expectedStatus);
    expect(response.headers()['content-type']).toContain('application/json');
}

/** Assert the complete user shape returned by `GET /users`. */
export function assertUserShape(user: JsonRecord): void {
    expect(typeof user.id).toBe('number');
    expect(typeof user.name).toBe('string');
    expect(typeof user.username).toBe('string');
    expect(typeof user.email).toBe('string');
    expect(typeof user.phone).toBe('string');
    expect(typeof user.website).toBe('string');

    const address = user.address as JsonRecord;
    expect(typeof address.street).toBe('string');
    expect(typeof address.suite).toBe('string');
    expect(typeof address.city).toBe('string');
    expect(typeof address.zipcode).toBe('string');

    const geo = address.geo as JsonRecord;
    expect(typeof geo.lat).toBe('string');
    expect(typeof geo.lng).toBe('string');

    const company = user.company as JsonRecord;
    expect(typeof company.name).toBe('string');
    expect(typeof company.catchPhrase).toBe('string');
    expect(typeof company.bs).toBe('string');
}

/**
 * test-base - custom Playwright `test` with an API request context targeting
 * JSONPlaceholder and a page object for the local frontend harness.
 */

import { test as base, type APIRequestContext } from '@playwright/test';
import { appConfig } from '@config/appConfig';
import { UsersFrontendPage } from '@pages/UsersFrontendPage';

export type TestFixture = {
    /** Isolated request context bound to the JSONPlaceholder API base URL. */
    api: APIRequestContext;
    usersFrontendPage: UsersFrontendPage;
};

export const test = base.extend<TestFixture>({
    api: async ({ playwright }, use) => {
        const api = await playwright.request.newContext({
            baseURL: appConfig.apiBaseURL,
            extraHTTPHeaders: { Accept: 'application/json' },
        });

        await use(api);
        await api.dispose();
    },
    usersFrontendPage: async ({ page }, use) => {
        await use(new UsersFrontendPage(page));
    },
});

export { expect } from '@playwright/test';

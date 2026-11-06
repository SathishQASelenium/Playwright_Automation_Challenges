/**
 * Step 3 - integrate the API assertions with the frontend harness.
 *
 * JSONPlaceholder is a fake API: POST returns a 201 with a generated id, but
 * the record is not persisted (GET /users/11 is 404 afterwards). The frontend
 * therefore performs the POST itself and renders the response, which lets this
 * suite verify both the API payload and the UI in one flow.
 */

import { test, expect } from '@fixtures/test-base';
import { newUser } from '@testdata/users';
import { visualStep } from '@utils/visualStep';
import { createLogger } from '@utils/logger';

const log = createLogger('users-frontend-integration');

type ApiUser = {
    id: number;
    name: string;
    username: string;
    email: string;
};

test.describe('@P0 @Integration API and frontend data consistency', () => {
    test('renders every user returned by GET /users', async ({ api, page, usersFrontendPage }) => {
        const response = await api.get('/users');
        expect(response.status()).toBe(200);
        const apiUsers = (await response.json()) as ApiUser[];
        expect(apiUsers).toHaveLength(10);

        await visualStep(page, 'Open the frontend users page', async () => {
            await usersFrontendPage.open();
            await usersFrontendPage.waitForUsersLoaded();
        });

        await visualStep(page, 'Compare the API collection with the rendered table', async () => {
            expect(await usersFrontendPage.getRowCount()).toBe(apiUsers.length);
            expect(await usersFrontendPage.isErrorVisible()).toBe(false);

            const uiUsers = await usersFrontendPage.getUsers();

            for (const apiUser of apiUsers) {
                const uiUser = uiUsers.find((candidate) => candidate.id === apiUser.id);
                expect(uiUser, `row for API user ${apiUser.id}`).toBeDefined();
                expect(uiUser).toMatchObject({
                    id: apiUser.id,
                    name: apiUser.name,
                    username: apiUser.username,
                    email: apiUser.email,
                });
            }

            log.info(`all ${apiUsers.length} API users match the frontend table`);
        });
    });

    test('displays the user created through POST /users', async ({ page, usersFrontendPage }) => {
        await visualStep(page, 'Open the frontend users page', async () => {
            await usersFrontendPage.open();
            await usersFrontendPage.waitForUsersLoaded();
        });

        let created!: ApiUser;

        await visualStep(page, 'Create a user through the API from the frontend form', async () => {
            const [response] = await Promise.all([
                page.waitForResponse(
                    (res) => res.request().method() === 'POST' && new URL(res.url()).pathname === '/users',
                ),
                usersFrontendPage.submitCreateForm(newUser),
            ]);

            expect(response.status()).toBe(201);
            created = (await response.json()) as ApiUser;

            expect(created).toMatchObject(newUser);
            expect(created.id).toBe(11);
            log.info(`POST /users returned 201 with id ${created.id}`);
        });

        await visualStep(page, 'Verify the created API data is rendered on the frontend', async () => {
            await usersFrontendPage.waitForCreatedUser();

            const uiUser = await usersFrontendPage.getCreatedUser();
            expect(uiUser).toEqual({
                id: created.id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
            });
            expect(await usersFrontendPage.getApiStatus()).toBe('201 Created');
            expect(await usersFrontendPage.getStatusMessage()).toContain('created via the API');

            log.info(`frontend rendered created user ${uiUser.id} with matching values`);
        });
    });
});

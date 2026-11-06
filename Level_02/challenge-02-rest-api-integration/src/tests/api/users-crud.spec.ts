/**
 * Step 1 and Step 2 - full CRUD coverage against the JSONPlaceholder users
 * resource, with response status, headers, schema and payload assertions.
 */

import { test, expect } from '@fixtures/test-base';
import { appConfig } from '@config/appConfig';
import { assertJsonResponse, assertUserShape, type JsonRecord } from '@utils/apiAssertions';
import { newUser, patchedName, replacementUser } from '@testdata/users';
import { createLogger } from '@utils/logger';

const log = createLogger('api-users-crud');

test.describe('@P0 @API JSONPlaceholder users CRUD', () => {
    test('GET /users returns the seeded collection with a valid schema', async ({ api }) => {
        const response = await api.get('/users');
        assertJsonResponse(response, 200);

        const users = (await response.json()) as JsonRecord[];
        expect(Array.isArray(users)).toBe(true);
        expect(users).toHaveLength(appConfig.expectedUserCount);

        for (const user of users) {
            assertUserShape(user);
        }

        expect(users[0]).toMatchObject(appConfig.knownUser);
        log.info(`GET /users returned ${users.length} schema-valid users`);
    });

    test('GET /users/1 returns the expected user', async ({ api }) => {
        const response = await api.get('/users/1');
        assertJsonResponse(response, 200);

        const user = (await response.json()) as JsonRecord;
        expect(user).toMatchObject(appConfig.knownUser);
        expect(user.address).toMatchObject({ city: 'Gwenborough', zipcode: '92998-3874' });
        expect(user.company).toMatchObject({ name: 'Romaguera-Crona' });
        log.info(`GET /users/1 returned "${String(user.name)}"`);
    });

    test('GET /users?username=Bret filters to a single user', async ({ api }) => {
        const response = await api.get('/users', { params: { username: 'Bret' } });
        assertJsonResponse(response, 200);

        const users = (await response.json()) as JsonRecord[];
        expect(users).toHaveLength(1);
        expect(users[0]).toMatchObject(appConfig.knownUser);
    });

    test('GET /users/999 returns 404 with an empty body', async ({ api }) => {
        const response = await api.get('/users/999');
        assertJsonResponse(response, 404);
        expect(await response.json()).toEqual({});
    });

    test('POST /users creates a user and echoes the payload with an id', async ({ api }) => {
        const response = await api.post('/users', { data: newUser });
        assertJsonResponse(response, 201);

        const created = (await response.json()) as JsonRecord;
        expect(created).toMatchObject(newUser);
        expect(created.id).toBe(11);
        log.info(`POST /users returned 201 with id ${String(created.id)}`);
    });

    test('PUT /users/1 replaces the editable user fields', async ({ api }) => {
        const response = await api.put('/users/1', { data: { id: 1, ...replacementUser } });
        assertJsonResponse(response, 200);

        const updated = (await response.json()) as JsonRecord;
        expect(updated).toMatchObject({ id: 1, ...replacementUser });
        log.info('PUT /users/1 echoed the replacement payload');
    });

    test('PATCH /users/1 updates only the supplied field', async ({ api }) => {
        const response = await api.patch('/users/1', { data: { name: patchedName } });
        assertJsonResponse(response, 200);

        const patched = (await response.json()) as JsonRecord;
        expect(patched.name).toBe(patchedName);
        expect(patched.email).toBe(appConfig.knownUser.email);
        expect(patched.username).toBe(appConfig.knownUser.username);
        expect(patched.id).toBe(1);
        log.info('PATCH /users/1 changed the name and preserved the other fields');
    });

    test('DELETE /users/1 acknowledges the deletion', async ({ api }) => {
        const response = await api.delete('/users/1');
        assertJsonResponse(response, 200);
        expect(await response.json()).toEqual({});
        log.info('DELETE /users/1 returned 200 with an empty object');
    });
});

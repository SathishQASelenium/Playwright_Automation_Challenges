export type NewUserPayload = {
    name: string;
    username: string;
    email: string;
};

/** Payload posted by both the API tests and the frontend integration test. */
export const newUser: NewUserPayload = {
    name: 'TTA API User',
    username: 'tta_api_user',
    email: 'tta.api.user@example.com',
};

/** Full replacement body used by the PUT contract test. */
export const replacementUser: NewUserPayload = {
    name: 'Leanne Graham Updated',
    username: 'Bret.updated',
    email: 'leanne.updated@example.com',
};

/** Partial body used by the PATCH contract test. */
export const patchedName = 'Leanne Patched';

/**
 * appConfig - environment-driven settings for the JSONPlaceholder REST API
 * challenge.
 *
 * playwright.config.ts calls dotenv.config() before any spec is loaded, so the
 * values below can be overridden through `.env`.
 */

export const appConfig = {
    /** API under test. */
    apiBaseURL: process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com',
    /** Local frontend harness started by the Playwright webServer. */
    frontendURL: process.env.FRONTEND_URL ?? 'http://127.0.0.1:4173',
    /** JSONPlaceholder seeds exactly ten users. */
    expectedUserCount: 10,
    /** Stable reference row used by the contract tests. */
    knownUser: {
        id: 1,
        name: 'Leanne Graham',
        username: 'Bret',
        email: 'Sincere@april.biz',
    },
} as const;

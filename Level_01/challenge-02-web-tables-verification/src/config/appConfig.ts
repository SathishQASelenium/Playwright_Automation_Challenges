/**
 * appConfig - environment-driven settings for the DemoQA web tables challenge.
 *
 * playwright.config.ts calls dotenv.config() before any spec is loaded, so the
 * values below can be overridden through `.env`.
 */

export const appConfig = {
    baseURL: process.env.BASE_URL ?? 'https://demoqa.com',
    webTablesPath: '/webtables',
} as const;

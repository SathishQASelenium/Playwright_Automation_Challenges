/**
 * appConfig - environment-driven settings for the Applitools demo app.
 *
 * playwright.config.ts calls dotenv.config() before any spec is loaded, so the
 * values below can be overridden through `.env`. The fallbacks are the public
 * demo credentials, so the suite runs on a fresh clone without any secrets.
 */

export const appConfig = {
    baseURL: process.env.BASE_URL ?? 'https://demo.applitools.com',
    loginPath: '/',
    dashboardPath: '/app.html',
    credentials: {
        username: process.env.APPLITOOLS_USERNAME ?? 'Admin',
        password: process.env.APPLITOOLS_PASSWORD ?? 'Password@123',
    },
    /** Signed transaction amounts on app.html net to this value. */
    expectedMonthlyTotal: 1996.22,
} as const;

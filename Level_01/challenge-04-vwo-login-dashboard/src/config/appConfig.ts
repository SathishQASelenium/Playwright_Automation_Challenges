/**
 * appConfig - environment-driven settings for the VWO login/dashboard
 * challenge.
 *
 * playwright.config.ts calls dotenv.config() before any spec is loaded, so the
 * values below can be overridden through `.env`. The fallbacks are the public
 * challenge credentials, so the suite runs on a fresh clone.
 */

export const appConfig = {
    baseURL: process.env.BASE_URL ?? 'https://app.wingify.com',
    loginPath: '/#/login',
    credentials: {
        username: process.env.VWO_USERNAME ?? 'r97ain68@1sec.email',
        password: process.env.VWO_PASSWORD ?? 'Password@123',
    },
    /** Name shown in the left-panel profile button after login. */
    expectedDisplayName: process.env.VWO_DISPLAY_NAME ?? 'TTA User',
} as const;

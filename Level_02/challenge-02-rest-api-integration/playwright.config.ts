import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const frontendURL = process.env.FRONTEND_URL ?? 'http://127.0.0.1:4173';

export default defineConfig({
    testDir: './src/tests',
    timeout: 90_000,
    expect: { timeout: 10_000 },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 4 : undefined,
    reporter: [
        ['./src/utils/CustomTTAReporter.ts'],
        ['html', { outputFolder: 'playwright-report' }],
        ['list'],
    ],
    // The local frontend harness is started once for the integration tests.
    // API-only tests never touch it.
    webServer: {
        command: 'node src/frontend/server.js',
        url: frontendURL,
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
    },
    use: {
        baseURL: frontendURL,
        screenshot: 'only-on-failure',
        video: 'on',
        trace: 'on-first-retry',
        actionTimeout: 15_000,
        navigationTimeout: 60_000,
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ],
});

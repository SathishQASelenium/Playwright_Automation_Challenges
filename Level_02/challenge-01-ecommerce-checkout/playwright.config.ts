import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const baseURL = process.env.BASE_URL ?? 'https://www.automationexercise.com';

export default defineConfig({
    testDir: './src/tests',
    timeout: 180_000,
    expect: { timeout: 15_000 },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 4 : undefined,
    reporter: [
        ['./src/utils/CustomTTAReporter.ts'],
        ['html', { outputFolder: 'playwright-report' }],
        ['list'],
    ],
    use: {
        baseURL,
        screenshot: 'only-on-failure',
        video: 'on',
        trace: 'on-first-retry',
        actionTimeout: 20_000,
        navigationTimeout: 60_000,
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ],
});

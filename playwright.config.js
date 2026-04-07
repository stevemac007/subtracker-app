import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 360_000,
    expect: { timeout: 10_000 },
    use: {
        baseURL: 'http://localhost:4173',
        headless: true,
    },
    projects: [
        { name: 'chromium', use: { browserName: 'chromium' } },
    ],
    webServer: {
        command: 'npm run preview',
        port: 4173,
        reuseExistingServer: true,
    },
});

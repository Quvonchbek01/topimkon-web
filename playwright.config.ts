import { defineConfig, devices } from '@playwright/test';

/**
 * E2E testlar real Supabase bazasiga ulangan lokal yoki staging saytga qarshi ishlaydi.
 * E2E_BASE_URL berilmasa localhost:3000 ishlatiladi; serverni alohida ishga tushiring.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 30_000,
  expect: { timeout: 8_000 },
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://127.0.0.1:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ...devices['Desktop Chrome'],
  },
});

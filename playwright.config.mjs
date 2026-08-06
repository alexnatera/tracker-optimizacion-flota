import { defineConfig, devices } from '@playwright/test';

/**
 * Por defecto corre contra un servidor estatico local sobre los archivos
 * del repo, asi el smoke test valida lo que se esta por publicar y no lo
 * que ya esta publicado.
 *
 * Para correrlo contra el sitio real:
 *   BASE_URL=https://alexnatera.github.io/tracker-optimizacion-flota npm run smoke
 */
const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:4173';
const esLocal = BASE_URL.startsWith('http://127.0.0.1');

export default defineConfig({
  testDir: './tests',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],

  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'escritorio', use: { ...devices['Desktop Chrome'] } },
    { name: 'telefono',   use: { ...devices['Pixel 7'] } },
  ],

  webServer: esLocal
    ? {
        command: 'npx --yes http-server . -p 4173 --silent',
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
      }
    : undefined,
});

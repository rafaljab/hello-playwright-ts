import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";
import { envConfig } from "./conf/env";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config();

// Set environment-specific variables
const ENV = process.env.ENV;
if (!ENV || !["local", "prod"].includes(ENV)) {
  console.log(
    `
    Incorrect environment value (ENV) was provided.
    Make sure the ENV variable is defined correctly.
    You can define it in the .env file or add it before calling the command (e.g. 'ENV=local <command>').
    Available options: local|prod.
    `,
  );
  process.exit();
}

export const GUI_BASE_URL = envConfig[ENV].guiBaseUrl;
export const RELATIVE_URL = "/gui-automation-playground";
export const STORAGE_STATE_PATH = "./src/test-data/.storage-state/";
export const authUserStorageStateFile = STORAGE_STATE_PATH + "authenticated-user.json";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./src/tests",

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: "./results/playwright-results",

  /* Maximum time one test can run for. */
  timeout: 30 * 1000,

  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  workers: undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["html", { outputFolder: "./reports/html-report", open: "never" }]],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,

    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: GUI_BASE_URL,

    headless: true,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    launchOptions: {
      slowMo: process.env.SLOWMO ? 1000 : 0,
    },
  },

  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ },

    {
      name: "gui-chromium",
      testDir: "./src/tests/gui/",
      use: { ...devices["Desktop Chrome"], storageState: authUserStorageStateFile },
      dependencies: ["setup"],
    },
  ],
});

import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const vitestConfig = defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "node",
          environment: "node",
        },
      },
      {
        test: {
          name: "chromium",
          browser: {
            enabled: true,
            instances: [{ browser: "chromium" }],
            provider: playwright(),
            headless: true,
            ui: false,
            screenshotFailures: false,
          },
        },
      },
    ],
  },
});

export default vitestConfig;

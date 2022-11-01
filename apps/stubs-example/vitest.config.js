/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    testTimeout: 50000,
    globals: true,
    // happy-dom doesn't support button submit or FormData
    // https://github.com/capricorn86/happy-dom/issues/527
    // https://github.com/capricorn86/happy-dom/issues/585
    environment: "jsdom",
    setupFiles: ["./test/setup-test-env.ts"],
    include: ["./**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    watchExclude: [
      ".*\\/node_modules\\/.*",
      ".*\\/build\\/.*",
      ".*\\/postgres-data\\/.*",
    ],
  },
});

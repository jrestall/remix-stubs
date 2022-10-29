import type { StorybookConfig } from "@storybook/builder-vite";

const config: StorybookConfig = {
  stories: [
    "../app/components/**/*.stories.mdx",
    "../app/components/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  core: {
    builder: "@storybook/builder-vite",
  },
  async viteFinal(config, options) {
    // Add your configuration here
    config.optimizeDeps = {
      exclude: ["@remix-run/react"],
      include: ["@remix-run/react/dist/components.js"],
    };
    return config;
  },
  framework: "@storybook/react-vite",
};

export default config;

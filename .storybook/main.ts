import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: ["@chromatic-com/storybook", "@storybook/addon-a11y", "@storybook/addon-docs"],
    framework: "@storybook/nextjs-vite",
    staticDirs: [
        "../public",
        // Serve Sagamore sample imagery at a stable URL (sagamore-images/...) in
        // both dev and static builds, independent of Vite asset resolution.
        { from: "../images/sagamore", to: "/sagamore-images" },
    ],
    // When building for GitHub Pages the site is served from a repo subpath, so
    // the production bundle needs that base. Dev stays at root.
    viteFinal: async (viteConfig, { configType }) => {
        if (configType === "PRODUCTION") {
            viteConfig.base = "/tf-buck-ds-v1/";
        }
        return viteConfig;
    },
};

export default config;

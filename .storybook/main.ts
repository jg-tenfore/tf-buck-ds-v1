import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: ["@chromatic-com/storybook", "@storybook/addon-a11y", "@storybook/addon-docs"],
    framework: "@storybook/nextjs-vite",
    staticDirs: [
        "../public",
        // Serve sample imagery at stable URLs (…-images/...) in both dev and
        // static builds, independent of Vite asset resolution. Used by stories
        // and upcoming app screens (Sagamore course, Pro Shop store, etc.).
        { from: "../images/sagamore", to: "/sagamore-images" },
        { from: "../images/store/images", to: "/store-images" },
        { from: "../images/creditCards", to: "/card-images" },
        { from: "../images/events", to: "/events-images" },
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

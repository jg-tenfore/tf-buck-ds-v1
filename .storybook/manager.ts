import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

addons.setConfig({
    // TenFore's logo in place of Storybook's, top of the sidebar.
    theme: create({
        base: "light",
        brandTitle: "TenFore · Buck design system",
        brandImage: "./tenfore-logo.svg",
        brandUrl: "./?path=/docs/start-here-overview--docs",
        brandTarget: "_self",
    }),
    // The archive is kept, not featured: its folder starts closed in the sidebar.
    sidebar: { collapsedRoots: ["archive"] },
});

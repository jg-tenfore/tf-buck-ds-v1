import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { URL, fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { routePages, routesFromSource } from "./vite-route-pages";

/**
 * "Buck V1 Old — Course Settings" prototype — its own local, separate from
 * Storybook (6018) and the main prototype app (6019). Run via
 * `npm run proto:course-settings` → http://localhost:6020.
 *
 * Named so Storybook's Vite builder never picks it up (same reason as
 * vite.app.config.ts).
 */
const projectRoot = fileURLToPath(new URL(".", import.meta.url));

/**
 * Where the prototype is served from. Default: root (`npm run proto:course-settings`).
 * CI also builds it into the Storybook sites:
 *   APP_BASE=/tf-buck-ds-v1/course-settings/  APP_OUT_DIR=storybook-static/course-settings  (GitHub Pages)
 *   APP_BASE=/course-settings/                APP_OUT_DIR=storybook-static/course-settings  (Netlify backup)
 */
const BASE = process.env.APP_BASE ?? "/";
const OUT_DIR = process.env.APP_OUT_DIR ? resolve(process.env.APP_OUT_DIR) : fileURLToPath(new URL("./dist-buck-v1-old", import.meta.url));

export default defineConfig({
    root: fileURLToPath(new URL("./prototypes/buck-v1-old-course-settings", import.meta.url)),
    // Reuse the project's public/ (course imagery lives in public/buck-v1-old/).
    publicDir: fileURLToPath(new URL("./public", import.meta.url)),
    base: BASE,
    // Real pages for each concept route, so deep links work on GitHub Pages.
    plugins: [react(), tailwindcss(), routePages(routesFromSource("prototypes/buck-v1-old-course-settings/main.tsx"))],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    build: {
        outDir: OUT_DIR,
        emptyOutDir: true,
    },
    server: {
        port: 6020,
        strictPort: true,
        host: true,
        fs: { allow: [projectRoot] },
    },
});

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { URL, fileURLToPath } from "node:url";
import { type Plugin, defineConfig } from "vite";
import { routePages, routesFromSource } from "./vite-route-pages";

/**
 * Where the app is served from. Default: its own site root (tf-buck-prototype.netlify.app,
 * `npm run app`). CI also builds it into the Storybook sites under a sub-path:
 *   APP_BASE=/tf-buck-ds-v1/app/  APP_OUT_DIR=storybook-static/app   (GitHub Pages)
 *   APP_BASE=/app/                APP_OUT_DIR=storybook-static/app   (Netlify backup)
 */
const BASE = process.env.APP_BASE ?? "/";
const OUT_DIR = process.env.APP_OUT_DIR ? resolve(process.env.APP_OUT_DIR) : fileURLToPath(new URL("./dist-app", import.meta.url));

/** Write a Netlify SPA fallback so deep links (e.g. /orders/all) and refresh work on the static host. */
const spaRedirects = (): Plugin => ({
    name: "spa-redirects",
    apply: "build",
    closeBundle() {
        // Only meaningful on the app's own Netlify site (served from the root).
        if (BASE === "/") writeFileSync(`${OUT_DIR}/_redirects`, "/*    /index.html   200\n");
    },
});

/**
 * Standalone Tenfore app — the clickable prototype running as its OWN local,
 * fully separate from Storybook and the Next.js app.
 *
 * Why Vite (not Next dev): Vite serves modules to the browser on demand, so the
 * app only ever loads the screen you're viewing. Next's Turbopack pre-bundles
 * the whole page, which — with 65 chart-heavy screens — spikes dev memory. This
 * is the same engine Storybook already uses to render these screens smoothly.
 *
 * Named `vite.app.config.ts` (not `vite.config.ts`) so Storybook's own Vite
 * builder never picks it up. Run via `npm run app`.
 */
const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
    // Serve the app from ./standalone (index.html lives there).
    root: fileURLToPath(new URL("./standalone", import.meta.url)),
    // Reuse the project's public/ (carries the image symlinks: /sagamore-images, …).
    publicDir: fileURLToPath(new URL("./public", import.meta.url)),
    base: BASE,
    plugins: [
        react(),
        tailwindcss(),
        spaRedirects(),
        // Real pages for every screen route, so deep links work on GitHub Pages.
        routePages(
            routesFromSource("src/components/application/prototype/screen-registry.tsx", "src/components/application/app-navigation/tenfore-nav-data.tsx"),
        ),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    build: {
        // Emit outside the standalone root so it doesn't clash with dev.
        outDir: OUT_DIR,
        emptyOutDir: true,
    },
    server: {
        port: 6019,
        host: true,
        // Allow importing from ../src (outside the standalone root).
        fs: { allow: [projectRoot] },
    },
});

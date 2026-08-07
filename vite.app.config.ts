import { writeFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const OUT_DIR = fileURLToPath(new URL("./dist-app", import.meta.url));

/** Write a Netlify SPA fallback so deep links (e.g. /orders/all) and refresh work on the static host. */
const spaRedirects = (): Plugin => ({
    name: "spa-redirects",
    apply: "build",
    closeBundle() {
        writeFileSync(`${OUT_DIR}/_redirects`, "/*    /index.html   200\n");
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
    plugins: [react(), tailwindcss(), spaRedirects()],
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

import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

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
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        port: 6019,
        host: true,
        // Allow importing from ../src (outside the standalone root).
        fs: { allow: [projectRoot] },
    },
});

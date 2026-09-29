import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { URL, fileURLToPath } from "node:url";
import { defineConfig } from "vite";

/**
 * "Buck V1 Old — Course Settings" prototype — its own local, separate from
 * Storybook (6018) and the main prototype app (6019). Run via
 * `npm run proto:course-settings` → http://localhost:6020.
 *
 * Named so Storybook's Vite builder never picks it up (same reason as
 * vite.app.config.ts).
 */
const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
    root: fileURLToPath(new URL("./prototypes/buck-v1-old-course-settings", import.meta.url)),
    // Reuse the project's public/ (course imagery lives in public/buck-v1-old/).
    publicDir: fileURLToPath(new URL("./public", import.meta.url)),
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    build: {
        outDir: fileURLToPath(new URL("./dist-buck-v1-old", import.meta.url)),
        emptyOutDir: true,
    },
    server: {
        port: 6020,
        strictPort: true,
        host: true,
        fs: { allow: [projectRoot] },
    },
});

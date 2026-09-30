import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Plugin } from "vite";

/**
 * Static hosts without a single-page-app fallback (GitHub Pages) 404 on a
 * deep link like `/tf-buck-ds-v1/app/orders/all`. After the build, copy
 * `index.html` into a folder per known route so every URL is a real page —
 * the app then reads the route from the address bar as usual. (Vite emits
 * base-prefixed asset URLs, so the copies work from any depth.)
 */
export const routePages = (routes: () => string[]): Plugin => {
    let outDir = "";
    return {
        name: "route-pages",
        apply: "build",
        configResolved(config) {
            outDir = config.build.outDir;
        },
        closeBundle() {
            const index = join(outDir, "index.html");
            for (const route of new Set(routes())) {
                const clean = route.replace(/^\/+|\/+$/g, "");
                if (!clean) continue;
                mkdirSync(join(outDir, clean), { recursive: true });
                copyFileSync(index, join(outDir, clean, "index.html"));
            }
        },
    };
};

/** Every `"/path": …` key and `href: "/path"` in the given source files. */
export const routesFromSource =
    (...files: string[]) =>
    () =>
        files.flatMap((file) => [...readFileSync(file, "utf8").matchAll(/(?:^\s+"|href:\s*")(\/[a-z0-9\-/]+)"/gim)].map((m) => m[1]));

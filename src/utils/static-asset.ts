/**
 * URL for a file served from the static image folders (`sagamore-images/`,
 * `store-images/`, `buck-v1-old/`, …), prefixed with the build's base path.
 *
 * Relative paths only work on the page that happens to sit at the site root:
 * a standalone app on a nested route (`/my-golf-course/dashboard`) or served
 * from a sub-path (GitHub Pages: `/tf-buck-ds-v1/app/`) would resolve them
 * against the wrong folder. Vite sets `BASE_URL` per build (Storybook on Pages,
 * the prototype apps); outside Vite it falls back to the site root.
 */
const BASE = ((import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? "/").replace(/\/?$/, "/");

export const staticAsset = (path: string): string => {
    if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith("data:")) return path;
    return `${BASE}${path.replace(/^\/+/, "")}`;
};

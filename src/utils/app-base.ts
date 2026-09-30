/**
 * Routing helpers for the standalone prototype apps when they're served from a
 * sub-path (GitHub Pages: `/tf-buck-ds-v1/app/`, Netlify backup: `/app/`).
 *
 * Screens are keyed by in-app routes (`/orders/all`); the browser address bar
 * carries the base in front (`/tf-buck-ds-v1/app/orders/all`). Vite sets
 * `BASE_URL` per build; locally and on a dedicated site it's just `/`.
 */
const BASE = ((import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? "/").replace(/\/+$/, "");

/** Browser pathname → in-app route (base removed, no trailing slash). */
export const toAppPath = (pathname: string): string => {
    const withoutBase = BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
    const trimmed = withoutBase.replace(/\/+$/, "");
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

/** In-app route → browser pathname (base added). */
export const toBrowserPath = (route: string): string => `${BASE}${route.startsWith("/") ? route : `/${route}`}`;

"use client";

import { Suspense, useEffect, useState } from "react";
import { RouterProvider } from "react-aria-components";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { CommandMenu } from "@/components/application/command-menu/command-menu";
import { SidebarNavigationDualTier } from "@/components/application/app-navigation/sidebar-navigation/sidebar-dual-tier";
import { TENFORE_COMMAND_GROUPS, TENFORE_NAV_ITEMS } from "@/components/application/app-navigation/tenfore-nav-data";
import { MissingScreen } from "./missing-screen";
import { PrototypeContext } from "./prototype-context";
import { DEFAULT_URL, SCREEN_REGISTRY } from "./screen-registry";

/**
 * Resolve a clicked nav URL to the screen we should actually show. Exact matches
 * win; clicking a top-level section (e.g. "/golf") jumps to its first built
 * sub-screen so a section header never dead-ends on the placeholder.
 */
const resolveUrl = (href: string): string => {
    if (SCREEN_REGISTRY[href]) return href;

    const section = TENFORE_NAV_ITEMS.find((item) => item.href === href);
    const firstBuiltChild = section?.items?.find((item) => item.href && SCREEN_REGISTRY[item.href]);
    return firstBuiltChild?.href ?? href;
};

/** The current screen URL taken from the browser's address bar (for deeplinks + refresh). */
const urlFromLocation = (): string => {
    if (typeof window === "undefined") return DEFAULT_URL;
    const path = window.location.pathname;
    return path && path !== "/" ? path : DEFAULT_URL;
};

/**
 * A standalone, clickable prototype of the Tenfore back-office. It renders the
 * real Global Nav (dual-tier sidebar + ⌘K command menu) once, and every nav
 * click swaps the screen in place — no page reload — by reusing the exact same
 * components shown under "App Screens/…".
 *
 * Navigation works by nesting a React-Aria `RouterProvider` whose `navigate`
 * updates local state, so every `href` link in the sidebar drives the app.
 */
export const PrototypeApp = ({ initialUrl }: { initialUrl?: string }) => {
    // Initial screen comes from the URL (so deeplinks + refresh land on the right
    // screen); an explicit `initialUrl` prop overrides it.
    const [active, setActive] = useState(() => resolveUrl(initialUrl ?? urlFromLocation()));
    const [isCommandOpen, setIsCommandOpen] = useState(false);

    const go = (href?: string) => {
        if (!href) return;
        const url = resolveUrl(href);
        setActive(url);
        setIsCommandOpen(false);
        // Push the new screen into the address bar so it's deep-linkable and
        // back/forward works — just like navigating a real app.
        if (typeof window !== "undefined" && window.location.pathname !== url) {
            window.history.pushState({}, "", url);
        }
        // Reset scroll so each screen starts at the top, like a real page load.
        if (typeof window !== "undefined") window.scrollTo({ top: 0 });
    };

    // On first mount, normalize the address bar to the resolved screen (e.g. a
    // deeplink to "/golf" becomes "/golf/tee-sheet/daily") without adding history.
    useEffect(() => {
        if (typeof window !== "undefined" && window.location.pathname !== active) {
            window.history.replaceState({}, "", active);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Keep the app in sync when the user hits back/forward.
    useEffect(() => {
        const onPopState = () => setActive(resolveUrl(urlFromLocation()));
        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, []);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                setIsCommandOpen((open) => !open);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    const Screen = SCREEN_REGISTRY[active];

    return (
        <RouterProvider navigate={(href) => go(href)}>
            <div className="flex min-h-screen bg-secondary">
                <SidebarNavigationDualTier activeUrl={active} items={TENFORE_NAV_ITEMS} onSearchClick={() => setIsCommandOpen(true)} />

                <main className="flex min-h-screen min-w-0 flex-1 flex-col">
                    <PrototypeContext.Provider value={true}>
                        {/* Each screen is a lazily-loaded, code-split chunk — Suspense covers
                            the brief load while a screen you haven't visited yet compiles. */}
                        <Suspense
                            fallback={
                                <div className="flex flex-1 items-center justify-center py-24">
                                    <LoadingIndicator type="dot-circle" size="md" label="Loading…" />
                                </div>
                            }
                        >
                            {Screen ? <Screen /> : <MissingScreen url={active} />}
                        </Suspense>
                    </PrototypeContext.Provider>
                </main>

                <CommandMenu
                    isOpen={isCommandOpen}
                    onOpenChange={setIsCommandOpen}
                    groups={TENFORE_COMMAND_GROUPS}
                    onSelect={(href) => go(href)}
                    placeholder="Search navigation…"
                />
            </div>
        </RouterProvider>
    );
};

"use client";

import { type ReactNode, useEffect, useState } from "react";
import { CommandMenu } from "@/components/application/command-menu/command-menu";
import { SidebarNavigationDualTier } from "./sidebar-navigation/sidebar-dual-tier";
import { TENFORE_COMMAND_GROUPS, TENFORE_NAV_ITEMS } from "./tenfore-nav-data";

/**
 * The Tenfore app shell: the dual-tier Global Nav sidebar + a ⌘K command menu,
 * with the screen rendered in the main content area. Wrap any App Screen story
 * in this so it looks like the real app.
 *
 * @example
 * <AppShell activeUrl="/golf/tee-sheet/daily">
 *   <TeeSheetScreen />
 * </AppShell>
 */
export const AppShell = ({ activeUrl, children }: { activeUrl?: string; children: ReactNode }) => {
    const [isCommandOpen, setIsCommandOpen] = useState(false);
    const [active, setActive] = useState(activeUrl);

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

    return (
        <div className="flex min-h-screen bg-secondary">
            <SidebarNavigationDualTier activeUrl={active} items={TENFORE_NAV_ITEMS} onSearchClick={() => setIsCommandOpen(true)} />

            <main className="min-w-0 flex-1">{children}</main>

            <CommandMenu
                isOpen={isCommandOpen}
                onOpenChange={setIsCommandOpen}
                groups={TENFORE_COMMAND_GROUPS}
                onSelect={setActive}
                placeholder="Search navigation…"
            />
        </div>
    );
};

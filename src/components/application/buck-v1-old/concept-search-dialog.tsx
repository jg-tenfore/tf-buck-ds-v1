"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchLg } from "@untitledui/icons";
import { RelayoutSections } from "./concept-relayout";
import { ConceptShell, RailCard, SectionIndex, scrollToSection, useActiveSection } from "./concept-shell";
import { SECTIONS } from "./course-settings-page";
import type { CommandNavigator } from "./settings-command-bar";
import { SettingsCommandDialog } from "./settings-command-bar";
import { ToggleListVariant } from "./settings-kit";
import { SettingsSearchProvider, revealItem } from "./settings-search";

/**
 * Concept 4 — Re-laid out + search dialog.
 *
 * Concept 1's redesigned page, with concept 3's Google-style command search
 * opened as a dialog from the left rail (or ⌘K). Every section is rendered,
 * so the search indexes the live page and ↵ jumps straight to the exact
 * setting — scrolled into view and pulsed.
 */

const PAGE_NAV: CommandNavigator = {
    toSection: scrollToSection,
    toItem: (item) => revealItem(item),
};

export const ConceptSearchDialog = ({ conceptPath }: { conceptPath?: string }) => {
    // ?q=… opens the dialog mid-search (handy for sharing a demo link).
    const [initialQuery] = useState(() => (typeof window === "undefined" ? "" : (new URLSearchParams(window.location.search).get("q") ?? "")));
    const [isSearchOpen, setIsSearchOpen] = useState(Boolean(initialQuery));
    const ids = useMemo(() => SECTIONS.map((s) => s.id), []);
    const active = useActiveSection(ids);

    // ⌘K / Ctrl+K or "/" opens search from anywhere.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const typing = (e.target as HTMLElement).closest("input, textarea, [contenteditable=true]");
            if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <SettingsSearchProvider query="" mode="highlight">
            <ToggleListVariant.Provider value="grid">
                <ConceptShell
                    conceptPath={conceptPath}
                    note="The re-laid out settings, with a search that opens over the page and takes you straight to a setting."
                    density="wide"
                    rail={
                        <RailCard>
                            <button
                                type="button"
                                onClick={() => setIsSearchOpen(true)}
                                aria-haspopup="dialog"
                                className="flex h-11 w-full cursor-pointer items-center gap-2 rounded-lg bg-primary px-3 text-left shadow-xs ring-1 ring-primary transition duration-100 ease-linear ring-inset hover:ring-brand focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-hidden"
                            >
                                <SearchLg className="size-5 shrink-0 text-fg-quaternary" aria-hidden="true" />
                                <span className="flex-1 truncate text-md text-placeholder">Search settings</span>
                                <kbd className="rounded px-1.5 py-0.5 font-body text-xs font-medium text-quaternary ring-1 ring-secondary ring-inset">⌘K</kbd>
                            </button>
                            <SectionIndex sections={SECTIONS} active={active} onSelect={scrollToSection} />
                        </RailCard>
                    }
                >
                    <RelayoutSections />
                </ConceptShell>
                <SettingsCommandDialog isOpen={isSearchOpen} onOpenChange={setIsSearchOpen} nav={PAGE_NAV} initialQuery={initialQuery} />
            </ToggleListVariant.Provider>
        </SettingsSearchProvider>
    );
};

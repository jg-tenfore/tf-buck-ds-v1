"use client";

import type { FC, ReactNode } from "react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { COURSE } from "./course-settings-data";
import { LegacySidebar, LegacyTopBar } from "./legacy-chrome";
import { FieldGridColumns, SaveButton } from "./settings-kit";
import type { SectionCount } from "./settings-search";
import { SearchScope } from "./settings-search";

/* -------------------------------------------------------------------------- */
/*  Concept registry + switcher                                               */
/* -------------------------------------------------------------------------- */

export const CONCEPTS = [
    { path: "/", label: "Original" },
    { path: "/concept-1-relayout", label: "1 · Re-laid out" },
    { path: "/concept-2-search", label: "2 · Dynamic search" },
    { path: "/concept-3-command-menu", label: "3 · Command menu" },
    { path: "/concept-4-search-dialog", label: "4 · Re-laid out + search dialog" },
] as const;

/** Pill switcher between the original and the three concepts (standalone app only). */
export const ConceptSwitcher = ({ current }: { current: string }) => (
    <nav aria-label="Concepts" className="bg-secondary_subtle flex flex-wrap items-center gap-2 border-b border-secondary px-4 py-2.5 lg:px-8">
        <span className="mr-1 text-xs font-semibold tracking-wider text-quaternary uppercase">Concepts</span>
        {CONCEPTS.map((c) => (
            <a
                key={c.path}
                href={c.path}
                aria-current={c.path === current ? "page" : undefined}
                className={cx(
                    "rounded-full px-3 py-1 text-sm font-medium ring-1 transition duration-100 ease-linear ring-inset",
                    c.path === current ? "bg-brand-solid text-white ring-transparent" : "bg-primary text-secondary ring-secondary hover:bg-primary_hover",
                )}
            >
                {c.label}
            </a>
        ))}
    </nav>
);

/* -------------------------------------------------------------------------- */
/*  Shell                                                                     */
/* -------------------------------------------------------------------------- */

interface ConceptShellProps {
    /** Path of this concept, highlights it in the switcher. Omit to hide the switcher (e.g. Storybook). */
    conceptPath?: string;
    /** One-line explanation of what this concept is exploring. */
    note: string;
    rail: ReactNode;
    /** Field columns + content width. Search concepts narrow the column; the relayout uses the room. */
    density?: "narrow" | "wide";
    children: ReactNode;
}

/**
 * Shared frame for the concepts: the same legacy chrome, one page-level
 * Discard / Save (instead of a Save bar per section), a sticky left rail and a
 * narrower settings column.
 */
export const ConceptShell = ({ conceptPath, note, rail, density = "narrow", children }: ConceptShellProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Deep link: /concept-…#payments scrolls to that section.
    useEffect(() => {
        const id = window.location.hash.slice(1);
        if (!id) return;
        const timer = setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: "start" }), 150);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex min-h-screen bg-secondary">
            <LegacySidebar isMobileOpen={isMenuOpen} onMobileClose={() => setIsMenuOpen(false)} />
            <div className="flex min-w-0 flex-1 flex-col">
                <LegacyTopBar onMenuClick={() => setIsMenuOpen(true)} />
                <main className="flex-1">
                    {conceptPath && <ConceptSwitcher current={conceptPath} />}

                    <div className="flex flex-col gap-4 px-4 pt-6 pb-2 sm:flex-row sm:items-start sm:justify-between lg:px-8">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <h1 className="text-display-xs font-semibold text-primary">Golf Course Settings</h1>
                                <Badge type="color" size="sm" color="gray">
                                    {COURSE.settingsId}
                                </Badge>
                            </div>
                            <p className="text-md text-tertiary">{note}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                            <Button color="secondary" size="md">
                                Discard changes
                            </Button>
                            <SaveButton />
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 px-4 py-6 lg:flex-row lg:items-start lg:px-8">
                        {/* The 4px inset (p-1 / -m-1) keeps the scroll container from clipping the card's ring + shadow. */}
                        <aside className="w-full shrink-0 lg:sticky lg:top-21 lg:-m-1 lg:max-h-[calc(100vh-6rem)] lg:w-82 lg:overflow-y-auto lg:p-1">
                            {rail}
                        </aside>
                        <div data-search-content="" className={cx("flex min-w-0 flex-1 flex-col gap-6", density === "narrow" && "max-w-4xl")}>
                            <FieldGridColumns.Provider value={density === "narrow" ? 2 : 3}>{children}</FieldGridColumns.Provider>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

/** Shared container look for the rail card and the section cards, so they always match. */
export const CARD = "rounded-xl bg-primary shadow-xs ring-1 ring-secondary";

/** White rail card — same container and border as the section cards. */
export const RailCard = ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={cx(CARD, "flex flex-col gap-4 p-5", className)}>{children}</div>
);

/* -------------------------------------------------------------------------- */
/*  Flat (always-open) section                                                */
/* -------------------------------------------------------------------------- */

interface FlatSectionProps {
    id: string;
    icon: FC<{ className?: string }>;
    title: string;
    description: string;
    /** Optional "what changed" call-out (concept 3). */
    note?: string;
    children: ReactNode;
    className?: string;
}

/** An always-expanded settings section: heading with a rule, then its groups. */
export const FlatSection = ({ id, icon: Icon, title, description, note, children, className }: FlatSectionProps) => (
    <section id={id} data-search-section="" aria-labelledby={`${id}-title`} className={cx(CARD, "scroll-mt-24 px-6 pt-6", className)}>
        <div data-search-section-heading="" className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-secondary text-fg-brand-primary">
                <Icon className="size-5" />
            </span>
            <div className="flex min-w-0 flex-col">
                <h2 id={`${id}-title`} className="text-lg font-semibold text-primary">
                    {title}
                </h2>
                <p className="text-sm text-tertiary">{description}</p>
            </div>
        </div>
        {note && (
            <p className="mt-4 flex items-start gap-2 rounded-lg bg-brand-primary px-3 py-2 text-sm text-brand-secondary ring-1 ring-brand ring-inset">
                <span className="mt-px shrink-0 rounded-sm bg-brand-solid px-1.5 py-px text-[10px] font-bold tracking-wide text-white uppercase">
                    Redesigned
                </span>
                <span>{note}</span>
            </p>
        )}
        <SearchScope section={{ id, title, icon: Icon }}>
            <div className="flex flex-col divide-y divide-secondary">{children}</div>
        </SearchScope>
    </section>
);

/* -------------------------------------------------------------------------- */
/*  Section index (scroll-spy)                                                */
/* -------------------------------------------------------------------------- */

type IndexSection = { id: string; icon: FC<{ className?: string }>; title: string };

/** Tracks which section is currently in view. */
export const useActiveSection = (ids: string[]) => {
    const [active, setActive] = useState(ids[0]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible[0]) setActive(visible[0].target.id);
            },
            { rootMargin: "-96px 0px -60% 0px" },
        );
        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [ids]);

    return active;
};

/** Left-rail list of sections. Shows per-section match counts while searching. */
export const SectionIndex = ({
    sections,
    active,
    onSelect,
    counts,
}: {
    sections: IndexSection[];
    active?: string;
    onSelect: (id: string) => void;
    counts?: Record<string, SectionCount>;
}) => (
    <nav aria-label="Settings sections" className="flex flex-col gap-0.5">
        {sections.map(({ id, icon: Icon, title }) => {
            const count = counts?.[id];
            const isEmpty = counts && !count?.hits;

            return (
                <button
                    key={id}
                    type="button"
                    onClick={() => onSelect(id)}
                    aria-current={active === id ? "true" : undefined}
                    className={cx(
                        "flex h-9 cursor-pointer items-center gap-2.5 rounded-md px-2.5 text-left text-sm font-medium transition duration-100 ease-linear",
                        active === id
                            ? "bg-brand-primary font-semibold text-brand-secondary ring-1 ring-brand ring-inset"
                            : "text-secondary hover:bg-secondary",
                        isEmpty && "opacity-40",
                    )}
                >
                    <Icon className={cx("size-4 shrink-0", active === id ? "text-fg-brand-primary" : "text-fg-quaternary")} />
                    <span className="flex-1 truncate">{title}</span>
                    {counts && count?.hits ? (
                        <span className="rounded-full bg-brand-secondary px-2 py-0.5 text-xs font-semibold text-brand-secondary">{count.hits}</span>
                    ) : null}
                </button>
            );
        })}
    </nav>
);

export const scrollToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

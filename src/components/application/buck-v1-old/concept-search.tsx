"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SearchLg, XClose } from "@untitledui/icons";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { ConceptShell, FlatSection, RailCard, SectionIndex, scrollToSection, useActiveSection } from "./concept-shell";
import { SECTIONS } from "./course-settings-page";
import type { SearchMode } from "./settings-search";
import { HighlightText, SettingsSearchProvider, revealItem, scrollToItem, tokenize, useSearchResults } from "./settings-search";

const INITIAL_RESULTS = 6;

/**
 * Concept 2 — Dynamic search.
 *
 * A search rail on the left, a narrower settings column on the right. Typing
 * keeps the page in place but dims everything unrelated to 10% (and disables
 * it), highlights matches inline, and lists them in the rail to jump to.
 * Matching covers labels, descriptions, values, section/group names and
 * hand-written intent keywords ("block employees from refunds").
 */
export const ConceptSearch = ({ conceptPath }: { conceptPath?: string }) => {
    // ?q=… prefills the search (and stays in sync) so a demo link can open mid-search.
    const [query, setQuery] = useState(() => (typeof window === "undefined" ? "" : (new URLSearchParams(window.location.search).get("q") ?? "")));
    const [mode, setMode] = useState<SearchMode>(() =>
        typeof window !== "undefined" && new URLSearchParams(window.location.search).get("mode") === "hide" ? "hide" : "fade",
    );

    useEffect(() => {
        if (!conceptPath) return;
        const url = new URL(window.location.href);
        if (query) url.searchParams.set("q", query);
        else url.searchParams.delete("q");
        if (mode === "hide") url.searchParams.set("mode", "hide");
        else url.searchParams.delete("mode");
        window.history.replaceState(null, "", url);
    }, [query, mode, conceptPath]);

    return (
        <SettingsSearchProvider query={query} mode={mode}>
            <ConceptShell
                conceptPath={conceptPath}
                note="Search any setting by name or by what you want to do. Everything unrelated steps back."
                rail={<SearchRail query={query} onQueryChange={setQuery} mode={mode} onModeChange={setMode} />}
            >
                {SECTIONS.map(({ id, icon, title, description, content: Content }) => (
                    <FlatSection key={id} id={id} icon={icon} title={title} description={description}>
                        <Content />
                    </FlatSection>
                ))}
            </ConceptShell>
        </SettingsSearchProvider>
    );
};

/* -------------------------------------------------------------------------- */
/*  Rail                                                                      */
/* -------------------------------------------------------------------------- */

interface SearchRailProps {
    query: string;
    onQueryChange: (q: string) => void;
    mode: SearchMode;
    onModeChange: (m: SearchMode) => void;
}

const SearchRail = ({ query, onQueryChange, mode, onModeChange }: SearchRailProps) => {
    const { results, counts, isSearching } = useSearchResults();
    const [showAll, setShowAll] = useState(false);
    const [cursor, setCursor] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const ids = useMemo(() => SECTIONS.map((s) => s.id), []);
    const active = useActiveSection(ids);
    const tokens = useMemo(() => tokenize(query), [query]);

    const visible = showAll ? results : results.slice(0, INITIAL_RESULTS);
    const sectionsWithHits = Object.values(counts).filter((c) => c.hits > 0).length;
    const totalHits = Object.values(counts).reduce((sum, c) => sum + c.hits, 0);

    // Reset paging + keyboard cursor whenever the query changes.
    useEffect(() => {
        setShowAll(false);
        setCursor(-1);
    }, [query]);

    // Once typing pauses, bring the best match into view (focus stays in the search box).
    const first = results[0];
    useEffect(() => {
        if (!first) return;
        const timer = setTimeout(() => scrollToItem(first), 450);
        return () => clearTimeout(timer);
        // Re-run when the top match changes (also covers ?q= on load, once settings register).
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, first?.id]);

    // "/" focuses search from anywhere (unless already typing somewhere).
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const isTyping = target.closest("input, textarea, [contenteditable=true]");
            if (e.key === "/" && !isTyping) {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            onQueryChange("");
        } else if (e.key === "ArrowDown" && visible.length) {
            e.preventDefault();
            setCursor((c) => Math.min(c + 1, visible.length - 1));
        } else if (e.key === "ArrowUp" && visible.length) {
            e.preventDefault();
            setCursor((c) => Math.max(c - 1, 0));
        } else if (e.key === "Enter" && visible.length) {
            e.preventDefault();
            revealItem(visible[Math.max(cursor, 0)]);
        }
    };

    return (
        <RailCard>
            <div className="relative" onKeyDown={onKeyDown}>
                <Input
                    ref={inputRef}
                    aria-label="Search settings"
                    placeholder="Search settings or describe a goal"
                    icon={SearchLg}
                    value={query}
                    onChange={onQueryChange}
                    shortcut={query ? undefined : "/"}
                    inputClassName={cx(query && "pr-9")}
                />
                {query && (
                    <button
                        type="button"
                        aria-label="Clear search"
                        onClick={() => {
                            onQueryChange("");
                            inputRef.current?.focus();
                        }}
                        className="absolute top-1/2 right-2.5 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-fg-quaternary hover:bg-primary_hover hover:text-fg-quaternary_hover"
                    >
                        <XClose className="size-4" />
                    </button>
                )}
            </div>

            {isSearching ? (
                <>
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-tertiary" aria-live="polite">
                            {totalHits ? (
                                <>
                                    <span className="font-semibold text-primary">{totalHits}</span> {totalHits === 1 ? "setting" : "settings"} in{" "}
                                    <span className="font-semibold text-primary">{sectionsWithHits}</span> {sectionsWithHits === 1 ? "section" : "sections"}
                                </>
                            ) : (
                                "No matching settings"
                            )}
                        </p>
                        <ButtonGroup
                            size="sm"
                            selectedKeys={new Set([mode])}
                            onSelectionChange={(keys) => keys.size && onModeChange([...keys][0] as SearchMode)}
                        >
                            <ButtonGroupItem id="fade">Dim</ButtonGroupItem>
                            <ButtonGroupItem id="hide">Hide</ButtonGroupItem>
                        </ButtonGroup>
                    </div>

                    {results.length > 0 ? (
                        <ul className="-mx-1 flex flex-col gap-0.5" aria-label="Matching settings">
                            {visible.map((item, i) => {
                                const Icon = item.sectionIcon;
                                return (
                                    <li key={item.id}>
                                        <button
                                            type="button"
                                            onClick={() => revealItem(item)}
                                            onMouseEnter={() => setCursor(i)}
                                            className={cx(
                                                "flex w-full cursor-pointer items-start gap-2.5 rounded-md px-2.5 py-2 text-left transition duration-100 ease-linear",
                                                cursor === i ? "bg-brand-primary ring-1 ring-brand ring-inset" : "hover:bg-secondary",
                                            )}
                                        >
                                            {Icon && <Icon className="mt-0.5 size-4 shrink-0 text-fg-quaternary" />}
                                            <span className="flex min-w-0 flex-col">
                                                <span className="truncate text-sm text-secondary">
                                                    <HighlightText text={item.label} tokens={tokens} />
                                                </span>
                                                <span className="truncate text-xs text-quaternary">{item.sectionTitle}</span>
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        !totalHits && (
                            <p className="text-sm text-tertiary">
                                Try describing what you want to do — for example <em>“stop staff from voiding orders”</em>.
                            </p>
                        )
                    )}

                    {results.length > INITIAL_RESULTS && (
                        <button
                            type="button"
                            onClick={() => setShowAll((v) => !v)}
                            className="cursor-pointer self-start text-sm font-semibold text-brand-secondary hover:text-brand-secondary_hover"
                        >
                            {showAll ? "Show fewer results" : `Show ${results.length - INITIAL_RESULTS} more results`}
                        </button>
                    )}

                    <div className="border-t border-secondary pt-3">
                        <SectionIndex
                            sections={SECTIONS}
                            active={active}
                            counts={counts}
                            onSelect={(id) => {
                                const first = results.find((r) => r.sectionId === id);
                                if (first) revealItem(first);
                                else scrollToSection(id);
                            }}
                        />
                    </div>
                </>
            ) : (
                <SectionIndex sections={SECTIONS} active={active} onSelect={scrollToSection} />
            )}
        </RailCard>
    );
};

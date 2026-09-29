"use client";

import type { FC, Key, RefObject } from "react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, SearchLg, Stars01, XClose } from "@untitledui/icons";
import {
    Input as AriaInput,
    Autocomplete,
    Dialog,
    Header,
    ListBox,
    ListBoxItem,
    ListBoxSection,
    Modal,
    ModalOverlay,
    SearchField,
} from "react-aria-components";
import { cx } from "@/utils/cx";
import { SECTIONS, revealSetting } from "./course-settings-page";
import type { SearchItem } from "./settings-search";
import { HighlightText, SearchScope, SettingsSearchProvider, matchesAll, normalize, tokenize, useSettingsSearch } from "./settings-search";

/**
 * Google Admin–style command search for course settings.
 *
 * Results come grouped — an "Ask TenFore AI" row, then Sections, Settings and
 * Records — each with a breadcrumb path, bold matches and "View all". Built on
 * React Aria's Autocomplete (the foundation of the Untitled UI command menu):
 * focus stays in the field while ↑/↓ move through results and ↵ picks.
 *
 * Two surfaces share the same results list:
 * - `SettingsCommandBar` — a big search bar above the original screen with a
 *   dropdown (concept 3). The page only renders open sections, so it indexes a
 *   hidden copy of every section and asks the page to open + point at a match.
 * - `SettingsCommandDialog` — the same search as a dialog over a page where
 *   every section is rendered (concept 4), jumping straight to the element.
 *
 * Matching is the concept 2 engine: labels, values, group titles and intent
 * keywords ("block employees from refunds").
 */

const LIMITS = { sections: 3, settings: 6, records: 4 } as const;
type GroupKey = keyof typeof LIMITS;

/** Extra words that should land on a whole section. */
const SECTION_KEYWORDS: Record<string, string> = {
    "main-info": "address phone email website time zone location branding colors general profile",
    links: "social facebook instagram website url",
    "sub-courses": "nines layouts courses holes",
    "taxes-fees": "tax taxes fees surcharge service charge deposit",
    payments: "payment methods tenders processor card terminal tips",
    "booking-engine": "online booking tee times website disclaimer",
    "booking-rules": "rules restrictions block limits lead time",
    "booking-waitlist": "waitlist standby notify",
    birdie: "pos point of sale kiosk tablet receipts",
    tablets: "devices hardware kiosk",
    "transportation-types": "carts walking push cart",
    notifications: "email sms text messages alerts statements",
    printers: "printer receipt kitchen hardware",
    images: "photos logo pictures",
    documents: "files policies uploads",
    events: "outings events notes",
    company: "multi course parent company",
};

type Result = { key: string; title: string; path: string; icon?: FC<{ className?: string }>; onSelect: () => void };

/** How a surface takes the user to a result. `occurrence` = nth same-named item in that section. */
export type CommandNavigator = {
    toSection: (sectionId: string) => void;
    toItem: (item: SearchItem, occurrence: number) => void;
};

/* -------------------------------------------------------------------------- */
/*  Results                                                                   */
/* -------------------------------------------------------------------------- */

const useCommandGroups = (query: string, nav: CommandNavigator) => {
    const search = useSettingsSearch();
    const tokens = useMemo(() => tokenize(query), [query]);
    const version = search?.version;

    const groups = useMemo(() => {
        const empty = { sections: [] as Result[], settings: [] as Result[], records: [] as Result[] };
        if (!search || !tokens.length) return empty;

        const sections: Result[] = SECTIONS.filter((s) => matchesAll(normalize(`${s.title} ${s.description} ${SECTION_KEYWORDS[s.id] ?? ""}`), tokens)).map(
            (s) => ({
                key: `section:${s.id}`,
                title: s.title,
                path: `Golf Course Settings › ${s.title}`,
                icon: s.icon,
                onSelect: () => nav.toSection(s.id),
            }),
        );

        // Position of each item among same-named items in its section, so duplicates ("Extra Fee") resolve correctly.
        const seen = new Map<string, number>();
        const settings: (Result & { rank: number })[] = [];
        const records: (Result & { rank: number })[] = [];
        search.items().forEach((item: SearchItem) => {
            const key = `${item.sectionId}|${item.label}`;
            const occurrence = seen.get(key) ?? 0;
            seen.set(key, occurrence + 1);

            if (!item.sectionId || !matchesAll(`${item.own} ${normalize(item.groupTitle ?? "")}`, tokens)) return;
            const result = {
                key: `item:${item.id}`,
                title: item.label,
                path: [item.sectionTitle, item.groupTitle].filter(Boolean).join(" › "),
                icon: item.sectionIcon,
                rank: matchesAll(normalize(item.label), tokens) ? 0 : 1,
                onSelect: () => nav.toItem(item, occurrence),
            };
            (item.kind === "record" ? records : settings).push(result);
        });

        const byRank = <T extends { rank: number }>(list: T[]) =>
            list
                .map((r, i) => ({ r, i }))
                .sort((a, b) => a.r.rank - b.r.rank || a.i - b.i)
                .map(({ r }) => r);
        return { sections, settings: byRank(settings), records: byRank(records) };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, tokens, version]);

    const best = groups.settings[0] ?? groups.records[0] ?? groups.sections[0] ?? null;
    const total = groups.sections.length + groups.settings.length + groups.records.length;
    return { tokens, groups, best, total };
};

interface CommandResultsProps {
    query: string;
    nav: CommandNavigator;
    /** Called just before navigating (close the dropdown / dialog). */
    onChoose: () => void;
    /**
     * What the "Ask TenFore AI" row does: `answer` shows an answer card with a
     * "Take me there" link; `go` jumps straight to the best match (so ↵ right
     * after typing always lands somewhere).
     */
    askMode: "answer" | "go";
}

/** The results list. Must render inside an <Autocomplete>. */
const CommandResults = ({ query, nav, onChoose, askMode }: CommandResultsProps) => {
    const { tokens, groups, best, total } = useCommandGroups(query, nav);
    const [expanded, setExpanded] = useState<GroupKey | null>(null);
    const [answer, setAnswer] = useState<Result | null | "none">(null);

    // Reset local state whenever the question changes.
    useEffect(() => {
        setExpanded(null);
        setAnswer(null);
    }, [query]);

    const byKey = useMemo(() => {
        const map = new Map<string, Result>();
        [...groups.sections, ...groups.settings, ...groups.records].forEach((r) => map.set(r.key, r));
        return map;
    }, [groups]);

    const choose = (result: Result) => {
        onChoose();
        result.onSelect();
    };

    const onAction = (key: Key) => {
        if (key === "ask-ai") {
            if (askMode === "go" && best) choose(best);
            else setAnswer(best ?? "none");
            return;
        }
        const result = byKey.get(String(key));
        if (result) choose(result);
    };

    const renderGroup = (group: GroupKey, label: string) => {
        const list = groups[group];
        if (!list.length) return null;
        const isExpanded = expanded === group;
        const shown = isExpanded ? list : list.slice(0, LIMITS[group]);
        return (
            <ListBoxSection key={group} className="border-t border-secondary py-2 first:border-t-0">
                <Header className="flex items-center justify-between px-6 pt-2 pb-1">
                    <span className="text-xs font-semibold tracking-wider text-tertiary uppercase">
                        {label}
                        <span className="ml-1.5 font-medium text-quaternary normal-case">{list.length}</span>
                    </span>
                    {list.length > LIMITS[group] && (
                        <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setExpanded(isExpanded ? null : group)}
                            className="cursor-pointer text-sm font-semibold text-brand-secondary hover:text-brand-secondary_hover"
                        >
                            {isExpanded ? "Show less" : "View all"}
                        </button>
                    )}
                </Header>
                {shown.map((r) => (
                    <ResultRow key={r.key} result={r} tokens={tokens} />
                ))}
            </ListBoxSection>
        );
    };

    return (
        <>
            {answer && <AiAnswer answer={answer} query={query} onGo={choose} />}
            <ListBox aria-label="Search results" selectionMode="none" onAction={onAction} className="outline-hidden">
                <ListBoxSection className="py-2">
                    <ListBoxItem
                        id="ask-ai"
                        textValue={`Ask TenFore AI: ${query}`}
                        className="flex cursor-pointer items-center gap-5 px-6 py-3 outline-hidden data-[focused]:bg-brand-primary data-[focused]:shadow-[inset_3px_0_0_var(--color-brand-600)] data-[hovered]:bg-secondary"
                    >
                        <Stars01 className="size-6 shrink-0 text-fg-brand-secondary" aria-hidden="true" />
                        <span className="text-md text-primary">
                            Ask TenFore AI: <span className="font-medium">{query}</span>
                        </span>
                    </ListBoxItem>
                </ListBoxSection>
                {total > 0 && (
                    <>
                        {renderGroup("sections", "Sections")}
                        {renderGroup("settings", "Settings")}
                        {renderGroup("records", "Records")}
                    </>
                )}
            </ListBox>
            {total === 0 && <p className="border-t border-secondary px-6 py-6 text-sm text-tertiary">No settings match “{query}”. Try asking TenFore AI.</p>}
        </>
    );
};

const ResultRow = ({ result, tokens }: { result: Result; tokens: string[] }) => {
    const Icon = result.icon;
    return (
        <ListBoxItem
            id={result.key}
            textValue={`${result.title} ${result.path}`}
            className="flex cursor-pointer items-center gap-5 px-6 py-3 outline-hidden data-[focused]:bg-brand-primary data-[focused]:shadow-[inset_3px_0_0_var(--color-brand-600)] data-[hovered]:bg-secondary"
        >
            {Icon ? <Icon className="size-6 shrink-0 text-fg-quaternary" aria-hidden="true" /> : <span className="size-6 shrink-0" />}
            <span className="flex min-w-0 flex-col">
                <span className="truncate text-md text-primary [&_strong]:font-semibold">
                    <HighlightText text={result.title} tokens={tokens} />
                </span>
                <span className="truncate text-sm text-tertiary [&_strong]:font-semibold [&_strong]:text-secondary">
                    <HighlightText text={result.path} tokens={tokens} />
                </span>
            </span>
        </ListBoxItem>
    );
};

/** Prototype stand-in for the AI assistant: answers from the same settings index. */
const AiAnswer = ({ answer, query, onGo }: { answer: Result | "none"; query: string; onGo: (r: Result) => void }) => (
    <div className="m-4 mb-0 flex flex-col gap-3 rounded-xl bg-brand-primary p-4 ring-1 ring-brand ring-inset">
        <span className="flex items-center gap-2 text-xs font-semibold tracking-wider text-brand-secondary uppercase">
            <Stars01 className="size-4" aria-hidden="true" />
            TenFore AI · preview
        </span>
        {answer === "none" ? (
            <p className="text-sm text-secondary">
                I couldn’t find a setting for “{query}”. Try different words, or contact support and we’ll point you to it.
            </p>
        ) : (
            <Fragment>
                <p className="text-sm text-secondary">
                    For “{query}”, you want <span className="font-semibold text-primary">{answer.title}</span> in{" "}
                    <span className="font-medium">{answer.path}</span>.
                </p>
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onGo(answer)}
                    className="flex cursor-pointer items-center gap-1.5 self-start text-sm font-semibold text-brand-secondary hover:text-brand-secondary_hover"
                >
                    Take me there <ArrowRight className="size-4" />
                </button>
            </Fragment>
        )}
    </div>
);

/* -------------------------------------------------------------------------- */
/*  Search field (shared look)                                                */
/* -------------------------------------------------------------------------- */

const CommandField = ({
    query,
    onClear,
    inputRef,
    className,
    autoFocus,
    onFocus,
    onKeyDown,
    trailing,
}: {
    query: string;
    onClear: () => void;
    inputRef: RefObject<HTMLInputElement | null>;
    className?: string;
    autoFocus?: boolean;
    onFocus?: () => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    trailing?: React.ReactNode;
}) => (
    <SearchField
        aria-label="Search settings"
        autoFocus={autoFocus}
        onKeyDown={onKeyDown}
        className={cx("flex h-16 items-center gap-3 bg-primary px-5", className)}
    >
        <SearchLg className="size-5 shrink-0 text-fg-quaternary" aria-hidden="true" />
        <AriaInput
            ref={inputRef}
            onFocus={onFocus}
            placeholder="Search settings, or describe what you want to do"
            className="h-full min-w-0 flex-1 bg-transparent text-lg text-primary outline-hidden placeholder:text-placeholder [&::-webkit-search-cancel-button]:hidden"
        />
        {query ? (
            <button
                type="button"
                aria-label="Clear search"
                onClick={onClear}
                className="flex size-8 cursor-pointer items-center justify-center rounded-md text-fg-quaternary hover:bg-primary_hover"
            >
                <XClose className="size-5" />
            </button>
        ) : (
            trailing
        )}
    </SearchField>
);

const Kbd = ({ children }: { children: React.ReactNode }) => (
    <kbd className="hidden rounded-md px-2 py-1 font-body text-xs font-medium text-quaternary ring-1 ring-secondary ring-inset sm:inline-block">{children}</kbd>
);

/* -------------------------------------------------------------------------- */
/*  Concept 3 — search bar + dropdown above the original screen               */
/* -------------------------------------------------------------------------- */

/** Hidden, always-mounted copy of every section — it exists only to be indexed. */
const SettingsIndex = () => (
    <div hidden aria-hidden="true" inert>
        {SECTIONS.map(({ id, icon, title, content: Content }) => (
            <SearchScope key={id} section={{ id, title, icon }}>
                <Content />
            </SearchScope>
        ))}
    </div>
);

/** Concept 3 navigation: ask the (accordion) page to open the section and point at the setting. */
const ACCORDION_NAV: CommandNavigator = {
    toSection: (sectionId) => revealSetting({ sectionId }),
    toItem: (item, occurrence) => revealSetting({ sectionId: item.sectionId!, label: item.label, occurrence }),
};

export const SettingsCommandBar = () => (
    <SettingsSearchProvider query="" mode="highlight">
        <CommandBar />
        <SettingsIndex />
    </SettingsSearchProvider>
);

const CommandBar = () => {
    // ?q=… opens the bar mid-search (handy for sharing a demo link).
    const initial = typeof window === "undefined" ? "" : (new URLSearchParams(window.location.search).get("q") ?? "");
    const [query, setQuery] = useState(initial);
    const [isOpen, setIsOpen] = useState(Boolean(initial));
    const rootRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // ⌘K / Ctrl+K or "/" jumps to the bar from anywhere.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const typing = (e.target as HTMLElement).closest("input, textarea, [contenteditable=true]");
            if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
                e.preventDefault();
                inputRef.current?.focus();
                setIsOpen(true);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // Click outside closes the dropdown.
    useEffect(() => {
        const onPointer = (e: PointerEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener("pointerdown", onPointer);
        return () => document.removeEventListener("pointerdown", onPointer);
    }, []);

    const showDropdown = isOpen && tokenize(query).length > 0;

    return (
        <div ref={rootRef} className="relative">
            <Autocomplete inputValue={query} onInputChange={setQuery}>
                <CommandField
                    query={query}
                    inputRef={inputRef}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={(e) => setIsOpen(e.key !== "Escape")}
                    onClear={() => {
                        setQuery("");
                        inputRef.current?.focus();
                    }}
                    trailing={<Kbd>⌘K</Kbd>}
                    className={cx(
                        "shadow-sm ring-1 ring-secondary transition duration-100 ease-linear focus-within:ring-2 focus-within:ring-brand",
                        showDropdown ? "rounded-t-2xl" : "rounded-2xl",
                    )}
                />
                <div
                    className={cx(
                        "absolute inset-x-0 top-full z-40 max-h-[70vh] overflow-y-auto rounded-b-2xl border-t border-secondary bg-primary shadow-xl ring-1 ring-secondary",
                        !showDropdown && "hidden",
                    )}
                >
                    <CommandResults
                        query={query}
                        nav={ACCORDION_NAV}
                        askMode="answer"
                        onChoose={() => {
                            setIsOpen(false);
                            inputRef.current?.blur();
                        }}
                    />
                </div>
            </Autocomplete>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*  Concept 4 — the same search as a dialog                                   */
/* -------------------------------------------------------------------------- */

interface SettingsCommandDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    nav: CommandNavigator;
    /** Prefill (e.g. from a ?q= demo link). */
    initialQuery?: string;
}

/**
 * The command search as a dialog overlay. Render it inside the page's
 * SettingsSearchProvider so it searches everything on the page.
 */
export const SettingsCommandDialog = ({ isOpen, onOpenChange, nav, initialQuery = "" }: SettingsCommandDialogProps) => {
    const [query, setQuery] = useState(initialQuery);
    const inputRef = useRef<HTMLInputElement>(null);
    const hasQuery = tokenize(query).length > 0;

    // Navigate once the dialog has closed and handed focus back, so the jump isn't undone.
    const deferred: CommandNavigator = useMemo(
        () => ({
            toSection: (id) => setTimeout(() => nav.toSection(id), 60),
            toItem: (item, occurrence) => setTimeout(() => nav.toItem(item, occurrence), 60),
        }),
        [nav],
    );

    return (
        <ModalOverlay
            isDismissable
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            className={({ isEntering, isExiting }) =>
                cx(
                    "fixed inset-0 z-50 flex justify-center bg-overlay/60 px-4 pt-[10vh] backdrop-blur-[2px]",
                    isEntering && "duration-200 ease-out animate-in fade-in",
                    isExiting && "duration-150 ease-in animate-out fade-out",
                )
            }
        >
            <Modal
                className={({ isEntering, isExiting }) =>
                    cx(
                        "h-max w-full max-w-3xl",
                        isEntering && "duration-200 ease-out animate-in fade-in slide-in-from-top-2 zoom-in-95",
                        isExiting && "duration-150 ease-in animate-out fade-out zoom-out-95",
                    )
                }
            >
                <Dialog
                    aria-label="Search settings"
                    className="flex max-h-[80vh] flex-col overflow-hidden rounded-2xl bg-primary shadow-2xl ring-1 ring-secondary_alt outline-hidden"
                >
                    <Autocomplete inputValue={query} onInputChange={setQuery}>
                        <CommandField
                            query={query}
                            inputRef={inputRef}
                            autoFocus
                            onClear={() => {
                                setQuery("");
                                inputRef.current?.focus();
                            }}
                            trailing={<Kbd>Esc</Kbd>}
                            className={cx("shrink-0", hasQuery && "border-b border-secondary")}
                        />
                        {hasQuery ? (
                            <div className="min-h-0 flex-1 overflow-y-auto">
                                <CommandResults query={query} nav={deferred} askMode="go" onChoose={() => onOpenChange(false)} />
                            </div>
                        ) : (
                            <p className="border-t border-secondary px-6 py-5 text-sm text-tertiary">
                                Search every setting by name, value, or what you want to do. Use ↑ ↓ to move and ↵ to go.
                            </p>
                        )}
                    </Autocomplete>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};

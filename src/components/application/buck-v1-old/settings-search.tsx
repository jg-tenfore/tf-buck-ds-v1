"use client";

import type { FC, HTMLAttributes, ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { SEARCH_KEYWORDS } from "./search-keywords";

/**
 * Settings search — the engine behind the "search the settings" concepts.
 *
 * Every setting (field, toggle row, table row, editor…) is wrapped in
 * <Searchable>. On mount it registers its visible text (label, description,
 * values, cell text) plus the titles of the section and group it lives in.
 * Typing a query marks each one `data-search="hit" | "miss"`, and the page's
 * `mode` decides what that means visually:
 *
 * - `fade`      — misses drop to 10% opacity and are disabled (inert).
 * - `hide`      — misses (and groups/sections left empty) are removed.
 * - `highlight` — nothing is dimmed; hits get an outline.
 *
 * Matched words are painted inline with the CSS Custom Highlight API, so no
 * component markup has to change. With no <SettingsSearchProvider> above it,
 * <Searchable> renders a plain element — the original prototype is untouched.
 */

export type SearchMode = "fade" | "hide" | "highlight";

export type SearchItem = {
    id: string;
    el: HTMLElement;
    /** Short name shown in the results list. */
    label: string;
    /** Normalized text of the item itself. */
    own: string;
    /** Normalized text of its section + group titles. */
    scope: string;
    sectionId?: string;
    sectionTitle?: string;
    sectionIcon?: FC<{ className?: string }>;
    /** Group heading(s) it sits under, e.g. "Other Settings › TenFore only". */
    groupTitle?: string;
    /** "setting" = a field/toggle/editor; "record" = a table row or list entry. */
    kind: "setting" | "record";
};

type SearchContextValue = {
    query: string;
    tokens: string[];
    mode: SearchMode;
    version: number;
    register: (item: SearchItem) => () => void;
    items: () => SearchItem[];
};

const SearchContext = createContext<SearchContextValue | null>(null);

type Scope = { text: string; sectionId?: string; sectionTitle?: string; sectionIcon?: FC<{ className?: string }>; groupTitle?: string };
const ScopeContext = createContext<Scope>({ text: "" });

/* -------------------------------------------------------------------------- */
/*  Matching                                                                  */
/* -------------------------------------------------------------------------- */

export const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, " ").trim();

/** Filler words people type when they describe a goal ("how do I block my employees from…"). */
const STOPWORDS = new Set(
    "a an and are be can do does doing for from how i in is it me my of on or our should the their them they this to want we what when where which who with without you your set setting settings change turn make let allow allows".split(
        " ",
    ),
);

/** Tiny stemmer so "refunds", "refunding" and "refunded" all find "refund". */
const stem = (word: string) => {
    if (word.length > 5 && word.endsWith("ing")) return word.slice(0, -3);
    if (word.length > 4 && word.endsWith("ies")) return `${word.slice(0, -3)}y`;
    if (word.length > 4 && word.endsWith("ed")) return word.slice(0, -2);
    if (/(ches|shes|xes|zes|sses)$/.test(word)) return word.slice(0, -2);
    if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
    return word;
};

/**
 * Query → search tokens. Single words are kept as typed (so "a" still finds
 * things); longer, sentence-like queries drop filler words and are stemmed.
 */
export const tokenize = (query: string) => {
    const words = normalize(query)
        .replace(/[^a-z0-9&%$#@.\-\s]/g, " ")
        .split(" ")
        .filter(Boolean);
    if (words.length <= 1) return words;
    const meaningful = words.filter((w) => !STOPWORDS.has(w)).map(stem);
    return meaningful.length ? [...new Set(meaningful)] : words;
};

const isWordChar = (ch: string | undefined) => !!ch && /[a-z0-9]/.test(ch);

/** True when `token` starts a word somewhere in `text` ("tip" finds "tips", not "multiple"). */
const hasWordStart = (text: string, token: string) => {
    let from = text.indexOf(token);
    while (from !== -1) {
        if (!isWordChar(text[from - 1])) return true;
        from = text.indexOf(token, from + 1);
    }
    return false;
};

export const matchesAll = (haystack: string, tokens: string[]) => tokens.length > 0 && tokens.every((t) => hasWordStart(haystack, t));

/** Visible text of an element, skipping hidden native <select>s and opted-out nodes. */
const readText = (root: HTMLElement) => {
    const parts: string[] = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
        acceptNode: (node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const el = node as HTMLElement;
                if (el.tagName === "SELECT" || el.tagName === "OPTION" || el.hasAttribute("data-search-ignore")) return NodeFilter.FILTER_REJECT;
                if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
                    const field = el as HTMLInputElement;
                    if (field.type !== "hidden" && field.type !== "color" && field.value) parts.push(field.value);
                }
                return NodeFilter.FILTER_SKIP;
            }
            return NodeFilter.FILTER_ACCEPT;
        },
    });
    while (walker.nextNode()) parts.push(walker.currentNode.textContent ?? "");
    return parts.join(" ");
};

/* -------------------------------------------------------------------------- */
/*  Provider                                                                  */
/* -------------------------------------------------------------------------- */

const HIGHLIGHT = "settings-search";

const STYLES = `
[data-search-root][data-searching] [data-search]{transition:opacity 150ms linear}
[data-search-root][data-searching][data-search-mode=fade] [data-search=miss]{opacity:.1;pointer-events:none;user-select:none}
[data-search-root][data-searching][data-search-mode=fade] [data-search-group]:not(:has([data-search=hit])) > [data-search-heading]{opacity:.1}
[data-search-root][data-searching][data-search-mode=fade] [data-search-section]:not(:has([data-search=hit])) [data-search-section-heading]{opacity:.1}
[data-search-root][data-searching][data-search-mode=hide] [data-search=miss],
[data-search-root][data-searching][data-search-mode=hide] [data-search-group]:not(:has([data-search=hit])),
[data-search-root][data-searching][data-search-mode=hide] [data-search-container]:not(:has([data-search=hit])),
[data-search-root][data-searching][data-search-mode=hide] [data-search-section]:not(:has([data-search=hit])){display:none !important}
[data-search-root][data-searching] [data-search=hit] [data-label]{color:var(--color-brand-600)}
[data-search-root][data-searching][data-search-mode=highlight] [data-search=hit]:not(tr){outline:2px solid var(--color-brand-200);outline-offset:6px;border-radius:6px}
[data-search-root][data-searching][data-search-mode=highlight] tr[data-search=hit]{background:var(--color-brand-25)}
::highlight(${HIGHLIGHT}){background-color:var(--color-brand-200);color:var(--color-brand-900)}
`;

/** Paint every token occurrence inside `root` (skipping misses) with the CSS Highlight API. */
const paintHighlights = (root: HTMLElement | null, tokens: string[]) => {
    if (typeof CSS === "undefined" || !("highlights" in CSS)) return;
    if (!root || tokens.length === 0) {
        CSS.highlights.delete(HIGHLIGHT);
        return;
    }
    const ranges: Range[] = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
        acceptNode: (node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const el = node as HTMLElement;
                if (el.tagName === "SELECT" || el.hasAttribute("data-search-ignore") || el.getAttribute("data-search") === "miss") {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_SKIP;
            }
            return NodeFilter.FILTER_ACCEPT;
        },
    });
    while (walker.nextNode()) {
        const node = walker.currentNode as Text;
        const text = node.data.toLowerCase();
        for (const token of tokens) {
            let from = text.indexOf(token);
            while (from !== -1) {
                if (!isWordChar(text[from - 1])) {
                    const range = new Range();
                    range.setStart(node, from);
                    range.setEnd(node, from + token.length);
                    ranges.push(range);
                }
                from = text.indexOf(token, from + token.length);
            }
        }
    }
    CSS.highlights.set(HIGHLIGHT, new Highlight(...ranges));
};

interface ProviderProps {
    query: string;
    mode: SearchMode;
    children: ReactNode;
    className?: string;
}

/** Wraps the settings content; owns the registry, the match styles and the inline highlights. */
export const SettingsSearchProvider = ({ query, mode, children, className }: ProviderProps) => {
    const registry = useRef(new Map<string, SearchItem>());
    const root = useRef<HTMLDivElement>(null);
    const [version, setVersion] = useState(0);
    const pending = useRef(false);

    // Items mount in bursts; coalesce their registrations into one re-render.
    const bump = useCallback(() => {
        if (pending.current) return;
        pending.current = true;
        requestAnimationFrame(() => {
            pending.current = false;
            setVersion((v) => v + 1);
        });
    }, []);

    const register = useCallback(
        (item: SearchItem) => {
            registry.current.set(item.id, item);
            bump();
            return () => {
                registry.current.delete(item.id);
                bump();
            };
        },
        [bump],
    );

    const items = useCallback(
        () =>
            [...registry.current.values()].sort((a, b) => (a.el === b.el ? 0 : a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1)),
        [],
    );

    const tokens = useMemo(() => tokenize(query), [query]);

    useEffect(() => {
        // Paint inside the settings column only — not the app nav or the search rail.
        paintHighlights(root.current?.querySelector<HTMLElement>("[data-search-content]") ?? root.current, tokens);
    }, [tokens, version]);

    useEffect(() => () => paintHighlights(null, []), []);

    const value = useMemo(() => ({ query, tokens, mode, version, register, items }), [query, tokens, mode, version, register, items]);

    return (
        <SearchContext.Provider value={value}>
            <style>{STYLES}</style>
            <div ref={root} data-search-root="" data-search-mode={mode} data-searching={tokens.length ? "" : undefined} className={className}>
                {children}
            </div>
        </SearchContext.Provider>
    );
};

export const useSettingsSearch = () => useContext(SearchContext);

/* -------------------------------------------------------------------------- */
/*  Scopes (section / group)                                                  */
/* -------------------------------------------------------------------------- */

/** Adds a section or group title to the searchable text of everything inside it. */
export const SearchScope = ({
    title,
    section,
    children,
}: {
    title?: string;
    section?: { id: string; title: string; icon: FC<{ className?: string }> };
    children: ReactNode;
}) => {
    const parent = useContext(ScopeContext);
    const value = useMemo<Scope>(
        () => ({
            text: normalize(`${parent.text} ${section?.title ?? ""} ${title ?? ""}`),
            sectionId: section?.id ?? parent.sectionId,
            sectionTitle: section?.title ?? parent.sectionTitle,
            sectionIcon: section?.icon ?? parent.sectionIcon,
            groupTitle: section ? undefined : title ? (parent.groupTitle ? `${parent.groupTitle} › ${title}` : title) : parent.groupTitle,
        }),
        [parent, section, title],
    );
    return <ScopeContext.Provider value={value}>{children}</ScopeContext.Provider>;
};

/* -------------------------------------------------------------------------- */
/*  Searchable                                                                */
/* -------------------------------------------------------------------------- */

type SearchableProps = HTMLAttributes<HTMLElement> & {
    as?: "div" | "tr" | "figure" | "label";
    /** Name shown in the results list (defaults to the element's first line of text). */
    label?: string;
    /** Extra words that should find this item (synonyms, jargon). */
    keywords?: string;
    children: ReactNode;
};

/** A single findable setting. Renders a plain element when no search provider is present. */
export const Searchable = ({ as: Tag = "div", label, keywords, children, ...rest }: SearchableProps) => {
    const ctx = useContext(SearchContext);
    const scope = useContext(ScopeContext);
    const ref = useRef<HTMLElement>(null);
    const id = useId();
    const [own, setOwn] = useState("");
    const register = ctx?.register;

    useLayoutEffect(() => {
        const el = ref.current;
        if (!register || !el) return;
        const text = normalize(`${label ?? ""} ${readText(el)} ${keywords ?? ""} ${label ? (SEARCH_KEYWORDS[label] ?? "") : ""}`);
        setOwn(text);
        return register({
            id,
            el,
            label: label ?? (el.innerText || text).split("\n")[0].slice(0, 80),
            own: text,
            scope: scope.text,
            sectionId: scope.sectionId,
            sectionTitle: scope.sectionTitle,
            sectionIcon: scope.sectionIcon,
            groupTitle: scope.groupTitle,
            kind: Tag === "tr" ? "record" : "setting",
        });
    }, [register, id, label, keywords, scope, Tag]);

    const status = ctx && ctx.tokens.length ? (matchesAll(`${own} ${scope.text}`, ctx.tokens) ? "hit" : "miss") : undefined;
    const isInert = status === "miss" && ctx?.mode !== "highlight";

    const El = Tag as "div";
    return (
        <El
            {...(rest as HTMLAttributes<HTMLDivElement>)}
            ref={ref as React.Ref<HTMLDivElement>}
            data-search={status}
            data-search-item={ctx ? "" : undefined}
            data-setting-label={label}
            id={ctx ? id : rest.id}
            inert={isInert || undefined}
        >
            {children}
        </El>
    );
};

/* -------------------------------------------------------------------------- */
/*  Results                                                                   */
/* -------------------------------------------------------------------------- */

export type SectionCount = { hits: number; total: number };

/**
 * Items whose own text matches (these are listed as results), plus per-section
 * hit counts (which also include items matched only through a section/group title).
 */
export const useSearchResults = () => {
    const ctx = useContext(SearchContext);
    const tokens = ctx?.tokens;
    const version = ctx?.version;

    return useMemo(() => {
        const counts: Record<string, SectionCount> = {};
        if (!ctx || !tokens?.length) return { results: [] as SearchItem[], counts, isSearching: false };

        const direct: SearchItem[] = [];
        for (const item of ctx.items()) {
            const key = item.sectionId ?? "";
            counts[key] ??= { hits: 0, total: 0 };
            counts[key].total += 1;
            if (matchesAll(`${item.own} ${item.scope}`, tokens)) counts[key].hits += 1;
            if (matchesAll(item.own, tokens)) direct.push(item);
        }

        // Items whose *name* matches come first; DOM order otherwise.
        const byName = (item: SearchItem) => (matchesAll(normalize(item.label), tokens) ? 0 : 1);
        const results = direct.map((item, index) => ({ item, index })).sort((a, b) => byName(a.item) - byName(b.item) || a.index - b.index);

        return { results: results.map((r) => r.item), counts, isSearching: true };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctx, tokens, version]);
};

/** Bring a result into view without moving keyboard focus (used while typing). */
export const scrollToItem = (item: SearchItem) => (document.getElementById(item.id) ?? item.el).scrollIntoView({ behavior: "smooth", block: "center" });

/** Scroll a result into view, pulse it, and put the cursor in its first control. */
export const revealItem = (item: SearchItem) => {
    const el = document.getElementById(item.id) ?? item.el;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    pulseElement(el);
};

/** Brief brand-colored pulse that says "this is the one you picked". Also focuses its first control. */
export const pulseElement = (el: HTMLElement) => {
    el.animate(
        [
            { boxShadow: "0 0 0 4px color-mix(in srgb, var(--color-brand-400) 60%, transparent)", backgroundColor: "var(--color-brand-25)" },
            { boxShadow: "0 0 0 4px transparent", backgroundColor: "transparent" },
        ],
        { duration: 1800, easing: "ease-out" },
    );
    const control = el.querySelector<HTMLElement>("input:not([type=hidden]), textarea, button, [contenteditable=true]");
    control?.focus({ preventScroll: true });
};

/** Bold the matched parts of a short string (for the results list). */
export const HighlightText = ({ text, tokens }: { text: string; tokens: string[] }) => {
    if (!tokens.length) return <>{text}</>;
    const pattern = new RegExp(`(?<![a-z0-9])(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
    return (
        <>
            {text.split(pattern).map((part, i) =>
                i % 2 === 1 ? (
                    <strong key={i} className="font-semibold text-primary">
                        {part}
                    </strong>
                ) : (
                    <span key={i}>{part}</span>
                ),
            )}
        </>
    );
};

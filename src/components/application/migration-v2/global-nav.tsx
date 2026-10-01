"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronDownDouble, ChevronUpDouble, SearchLg, XClose } from "@untitledui/icons";
import { TfLogo } from "@/components/foundations/logo/tf-logo";
import { cx } from "@/utils/cx";
import type { NavNode } from "./nav-tree";
import { NAV_TREE, allGroupIds, ancestorsOf } from "./nav-tree";

/**
 * Global Nav — the back-office accordion sidebar, rebuilt on the Buck design
 * system. Sections expand to pages and groups (three levels, with a guide line
 * per level); the active page is tinted brand green and its ancestors' icons
 * pick up the brand color. Typing in the search box filters the tree to
 * matching pages plus their parents, and the expand-all button turns into a
 * close button while searching.
 */

export interface GlobalNavProps {
    /** Id of the current page (see NAV_IDS). Its ancestors open automatically. */
    activeId?: string;
    /** Start with a search term typed in. */
    initialQuery?: string;
    /** "active" (default) opens only the active page's path; "all" expands everything; "none" collapses everything. */
    initialExpanded?: "active" | "all" | "none";
    /** Scroll the active page into view on mount (the "scrolled" state). */
    scrollToActive?: boolean;
    /** Called with the id of a page when it's clicked. */
    onNavigate?: (id: string) => void;
    className?: string;
}

const matches = (label: string, query: string) => label.toLowerCase().includes(query.toLowerCase());

/** Filter the tree to nodes that match the query, plus the ancestors that lead to them. */
const filterTree = (nodes: NavNode[], query: string): NavNode[] =>
    nodes.flatMap((node) => {
        const children = node.children ? filterTree(node.children, query) : [];
        if (children.length) return [{ ...node, children }];
        if (matches(node.label, query)) return [{ ...node, children: node.children }];
        return [];
    });

export const GlobalNav = ({ activeId, initialQuery = "", initialExpanded = "active", scrollToActive, onNavigate, className }: GlobalNavProps) => {
    const [query, setQuery] = useState(initialQuery);
    const [expanded, setExpanded] = useState<Set<string>>(() => {
        if (initialExpanded === "all") return new Set(allGroupIds());
        if (initialExpanded === "none" || !activeId) return new Set();
        return new Set(ancestorsOf(activeId));
    });
    const scrollRef = useRef<HTMLDivElement>(null);
    const isSearching = query.trim().length > 0;

    const tree = useMemo(() => (isSearching ? filterTree(NAV_TREE, query.trim()) : NAV_TREE), [isSearching, query]);
    const activeAncestors = useMemo(() => new Set(activeId ? ancestorsOf(activeId) : []), [activeId]);
    const allOpen = expanded.size >= allGroupIds().length;

    useEffect(() => {
        if (!scrollToActive || !activeId) return;
        const el = scrollRef.current?.querySelector<HTMLElement>(`[data-nav-id="${activeId}"]`);
        el?.scrollIntoView({ block: "center" });
    }, [scrollToActive, activeId]);

    const toggle = (id: string) =>
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    const renderNodes = (nodes: NavNode[], depth: number) => (
        <ul className={cx("flex flex-col gap-0.5", depth > 0 && "mt-0.5 ml-[18px] border-l border-secondary pl-2.5")}>
            {nodes.map((node) => {
                const hasChildren = Boolean(node.children?.length);
                // While searching, every surviving group is shown open.
                const isOpen = hasChildren && (isSearching || expanded.has(node.id));
                const isActive = node.id === activeId;
                const isOnActivePath = activeAncestors.has(node.id);
                const Icon = node.icon;

                return (
                    <li key={node.id}>
                        <button
                            type="button"
                            data-nav-id={node.id}
                            aria-expanded={hasChildren ? isOpen : undefined}
                            aria-current={isActive ? "page" : undefined}
                            onClick={() => (hasChildren ? toggle(node.id) : onNavigate?.(node.id))}
                            className={cx(
                                "group relative flex h-10 w-full cursor-pointer items-center gap-3 rounded-md px-2.5 text-left transition duration-100 ease-linear",
                                depth === 0 ? "text-md font-semibold" : "text-sm font-semibold",
                                isActive
                                    ? "bg-brand-primary text-brand-secondary before:absolute before:inset-y-1 before:left-0 before:w-[3px] before:rounded-full before:bg-fg-brand-primary"
                                    : "text-secondary hover:bg-primary_hover",
                            )}
                        >
                            <Icon
                                className={cx(
                                    "size-5 shrink-0",
                                    isActive || isOnActivePath ? "text-fg-brand-primary" : "text-fg-quaternary group-hover:text-fg-quaternary_hover",
                                )}
                            />
                            <span className="min-w-0 flex-1 truncate">{node.label}</span>
                            {hasChildren && (
                                <ChevronDown
                                    aria-hidden="true"
                                    className={cx("size-4 shrink-0 text-fg-quaternary transition-transform duration-150", isOpen && "rotate-180")}
                                />
                            )}
                        </button>
                        {isOpen && node.children && renderNodes(node.children, depth + 1)}
                    </li>
                );
            })}
        </ul>
    );

    return (
        <aside className={cx("flex h-full w-[304px] shrink-0 flex-col border-r border-secondary bg-primary", className)}>
            <div className="flex h-18 shrink-0 items-center justify-center px-5">
                <TfLogo className="h-9 w-auto" />
            </div>

            <div className="flex shrink-0 items-center gap-2 px-3 pb-3">
                <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg bg-secondary px-3 ring-1 ring-transparent transition duration-100 ease-linear ring-inset focus-within:bg-primary focus-within:ring-2 focus-within:ring-brand">
                    <SearchLg className="size-5 shrink-0 text-fg-quaternary" aria-hidden="true" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search"
                        aria-label="Search navigation"
                        className="min-w-0 flex-1 bg-transparent text-md text-primary outline-hidden placeholder:text-placeholder"
                    />
                    {isSearching && (
                        <button
                            type="button"
                            aria-label="Clear search"
                            onClick={() => setQuery("")}
                            className="cursor-pointer text-fg-quaternary hover:text-fg-quaternary_hover"
                        >
                            <XClose className="size-4" />
                        </button>
                    )}
                </label>
                {isSearching ? (
                    <button
                        type="button"
                        aria-label="Close search"
                        onClick={() => setQuery("")}
                        className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-fg-quaternary hover:bg-primary_hover"
                    >
                        <XClose className="size-5" />
                    </button>
                ) : (
                    <button
                        type="button"
                        aria-label={allOpen ? "Collapse all" : "Expand all"}
                        title={allOpen ? "Collapse all" : "Expand all"}
                        onClick={() => setExpanded(allOpen ? new Set() : new Set(allGroupIds()))}
                        className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-fg-quaternary hover:bg-primary_hover"
                    >
                        {allOpen ? <ChevronUpDouble className="size-5" /> : <ChevronDownDouble className="size-5" />}
                    </button>
                )}
            </div>

            <nav ref={scrollRef} aria-label="Main" className="min-h-0 flex-1 overflow-y-auto px-3 pb-6">
                {tree.length ? renderNodes(tree, 0) : <p className="px-2.5 py-6 text-center text-sm text-tertiary">No pages match “{query}”.</p>}
            </nav>
        </aside>
    );
};

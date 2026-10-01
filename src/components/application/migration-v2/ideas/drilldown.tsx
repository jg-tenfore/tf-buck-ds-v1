"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import type { RecordNav } from "./ideas-kit";
import { RecordNavContext, SlidePanel } from "./ideas-kit";

/**
 * Sub-navigation for the Idea 1 panels: a stack of pages (record → customer →
 * section → item → edit), with Back popping the stack. `SteppedPanel` ties the
 * panel to the rows of the table behind it — ↑ / ↓ move to the previous or
 * next row (same order as the table) and reset to that row's first page.
 */

export type Nav = { push: (page: PanelPage) => void; back: () => void };

export type PanelPage = {
    title: string;
    body: (nav: Nav) => ReactNode;
    footer?: (nav: Nav) => ReactNode;
};

interface SteppedPanelProps<T> {
    rows: T[];
    initialIndex?: number;
    /** First page for a row. */
    root: (row: T, index: number) => PanelPage;
    /** Pages already open on top of the first one (to land on an edge case). */
    initialStack?: (row: T, index: number) => PanelPage[];
    width?: string;
    onClose?: () => void;
    /** Show ↑/↓ row stepping (off for one-off flyouts). */
    showStepper?: boolean;
}

export const SteppedPanel = <T,>({ rows, initialIndex = 0, root, initialStack, width = "w-[500px]", onClose, showStepper = true }: SteppedPanelProps<T>) => {
    const [index, setIndex] = useState(initialIndex);
    const [stack, setStack] = useState<PanelPage[]>(() => initialStack?.(rows[initialIndex], initialIndex) ?? []);

    const page = stack.length ? stack[stack.length - 1] : root(rows[index], index);
    const nav: Nav = {
        push: (p) => setStack((s) => [...s, p]),
        back: () => setStack((s) => s.slice(0, -1)),
    };
    const go = (i: number) => {
        setIndex(i);
        setStack([]);
    };

    return (
        <SlidePanel
            title={page.title}
            onBack={stack.length ? nav.back : undefined}
            footer={page.footer?.(nav)}
            width={width}
            onClose={onClose}
            stepper={
                showStepper
                    ? {
                          index,
                          total: rows.length,
                          onPrev: index > 0 ? () => go(index - 1) : undefined,
                          onNext: index < rows.length - 1 ? () => go(index + 1) : undefined,
                      }
                    : undefined
            }
        >
            {page.body(nav)}
        </SlidePanel>
    );
};

/* -------------------------------------------------------------------------- */
/*  Flows: start on today's table, click a row to load the idea               */
/* -------------------------------------------------------------------------- */

/** Idea 1 flow: the original screen; clicking a row opens the panel on that row. */
export const PanelFlow = <T,>({
    screen,
    rows,
    root,
    width,
}: {
    screen: (openRow: (index: number) => void) => ReactNode;
    rows: T[];
    root: (row: T, index: number) => PanelPage;
    width?: string;
}) => {
    const [open, setOpen] = useState<number | null>(null);
    return (
        <>
            {screen(setOpen)}
            {open !== null && <SteppedPanel key={open} rows={rows} initialIndex={open} root={root} width={width} onClose={() => setOpen(null)} />}
        </>
    );
};

/** Idea 2 flow: the original screen; clicking a row loads that row's record page (back returns to the table). */
export const RecordFlow = <T,>({
    screen,
    rows,
    page,
    step = true,
}: {
    screen: (openRow: (index: number) => void) => ReactNode;
    rows: T[];
    page: (row: T, index: number) => ReactNode;
    /** Show ↑/↓ row stepping on the record page. */
    step?: boolean;
}) => {
    const [open, setOpen] = useState<number | null>(null);
    if (open === null) return <>{screen(setOpen)}</>;
    const nav: RecordNav = {
        onBack: () => setOpen(null),
        stepper: step
            ? {
                  index: open,
                  total: rows.length,
                  onPrev: open > 0 ? () => setOpen(open - 1) : undefined,
                  onNext: open < rows.length - 1 ? () => setOpen(open + 1) : undefined,
              }
            : undefined,
    };
    return (
        <RecordNavContext.Provider key={open} value={nav}>
            {page(rows[open], open)}
        </RecordNavContext.Provider>
    );
};

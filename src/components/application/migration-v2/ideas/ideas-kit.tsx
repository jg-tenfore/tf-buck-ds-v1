"use client";

import type { FC, ReactNode } from "react";
import { createContext, useContext } from "react";
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Edit03, XClose } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { cx } from "@/utils/cx";
import { EmbeddedShellContext } from "../kit";

/*
 * Building blocks for the two Migration V2 proposals.
 *
 * Idea 1 — slide-over panel: the screen stays where it is and the
 * record opens in a panel on the right, with summary cards, grouped rows that
 * drill into sub-pages, and Back / close.
 *
 * Idea 2 — record page: one page per record with a summary bar,
 * a main column, a details rail on the right and a single "More actions" menu
 * instead of a row of buttons.
 *
 * Both only re-arrange what the product does today — no new fields or features.
 */

/* ========================================================================== */
/*  Idea 1 · Slide-over panel                                                 */
/* ========================================================================== */

interface SlidePanelProps {
    title: string;
    /** Shows "‹ Back" above the title (a drilled-in sub-page). */
    onBack?: () => void;
    onClose?: () => void;
    /** Sticky footer (primary action). */
    footer?: ReactNode;
    children: ReactNode;
    width?: string;
    /** Step through the rows of the table behind the panel (↑ / ↓). */
    stepper?: { index: number; total: number; onPrev?: () => void; onNext?: () => void };
}

/** Right-hand panel over the page; the screen behind stays visible, dimmed. */
export const SlidePanel = ({ title, onBack, onClose, footer, children, width = "w-[480px]", stepper }: SlidePanelProps) => (
    <div className="fixed inset-0 z-40 flex justify-end" role="presentation">
        <button type="button" aria-label="Close panel" onClick={onClose} className="absolute inset-0 cursor-default bg-overlay/40" />
        <aside
            role="dialog"
            aria-label={title}
            className={cx("relative flex h-full max-w-full flex-col bg-primary shadow-2xl ring-1 ring-secondary_alt", width)}
        >
            <div className="flex items-start justify-between gap-4 px-6 pt-5">
                <div className="flex min-w-0 flex-col gap-2">
                    {onBack && (
                        <button
                            type="button"
                            onClick={onBack}
                            className="flex w-max cursor-pointer items-center gap-1 text-sm font-medium text-tertiary hover:text-secondary"
                        >
                            <ChevronLeft className="size-4" />
                            Back
                        </button>
                    )}
                    <h2 className="text-display-xs font-semibold text-primary">{title}</h2>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    {stepper && (
                        <div className="flex items-center gap-1 rounded-lg px-1 py-0.5 ring-1 ring-secondary">
                            <button
                                type="button"
                                aria-label="Previous row"
                                disabled={!stepper.onPrev}
                                onClick={stepper.onPrev}
                                className="flex size-7 cursor-pointer items-center justify-center rounded-md text-fg-secondary hover:bg-primary_hover disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronUp className="size-4" />
                            </button>
                            <span className="min-w-14 text-center text-xs font-medium text-tertiary tabular-nums">
                                {stepper.index + 1} of {stepper.total}
                            </span>
                            <button
                                type="button"
                                aria-label="Next row"
                                disabled={!stepper.onNext}
                                onClick={stepper.onNext}
                                className="flex size-7 cursor-pointer items-center justify-center rounded-md text-fg-secondary hover:bg-primary_hover disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronDown className="size-4" />
                            </button>
                        </div>
                    )}
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                        className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-fg-quaternary hover:bg-primary_hover"
                    >
                        <XClose className="size-5" />
                    </button>
                </div>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 py-5">{children}</div>
            {footer && <div className="border-t border-secondary px-6 py-4">{footer}</div>}
        </aside>
    </div>
);

/** Small stat card, two side by side at the top of a panel. */
export const PanelStat = ({ label, value, tone }: { label: string; value: ReactNode; tone?: "default" | "positive" | "negative" }) => (
    <div className="flex flex-col gap-1 rounded-xl bg-primary px-4 py-3 shadow-xs ring-1 ring-secondary">
        <span className="text-xs font-medium text-tertiary">{label}</span>
        <span
            className={cx(
                "text-lg font-semibold tabular-nums",
                tone === "negative" ? "text-error-primary" : tone === "positive" ? "text-success-primary" : "text-primary",
            )}
        >
            {value}
        </span>
    </div>
);

/** A titled group of rows. */
export const PanelGroup = ({ title, description, children }: { title?: string; description?: string; children: ReactNode }) => (
    <section className="flex flex-col gap-1">
        {title && <h3 className="text-md font-semibold text-primary">{title}</h3>}
        {description && <p className="text-sm text-tertiary">{description}</p>}
        <div className="flex flex-col divide-y divide-secondary">{children}</div>
    </section>
);

interface PanelRowProps {
    icon?: FC<{ className?: string }>;
    label: string;
    hint?: string;
    /** Right-aligned value (count, amount, status…). */
    value?: ReactNode;
    /** Muted row: nothing behind it yet (an empty section). */
    muted?: boolean;
    onClick?: () => void;
    /** Hide the chevron (a read-only fact rather than a link). */
    static?: boolean;
}

/** One tappable row: icon, label + hint, value and chevron. */
export const PanelRow = ({ icon: Icon, label, hint, value, muted, onClick, static: isStatic }: PanelRowProps) => {
    const Tag = isStatic ? "div" : "button";
    // Long text values (notes, preferences, lists) stack under the label, like an address,
    // instead of competing with it for the row; short values stay right-aligned.
    const stacked = typeof value === "string" && value.length > 28;
    return (
        <Tag
            {...(isStatic ? {} : { type: "button" as const, onClick })}
            data-panel-row=""
            className={cx("flex w-full items-center gap-3 py-3 text-left", !isStatic && "cursor-pointer rounded-md hover:bg-primary_hover")}
        >
            {Icon && <Icon className={cx("size-5 shrink-0", muted ? "text-fg-quaternary opacity-50" : "text-fg-quaternary")} />}
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span data-panel-label="" className={cx("text-sm font-medium", muted ? "text-tertiary" : "text-primary")}>
                    {label}
                </span>
                {hint && <span className="truncate text-xs text-tertiary">{hint}</span>}
                {stacked && (
                    <span data-panel-value="" className={cx("line-clamp-2 text-sm", muted ? "text-quaternary" : "text-tertiary")}>
                        {value}
                    </span>
                )}
            </span>
            {value !== undefined && !stacked && (
                <span
                    data-panel-value=""
                    className={cx("max-w-[60%] shrink-0 truncate text-right text-sm tabular-nums", muted ? "text-quaternary" : "text-secondary")}
                >
                    {value}
                </span>
            )}
            {!isStatic && <ChevronRight className="size-4 shrink-0 text-fg-quaternary" />}
        </Tag>
    );
};

/** Big centered avatar + name, the panel's identity block. */
export const PanelIdentity = ({ name, sub, action }: { name: string; sub?: string; action?: ReactNode }) => (
    <div className="flex flex-col items-center gap-2 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-brand-solid text-xl font-semibold text-white">
            {name
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
        </span>
        <span className="text-lg font-semibold text-primary">{name}</span>
        {sub && <span className="text-sm text-tertiary">{sub}</span>}
        {action}
    </div>
);

/* ========================================================================== */
/*  Idea 2 · Record page                                                      */
/* ========================================================================== */

/**
 * Idea 3: editing from a tabbed record opens the side panel. RailBlock pencils
 * and More actions items call this with what was clicked (e.g. "Billing address").
 */
export const EditFlyoutContext = createContext<((hint: string) => void) | null>(null);

export type RecordAction = { label: string; icon?: FC<{ className?: string }>; destructive?: boolean; onAction?: () => void };

/** Back-to-table and row stepping for a record page, supplied by RecordFlow. */
export type RecordNav = { onBack: () => void; stepper?: { index: number; total: number; onPrev?: () => void; onNext?: () => void } };
export const RecordNavContext = createContext<RecordNav | null>(null);

/** One "More actions" menu instead of a row of buttons. */
export const MoreActions = ({ actions }: { actions: RecordAction[] }) => {
    const openEdit = useContext(EditFlyoutContext);
    return (
        <Dropdown.Root>
            <Button color="secondary" size="md" iconTrailing={ChevronDown}>
                More actions
            </Button>
            <Dropdown.Popover placement="bottom end" className="w-60">
                <Dropdown.Menu>
                    {actions.map((a) => (
                        <Dropdown.Item
                            key={a.label}
                            icon={a.icon}
                            label={a.label}
                            onAction={a.onAction ?? (openEdit ? () => openEdit(a.label) : undefined)}
                            className={a.destructive ? "[&_*]:text-error-primary" : undefined}
                        />
                    ))}
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown.Root>
    );
};

/** Record page header: back to the list, breadcrumb, record title, ↑/↓ row stepping and actions. */
export const RecordHeader = ({
    breadcrumb,
    breadcrumbIcon: Icon,
    title,
    subtitle,
    actions,
}: {
    breadcrumb: string;
    breadcrumbIcon?: FC<{ className?: string }>;
    title: string;
    subtitle?: ReactNode;
    actions?: ReactNode;
}) => {
    const nav = useContext(RecordNavContext);
    const step = nav?.stepper;
    const embedded = useContext(EmbeddedShellContext);
    const stepper = step && (
        <div className="flex items-center gap-1 rounded-lg px-1 py-0.5 ring-1 ring-secondary">
            <button
                type="button"
                aria-label="Previous row"
                disabled={!step.onPrev}
                onClick={step.onPrev}
                className="flex size-8 cursor-pointer items-center justify-center rounded-md text-fg-secondary hover:bg-primary_hover disabled:cursor-not-allowed disabled:opacity-40"
            >
                <ChevronUp className="size-4" />
            </button>
            <span className="min-w-14 text-center text-xs font-medium text-tertiary tabular-nums">
                {step.index + 1} of {step.total}
            </span>
            <button
                type="button"
                aria-label="Next row"
                disabled={!step.onNext}
                onClick={step.onNext}
                className="flex size-8 cursor-pointer items-center justify-center rounded-md text-fg-secondary hover:bg-primary_hover disabled:cursor-not-allowed disabled:opacity-40"
            >
                <ChevronDown className="size-4" />
            </button>
        </div>
    );
    // Inside a tab (Idea 3): the tab is the breadcrumb, so just title + actions.
    if (embedded)
        return (
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-semibold text-primary">{title}</h2>
                    {subtitle && <div className="text-md text-tertiary">{subtitle}</div>}
                </div>
                <div className="flex items-center gap-3">
                    {actions}
                    {stepper}
                </div>
            </div>
        );
    return (
        <header className="flex flex-col gap-3 border-b border-secondary bg-primary px-8 pt-5 pb-5">
            <div className="flex items-center gap-2 text-sm text-tertiary">
                <button
                    type="button"
                    aria-label={`Back to ${breadcrumb}`}
                    onClick={nav?.onBack}
                    className="flex size-8 cursor-pointer items-center justify-center rounded-md ring-1 ring-secondary hover:bg-primary_hover"
                >
                    <ArrowLeft className="size-4" />
                </button>
                {Icon && <Icon className="size-4" />}
                <button type="button" onClick={nav?.onBack} className="cursor-pointer font-medium hover:text-secondary">
                    {breadcrumb}
                </button>
            </div>
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-display-xs font-semibold text-primary">{title}</h1>
                    {subtitle && <div className="text-md text-tertiary">{subtitle}</div>}
                </div>
                <div className="flex items-center gap-3">
                    {actions}
                    {step && (
                        <div className="flex items-center gap-1 rounded-lg px-1 py-0.5 ring-1 ring-secondary">
                            <button
                                type="button"
                                aria-label="Previous row"
                                disabled={!step.onPrev}
                                onClick={step.onPrev}
                                className="flex size-8 cursor-pointer items-center justify-center rounded-md text-fg-secondary hover:bg-primary_hover disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronUp className="size-4" />
                            </button>
                            <span className="min-w-14 text-center text-xs font-medium text-tertiary tabular-nums">
                                {step.index + 1} of {step.total}
                            </span>
                            <button
                                type="button"
                                aria-label="Next row"
                                disabled={!step.onNext}
                                onClick={step.onNext}
                                className="flex size-8 cursor-pointer items-center justify-center rounded-md text-fg-secondary hover:bg-primary_hover disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronDown className="size-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

/** Horizontal summary bar of key figures. */
export const StatBar = ({ stats }: { stats: { label: string; value: ReactNode; tone?: "positive" | "negative" }[] }) => (
    <div
        className="grid divide-x divide-secondary overflow-hidden rounded-xl bg-primary shadow-xs ring-1 ring-secondary"
        style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
    >
        {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-1 px-5 py-4">
                <span className="text-sm font-medium text-tertiary underline decoration-dotted underline-offset-4">{s.label}</span>
                <span
                    className={cx(
                        "text-lg font-semibold tabular-nums",
                        s.tone === "negative" ? "text-error-primary" : s.tone === "positive" ? "text-success-primary" : "text-primary",
                    )}
                >
                    {s.value}
                </span>
            </div>
        ))}
    </div>
);

/** Two-column record layout: main content and a details rail. */
export const RecordLayout = ({ main, rail }: { main: ReactNode; rail: ReactNode }) => (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-6">{main}</div>
        <aside className="flex flex-col gap-0 divide-y divide-secondary self-start rounded-xl bg-primary px-5 shadow-xs ring-1 ring-secondary">{rail}</aside>
    </div>
);

/** A titled white card in the main column. */
export const MainCard = ({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) => (
    <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
            <h2 className="text-md font-semibold text-primary">{title}</h2>
            {action}
        </div>
        {children}
    </section>
);

/** One block in the details rail: label, optional edit, content. */
export const RailBlock = ({ title, editable, action, children }: { title: string; editable?: boolean; action?: ReactNode; children: ReactNode }) => {
    const openEdit = useContext(EditFlyoutContext);
    return (
        <div className="flex flex-col gap-2 py-4">
            <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-secondary">{title}</h3>
                {action ??
                    (editable && (
                        <button
                            type="button"
                            aria-label={`Edit ${title}`}
                            onClick={() => openEdit?.(title)}
                            className="flex size-7 cursor-pointer items-center justify-center rounded-md text-fg-quaternary hover:bg-primary_hover hover:text-fg-quaternary_hover"
                        >
                            <Edit03 className="size-4" />
                        </button>
                    ))}
            </div>
            <div className="flex flex-col gap-1 text-sm text-primary">{children}</div>
        </div>
    );
};

/** Empty-state card with a short message and the action that fills it. */
export const EmptyCard = ({ message, action, icon: Icon }: { message: string; action?: ReactNode; icon?: FC<{ className?: string }> }) => (
    <div className="flex items-center justify-between gap-6 rounded-xl bg-primary px-6 py-6 shadow-xs ring-1 ring-secondary">
        <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-secondary">{message}</p>
            {action}
        </div>
        {Icon && (
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-secondary text-fg-quaternary">
                <Icon className="size-7" />
            </span>
        )}
    </div>
);

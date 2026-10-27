"use client";

import type { FC, ReactNode } from "react";
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, ChevronRight, ClockRewind, List, SearchLg, SwitchHorizontal01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { InnerTabs, ScreenModal, ScreenShell, type ScreenTab, TabStrip } from "../migration-v2/kit";
import { SectionCard } from "../punch-cards-v2/page-sections";
import { type HistoryEntry, TRANSFER_CUSTOMERS } from "./data";

export { SectionCard };

/* -------------------------------------------------------------------------- */
/*  Page: header + tabs                                                       */
/* -------------------------------------------------------------------------- */

/**
 * The Credits - OCT 27 page header: breadcrumbs, title with a Beta badge,
 * description, and the page's actions on the right (Export, Add …).
 */
export const CreditsHeader = ({
    crumbs,
    title,
    description,
    badge = "Beta",
    actions,
}: {
    crumbs: string[];
    title: string;
    description: string;
    badge?: string | null;
    actions?: ReactNode;
}) => (
    <header className="border-b border-secondary bg-primary px-8 pt-5 pb-6">
        <div className="mb-4 flex items-center gap-2 text-xs font-medium text-tertiary">
            {crumbs.map((crumb, i) => (
                <span key={crumb} className="flex items-center gap-2">
                    {i > 0 && <ChevronRight aria-hidden="true" className="size-3" />}
                    <span className={cx(i === crumbs.length - 1 && "text-secondary")}>{crumb}</span>
                </span>
            ))}
        </div>
        <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-display-xs font-semibold tracking-tight text-primary">{title}</h1>
                    {badge && (
                        <Badge color="brand" size="sm">
                            {badge}
                        </Badge>
                    )}
                </div>
                <p className="mt-1.5 max-w-2xl text-sm text-tertiary">{description}</p>
            </div>
            {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
        </div>
    </header>
);

export type RecordTab = ScreenTab & { id: string };

/**
 * A Credits page: Global Nav, the new header, and the tab strip (the list is
 * always the first tab; records open beside it as closable tabs).
 */
export const CreditsPage = ({
    navId,
    crumbs,
    title,
    description,
    actions,
    listLabel,
    tabs,
    activeId,
    onSelect,
    onClose,
    children,
}: {
    navId: string;
    crumbs: string[];
    title: string;
    description: string;
    actions?: ReactNode;
    listLabel: string;
    tabs: RecordTab[];
    activeId: string;
    onSelect: (id: string) => void;
    onClose: (id: string) => void;
    children: ReactNode;
}) => (
    <ScreenShell
        nav={{ activeId: navId, scrollToActive: true }}
        title={title}
        description={description}
        header={<CreditsHeader crumbs={crumbs} title={title} description={description} actions={actions} />}
        tabs={
            <TabStrip
                tabs={[{ id: "list", label: listLabel, icon: List }, ...tabs.map((t) => ({ ...t, closable: true }))]}
                activeId={activeId}
                onSelect={onSelect}
                onClose={onClose}
            />
        }
    >
        {children}
    </ScreenShell>
);

/* -------------------------------------------------------------------------- */
/*  Record tabs + unsaved changes                                             */
/* -------------------------------------------------------------------------- */

/**
 * Open record tabs for a page: open, switch, close. Each record reports
 * whether it has unsaved changes; closing one that does asks first.
 */
export const useRecordTabs = <T extends { key: string }>(initial: T[] = [], initialActive?: string) => {
    const [tabs, setTabs] = useState<T[]>(initial);
    const [active, setActive] = useState(initialActive ?? initial.at(-1)?.key ?? "list");
    const [dirty, setDirtyMap] = useState<Record<string, boolean>>({});
    const [pending, setPending] = useState<string | null>(null);

    const open = (tab: T) => {
        if (!tabs.some((t) => t.key === tab.key)) setTabs((all) => [...all, tab]);
        setActive(tab.key);
    };
    const forceClose = (key: string) => {
        setTabs((all) => all.filter((t) => t.key !== key));
        setDirtyMap(({ [key]: _, ...rest }) => rest);
        setActive((current) => (current === key ? "list" : current));
    };
    const close = (key: string) => (dirty[key] ? (setActive(key), setPending(key)) : forceClose(key));
    const setDirty = (key: string, value: boolean) => setDirtyMap((map) => (map[key] === value ? map : { ...map, [key]: value }));
    const update = (key: string, patch: Partial<T>) => setTabs((all) => all.map((t) => (t.key === key ? { ...t, ...patch } : t)));

    const pendingTab = tabs.find((t) => t.key === pending);
    const warning = (
        <UnsavedChangesModal
            isOpen={Boolean(pendingTab)}
            onKeepEditing={() => setPending(null)}
            onDiscard={() => {
                if (pending) forceClose(pending);
                setPending(null);
            }}
        />
    );

    return { tabs, active, setActive, open, close, forceClose, setDirty, update, dirty, warning, askToClose: setPending };
};

/** Closing a tab (or pressing Cancel) with unsaved changes asks before throwing them away. */
export const UnsavedChangesModal = ({ isOpen, onKeepEditing, onDiscard }: { isOpen: boolean; onKeepEditing: () => void; onDiscard: () => void }) => (
    <ScreenModal
        title="Discard unsaved changes?"
        isOpen={isOpen}
        onClose={onKeepEditing}
        footer={
            <>
                <Button color="secondary" size="md" onClick={onKeepEditing}>
                    Keep editing
                </Button>
                <Button color="primary-destructive" size="md" onClick={onDiscard}>
                    Discard changes
                </Button>
            </>
        }
    >
        <div className="flex gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-warning-secondary">
                <AlertTriangle className="size-5 text-fg-warning-primary" aria-hidden="true" />
            </span>
            <p className="text-sm text-secondary">You have changes in this tab that haven't been saved. If you close it, they'll be lost.</p>
        </div>
    </ScreenModal>
);

/** Report a record's unsaved state up to its page (for the close warning). */
export const useReportDirty = (dirty: boolean, onDirtyChange?: (dirty: boolean) => void) => {
    useEffect(() => onDirtyChange?.(dirty), [dirty, onDirtyChange]);
};

/* -------------------------------------------------------------------------- */
/*  Record header + body                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Top of a record's tab: what it is on the left, Cancel / Save on the right
 * (save is always at the top, never at the bottom). Destructive actions like
 * Void or Delete sit before Cancel.
 */
export const RecordHeader = ({
    eyebrow,
    title,
    meta,
    saveLabel = "Save changes",
    canSave,
    onCancel,
    onSave,
    extra,
}: {
    eyebrow?: ReactNode;
    title: string;
    meta?: ReactNode;
    saveLabel?: string;
    canSave: boolean;
    onCancel: () => void;
    onSave: () => void;
    extra?: ReactNode;
}) => (
    <header className="flex flex-wrap items-end justify-between gap-6 pb-1">
        <div className="flex min-w-0 flex-col gap-1">
            {eyebrow && <div className="flex items-center gap-2 text-xs font-medium text-tertiary">{eyebrow}</div>}
            <h1 className="text-xl font-semibold text-primary">{title}</h1>
            {meta && <p className="text-sm text-tertiary">{meta}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
            {extra}
            <Button color="secondary" size="md" onClick={onCancel}>
                Cancel
            </Button>
            <Button size="md" isDisabled={!canSave} onClick={onSave}>
                {saveLabel}
            </Button>
        </div>
    </header>
);

/** How a record's former sub-tabs are shown: every one stacked as a section (A), or kept as sub-tabs (B). */
export type SubTabMode = "sections" | "tabs";

export type RecordSection = {
    id: string;
    /** Which sub-tab it lives under in mode B. */
    tab: string;
    title: string;
    description?: string;
    aside?: ReactNode;
    content: ReactNode;
};

/**
 * Builder 3D's body: full-width sections in one column. In mode B the
 * sections are grouped under underlined sub-tabs; in mode A they all stack.
 */
export const RecordBody = ({
    mode,
    tabs,
    sections,
    initialTab,
}: {
    mode: SubTabMode;
    tabs: { id: string; label: string }[];
    sections: RecordSection[];
    initialTab?: string;
}) => {
    const [tab, setTab] = useState(initialTab ?? tabs[0].id);
    const shown = mode === "tabs" ? sections.filter((s) => s.tab === tab) : sections;
    return (
        <div className="flex flex-col gap-5">
            {mode === "tabs" && <InnerTabs tabs={tabs} activeId={tab} onChange={setTab} />}
            {shown.map((s) => (
                <SectionCard key={s.id} title={s.title} description={s.description} aside={s.aside}>
                    {s.content}
                </SectionCard>
            ))}
        </div>
    );
};

/** Awarded / Used / Remaining across the top of a balance section. */
export const BalanceStrip = ({ items }: { items: { label: string; value: string; strong?: boolean }[] }) => (
    <dl className={cx("grid gap-4 rounded-lg bg-secondary p-4 text-sm", items.length > 3 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3")}>
        {items.map((item) => (
            <div key={item.label} className="flex flex-col gap-0.5">
                <dt className="text-tertiary">{item.label}</dt>
                <dd className={cx("tabular-nums", item.strong ? "text-lg font-semibold text-brand-secondary" : "font-medium text-primary")}>{item.value}</dd>
            </div>
        ))}
    </dl>
);

/** Read-only facts in a grid (IDs, dates the system sets). */
export const Facts = ({ items, columns = 4 }: { items: [string, ReactNode][]; columns?: 2 | 3 | 4 }) => (
    <dl className={cx("grid grid-cols-2 gap-x-6 gap-y-4 text-sm", columns === 3 ? "lg:grid-cols-3" : columns === 4 ? "lg:grid-cols-4" : "")}>
        {items.map(([label, value]) => (
            <div key={label} className="min-w-0">
                <dt className="text-xs text-tertiary">{label}</dt>
                <dd className="mt-1 font-medium wrap-anywhere text-secondary">{value || <span className="text-quaternary">—</span>}</dd>
            </div>
        ))}
    </dl>
);

/** Empty state inside a section (no orders, no transactions…). */
export const SectionEmpty = ({ children }: { children: ReactNode }) => (
    <div className="rounded-lg bg-secondary px-4 py-6 text-center text-sm text-tertiary">{children}</div>
);

/** A simple table inside a section. */
export const SectionTable = ({ head, children, empty }: { head: ReactNode; children: ReactNode; empty?: ReactNode }) => (
    <div className="overflow-x-auto rounded-xl ring-1 ring-secondary">
        <table className="w-full text-left text-sm">
            <thead className="bg-secondary text-xs font-semibold tracking-wider text-tertiary uppercase">{head}</thead>
            <tbody>{children}</tbody>
        </table>
        {empty}
    </div>
);

export const STh = ({ children, className }: { children?: ReactNode; className?: string }) => (
    <th className={cx("px-4 py-3 whitespace-nowrap", className)}>{children}</th>
);
export const STd = ({ children, className }: { children?: ReactNode; className?: string }) => (
    <td className={cx("border-t border-secondary px-4 py-3 text-secondary", className)}>{children}</td>
);

/** "Changes to 274402 saved." */
export const SavedNote = ({ message }: { message: string | null }) =>
    message ? (
        <div role="status" className="rounded-xl bg-success-primary px-4 py-3 text-sm text-primary ring-1 ring-fg-success-secondary ring-inset">
            {message}
        </div>
    ) : null;

/* -------------------------------------------------------------------------- */
/*  Transfer + history                                                        */
/* -------------------------------------------------------------------------- */

/**
 * The holder and a dedicated Transfer button (never an editable customer
 * field), with the credit's history below so every transfer is on record.
 * The same for punch cards, gift cards and rain checks.
 */
export const TransferHistory = ({
    holderLabel = "Held by",
    holder,
    holderDetail,
    history,
    onTransfer,
}: {
    holderLabel?: string;
    holder: string | null;
    holderDetail?: string;
    history: HistoryEntry[];
    onTransfer: () => void;
}) => (
    <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-secondary p-4">
            <div>
                <p className="text-xs text-tertiary">{holderLabel}</p>
                <p className="mt-0.5 font-semibold text-primary">{holder ?? "Unassigned"}</p>
                {holderDetail && <p className="mt-0.5 text-xs text-tertiary">{holderDetail}</p>}
            </div>
            <Button color="secondary" size="md" iconLeading={SwitchHorizontal01} onClick={onTransfer}>
                Transfer…
            </Button>
        </div>
        <History entries={history} />
    </div>
);

/** Newest first: what happened, the detail, who did it. */
export const History = ({ entries }: { entries: HistoryEntry[] }) => (
    <div className="flex flex-col gap-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-primary">
            <ClockRewind className="size-4 text-fg-quaternary" aria-hidden="true" />
            History
        </h3>
        {entries.length ? (
            <ol className="flex flex-col">
                {entries.map((entry, i) => (
                    <li key={i} className="flex gap-3 border-l-2 border-secondary pb-4 pl-4 last:pb-0">
                        <div className="min-w-0 flex-1">
                            <p className="text-sm text-primary">
                                <span className="font-semibold">{entry.action}</span> · {entry.detail}
                            </p>
                            <p className="mt-0.5 text-xs text-tertiary">
                                {entry.date} · {entry.by}
                            </p>
                        </div>
                    </li>
                ))}
            </ol>
        ) : (
            <SectionEmpty>No history yet.</SectionEmpty>
        )}
    </div>
);

/**
 * Transfer a credit to another customer: pick who, then confirm. The balance
 * moves with it and the transfer is added to the credit's history.
 */
export const TransferModal = ({
    isOpen,
    title,
    summary,
    from,
    note,
    initialStep = "choose",
    initialTo = "",
    onClose,
    onConfirm,
}: {
    isOpen: boolean;
    title: string;
    /** e.g. "Gift card 274402 · $5.00 remaining". */
    summary: string;
    from: string | null;
    note?: string;
    initialStep?: "choose" | "confirm";
    initialTo?: string;
    onClose: () => void;
    onConfirm: (to: string) => void;
}) => {
    const [step, setStep] = useState(initialStep);
    const [query, setQuery] = useState("");
    const [to, setTo] = useState(initialTo);
    const q = query.trim().toLowerCase();
    const matches = TRANSFER_CUSTOMERS.filter((c) => c.name !== from && (!q || `${c.name} ${c.detail}`.toLowerCase().includes(q)));
    const done = () => {
        setStep("choose");
        setQuery("");
        setTo("");
        onClose();
    };

    return (
        <ScreenModal
            title={title}
            isOpen={isOpen}
            onClose={done}
            width="max-w-lg"
            footer={
                step === "choose" ? (
                    <>
                        <Button color="secondary" size="md" onClick={done}>
                            Cancel
                        </Button>
                        <Button size="md" isDisabled={!to} onClick={() => setStep("confirm")}>
                            Continue
                        </Button>
                    </>
                ) : (
                    <>
                        <Button color="secondary" size="md" onClick={() => setStep("choose")}>
                            Back
                        </Button>
                        <Button
                            size="md"
                            iconLeading={SwitchHorizontal01}
                            onClick={() => {
                                onConfirm(to);
                                done();
                            }}
                        >
                            Transfer
                        </Button>
                    </>
                )
            }
        >
            <div className="rounded-lg bg-secondary px-4 py-3 text-sm">
                <p className="font-medium text-primary">{summary}</p>
                <p className="mt-0.5 text-tertiary">Currently held by {from ?? "no one"}</p>
            </div>
            {step === "choose" ? (
                <>
                    <Input label="Transfer to customer" placeholder="Search name, email or phone" icon={SearchLg} value={query} onChange={setQuery} autoFocus />
                    <div role="radiogroup" aria-label="Customers" className="flex max-h-64 flex-col overflow-y-auto rounded-lg ring-1 ring-secondary">
                        {matches.map((c) => (
                            <button
                                key={c.name}
                                type="button"
                                role="radio"
                                aria-checked={to === c.name}
                                onClick={() => setTo(c.name)}
                                className={cx(
                                    "flex cursor-pointer items-center justify-between gap-3 border-b border-secondary px-4 py-3 text-left last:border-b-0 hover:bg-primary_hover",
                                    to === c.name && "bg-active",
                                )}
                            >
                                <span>
                                    <span className="block text-sm font-medium text-primary">{c.name}</span>
                                    <span className="block text-xs text-tertiary">{c.detail}</span>
                                </span>
                                <span
                                    className={cx(
                                        "size-4 shrink-0 rounded-full ring-1 ring-primary ring-inset",
                                        to === c.name && "bg-brand-solid ring-4 ring-bg-brand-solid",
                                    )}
                                />
                            </button>
                        ))}
                        {!matches.length && <p className="px-4 py-6 text-center text-sm text-tertiary">No customers match.</p>}
                    </div>
                    {note && <p className="text-xs text-tertiary">{note}</p>}
                </>
            ) : (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-sm">
                        <span className="rounded-md bg-secondary px-3 py-2 font-medium text-secondary">{from ?? "Unassigned"}</span>
                        <ArrowRight className="size-4 text-fg-quaternary" aria-hidden="true" />
                        <span className="rounded-md bg-brand-primary_alt px-3 py-2 font-semibold text-brand-secondary">{to}</span>
                    </div>
                    <p className="text-sm text-secondary">The remaining balance moves with it, and the transfer is recorded in its history.</p>
                </div>
            )}
        </ScreenModal>
    );
};

/** Now, for history entries. */
export const NOW = "Oct 27, 2026 3:45 PM";
export const STAFF = "Aaron Whitfield";

export type IconType = FC<{ className?: string }>;

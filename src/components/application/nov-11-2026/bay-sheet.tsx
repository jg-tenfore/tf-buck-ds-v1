"use client";

import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import {
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    CurrencyDollar,
    Lock01,
    MessageTextSquare01,
    Plus,
    Printer,
    Receipt,
    Repeat04,
    SearchLg,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { CreditsHeader } from "../credits-oct-27/kit";
import { ScreenShell } from "../migration-v2/kit";
import { ActionBar, Toast } from "../products-oct-27/kit";
import {
    BAYS,
    type Block,
    DAY_END,
    DAY_START,
    MEMBERSHIPS,
    NO_MEMBERSHIP,
    type Reservation,
    SEED_BLOCKS,
    SEED_RESERVATIONS,
    SHEET_DATE,
    SLOT,
    STATUS_LABEL,
    bayById,
    conflictFor,
    customerById,
    fmtDuration,
    fmtHour,
    fmtTime,
    holdsTime,
    membershipOf,
    slots,
} from "./bay-data";
import { type BlockDraft, BlockPanel, type BookDraft, BookPanel, DetailsPanel } from "./bay-panels";

export const BAY_SHEET_NAV = "simulator-bays/bay-sheet";

export type Panel = { kind: "book"; draft: BookDraft } | { kind: "details"; id: string } | { kind: "block"; draft: BlockDraft };

type Layout = "columns" | "rows";

const ribbonColor = (res: Reservation) => (membershipOf(customerById(res.customerId)) ?? NO_MEMBERSHIP).color;

const STRIPES: CSSProperties = { backgroundImage: "repeating-linear-gradient(135deg, transparent 0 6px, rgba(10,13,18,0.05) 6px 12px)" };

/* -------------------------------------------------------------------------- */
/*  Marks: what a booking carries, as small icons                             */
/* -------------------------------------------------------------------------- */

const MARKS = [
    { id: "checkedIn", label: "Checked in", icon: CheckCircle, className: "text-fg-success-secondary", test: (r: Reservation) => r.status === "checkedIn" },
    { id: "tab", label: "Open tab", icon: Receipt, className: "text-fg-warning-secondary", test: (r: Reservation) => r.tabOpen },
    { id: "paid", label: "Paid", icon: CurrencyDollar, className: "text-fg-success-secondary", test: (r: Reservation) => r.paid },
    { id: "note", label: "Has a note", icon: MessageTextSquare01, className: "text-fg-quaternary", test: (r: Reservation) => Boolean(r.note) },
    { id: "repeat", label: "Repeats", icon: Repeat04, className: "text-fg-quaternary", test: (r: Reservation) => r.repeat !== "none" },
] as const;

const Marks = ({ res }: { res: Reservation }) => (
    <span className="flex items-center gap-1">
        {MARKS.filter((m) => m.test(res)).map((m) => (
            <m.icon key={m.id} aria-label={m.label} className={cx("size-3.5 shrink-0", m.className)} />
        ))}
    </span>
);

const Legend = () => (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-tertiary">
        {MARKS.map((m) => (
            <span key={m.id} className="flex items-center gap-1.5">
                <m.icon aria-hidden="true" className={cx("size-3.5", m.className)} />
                {m.label}
            </span>
        ))}
        <span className="h-4 w-px bg-border-secondary" aria-hidden="true" />
        {[...MEMBERSHIPS, NO_MEMBERSHIP].map((m) => (
            <span key={m.name} className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: m.color }} aria-hidden="true" />
                {m.name}
            </span>
        ))}
        <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm bg-secondary ring-1 ring-secondary ring-inset" style={STRIPES} aria-hidden="true" />
            Blocked
        </span>
    </div>
);

/* -------------------------------------------------------------------------- */
/*  Toolbar                                                                   */
/* -------------------------------------------------------------------------- */

const Toolbar = ({
    query,
    onQuery,
    bayFilter,
    onBayFilter,
}: {
    query: string;
    onQuery: (q: string) => void;
    bayFilter: string[];
    onBayFilter: (ids: string[]) => void;
}) => (
    <div className="flex flex-col gap-3 rounded-xl bg-primary p-4 ring-1 ring-secondary">
        <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
                <Button size="md" color="secondary" iconLeading={ChevronLeft} aria-label="Previous day" />
                <div className="flex h-10 items-center gap-2 rounded-lg bg-primary px-3.5 ring-1 ring-primary ring-inset">
                    <Calendar className="size-4 text-fg-quaternary" aria-hidden="true" />
                    <span className="text-sm font-semibold text-primary">{SHEET_DATE}</span>
                </div>
                <Button size="md" color="secondary" iconLeading={ChevronRight} aria-label="Next day" />
            </div>
            <Button size="md" color="secondary">
                Today
            </Button>
            <div className="ml-auto w-full sm:w-72">
                <Input aria-label="Find a golfer" icon={SearchLg} placeholder="Find a golfer on this day" value={query} onChange={onQuery} />
            </div>
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Bays shown">
            <span className="mr-1 text-xs font-medium text-tertiary">Bays</span>
            <button
                type="button"
                aria-pressed={bayFilter.length === 0}
                onClick={() => onBayFilter([])}
                className={cx(
                    "cursor-pointer rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset",
                    bayFilter.length === 0 ? "bg-brand-primary_alt text-brand-secondary ring-brand" : "text-secondary ring-primary hover:bg-primary_hover",
                )}
            >
                All {BAYS.length}
            </button>
            {BAYS.map((b) => {
                const on = bayFilter.includes(b.id);
                return (
                    <button
                        key={b.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => onBayFilter(on ? bayFilter.filter((x) => x !== b.id) : [...bayFilter, b.id])}
                        className={cx(
                            "cursor-pointer rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset",
                            on ? "bg-brand-primary_alt text-brand-secondary ring-brand" : "text-secondary ring-primary hover:bg-primary_hover",
                        )}
                    >
                        {b.name}
                    </button>
                );
            })}
            {bayFilter.length > 0 && (
                <span className="ml-auto text-xs text-tertiary">
                    Showing {bayFilter.length} of {BAYS.length} bays
                </span>
            )}
        </div>
    </div>
);

/* -------------------------------------------------------------------------- */
/*  Concept A: bays across, time down (Birdie's chosen layout)               */
/* -------------------------------------------------------------------------- */

const SLOT_PX = 44;
const COL_W = 148;
const GUTTER = 76;
const px = (minutes: number) => ((minutes - DAY_START) / SLOT) * SLOT_PX;

const ColumnChip = ({ res, dim, onOpen }: { res: Reservation; dim: boolean; onOpen: () => void }) => {
    const customer = customerById(res.customerId)!;
    const live = holdsTime(res);
    const height = (res.duration / SLOT) * SLOT_PX - 4;
    return (
        <button
            type="button"
            onClick={onOpen}
            aria-label={`${customer.name}, ${fmtTime(res.start)}, ${fmtDuration(res.duration)}, ${STATUS_LABEL[res.status]}`}
            style={{ top: px(res.start) + 2, height }}
            className={cx(
                "absolute z-[2] flex cursor-pointer flex-col overflow-hidden rounded-lg text-left shadow-xs ring-1 transition duration-100 ease-linear ring-inset hover:shadow-md",
                live ? "right-1.5 left-1.5" : "right-1.5 left-1/2 border border-dashed border-secondary bg-primary opacity-70 shadow-none ring-0",
                live && (res.status === "checkedIn" ? "bg-success-primary ring-secondary" : "bg-primary ring-secondary"),
                dim && "opacity-30",
            )}
        >
            {live && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: ribbonColor(res) }} />}
            <span className={cx("flex flex-col gap-0.5 py-1.5", live ? "pr-2 pl-3" : "px-2")}>
                <span className={cx("truncate text-xs font-semibold text-primary", !live && "text-tertiary line-through")}>{customer.name}</span>
                {live ? (
                    <span className="flex items-center justify-between gap-1 text-[11px] text-tertiary">
                        <span className="truncate tabular-nums">
                            {res.party} · {fmtDuration(res.duration)}
                        </span>
                        <Marks res={res} />
                    </span>
                ) : (
                    <span className="text-[11px] text-tertiary">{STATUS_LABEL[res.status]}</span>
                )}
                {live && res.note && height > 90 && <span className="line-clamp-2 text-[11px] text-secondary">{res.note}</span>}
            </span>
        </button>
    );
};

const BlockChip = ({ block, onOpen, compact }: { block: Block; onOpen: () => void; compact?: boolean }) => (
    <button
        type="button"
        onClick={onOpen}
        style={compact ? STRIPES : { ...STRIPES, top: px(block.start) + 2, height: (block.duration / SLOT) * SLOT_PX - 4 }}
        className={cx(
            "flex cursor-pointer flex-col gap-0.5 overflow-hidden rounded-lg bg-secondary px-2.5 py-1.5 text-left ring-1 ring-secondary ring-inset",
            compact ? "min-w-48" : "absolute right-1.5 left-1.5 z-[1]",
        )}
    >
        <span className="flex items-center gap-1 text-xs font-semibold text-secondary">
            <Lock01 aria-hidden="true" className="size-3" />
            Blocked
            {block.repeat !== "none" && <Repeat04 aria-label="Repeats" className="size-3 text-fg-quaternary" />}
        </span>
        <span className="truncate text-[11px] text-tertiary">{block.label}</span>
        {compact && (
            <span className="text-[11px] text-tertiary">
                {bayById(block.bayId).name} · {fmtDuration(block.duration)}
            </span>
        )}
    </button>
);

const ColumnsSheet = ({
    bays,
    reservations,
    blocks,
    isDim,
    onBook,
    onOpen,
    onOpenBlock,
}: {
    bays: readonly (typeof BAYS)[number][];
    reservations: Reservation[];
    blocks: Block[];
    isDim: (r: Reservation) => boolean;
    onBook: (bayId: string, start: number) => void;
    onOpen: (id: string) => void;
    onOpenBlock: (id: string) => void;
}) => {
    const times = slots();
    const height = times.length * SLOT_PX;
    return (
        <div className="h-[720px] overflow-auto rounded-xl bg-primary ring-1 ring-secondary">
            <div className="relative" style={{ width: GUTTER + bays.length * COL_W, minWidth: "100%" }}>
                {/* Bay names ride along as the day scrolls. */}
                <div className="sticky top-0 z-20 flex border-b border-secondary bg-primary">
                    <div className="sticky left-0 z-30 shrink-0 bg-primary" style={{ width: GUTTER }} />
                    {bays.map((b) => (
                        <div key={b.id} className="flex shrink-0 flex-col border-l border-secondary px-3 py-2.5" style={{ width: COL_W }}>
                            <span className="truncate text-sm font-semibold text-primary">{b.name}</span>
                            <span className="text-xs text-tertiary">Up to {b.capacity}</span>
                        </div>
                    ))}
                </div>
                <div className="flex">
                    {/* The clock stays put as bays scroll sideways. */}
                    <div className="sticky left-0 z-10 shrink-0 bg-primary" style={{ width: GUTTER, height }}>
                        {times.map((t) => (
                            <div key={t} className="relative border-b border-transparent" style={{ height: SLOT_PX }}>
                                {t % 60 === 0 && (
                                    <span
                                        className={cx("absolute right-3 text-xs font-medium text-tertiary tabular-nums", t === DAY_START ? "top-1" : "-top-2")}
                                    >
                                        {fmtTime(t)}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                    {bays.map((b) => (
                        <div key={b.id} className="relative shrink-0 border-l border-secondary" style={{ width: COL_W, height }}>
                            {times.map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    aria-label={`Book ${b.name} at ${fmtTime(t)}`}
                                    onClick={() => onBook(b.id, t)}
                                    style={{ height: SLOT_PX }}
                                    className={cx(
                                        "group flex w-full cursor-pointer items-center justify-center text-xs font-medium text-transparent transition duration-100 ease-linear hover:bg-brand-primary_alt hover:text-brand-secondary",
                                        t % 60 === 0 ? "border-t border-secondary" : "border-t border-dashed border-tertiary",
                                    )}
                                >
                                    <Plus className="size-3.5" aria-hidden="true" />
                                    {fmtTime(t)}
                                </button>
                            ))}
                            {blocks
                                .filter((x) => x.bayId === b.id)
                                .map((x) => (
                                    <BlockChip key={x.id} block={x} onOpen={() => onOpenBlock(x.id)} />
                                ))}
                            {reservations
                                .filter((x) => x.bayId === b.id)
                                .map((x) => (
                                    <ColumnChip key={x.id} res={x} dim={isDim(x)} onOpen={() => onOpen(x.id)} />
                                ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SummaryLine = ({ reservations }: { reservations: Reservation[] }) => {
    const live = reservations.filter(holdsTime);
    const items: [string, number][] = [
        ["Bookings", live.length],
        ["Checked in", live.filter((r) => r.status === "checkedIn").length],
        ["Open tabs", live.filter((r) => r.tabOpen).length],
        ["Unpaid", live.filter((r) => !r.paid && !r.tabOpen).length],
        ["No-shows", reservations.filter((r) => r.status === "noShow").length],
    ];
    return (
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
            {items.map(([label, n]) => (
                <span key={label}>
                    <span className="text-tertiary">{label}</span> <span className="font-semibold text-primary tabular-nums">{n}</span>
                </span>
            ))}
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*  Concept B: the Daily Tee Sheet's layout                                   */
/* -------------------------------------------------------------------------- */

const MiniCalendar = () => {
    // November 2026 starts on a Sunday.
    const days = Array.from({ length: 35 }, (_, i) => i + 1);
    return (
        <div className="flex flex-col gap-3">
            <Button size="md" iconLeading={Calendar}>
                Go to today
            </Button>
            <div className="rounded-lg p-3 ring-1 ring-secondary">
                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-primary">
                    <ChevronLeft className="size-4 text-fg-quaternary" aria-hidden="true" />
                    November 2026
                    <ChevronRight className="size-4 text-fg-quaternary" aria-hidden="true" />
                </div>
                <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                        <span key={d} className="font-medium text-tertiary">
                            {d}
                        </span>
                    ))}
                    {days.map((d) => (
                        <span
                            key={d}
                            className={cx(
                                "mx-auto flex size-7 items-center justify-center rounded-md tabular-nums",
                                d > 30 ? "text-quaternary" : "text-secondary",
                                d === 17 && "bg-brand-solid font-semibold text-white",
                                d === 11 && "ring-1 ring-brand ring-inset",
                            )}
                        >
                            {d > 30 ? d - 30 : d}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const DayOverview = ({ reservations, bays }: { reservations: Reservation[]; bays: readonly (typeof BAYS)[number][] }) => {
    const live = reservations.filter(holdsTime);
    const hours = Array.from({ length: (DAY_END - DAY_START) / 60 }, (_, i) => DAY_START + i * 60);
    const inUse = (t: number) => new Set(live.filter((r) => r.start < t + 60 && t < r.start + r.duration).map((r) => r.bayId)).size;
    const totalHours = (bays.length * (DAY_END - DAY_START)) / 60;
    const bookedHours = live.reduce((n, r) => n + r.duration / 60, 0);
    const stats: [string, string | number][] = [
        ["Bookings", live.length],
        ["Checked in", live.filter((r) => r.status === "checkedIn").length],
        ["Paid", live.filter((r) => r.paid).length],
        ["No-shows", reservations.filter((r) => r.status === "noShow").length],
        ["Open hours", Math.round(totalHours - bookedHours)],
    ];
    return (
        <div className="grid gap-5 rounded-xl bg-primary p-4 ring-1 ring-secondary lg:grid-cols-[240px_minmax(0,1fr)]">
            <MiniCalendar />
            <div className="flex min-w-0 flex-col gap-4">
                <div className="grid grid-cols-5 divide-x divide-secondary rounded-lg ring-1 ring-secondary">
                    {stats.map(([label, value]) => (
                        <div key={label} className="flex flex-col items-center gap-0.5 px-2 py-2.5">
                            <span className="text-xs font-medium text-tertiary">{label}</span>
                            <span className="text-lg font-semibold text-primary tabular-nums">{value}</span>
                        </div>
                    ))}
                </div>
                <div role="img" aria-label="Bays in use by hour" className="flex h-32 items-end gap-1">
                    {hours.map((t) => {
                        const share = inUse(t) / bays.length;
                        return (
                            <div key={t} className="flex h-full flex-1 flex-col items-center gap-1">
                                <div className="flex w-full flex-1 items-end overflow-hidden rounded-sm bg-tertiary">
                                    <div className="w-full bg-brand-solid" style={{ height: `${Math.max(share * 100, 2)}%`, opacity: 0.45 + share * 0.55 }} />
                                </div>
                                <span className="text-[10px] text-tertiary">{fmtHour(t)}</span>
                            </div>
                        );
                    })}
                </div>
                <div className="grid gap-3 border-t border-secondary pt-3 text-sm sm:grid-cols-2">
                    <span className="text-tertiary">
                        <span className="font-semibold text-secondary uppercase">Notes</span> None — click to add
                    </span>
                    <span className="text-tertiary">
                        <span className="font-semibold text-secondary uppercase">Public notes</span> None — click to add
                    </span>
                </div>
            </div>
        </div>
    );
};

const RowCard = ({ res, dim, onOpen }: { res: Reservation; dim: boolean; onOpen: () => void }) => {
    const customer = customerById(res.customerId)!;
    const live = holdsTime(res);
    return (
        <button
            type="button"
            onClick={onOpen}
            className={cx(
                "relative flex min-w-48 cursor-pointer flex-col gap-0.5 overflow-hidden rounded-lg px-3 pt-2 pb-2.5 text-left ring-1 transition duration-100 ease-linear ring-inset hover:shadow-md",
                live
                    ? res.status === "checkedIn"
                        ? "bg-success-primary ring-secondary"
                        : "bg-primary ring-secondary"
                    : "border border-dashed border-secondary opacity-70 ring-0",
                dim && "opacity-30",
            )}
        >
            <span className="flex items-center justify-between gap-3">
                <span className={cx("truncate text-sm font-semibold text-primary", !live && "text-tertiary line-through")}>{customer.name}</span>
                {live ? <Marks res={res} /> : <span className="text-xs text-tertiary">{STATUS_LABEL[res.status]}</span>}
            </span>
            <span className="text-xs text-tertiary">
                {bayById(res.bayId).name} · {res.party} {res.party === 1 ? "player" : "players"} · until {fmtTime(res.start + res.duration)}
            </span>
            {res.note && live && <span className="max-w-64 truncate text-xs text-secondary">{res.note}</span>}
            {live && <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1" style={{ backgroundColor: ribbonColor(res) }} />}
        </button>
    );
};

const RowsSheet = ({
    bays,
    reservations,
    blocks,
    isDim,
    onBook,
    onOpen,
    onOpenBlock,
}: {
    bays: readonly (typeof BAYS)[number][];
    reservations: Reservation[];
    blocks: Block[];
    isDim: (r: Reservation) => boolean;
    onBook: (bayId: string, start: number) => void;
    onOpen: (id: string) => void;
    onOpenBlock: (id: string) => void;
}) => {
    const ids = new Set<string>(bays.map((b) => b.id));
    const shown = reservations.filter((r) => ids.has(r.bayId));
    const shownBlocks = blocks.filter((b) => ids.has(b.bayId));
    return (
        <div className="overflow-hidden rounded-xl bg-primary ring-1 ring-secondary">
            <div className="flex items-center gap-4 border-b border-secondary bg-secondary px-4 py-2.5 text-xs font-semibold text-tertiary uppercase">
                <span className="w-24 shrink-0">Time</span>
                <span className="flex-1">Starting now</span>
                <span className="w-44 shrink-0 text-right">Free bays</span>
            </div>
            <div className="divide-y divide-secondary">
                {slots().map((t) => {
                    const starting = shown.filter((r) => r.start === t);
                    const blocksStarting = shownBlocks.filter((b) => b.start === t);
                    const free = bays.filter((b) => !conflictFor(reservations, blocks, { bayId: b.id, start: t, duration: SLOT }));
                    return (
                        <div key={t} className="flex items-start gap-4 px-4 py-3">
                            <span className="w-24 shrink-0 pt-2 text-sm font-semibold text-brand-secondary tabular-nums">{fmtTime(t)}</span>
                            <div className="flex min-h-11 flex-1 flex-wrap gap-2">
                                {starting.map((r) => (
                                    <RowCard key={r.id} res={r} dim={isDim(r)} onOpen={() => onOpen(r.id)} />
                                ))}
                                {blocksStarting.map((b) => (
                                    <BlockChip key={b.id} block={b} compact onOpen={() => onOpenBlock(b.id)} />
                                ))}
                            </div>
                            <div className="flex w-44 shrink-0 items-center justify-end gap-3 pt-1.5">
                                <span className={cx("text-xs tabular-nums", free.length ? "text-tertiary" : "font-medium text-error-primary")}>
                                    {free.length ? `${free.length} of ${bays.length} free` : "Full"}
                                </span>
                                <Button size="sm" color="secondary" iconLeading={Plus} isDisabled={!free.length} onClick={() => onBook(free[0].id, t)}>
                                    Book
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*  The page                                                                  */
/* -------------------------------------------------------------------------- */

const LAYOUT_COPY: Record<Layout, string> = {
    columns: "Every bay for the day. Click open time to book it; click a booking to see or change it.",
    rows: "Every bay for the day, read like the tee sheet: one row per half hour.",
};

export const BaySheetPage = ({
    layout,
    initialPanel,
    initialBays = [],
    initialQuery = "",
    note,
}: {
    layout: Layout;
    initialPanel?: Panel;
    initialBays?: string[];
    initialQuery?: string;
    /** A line above the sheet saying what this story shows. */
    note?: ReactNode;
}) => {
    const [reservations, setReservations] = useState(SEED_RESERVATIONS);
    const [blocks, setBlocks] = useState(SEED_BLOCKS);
    const [panel, setPanel] = useState<Panel | null>(initialPanel ?? null);
    const [bayFilter, setBayFilter] = useState<string[]>(initialBays);
    const [query, setQuery] = useState(initialQuery);
    const [toast, setToast] = useState<string | null>(null);

    const bays = bayFilter.length ? BAYS.filter((b) => bayFilter.includes(b.id as string)) : BAYS;
    const q = query.trim().toLowerCase();
    const isDim = (r: Reservation) => Boolean(q) && !customerById(r.customerId)?.name.toLowerCase().includes(q);
    const close = () => setPanel(null);
    const book = (bayId: string, start: number) => setPanel({ kind: "book", draft: { bayId, start } });
    const firstFree = () => {
        for (const t of slots())
            for (const b of bays) if (!conflictFor(reservations, blocks, { bayId: b.id, start: t, duration: 60 })) return { bayId: b.id, start: t };
        return { bayId: bays[0].id, start: DAY_START };
    };
    const update = (res: Reservation, message: string) => {
        setReservations((all) => all.map((x) => (x.id === res.id ? res : x)));
        setToast(message);
    };
    const open = panel?.kind === "details" ? reservations.find((r) => r.id === panel.id) : undefined;

    const sheetProps = {
        bays,
        reservations,
        blocks,
        isDim,
        onBook: book,
        onOpen: (id: string) => setPanel({ kind: "details", id }),
        onOpenBlock: (id: string) => setPanel({ kind: "block", draft: { bayId: "", start: 0, id } }),
    };

    return (
        <ScreenShell
            nav={{ activeId: BAY_SHEET_NAV, scrollToActive: true }}
            course="bushwood"
            title="Bay Sheet"
            description={LAYOUT_COPY[layout]}
            header={
                <CreditsHeader
                    crumbs={["Simulator Bays", "Bay Sheet"]}
                    title="Bay Sheet"
                    description={LAYOUT_COPY[layout]}
                    actions={
                        <ActionBar
                            primary={{ id: "book", label: "New booking", icon: Plus, onAction: () => setPanel({ kind: "book", draft: firstFree() }) }}
                            secondary={[
                                { id: "print", label: "Print", icon: Printer },
                                {
                                    id: "block",
                                    label: "Block a bay",
                                    icon: Lock01,
                                    onAction: () => setPanel({ kind: "block", draft: { bayId: bays[0].id, start: DAY_START } }),
                                },
                            ]}
                        />
                    }
                />
            }
        >
            {note && <div className="rounded-lg bg-brand-primary_alt px-4 py-3 text-sm text-brand-secondary ring-1 ring-brand ring-inset">{note}</div>}
            <Toast message={toast} onDismiss={() => setToast(null)} />
            <Toolbar query={query} onQuery={setQuery} bayFilter={bayFilter} onBayFilter={setBayFilter} />
            {layout === "columns" ? (
                <>
                    <SummaryLine reservations={reservations.filter((r) => bays.some((b) => b.id === r.bayId))} />
                    <ColumnsSheet {...sheetProps} />
                </>
            ) : (
                <>
                    <DayOverview reservations={reservations.filter((r) => bays.some((b) => b.id === r.bayId))} bays={bays} />
                    <RowsSheet {...sheetProps} />
                </>
            )}
            <Legend />

            {panel?.kind === "book" && (
                <BookPanel
                    key={`${panel.draft.bayId}-${panel.draft.start}`}
                    draft={panel.draft}
                    reservations={reservations}
                    blocks={blocks}
                    onClose={close}
                    onBook={(res, sendEmail) => {
                        setReservations((all) => [...all, { ...res, id: `r-${Date.now()}` }]);
                        setToast(
                            `${customerById(res.customerId)?.name} booked in ${bayById(res.bayId).name} at ${fmtTime(res.start)}.${sendEmail ? " Confirmation emailed." : ""}`,
                        );
                        close();
                    }}
                />
            )}
            {open && (
                <DetailsPanel
                    key={open.id}
                    res={open}
                    reservations={reservations}
                    blocks={blocks}
                    onClose={close}
                    onSave={(res, message) => {
                        update(res, message);
                        close();
                    }}
                    onStatus={(res, message) => {
                        update(res, message);
                        if (res.status === "cancelled" || res.status === "noShow") close();
                    }}
                    onCancelSeries={(seriesId) => {
                        setReservations((all) => all.map((x) => (x.seriesId === seriesId ? { ...x, status: "cancelled" } : x)));
                        setToast("Series cancelled. Every future booking in it is freed.");
                        close();
                    }}
                />
            )}
            {panel?.kind === "block" && (
                <BlockPanel
                    key={panel.draft.id ?? `${panel.draft.bayId}-${panel.draft.start}`}
                    draft={panel.draft}
                    reservations={reservations}
                    blocks={blocks}
                    onClose={close}
                    onSave={(added, replaceId) => {
                        setBlocks((all) => [...all.filter((b) => b.id !== replaceId), ...added.map((b, i) => ({ ...b, id: `b-${Date.now()}-${i}` }))]);
                        setToast(replaceId ? "Block saved." : `${added.length === 1 ? bayById(added[0].bayId).name : `${added.length} bays`} blocked.`);
                        close();
                    }}
                    onRemove={(id) => {
                        setBlocks((all) => all.filter((b) => b.id !== id));
                        setToast("Block removed. The time is open again.");
                        close();
                    }}
                />
            )}
        </ScreenShell>
    );
};

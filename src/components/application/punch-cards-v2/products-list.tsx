"use client";

import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { ChevronRight, Download01, List, Plus, SearchLg, Settings01, Ticket01 } from "@untitledui/icons";
import { Dialog as AriaDialog, DialogTrigger as AriaDialogTrigger, Popover as AriaPopover } from "react-aria-components";
import { EmbeddedShellContext, ScreenShell, TabStrip, Td, Th } from "@/components/application/migration-v2/kit";
import { FilterTag, OfferingFilter } from "@/components/application/punch-cards-table/punch-cards-table";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import type { ItemKind, PunchCard, PunchItem } from "./data";
import { ALL_ACTIVITIES, ALL_CLINICS, ALL_PRODUCTS, COMBINATIONS, EMPTY_CARD, NEVER_EXPIRES, cardTotals, itemLabel, kindMeta } from "./data";
import type { ModalState } from "./punch-card-page";
import { PUNCH_CARDS_NAV_ID, PunchCardBuilder } from "./punch-card-page";

/*
 * Page 2 of 2: Products › Punch Cards (Beta) › List, the punch cards created
 * to be sold (not assigned to a customer). Lisa's missing view: today's list
 * only has Rounds and Transpos, so the new offerings disappear from it.
 * Add Punch Card and clicking a row open the builder (Concept 3A for now).
 */

/** A punch card for sale: the builder's card, its ID, and any flat fees from today's list. */
export type CatalogCard = { id: number; card: PunchCard; fees: number };

let seq = 0;
const items = (...list: Omit<PunchItem, "id">[]): PunchItem[] => list.map((item) => ({ ...item, id: `cat-${++seq}` }));
const base = { tax2: "none", courses: ["Bushwood Country Club"], expiration: NEVER_EXPIRES };

/** Today's four QA cards (same prices, fees and totals), two "All …" cards, then the Punch Cards V2 examples. */
export const CATALOG: CatalogCard[] = [
    {
        id: 1,
        fees: 0,
        card: {
            ...base,
            title: "10 Rounder",
            description: "10 Rounder",
            price: 100,
            tax: "admissions",
            items: items({ kind: "green-fee", target: "Any round", punches: 10 }, { kind: "transportation", target: "Any transportation", punches: 10 }),
        },
    },
    {
        id: 3,
        fees: 2.5,
        card: {
            ...base,
            title: "Fundays",
            description: "Fundays",
            price: 25,
            tax: "exempt",
            items: items({ kind: "green-fee", target: "Any round", punches: 5 }, { kind: "transportation", target: "Any transportation", punches: 5 }),
        },
    },
    {
        id: 4,
        fees: 10,
        card: {
            ...base,
            title: "Summer Pack",
            description: "Summer Pack",
            price: 100,
            tax: "exempt",
            items: items({ kind: "green-fee", target: "Any round", punches: 15 }, { kind: "transportation", target: "Any transportation", punches: 15 }),
        },
    },
    {
        id: 5,
        fees: 15,
        card: {
            ...base,
            title: "Golf + Activity",
            description: "3 rounds and 2 activities",
            price: 150,
            tax: "admissions",
            items: items({ kind: "green-fee", target: "Any round", punches: 3 }, { kind: "activity", target: "Simulator Bays", duration: 60, punches: 2 }),
        },
    },
    {
        // From QA (10/27 call): "any" items next to a specific product.
        id: 6,
        fees: 30,
        card: {
            ...base,
            title: "Clinic Golf & Activities",
            description: "Everything!",
            price: 300,
            tax: "admissions",
            items: items(
                { kind: "green-fee", target: "Any round", punches: 2 },
                { kind: "transportation", target: "Any transportation", punches: 2 },
                { kind: "activity", target: ALL_ACTIVITIES, duration: 60, punches: 2 },
                { kind: "product", target: "Tee Socks", punches: 1 },
                { kind: "clinic", target: ALL_CLINICS, punches: 1 },
            ),
        },
    },
    {
        id: 7,
        fees: 0,
        card: {
            ...base,
            title: "Activity Pass",
            description: "Ten one-hour sessions of any activity.",
            price: 300,
            tax: "admissions",
            items: items({ kind: "activity", target: ALL_ACTIVITIES, duration: 60, punches: 10 }),
        },
    },
    {
        id: 8,
        fees: 0,
        card: {
            ...base,
            title: "Pro Shop Punches",
            description: "Five punches for any product, plus two clinics.",
            price: 120,
            tax: "sales",
            items: items({ kind: "product", target: ALL_PRODUCTS, punches: 5 }, { kind: "clinic", target: ALL_CLINICS, punches: 2 }),
        },
    },
    ...COMBINATIONS.map(({ card }, i) => ({ id: 9 + i, fees: 0, card })),
];

const dollars = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
const round = (n: number) => Math.round(n * 100) / 100;
const priceOf = ({ card, fees }: CatalogCard) => {
    const t = cardTotals(card);
    return { fees, tax: t.tax, tax2: t.tax2, total: round(card.price + fees + t.tax + t.tax2) };
};

/** Units per offering, as in 1b ("10 rounds", "2 sessions"). */
const UNITS: Record<ItemKind, [string, string]> = {
    "green-fee": ["round", "rounds"],
    transportation: ["cart fee", "cart fees"],
    product: ["item", "items"],
    activity: ["session", "sessions"],
    clinic: ["seat", "seats"],
    lesson: ["lesson", "lessons"],
};
const unit = (item: PunchItem) => UNITS[item.kind][item.punches === 1 ? 0 : 1];

/** One line per included item, e.g. "Any activity · 60 min each" … "2 sessions". */
export const includedLine = (item: PunchItem) => `${item.punches} ${unit(item)} · ${itemLabel(item)}`;

/** Offering types on the card, as small labels (same as 1b). */
const OfferingBadges = ({ items }: { items: PunchItem[] }) => (
    <div className="flex max-w-48 flex-wrap gap-1.5">
        {[...new Set(items.map((item) => item.kind))].map((kind) => {
            const { icon: Icon, label } = kindMeta(kind);
            return (
                <span
                    key={kind}
                    className="inline-flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary ring-1 ring-secondary ring-inset"
                >
                    <Icon aria-hidden="true" className="size-3.5" />
                    {label}
                </span>
            );
        })}
    </div>
);

/**
 * Everything the card includes, one row per item: what it covers ("Any round", "Tee Socks",
 * "Any activity · 60 min each") and how many. Like 1b's balance list, but no progress bar,
 * since nothing has been used on a card that's for sale.
 */
const IncludedList = ({ items }: { items: PunchItem[] }) => (
    <div className="flex min-w-56 flex-col gap-1.5">
        {items.map((item) => (
            <div key={item.id} className="flex items-baseline justify-between gap-4 text-xs">
                <span className="text-secondary">{itemLabel(item)}</span>
                <span className="shrink-0 font-medium text-primary tabular-nums">
                    {item.punches} <span className="font-normal text-tertiary">{unit(item)}</span>
                </span>
            </div>
        ))}
    </div>
);

function exportCatalog(rows: CatalogCard[]) {
    const header = ["ID", "Title", "Description", "Included", "Price", "Fees", "Tax", "Tax 2", "Grand Total"];
    const body = rows.map((row) => {
        const p = priceOf(row);
        return [
            row.id,
            row.card.title,
            row.card.description,
            row.card.items.map(includedLine).join("; "),
            row.card.price.toFixed(2),
            p.fees.toFixed(2),
            p.tax.toFixed(2),
            p.tax2.toFixed(2),
            p.total.toFixed(2),
        ];
    });
    const csv = [header, ...body].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "punch-cards.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** The list on its own: search, offering-type filter, Columns, and one row per punch card for sale. */
const ProductsList = ({
    rows,
    initialKinds = [],
    onOpen,
    tabs,
    showList = true,
    children,
}: {
    rows: CatalogCard[];
    initialKinds?: ItemKind[];
    onOpen: (row: CatalogCard | null) => void;
    /** The tab strip under the page header (list + open cards). */
    tabs?: ReactNode;
    /** False while a card's tab is active (the list stays mounted so its filters are kept). */
    showList?: boolean;
    /** Open cards' tabs. */
    children?: ReactNode;
}) => {
    const [query, setQuery] = useState("");
    const [kinds, setKinds] = useState<ItemKind[]>(initialKinds);
    const [showDescription, setShowDescription] = useState(true);
    const [showBreakdown, setShowBreakdown] = useState(true);

    const q = query.trim().toLowerCase();
    const results = rows.filter(
        ({ id, card }) =>
            (!q || `${id} ${card.title} ${card.description}`.toLowerCase().includes(q)) &&
            (!kinds.length || card.items.some((item) => kinds.includes(item.kind))),
    );

    return (
        <ScreenShell
            nav={{ activeId: PUNCH_CARDS_NAV_ID, scrollToActive: true }}
            title="Punch Cards"
            description=""
            header={
                <header className="border-b border-secondary bg-primary px-8 pt-5 pb-6">
                    <div className="mb-4 flex items-center gap-2 text-xs font-medium text-tertiary">
                        Products <ChevronRight aria-hidden="true" className="size-3" />
                        <span className="text-secondary">Punch Cards</span>
                    </div>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-display-xs font-semibold tracking-tight text-primary">Punch Cards</h1>
                                <Badge color="brand" size="sm">
                                    Beta
                                </Badge>
                            </div>
                            <p className="mt-1.5 max-w-2xl text-sm text-tertiary">Pre-paid punch cards available for sale.</p>
                        </div>
                        <div className="flex gap-3">
                            <Button color="secondary" size="md" iconLeading={Download01} isDisabled={!results.length} onClick={() => exportCatalog(results)}>
                                Export CSV
                            </Button>
                            <Button size="md" iconLeading={Plus} onClick={() => onOpen(null)}>
                                Add Punch Card
                            </Button>
                        </div>
                    </div>
                </header>
            }
            tabs={tabs}
        >
            <section
                className={cx("min-w-0 overflow-hidden rounded-xl bg-primary shadow-xs ring-1 ring-secondary", !showList && "hidden")}
                aria-label="Punch cards for sale"
            >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-secondary px-5 py-4">
                    <div>
                        <h2 className="flex items-center gap-2 text-md font-semibold text-primary">
                            Punch cards
                            <Badge color="gray" size="sm">
                                {results.length}
                            </Badge>
                        </h2>
                        <p className="mt-1 text-xs text-tertiary">Everything each card includes, and how many of each.</p>
                    </div>
                    <AriaDialogTrigger>
                        <Button color="secondary" size="sm" iconLeading={Settings01}>
                            Columns
                        </Button>
                        <AriaPopover placement="bottom end" className="z-40 rounded-xl bg-primary p-4 shadow-lg ring-1 ring-secondary">
                            <AriaDialog aria-label="Visible columns" className="flex flex-col gap-3 outline-hidden">
                                <p className="text-sm font-semibold text-primary">Columns</p>
                                <Checkbox label="Description" isSelected={showDescription} onChange={setShowDescription} />
                                <Checkbox label="Price breakdown (fees, tax, tax 2)" isSelected={showBreakdown} onChange={setShowBreakdown} />
                            </AriaDialog>
                        </AriaPopover>
                    </AriaDialogTrigger>
                </div>

                <div className="flex flex-col gap-3 border-b border-secondary p-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="min-w-48 flex-1 xl:max-w-80">
                            <Input
                                aria-label="Search punch cards"
                                placeholder="Search ID, title, or description…"
                                icon={SearchLg}
                                value={query}
                                onChange={setQuery}
                            />
                        </div>
                        <OfferingFilter selected={kinds} onChange={setKinds} />
                    </div>
                    {(kinds.length > 0 || query) && (
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                            {kinds.map((kind) => (
                                <FilterTag key={kind} label={kindMeta(kind).label} onRemove={() => setKinds(kinds.filter((k) => k !== kind))} />
                            ))}
                            <Button
                                color="link-gray"
                                size="sm"
                                onClick={() => {
                                    setKinds([]);
                                    setQuery("");
                                }}
                            >
                                Clear all
                            </Button>
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm" aria-label="Punch cards for sale">
                        <thead>
                            <tr>
                                <Th>ID</Th>
                                <Th>Title</Th>
                                <Th>Offering types</Th>
                                <Th>Included</Th>
                                <Th className="text-right">Price</Th>
                                {showBreakdown && (
                                    <>
                                        <Th className="text-right">Fees</Th>
                                        <Th className="text-right">Tax</Th>
                                        <Th className="text-right">Tax 2</Th>
                                    </>
                                )}
                                <Th className="text-right">Grand total</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((row) => {
                                const p = priceOf(row);
                                return (
                                    <tr key={row.id} className="cursor-pointer align-top hover:bg-primary_hover" onClick={() => onOpen(row)}>
                                        <Td>
                                            <button type="button" className="cursor-pointer font-medium text-brand-secondary hover:underline">
                                                {row.id}
                                            </button>
                                        </Td>
                                        <Td className="min-w-40">
                                            <div className="font-medium text-primary">{row.card.title}</div>
                                            {showDescription && row.card.description !== row.card.title && (
                                                <div className="mt-0.5 max-w-56 text-xs text-tertiary">{row.card.description}</div>
                                            )}
                                        </Td>
                                        <Td>
                                            <OfferingBadges items={row.card.items} />
                                        </Td>
                                        <Td>
                                            <IncludedList items={row.card.items} />
                                        </Td>
                                        <Td className="text-right tabular-nums">{dollars(row.card.price)}</Td>
                                        {showBreakdown && (
                                            <>
                                                <Td className="text-right tabular-nums">{dollars(p.fees)}</Td>
                                                <Td className="text-right tabular-nums">{dollars(p.tax)}</Td>
                                                <Td className="text-right tabular-nums">{dollars(p.tax2)}</Td>
                                            </>
                                        )}
                                        <Td className="text-right font-semibold tabular-nums">{dollars(p.total)}</Td>
                                    </tr>
                                );
                            })}
                            {!results.length && (
                                <tr>
                                    <td colSpan={showBreakdown ? 9 : 6} className="px-6 py-14 text-center">
                                        <p className="text-sm font-semibold text-primary">No punch cards match</p>
                                        <p className="mt-1 text-sm text-tertiary">Try a different search or offering type.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="border-t border-secondary px-5 py-3 text-xs text-tertiary">
                    {results.length} of {rows.length} punch cards
                </div>
            </section>
            {children}
        </ScreenShell>
    );
};

type OpenTab = { key: string; rowId?: number; title: string; initial: PunchCard; modal?: Partial<ModalState> };

/**
 * Products › Punch Cards (Beta), with the same tabs as Customer Punch Cards: the
 * list is the first tab; a row opens that card in its own closable tab to edit,
 * and Add Punch Card opens a "New punch card" tab. Several can be open at once;
 * switching tabs keeps unsaved changes. Cancel closes the tab, and saving
 * updates the list (a new card is added to it).
 */
export const PunchCardProducts = ({
    initialKinds,
    initialOpen = [],
}: {
    initialKinds?: ItemKind[];
    /** Tabs to start with: a catalog card by id, or a new card when id is left out; the last one is active. */
    initialOpen?: { id?: number; modal?: Partial<ModalState> }[];
}) => {
    const drafts = useRef(0);
    const [rows, setRows] = useState(CATALOG);
    const tabFor = (row: CatalogCard | null, modal?: Partial<ModalState>): OpenTab =>
        row
            ? { key: `card-${row.id}`, rowId: row.id, title: row.card.title, initial: { ...row.card, fees: row.fees }, modal }
            : { key: `new-${++drafts.current}`, title: "New punch card", initial: EMPTY_CARD, modal };
    const [tabs, setTabs] = useState<OpenTab[]>(() => initialOpen.map(({ id, modal }) => tabFor(CATALOG.find((r) => r.id === id) ?? null, modal)));
    const [active, setActive] = useState(() => tabs.at(-1)?.key ?? "list");

    const open = (row: CatalogCard | null) => {
        const existing = row && tabs.find((t) => t.rowId === row.id);
        if (existing) return setActive(existing.key);
        const tab = tabFor(row);
        setTabs((all) => [...all, tab]);
        setActive(tab.key);
    };
    const close = (key: string) => {
        setTabs((all) => all.filter((t) => t.key !== key));
        if (active === key) setActive("list");
    };
    const saved = (tab: OpenTab, card: PunchCard) => {
        if (tab.rowId !== undefined) {
            setRows((all) => all.map((r) => (r.id === tab.rowId ? { ...r, card, fees: card.fees ?? r.fees } : r)));
            setTabs((all) => all.map((t) => (t.key === tab.key ? { ...t, title: card.title } : t)));
        } else {
            const id = Math.max(...rows.map((r) => r.id)) + 1;
            setRows((all) => [...all, { id, fees: 0, card }]);
            setTabs((all) => all.map((t) => (t.key === tab.key ? { ...t, rowId: id, title: card.title } : t)));
        }
    };

    return (
        <ProductsList
            rows={rows}
            initialKinds={initialKinds}
            onOpen={open}
            showList={active === "list"}
            tabs={
                tabs.length > 0 ? (
                    <TabStrip
                        tabs={[
                            { id: "list", label: "Punch cards", icon: List },
                            ...tabs.map((t) => ({
                                id: t.key,
                                label: t.title || "New punch card",
                                sublabel: t.rowId !== undefined ? `#${t.rowId} · Edit` : "Draft",
                                icon: Ticket01,
                                closable: true,
                            })),
                        ]}
                        activeId={active}
                        onSelect={setActive}
                        onClose={close}
                    />
                ) : undefined
            }
        >
            {tabs.map((t) => (
                <div key={t.key} className={cx(t.key !== active && "hidden")}>
                    <EmbeddedShellContext.Provider value>
                        <PunchCardBuilder
                            initial={t.initial}
                            initialModal={t.key === active ? t.modal : undefined}
                            title={t.rowId !== undefined ? "Edit Punch Card" : "New Punch Card"}
                            onBack={() => setActive("list")}
                            onClose={() => close(t.key)}
                            onSaved={(card) => saved(t, card)}
                        />
                    </EmbeddedShellContext.Provider>
                </div>
            ))}
        </ProductsList>
    );
};

"use client";

import { Fragment, useState } from "react";
import { ArrowDown, ArrowUpRight, ChevronDown, ChevronRight, Download01, FilterLines, SearchLg, Settings01, Ticket01, XClose } from "@untitledui/icons";
import { Dialog as AriaDialog, DialogTrigger as AriaDialogTrigger, Popover as AriaPopover } from "react-aria-components";
import { ScreenModal, ScreenShell, Td, Th } from "@/components/application/migration-v2/kit";
import { NAV_IDS } from "@/components/application/migration-v2/nav-tree";
import { ITEM_KINDS, type ItemKind, kindMeta } from "@/components/application/punch-cards-v2/data";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { cx } from "@/utils/cx";
import {
    AS_OF,
    type CardStatus,
    OWNED_CARDS,
    type OwnedCard,
    type OwnedItem,
    SEGMENTS,
    type Segment,
    date,
    inSegment,
    money,
    remaining,
    statusOf,
    unitOf,
} from "./data";

type Version = "filters" | "offerings" | "groups";
const CONCEPTS = {
    filters: {
        label: "1a · Flexible filters",
        description: "One customer card per row. Combine offering types and narrow the list without changing your view.",
    },
    offerings: {
        label: "02 · Offering workspaces",
        description: "Choose an offering to see the details and balances that matter for that part of your business.",
    },
    groups: { label: "03 · Portfolio views", description: "Start with the cards that need attention, then explore them by punch card or customer." },
};
const STATUS_COLORS = { Active: "success", "Expiring soon": "warning", Exhausted: "gray", Expired: "error" } as const;
const STATUSES: CardStatus[] = ["Active", "Expiring soon", "Exhausted", "Expired"];
const PAGE_SIZE = 8;

function Picker({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: string;
    options: { id: string; label: string }[];
    onChange: (value: string) => void;
}) {
    return (
        <Select aria-label={label} selectedKey={value} onSelectionChange={(key) => onChange(String(key))} items={options} className="min-w-40">
            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
        </Select>
    );
}

export function OfferingFilter({ selected, onChange }: { selected: ItemKind[]; onChange: (kinds: ItemKind[]) => void }) {
    return (
        <AriaDialogTrigger>
            <Button color="secondary" size="md" iconTrailing={ChevronDown}>
                Offering type{" "}
                <span className="border-l border-secondary pl-2 text-tertiary">{selected.length ? `${selected.length} selected` : "All types"}</span>
            </Button>
            <AriaPopover placement="bottom start" className="z-40 w-80 rounded-xl bg-primary p-2 shadow-lg ring-1 ring-secondary">
                <AriaDialog aria-label="Filter by offering type" className="outline-hidden">
                    <div className="px-2 py-2 text-xs font-semibold text-tertiary">INCLUDES ANY SELECTED TYPE</div>
                    {ITEM_KINDS.map(({ kind, label, icon: Icon, description }) => (
                        <div key={kind} className="flex items-start gap-3 rounded-lg p-2.5 hover:bg-primary_hover">
                            <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-fg-brand-primary" />
                            <Checkbox
                                label={label}
                                hint={description}
                                isSelected={selected.includes(kind)}
                                onChange={(checked) => onChange(checked ? [...selected, kind] : selected.filter((k) => k !== kind))}
                            />
                        </div>
                    ))}
                    <div className="mt-2 border-t border-secondary p-2">
                        <Button color="link-color" size="sm" onClick={() => onChange([])}>
                            Show all types
                        </Button>
                    </div>
                </AriaDialog>
            </AriaPopover>
        </AriaDialogTrigger>
    );
}

function OfferingBadges({ card }: { card: OwnedCard }) {
    return (
        <div className="flex max-w-60 flex-wrap gap-1.5">
            {[...new Set(card.items.map((item) => item.kind))].map((kind) => {
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
}

function Balance({ items }: { items: OwnedItem[] }) {
    return (
        <div className="flex min-w-44 flex-col gap-2.5">
            {items.map((item, i) => (
                <div key={`${item.kind}-${i}`}>
                    <div className="flex items-baseline justify-between gap-4 text-xs">
                        <span className="max-w-44 truncate text-tertiary" title={item.target}>
                            {item.target}
                        </span>
                        <span className="shrink-0 font-medium text-primary tabular-nums">
                            {remaining(item)} / {item.awarded} <span className="font-normal text-tertiary">{unitOf(item.kind)}</span>
                        </span>
                    </div>
                    <div
                        role="meter"
                        aria-label={`${item.target} remaining`}
                        aria-valuenow={remaining(item)}
                        aria-valuemin={0}
                        aria-valuemax={item.awarded}
                        className="mt-1 h-1 w-full overflow-hidden rounded-full bg-quaternary"
                    >
                        <div
                            className={cx("h-full rounded-full", remaining(item) ? "bg-brand-solid" : "bg-disabled")}
                            style={{ width: `${(remaining(item) / item.awarded) * 100}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

/** One column per offering for 1c, in the order of today's list (Rounds, Transpos) then the new offerings. */
const OFFERING_COLUMNS: { kind: ItemKind; label: string }[] = [
    { kind: "green-fee", label: "Rounds" },
    { kind: "transportation", label: "Transport" },
    { kind: "activity", label: "Activities" },
    { kind: "clinic", label: "Clinics" },
    { kind: "product", label: "Products" },
    { kind: "lesson", label: "Lessons" },
];

/** "Any green fee" / "Any cart fee" say nothing under a Rounds or Transportation balance; specific targets do. */
const detailOf = (item: OwnedItem) =>
    item.kind === "green-fee" || item.kind === "transportation"
        ? item.target.startsWith("Any ")
            ? null
            : item.target
        : item.duration
          ? `${item.target.split(" · ")[0]} · ${item.duration} min`
          : item.target;

/** One offering's balance in its own column: remaining / awarded with a bar, per included item. */
function KindBalance({ items }: { items: OwnedItem[] }) {
    if (!items.length) return <span className="text-quaternary">—</span>;
    return (
        <div className="flex min-w-16 flex-col gap-2">
            {items.map((item, i) => {
                const detail = detailOf(item);
                return (
                    <div key={i}>
                        <div className="text-xs font-medium whitespace-nowrap text-primary tabular-nums">
                            {remaining(item)} / {item.awarded}
                        </div>
                        <div
                            role="meter"
                            aria-label={`${item.target} remaining`}
                            aria-valuenow={remaining(item)}
                            aria-valuemin={0}
                            aria-valuemax={item.awarded}
                            className="mt-1 h-1 w-full overflow-hidden rounded-full bg-quaternary"
                        >
                            <div
                                className={cx("h-full rounded-full", remaining(item) ? "bg-brand-solid" : "bg-disabled")}
                                style={{ width: `${(remaining(item) / item.awarded) * 100}%` }}
                            />
                        </div>
                        {detail && <div className="mt-1 max-w-24 text-xs leading-snug text-tertiary">{detail}</div>}
                    </div>
                );
            })}
        </div>
    );
}

function exportCards(cards: OwnedCard[], kinds: ItemKind[]) {
    const header = [
        "Customer card ID",
        "Customer",
        "Member",
        "Punch card",
        "Offering type",
        "Included item",
        "Minutes per punch",
        "Awarded",
        "Used",
        "Remaining",
        "Status",
        "Course",
        "Purchased",
        "Expiration",
        "Card price pre-tax",
        "Order ID",
    ];
    const rows = cards.flatMap((card) =>
        card.items
            .filter((item) => !kinds.length || kinds.includes(item.kind))
            .map((item) => [
                card.id,
                card.customer ?? "Unassigned customer",
                card.member ? "Yes" : "No",
                card.title,
                kindMeta(item.kind).label,
                item.target,
                item.duration ?? "",
                item.awarded,
                item.used,
                remaining(item),
                statusOf(card),
                card.course,
                card.purchased,
                card.expires ?? "",
                card.price,
                card.order,
            ]),
    );
    const csv = [header, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `customer-punch-cards-${AS_OF}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * `showSummary={false}` drops the four summary boxes above the table and
 * `showIntro={false}` drops the concept caption line (both off for 1b);
 * everything else is unchanged.
 */
export function PunchCardsTable({
    version,
    showSummary = true,
    showIntro = true,
    offeringColumns = false,
}: {
    version: Version;
    showSummary?: boolean;
    showIntro?: boolean;
    /** 1c: one remaining / awarded column per offering instead of Offering types + a combined balance column. */
    offeringColumns?: boolean;
}) {
    const [query, setQuery] = useState("");
    const [kinds, setKinds] = useState<ItemKind[]>([]);
    const [segment, setSegment] = useState<Segment>("all");
    const [status, setStatus] = useState("all");
    const [course, setCourse] = useState("all");
    const [membership, setMembership] = useState("all");
    const [period, setPeriod] = useState("all");
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [showPurchase, setShowPurchase] = useState(false);
    const [showPrice, setShowPrice] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);
    const [detail, setDetail] = useState<OwnedCard | null>(null);
    const [groupBy, setGroupBy] = useState("product");
    const [collapsed, setCollapsed] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [ascending, setAscending] = useState(false);
    const [hiddenKinds, setHiddenKinds] = useState<ItemKind[]>([]);
    const concept = CONCEPTS[version];

    // Every result set and statistic is derived from the same customer-card model.
    const scoped = OWNED_CARDS.filter((card) => {
        const searchText = [card.id, card.customer, card.email, card.title, card.order, ...card.items.map((item) => item.target)].join(" ").toLowerCase();
        return (
            searchText.includes(query.trim().toLowerCase()) &&
            (!kinds.length || card.items.some((item) => kinds.includes(item.kind))) &&
            (status === "all" || statusOf(card) === status) &&
            (course === "all" || card.course === course) &&
            (membership === "all" || (membership === "member" ? card.member : !card.member)) &&
            (period === "all" || card.purchased >= "2026-10-01")
        );
    });
    const results = scoped
        .filter((card) => inSegment(card, segment))
        .sort((a, b) => (ascending ? a.purchased.localeCompare(b.purchased) : b.purchased.localeCompare(a.purchased)));
    const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
    const currentPage = Math.min(page, pageCount);
    const pageRows = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    const exportRows = selected.length ? results.filter((card) => selected.includes(card.id)) : results;
    const selectedVisible = results.filter((card) => selected.includes(card.id));
    const filterCount = [status, course, membership].filter((value) => value !== "all").length;
    const focusKind = version === "offerings" && kinds.length === 1 ? kinds[0] : undefined;
    const focusTitle = focusKind ? kindMeta(focusKind).label : "All offerings";
    const contextualLabel = focusKind
        ? {
              "green-fee": "Green fee eligibility",
              transportation: "Transportation type",
              product: "Product",
              activity: "Activity · time per punch",
              clinic: "Eligible clinic",
              lesson: "Instructor · lesson length",
          }[focusKind]
        : "Offering types";
    const changed = () => {
        setPage(1);
        setSelected([]);
    };
    const changeKinds = (value: ItemKind[]) => {
        setKinds(value);
        changed();
    };
    const changeSegment = (value: Segment) => {
        setSegment(value);
        changed();
        setCollapsed([]);
    };
    const reset = () => {
        setQuery("");
        setKinds([]);
        setSegment("all");
        setStatus("all");
        setCourse("all");
        setMembership("all");
        setPeriod("all");
        changed();
    };
    const groupKeys = [...new Set(results.map((card) => (groupBy === "product" ? card.title : (card.customer ?? "Unassigned customer"))))];
    const displayedItems = (card: OwnedCard) => card.items.filter((item) => !kinds.length || kinds.includes(item.kind));
    // Filtering by offering type narrows 1c to those offerings' columns; Columns can hide any of them.
    const kindColumns = OFFERING_COLUMNS.filter((c) => (!kinds.length || kinds.includes(c.kind)) && !hiddenKinds.includes(c.kind));
    const columnCount = (offeringColumns ? 4 + kindColumns.length : 6) + Number(showPurchase) + Number(showPrice);

    const renderRow = (card: OwnedCard) => (
        <tr key={card.id} className={cx("group transition-colors hover:bg-primary_hover", selected.includes(card.id) && "bg-brand-primary_alt")}>
            <Td className="w-10">
                <Checkbox
                    aria-label={`Select ${card.id}`}
                    isSelected={selected.includes(card.id)}
                    onChange={(checked) => setSelected((previous) => (checked ? [...previous, card.id] : previous.filter((id) => id !== card.id)))}
                />
            </Td>
            <Td className={offeringColumns ? "min-w-36" : "min-w-48"}>
                <button type="button" onClick={() => setDetail(card)} className="cursor-pointer text-left font-semibold text-brand-secondary hover:underline">
                    {card.customer ?? "Unassigned customer"}
                </button>
                <div className="mt-1 text-xs text-tertiary">
                    {card.member ? "Member" : card.customer ? "Guest" : "Customer missing"} <span className="px-1">·</span> {card.id}
                </div>
            </Td>
            <Td className={offeringColumns ? "min-w-40" : "min-w-52"}>
                <button
                    type="button"
                    onClick={() => setDetail(card)}
                    className="max-w-60 cursor-pointer text-left font-medium text-primary hover:text-brand-secondary"
                >
                    {card.title}
                </button>
                <div className="mt-1 text-xs text-tertiary">{card.course}</div>
            </Td>
            {offeringColumns ? (
                kindColumns.map((c) => (
                    <Td key={c.kind} className="px-3">
                        <KindBalance items={card.items.filter((item) => item.kind === c.kind)} />
                    </Td>
                ))
            ) : (
                <>
                    <Td>
                        {focusKind ? (
                            <div className="flex max-w-52 flex-col gap-2">
                                {displayedItems(card).map((item, i) => (
                                    <div key={i}>
                                        <div className="text-sm text-secondary">{item.target}</div>
                                        {item.duration ? (
                                            <div className="text-xs text-tertiary">
                                                {item.duration} min per {focusKind === "lesson" ? "lesson" : "session"}
                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                                {card.items.some((item) => item.kind !== focusKind) && (
                                    <button
                                        type="button"
                                        onClick={() => setDetail(card)}
                                        className="cursor-pointer text-left text-xs font-medium text-brand-secondary"
                                    >
                                        View other included items <ArrowUpRight aria-hidden="true" className="inline size-3" />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <OfferingBadges card={card} />
                        )}
                    </Td>
                    <Td>
                        <Balance items={displayedItems(card)} />
                    </Td>
                </>
            )}
            <Td>
                <Badge color={STATUS_COLORS[statusOf(card)]} size="sm">
                    {statusOf(card)}
                </Badge>
                <div className="mt-1.5 text-xs whitespace-nowrap text-tertiary">{date(card.expires)}</div>
            </Td>
            {showPurchase && <Td className="text-xs whitespace-nowrap text-secondary">{date(card.purchased)}</Td>}
            {showPrice && <Td className="text-right tabular-nums">{money(card.price)}</Td>}
        </tr>
    );

    return (
        <ScreenShell
            nav={{ activeId: NAV_IDS.punchCards }}
            title="Customer Punch Cards"
            description=""
            header={
                <header className="border-b border-secondary bg-primary px-8 pt-5 pb-6">
                    <div className="mb-4 flex items-center gap-2 text-xs font-medium text-tertiary">
                        Reports <ChevronRight aria-hidden="true" className="size-3" /> Credits <ChevronRight aria-hidden="true" className="size-3" />
                        <span className="text-secondary">Punch cards</span>
                    </div>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-display-xs font-semibold tracking-tight text-primary">Customer Punch Cards</h1>
                                <Badge color="gray" size="sm">
                                    Prototype
                                </Badge>
                            </div>
                            <p className="mt-1.5 max-w-2xl text-sm text-tertiary">
                                Every card sold. Every offering. A clear view of who owns what and what’s left.
                            </p>
                        </div>
                        <Button
                            color="secondary"
                            size="md"
                            iconLeading={Download01}
                            isDisabled={!exportRows.length}
                            onClick={() => exportCards(exportRows, kinds)}
                        >
                            Export CSV{selectedVisible.length ? ` (${selectedVisible.length} cards)` : ""}
                        </Button>
                    </div>
                </header>
            }
        >
            {showIntro && (
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-brand-secondary">{concept.label}</span>
                        <span className="text-quaternary">/</span>
                        <span className="text-tertiary">{concept.description}</span>
                    </div>
                    <span className="shrink-0 text-quaternary">Sample data · Oct 15, 2026</span>
                </div>
            )}

            {showSummary && (
                <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                    {[
                        {
                            label: "Customer cards",
                            value: scoped.length,
                            hint: `${new Set(scoped.filter((card) => card.customer).map((card) => card.customer)).size} customers · all statuses`,
                            segment: "all" as Segment,
                        },
                        {
                            label: "Ready to use",
                            value: scoped.filter((card) => inSegment(card, "ready")).length,
                            hint: "Active cards with a remaining balance",
                            segment: "ready" as Segment,
                        },
                        {
                            label: "Expiring soon",
                            value: scoped.filter((card) => inSegment(card, "expiring")).length,
                            hint: "In the next 30 days",
                            segment: "expiring" as Segment,
                        },
                        {
                            label: "Not yet used",
                            value: scoped.filter((card) => inSegment(card, "unused")).length,
                            hint: "Usable cards with no redemptions",
                            segment: "unused" as Segment,
                        },
                    ].map((stat) => (
                        <button
                            type="button"
                            key={stat.label}
                            onClick={() => changeSegment(stat.segment)}
                            className="cursor-pointer rounded-xl bg-primary p-4 text-left shadow-xs ring-1 ring-secondary transition hover:ring-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                        >
                            <div className="text-xs font-medium text-tertiary">{stat.label}</div>
                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-display-xs font-semibold text-primary tabular-nums">{stat.value}</span>
                                <ArrowUpRight aria-hidden="true" className="size-4 text-fg-quaternary" />
                            </div>
                            <p className="mt-1 text-xs text-tertiary">{stat.hint}</p>
                        </button>
                    ))}
                </div>
            )}

            {version === "offerings" && (
                <div className="flex flex-wrap items-center gap-1 rounded-xl bg-primary p-1.5 shadow-xs ring-1 ring-secondary" aria-label="Offering workspaces">
                    {[{ kind: "all", label: "All offerings", icon: Ticket01 }, ...ITEM_KINDS].map(({ kind, label, icon: Icon }) => {
                        const active = kind === "all" ? !kinds.length : kinds[0] === kind;
                        const count = OWNED_CARDS.filter((card) => kind === "all" || card.items.some((item) => item.kind === kind)).length;
                        return (
                            <button
                                type="button"
                                key={kind}
                                aria-pressed={active}
                                onClick={() => changeKinds(kind === "all" ? [] : [kind as ItemKind])}
                                className={cx(
                                    "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-focus-ring",
                                    active ? "bg-brand-primary_alt text-brand-secondary" : "text-tertiary hover:bg-primary_hover",
                                )}
                            >
                                <Icon aria-hidden="true" className="size-4" />
                                {label}
                                <span className="text-xs opacity-70">{count}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            <div className={cx("grid min-w-0 items-start gap-5", version === "groups" && "xl:grid-cols-[200px_minmax(0,1fr)]")}>
                {version === "groups" && (
                    <aside className="rounded-xl bg-primary p-3 shadow-xs ring-1 ring-secondary">
                        <h2 className="px-3 pt-2 pb-3 text-xs font-semibold tracking-wider text-tertiary uppercase">Card views</h2>
                        <div className="flex flex-wrap gap-1 xl:flex-col">
                            {SEGMENTS.map((item) => (
                                <button
                                    type="button"
                                    key={item.id}
                                    aria-pressed={segment === item.id}
                                    title={item.hint}
                                    onClick={() => changeSegment(item.id)}
                                    className={cx(
                                        "flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium focus-visible:outline-2 focus-visible:outline-focus-ring",
                                        segment === item.id ? "bg-brand-primary_alt text-brand-secondary" : "text-secondary hover:bg-primary_hover",
                                    )}
                                >
                                    {item.label}
                                    <span className="text-xs tabular-nums">{scoped.filter((card) => inSegment(card, item.id)).length}</span>
                                </button>
                            ))}
                        </div>
                        <p className="mt-4 border-t border-secondary px-3 pt-3 pb-1 text-xs leading-relaxed text-tertiary">
                            Mixed cards appear once. Open a card to see each included item and its balance.
                        </p>
                    </aside>
                )}

                <section className="min-w-0 overflow-hidden rounded-xl bg-primary shadow-xs ring-1 ring-secondary" aria-label="Customer punch card report">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-secondary px-5 py-4">
                        <div>
                            <h2 className="flex items-center gap-2 text-md font-semibold text-primary">
                                {version === "groups"
                                    ? SEGMENTS.find((item) => item.id === segment)?.label
                                    : version === "offerings"
                                      ? focusTitle
                                      : "Customer cards"}
                                <Badge color="gray" size="sm">
                                    {results.length}
                                </Badge>
                            </h2>
                            <p className="mt-1 text-xs text-tertiary">
                                {focusKind
                                    ? `${kindMeta(focusKind).description}. Balances show this offering; status applies to the whole card.`
                                    : "Balances stay separate for each included item."}
                            </p>
                        </div>
                        <AriaDialogTrigger>
                            <Button color="secondary" size="sm" iconLeading={Settings01}>
                                Columns
                            </Button>
                            <AriaPopover placement="bottom end" className="z-40 rounded-xl bg-primary p-4 shadow-lg ring-1 ring-secondary">
                                <AriaDialog aria-label="Visible columns" className="flex flex-col gap-3 outline-hidden">
                                    {offeringColumns && (
                                        <>
                                            <p className="text-sm font-semibold text-primary">Offering columns</p>
                                            {OFFERING_COLUMNS.map((c) => (
                                                <Checkbox
                                                    key={c.kind}
                                                    label={c.label}
                                                    isSelected={!hiddenKinds.includes(c.kind)}
                                                    onChange={(on) => setHiddenKinds(on ? hiddenKinds.filter((k) => k !== c.kind) : [...hiddenKinds, c.kind])}
                                                />
                                            ))}
                                        </>
                                    )}
                                    <p className={cx("text-sm font-semibold text-primary", offeringColumns && "mt-1 border-t border-secondary pt-3")}>
                                        Additional columns
                                    </p>
                                    <Checkbox label="Purchase date" isSelected={showPurchase} onChange={setShowPurchase} />
                                    <Checkbox label="Card price (pre-tax)" isSelected={showPrice} onChange={setShowPrice} />
                                    <span className="max-w-52 text-xs text-tertiary">Order IDs and full item details are available by opening a card.</span>
                                </AriaDialog>
                            </AriaPopover>
                        </AriaDialogTrigger>
                    </div>

                    <div className="flex flex-col gap-3 border-b border-secondary p-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="min-w-48 flex-1 xl:max-w-80">
                                <Input
                                    aria-label="Search customer punch cards"
                                    placeholder="Search customer, card, or order…"
                                    icon={SearchLg}
                                    value={query}
                                    onChange={(value) => {
                                        setQuery(value);
                                        changed();
                                    }}
                                />
                            </div>
                            {version !== "offerings" && <OfferingFilter selected={kinds} onChange={changeKinds} />}
                            <Picker
                                label="Purchase period"
                                value={period}
                                options={[
                                    { id: "all", label: "Purchased · All time" },
                                    { id: "month", label: "Purchased · This month" },
                                ]}
                                onChange={(value) => {
                                    setPeriod(value);
                                    changed();
                                }}
                            />
                            {version === "groups" && (
                                <Picker
                                    label="Group by"
                                    value={groupBy}
                                    options={[
                                        { id: "product", label: "Group by · Punch card" },
                                        { id: "customer", label: "Group by · Customer" },
                                    ]}
                                    onChange={(value) => {
                                        setGroupBy(value);
                                        setCollapsed([]);
                                    }}
                                />
                            )}
                            <Button color="secondary" size="md" iconLeading={FilterLines} onClick={() => setFiltersOpen(true)}>
                                Filters{filterCount ? ` (${filterCount})` : ""}
                            </Button>
                        </div>
                        {(kinds.length > 0 || filterCount > 0 || period !== "all" || segment !== "all" || query) && (
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                {kinds.map((kind) => (
                                    <FilterTag key={kind} label={kindMeta(kind).label} onRemove={() => changeKinds(kinds.filter((value) => value !== kind))} />
                                ))}
                                {status !== "all" && (
                                    <FilterTag
                                        label={`Status: ${status}`}
                                        onRemove={() => {
                                            setStatus("all");
                                            changed();
                                        }}
                                    />
                                )}
                                {course !== "all" && (
                                    <FilterTag
                                        label={course}
                                        onRemove={() => {
                                            setCourse("all");
                                            changed();
                                        }}
                                    />
                                )}
                                {membership !== "all" && (
                                    <FilterTag
                                        label={membership === "member" ? "Members" : "Guests"}
                                        onRemove={() => {
                                            setMembership("all");
                                            changed();
                                        }}
                                    />
                                )}
                                {period !== "all" && (
                                    <FilterTag
                                        label="Purchased this month"
                                        onRemove={() => {
                                            setPeriod("all");
                                            changed();
                                        }}
                                    />
                                )}
                                {segment !== "all" && (
                                    <FilterTag label={SEGMENTS.find((item) => item.id === segment)!.label} onRemove={() => changeSegment("all")} />
                                )}
                                <Button color="link-gray" size="sm" onClick={reset}>
                                    Clear all
                                </Button>
                            </div>
                        )}
                        {selectedVisible.length > 0 && (
                            <div role="status" className="flex items-center gap-3 rounded-lg bg-secondary px-3 py-2 text-xs text-secondary">
                                <span>{selectedVisible.length} cards selected</span>
                                <Button color="link-color" size="sm" onClick={() => exportCards(exportRows, kinds)}>
                                    Export selected
                                </Button>
                                <Button color="link-gray" size="sm" onClick={() => setSelected([])}>
                                    Deselect all
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm" aria-label="Customer-owned punch cards">
                            <thead>
                                <tr>
                                    <Th>
                                        <Checkbox
                                            aria-label="Select all matching cards"
                                            isSelected={results.length > 0 && selectedVisible.length === results.length}
                                            isIndeterminate={selectedVisible.length > 0 && selectedVisible.length < results.length}
                                            onChange={(checked) => setSelected(checked ? results.map((card) => card.id) : [])}
                                        />
                                    </Th>
                                    <Th>Customer</Th>
                                    <Th>Punch card</Th>
                                    {offeringColumns ? (
                                        kindColumns.map((c) => (
                                            <Th key={c.kind} className="px-3">
                                                {c.label}
                                            </Th>
                                        ))
                                    ) : (
                                        <>
                                            <Th>{contextualLabel}</Th>
                                            <Th>Remaining / awarded</Th>
                                        </>
                                    )}
                                    <Th>{offeringColumns ? "Status / expires" : "Card status / expiration"}</Th>
                                    {showPurchase && <Th>Purchased</Th>}
                                    {showPrice && <Th>Price pre-tax</Th>}
                                </tr>
                            </thead>
                            <tbody>
                                {version === "groups"
                                    ? groupKeys.map((key) => {
                                          const cards = results.filter(
                                              (card) => (groupBy === "product" ? card.title : (card.customer ?? "Unassigned customer")) === key,
                                          );
                                          const isCollapsed = collapsed.includes(key);
                                          return (
                                              <Fragment key={key}>
                                                  <tr className="bg-secondary">
                                                      <td colSpan={columnCount} className="border-t border-secondary px-4 py-3">
                                                          <button
                                                              type="button"
                                                              aria-expanded={!isCollapsed}
                                                              onClick={() =>
                                                                  setCollapsed((previous) =>
                                                                      isCollapsed ? previous.filter((value) => value !== key) : [...previous, key],
                                                                  )
                                                              }
                                                              className="flex w-full cursor-pointer flex-wrap items-center gap-2 text-left text-sm font-semibold text-secondary"
                                                          >
                                                              {isCollapsed ? (
                                                                  <ChevronRight aria-hidden="true" className="size-4" />
                                                              ) : (
                                                                  <ChevronDown aria-hidden="true" className="size-4" />
                                                              )}
                                                              {key}
                                                              <Badge color="gray" size="sm">
                                                                  {cards.length} cards
                                                              </Badge>
                                                              <span className="ml-auto text-xs font-normal text-tertiary">
                                                                  {cards.filter((card) => ["Active", "Expiring soon"].includes(statusOf(card))).length} ready to
                                                                  use
                                                              </span>
                                                          </button>
                                                      </td>
                                                  </tr>
                                                  {!isCollapsed && cards.map(renderRow)}
                                              </Fragment>
                                          );
                                      })
                                    : pageRows.map(renderRow)}
                                {!results.length && (
                                    <tr>
                                        <td colSpan={columnCount} className="px-6 py-16 text-center">
                                            <SearchLg aria-hidden="true" className="mx-auto mb-3 size-7 text-fg-quaternary" />
                                            <h3 className="font-semibold text-primary">No customer cards found</h3>
                                            <p className="mt-1 mb-4 text-sm text-tertiary">Try a different customer, offering type, or status.</p>
                                            <Button color="secondary" size="sm" onClick={reset}>
                                                Clear all filters
                                            </Button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-secondary px-5 py-3 text-xs text-tertiary">
                        <span aria-live="polite">
                            {version === "groups"
                                ? `${results.length} cards across ${groupKeys.length} ${groupBy === "product" ? "punch cards" : "customers"}`
                                : `${results.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–${Math.min(currentPage * PAGE_SIZE, results.length)} of ${results.length} customer cards`}
                        </span>
                        <div className="flex items-center gap-3">
                            <Button
                                color="link-gray"
                                size="sm"
                                iconLeading={ArrowDown}
                                onClick={() => {
                                    setAscending((value) => !value);
                                    setPage(1);
                                }}
                            >
                                Purchased: {ascending ? "oldest first" : "newest first"}
                            </Button>
                            {version !== "groups" && (
                                <>
                                    <Button color="secondary" size="sm" isDisabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>
                                        Previous
                                    </Button>
                                    <span>
                                        {currentPage} / {pageCount}
                                    </span>
                                    <Button color="secondary" size="sm" isDisabled={currentPage >= pageCount} onClick={() => setPage(currentPage + 1)}>
                                        Next
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            <p className="text-xs text-quaternary">
                Offering counts can overlap: a single customer card can include multiple types. Item balances are independent and cannot be exchanged between
                offerings.
            </p>

            <ScreenModal
                title="Filter customer cards"
                isOpen={filtersOpen}
                onClose={() => setFiltersOpen(false)}
                footer={
                    <>
                        <Button
                            color="secondary"
                            onClick={() => {
                                setStatus("all");
                                setCourse("all");
                                setMembership("all");
                                changed();
                            }}
                        >
                            Reset filters
                        </Button>
                        <Button onClick={() => setFiltersOpen(false)}>Show {results.length} cards</Button>
                    </>
                }
            >
                <p className="text-sm text-tertiary">Combine these filters with your offering and purchase period. Changes update the report immediately.</p>
                <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-secondary">Card status</span>
                    <Picker
                        label="Card status"
                        value={status}
                        options={[{ id: "all", label: "All statuses" }, ...STATUSES.map((value) => ({ id: value, label: value }))]}
                        onChange={(value) => {
                            setStatus(value);
                            changed();
                        }}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-secondary">Course of purchase</span>
                    <Picker
                        label="Course of purchase"
                        value={course}
                        options={[
                            { id: "all", label: "All courses" },
                            ...["Bushwood Country Club", "Schule Oaks"].map((value) => ({ id: value, label: value })),
                        ]}
                        onChange={(value) => {
                            setCourse(value);
                            changed();
                        }}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-secondary">Customer membership</span>
                    <Picker
                        label="Customer membership"
                        value={membership}
                        options={[
                            { id: "all", label: "All customers" },
                            { id: "member", label: "Members" },
                            { id: "guest", label: "Guests / non-members" },
                        ]}
                        onChange={(value) => {
                            setMembership(value);
                            changed();
                        }}
                    />
                </div>
            </ScreenModal>

            {detail && (
                <ScreenModal
                    title="Customer punch card"
                    isOpen
                    onClose={() => setDetail(null)}
                    width="max-w-2xl"
                    footer={
                        <Button color="secondary" onClick={() => setDetail(null)}>
                            Close details
                        </Button>
                    }
                >
                    <div>
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="text-xs font-medium text-tertiary">{detail.id}</span>
                            <Badge color={STATUS_COLORS[statusOf(detail)]}>{statusOf(detail)}</Badge>
                        </div>
                        <h2 className="text-xl font-semibold text-primary">{detail.title}</h2>
                        <p className="mt-1 text-sm text-tertiary">
                            Owned by {detail.customer ?? "an unassigned customer"}
                            {detail.member ? " · Member" : ""}
                        </p>
                    </div>
                    <div className="rounded-lg bg-secondary p-4">
                        <h3 className="mb-3 text-sm font-semibold text-primary">Included items & remaining balances</h3>
                        <div className="flex flex-col gap-4">
                            {detail.items.map((item, i) => (
                                <div key={i}>
                                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-secondary">
                                        {kindMeta(item.kind).label}
                                        {item.duration && <span className="text-xs font-normal text-tertiary">· {item.duration} min per punch</span>}
                                    </div>
                                    <Balance items={[item]} />
                                    <p className="mt-1 text-xs text-tertiary">
                                        {item.used} redeemed · {item.awarded} originally awarded
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <dl className="grid grid-cols-2 gap-4 text-sm">
                        {[
                            ["Customer email", detail.email || "Not provided"],
                            ["Course of purchase", detail.course],
                            ["Purchased", date(detail.purchased)],
                            ["Expiration", date(detail.expires)],
                            ["Card price (pre-tax)", money(detail.price)],
                            ["Order ID", detail.order],
                        ].map(([label, value]) => (
                            <div key={label}>
                                <dt className="text-xs text-tertiary">{label}</dt>
                                <dd className="mt-1 font-medium text-secondary">{value}</dd>
                            </div>
                        ))}
                    </dl>
                    {statusOf(detail) === "Expired" && (
                        <p className="rounded-lg bg-secondary p-3 text-sm text-secondary">
                            This card has expired. Any remaining punches shown above are no longer available for redemption.
                        </p>
                    )}
                </ScreenModal>
            )}
        </ScreenShell>
    );
}

export function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <button
            type="button"
            aria-label={`Remove ${label} filter`}
            onClick={onRemove}
            className="flex cursor-pointer items-center gap-1.5 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary ring-1 ring-secondary ring-inset hover:bg-primary_hover"
        >
            {label}
            <XClose aria-hidden="true" className="size-3" />
        </button>
    );
}

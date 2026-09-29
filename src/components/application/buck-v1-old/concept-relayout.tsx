"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Edit05, Lock01, SearchLg, Settings01, XClose } from "@untitledui/icons";
import { Dialog, DialogTrigger, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { Toggle } from "@/components/base/toggle/toggle";
import { cx } from "@/utils/cx";
import { ConceptShell, FlatSection, RailCard, SectionIndex, scrollToSection, useActiveSection } from "./concept-shell";
import { DISCLAIMERS, FEE_TABLES, OPTIONS, PAYMENT_TYPES, TABLETS, TAX_RATE_FIELDS, WAITLIST_TOGGLES } from "./course-settings-data";
import { SECTIONS } from "./course-settings-page";
import { RichTextEditor } from "./rich-text-editor";
import { PAYMENT_TYPE_KEYWORDS } from "./search-keywords";
import { BookingLimitsGroup, BookingOptionsGroup, BookingWindowGroup } from "./sections-booking";
import { AdditionalMidsGroup, PaymentOtherSettingsGroup, ServiceChargesGroup, TaxTypesGroup } from "./sections-general";
import { Dash, Group, NewAction, RowActions, SelectField, TableFrame, Td, Th, ToggleList, ToggleListVariant, Tr, YesNo } from "./settings-kit";
import { Searchable } from "./settings-search";

/**
 * Concept 1 — Re-laid out.
 *
 * Same content, redesigned case by case where the legacy layout wastes the
 * most space: long toggle lists become a compact two-column grid, payment
 * types become chips with a "Manage" dialog, tax rates become a matrix, the
 * three fee tables merge into one, disclaimers collapse to previews, waitlist
 * modes become side-by-side cards, and the tablet list gets filter + paging.
 */

/* -------------------------------------------------------------------------- */
/*  Payments — chips + Manage                                                 */
/* -------------------------------------------------------------------------- */

type PaymentType = { name: string; enabled: boolean; tipLine: boolean };

const PaymentTypesChips = () => {
    const [types, setTypes] = useState<PaymentType[]>(() => PAYMENT_TYPES.map((p) => ({ ...p, tipLine: true })));
    const enabled = types.filter((t) => t.enabled);
    const update = (name: string, patch: Partial<PaymentType>) => setTypes((prev) => prev.map((t) => (t.name === name ? { ...t, ...patch } : t)));

    return (
        <Group
            title="Accepted payment types"
            description={`${enabled.length} of ${types.length} accepted. Only the ones you take are shown — manage the full list when you need it.`}
            action={<ManagePaymentTypes types={types} onUpdate={update} />}
        >
            <div className="flex flex-wrap gap-2">
                {enabled.map((t) => (
                    <Searchable
                        key={t.name}
                        label={t.name}
                        keywords={`${PAYMENT_TYPE_KEYWORDS} accepted payment type`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary py-1 pr-1 pl-2.5 text-sm font-medium text-secondary shadow-xs ring-1 ring-primary ring-inset"
                    >
                        {t.name}
                        {!t.tipLine && (
                            <Badge type="color" size="sm" color="gray">
                                No tip line
                            </Badge>
                        )}
                        <button
                            type="button"
                            aria-label={`Stop accepting ${t.name}`}
                            onClick={() => update(t.name, { enabled: false })}
                            className="flex size-5 cursor-pointer items-center justify-center rounded text-fg-quaternary hover:bg-primary_hover hover:text-fg-quaternary_hover"
                        >
                            <XClose className="size-3.5" />
                        </button>
                    </Searchable>
                ))}
            </div>
        </Group>
    );
};

const ManagePaymentTypes = ({ types, onUpdate }: { types: PaymentType[]; onUpdate: (name: string, patch: Partial<PaymentType>) => void }) => {
    const [filter, setFilter] = useState("");
    const shown = types.filter((t) => t.name.toLowerCase().includes(filter.toLowerCase()));

    return (
        <DialogTrigger>
            <Button color="secondary" size="sm" iconLeading={Settings01}>
                Manage
            </Button>
            <ModalOverlay isDismissable>
                <Modal className="max-w-2xl">
                    <Dialog aria-label="Manage payment types">
                        {({ close }) => (
                            <div className="flex max-h-[80vh] w-full flex-col overflow-hidden rounded-2xl bg-primary shadow-xl">
                                <div className="flex flex-col gap-4 border-b border-secondary px-6 pt-6 pb-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="text-lg font-semibold text-primary">Payment types</h2>
                                            <p className="text-sm text-tertiary">
                                                Choose which tenders this course accepts, and whether each prints a tip line.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            aria-label="Close"
                                            onClick={close}
                                            className="flex size-8 cursor-pointer items-center justify-center rounded-md text-fg-quaternary hover:bg-primary_hover"
                                        >
                                            <XClose className="size-5" />
                                        </button>
                                    </div>
                                    <Input
                                        aria-label="Filter payment types"
                                        placeholder="Filter payment types"
                                        icon={SearchLg}
                                        value={filter}
                                        onChange={setFilter}
                                    />
                                </div>
                                <ul className="grid flex-1 grid-cols-1 gap-x-6 overflow-y-auto px-6 py-3 sm:grid-cols-2">
                                    {shown.map((t) => (
                                        <li key={t.name} className="flex min-h-11 items-center justify-between gap-3 border-b border-secondary py-2">
                                            <Checkbox label={t.name} isSelected={t.enabled} onChange={(enabled) => onUpdate(t.name, { enabled })} />
                                            {t.enabled && (
                                                <Toggle
                                                    size="sm"
                                                    label="Tip line"
                                                    isSelected={t.tipLine}
                                                    onChange={(tipLine) => onUpdate(t.name, { tipLine })}
                                                    className="flex-row-reverse items-center"
                                                />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex items-center justify-between gap-3 border-t border-secondary px-6 py-4">
                                    <span className="text-sm text-tertiary">{types.filter((t) => t.enabled).length} accepted</span>
                                    <Button size="md" onClick={close}>
                                        Done
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    );
};

/* -------------------------------------------------------------------------- */
/*  Taxes — matrix + one combined fee table                                   */
/* -------------------------------------------------------------------------- */

const TAX_ROWS = ["General Tee Fee", "Transportation", "Open Food", "Open Liquor"];

const TaxRateMatrix = () => {
    const valueOf = (label: string) => TAX_RATE_FIELDS.find((f) => f.label === label)?.value;

    return (
        <Group title="Tax rates" description="Which configured tax applies to each kind of line item — primary and secondary side by side.">
            <TableFrame>
                <thead>
                    <tr>
                        <Th>Line item</Th>
                        <Th>Tax rate</Th>
                        <Th>Tax rate 2</Th>
                    </tr>
                </thead>
                <tbody>
                    {TAX_ROWS.map((row) => (
                        <Tr key={row} label={`${row} Tax Rate`} keywords="tax rate">
                            <Td className="font-semibold text-primary">{row}</Td>
                            {[`${row} Tax Rate`, `${row} Tax Rate 2`].map((label) => (
                                <Td key={label} className="min-w-56 py-2.5">
                                    <Select aria-label={label} items={OPTIONS.taxRate} defaultSelectedKey={valueOf(label)} placeholder="None">
                                        {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                    </Select>
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </tbody>
            </TableFrame>
        </Group>
    );
};

const CombinedFees = () => (
    <Group
        title="Booking & registration fees"
        description="Advanced tee time fees, clinic registration fees and booking deposits in one list."
        action={<NewAction />}
    >
        <TableFrame>
            <thead>
                <tr>
                    <Th>Fee</Th>
                    <Th>Applies to</Th>
                    <Th>Amount</Th>
                    <Th>Channel</Th>
                    <Th>Min days</Th>
                    <Th>Charged</Th>
                    <Th>Refundable by</Th>
                    <Th className="w-24" />
                </tr>
            </thead>
            <tbody>
                {FEE_TABLES.flatMap((table) =>
                    table.rows.map((row, i) => (
                        <Tr key={`${table.title}-${i}`} label={`${table.title} · ${row.amount}`} keywords="fee charge">
                            <Td>
                                <Badge
                                    type="color"
                                    size="sm"
                                    color={table.title.startsWith("Advanced") ? "brand" : table.title.startsWith("Clinic") ? "blue" : "purple"}
                                >
                                    {table.title}
                                </Badge>
                            </Td>
                            <Td className="max-w-64 text-primary">
                                <span className="block truncate" title={row.memberships}>
                                    {row.memberships === "All" ? "All memberships" : row.memberships}
                                </span>
                                <span className="block truncate text-xs text-tertiary" title={row.customerTypes}>
                                    {row.customerTypes === "All" ? "All customer types" : row.customerTypes}
                                </span>
                            </Td>
                            <Td className="font-semibold text-primary tabular-nums">{row.amount || row.percent}</Td>
                            <Td>
                                <div className="flex gap-1">
                                    {row.online && (
                                        <Badge type="color" size="sm" color="gray">
                                            Online
                                        </Badge>
                                    )}
                                    {row.inPerson && (
                                        <Badge type="color" size="sm" color="gray">
                                            In person
                                        </Badge>
                                    )}
                                </div>
                            </Td>
                            <Td className="text-primary">{row.minDays || <Dash />}</Td>
                            <Td className="text-primary">{row.paymentTiming}</Td>
                            <Td className="text-primary">{row.refundableBy}</Td>
                            <Td>
                                <RowActions />
                            </Td>
                        </Tr>
                    )),
                )}
            </tbody>
        </TableFrame>
    </Group>
);

/* -------------------------------------------------------------------------- */
/*  Booking Engine — disclaimer previews                                      */
/* -------------------------------------------------------------------------- */

const plainText = (html: string) =>
    html
        .replace(/<br\s*\/?>/g, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();

const DisclaimerCard = ({ title, html }: { title: string; html: string }) => {
    const [isEditing, setIsEditing] = useState(false);
    const text = plainText(html);

    if (isEditing) {
        return (
            <div className="flex flex-col gap-3 md:col-span-3">
                <RichTextEditor title={title} defaultHtml={html} />
                <Button color="secondary" size="sm" className="self-end" onClick={() => setIsEditing(false)}>
                    Done editing
                </Button>
            </div>
        );
    }

    return (
        <Searchable label={title} className="flex flex-col gap-3 rounded-xl p-4 ring-1 ring-secondary">
            <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-primary">{title}</span>
                <Button color="link-color" size="sm" iconLeading={Edit05} onClick={() => setIsEditing(true)}>
                    Edit
                </Button>
            </div>
            <p className="line-clamp-3 text-sm text-tertiary">{text || "No text yet."}</p>
            <span className="text-xs text-quaternary">{text ? `${text.split(" ").length} words` : "Empty"}</span>
        </Searchable>
    );
};

const DisclaimerPreviews = () => (
    <Group title="Disclaimers" description="Shown to golfers while booking. Open one to edit it.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <DisclaimerCard title="Booking Disclaimer" html={DISCLAIMERS.booking} />
            <DisclaimerCard title="Cancellation Disclaimer" html={DISCLAIMERS.cancellation} />
            <DisclaimerCard title="Clinic Terms" html={DISCLAIMERS.clinic} />
        </div>
    </Group>
);

/* -------------------------------------------------------------------------- */
/*  Booking Waitlist — mode cards                                             */
/* -------------------------------------------------------------------------- */

const MODES = [
    {
        title: "Notify only",
        description: "Customers get a message and book the time themselves.",
        lead: "15 Minutes",
    },
    {
        title: "Pay & book",
        description: "The open time is paid for and booked automatically.",
        lead: "",
        fee: "$5",
    },
    {
        title: "Reserve & pay at course",
        description: "The open time is reserved automatically; they pay on arrival.",
        lead: "",
        fee: "$10",
    },
];

const ModeCard = ({ title, description, lead, fee }: (typeof MODES)[number]) => {
    const [isOn, setIsOn] = useState(true);

    return (
        <Searchable
            label={`Waitlist: ${title}`}
            keywords="waitlist standby notify automatic booking"
            className={cx("flex flex-col gap-4 rounded-xl p-4 ring-1 transition duration-100 ease-linear", isOn ? "ring-brand" : "ring-secondary")}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-primary">{title}</span>
                    <span className="text-xs text-tertiary">{description}</span>
                </div>
                <Toggle aria-label={`Enable ${title}`} size="sm" isSelected={isOn} onChange={setIsOn} />
            </div>
            <div className={cx("flex flex-col gap-3", !isOn && "pointer-events-none opacity-50")}>
                <SelectField label="Lead time" options={OPTIONS.leadTime} value={lead} tooltip="Minutes before the tee time that the customer is contacted." />
                {fee && (
                    <div className="flex flex-col gap-1.5 rounded-lg bg-secondary px-3 py-2.5">
                        <Toggle size="sm" label="Charge extra fee" />
                        <span className="flex items-center gap-1.5 text-xs text-tertiary">
                            <Lock01 className="size-3 shrink-0 text-fg-quaternary" aria-hidden="true" />
                            {fee} + Standard Tax (8.25%) → Tee Fees (1230000)
                        </span>
                    </div>
                )}
            </div>
        </Searchable>
    );
};

const WaitlistRelayout = () => (
    <>
        <Group title="Waitlist" description="Let customers wait for a sold-out tee time and hear the moment one opens.">
            <ToggleList items={WAITLIST_TOGGLES} />
        </Group>
        <Group title="When a time opens" description="Turn on any combination of ways a waiting customer gets the time.">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {MODES.map((m) => (
                    <ModeCard key={m.title} {...m} />
                ))}
            </div>
        </Group>
    </>
);

/* -------------------------------------------------------------------------- */
/*  Tablets — filter + paging                                                 */
/* -------------------------------------------------------------------------- */

const PAGE_SIZE = 10;

const TabletsRelayout = () => {
    const [filter, setFilter] = useState("");
    const [page, setPage] = useState(0);

    const filtered = useMemo(() => {
        const f = filter.toLowerCase();
        return TABLETS.filter((t) => `${t.id} ${t.description} ${t.identifier} ${t.printer}`.toLowerCase().includes(f));
    }, [filter]);

    const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const current = Math.min(page, pages - 1);
    const rows = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);
    const withPrinter = TABLETS.filter((t) => t.printer).length;

    return (
        <Group title={`${TABLETS.length} registered tablets`} description={`${withPrinter} have a printer assigned.`} action={<NewAction />}>
            <Input
                aria-label="Filter tablets"
                placeholder="Filter by name, identifier or printer"
                icon={SearchLg}
                value={filter}
                onChange={(v) => {
                    setFilter(v);
                    setPage(0);
                }}
            />
            <TableFrame>
                <thead>
                    <tr>
                        <Th className="w-28">#</Th>
                        <Th>Description</Th>
                        <Th className="w-52">Identifier</Th>
                        <Th className="w-52">Printer</Th>
                        <Th className="w-24" />
                    </tr>
                </thead>
                <tbody>
                    {rows.map((t) => (
                        <Tr key={t.id} label={t.description}>
                            <Td className="font-mono text-primary">{t.id}</Td>
                            <Td className="font-semibold text-primary">{t.description}</Td>
                            <Td className="font-mono">{t.identifier}</Td>
                            <Td className="text-primary">{t.printer || <Dash />}</Td>
                            <Td>
                                <RowActions />
                            </Td>
                        </Tr>
                    ))}
                    {rows.length === 0 && (
                        <tr>
                            <Td colSpan={5} className="py-8 text-center text-tertiary">
                                No tablets match “{filter}”.
                            </Td>
                        </tr>
                    )}
                </tbody>
            </TableFrame>
            <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-tertiary">
                    {filtered.length
                        ? `Showing ${current * PAGE_SIZE + 1}–${Math.min(filtered.length, (current + 1) * PAGE_SIZE)} of ${filtered.length}`
                        : "No results"}
                </span>
                <div className="flex items-center gap-2">
                    <Button color="secondary" size="sm" iconLeading={ChevronLeft} isDisabled={current === 0} onClick={() => setPage(current - 1)}>
                        Previous
                    </Button>
                    <Button color="secondary" size="sm" iconTrailing={ChevronRight} isDisabled={current >= pages - 1} onClick={() => setPage(current + 1)}>
                        Next
                    </Button>
                </div>
            </div>
        </Group>
    );
};

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

/** Redesigned sections, keyed by section id; everything else reuses the original content. */
const RELAYOUTS: Record<string, { note: string; content?: () => ReactNode }> = {
    "main-info": {
        note: "Settings switches in a compact two-column grid instead of one full-width row each.",
    },
    "taxes-fees": {
        note: "Tax rates as a matrix (rate + rate 2 side by side); three fee tables merged into one list.",
        content: () => (
            <>
                <TaxRateMatrix />
                <ServiceChargesGroup />
                <TaxTypesGroup />
                <CombinedFees />
            </>
        ),
    },
    payments: {
        note: "Only accepted payment types are shown, as chips. “Manage” opens the full list to add or remove them.",
        content: () => (
            <>
                <PaymentTypesChips />
                <AdditionalMidsGroup />
                <PaymentOtherSettingsGroup />
            </>
        ),
    },
    "booking-engine": {
        note: "Seventeen on/off rows become a two-column grid; the three long disclaimers collapse to previews.",
        content: () => (
            <>
                <BookingWindowGroup />
                <BookingLimitsGroup />
                <BookingOptionsGroup />
                <DisclaimerPreviews />
            </>
        ),
    },
    "booking-waitlist": {
        note: "The three waitlist modes sit side by side as cards, each with its own switch and settings.",
        content: WaitlistRelayout,
    },
    birdie: {
        note: "Point-of-sale switches in a compact two-column grid.",
    },
    tablets: {
        note: "57 devices: filter plus paging instead of one endless list.",
        content: TabletsRelayout,
    },
};

/** All 17 sections, open, with the redesigned ones swapped in. (Also used by concept 4.) */
export const RelayoutSections = () => (
    <>
        {SECTIONS.map(({ id, icon, title, description, content: Original }) => {
            const relayout = RELAYOUTS[id];
            const Content = relayout?.content ?? Original;
            return (
                <FlatSection key={id} id={id} icon={icon} title={title} description={description} note={relayout?.note}>
                    <Content />
                </FlatSection>
            );
        })}
    </>
);

export const ConceptRelayout = ({ conceptPath }: { conceptPath?: string }) => {
    const ids = useMemo(() => SECTIONS.map((s) => s.id), []);
    const active = useActiveSection(ids);

    return (
        <ToggleListVariant.Provider value="grid">
            <ConceptShell
                conceptPath={conceptPath}
                note="Same settings, re-laid out section by section to use less space."
                density="wide"
                rail={
                    <RailCard>
                        <span className="text-xs font-semibold tracking-wider text-quaternary uppercase">Sections</span>
                        <SectionIndex sections={SECTIONS} active={active} onSelect={scrollToSection} />
                        <p className="border-t border-secondary pt-3 text-xs text-tertiary">
                            Sections marked <span className="font-semibold text-brand-secondary">Redesigned</span> show a new layout; the rest keep their
                            content with the tighter spacing.
                        </p>
                    </RailCard>
                }
            >
                <RelayoutSections />
            </ConceptShell>
        </ToggleListVariant.Provider>
    );
};

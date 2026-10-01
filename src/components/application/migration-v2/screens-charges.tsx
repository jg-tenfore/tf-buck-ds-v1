"use client";

import { useState } from "react";
import {
    CheckCircle,
    ChevronDown,
    Copy01,
    Download01,
    Edit03,
    File02,
    File06,
    FileAttachment01,
    Mail01,
    Phone,
    Printer,
    ReceiptCheck,
    RefreshCcw01,
    ReverseLeft,
    Save01,
    SearchLg,
    User01,
    XCircle,
    XClose,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { Select } from "@/components/base/select/select";
import { Toggle } from "@/components/base/toggle/toggle";
import { cx } from "@/utils/cx";
import type { ProfileSectionId } from "./customer-profile";
import { CustomerProfileView } from "./customer-profile";
import {
    CHARGE_PAYMENTS,
    CUSTOMERS,
    CUSTOMER_CHARGES,
    DECLINE_SUMMARY,
    HISTORY_INVOICES,
    HISTORY_LINES,
    HISTORY_SEARCH,
    HISTORY_TOTALS,
    PAYMENT_DETAIL,
    money,
} from "./data";
import { DateField, EmptyBox, ExportButton, HeaderAction, LinkText, ScreenModal, ScreenShell, TabStrip, TableCard, Td, Th, clickableRow } from "./kit";
import { NAV_IDS } from "./nav-tree";

/* ========================================================================== */
/*  3 · Charges › Charges                                                     */
/* ========================================================================== */

export type ChargesView = "list" | "customer" | "profile-expanded" | "all-sections";

const PROFILE_OPEN: Record<ChargesView, ProfileSectionId[] | "all"> = {
    list: [],
    customer: [],
    "profile-expanded": ["profile"],
    "all-sections": "all",
};

/** Customer Charges: orders charged to a customer account, by date range. */
export const ChargesScreen = ({ initialView = "list", onOpenRow }: { initialView?: ChargesView; onOpenRow?: (index: number) => void }) => {
    const [customerOpen, setCustomerOpen] = useState(initialView !== "list");
    const [tab, setTab] = useState<"list" | "customer">(initialView === "list" ? "list" : "customer");

    const tabs = [{ id: "list", label: "Charges" }, ...(customerOpen ? [{ id: "customer", label: CUSTOMERS.parent.name, icon: User01, closable: true }] : [])];

    return (
        <ScreenShell
            nav={{ activeId: NAV_IDS.charges, initialQuery: "charges" }}
            title="Customer Charges"
            description="Orders charged to a customer account, by date range."
            action={<HeaderAction label="Add Customer Charge" />}
            tabs={
                <TabStrip
                    tabs={tabs}
                    activeId={tab}
                    onSelect={(id) => setTab(id as typeof tab)}
                    onClose={() => {
                        setCustomerOpen(false);
                        setTab("list");
                    }}
                />
            }
        >
            {tab === "list" && (
                <>
                    <div className="flex items-end justify-between gap-4">
                        <div className="flex gap-4">
                            <DateField label="From" value="Oct 1, 2026" className="w-48" />
                            <DateField label="To" value="Oct 1, 2026" className="w-48" />
                        </div>
                        <ExportButton />
                    </div>
                    <TableCard>
                        <thead>
                            <tr>
                                {["Order ID", "Name", "Email", "App", "Created", "Completed", "Status", "Employee"].map((h) => (
                                    <Th key={h}>{h}</Th>
                                ))}
                                <Th className="text-right">Order Total</Th>
                                <Th className="text-right">Charge Amount</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {CUSTOMER_CHARGES.map((c, i) => (
                                <tr key={c.orderId} {...clickableRow(onOpenRow ? () => onOpenRow(i) : undefined)}>
                                    <Td>
                                        <LinkText onClick={onOpenRow ? () => onOpenRow(i) : undefined}>{c.orderId}</LinkText>
                                    </Td>
                                    <Td>
                                        <LinkText
                                            onClick={() => {
                                                if (onOpenRow) return onOpenRow(i);
                                                setCustomerOpen(true);
                                                setTab("customer");
                                            }}
                                        >
                                            {c.name}
                                        </LinkText>
                                    </Td>
                                    <Td>
                                        <LinkText>{c.email}</LinkText>
                                    </Td>
                                    <Td className="max-w-28 whitespace-normal">{c.app}</Td>
                                    <Td>{c.created}</Td>
                                    <Td>{c.completed}</Td>
                                    <Td>{c.status}</Td>
                                    <Td>{c.employee}</Td>
                                    <Td className="text-right tabular-nums">{c.total}</Td>
                                    <Td className="text-right tabular-nums">{c.total}</Td>
                                </tr>
                            ))}
                        </tbody>
                    </TableCard>
                </>
            )}
            {tab === "customer" && <CustomerProfileView customer={CUSTOMERS.parent} history initialOpen={PROFILE_OPEN[initialView]} />}
        </ScreenShell>
    );
};

/* ========================================================================== */
/*  4 · Charges › Payments                                                    */
/* ========================================================================== */

export type PaymentsView = "list" | "declined-collapsed" | "status-menu" | "scrolled" | "detail" | "refund" | "customer";

/**
 * Customer Charge Payments: payments taken against charges, with a
 * collapsible summary of declined payments above the table.
 */
export const PaymentsScreen = ({ initialView = "list", onOpenRow }: { initialView?: PaymentsView; onOpenRow?: (index: number) => void }) => {
    const detailInitially = initialView === "detail" || initialView === "refund";
    const [openTab, setOpenTab] = useState<"detail" | "customer" | null>(detailInitially ? "detail" : initialView === "customer" ? "customer" : null);
    const [tab, setTab] = useState<"list" | "detail" | "customer">(openTab ?? "list");
    const [declinesOpen, setDeclinesOpen] = useState(initialView !== "declined-collapsed" && initialView !== "scrolled");
    const [refundOpen, setRefundOpen] = useState(initialView === "refund");

    const tabs = [
        { id: "list", label: "Payments" },
        ...(openTab === "detail" ? [{ id: "detail", label: `Payment ${PAYMENT_DETAIL.ccpId}`, icon: ReceiptCheck, closable: true }] : []),
        ...(openTab === "customer" ? [{ id: "customer", label: CUSTOMERS.aaron.name, icon: User01, closable: true }] : []),
    ];
    const open = (t: "detail" | "customer") => {
        setOpenTab(t);
        setTab(t);
    };

    return (
        <ScreenShell
            nav={{ activeId: NAV_IDS.payments, initialQuery: "payments" }}
            title="Customer Charge Payments"
            description="Payments taken against customer charges, by date range."
            action={<HeaderAction label="Add Payment" />}
            tabs={
                <TabStrip
                    tabs={tabs}
                    activeId={tab}
                    onSelect={(id) => setTab(id as typeof tab)}
                    onClose={() => {
                        setOpenTab(null);
                        setTab("list");
                    }}
                />
            }
        >
            {tab === "list" && (
                <PaymentsList
                    declinesOpen={declinesOpen}
                    onToggleDeclines={() => setDeclinesOpen((v) => !v)}
                    statusMenuOpen={initialView === "status-menu"}
                    scrolled={initialView === "scrolled"}
                    onPayment={(i) => (onOpenRow ? onOpenRow(i) : open("detail"))}
                    onCustomer={(i) => (onOpenRow ? onOpenRow(i) : open("customer"))}
                    onRow={onOpenRow}
                />
            )}
            {tab === "detail" && <PaymentDetail onRefund={() => setRefundOpen(true)} />}
            {tab === "customer" && <CustomerProfileView customer={CUSTOMERS.aaron} />}
            <RefundModal isOpen={refundOpen} onClose={() => setRefundOpen(false)} />
        </ScreenShell>
    );
};

const PaymentsList = ({
    declinesOpen,
    onToggleDeclines,
    statusMenuOpen,
    scrolled,
    onPayment,
    onCustomer,
    onRow,
}: {
    declinesOpen: boolean;
    onToggleDeclines: () => void;
    statusMenuOpen: boolean;
    scrolled: boolean;
    onPayment: (index: number) => void;
    onCustomer: (index: number) => void;
    /** Ideas: the whole row opens the idea. */
    onRow?: (index: number) => void;
}) => {
    const surchargeTotal = CHARGE_PAYMENTS.reduce((s, p) => s + p.surcharge, 0);
    const amountTotal = CHARGE_PAYMENTS.reduce((s, p) => s + p.amount, 0);
    const maxDecline = Math.max(...DECLINE_SUMMARY.reasons.map((r) => r.amount));

    return (
        <>
            <div className="flex flex-wrap items-end gap-4">
                <DateField label="From" value="Oct 1, 2026" className="w-44" />
                <DateField label="To" value="Oct 1, 2026" className="w-44" />
                <div className="w-44">
                    <Select
                        label="Status"
                        items={[
                            { id: "successful", label: "Successful" },
                            { id: "declined", label: "Declined" },
                            { id: "all", label: "All" },
                        ]}
                        defaultSelectedKey="successful"
                        defaultOpen={statusMenuOpen}
                    >
                        {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                    </Select>
                </div>
                <div className="flex flex-col gap-3 pb-2.5">
                    <Label>All Courses</Label>
                    <Toggle aria-label="All courses" size="md" />
                </div>
                <div className="min-w-64 flex-1">
                    <Input label="Search" placeholder="CCP ID, name, email, course, status, employee..." icon={SearchLg} />
                </div>
                <ExportButton />
            </div>

            <div className="overflow-hidden rounded-xl bg-primary shadow-xs ring-1 ring-secondary">
                <button
                    type="button"
                    aria-expanded={declinesOpen}
                    onClick={onToggleDeclines}
                    className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left text-sm hover:bg-primary_hover"
                >
                    <XCircle className="size-5 text-fg-error-secondary" />
                    <span className="font-semibold text-primary">{DECLINE_SUMMARY.count} declined payments</span>
                    <span className="text-tertiary">{DECLINE_SUMMARY.notCollected} not collected</span>
                    <ChevronDown className={cx("ml-auto size-4 text-fg-quaternary transition-transform", declinesOpen && "rotate-180")} />
                </button>
                {declinesOpen && (
                    <ul className="flex flex-col gap-1 border-t border-secondary px-4 py-3">
                        {DECLINE_SUMMARY.reasons.map((r) => (
                            <li key={r.reason} className="relative flex items-center gap-3 overflow-hidden rounded-md px-2 py-1.5 text-sm">
                                <span
                                    className="absolute inset-y-0 left-0 rounded-md bg-error-primary"
                                    style={{ width: `${Math.max(18, (r.amount / maxDecline) * 55)}%` }}
                                    aria-hidden="true"
                                />
                                <span className="relative w-5 text-right font-semibold text-error-primary tabular-nums">{r.count}</span>
                                <span className="relative flex-1 text-secondary">{r.reason}</span>
                                <span className="relative text-tertiary tabular-nums">{money(r.amount)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="overflow-hidden rounded-xl bg-primary shadow-xs ring-1 ring-secondary">
                <div className="overflow-x-auto" ref={(el) => void (scrolled && el && (el.scrollLeft = el.scrollWidth))}>
                    <table className="w-full min-w-max text-left text-sm">
                        <thead>
                            <tr>
                                <Th>CCP ID ▾</Th>
                                {["Date", "Status", "Course", "Job ID", "GCC ID", "First", "Last", "Email", "Employee", "Type"].map((h) => (
                                    <Th key={h}>{h}</Th>
                                ))}
                                <Th className="text-right">CC Surcharge</Th>
                                <Th className="text-right">Amount</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {CHARGE_PAYMENTS.map((p, i) => (
                                <tr key={p.ccpId} {...clickableRow(onRow ? () => onRow(i) : undefined)}>
                                    <Td>
                                        <LinkText onClick={() => onPayment(i)}>{p.ccpId}</LinkText>
                                    </Td>
                                    <Td className="leading-tight">
                                        10/1/2026
                                        <br />
                                        3:00 AM
                                    </Td>
                                    <Td>
                                        <CheckCircle className="size-5 text-fg-success-secondary" aria-label="Successful" />
                                    </Td>
                                    <Td className="max-w-24 truncate" title="The Dunes of Delgado PROD">
                                        The Dunes of Delgado PROD
                                    </Td>
                                    <Td>1780</Td>
                                    <Td>
                                        <LinkText onClick={() => onCustomer(i)}>{p.gccId}</LinkText>
                                    </Td>
                                    <Td className="max-w-20 whitespace-normal">{p.first}</Td>
                                    <Td>{p.last}</Td>
                                    <Td>{p.email ? <LinkText>{p.email}</LinkText> : null}</Td>
                                    <Td />
                                    <Td className="leading-tight">
                                        Credit
                                        <br />
                                        <span className="text-tertiary">{p.card}</span>
                                    </Td>
                                    <Td className="text-right tabular-nums">{money(p.surcharge)}</Td>
                                    <Td className="text-right tabular-nums">{money(p.amount)}</Td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <Td className="bg-secondary" colSpan={11}>
                                    <span className="font-semibold">{CHARGE_PAYMENTS.length} payments</span>
                                    <span className="text-tertiary">
                                        {" "}
                                        · showing {CHARGE_PAYMENTS.length} of {CHARGE_PAYMENTS.length} rows
                                    </span>
                                </Td>
                                <Td className="bg-secondary text-right font-semibold tabular-nums">{money(surchargeTotal)}</Td>
                                <Td className="bg-secondary text-right font-semibold tabular-nums">{money(amountTotal)}</Td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </>
    );
};

const Stat = ({ label, children, strong }: { label: string; children: React.ReactNode; strong?: boolean }) => (
    <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-tertiary">{label}</span>
        <span className={cx("text-md text-primary", strong && "font-semibold")}>{children}</span>
    </div>
);

const PaymentDetail = ({ onRefund }: { onRefund: () => void }) => {
    const p = PAYMENT_DETAIL;
    return (
        <div className="flex flex-col gap-6 rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
            <div className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-3">
                <Stat label="CCP ID">{p.ccpId}</Stat>
                <Stat label="Payment Type">{p.type}</Stat>
                <Stat label="Status">{p.status}</Stat>
                <DateField label="Date" value={p.date} />
                <Input label="Notes" />
                <Stat label="Decline Reason">{p.declineReason}</Stat>
                <Stat label="Payment Amount">{p.amount}</Stat>
                <Stat label="Surcharge">{p.surcharge}</Stat>
                <Stat label="Applied To Balance" strong>
                    {p.applied}
                </Stat>
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-tertiary">Customer/Member</span>
                    <span className="flex items-center gap-1.5 text-md text-primary">
                        {p.customer}
                        <Edit03 className="size-4 text-fg-quaternary" aria-label="Change customer" />
                    </span>
                    <span className="text-sm text-tertiary">{p.customerEmail}</span>
                </div>
                <Stat label="Employee (took payment)">{p.employee}</Stat>
                <Stat label="Processor Transaction ID">{p.processorTxn}</Stat>
            </div>
            <div className="flex gap-3">
                <Button color="primary-destructive" size="md" iconLeading={ReverseLeft} onClick={onRefund}>
                    Refund
                </Button>
                <Button size="md" iconLeading={Save01}>
                    Save Changes
                </Button>
            </div>
        </div>
    );
};

const RefundModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    <ScreenModal
        title="Refund Payment"
        isOpen={isOpen}
        onClose={onClose}
        footer={
            <>
                <Button color="secondary" size="md" onClick={onClose}>
                    Cancel
                </Button>
                <Button color="primary-destructive" size="md" iconLeading={ReverseLeft}>
                    Refund
                </Button>
            </>
        }
    >
        <p className="text-sm text-secondary">
            This creates a refund against the payment via its processor (card/ACH) or adjusts the gift card / records a manual refund. This cannot be undone.
        </p>
        <Input
            label="Amount to refund"
            defaultValue={PAYMENT_DETAIL.amount}
            hint={
                <>
                    Up to <strong className="font-semibold">{PAYMENT_DETAIL.amount}</strong> can be refunded.
                </>
            }
        />
    </ScreenModal>
);

/* ========================================================================== */
/*  5 · Charges › History                                                     */
/* ========================================================================== */

export type HistoryView = "empty" | "searching" | "selected" | "activity" | "export-menu" | "reset-confirm";

/** Customer Charge History: every charge, payment and frozen invoice for one customer. */
export const ChargeHistoryScreen = ({ initialView = "empty", onOpenRow }: { initialView?: HistoryView; onOpenRow?: (index: number) => void }) => {
    const [selected, setSelected] = useState(["selected", "activity", "export-menu", "reset-confirm"].includes(initialView));
    // "selected" is the no-activity customer; the others show Casey's captured history.
    const hasActivity = initialView !== "selected";
    const [query, setQuery] = useState(initialView === "searching" ? HISTORY_SEARCH.query : "");
    const [confirmOpen, setConfirmOpen] = useState(initialView === "reset-confirm");
    // Like production, a customer matches if any word of the query appears in their name.
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const results = words.length ? HISTORY_SEARCH.results.filter((r) => words.some((w) => r.name.toLowerCase().includes(w))) : [];

    return (
        <ScreenShell
            nav={{ activeId: NAV_IDS.history, initialQuery: "hist" }}
            course="bushwood"
            title="Customer Charge History"
            description="Every charge, payment and frozen invoice for one customer."
            tabs={<TabStrip tabs={[{ id: "list", label: "History" }]} activeId="list" />}
        >
            {!selected ? (
                <div className="flex flex-col gap-8">
                    <div className="relative w-full max-w-md">
                        <Input
                            label="Customer"
                            placeholder="Search"
                            icon={SearchLg}
                            value={query}
                            onChange={setQuery}
                            autoFocus={initialView === "searching"}
                        />
                        {results.length > 0 && (
                            <ul className="absolute top-full right-0 left-0 z-10 mt-2 divide-y divide-secondary overflow-hidden rounded-xl bg-primary shadow-lg ring-1 ring-secondary_alt">
                                {results.map((r) => (
                                    <li key={r.name}>
                                        <button
                                            type="button"
                                            onClick={() => setSelected(true)}
                                            className="flex w-full cursor-pointer flex-col gap-1 px-4 py-3 text-left hover:bg-primary_hover"
                                        >
                                            <span className="text-md font-semibold text-primary">{r.name}</span>
                                            <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-tertiary">
                                                <span className="flex items-center gap-1.5">
                                                    <Mail01 className="size-4 text-fg-brand-primary" />
                                                    {r.email}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Phone className="size-4 text-fg-brand-primary" />
                                                    {r.phone}
                                                </span>
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <p className="text-center text-sm text-tertiary">Search for and select a customer to view their charge history.</p>
                </div>
            ) : (
                <>
                    <div className="flex flex-wrap items-end gap-4">
                        <label className="flex w-full max-w-md flex-col gap-1.5">
                            <span className="text-sm font-medium text-secondary">Customer</span>
                            <span className="flex h-11 items-center gap-2 rounded-lg bg-primary px-3.5 shadow-xs ring-1 ring-primary ring-inset">
                                <span className="flex-1 text-md text-primary">{HISTORY_SEARCH.results[0].name}</span>
                                <button
                                    type="button"
                                    aria-label="Clear customer"
                                    onClick={() => setSelected(false)}
                                    className="cursor-pointer text-fg-quaternary hover:text-fg-quaternary_hover"
                                >
                                    <XClose className="size-4" />
                                </button>
                            </span>
                        </label>
                        <DateField label="From" value={HISTORY_SEARCH.range.from} className="w-44" />
                        <DateField label="To" value={HISTORY_SEARCH.range.to} className="w-44" />
                        <div className="flex flex-col gap-3 pb-2.5">
                            <Label tooltip="Include charges and payments from every course in the company.">All Company Courses</Label>
                            <Toggle aria-label="All company courses" size="md" />
                        </div>
                        <div className="ml-auto">
                            <HistoryExportMenu defaultOpen={initialView === "export-menu"} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="text-xs font-semibold tracking-wider text-tertiary uppercase">Charges & Payments</h3>
                        {hasActivity ? (
                            <HistoryLinesTable onOpenRow={onOpenRow} />
                        ) : (
                            <div className="rounded-xl bg-primary px-4 py-10 text-center text-sm text-tertiary shadow-xs ring-1 ring-secondary">
                                No charges or payments found for this time span.
                            </div>
                        )}
                    </div>

                    <dl className="flex flex-wrap gap-12 rounded-xl bg-primary px-5 py-4 shadow-xs ring-1 ring-secondary">
                        {(
                            [
                                ["Total Charges", hasActivity ? money(HISTORY_TOTALS.charges) : "$0.00", "text-primary"],
                                ["Total Payments", hasActivity ? money(HISTORY_TOTALS.payments) : "$0.00", "text-primary"],
                                ["Difference", hasActivity ? money(HISTORY_TOTALS.charges - HISTORY_TOTALS.payments) : "$0.00", "text-success-primary"],
                            ] as const
                        ).map(([k, v, tone]) => (
                            <div key={k} className="flex flex-col gap-1">
                                <dt className="text-xs font-semibold tracking-wider text-tertiary uppercase">{k}</dt>
                                <dd className={cx("text-lg font-semibold tabular-nums", tone)}>{v}</dd>
                            </div>
                        ))}
                    </dl>

                    <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-6">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-xs font-semibold tracking-wider text-tertiary uppercase">Invoices</h3>
                                <p className="max-w-3xl text-sm text-secondary">
                                    Customer invoices are generated when the invoice report is first run for a given month and are "frozen" in time. If a charge
                                    or payment already reflected in a past invoice changes, 30/60/90 day amounts may be inaccurate until invoices for that
                                    member are reset.
                                </p>
                            </div>
                            <Button color="secondary-destructive" size="md" iconLeading={RefreshCcw01} onClick={() => setConfirmOpen(true)}>
                                Reset Invoices
                            </Button>
                        </div>
                        {hasActivity ? (
                            <InvoicesTable />
                        ) : (
                            <div className="rounded-xl bg-primary px-4 py-10 text-center text-sm text-tertiary shadow-xs ring-1 ring-secondary">
                                No invoices found.
                            </div>
                        )}
                    </div>
                </>
            )}

            <ScreenModal
                title="Reset Invoices"
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                footer={
                    <>
                        <Button color="secondary" size="md" onClick={() => setConfirmOpen(false)}>
                            Cancel
                        </Button>
                        <Button color="primary-destructive" size="md" iconLeading={RefreshCcw01}>
                            Reset Invoices
                        </Button>
                    </>
                }
            >
                <p className="text-md font-semibold text-primary">Are you sure you want to reset this customer's invoices?</p>
                <p className="text-sm text-secondary">
                    This deletes the existing frozen invoices for this customer (and family members) and regenerates the last 12 months. This cannot be undone.
                </p>
            </ScreenModal>
        </ScreenShell>
    );
};

/* ------------------------------------------------------------------ */
/*  History pieces (also used by Migration V2 Ideas)                   */
/* ------------------------------------------------------------------ */

const historyCustomer = `${HISTORY_SEARCH.results[0].name} (The Dunes of Delgado PROD)`;

/** Charges and payments in one table; payment rows are tinted, as in production. */
export const HistoryLinesTable = ({ compact, onOpenRow }: { compact?: boolean; onOpenRow?: (index: number) => void }) => {
    // Compact (record page): the customer is the page itself, and Event ID / Employee are empty for this customer.
    const columns = compact ? ["Order ID", "App", "Date"] : ["Order ID", "Event ID", "Customer", "App", "Date", "Employee"];
    return (
        <TableCard>
            <thead>
                <tr>
                    {columns.map((h) => (
                        <Th key={h}>{h}</Th>
                    ))}
                    <Th className="text-right">Amount</Th>
                </tr>
            </thead>
            <tbody>
                {HISTORY_LINES.map((l, i) => (
                    <tr
                        key={l.id}
                        {...clickableRow(onOpenRow ? () => onOpenRow(i) : undefined)}
                        className={cx(l.kind === "payment" && "bg-secondary_subtle", onOpenRow && clickableRow(() => {}).className)}
                    >
                        <Td>
                            <LinkText onClick={() => onOpenRow?.(i)}>{l.id}</LinkText>
                        </Td>
                        {!compact && <Td>{l.eventId}</Td>}
                        {!compact && (
                            <Td>
                                <LinkText onClick={() => onOpenRow?.(i)}>{historyCustomer}</LinkText>
                            </Td>
                        )}
                        <Td>{l.app}</Td>
                        <Td>{l.date}</Td>
                        {!compact && <Td />}
                        <Td className="text-right tabular-nums">{money(l.amount)}</Td>
                    </tr>
                ))}
            </tbody>
        </TableCard>
    );
};

/** Frozen monthly invoices. */
export const InvoicesTable = () => (
    <TableCard>
        <thead>
            <tr>
                <Th>ID</Th>
                <Th>Golf Course</Th>
                <Th>Start</Th>
                <Th>End</Th>
                <Th className="text-right">Starting Balance</Th>
                <Th className="text-right">Total Charges</Th>
                <Th className="text-right">Total Payments</Th>
                <Th className="text-right">Ending Balance</Th>
            </tr>
        </thead>
        <tbody>
            {HISTORY_INVOICES.map((i) => (
                <tr key={i.id}>
                    <Td>{i.id}</Td>
                    <Td>The Dunes of Delgado PROD</Td>
                    <Td>{i.start}</Td>
                    <Td>{i.end}</Td>
                    <Td className="text-right tabular-nums">{money(i.starting)}</Td>
                    <Td className="text-right tabular-nums">{money(i.charges)}</Td>
                    <Td className="text-right tabular-nums">{money(i.payments)}</Td>
                    <Td className="text-right tabular-nums">{money(i.ending)}</Td>
                </tr>
            ))}
        </tbody>
    </TableCard>
);

/** Export with its format menu: Excel, CSV, PDF, then Copy to Clipboard and Print. */
export const HistoryExportMenu = ({ defaultOpen }: { defaultOpen?: boolean }) => (
    <Dropdown.Root defaultOpen={defaultOpen}>
        <Button color="secondary" size="md" iconLeading={Download01} iconTrailing={ChevronDown}>
            Export
        </Button>
        <Dropdown.Popover placement="bottom end" className="w-56">
            <Dropdown.Menu>
                <Dropdown.Item icon={File06} label="Excel (.xlsx)" />
                <Dropdown.Item icon={File02} label="CSV" />
                <Dropdown.Item icon={FileAttachment01} label="PDF" />
                <Dropdown.Separator />
                <Dropdown.Item icon={Copy01} label="Copy to Clipboard" />
                <Dropdown.Item icon={Printer} label="Print" />
            </Dropdown.Menu>
        </Dropdown.Popover>
    </Dropdown.Root>
);

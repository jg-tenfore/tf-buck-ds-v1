"use client";

import { useState } from "react";
import {
    Award01,
    BankNote01,
    CalendarCheck01,
    Car01,
    ClockRewind,
    CreditCard02,
    Download01,
    Edit03,
    File02,
    Folder,
    Gift01,
    GraduationHat01,
    ClockRewind as HistoryIcon,
    Key01,
    LayersThree01,
    List,
    Mail01,
    Passport,
    Phone,
    ReceiptCheck,
    RefreshCcw01,
    ReverseLeft,
    Rows01,
    Save01,
    ShoppingBag01,
    Target04,
    Ticket01,
    Trash01,
    Umbrella03,
    User01,
    Users01,
} from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Toggle } from "@/components/base/toggle/toggle";
import type { ChargePayment } from "../data";
import {
    CHARGE_PAYMENTS,
    CUSTOMERS,
    CUSTOMER_CHARGES,
    HISTORY_INVOICES,
    HISTORY_LINES,
    HISTORY_SEARCH,
    HISTORY_TOTALS,
    PAYMENT_DETAIL,
    PROFILE_SECTIONS,
    money,
} from "../data";
import { DateField, LinkText, ScreenModal, ScreenShell, TableCard, Td, Th } from "../kit";
import { NAV_IDS } from "../nav-tree";
import { ChargeHistoryScreen, ChargesScreen, HistoryLinesTable, InvoicesTable, PaymentsScreen } from "../screens-charges";
import { RecordFlow } from "./drilldown";
import { CustomerRailSummary, CustomerRecordPage, personFrom } from "./full-profile";
import {
    EmptyCard,
    MainCard,
    MoreActions,
    PanelGroup,
    PanelIdentity,
    PanelRow,
    PanelStat,
    RailBlock,
    RecordHeader,
    RecordLayout,
    SlidePanel,
    StatBar,
} from "./ideas-kit";

const h = PROFILE_SECTIONS;
const parent = CUSTOMERS.parent;

/* ========================================================================== */
/*  3 · Charges — a customer's profile                                        */
/* ========================================================================== */

/**
 * Idea 2: the profile as a record page — what has activity is laid out in the
 * main column, contact and account facts in the rail, the four header
 * buttons folded into More actions, and empty sections listed compactly.
 */
export const ChargesIdea2 = () => (
    <RecordFlow
        screen={(open) => <ChargesScreen initialView="list" onOpenRow={open} />}
        rows={CUSTOMER_CHARGES}
        page={(c, i) => <CustomerRecordPage customer={personFrom(c.name, String(1351034 + i * 7), c.email)} />}
    />
);

/* ========================================================================== */
/*  4 · Payments — refunding a payment                                        */
/* ========================================================================== */

const RefundFields = ({ amount }: { amount: string }) => (
    <div className="flex flex-col gap-4">
        <p className="text-sm text-secondary">
            This creates a refund against the payment via its processor (card/ACH) or adjusts the gift card / records a manual refund. This cannot be undone.
        </p>
        <Input
            label="Amount to refund"
            defaultValue={amount}
            hint={
                <>
                    Up to <strong className="font-semibold">{amount}</strong> can be refunded.
                </>
            }
        />
    </div>
);

/** Idea 2: the payment as a record page; Refund lives in More actions and opens the same confirmation. */
export const PaymentRecordPage = ({ row }: { row: ChargePayment }) => {
    const [refundOpen, setRefundOpen] = useState(false);
    const p = {
        ...PAYMENT_DETAIL,
        ccpId: row.ccpId,
        amount: money(row.amount),
        surcharge: money(row.surcharge),
        applied: money(row.amount - row.surcharge),
        customer: `${row.first} ${row.last}`,
        customerEmail: row.email ?? "",
        processorTxn: String(274010714449 - (185811 - Number(row.ccpId)) * 13),
    };
    return (
        <ScreenShell
            nav={{ activeId: NAV_IDS.payments, initialQuery: "payments" }}
            title={`Payment ${p.ccpId}`}
            description=""
            header={
                <RecordHeader
                    breadcrumb="Customer Charge Payments"
                    breadcrumbIcon={ReceiptCheck}
                    title={`Payment ${p.ccpId}`}
                    subtitle={
                        <span className="flex items-center gap-2">
                            <Badge type="pill-color" size="sm" color="success">
                                {p.status}
                            </Badge>
                            {p.date}
                        </span>
                    }
                    actions={
                        <>
                            <MoreActions actions={[{ label: "Refund", icon: ReverseLeft, destructive: true, onAction: () => setRefundOpen(true) }]} />
                            <Button size="md" iconLeading={Save01}>
                                Save Changes
                            </Button>
                        </>
                    }
                />
            }
        >
            <StatBar
                stats={[
                    { label: "Payment amount", value: p.amount },
                    { label: "Surcharge", value: p.surcharge },
                    { label: "Applied to balance", value: p.applied },
                    { label: "Payment type", value: p.type },
                ]}
            />
            <RecordLayout
                main={
                    <MainCard title="Details">
                        <div className="grid grid-cols-1 gap-5 rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary md:grid-cols-2">
                            <DateField label="Date" value={p.date} />
                            <Input label="Notes" />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-tertiary">Decline reason</span>
                                <span className="text-md text-primary">{p.declineReason}</span>
                            </div>
                        </div>
                    </MainCard>
                }
                rail={
                    <>
                        <CustomerRailSummary customer={personFrom(p.customer, row.gccId, row.email)} />
                        <RailBlock title="Payment method">
                            <span>
                                {p.type} {row.card}
                            </span>
                        </RailBlock>
                        <RailBlock title="Employee (took payment)">
                            <span className="text-tertiary">{p.employee}</span>
                        </RailBlock>
                        <RailBlock title="Processor transaction ID">
                            <span className="tabular-nums">{p.processorTxn}</span>
                        </RailBlock>
                    </>
                }
            />
            <ScreenModal
                title="Refund Payment"
                isOpen={refundOpen}
                onClose={() => setRefundOpen(false)}
                footer={
                    <>
                        <Button color="secondary" size="md" onClick={() => setRefundOpen(false)}>
                            Cancel
                        </Button>
                        <Button color="primary-destructive" size="md" iconLeading={ReverseLeft}>
                            Refund
                        </Button>
                    </>
                }
            >
                <RefundFields amount={p.amount} />
            </ScreenModal>
        </ScreenShell>
    );
};

/** Idea 2: from the payments table, a payment opens its record page. */
export const PaymentsIdea2 = () => (
    <RecordFlow
        screen={(open) => <PaymentsScreen initialView="declined-collapsed" onOpenRow={open} />}
        rows={CHARGE_PAYMENTS}
        page={(row) => <PaymentRecordPage row={row} />}
    />
);

/* ========================================================================== */
/*  5 · History — a customer's charges, payments and frozen invoices          */
/* ========================================================================== */

const INVOICE_NOTE =
    'Customer invoices are generated when the invoice report is first run for a given month and are "frozen" in time. If a charge or payment already reflected in a past invoice changes, 30/60/90 day amounts may be inaccurate until invoices for that member are reset.';

const difference = HISTORY_TOTALS.charges - HISTORY_TOTALS.payments;
const charges = HISTORY_LINES.filter((l) => l.kind === "charge");
const payments = HISTORY_LINES.filter((l) => l.kind === "payment");

/** Idea 2: the customer's history as a page — totals in the summary bar, both tables in the main column, export formats and reset under More actions. */
export const HistoryRecordPage = () => {
    const c = HISTORY_SEARCH.results[0];
    return (
        <ScreenShell
            nav={{ activeId: NAV_IDS.history, initialQuery: "hist" }}
            course="bushwood"
            title={c.name}
            description=""
            header={
                <RecordHeader
                    breadcrumb="Customer Charge History"
                    breadcrumbIcon={HistoryIcon}
                    title={c.name}
                    subtitle={`${c.email} · ${c.phone}`}
                    actions={
                        <>
                            <MoreActions
                                actions={[
                                    { label: "Export Excel (.xlsx)", icon: Download01 },
                                    { label: "Export CSV", icon: Download01 },
                                    { label: "Export PDF", icon: Download01 },
                                    { label: "Copy to Clipboard", icon: File02 },
                                    { label: "Print", icon: File02 },
                                    { label: "Reset invoices", icon: RefreshCcw01, destructive: true },
                                ]}
                            />
                            <Button color="secondary" size="md" iconLeading={Edit03}>
                                Change customer
                            </Button>
                        </>
                    }
                />
            }
        >
            <StatBar
                stats={[
                    { label: "Total charges", value: money(HISTORY_TOTALS.charges) },
                    { label: "Total payments", value: money(HISTORY_TOTALS.payments) },
                    { label: "Difference", value: money(difference), tone: "positive" },
                    { label: "Latest invoice balance", value: money(HISTORY_INVOICES[HISTORY_INVOICES.length - 1].ending) },
                ]}
            />
            <RecordLayout
                main={
                    <>
                        <MainCard title={`Charges & payments · ${HISTORY_LINES.length}`}>
                            <HistoryLinesTable compact />
                        </MainCard>
                        <MainCard title={`Invoices · ${HISTORY_INVOICES.length}`}>
                            <p className="text-sm text-tertiary">{INVOICE_NOTE}</p>
                            <InvoicesTable />
                        </MainCard>
                    </>
                }
                rail={
                    <>
                        <RailBlock title="Date range">
                            <DateField label="From" value={HISTORY_SEARCH.range.from} />
                            <DateField label="To" value={HISTORY_SEARCH.range.to} className="mt-2" />
                        </RailBlock>
                        <RailBlock title="All company courses" action={<Toggle aria-label="All company courses" size="md" />}>
                            <span className="text-xs text-tertiary">Include charges and payments from every course in the company.</span>
                        </RailBlock>
                        <CustomerRailSummary customer={personFrom(c.name, "1288912", c.email, c.phone)} />
                    </>
                }
            />
        </ScreenShell>
    );
};

/* Idea 1 now lives in ideas-panels.tsx (row-stepping panels with sub-navigation). */
export { ChargesIdea1, PaymentsIdea1, HistoryIdea1 } from "./ideas-panels";

/** Idea 2: from the history table, any line opens the customer's charge-history page. */
export const HistoryIdea2 = () => (
    <RecordFlow
        screen={(open) => <ChargeHistoryScreen initialView="activity" onOpenRow={open} />}
        rows={HISTORY_LINES}
        page={() => <HistoryRecordPage />}
        step={false}
    />
);

"use client";

import type { ReactNode } from "react";
import {
    AlertTriangle,
    BankNote01,
    Calendar,
    CheckCircle,
    CreditCard02,
    Download01,
    Edit03,
    File02,
    FileDownload02,
    Hash02,
    PieChart01,
    Plus,
    PlusCircle,
    Receipt,
    RefreshCcw01,
    ReverseLeft,
    Save01,
    ShoppingBag01,
    Table,
    Users01,
} from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { Toggle } from "@/components/base/toggle/toggle";
import { cx } from "@/utils/cx";
import type { ChargePayment, CreditBook, HistoryLine, Invoice, Person, PunchCardRow, RevenueSection } from "../data";
import {
    CHARGE_PAYMENTS,
    COMBINED_REPORT_SECTIONS,
    CREDIT_BOOKS,
    CREDIT_BOOK_CUSTOMERS,
    CREDIT_BOOK_DETAIL,
    CREDIT_BOOK_TRANSACTIONS,
    CUSTOMER_CHARGES,
    HISTORY_INVOICES,
    HISTORY_LINES,
    HISTORY_SEARCH,
    HISTORY_TOTALS,
    PUNCH_CARDS,
    REVENUE_SECTIONS,
    money,
} from "../data";
import { DateField } from "../kit";
import { ChargeHistoryScreen, ChargesScreen, PaymentsScreen } from "../screens-charges";
import { CreditBooksScreen, PunchCardsScreen } from "../screens-credits";
import { CombinedReportScreen, CombinedRevenueScreen } from "../screens-revenue";
import type { Nav, PanelPage } from "./drilldown";
import { PanelFlow } from "./drilldown";
import { CustomerLinkRow, customerPage, personFrom } from "./full-profile";
import { PanelGroup, PanelRow, PanelStat } from "./ideas-kit";

/*
 * Idea 1 for every Migration V2 screen: a slide-over panel tied to the table
 * behind it. ↑ / ↓ step through the table's rows in order; each row opens its
 * own record with the details that matter for that screen up top, and every
 * row in the panel drills deeper (record → customer → section → item → edit).
 * Same data and actions as today — only the layout changes.
 */

/* -------------------------------------------------------------------------- */
/*  Shared bits                                                               */
/* -------------------------------------------------------------------------- */

const Hero = ({ value, label, badge }: { value: ReactNode; label?: string; badge?: ReactNode }) => (
    <div className="flex flex-col items-center gap-1.5 py-1 text-center">
        <span className="text-display-sm font-semibold text-primary tabular-nums">{value}</span>
        {label && <span className="text-sm text-tertiary">{label}</span>}
        {badge}
    </div>
);

const Callout = ({ tone = "warning", children }: { tone?: "warning" | "info"; children: ReactNode }) => (
    <div className={cx("flex gap-3 rounded-xl p-4 ring-1 ring-secondary ring-inset", tone === "warning" ? "bg-warning-primary" : "bg-secondary")}>
        {tone === "warning" ? (
            <AlertTriangle className="size-5 shrink-0 text-fg-warning-primary" />
        ) : (
            <CheckCircle className="size-5 shrink-0 text-fg-quaternary" />
        )}
        <p className="text-sm text-secondary">{children}</p>
    </div>
);

const detailPage = (title: string, fields: [string, ReactNode][], hint?: string): PanelPage => ({
    title,
    body: () => (
        <>
            {hint && <p className="-mt-3 text-sm text-tertiary">{hint}</p>}
            <PanelGroup title="Details">
                {fields.map(([k, v]) => (
                    <PanelRow key={k} label={k} value={v} static />
                ))}
            </PanelGroup>
        </>
    ),
});

const editPage = (label: string, value: string): PanelPage => ({
    title: label,
    body: () => <Input label={label} defaultValue={value} />,
    footer: (nav) => (
        <Button size="md" className="w-full" onClick={nav.back}>
            Done
        </Button>
    ),
});

/* ========================================================================== */
/*  1 · Punch Cards                                                           */
/* ========================================================================== */

export const bulkEntryPage: PanelPage = {
    title: "Bulk entry",
    body: () => (
        <>
            <p className="-mt-3 text-sm text-tertiary">
                Pick the punch-card product these paper cards correspond to, set the batch expiration, then add one row per paper card. For each card, find the
                customer or enter their info, and count how many holes have been punched out.
            </p>
            <PanelGroup title="Batch">
                <div className="flex flex-col gap-4 pt-2">
                    <Select
                        label="Punch Card Product"
                        placeholder="Select"
                        items={[
                            { id: "10", label: "10-Round Punch Card" },
                            { id: "3", label: "3-Round Punch Card" },
                        ]}
                    >
                        {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                    </Select>
                    <DateField label="Default Expiration" />
                    <span className="-mt-2 text-sm text-tertiary">Applied to every new row. Override per card if needed.</span>
                </div>
            </PanelGroup>
            <PanelGroup title="Card #1 · New customer">
                <div className="flex flex-col gap-3 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                        <Input label="First name" placeholder="First name" />
                        <Input label="Last name" placeholder="Last name" />
                        <Input label="Email" placeholder="Email" type="email" />
                        <Input label="Phone" placeholder="Phone" type="tel" />
                    </div>
                    <span className="text-sm text-tertiary">Email or phone is required.</span>
                    <div className="grid grid-cols-2 gap-3">
                        <Input label="Rounds Used" defaultValue="0" type="number" />
                        <DateField label="Expiration Override" />
                    </div>
                </div>
            </PanelGroup>
            <Button color="secondary" size="md" iconLeading={Plus}>
                Add Row
            </Button>
        </>
    ),
    footer: () => (
        <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm text-secondary">
                <CheckCircle className="size-5 text-fg-success-secondary" />
                Saved 0 · Remaining 1
            </span>
            <Button size="md" iconLeading={Save01} isDisabled>
                Save All Pending
            </Button>
        </div>
    ),
};

export const punchCardPage = (r: PunchCardRow): PanelPage => {
    const remaining = r.awarded - r.used;
    const customer = r.customer ? personFrom(r.customer, r.gccId) : null;
    return {
        title: `Punch card ${r.cpcId}`,
        body: (nav: Nav) => (
            <>
                <Hero
                    value={`${remaining} of ${r.awarded}`}
                    label="rounds remaining"
                    badge={
                        <Badge type="pill-color" size="sm" color={r.expires === "Never expires" ? "gray" : "warning"}>
                            {r.expires === "Never expires" ? "Never expires" : `Expires ${r.expires}`}
                        </Badge>
                    }
                />
                <div className="h-2 overflow-hidden rounded-full bg-quaternary">
                    <div className="h-full rounded-full bg-brand-solid" style={{ width: `${(remaining / r.awarded) * 100}%` }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <PanelStat label="Rounds used" value={r.used} />
                    <PanelStat label="Price pre-tax" value={r.pricePreTax} />
                </div>
                <PanelGroup title="Card">
                    <PanelRow icon={Hash02} label="CPC ID" value={r.cpcId} static />
                    <PanelRow icon={Calendar} label="Date created" value={r.created} static />
                    <PanelRow icon={Calendar} label="Date expired" value={r.expires} onClick={() => nav.push(editPage("Expiration", r.expires))} />
                    <PanelRow icon={Edit03} label="Rounds used" value={r.used} onClick={() => nav.push(editPage("Rounds used", String(r.used)))} />
                    {r.orderId ? (
                        <PanelRow
                            icon={ShoppingBag01}
                            label={`Order ${r.orderId}`}
                            hint={`Order item ${r.orderItemId}`}
                            onClick={() =>
                                nav.push(
                                    detailPage(`Order ${r.orderId}`, [
                                        ["Order ID", r.orderId!],
                                        ["Order item ID", r.orderItemId!],
                                        ["Price pre-tax", r.pricePreTax],
                                        ["Created", r.created],
                                    ]),
                                )
                            }
                        />
                    ) : (
                        <PanelRow icon={ShoppingBag01} label="Order" value="N/A · added manually" muted static />
                    )}
                </PanelGroup>
                <PanelGroup title="Customer">
                    {customer ? (
                        <>
                            <CustomerLinkRow
                                customer={customer}
                                nav={nav}
                                options={{ focus: ["punch-cards", "memberships"], focusTitle: "Punch cards & membership" }}
                            />
                            <PanelRow label="Member #" value={r.member ?? "N/A"} muted={!r.member} static />
                        </>
                    ) : (
                        <>
                            <Callout>This punch card isn't linked to a customer.</Callout>
                            <PanelRow icon={Users01} label="Link a customer" onClick={() => nav.push(editPage("Customer", ""))} />
                        </>
                    )}
                </PanelGroup>
                <PanelGroup title="Batch tools">
                    <PanelRow
                        icon={Table}
                        label="Bulk entry"
                        hint="Back-fill paper punch cards, including new customers"
                        onClick={() => nav.push(bulkEntryPage)}
                    />
                    <PanelRow icon={Download01} label="Export" />
                </PanelGroup>
            </>
        ),
    };
};

export const PunchCardsIdea1 = () => (
    <PanelFlow screen={(open) => <PunchCardsScreen initialView="list" onOpenRow={open} />} rows={PUNCH_CARDS} root={punchCardPage} />
);

/* ========================================================================== */
/*  2 · Credit Books                                                          */
/* ========================================================================== */

/** Per-book counts: the captured book (#380) is exact; the rest are invented. */
export const bookCounts = (b: CreditBook) =>
    b.id === CREDIT_BOOK_DETAIL.id
        ? { customers: CREDIT_BOOK_CUSTOMERS, transactions: CREDIT_BOOK_TRANSACTIONS }
        : { customers: CREDIT_BOOK_CUSTOMERS.slice(0, (Number(b.id) % 8) + 2), transactions: CREDIT_BOOK_TRANSACTIONS.slice(0, (Number(b.id) % 11) + 3) };

const NO_PRODUCT =
    "No products are linked to this credit book yet. Link one on the product's own page first — funding buys this book's product, so there is nothing to sell until then.";

const fundPage = (b: CreditBook): PanelPage => ({
    title: "Fund credit book",
    body: () => (
        <>
            <p className="-mt-3 text-sm text-tertiary">{b.title} · Buys this book's product and credits the book by the pre-tax amount.</p>
            <Callout>{NO_PRODUCT}</Callout>
            <div className="flex flex-col gap-4">
                <Select label="Product" placeholder="Select a product" items={[]} isDisabled>
                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                </Select>
                <Input label="Amount (before tax)" defaultValue="$0" isDisabled />
                <PanelGroup title="Summary">
                    {["Subtotal", "Tax", "Tax 2", "Fees", "Total charged"].map((k) => (
                        <PanelRow key={k} label={k} value="$0.00" static muted={k !== "Total charged"} />
                    ))}
                </PanelGroup>
            </div>
        </>
    ),
    footer: () => (
        <Button size="md" className="w-full" isDisabled>
            Fund Credit Book
        </Button>
    ),
});

const bookCustomersPage = (b: CreditBook, people: Person[]): PanelPage => ({
    title: `Customers · ${people.length}`,
    body: (nav) => (
        <>
            <div className="-mt-2 flex flex-wrap gap-2">
                <Button color="secondary" size="sm" iconLeading={Users01}>
                    Add Customer
                </Button>
            </div>
            <PanelGroup title={b.title}>
                {people.map((p) => (
                    <PanelRow
                        key={p.id}
                        label={p.name}
                        hint={[p.email, p.phone].filter(Boolean).join(" · ") || "No email or phone"}
                        onClick={() =>
                            nav.push(
                                customerPage(personFrom(p.name, p.id, p.email, p.phone), {
                                    focus: ["gift-cards", "payments"],
                                    focusTitle: "Credits & payments",
                                }),
                            )
                        }
                    />
                ))}
            </PanelGroup>
        </>
    ),
});

const bookTransactionsPage = (b: CreditBook, txns: typeof CREDIT_BOOK_TRANSACTIONS): PanelPage => ({
    title: `Transactions · ${txns.length}`,
    body: (nav) => (
        <PanelGroup title={b.title}>
            {txns.map((t) => (
                <PanelRow
                    key={t.id}
                    icon={Receipt}
                    label={`${t.type} · gift card ${t.giftCard}`}
                    hint={`${t.date} · ${t.employee}`}
                    value={money(t.amount)}
                    onClick={() =>
                        nav.push(
                            detailPage(`Transaction ${t.id}`, [
                                ["ID", t.id],
                                ["Date", t.date],
                                ["Type", t.type],
                                ["Employee", t.employee],
                                ["Gift card", t.giftCard],
                                ["Amount", money(t.amount)],
                            ]),
                        )
                    }
                />
            ))}
        </PanelGroup>
    ),
});

const bookSettingsPage = (b: CreditBook): PanelPage => ({
    title: "Edit settings",
    body: () => (
        <div className="flex flex-col gap-4">
            <Input label="Title" defaultValue={b.title} />
            <PanelGroup title="Applies to">
                {CREDIT_BOOK_DETAIL.appliesTo.map((a) => (
                    <div key={a} className="flex items-center justify-between py-3">
                        <span className="text-sm font-medium text-primary">{a}</span>
                        <Toggle aria-label={a} size="md" defaultSelected />
                    </div>
                ))}
            </PanelGroup>
            <DateField label="Expiration Date" placeholder="No hard date" />
            <Input label="Months Until Expiration" placeholder="e.g. 12" />
        </div>
    ),
    footer: (nav) => (
        <Button size="md" className="w-full" onClick={nav.back}>
            Save
        </Button>
    ),
});

export const creditBookPage = (b: CreditBook): PanelPage => {
    const { customers, transactions } = bookCounts(b);
    return {
        title: b.title,
        body: (nav) => (
            <>
                <Hero
                    value={<span className={b.balance < 0 ? "text-error-primary" : undefined}>{money(b.balance)}</span>}
                    label={b.balance < 0 ? "overdrawn balance" : "available balance"}
                    badge={
                        <Badge type="pill-color" size="sm" color="gray">
                            Credit book #{b.id}
                        </Badge>
                    }
                />
                <div className="grid grid-cols-2 gap-3">
                    <PanelStat label="Customers" value={customers.length} />
                    <PanelStat label="Transactions" value={transactions.length} />
                </div>
                <Callout>{NO_PRODUCT}</Callout>
                <PanelGroup title="Manage">
                    <PanelRow icon={PlusCircle} label="Fund credit book" hint="Blocked until a product is linked" onClick={() => nav.push(fundPage(b))} />
                    <PanelRow icon={Users01} label="Customers" value={customers.length} onClick={() => nav.push(bookCustomersPage(b, customers))} />
                    <PanelRow icon={Receipt} label="Transactions" value={transactions.length} onClick={() => nav.push(bookTransactionsPage(b, transactions))} />
                    <PanelRow icon={FileDownload02} label="Import order" />
                    <PanelRow icon={Edit03} label="Edit settings" onClick={() => nav.push(bookSettingsPage(b))} />
                </PanelGroup>
                <PanelGroup title="Rules">
                    <PanelRow label="Applies to" value={CREDIT_BOOK_DETAIL.appliesTo.join(", ")} static />
                    <PanelRow label="Expiration" value={CREDIT_BOOK_DETAIL.expiration} static />
                    <PanelRow label="Linked product" value="None" muted static />
                </PanelGroup>
            </>
        ),
    };
};

export const CreditBooksIdea1 = () => (
    <PanelFlow screen={(open) => <CreditBooksScreen initialView="list" onOpenRow={open} />} rows={CREDIT_BOOKS} root={creditBookPage} />
);

/* ========================================================================== */
/*  3 · Charges                                                               */
/* ========================================================================== */

type ChargeRow = (typeof CUSTOMER_CHARGES)[number];

export const chargePage = (c: ChargeRow, index: number): PanelPage =>
    customerPage(personFrom(c.name, String(1351034 + index * 7), c.email), {
        title: c.name,
        focus: ["orders", "payments", "memberships", "payment-methods"],
        focusTitle: "Charge account",
        lead: (nav) => (
            <PanelGroup title={`Charge · order ${c.orderId}`}>
                <PanelRow icon={BankNote01} label="Charge amount" value={c.total} static />
                <PanelRow
                    icon={Receipt}
                    label="Order total"
                    value={c.total}
                    onClick={() =>
                        nav.push(
                            detailPage(`Order ${c.orderId}`, [
                                ["Order ID", c.orderId],
                                ["App", c.app],
                                ["Created", c.created],
                                ["Completed", c.completed],
                                ["Status", c.status],
                                ["Employee", "—"],
                                ["Order total", c.total],
                                ["Charge amount", c.total],
                            ]),
                        )
                    }
                />
                <PanelRow
                    label="Status"
                    value={
                        <Badge type="pill-color" size="sm" color="success">
                            {c.status}
                        </Badge>
                    }
                    static
                />
                <PanelRow label="App" value={c.app} static />
                <PanelRow label="Created" value={c.created} static />
            </PanelGroup>
        ),
    });

export const ChargesIdea1 = () => (
    <PanelFlow screen={(open) => <ChargesScreen initialView="list" onOpenRow={open} />} rows={CUSTOMER_CHARGES} root={chargePage} />
);

/* ========================================================================== */
/*  4 · Payments                                                              */
/* ========================================================================== */

const refundPage = (p: ChargePayment): PanelPage => ({
    title: "Refund payment",
    body: () => (
        <>
            <p className="-mt-3 text-sm text-tertiary">
                Payment {p.ccpId} · {p.first} {p.last} · Credit {p.card}
            </p>
            <p className="text-sm text-secondary">
                This creates a refund against the payment via its processor (card/ACH) or adjusts the gift card / records a manual refund. This cannot be
                undone.
            </p>
            <Input
                label="Amount to refund"
                defaultValue={money(p.amount)}
                hint={
                    <>
                        Up to <strong className="font-semibold">{money(p.amount)}</strong> can be refunded.
                    </>
                }
            />
        </>
    ),
    footer: () => (
        <Button color="primary-destructive" size="md" iconLeading={ReverseLeft} className="w-full">
            Refund
        </Button>
    ),
});

export const paymentPage = (p: ChargePayment): PanelPage => {
    const customer = personFrom(`${p.first} ${p.last}`, p.gccId, p.email);
    const txn = String(274010714449 - (185811 - Number(p.ccpId)) * 13);
    return {
        title: `Payment ${p.ccpId}`,
        body: (nav) => (
            <>
                <Hero
                    value={money(p.amount)}
                    label="10/1/2026 3:00 AM"
                    badge={
                        <Badge type="pill-color" size="sm" color="success">
                            Complete
                        </Badge>
                    }
                />
                <div className="grid grid-cols-2 gap-3">
                    <PanelStat label="CC surcharge" value={money(p.surcharge)} />
                    <PanelStat label="Applied to balance" value={money(p.amount - p.surcharge)} />
                </div>
                <PanelGroup title="Payment">
                    <PanelRow icon={CreditCard02} label={`Credit ${p.card}`} hint="Card on file" static />
                    <PanelRow label="Course" value="The Dunes of Delgado PROD" static />
                    <PanelRow label="Job ID" value="1780" static />
                    <PanelRow label="Employee (took payment)" value="(none)" muted static />
                    <PanelRow label="Processor transaction ID" value={txn} static />
                    <PanelRow label="Decline reason" value="—" muted static />
                    <PanelRow label="Notes" value="Add" muted onClick={() => nav.push(editPage("Notes", ""))} />
                    <PanelRow label="Date" value="Oct 1, 2026" onClick={() => nav.push(editPage("Date", "Oct 1, 2026"))} />
                </PanelGroup>
                <PanelGroup title="Customer">
                    <CustomerLinkRow
                        customer={customer}
                        nav={nav}
                        options={{ focus: ["payments", "payment-methods", "orders"], focusTitle: "Payments & cards" }}
                    />
                </PanelGroup>
                <PanelGroup title="Actions">
                    <PanelRow icon={ReverseLeft} label="Refund" hint={`Up to ${money(p.amount)}`} onClick={() => nav.push(refundPage(p))} />
                </PanelGroup>
            </>
        ),
    };
};

export const PaymentsIdea1 = () => (
    <PanelFlow screen={(open) => <PaymentsScreen initialView="declined-collapsed" onOpenRow={open} />} rows={CHARGE_PAYMENTS} root={paymentPage} />
);

/* ========================================================================== */
/*  5 · History                                                               */
/* ========================================================================== */

const INVOICE_NOTE =
    'Customer invoices are generated when the invoice report is first run for a given month and are "frozen" in time. If a charge or payment already reflected in a past invoice changes, 30/60/90 day amounts may be inaccurate until invoices for that member are reset.';

const caseyRow = HISTORY_SEARCH.results[0];
const casey = personFrom(caseyRow.name, "1288912", caseyRow.email, caseyRow.phone);

const invoicePage = (i: Invoice): PanelPage =>
    detailPage(`Invoice ${i.id}`, [
        ["Golf course", "The Dunes of Delgado PROD"],
        ["Start", i.start],
        ["End", i.end],
        ["Starting balance", money(i.starting)],
        ["Total charges", money(i.charges)],
        ["Total payments", money(i.payments)],
        ["Ending balance", money(i.ending)],
    ]);

const invoicesPage: PanelPage = {
    title: `Invoices · ${HISTORY_INVOICES.length}`,
    body: (nav) => (
        <>
            <p className="-mt-3 text-sm text-tertiary">{INVOICE_NOTE}</p>
            <PanelGroup title="Newest first">
                {[...HISTORY_INVOICES].reverse().map((i) => (
                    <PanelRow
                        key={i.id}
                        icon={File02}
                        label={`${i.start} – ${i.end}`}
                        hint={`Invoice ${i.id} · started ${money(i.starting)}`}
                        value={money(i.ending)}
                        onClick={() => nav.push(invoicePage(i))}
                    />
                ))}
            </PanelGroup>
        </>
    ),
};

const resetPage: PanelPage = {
    title: "Reset invoices",
    body: () => (
        <>
            <p className="text-md font-semibold text-primary">Are you sure you want to reset this customer's invoices?</p>
            <p className="text-sm text-secondary">
                This deletes the existing frozen invoices for {casey.name} (and family members) and regenerates the last 12 months. This cannot be undone.
            </p>
        </>
    ),
    footer: () => (
        <Button color="primary-destructive" size="md" iconLeading={RefreshCcw01} className="w-full">
            Reset Invoices
        </Button>
    ),
};

export const historyLinePage = (l: HistoryLine): PanelPage => ({
    title: `Order ${l.id}`,
    body: (nav) => (
        <>
            <Hero
                value={money(l.amount)}
                label={l.date}
                badge={
                    <Badge type="pill-color" size="sm" color={l.kind === "payment" ? "success" : "gray"}>
                        {l.kind === "payment" ? "Payment" : "Charge"}
                    </Badge>
                }
            />
            <PanelGroup title={l.kind === "payment" ? "Payment" : "Charge"}>
                <PanelRow icon={l.kind === "payment" ? BankNote01 : ShoppingBag01} label="Order ID" value={l.id} static />
                <PanelRow label="App" value={l.app} static />
                <PanelRow label="Date" value={l.date} static />
                <PanelRow label="Event ID" value="—" muted static />
                <PanelRow label="Employee" value="—" muted static />
            </PanelGroup>
            <PanelGroup title={`${casey.name} · Apr 1 – Oct 1, 2026`}>
                <div className="grid grid-cols-3 gap-3 py-2">
                    <PanelStat label="Charges" value={money(HISTORY_TOTALS.charges)} />
                    <PanelStat label="Payments" value={money(HISTORY_TOTALS.payments)} />
                    <PanelStat label="Difference" value={money(HISTORY_TOTALS.charges - HISTORY_TOTALS.payments)} tone="positive" />
                </div>
                <PanelRow icon={File02} label="Invoices" value={HISTORY_INVOICES.length} onClick={() => nav.push(invoicesPage)} />
                <PanelRow icon={RefreshCcw01} label="Reset invoices" hint="Regenerate the last 12 months" onClick={() => nav.push(resetPage)} />
                <PanelRow icon={Download01} label="Export" hint="Excel, CSV, PDF, copy or print" />
            </PanelGroup>
            <PanelGroup title="Customer">
                <CustomerLinkRow customer={casey} nav={nav} options={{ focus: ["payments", "orders", "memberships"], focusTitle: "Charges & payments" }} />
            </PanelGroup>
        </>
    ),
});

export const HistoryIdea1 = () => (
    <PanelFlow screen={(open) => <ChargeHistoryScreen initialView="activity" onOpenRow={open} />} rows={HISTORY_LINES} root={historyLinePage} />
);

/* ========================================================================== */
/*  6 · Combined Report                                                       */
/* ========================================================================== */

export const REPORT_LINE_INFO: Record<string, { includes: string; related: string[] }> = {
    "Food Sales": { includes: "Grill, restaurant and event food items, before tax.", related: ["F&B and Events", "Sales by Category"] },
    "Alcohol Sales": { includes: "Beer, wine and liquor items, before tax. Taxed with the liquor rate.", related: ["F&B and Events", "Tax by Type"] },
    "Golf Sales": { includes: "Green fees, memberships billed as golf, and punch-card rounds redeemed.", related: ["Golf", "Weekly Rounds"] },
    "Transportation Sales": { includes: "Cart fees sold with tee times or on their own.", related: ["Golf", "Sales by Category"] },
    "Pro Shop Sales": { includes: "Merchandise sold in the pro shop and online store.", related: ["Product Sales by Category", "Product Sales by Group"] },
    Taxes: { includes: "Every tax collected on the sales above, all rates combined.", related: ["Tax by Type", "Tax by Product"] },
    Fees: { includes: "Service charges, credit card surcharges and TenFore fees.", related: ["Combined Revenue", "Service Charges"] },
};

export const reportLinePage = (line: string): PanelPage => {
    const info = REPORT_LINE_INFO[line];
    return {
        title: line,
        body: (nav) => (
            <>
                <Hero value="$0.00" label="Oct 1, 2026" />
                <Callout tone="info">{info.includes}</Callout>
                <PanelGroup title="Breakdown">
                    <PanelRow label="No sales in this period" muted static />
                </PanelGroup>
                <PanelGroup title="Period">
                    <PanelRow icon={Calendar} label="Start date" value="Oct 1, 2026" onClick={() => nav.push(editPage("Start date", "Oct 1, 2026"))} />
                    <PanelRow icon={Calendar} label="End date" value="Oct 1, 2026" onClick={() => nav.push(editPage("End date", "Oct 1, 2026"))} />
                </PanelGroup>
                <PanelGroup title="See it in detail">
                    {info.related.map((r) => (
                        <PanelRow key={r} icon={PieChart01} label={r} />
                    ))}
                </PanelGroup>
            </>
        ),
        footer: () => (
            <Button color="secondary" size="md" iconLeading={Download01} className="w-full">
                Export
            </Button>
        ),
    };
};

export const CombinedReportIdea1 = () => (
    <PanelFlow screen={(open) => <CombinedReportScreen onOpenRow={open} />} rows={COMBINED_REPORT_SECTIONS} root={(line) => reportLinePage(line)} />
);

/* ========================================================================== */
/*  7 · Combined Revenue                                                      */
/* ========================================================================== */

export const SECTION_GROUP: Record<string, string> = {
    "green-fees": "Sales",
    transportation: "Sales",
    "product-sales": "Sales",
    "event-sales": "Sales",
    "activity-sales": "Sales",
    "fee-rule-sales": "Sales",
    "open-misc": "Sales",
    "gift-cards": "Sales",
    taxes: "Taxes & fees",
    "fees-tips": "Taxes & fees",
    "event-payments": "Money in",
    "money-collected": "Money in",
    "charge-payments": "Money in",
    discounts: "Informational",
    adjustments: "Informational",
};

export const revenueSectionPage = (s: RevenueSection): PanelPage => ({
    title: s.title,
    body: (nav) => (
        <>
            <Hero
                value="$0.00"
                label="Oct 1, 2026"
                badge={
                    <Badge type="pill-color" size="sm" color="gray">
                        {SECTION_GROUP[s.id]}
                    </Badge>
                }
            />
            <PanelGroup title="Breakdown">
                {s.rows ? (
                    <>
                        {s.rows.map((r) => (
                            <PanelRow
                                key={r}
                                label={r}
                                value="$0.00"
                                muted
                                onClick={() =>
                                    nav.push(
                                        detailPage(r, [
                                            ["Amount", "$0.00"],
                                            ["Period", "Oct 1, 2026"],
                                            ["Section", s.title],
                                        ]),
                                    )
                                }
                            />
                        ))}
                        {s.totalRow && <PanelRow label="Total" value="$0.00" static />}
                    </>
                ) : (
                    <PanelRow label={s.empty ?? "Nothing in this period"} muted static />
                )}
            </PanelGroup>
            {s.footnote && <Callout tone="info">{s.footnote}</Callout>}
            <PanelGroup title="Columns in this breakdown">
                <div className="flex flex-wrap gap-1.5 py-2">
                    {s.columns.map((c) => (
                        <Badge key={c} type="color" size="sm" color="gray">
                            {c}
                        </Badge>
                    ))}
                </div>
            </PanelGroup>
            <PanelGroup title="Filters">
                <PanelRow icon={Calendar} label="Period" value="Oct 1 – Oct 1, 2026" onClick={() => nav.push(editPage("From", "Oct 1, 2026"))} />
                <PanelRow label="Group products by" value="Product" static />
                <PanelRow label="All courses" value="Off" static />
            </PanelGroup>
        </>
    ),
    footer: () => (
        <Button color="secondary" size="md" iconLeading={Download01} className="w-full">
            Export
        </Button>
    ),
});

export const CombinedRevenueIdea1 = () => (
    <PanelFlow screen={(open) => <CombinedRevenueScreen initiallyCollapsed onOpenRow={open} />} rows={REVENUE_SECTIONS} root={revenueSectionPage} />
);

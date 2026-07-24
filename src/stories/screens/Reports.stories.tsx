import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
    AlertTriangle,
    ArrowLeft,
    ArrowRight,
    CalendarDate,
    Coins01,
    CreditCard01,
    CurrencyDollar,
    Download01,
    FilterLines,
    FlipBackward,
    Gift01,
    Hash02,
    Mail01,
    PieChart03,
    Plus,
    Printer,
    Receipt,
    RefreshCcw02,
    SearchLg,
    Send01,
    SwitchHorizontal01,
    Trash01,
} from "@untitledui/icons";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/application/app-navigation/app-shell";
import { PageHeader } from "@/components/application/screen-kit";
import { axisProps, ChartCard, ChartLegend, CHART_INK, CHART_SERIES, ChartTooltip } from "@/components/application/charts/chart-kit";
import { MetricCard } from "@/components/application/metrics/metric-card";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";

const meta = {
    title: "App Screens/Reports",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* ----------------------------------------------------------------------------------------------- */
/* Shared helpers                                                                                  */
/* ----------------------------------------------------------------------------------------------- */


/** A read-only date field rendered like an input. */
const DateField = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-secondary">{label}</span>
        <div className="flex h-10 w-44 items-center justify-between gap-2 rounded-lg bg-primary px-3 text-sm text-primary ring-1 ring-secondary ring-inset">
            <span className="tabular-nums">{value}</span>
            <CalendarDate className="size-4 text-fg-quaternary" aria-hidden="true" />
        </div>
    </div>
);

/** Standard table pagination footer. */
const PaginationFooter = ({ page = 1, total = 1 }: { page?: number; total?: number }) => (
    <div className="flex items-center justify-between gap-4 border-t border-secondary px-4 py-3">
        <Button size="sm" color="secondary" iconLeading={ArrowLeft}>
            Previous
        </Button>
        <span className="text-sm text-tertiary">
            Page {page} of {total}
        </span>
        <Button size="sm" color="secondary" iconTrailing={ArrowRight}>
            Next
        </Button>
    </div>
);

/** Search + export/filter toolbar row shared by the list reports. */
const ListToolbar = ({ placeholder = "Search", children }: { placeholder?: string; children?: React.ReactNode }) => (
    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
        <Input size="sm" aria-label="Search" placeholder={placeholder} icon={SearchLg} wrapperClassName="sm:w-96" />
        <div className="flex items-center gap-2">
            {children}
            <Button size="sm" color="secondary" iconLeading={FilterLines}>
                Filters
            </Button>
            <Button size="sm" color="secondary" iconLeading={Download01}>
                Export
            </Button>
        </div>
    </div>
);

const money = (v: number) => `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ----------------------------------------------------------------------------------------------- */
/* General Ledger — Codes                                                                          */
/* ----------------------------------------------------------------------------------------------- */

interface LedgerCode {
    id: string;
    code: string;
    description: string;
    type: string;
    paymentType: string;
    parent: string;
}

const ledgerCodes: LedgerCode[] = [
    { id: "1", code: "448871", description: "Bad Debt", type: "", paymentType: "Bad Debt", parent: "" },
    { id: "2", code: "9898", description: "Banquet Deposits", type: "Banquet Deposits", paymentType: "", parent: "" },
    { id: "3", code: "11115333", description: "Cart Fees", type: "", paymentType: "", parent: "" },
    { id: "4", code: "002234", description: "Cash", type: "", paymentType: "Cash", parent: "" },
    { id: "5", code: "10001", description: "Cash Money", type: "", paymentType: "ACH", parent: "" },
    { id: "6", code: "4466y7", description: "Cash Payouts", type: "Cash Payouts", paymentType: "", parent: "" },
    { id: "7", code: "778457", description: "Cash Shortage", type: "Shortage", paymentType: "", parent: "" },
    { id: "8", code: "12111", description: "Check", type: "", paymentType: "Check", parent: "" },
    { id: "9", code: "7001009", description: "Clinics", type: "Clinics", paymentType: "", parent: "" },
    { id: "10", code: "123456", description: "Credit", type: "", paymentType: "Credit", parent: "Cash (002234)" },
    { id: "11", code: "441199", description: "Credit Surcharges", type: "Credit Card Surcharges", paymentType: "", parent: "" },
    { id: "12", code: "1190", description: "Customer Charge", type: "", paymentType: "Customer Charge", parent: "" },
    { id: "13", code: "12113", description: "Gift Cards", type: "", paymentType: "Gift Card", parent: "" },
    { id: "14", code: "1119", description: "Gift Cards - Customer Credit", type: "Customer Credits", paymentType: "", parent: "Gift Cards (1112)" },
    { id: "15", code: "112025", description: "Golf Apparel", type: "", paymentType: "", parent: "" },
    { id: "16", code: "4500", description: "Golf Balls", type: "", paymentType: "", parent: "" },
    { id: "17", code: "1111", description: "Gratuity", type: "Gratuity", paymentType: "", parent: "" },
    { id: "18", code: "3341", description: "Liquor Sales", type: "", paymentType: "", parent: "" },
    { id: "19", code: "8675309", description: "Punch Cards", type: "", paymentType: "", parent: "" },
    { id: "20", code: "443871", description: "Rain Check Payments", type: "", paymentType: "Rain Check", parent: "" },
    { id: "21", code: "0011234", description: "Taxes", type: "Sales Tax", paymentType: "", parent: "" },
    { id: "22", code: "1230000", description: "Tee Fees", type: "", paymentType: "", parent: "" },
];

/** General Ledger Codes — the account codes that map transactions to the ledger. */
export const GeneralLedgerCodes: Story = {
    name: "GL — Codes",
    render: () => (
        <AppShell activeUrl="/reports/general-ledger/codes">
            <PageHeader
                title="General Ledger Codes"
                subtitle="Account codes used to map every transaction into the ledger."
                action={
                    <Button iconLeading={Plus} size="md">
                        New code
                    </Button>
                }
            />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <ListToolbar placeholder="Search codes" />
                    <Table aria-label="General ledger codes">
                        <Table.Header>
                            <Table.Head label="Code" isRowHeader className="w-40" />
                            <Table.Head label="Description" />
                            <Table.Head label="Type" />
                            <Table.Head label="Payment type" />
                            <Table.Head label="Parent" />
                        </Table.Header>
                        <Table.Body items={ledgerCodes}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary tabular-nums">{row.code}</Table.Cell>
                                    <Table.Cell className="font-medium text-primary">{row.description}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.type || "—"}</Table.Cell>
                                    <Table.Cell>
                                        {row.paymentType ? (
                                            <Badge size="sm" type="pill-color" color="gray">
                                                {row.paymentType}
                                            </Badge>
                                        ) : (
                                            <span className="text-tertiary">—</span>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.parent || "—"}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <PaginationFooter page={1} total={3} />
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ----------------------------------------------------------------------------------------------- */
/* General Ledger — A Report (config screen, consolidates A + A beta)                              */
/* ----------------------------------------------------------------------------------------------- */

/** General Ledger A — the run-a-report configuration screen with a QuickBooks sync. */
export const GeneralLedgerReport: Story = {
    name: "GL — Report",
    render: () => (
        <AppShell activeUrl="/reports/general-ledger">
            <PageHeader
                title="General Ledger A Report"
                badge={
                    <Badge size="md" type="pill-color" color="warning">
                        Beta
                    </Badge>
                }
                subtitle="Select a date range and run the ledger, then push balances to QuickBooks."
            />
            <div className="flex flex-col gap-6 p-6 lg:p-8">
                <div className="flex flex-col gap-4 rounded-xl bg-primary p-5 ring-1 ring-secondary sm:flex-row sm:flex-wrap sm:items-end">
                    <DateField label="Start date" value="Jul 24, 2026" />
                    <DateField label="End date" value="Jul 24, 2026" />
                    <div className="flex items-end gap-2">
                        <Button size="md" iconLeading={SearchLg}>
                            Run report
                        </Button>
                        <Button size="md" color="secondary" iconLeading={RefreshCcw02}>
                            Sync with QuickBooks
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-secondary bg-secondary py-20 text-center">
                    <span className="flex size-11 items-center justify-center rounded-lg bg-primary text-fg-quaternary ring-1 ring-secondary">
                        <Receipt className="size-5" aria-hidden="true" />
                    </span>
                    <p className="text-sm font-medium text-secondary">No report generated yet</p>
                    <p className="max-w-sm text-sm text-tertiary">Choose a start and end date above, then run the report to see ledger balances by account.</p>
                </div>
            </div>
        </AppShell>
    ),
};

/* ----------------------------------------------------------------------------------------------- */
/* User Activities                                                                                 */
/* ----------------------------------------------------------------------------------------------- */

interface Activity {
    id: string;
    user: string;
    type: string;
    app: string;
    date: string;
    notes: string;
}

const activities: Activity[] = [
    { id: "1", user: "Cody Sanders", type: "Login", app: "TenFore Portal", date: "Jul 24, 2026 · 09:18 AM", notes: "" },
    { id: "2", user: "Aric Zuberbier", type: "Login", app: "TenFore Portal", date: "Jul 24, 2026 · 08:30 AM", notes: "" },
    { id: "3", user: "Jeremy Mehlman", type: "Shift Edited", app: "Batch", date: "Jul 24, 2026 · 08:05 AM", notes: "Auto-ended forgotten blind-checkout shift 43198 at $0 cash" },
    { id: "4", user: "Chance Hindbaugh", type: "Shift Edited", app: "Batch", date: "Jul 24, 2026 · 08:05 AM", notes: "Auto-ended forgotten blind-checkout shift 43204 at $0 cash" },
    { id: "5", user: "John Admin", type: "Shift Edited", app: "Batch", date: "Jul 24, 2026 · 08:05 AM", notes: "Auto-ended forgotten blind-checkout shift 43195 at $0 cash" },
    { id: "6", user: "—", type: "Customer Charge Payment Updated", app: "TenFore Portal", date: "Jul 24, 2026 · 12:28 AM", notes: "Customer changed on CCPID: 178771" },
    { id: "7", user: "Jarrette Schule", type: "Login", app: "TenFore Portal", date: "Jul 24, 2026 · 12:27 AM", notes: "" },
];

const activityTypes = [
    { id: "all", label: "All types" },
    { id: "login", label: "Login" },
    { id: "shift", label: "Shift Edited" },
    { id: "charge", label: "Customer Charge Payment" },
];

const typeColor = (type: string) => (type === "Login" ? "blue" : type.startsWith("Shift") ? "orange" : "purple") as "blue" | "orange" | "purple";

/** User Activities — an audit log of portal logins, shift edits, and record changes. */
export const UserActivities: Story = {
    render: () => (
        <AppShell activeUrl="/reports/user-activities">
            <PageHeader title="User Activities" subtitle="Audit trail of staff logins, shift edits, and record changes." />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-3">
                            <DateField label="From" value="Jul 17, 2026" />
                            <DateField label="To" value="Jul 24, 2026" />
                            <div className="w-48">
                                <Select label="Type" placeholder="All types" items={activityTypes}>
                                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                </Select>
                            </div>
                        </div>
                        <div className="flex items-end gap-2">
                            <Input size="sm" aria-label="Search activity" placeholder="Search" icon={SearchLg} wrapperClassName="sm:w-64" />
                            <Button size="sm" color="secondary" iconLeading={Download01}>
                                Export
                            </Button>
                        </div>
                    </div>
                    <Table aria-label="User activities">
                        <Table.Header>
                            <Table.Head label="User" isRowHeader className="w-44" />
                            <Table.Head label="Type" className="w-48" />
                            <Table.Head label="App" className="w-36" />
                            <Table.Head label="Date" className="w-48" />
                            <Table.Head label="Notes" />
                        </Table.Header>
                        <Table.Body items={activities}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-brand-secondary">{row.user}</Table.Cell>
                                    <Table.Cell>
                                        <Badge size="sm" type="pill-color" color={typeColor(row.type)}>
                                            {row.type}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.app}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.date}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.notes || "—"}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <PaginationFooter page={1} total={12} />
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ----------------------------------------------------------------------------------------------- */
/* Waitlists                                                                                        */
/* ----------------------------------------------------------------------------------------------- */

interface WaitlistEntry {
    id: string;
    window: string;
    course: string;
    teeTime: string;
    players: number;
    status: "Fulfilled" | "Past" | "Active";
    type: string;
    joined: string;
    customer: string;
    email: string;
    hoursAhead: string;
}

const waitlist: WaitlistEntry[] = [
    { id: "1", window: "Jul 9, 2026 · 2:00 PM – 10:00 PM", course: "East Course, North Course, West Course", teeTime: "Jul 9, 2026 · 2:31 PM", players: 2, status: "Fulfilled", type: "Notify Only", joined: "Jul 9, 2026 · 12:56 PM", customer: "Monday Prod", email: "lisa+22@tenfore.golf", hoursAhead: "-15.83" },
    { id: "2", window: "Jun 29, 2026 · 6:00 AM – 2:00 PM", course: "North Course", teeTime: "—", players: 0, status: "Past", type: "Notify Only", joined: "Jun 29, 2026 · 07:59 AM", customer: "Igor Kuznetsov", email: "igor.n.kuz@gmail.com", hoursAhead: "—" },
    { id: "3", window: "Jul 12, 2026 · 7:00 AM – 11:00 AM", course: "West Course", teeTime: "Jul 12, 2026 · 8:12 AM", players: 4, status: "Fulfilled", type: "Auto-book", joined: "Jul 11, 2026 · 09:04 PM", customer: "Weston Farnsworth", email: "weston@sagamore.golf", hoursAhead: "10.8" },
    { id: "4", window: "Jul 18, 2026 · 12:00 PM – 4:00 PM", course: "East Course", teeTime: "—", players: 3, status: "Active", type: "Notify Only", joined: "Jul 14, 2026 · 02:30 PM", customer: "Priya Nair", email: "priya.nair@example.com", hoursAhead: "—" },
    { id: "5", window: "Jul 20, 2026 · 6:00 AM – 10:00 AM", course: "North Course", teeTime: "Jul 20, 2026 · 6:48 AM", players: 2, status: "Fulfilled", type: "Auto-book", joined: "Jul 19, 2026 · 08:15 PM", customer: "Marcus Bennett", email: "marcus@example.com", hoursAhead: "10.2" },
];

const waitlistStatusColor = (s: WaitlistEntry["status"]) => (s === "Fulfilled" ? "success" : s === "Active" ? "blue" : "gray");

/** Waitlist Report — everyone waiting on a tee time, and whether their slot got filled. */
export const Waitlists: Story = {
    render: () => (
        <AppShell activeUrl="/reports/waitlists">
            <PageHeader title="Waitlist Report" subtitle="Members and guests waiting on a tee time, and how each request resolved." />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <ListToolbar placeholder="Search waitlist" />
                    <Table aria-label="Waitlist">
                        <Table.Header>
                            <Table.Head label="Date window" isRowHeader className="w-56" />
                            <Table.Head label="Course" />
                            <Table.Head label="Tee time" className="w-40" />
                            <Table.Head label="Players" className="w-20 text-right" />
                            <Table.Head label="Status" className="w-28" />
                            <Table.Head label="Type" className="w-28" />
                            <Table.Head label="Joined" className="w-40" />
                            <Table.Head label="Customer" />
                            <Table.Head label="Hrs ahead" className="w-24 text-right" />
                        </Table.Header>
                        <Table.Body items={waitlist}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.window}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.course}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.teeTime}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums">{row.players}</Table.Cell>
                                    <Table.Cell>
                                        <Badge size="sm" type="pill-color" color={waitlistStatusColor(row.status)}>
                                            {row.status}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.type}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.joined}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-brand-secondary">{row.customer}</span>
                                            <span className="text-xs text-tertiary">{row.email}</span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.hoursAhead}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <PaginationFooter page={1} total={6} />
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ----------------------------------------------------------------------------------------------- */
/* Credits — Gift Cards                                                                            */
/* ----------------------------------------------------------------------------------------------- */

interface GiftCard {
    id: string;
    cardId: string;
    to: string;
    from: string;
    upc: string;
    type: "Purchased" | "Winnings" | "Credit";
    created: string;
    expires: string;
    awarded: number;
    used: number;
    balance: number;
}

const giftCards: GiftCard[] = [
    { id: "1", cardId: "257536", to: "Cade Schule", from: "N/A", upc: "cb257536", type: "Winnings", created: "06/30/2026", expires: "12/30/2026", awarded: 100, used: 0, balance: 100 },
    { id: "2", cardId: "256909", to: "Hooters Test GC", from: "Hooters Test GC", upc: "3926112506264", type: "Purchased", created: "06/25/2026", expires: "04/22/2027", awarded: 100, used: 0, balance: 100 },
    { id: "3", cardId: "255683", to: "Avery Robertson", from: "Avery Robertson", upc: "13023170626", type: "Purchased", created: "06/17/2026", expires: "04/15/2027", awarded: 100, used: 0, balance: 100 },
    { id: "4", cardId: "255489", to: "Jeremy Mehlman", from: "Jeremy Mehlman", upc: "012831606261", type: "Purchased", created: "06/16/2026", expires: "04/13/2027", awarded: 100, used: 12.34, balance: 87.66 },
    { id: "5", cardId: "254595", to: "Sagamore Pro Shop", from: "Front Desk", upc: "2026612102644", type: "Purchased", created: "06/12/2026", expires: "06/30/2027", awarded: 50, used: 0, balance: 50 },
    { id: "6", cardId: "254330", to: "Aaron Perry", from: "Tim Kelley", upc: "19166906261", type: "Purchased", created: "06/09/2026", expires: "04/06/2027", awarded: 50, used: 0, balance: 50 },
    { id: "7", cardId: "252394", to: "Jarrette Schule", from: "Jarrette Schule", upc: "5338121905261", type: "Purchased", created: "05/19/2026", expires: "03/16/2027", awarded: 100, used: 0, balance: 100 },
    { id: "8", cardId: "251544", to: "Brittany Hindbaugh", from: "N/A", upc: "cb251544", type: "Winnings", created: "05/08/2026", expires: "03/06/2027", awarded: 14, used: 0, balance: 14 },
    { id: "9", cardId: "250900", to: "Avery Robertson", from: "Avery Robertson", upc: "443832904261", type: "Credit", created: "04/29/2026", expires: "02/24/2027", awarded: 200, used: 74.17, balance: 125.83 },
    { id: "10", cardId: "250784", to: "Randy Orton", from: "N/A", upc: "cb250784", type: "Winnings", created: "04/27/2026", expires: "02/23/2027", awarded: 100, used: 0, balance: 100 },
];

const giftTypeColor = (t: GiftCard["type"]) => (t === "Winnings" ? "success" : t === "Credit" ? "purple" : "gray");

/** Gift Cards — issued cards with balances, split by purchased, winnings, and credit. */
export const GiftCards: Story = {
    name: "Credits — Gift Cards",
    render: () => (
        <AppShell activeUrl="/reports/credits/gift-cards">
            <PageHeader title="Gift Cards" subtitle="Every gift card issued at Sagamore Spring, with live balances." />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <MetricCard title="Active cards" value="1,009" change={6.4} changeLabel="vs last month" icon={Gift01} />
                    <MetricCard title="Outstanding balance" value="$98,900.73" change={2.1} changeLabel="vs last month" icon={CurrencyDollar} />
                    <MetricCard title="Redeemed this month" value="$4,218.90" change={-3.2} changeLabel="vs last month" icon={Coins01} />
                </div>
                <TableCard.Root>
                    <ListToolbar placeholder="Search gift cards" />
                    <Table aria-label="Gift cards">
                        <Table.Header>
                            <Table.Head label="ID" isRowHeader className="w-24" />
                            <Table.Head label="To" />
                            <Table.Head label="From" />
                            <Table.Head label="UPC" />
                            <Table.Head label="Type" className="w-28" />
                            <Table.Head label="Created" className="w-28" />
                            <Table.Head label="Expires" className="w-28" />
                            <Table.Head label="Awarded" className="w-24 text-right" />
                            <Table.Head label="Used" className="w-24 text-right" />
                            <Table.Head label="Balance" className="w-24 text-right" />
                        </Table.Header>
                        <Table.Body items={giftCards}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary tabular-nums">{row.cardId}</Table.Cell>
                                    <Table.Cell className="font-medium text-brand-secondary">{row.to}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.from}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.upc}</Table.Cell>
                                    <Table.Cell>
                                        <Badge size="sm" type="pill-color" color={giftTypeColor(row.type)}>
                                            {row.type}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.created}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.expires}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums">{money(row.awarded)}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{money(row.used)}</Table.Cell>
                                    <Table.Cell className="text-right font-medium text-primary tabular-nums">{money(row.balance)}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <div className="flex items-center justify-between gap-4 border-t border-secondary px-4 py-3">
                        <span className="text-sm text-tertiary">1,009 gift cards</span>
                        <span className="text-sm font-semibold text-primary">
                            Total balance: <span className="tabular-nums">$98,900.73</span>
                        </span>
                    </div>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ----------------------------------------------------------------------------------------------- */
/* Credits — Rain Checks                                                                           */
/* ----------------------------------------------------------------------------------------------- */

interface RainCheck {
    id: string;
    rcId: string;
    customer: string;
    created: string;
    expires: string;
    realized: string;
    awarded: number;
    used: number;
    balance: number;
}

const rainChecks: RainCheck[] = [
    { id: "1", rcId: "47273", customer: "Cayla Wride", created: "7/22/2026", expires: "7/22/2027", realized: "—", awarded: 65.17, used: 0, balance: 65.17 },
    { id: "2", rcId: "47272", customer: "Cayla Wride", created: "7/22/2026", expires: "7/22/2027", realized: "—", awarded: 65.17, used: 0, balance: 65.17 },
    { id: "3", rcId: "46356", customer: "Trevor Nash", created: "7/16/2026", expires: "7/16/2027", realized: "—", awarded: 130.34, used: 0, balance: 130.34 },
    { id: "4", rcId: "46354", customer: "Trevor Nash", created: "7/16/2026", expires: "7/16/2027", realized: "7/18/2026", awarded: 130.34, used: 130.34, balance: 0 },
    { id: "5", rcId: "46353", customer: "Trevor Nash", created: "7/16/2026", expires: "7/16/2027", realized: "7/17/2026", awarded: 115.86, used: 115.86, balance: 0 },
    { id: "6", rcId: "46154", customer: "Jeremy Mehlman", created: "7/14/2026", expires: "7/14/2027", realized: "—", awarded: 89.59, used: 0, balance: 89.59 },
    { id: "7", rcId: "41637", customer: "Ivar Brennevin", created: "6/11/2026", expires: "6/11/2027", realized: "—", awarded: 69.44, used: 0, balance: 69.44 },
    { id: "8", rcId: "39014", customer: "Oda Brennevin", created: "5/21/2026", expires: "5/30/2026", realized: "7/16/2026", awarded: 77.5, used: 77.5, balance: 0 },
    { id: "9", rcId: "36903", customer: "Weston Farnsworth", created: "4/27/2026", expires: "4/28/2027", realized: "—", awarded: 91.63, used: 0, balance: 91.63 },
    { id: "10", rcId: "36099", customer: "CT Carswell", created: "4/22/2026", expires: "4/22/2027", realized: "—", awarded: 17, used: 0, balance: 17 },
];

/** Rain Checks — weather credits issued to golfers, with realized and remaining balances. */
export const RainChecks: Story = {
    name: "Credits — Rain Checks",
    render: () => (
        <AppShell activeUrl="/reports/credits/rain-checks">
            <PageHeader
                title="Rain Checks"
                subtitle="Weather credits issued to golfers, with realized and remaining balances."
                action={
                    <Button iconLeading={Plus} size="md">
                        New rain check
                    </Button>
                }
            />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <ListToolbar placeholder="Search rain checks" />
                    <Table aria-label="Rain checks">
                        <Table.Header>
                            <Table.Head label="ID" isRowHeader className="w-24" />
                            <Table.Head label="Customer" />
                            <Table.Head label="Created" className="w-28" />
                            <Table.Head label="Expires" className="w-28" />
                            <Table.Head label="Realized" className="w-28" />
                            <Table.Head label="Awarded" className="w-28 text-right" />
                            <Table.Head label="Used" className="w-28 text-right" />
                            <Table.Head label="Balance" className="w-28 text-right" />
                        </Table.Header>
                        <Table.Body items={rainChecks}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary tabular-nums">{row.rcId}</Table.Cell>
                                    <Table.Cell className="font-medium text-brand-secondary">{row.customer}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.created}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.expires}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.realized}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums">{money(row.awarded)}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{money(row.used)}</Table.Cell>
                                    <Table.Cell className="text-right font-medium text-primary tabular-nums">{money(row.balance)}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <div className="flex items-center justify-between gap-4 border-t border-secondary px-4 py-3">
                        <span className="text-sm text-tertiary">248 rain checks</span>
                        <span className="text-sm font-semibold text-primary">
                            Total balance: <span className="tabular-nums">$4,613.60</span>
                        </span>
                    </div>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ----------------------------------------------------------------------------------------------- */
/* Credits — Payment Sources                                                                       */
/* ----------------------------------------------------------------------------------------------- */

interface PaymentSource {
    id: string;
    ref: string;
    customer: string;
    postal: string;
    merchantId: string;
    app: string;
    details: string;
    created: string;
    expiration: string;
}

const paymentSources: PaymentSource[] = [
    { id: "1", ref: "88", customer: "Huck Finn", postal: "78163", merchantId: "—", app: "Portal", details: "VISA •••• 1443", created: "—", expiration: "01/40" },
    { id: "2", ref: "1190", customer: "Cade Schule", postal: "Add", merchantId: "850000000054", app: "Crane Android", details: "VISA •••• 4242", created: "May 29, 2026", expiration: "08/29" },
    { id: "3", ref: "1190", customer: "Jarrette Schule", postal: "Add", merchantId: "850000000054", app: "Crane Android", details: "VISA •••• 4242", created: "May 29, 2026", expiration: "08/29" },
    { id: "4", ref: "1190", customer: "Sawyer Pearson", postal: "12345", merchantId: "850000000054", app: "Crane Android", details: "VISA •••• 4242", created: "May 29, 2026", expiration: "08/29" },
    { id: "5", ref: "1190", customer: "Tenfore Quality", postal: "83642", merchantId: "850000000054", app: "Crane Android", details: "VISA •••• 4242", created: "May 29, 2026", expiration: "08/29" },
    { id: "6", ref: "1190", customer: "Charlie Carswell", postal: "Add", merchantId: "850000000054", app: "Crane Android", details: "VISA •••• 4242", created: "May 29, 2026", expiration: "08/29" },
    { id: "7", ref: "1190", customer: "Cody Sanders", postal: "35816", merchantId: "850000000054", app: "Crane Android", details: "VISA •••• 4242", created: "May 29, 2026", expiration: "08/29" },
    { id: "8", ref: "1190", customer: "Ivar Brennevin", postal: "98229", merchantId: "850000000054", app: "Crane Android", details: "VISA •••• 4242", created: "May 29, 2026", expiration: "08/29" },
    { id: "9", ref: "1190", customer: "Matt Jensen", postal: "Add", merchantId: "850000000054", app: "Crane Android", details: "VISA •••• 4242", created: "May 29, 2026", expiration: "08/29" },
    { id: "10", ref: "1190", customer: "Stefan Brennevin", postal: "Add", merchantId: "850000000054", app: "Crane Android", details: "VISA •••• 4242", created: "May 29, 2026", expiration: "08/29" },
];

/** Payment Sources — stored cards and ACH tokens on file, by customer. */
export const PaymentSources: Story = {
    name: "Credits — Payment Sources",
    render: () => (
        <AppShell activeUrl="/reports/credits/payment-sources">
            <PageHeader title="Payment Sources" subtitle="Stored cards and ACH tokens on file for customers." />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <ListToolbar placeholder="Search payment sources" />
                    <Table aria-label="Payment sources">
                        <Table.Header>
                            <Table.Head label="#" isRowHeader className="w-20" />
                            <Table.Head label="Customer" />
                            <Table.Head label="Postal" className="w-24" />
                            <Table.Head label="Merchant ID" />
                            <Table.Head label="App" className="w-36" />
                            <Table.Head label="Details" className="w-40" />
                            <Table.Head label="Created" className="w-36" />
                            <Table.Head label="Expiration" className="w-24" />
                            <Table.Head label="" className="w-16" />
                        </Table.Header>
                        <Table.Body items={paymentSources}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary tabular-nums">{row.ref}</Table.Cell>
                                    <Table.Cell className="font-medium text-primary">{row.customer}</Table.Cell>
                                    <Table.Cell className={row.postal === "Add" ? "text-brand-secondary" : "text-tertiary tabular-nums"}>{row.postal}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.merchantId}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.app}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center gap-2">
                                            <CreditCard01 className="size-4 text-fg-quaternary" aria-hidden="true" />
                                            <span className="tabular-nums">{row.details}</span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.created}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.expiration}</Table.Cell>
                                    <Table.Cell>
                                        <Button size="sm" color="tertiary-destructive" iconLeading={Trash01} aria-label="Remove payment source" />
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <PaginationFooter page={1} total={24} />
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ----------------------------------------------------------------------------------------------- */
/* Credits — Punch Cards                                                                           */
/* ----------------------------------------------------------------------------------------------- */

interface PunchCard {
    id: string;
    cpcId: string;
    customer: string;
    member: string;
    price: number;
    created: string;
    expires: string;
    awarded: number;
    used: number;
    remaining: number;
}

const punchCards: PunchCard[] = [
    { id: "1", cpcId: "18975", customer: "Trevor Nash", member: "N/A", price: 611.25, created: "7/23/2026", expires: "8/23/2026", awarded: 10, used: 0, remaining: 10 },
    { id: "2", cpcId: "18950", customer: "Pankaj Sah", member: "38695", price: 0, created: "7/20/2026", expires: "8/20/2026", awarded: 3, used: 0, remaining: 3 },
    { id: "3", cpcId: "18855", customer: "Unknown", member: "67507", price: 0, created: "7/9/2026", expires: "8/9/2026", awarded: 10, used: 0, remaining: 10 },
    { id: "4", cpcId: "18854", customer: "Hans Brennevin", member: "59942", price: 0, created: "7/9/2026", expires: "8/9/2026", awarded: 3, used: 0, remaining: 3 },
    { id: "5", cpcId: "18837", customer: "Birdie Member", member: "45046", price: 0, created: "7/8/2026", expires: "—", awarded: 3, used: 0, remaining: 3 },
    { id: "6", cpcId: "18813", customer: "Austin Zech", member: "24126", price: 0, created: "7/6/2026", expires: "—", awarded: 3, used: 0, remaining: 3 },
    { id: "7", cpcId: "18810", customer: "Charlie Carswell", member: "59818", price: 0, created: "7/6/2026", expires: "—", awarded: 3, used: 1, remaining: 2 },
    { id: "8", cpcId: "18803", customer: "Gold Member", member: "50395", price: 0, created: "7/6/2026", expires: "—", awarded: 3, used: 0, remaining: 3 },
    { id: "9", cpcId: "18798", customer: "Avery Robertson", member: "66226", price: 0, created: "7/5/2026", expires: "8/5/2026", awarded: 3, used: 2, remaining: 1 },
    { id: "10", cpcId: "18772", customer: "Maron Lane", member: "26576", price: 0, created: "7/1/2026", expires: "—", awarded: 10, used: 4, remaining: 6 },
];

/** Punch Cards — prepaid round bundles, tracking rounds awarded, used, and remaining. */
export const PunchCards: Story = {
    name: "Credits — Punch Cards",
    render: () => (
        <AppShell activeUrl="/reports/credits/punch-cards">
            <PageHeader
                title="Punch Cards"
                subtitle="Prepaid round bundles, tracking rounds awarded, used, and remaining."
                action={
                    <Button iconLeading={SwitchHorizontal01} size="md" color="secondary">
                        Bulk entry
                    </Button>
                }
            />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <ListToolbar placeholder="Search punch cards" />
                    <Table aria-label="Punch cards">
                        <Table.Header>
                            <Table.Head label="CPC ID" isRowHeader className="w-24" />
                            <Table.Head label="Customer" />
                            <Table.Head label="Member" className="w-28" />
                            <Table.Head label="Price pre-tax" className="w-32 text-right" />
                            <Table.Head label="Created" className="w-28" />
                            <Table.Head label="Expires" className="w-28" />
                            <Table.Head label="Awarded" className="w-24 text-right" />
                            <Table.Head label="Used" className="w-20 text-right" />
                            <Table.Head label="Remaining" className="w-28 text-right" />
                        </Table.Header>
                        <Table.Body items={punchCards}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary tabular-nums">{row.cpcId}</Table.Cell>
                                    <Table.Cell className="font-medium text-brand-secondary">{row.customer}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.member}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums">{money(row.price)}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.created}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.expires}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums">{row.awarded}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.used}</Table.Cell>
                                    <Table.Cell className="text-right">
                                        <Badge size="sm" type="pill-color" color={row.remaining === 0 ? "gray" : "success"}>
                                            {row.remaining} left
                                        </Badge>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <PaginationFooter page={1} total={38} />
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ----------------------------------------------------------------------------------------------- */
/* Charges — Statements                                                                            */
/* ----------------------------------------------------------------------------------------------- */

interface Statement {
    id: string;
    name: string;
    email: string;
    delivery: "Email and Mail" | "Email Only" | "Not Set";
    method: string;
    lastEmail: string;
    charges: number;
    payments: number;
    balance: number;
}

const statements: Statement[] = [
    { id: "1", name: "A Z", email: "az@aaa.com", delivery: "Email and Mail", method: "—", lastEmail: "Jan 15, 2026", charges: 470.25, payments: 70.25, balance: 400 },
    { id: "2", name: "Abraham Richardson", email: "abraham.w.richardson@gmail.com", delivery: "Not Set", method: "—", lastEmail: "—", charges: 0, payments: 1, balance: -1 },
    { id: "3", name: "Adam Pisces", email: "adam.pisces@example.com", delivery: "Email and Mail", method: "—", lastEmail: "Jan 15, 2026", charges: 368.84, payments: 271, balance: 97.84 },
    { id: "4", name: "Aging One", email: "sawyer.pearson+aging.one@example.com", delivery: "Not Set", method: "CC •••• 4242", lastEmail: "Jan 15, 2026", charges: 3110.49, payments: 3110.49, balance: 0 },
    { id: "5", name: "Aging Three", email: "sawyer.pearson+aging.three@example.com", delivery: "Not Set", method: "—", lastEmail: "Jan 15, 2026", charges: 1084.34, payments: 0, balance: 1084.34 },
    { id: "6", name: "Alex Carswell", email: "alex@carswell.golf", delivery: "Not Set", method: "CC •••• 2271", lastEmail: "Jan 15, 2026", charges: -98.65, payments: 14.22, balance: -112.87 },
    { id: "7", name: "Alex Jeffrey", email: "alex@j.com", delivery: "Email Only", method: "—", lastEmail: "Jan 15, 2026", charges: 334.34, payments: 221, balance: 113.34 },
    { id: "8", name: "Andrew Miles", email: "weston.farnsworth+andrew@example.com", delivery: "Not Set", method: "—", lastEmail: "Jan 15, 2026", charges: 678.92, payments: 0, balance: 678.92 },
    { id: "9", name: "Ann Carswell", email: "ann@carswell.com", delivery: "Email Only", method: "—", lastEmail: "Jan 15, 2026", charges: 2492.94, payments: 0, balance: 2492.94 },
];

const deliveryColor = (d: Statement["delivery"]) => (d === "Not Set" ? "gray" : d === "Email Only" ? "blue" : "success");

/** Statements — member charge statements with delivery preferences and balances. */
export const Statements: Story = {
    name: "Charges — Statements",
    render: () => (
        <AppShell activeUrl="/reports/charges/statements">
            <PageHeader
                title="Statements"
                subtitle="Monthly member charge statements — message, mail, or regenerate in bulk."
                action={
                    <div className="flex items-center gap-2">
                        <Button size="md" color="secondary" iconLeading={Send01}>
                            Message members
                        </Button>
                        <Button size="md" color="secondary" iconLeading={Mail01}>
                            Mail statements
                        </Button>
                        <Button size="md" iconLeading={RefreshCcw02}>
                            Regenerate
                        </Button>
                    </div>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                <div className="flex items-start gap-2 rounded-lg bg-warning-secondary px-4 py-3 text-sm ring-1 ring-secondary">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-fg-warning-primary" aria-hidden="true" />
                    <span className="text-secondary">
                        <span className="font-semibold text-primary">Automated statements are disabled</span> for this golf course. Statements must be sent manually.
                    </span>
                </div>
                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-3">
                            <DateField label="Month" value="June 2026" />
                        </div>
                        <div className="flex items-end gap-2">
                            <Input size="sm" aria-label="Search members" placeholder="Name, email or phone" icon={SearchLg} wrapperClassName="sm:w-72" />
                            <Button size="sm" color="secondary" iconLeading={Download01}>
                                Export
                            </Button>
                        </div>
                    </div>
                    <Table aria-label="Statements">
                        <Table.Header>
                            <Table.Head label="Name" isRowHeader className="w-48" />
                            <Table.Head label="Email" />
                            <Table.Head label="Delivery" className="w-40" />
                            <Table.Head label="Payment method" className="w-36" />
                            <Table.Head label="Last email" className="w-32" />
                            <Table.Head label="Charges" className="w-28 text-right" />
                            <Table.Head label="Payments" className="w-28 text-right" />
                            <Table.Head label="Balance" className="w-28 text-right" />
                            <Table.Head label="" className="w-16" />
                        </Table.Header>
                        <Table.Body items={statements}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-brand-secondary">{row.name}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.email}</Table.Cell>
                                    <Table.Cell>
                                        <Badge size="sm" type="pill-color" color={deliveryColor(row.delivery)}>
                                            {row.delivery}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.method}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.lastEmail}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums">{money(row.charges)}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{money(row.payments)}</Table.Cell>
                                    <Table.Cell className="text-right font-medium text-primary tabular-nums">{money(row.balance)}</Table.Cell>
                                    <Table.Cell>
                                        <Button size="sm" color="tertiary" iconLeading={Printer} aria-label="Print statement" />
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <PaginationFooter page={1} total={13} />
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ----------------------------------------------------------------------------------------------- */
/* Charges — Aging                                                                                 */
/* ----------------------------------------------------------------------------------------------- */

interface AgingRow {
    id: string;
    acct: string;
    name: string;
    email: string;
    method: string;
    d30: number;
    d60: number;
    d90: number;
    pastDue: number;
    balance: number;
}

const aging: AgingRow[] = [
    { id: "1", acct: "1147651", name: "Bird, James", email: "jbird8269@yahoo.com", method: "Card / ACH", d30: 0, d60: 0, d90: 159.82, pastDue: 159.82, balance: 159.82 },
    { id: "2", acct: "204566", name: "1, bb1", email: "bb1@tenfore.golf", method: "Card / ACH", d30: 0, d60: 0, d90: 1089.8, pastDue: 1089.8, balance: 1089.8 },
    { id: "3", acct: "286888", name: "a, kashi", email: "kashi@gmail.com", method: "CC •••• 4242", d30: 0, d60: 0, d90: 0, pastDue: 0, balance: -120 },
    { id: "4", acct: "156854", name: "Account, Mga", email: "mga@test.com", method: "Card / ACH", d30: 0, d60: 0, d90: 100, pastDue: 100, balance: 100 },
    { id: "5", acct: "212089", name: "Adams, Glenn", email: "g@adams.com", method: "CC •••• 9509", d30: 536.33, d60: 0, d90: 16724.99, pastDue: 17261.32, balance: 17797.65 },
    { id: "6", acct: "206849", name: "bashir, mbs", email: "abc@gmail.com", method: "Card / ACH", d30: 0, d60: 0, d90: 2094.6, pastDue: 2094.6, balance: 2094.6 },
    { id: "7", acct: "165492", name: "Bednarz, Justin", email: "justin@tenfore.golf", method: "Card / ACH", d30: 0, d60: 0, d90: 627.15, pastDue: 627.15, balance: 627.15 },
    { id: "8", acct: "156761", name: "Bell, Emily", email: "ebell123@123.com", method: "Card / ACH", d30: 0, d60: 0, d90: 544.16, pastDue: 544.16, balance: 544.16 },
];

/** Aging Report — outstanding balances bucketed by age, with a totals row for the period. */
export const Aging: Story = {
    name: "Charges — Aging",
    render: () => (
        <AppShell activeUrl="/reports/charges/aging">
            <PageHeader
                title="Aging Report"
                subtitle="Outstanding member balances bucketed by age — July 2026."
                action={
                    <div className="flex items-center gap-2">
                        <Button size="md" color="secondary" iconLeading={CurrencyDollar}>
                            Process payments
                        </Button>
                        <Button size="md" color="secondary" iconLeading={Receipt}>
                            Charge late fees
                        </Button>
                    </div>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <MetricCard title="30 days" value="$12,629.00" icon={Receipt} />
                    <MetricCard title="90 days" value="$352,941.84" change={4.7} changeLabel="vs last month" icon={Receipt} />
                    <MetricCard title="Past due" value="$362,137.65" change={5.2} changeLabel="vs last month" icon={AlertTriangle} />
                    <MetricCard title="Total balance" value="$335,362.22" change={-1.8} changeLabel="vs last month" icon={CurrencyDollar} />
                </div>
                <TableCard.Root>
                    <ListToolbar placeholder="Search accounts" />
                    <Table aria-label="Aging report">
                        <Table.Header>
                            <Table.Head label="Account" isRowHeader className="w-28" />
                            <Table.Head label="Name" />
                            <Table.Head label="Method" className="w-36" />
                            <Table.Head label="30 days" className="w-28 text-right" />
                            <Table.Head label="60 days" className="w-28 text-right" />
                            <Table.Head label="90 days" className="w-28 text-right" />
                            <Table.Head label="Past due" className="w-28 text-right" />
                            <Table.Head label="Balance" className="w-28 text-right" />
                        </Table.Header>
                        <Table.Body items={aging}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary tabular-nums">{row.acct}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-brand-secondary">{row.name}</span>
                                            <span className="text-xs text-tertiary">{row.email}</span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.method}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{money(row.d30)}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{money(row.d60)}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{money(row.d90)}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums">{money(row.pastDue)}</Table.Cell>
                                    <Table.Cell className={`text-right font-medium tabular-nums ${row.balance < 0 ? "text-success-primary" : "text-primary"}`}>{money(row.balance)}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <div className="flex items-center justify-end gap-8 border-t border-secondary bg-secondary px-4 py-3 text-sm font-semibold text-primary">
                        <span>
                            Past due total: <span className="tabular-nums">$362,137.65</span>
                        </span>
                        <span>
                            Balance total: <span className="tabular-nums">$335,362.22</span>
                        </span>
                    </div>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ----------------------------------------------------------------------------------------------- */
/* Revenue — Sales by Category                                                                     */
/* ----------------------------------------------------------------------------------------------- */

const salesByCategory = [
    { name: "Golf (Green Fees)", value: 48210 },
    { name: "Pro Shop Merchandise", value: 22840 },
    { name: "Food", value: 14620 },
    { name: "Alcohol", value: 11380 },
    { name: "Transportation", value: 8940 },
];
const salesTotal = salesByCategory.reduce((sum, d) => sum + d.value, 0);

/** Sales by Category — revenue split across the course's sales categories for a date range. */
export const SalesByCategory: Story = {
    name: "Revenue — Sales by Category",
    render: () => (
        <AppShell activeUrl="/reports/revenue/sales-by-category">
            <PageHeader title="Sales by Category Report" subtitle="Revenue split across sales categories — Jul 1 – Jul 24, 2026." />
            <div className="flex flex-col gap-6 p-6 lg:p-8">
                <div className="flex flex-col gap-4 rounded-xl bg-primary p-5 ring-1 ring-secondary sm:flex-row sm:flex-wrap sm:items-end">
                    <DateField label="Start date" value="Jul 1, 2026" />
                    <DateField label="End date" value="Jul 24, 2026" />
                    <div className="flex items-end gap-2">
                        <Button size="md" iconLeading={SearchLg}>
                            Run report
                        </Button>
                        <Button size="md" color="secondary" iconLeading={Download01}>
                            Export
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <ChartCard title="Revenue mix" subtitle="Share of total sales">
                        <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
                            <ResponsiveContainer width="100%" height={220} className="max-w-52">
                                <PieChart>
                                    <Pie data={salesByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={58} outerRadius={92} paddingAngle={2} stroke="#ffffff" strokeWidth={2}>
                                        {salesByCategory.map((_, i) => (
                                            <Cell key={i} fill={CHART_SERIES[i]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<ChartTooltip valueFormatter={(v) => `$${Number(v).toLocaleString()}`} />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <ul className="flex w-full flex-1 flex-col gap-2.5">
                                {salesByCategory.map((slice, i) => (
                                    <li key={slice.name} className="flex items-center gap-2 py-1 text-sm">
                                        <span className="size-2.5 rounded-full" style={{ backgroundColor: CHART_SERIES[i] }} aria-hidden="true" />
                                        <span className="text-secondary">{slice.name}</span>
                                        <span className="ml-auto font-medium text-primary tabular-nums">${slice.value.toLocaleString()}</span>
                                        <span className="w-10 text-right text-tertiary tabular-nums">{Math.round((slice.value / salesTotal) * 100)}%</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </ChartCard>

                    <TableCard.Root>
                        <TableCard.Header title="Category totals" badge={<Badge size="sm" type="pill-color" color="brand">{salesByCategory.length} categories</Badge>} />
                        <Table aria-label="Sales by category">
                            <Table.Header>
                                <Table.Head label="Category" isRowHeader />
                                <Table.Head label="Total sales" className="w-40 text-right" />
                            </Table.Header>
                            <Table.Body items={salesByCategory.map((c, i) => ({ id: String(i), ...c }))}>
                                {(row) => (
                                    <Table.Row id={row.id}>
                                        <Table.Cell className="font-medium text-primary">{row.name}</Table.Cell>
                                        <Table.Cell className="text-right tabular-nums">${row.value.toLocaleString()}.00</Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                        <div className="flex items-center justify-between gap-4 border-t border-secondary bg-secondary px-4 py-3">
                            <span className="text-sm font-semibold text-primary">Total sales</span>
                            <span className="text-sm font-semibold text-primary tabular-nums">${salesTotal.toLocaleString()}.00</span>
                        </div>
                    </TableCard.Root>
                </div>
            </div>
        </AppShell>
    ),
};

/* ----------------------------------------------------------------------------------------------- */
/* Revenue — Combined Report                                                                       */
/* ----------------------------------------------------------------------------------------------- */

interface CombinedRow {
    id: string;
    section: string;
    amount: number;
    emphasis?: boolean;
}

const combinedSales = [
    { name: "Golf", value: 48210 },
    { name: "Pro Shop", value: 22840 },
    { name: "Food", value: 14620 },
    { name: "Alcohol", value: 11380 },
    { name: "Transport", value: 8940 },
    { name: "Fees", value: 6120 },
];
const combinedSalesTotal = combinedSales.reduce((s, d) => s + d.value, 0);

const combinedRows: CombinedRow[] = [
    { id: "1", section: "Food Sales", amount: 14620 },
    { id: "2", section: "Alcohol Sales", amount: 11380 },
    { id: "3", section: "Golf Sales", amount: 48210 },
    { id: "4", section: "Transportation Sales", amount: 8940 },
    { id: "5", section: "Pro Shop Sales", amount: 22840 },
    { id: "6", section: "Taxes", amount: 7315 },
    { id: "7", section: "Fees", amount: 6120 },
    { id: "8", section: "Total Sales", amount: 119425, emphasis: true },
];

/** Combined Report — every revenue section rolled into one financial summary. */
export const CombinedReport: Story = {
    name: "Revenue — Combined Report",
    render: () => (
        <AppShell activeUrl="/reports/revenue/combined">
            <PageHeader title="Combined Report" subtitle="All revenue sections rolled into one financial summary — Jul 1 – Jul 24, 2026." />
            <div className="flex flex-col gap-6 p-6 lg:p-8">
                <div className="flex flex-col gap-4 rounded-xl bg-primary p-5 ring-1 ring-secondary sm:flex-row sm:flex-wrap sm:items-end">
                    <DateField label="Start date" value="Jul 1, 2026" />
                    <DateField label="End date" value="Jul 24, 2026" />
                    <div className="flex items-end gap-2">
                        <Button size="md" iconLeading={SearchLg}>
                            Run report
                        </Button>
                        <Button size="md" color="secondary" iconLeading={Download01}>
                            Export
                        </Button>
                    </div>
                </div>

                <ChartCard title="Sales by section" subtitle="Gross sales for the period">
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={combinedSales} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                            <CartesianGrid stroke={CHART_INK.grid} vertical={false} />
                            <XAxis dataKey="name" {...axisProps} />
                            <YAxis {...axisProps} width={52} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                            <Tooltip content={<ChartTooltip valueFormatter={(v) => `$${Number(v).toLocaleString()}`} />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                            <Bar dataKey="value" name="Sales" fill={CHART_SERIES[0]} radius={[4, 4, 0, 0]} maxBarSize={48} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <TableCard.Root>
                    <Table aria-label="Combined report">
                        <Table.Header>
                            <Table.Head label="Section" isRowHeader />
                            <Table.Head label="Amount" className="w-48 text-right" />
                        </Table.Header>
                        <Table.Body items={combinedRows}>
                            {(row) => (
                                <Table.Row id={row.id} className={row.emphasis ? "bg-secondary" : undefined}>
                                    <Table.Cell className={row.emphasis ? "font-semibold text-primary" : "font-medium text-primary"}>{row.section}</Table.Cell>
                                    <Table.Cell className={`text-right tabular-nums ${row.emphasis ? "font-semibold text-primary" : ""}`}>${row.amount.toLocaleString()}.00</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <div className="flex items-center justify-between gap-4 border-t border-secondary bg-secondary px-4 py-3">
                        <span className="text-sm font-semibold text-primary">Total payments</span>
                        <span className="text-sm font-semibold text-primary tabular-nums">${combinedSalesTotal.toLocaleString()}.00</span>
                    </div>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ----------------------------------------------------------------------------------------------- */
/* Revenue — Discounts & Promos                                                                    */
/* ----------------------------------------------------------------------------------------------- */

interface DiscountRow {
    id: string;
    type: string;
    count: number;
    amount: number;
}
const discountsByType: DiscountRow[] = [
    { id: "1", type: "Member Rate", count: 184, amount: 4210.5 },
    { id: "2", type: "Twilight", count: 96, amount: 1880.0 },
    { id: "3", type: "Senior", count: 72, amount: 1044.0 },
    { id: "4", type: "Junior", count: 38, amount: 494.0 },
    { id: "5", type: "Manual", count: 21, amount: 612.75 },
];
const discountsTotal = discountsByType.reduce((s, d) => s + d.amount, 0);

interface PromoRow {
    id: string;
    promo: string;
    code: string;
    lines: number;
    amount: number;
}
const promotions: PromoRow[] = [
    { id: "1", promo: "Summer Kickoff", code: "SUMMER26", lines: 64, amount: 1920.0 },
    { id: "2", promo: "Member Appreciation", code: "THANKYOU", lines: 41, amount: 1025.0 },
    { id: "3", promo: "Range 5-for-4", code: "RANGE54", lines: 28, amount: 336.0 },
];
const promosTotal = promotions.reduce((s, d) => s + d.amount, 0);

/** Discounts & Promos — gross amounts discounted by type and by promotion code. */
export const DiscountsPromos: Story = {
    name: "Revenue — Discounts & Promos",
    render: () => (
        <AppShell activeUrl="/reports/revenue/discounts-promos">
            <PageHeader title="Discounts & Promos" subtitle="Gross amount discounted for completed orders — Jul 1 – Jul 24, 2026." />
            <div className="flex flex-col gap-6 p-6 lg:p-8">
                <div className="flex flex-col gap-4 rounded-xl bg-primary p-5 ring-1 ring-secondary sm:flex-row sm:flex-wrap sm:items-end">
                    <DateField label="Start date" value="Jul 1, 2026" />
                    <DateField label="End date" value="Jul 24, 2026" />
                    <div className="flex items-end gap-2">
                        <Button size="md" iconLeading={SearchLg}>
                            Run report
                        </Button>
                        <Button size="md" color="secondary" iconLeading={Download01}>
                            Export
                        </Button>
                    </div>
                </div>

                <TableCard.Root>
                    <TableCard.Header
                        title="Discounts by type"
                        badge={<Badge size="sm" type="pill-color" color="brand">{discountsByType.length} types</Badge>}
                        description={`$${discountsTotal.toLocaleString()} discounted`}
                    />
                    <Table aria-label="Discounts by type">
                        <Table.Header>
                            <Table.Head label="Discount type" isRowHeader />
                            <Table.Head label="Count" className="w-32 text-right" />
                            <Table.Head label="Amount" className="w-40 text-right" />
                        </Table.Header>
                        <Table.Body items={discountsByType}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary">{row.type}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.count}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums">{money(row.amount)}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </TableCard.Root>

                <TableCard.Root>
                    <TableCard.Header
                        title="Promotions"
                        badge={<Badge size="sm" type="pill-color" color="purple">{promotions.length} promos</Badge>}
                        description={`$${promosTotal.toLocaleString()} redeemed`}
                    />
                    <Table aria-label="Promotions">
                        <Table.Header>
                            <Table.Head label="Promotion" isRowHeader />
                            <Table.Head label="Code" className="w-40" />
                            <Table.Head label="Lines" className="w-28 text-right" />
                            <Table.Head label="Amount" className="w-40 text-right" />
                        </Table.Header>
                        <Table.Body items={promotions}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary">{row.promo}</Table.Cell>
                                    <Table.Cell>
                                        <Badge size="sm" type="pill-color" color="gray">
                                            {row.code}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.lines}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums">{money(row.amount)}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ----------------------------------------------------------------------------------------------- */
/* Rounds — Weekly                                                                                 */
/* ----------------------------------------------------------------------------------------------- */

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weeklyRounds = weekDays.map((day, i) => ({
    day,
    Current: [18, 22, 26, 24, 41, 66, 58][i],
    "Prior year": [14, 19, 24, 21, 38, 60, 55][i],
}));

interface WeeklyRow {
    id: string;
    day: string;
    current: number;
    target: number;
    prior: number;
}
const weeklyTable: WeeklyRow[] = weekDays.map((day, i) => ({
    id: String(i),
    day: `${day}, Jul ${20 + i}`,
    current: weeklyRounds[i].Current,
    target: [20, 20, 25, 25, 40, 60, 55][i],
    prior: weeklyRounds[i]["Prior year"],
}));

/** Weekly Rounds — this week's rounds versus the prior-year week, by day and target. */
export const WeeklyRounds: Story = {
    name: "Rounds — Weekly",
    render: () => (
        <AppShell activeUrl="/reports/rounds/weekly">
            <PageHeader
                title="Weekly Rounds Report"
                subtitle="Jul 20 – Jul 26, 2026 vs. the prior-year week."
                action={
                    <div className="flex items-center gap-2">
                        <Button size="md" color="secondary" iconLeading={FlipBackward}>
                            Set targets
                        </Button>
                        <Button size="md" iconLeading={SearchLg}>
                            Run report
                        </Button>
                    </div>
                }
            />
            <div className="flex flex-col gap-6 p-6 lg:p-8">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <MetricCard title="Rounds this week" value="255" change={8.5} changeLabel="vs prior year" icon={Hash02} trendData={weeklyRounds.map((d) => ({ value: d.Current }))} />
                    <MetricCard title="Prior-year week" value="231" icon={CalendarDate} trendData={weeklyRounds.map((d) => ({ value: d["Prior year"] }))} />
                    <MetricCard title="Target attainment" value="102%" change={2.0} changeLabel="vs target" icon={PieChart03} />
                </div>

                <ChartCard
                    title="Rounds by day"
                    subtitle="Current week vs. prior year"
                    actions={<ChartLegend items={[{ label: "Current", color: CHART_SERIES[0] }, { label: "Prior year", color: CHART_SERIES[1] }]} />}
                >
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={weeklyRounds} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={2}>
                            <CartesianGrid stroke={CHART_INK.grid} vertical={false} />
                            <XAxis dataKey="day" {...axisProps} />
                            <YAxis {...axisProps} width={32} />
                            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                            <Bar dataKey="Current" fill={CHART_SERIES[0]} radius={[4, 4, 0, 0]} maxBarSize={22} />
                            <Bar dataKey="Prior year" fill={CHART_SERIES[1]} radius={[4, 4, 0, 0]} maxBarSize={22} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <TableCard.Root>
                    <TableCard.Header title="Sagamore (18 Hole)" description="Current week: Jul 20 – Jul 26, 2026" />
                    <Table aria-label="Weekly rounds">
                        <Table.Header>
                            <Table.Head label="Date" isRowHeader />
                            <Table.Head label="Rounds" className="w-28 text-right" />
                            <Table.Head label="Target" className="w-28 text-right" />
                            <Table.Head label="% of target" className="w-28 text-right" />
                            <Table.Head label="Prior year" className="w-28 text-right" />
                        </Table.Header>
                        <Table.Body items={weeklyTable}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary">{row.day}</Table.Cell>
                                    <Table.Cell className="text-right font-medium text-primary tabular-nums">{row.current}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.target}</Table.Cell>
                                    <Table.Cell className={`text-right tabular-nums ${row.current >= row.target ? "text-success-primary" : "text-error-primary"}`}>
                                        {Math.round((row.current / row.target) * 100)}%
                                    </Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.prior}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <div className="flex items-center justify-between gap-4 border-t border-secondary bg-secondary px-4 py-3 text-sm font-semibold text-primary">
                        <span>Week total</span>
                        <span className="tabular-nums">255 rounds · 102% of target</span>
                    </div>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ----------------------------------------------------------------------------------------------- */
/* Rounds — Monthly                                                                                */
/* ----------------------------------------------------------------------------------------------- */

const fiscalMonths = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const fy2025 = [5, 59, 74, 81, 8, 7, 11, 2, 4, 5, 41, 5];
const fy2026 = [12, 4, 2, 4, 7, 12, 28, 8, 25, 6, 2, 6];
const monthlyChart = fiscalMonths.map((month, i) => ({ month, "FY 2025": fy2025[i], "FY 2026": fy2026[i] }));

interface MonthlyRow {
    id: string;
    label: string;
    values: number[];
    fullYear: number;
    isDiff?: boolean;
    isHeader?: boolean;
    course?: string;
}

const monthlyRows: MonthlyRow[] = [
    { id: "h1", label: "Sagamore (9 Hole)", values: [], fullYear: 0, isHeader: true },
    { id: "1", label: "FY 2025", values: fy2025, fullYear: 302 },
    { id: "2", label: "FY 2026", values: fy2026, fullYear: 116 },
    { id: "3", label: "Diff (FY25 vs FY26)", values: fy2026.map((v, i) => v - fy2025[i]), fullYear: -186, isDiff: true },
    { id: "h2", label: "Sagamore (18 Hole)", values: [], fullYear: 0, isHeader: true },
    { id: "4", label: "FY 2025", values: [0, 21, 20, 3, 0, 0, 3, 0, 1, 2, 101, 0], fullYear: 151 },
    { id: "5", label: "FY 2026", values: [0, 4, 9, 2, 2, 10, 15, 13, 31, 7, 47, 29], fullYear: 169 },
    { id: "6", label: "Diff (FY25 vs FY26)", values: [0, -17, -11, -1, 2, 10, 12, 13, 30, 5, -54, 29], fullYear: 18, isDiff: true },
];

/** Monthly Rounds — fiscal-year round counts by month, with year-over-year comparison. */
export const MonthlyRounds: Story = {
    name: "Rounds — Monthly",
    render: () => (
        <AppShell activeUrl="/reports/rounds/monthly">
            <PageHeader
                title="Monthly Rounds Report"
                subtitle="Rounds by month across fiscal years (July – June)."
                action={
                    <div className="flex items-center gap-2">
                        <div className="w-40">
                            <Select label="Fiscal year" placeholder="FY 2027" items={[{ id: "2027", label: "FY 2027" }, { id: "2026", label: "FY 2026" }, { id: "2025", label: "FY 2025" }]}>
                                {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                            </Select>
                        </div>
                        <Button size="md" iconLeading={SearchLg}>
                            Run report
                        </Button>
                    </div>
                }
            />
            <div className="flex flex-col gap-6 p-6 lg:p-8">
                <ChartCard
                    title="Sagamore (9 Hole) — rounds by month"
                    subtitle="FY 2025 vs FY 2026"
                    actions={<ChartLegend items={[{ label: "FY 2025", color: CHART_SERIES[0] }, { label: "FY 2026", color: CHART_SERIES[1] }]} />}
                >
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={monthlyChart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                            <CartesianGrid stroke={CHART_INK.grid} vertical={false} />
                            <XAxis dataKey="month" {...axisProps} />
                            <YAxis {...axisProps} width={32} />
                            <Tooltip content={<ChartTooltip />} cursor={{ stroke: CHART_INK.axis }} />
                            <Line type="monotone" dataKey="FY 2025" stroke={CHART_SERIES[0]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                            <Line type="monotone" dataKey="FY 2026" stroke={CHART_SERIES[1]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <TableCard.Root className="overflow-x-auto">
                    <Table aria-label="Monthly rounds">
                        <Table.Header>
                            <Table.Head label="Fiscal year" isRowHeader className="w-44" />
                            {fiscalMonths.map((m) => (
                                <Table.Head key={m} label={m} className="text-right" />
                            ))}
                            <Table.Head label="Full year" className="text-right" />
                        </Table.Header>
                        <Table.Body items={monthlyRows}>
                            {(row) =>
                                row.isHeader ? (
                                    <Table.Row id={row.id} className="bg-secondary">
                                        <Table.Cell className="font-semibold text-brand-secondary">{row.label}</Table.Cell>
                                        {fiscalMonths.map((m) => (
                                            <Table.Cell key={m} />
                                        ))}
                                        <Table.Cell />
                                    </Table.Row>
                                ) : (
                                    <Table.Row id={row.id}>
                                        <Table.Cell className={row.isDiff ? "text-tertiary italic" : "font-medium text-primary"}>{row.label}</Table.Cell>
                                        {row.values.map((v, i) => (
                                            <Table.Cell
                                                key={i}
                                                className={`text-right tabular-nums ${row.isDiff ? (v < 0 ? "text-error-primary" : v > 0 ? "text-success-primary" : "text-tertiary") : "text-secondary"}`}
                                            >
                                                {v}
                                            </Table.Cell>
                                        ))}
                                        <Table.Cell
                                            className={`text-right font-medium tabular-nums ${row.isDiff ? (row.fullYear < 0 ? "text-error-primary" : "text-success-primary") : "text-primary"}`}
                                        >
                                            {row.fullYear}
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            }
                        </Table.Body>
                    </Table>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

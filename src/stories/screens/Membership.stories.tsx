import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
    AlertTriangle,
    ArrowLeft,
    ArrowRight,
    CreditCardX,
    Download01,
    FilterLines,
    HelpCircle,
    Hourglass03,
    Plus,
    RefreshCw02,
    SearchLg,
    SlashCircle01,
    Tag01,
    Trash01,
    Users01,
} from "@untitledui/icons";
import { AppShell } from "@/components/application/app-navigation/app-shell";
import { PageHeader } from "@/components/application/screen-kit";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";

const meta = {
    title: "App Screens/Membership",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;


/** Company scope chips reused across Members and Member Report. */
const COMPANIES = ["Sample Company", "Schule Oaks", "Bushwood Country Club", "Sagamore Spring GC"];
const CompanyChips = () => (
    <div className="flex flex-wrap gap-2">
        {COMPANIES.map((company, i) => (
            <button
                key={company}
                type="button"
                className={
                    i === 3
                        ? "rounded-full bg-brand-solid px-3 py-1.5 text-sm font-medium text-white"
                        : "rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-secondary ring-1 ring-secondary ring-inset hover:bg-primary_hover"
                }
            >
                {company}
            </button>
        ))}
    </div>
);

/* ------------------------------------------------------------------ */
/* 1. Memberships — plan / tier catalog                                */
/* ------------------------------------------------------------------ */

interface Plan {
    id: string;
    pmid: string;
    gcpid: string;
    glCode: string;
    title: string;
    minType: string;
    minCharges: string;
    hardExp: string;
    expMonths: number;
    price: string;
    tax: string;
    fees: string;
    total: string;
}

const plans: Plan[] = [
    { id: "111", pmid: "111", gcpid: "3975", glCode: "Memberships", title: "Founders Unlimited", minType: "—", minCharges: "—", hardExp: "—", expMonths: 0, price: "$86.96", tax: "$6.32", fees: "$0.00", total: "$98.50" },
    { id: "112", pmid: "112", gcpid: "3976", glCode: "Memberships", title: "Gold Punch Membership", minType: "Food & Beverage", minCharges: "$200.00", hardExp: "—", expMonths: 1, price: "$0.90", tax: "$0.07", fees: "$0.00", total: "$0.97" },
    { id: "113", pmid: "113", gcpid: "3977", glCode: "Memberships", title: "Monthly Silver", minType: "—", minCharges: "—", hardExp: "—", expMonths: 1, price: "$97.09", tax: "$0.00", fees: "$2.91", total: "$100.00" },
    { id: "146", pmid: "146", gcpid: "4280", glCode: "Memberships", title: "Weekday Player", minType: "—", minCharges: "—", hardExp: "—", expMonths: 12, price: "$540.00", tax: "$39.20", fees: "$0.00", total: "$579.20" },
    { id: "166", pmid: "166", gcpid: "4480", glCode: "Memberships", title: "Monthly Membership", minType: "Food & Beverage", minCharges: "$100.00", hardExp: "—", expMonths: 1, price: "$500.00", tax: "$36.33", fees: "$0.00", total: "$536.33" },
    { id: "1234", pmid: "1234", gcpid: "6761", glCode: "Memberships", title: "Rewards Membership", minType: "—", minCharges: "—", hardExp: "—", expMonths: 12, price: "$100.00", tax: "$8.25", fees: "$3.00", total: "$111.25" },
    { id: "1567", pmid: "1567", gcpid: "19626", glCode: "Memberships", title: "Par Membership", minType: "Food, Beverage & Alcohol", minCharges: "$1,000.00", hardExp: "—", expMonths: 12, price: "$100.00", tax: "$7.26", fees: "$0.00", total: "$107.26" },
    { id: "1568", pmid: "1568", gcpid: "19627", glCode: "Memberships", title: "Birdie Membership", minType: "—", minCharges: "—", hardExp: "Feb 19, 2027", expMonths: 0, price: "$1,200.00", tax: "$87.18", fees: "$0.00", total: "$1,287.18" },
    { id: "1569", pmid: "1569", gcpid: "19628", glCode: "Memberships", title: "Eagle Membership", minType: "Food, Beverage & Alcohol", minCharges: "$500.00", hardExp: "—", expMonths: 1, price: "$250.00", tax: "$18.16", fees: "$0.00", total: "$268.16" },
    { id: "1641", pmid: "1641", gcpid: "20770", glCode: "Memberships", title: "Season Pass Holder 1yr", minType: "All Purchases", minCharges: "$100.00", hardExp: "Sep 30, 2026", expMonths: 12, price: "$1,900.00", tax: "$138.01", fees: "$0.00", total: "$2,038.01" },
    { id: "2101", pmid: "2101", gcpid: "58438", glCode: "Memberships", title: "Corporate Discounts", minType: "—", minCharges: "—", hardExp: "—", expMonths: 12, price: "$200.00", tax: "$14.53", fees: "$0.00", total: "$214.53" },
    { id: "2172", pmid: "2172", gcpid: "60897", glCode: "22334", title: "Fox Meadows Trail", minType: "All Purchases", minCharges: "$1.00", hardExp: "—", expMonths: 1, price: "$125.00", tax: "$9.07", fees: "$0.00", total: "$134.07" },
    { id: "2588", pmid: "2588", gcpid: "73259", glCode: "Memberships", title: "Limited Member", minType: "—", minCharges: "—", hardExp: "—", expMonths: 12, price: "$999.00", tax: "$72.53", fees: "$0.00", total: "$1,071.53" },
    { id: "2724", pmid: "2724", gcpid: "78339", glCode: "Memberships", title: "Quarterly Minimum", minType: "Food, Beverage & Alcohol", minCharges: "$250.00", hardExp: "Dec 31, 2026", expMonths: 0, price: "$300.00", tax: "$21.78", fees: "$0.00", total: "$321.78" },
];

/** Memberships — the membership plan catalog with pricing, minimums, and expiration rules. */
export const Memberships: Story = {
    render: () => (
        <AppShell activeUrl="/membership/memberships">
            <PageHeader
                title="Memberships"
                subtitle="Plan tiers members can be enrolled in, with pricing and renewal rules."
                action={
                    <Button iconLeading={Plus} size="md">
                        New membership
                    </Button>
                }
            />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input size="sm" aria-label="Search memberships" placeholder="Search" icon={SearchLg} wrapperClassName="sm:w-80" />
                        <div className="flex items-center gap-2">
                            <Button size="sm" color="secondary" iconLeading={FilterLines}>
                                Filters
                            </Button>
                            <Button size="sm" color="secondary" iconLeading={Download01}>
                                Export
                            </Button>
                        </div>
                    </div>
                    <Table aria-label="Memberships">
                        <Table.Header>
                            <Table.Head label="PMID" isRowHeader className="w-20" />
                            <Table.Head label="Title" />
                            <Table.Head label="Min. type" />
                            <Table.Head label="Min. charges" className="w-32 text-right" />
                            <Table.Head label="Hard exp." className="w-32" />
                            <Table.Head label="Exp. months" className="w-24 text-right" />
                            <Table.Head label="Price" className="w-28 text-right" />
                            <Table.Head label="Total" className="w-28 text-right" />
                            <Table.Head label="" className="w-14" />
                        </Table.Header>
                        <Table.Body items={plans}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary tabular-nums">{row.pmid}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-primary">{row.title}</span>
                                            <span className="text-xs text-quaternary tabular-nums">GL {row.glCode}</span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {row.minType === "—" ? (
                                            <span className="text-quaternary">—</span>
                                        ) : (
                                            <Badge size="sm" type="pill-color" color="gray">
                                                {row.minType}
                                            </Badge>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.minCharges}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.hardExp}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.expMonths}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.price}</Table.Cell>
                                    <Table.Cell className="text-right font-medium text-primary tabular-nums">{row.total}</Table.Cell>
                                    <Table.Cell>
                                        <Button size="sm" color="link-gray" iconLeading={Trash01} aria-label="Delete membership" className="text-fg-quaternary" />
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <div className="flex items-center justify-between gap-4 border-t border-secondary px-4 py-3">
                        <Button size="sm" color="secondary" iconLeading={ArrowLeft}>
                            Previous
                        </Button>
                        <span className="text-sm text-tertiary">Page 1 of 3</span>
                        <Button size="sm" color="secondary" iconTrailing={ArrowRight}>
                            Next
                        </Button>
                    </div>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ------------------------------------------------------------------ */
/* 2. Members — enrolled member roster                                 */
/* ------------------------------------------------------------------ */

interface Member {
    id: string;
    memberNo: string;
    gcc: string;
    name: string;
    contact: string;
    membership: string;
    price: string;
    source: string;
    autoRenew: boolean;
    charged: string;
    joined: string;
}

const members: Member[] = [
    { id: "44688", memberNo: "44688", gcc: "479450", name: "Sawyer Pearson", contact: "sawyer.pearson@sagamore.golf", membership: "Founders Unlimited", price: "$86.96", source: "None", autoRenew: false, charged: "—", joined: "Feb 24, 2025" },
    { id: "95716", memberNo: "95716", gcc: "1603934", name: "Pappan Brennevin", contact: "matt.jensen+pappan@sagamore.golf", membership: "Gold Punch Membership", price: "$0.90", source: "None", autoRenew: true, charged: "Jun 30, 2026", joined: "Mar 31, 2026" },
    { id: "70951", memberNo: "70951", gcc: "1349321", name: "Aric Zuberbier", contact: "(920) 850-0680", membership: "Gold Punch Membership", price: "$0.90", source: "None", autoRenew: true, charged: "Jun 30, 2026", joined: "Feb 11, 2026" },
    { id: "100233", memberNo: "100233", gcc: "1110243", name: "Barett Henry", contact: "(409) 599-9683", membership: "Gold Punch Membership", price: "$0.90", source: "None", autoRenew: true, charged: "Jun 30, 2026", joined: "May 04, 2026" },
    { id: "50395", memberNo: "50395", gcc: "710250", name: "Gordon Meyer", contact: "gordon.meyer@sagamore.golf", membership: "Gold Punch Membership", price: "$0.90", source: "None", autoRenew: true, charged: "—", joined: "Apr 01, 2025" },
    { id: "50785", memberNo: "50785", gcc: "311490", name: "Rickie Hindbaugh", contact: "(810) 931-6168", membership: "Par Membership", price: "$107.26", source: "Discover • 6848", autoRenew: false, charged: "—", joined: "Apr 01, 2025" },
    { id: "38920", memberNo: "38920", gcc: "292592", name: "Ayush Patel", contact: "(415) 555-2192", membership: "Eagle Membership", price: "$268.16", source: "Discover • 6736", autoRenew: true, charged: "Jun 30, 2026", joined: "Aug 07, 2024" },
    { id: "38716", memberNo: "38716", gcc: "278448", name: "Priya Shah", contact: "(983) 013-8247", membership: "Season Pass Holder 1yr", price: "$2,038.01", source: "Card • 431", autoRenew: true, charged: "Jun 30, 2026", joined: "Jul 08, 2024" },
];

/** Members — the enrolled member roster, scoped by course, with plan, billing source, and renewal status. */
export const Members: Story = {
    render: () => (
        <AppShell activeUrl="/membership/members">
            <PageHeader
                title="Members"
                subtitle="Everyone currently enrolled in a membership plan."
                action={
                    <div className="flex items-center gap-2">
                        <Button color="secondary" size="md">
                            Bulk order
                        </Button>
                        <Button iconLeading={Plus} size="md">
                            New member
                        </Button>
                    </div>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                <CompanyChips />
                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input size="sm" aria-label="Search members" placeholder="Search" icon={SearchLg} wrapperClassName="sm:w-80" />
                        <div className="flex items-center gap-2">
                            <Button size="sm" color="secondary" iconLeading={FilterLines}>
                                Filters
                            </Button>
                            <Button size="sm" color="secondary" iconLeading={Download01}>
                                Export
                            </Button>
                        </div>
                    </div>
                    <Table aria-label="Members">
                        <Table.Header>
                            <Table.Head label="Member #" isRowHeader className="w-24" />
                            <Table.Head label="GCC #" className="w-24" />
                            <Table.Head label="Member" />
                            <Table.Head label="Membership" />
                            <Table.Head label="Price" className="w-28 text-right" />
                            <Table.Head label="Source" className="w-36" />
                            <Table.Head label="Auto-renew" className="w-32" />
                            <Table.Head label="Charged" className="w-32" />
                            <Table.Head label="Joined" className="w-32" />
                        </Table.Header>
                        <Table.Body items={members}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary tabular-nums">{row.memberNo}</Table.Cell>
                                    <Table.Cell className="tabular-nums text-brand-secondary">{row.gcc}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-primary">{row.name}</span>
                                            <span className="text-xs text-tertiary">{row.contact}</span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.membership}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.price}</Table.Cell>
                                    <Table.Cell className={row.source === "None" ? "text-quaternary" : "text-brand-secondary"}>{row.source}</Table.Cell>
                                    <Table.Cell>
                                        {row.autoRenew ? (
                                            <BadgeWithDot size="sm" type="pill-color" color="success">
                                                On
                                            </BadgeWithDot>
                                        ) : (
                                            <BadgeWithDot size="sm" type="pill-color" color="gray">
                                                Off
                                            </BadgeWithDot>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.charged}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.joined}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <div className="flex items-center justify-between gap-4 border-t border-secondary px-4 py-3">
                        <Button size="sm" color="secondary" iconLeading={ArrowLeft}>
                            Previous
                        </Button>
                        <span className="text-sm text-tertiary">Page 1 of 71</span>
                        <Button size="sm" color="secondary" iconTrailing={ArrowRight}>
                            Next
                        </Button>
                    </div>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ------------------------------------------------------------------ */
/* 3. Member Report — membership health audit                          */
/* ------------------------------------------------------------------ */

type StatColor = "brand" | "success" | "error" | "warning" | "gray";

const statColorMap: Record<StatColor, { value: string; ring: string; iconBg: string; iconFg: string }> = {
    brand: { value: "text-brand-secondary", ring: "ring-secondary", iconBg: "bg-brand-secondary", iconFg: "text-fg-brand-primary" },
    success: { value: "text-success-primary", ring: "ring-secondary", iconBg: "bg-success-secondary", iconFg: "text-fg-success-primary" },
    error: { value: "text-error-primary", ring: "ring-error_subtle", iconBg: "bg-error-secondary", iconFg: "text-fg-error-primary" },
    warning: { value: "text-warning-primary", ring: "ring-secondary", iconBg: "bg-warning-secondary", iconFg: "text-fg-warning-primary" },
    gray: { value: "text-primary", ring: "ring-secondary", iconBg: "bg-secondary", iconFg: "text-fg-quaternary" },
};

const SummaryTile = ({ title, value, color = "gray" }: { title: string; value: string; color?: StatColor }) => (
    <div className="flex flex-col gap-1.5 rounded-xl bg-primary p-4 ring-1 ring-secondary ring-inset">
        <p className="text-sm font-medium text-tertiary">{title}</p>
        <p className={`text-display-xs font-semibold tabular-nums ${statColorMap[color].value}`}>{value}</p>
    </div>
);

interface AuditRow {
    id: string;
    icon: React.ComponentType<React.HTMLAttributes<HTMLOrSVGElement>>;
    label: string;
    count: number;
    description: string;
    color: StatColor;
    highlight?: boolean;
}

const needsAttention: AuditRow[] = [
    { id: "expired-active", icon: SlashCircle01, label: "Expired but Active", count: 371, color: "error", highlight: true, description: "Active/not-set members whose membership has lapsed and who have NOT been re-signed into a current membership — a likely failed renewal." },
    { id: "wont-renew", icon: RefreshCw02, label: "Won't Auto-Renew", count: 392, color: "warning", description: "Active members with auto-renew turned off — they'll expire silently." },
    { id: "resigned-not-expired", icon: Users01, label: "Resigned but Not Expired", count: 0, color: "gray", description: "Resigned members whose expiration date is still today or later — they retain access." },
    { id: "resigned-auto", icon: AlertTriangle, label: "Resigned but Auto-Renew On", count: 2, color: "warning", description: "Resigned members still set to auto-renew — a likely billing risk." },
    { id: "inactive-other", icon: HelpCircle, label: "Inactive / Other", count: 4, color: "brand", description: "Members whose status isn't Active/Not-set or Resigned." },
    { id: "card-expired", icon: CreditCardX, label: "Card on File Expired / Expiring", count: 5, color: "error", description: "Current, active members whose card on file is expired or expires within 2 months." },
];

const horizon: AuditRow[] = [
    { id: "h-30", icon: Hourglass03, label: "Expiring in ≤30 days", count: 49, color: "success", description: "Active members expiring within the next 30 days." },
    { id: "h-60", icon: Hourglass03, label: "Expiring in 31–60 days", count: 0, color: "gray", description: "Active members expiring 31–60 days out." },
    { id: "h-90", icon: Hourglass03, label: "Expiring in 61–90 days", count: 3, color: "brand", description: "Active members expiring 61–90 days out." },
    { id: "h-90p", icon: Hourglass03, label: "Expiring in 90+ days", count: 56, color: "gray", description: "Active members whose expiration is more than 90 days out." },
];

const AuditCard = ({ row }: { row: AuditRow }) => {
    const c = statColorMap[row.color];
    return (
        <div className={`flex items-start gap-3 rounded-xl bg-primary p-4 ring-1 ring-inset ${row.highlight ? "ring-error" : c.ring}`}>
            <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${c.iconBg}`}>
                <row.icon className={`size-5 ${c.iconFg}`} aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-secondary">{row.label}</p>
                <p className={`text-display-xs font-semibold tabular-nums ${c.value}`}>{row.count}</p>
            </div>
        </div>
    );
};

const AuditListRow = ({ row }: { row: AuditRow }) => {
    const c = statColorMap[row.color];
    return (
        <div className="flex items-center gap-4 border-b border-secondary px-4 py-3.5 last:border-b-0">
            <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${c.iconBg}`}>
                <row.icon className={`size-4.5 ${c.iconFg}`} aria-hidden="true" />
            </span>
            <div className="flex min-w-0 items-center gap-2.5">
                <span className="text-sm font-semibold text-primary">{row.label}</span>
                <Badge size="sm" type="pill-color" color={row.color === "gray" ? "gray" : row.color === "brand" ? "brand" : row.color === "success" ? "success" : row.color === "warning" ? "warning" : "error"}>
                    {row.count}
                </Badge>
            </div>
            <p className="ml-auto hidden max-w-2xl text-sm text-tertiary lg:block">{row.description}</p>
        </div>
    );
};

/** Member Report — an at-a-glance audit of membership health with needs-attention and expiration-horizon groupings. */
export const MemberReport: Story = {
    name: "Member Report",
    render: () => (
        <AppShell activeUrl="/membership/member-report">
            <PageHeader
                title="Member Report"
                subtitle="An at-a-glance audit of membership health — each group collects members that may need attention."
                action={
                    <div className="flex items-center gap-2">
                        <Button color="link-color" size="md">
                            Expand all
                        </Button>
                        <Button color="secondary" iconLeading={RefreshCw02} size="md">
                            Refresh
                        </Button>
                    </div>
                }
            />
            <div className="flex flex-col gap-6 p-6 lg:p-8">
                {/* Scope */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-sm text-tertiary">
                        <span className="inline-flex items-center gap-1.5">
                            <Tag01 className="size-4 text-fg-quaternary" aria-hidden="true" />
                            All membership types
                        </span>
                        <span className="text-quaternary">·</span>
                        <span>Scope: 1 course · as of 7/24/2026 9:30 AM</span>
                    </div>
                    <CompanyChips />
                </div>

                {/* Summary tiles */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <SummaryTile title="Total members" value="564" color="gray" />
                    <SummaryTile title="Active" value="538" color="success" />
                    <SummaryTile title="Resigned" value="22" color="error" />
                    <SummaryTile title="Inactive / Other" value="4" color="brand" />
                </div>

                {/* Needs attention */}
                <div className="flex flex-col gap-3">
                    <h2 className="text-sm font-semibold text-secondary">Needs attention</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {needsAttention.map((row) => (
                            <AuditCard key={row.id} row={row} />
                        ))}
                    </div>
                    <TableCard.Root>
                        {needsAttention.map((row) => (
                            <AuditListRow key={row.id} row={row} />
                        ))}
                    </TableCard.Root>
                </div>

                {/* Expiration horizon */}
                <div className="flex flex-col gap-3">
                    <h2 className="text-sm font-semibold text-secondary">
                        Expiration horizon <span className="font-normal text-tertiary">— active members by time until expiration</span>
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {horizon.map((row) => (
                            <AuditCard key={row.id} row={row} />
                        ))}
                    </div>
                    <TableCard.Root>
                        {horizon.map((row) => (
                            <AuditListRow key={row.id} row={row} />
                        ))}
                    </TableCard.Root>
                </div>
            </div>
        </AppShell>
    ),
};

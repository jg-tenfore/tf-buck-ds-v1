import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
    ArrowRight,
    Bell01,
    Building06,
    Calendar,
    CheckCircle,
    CreditCard01,
    Download01,
    Edit01,
    File02,
    FilterLines,
    Image01,
    InfoCircle,
    Link01,
    Package,
    Percent02,
    Plus,
    Printer,
    RefreshCcw01,
    SearchLg,
    Settings01,
    Tablet01,
    ChevronDown,
} from "@untitledui/icons";
import { AppShell } from "@/components/application/app-navigation/app-shell";
import { PageHeader } from "@/components/application/screen-kit";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { CourseDashboard } from "@/components/application/dashboard/course-dashboard";
import { Input } from "@/components/base/input/input";

const meta = {
    title: "App Screens/My Golf Course",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;


/* ------------------------------------------------------------------ */
/* Dashboard — reuses the existing course dashboard component.         */
/* ------------------------------------------------------------------ */

export const Dashboard: Story = {
    render: () => (
        <AppShell activeUrl="/my-golf-course/dashboard">
            <CourseDashboard />
        </AppShell>
    ),
};

/* ------------------------------------------------------------------ */
/* What's New — product release notes / changelog list.               */
/* ------------------------------------------------------------------ */

interface ReleaseNote {
    id: string;
    product: "Buck" | "Birdie" | "Crane" | "Fox" | "Jackrabbit";
    productColor: "brand" | "success" | "blue" | "orange" | "purple";
    type: "New" | "Improved" | "Fixed";
    title: string;
    description: string;
    date: string;
}

const releaseNotes: ReleaseNote[] = [
    {
        id: "1",
        product: "Buck",
        productColor: "brand",
        type: "New",
        title: "Year-over-year sales comparison on the dashboard",
        description: "Compare any two seasons side by side with the new revenue overlay chart, now the default view on My Golf Course.",
        date: "Jul 22, 2026",
    },
    {
        id: "2",
        product: "Fox",
        productColor: "orange",
        type: "Improved",
        title: "Faster tee-sheet loading on busy weekends",
        description: "The daily tee sheet now renders up to 3x quicker for courses with 200+ bookings a day.",
        date: "Jul 18, 2026",
    },
    {
        id: "3",
        product: "Birdie",
        productColor: "success",
        type: "New",
        title: "Kiosk check-in for walk-up players",
        description: "Members and public players can now check themselves in from the Birdie tablet at the pro shop counter.",
        date: "Jul 11, 2026",
    },
    {
        id: "4",
        product: "Crane",
        productColor: "blue",
        type: "Fixed",
        title: "QuickBooks account sync no longer times out",
        description: "Resolved an issue where large chart-of-accounts syncs could stall midway through for high-volume clubs.",
        date: "Jul 3, 2026",
    },
    {
        id: "5",
        product: "Jackrabbit",
        productColor: "purple",
        type: "Improved",
        title: "Cleaner department schedule editor",
        description: "Redesigned the weekly hours grid so Always Open, Always Closed, and Scheduled states are easier to switch between.",
        date: "Jun 27, 2026",
    },
];

const typeColor: Record<ReleaseNote["type"], "brand" | "blue" | "gray"> = {
    New: "brand",
    Improved: "blue",
    Fixed: "gray",
};

export const WhatsNew: Story = {
    name: "What's New",
    render: () => (
        <AppShell activeUrl="/my-golf-course/whats-new">
            <PageHeader
                title="What's New"
                subtitle="New features, improvements, and fixes across Birdie, Crane, Fox, Jackrabbit, and Buck."
                action={
                    <div className="flex items-center gap-2">
                        <Button size="md" color="secondary" iconLeading={FilterLines}>
                            Filter by product
                        </Button>
                    </div>
                }
            />
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-6 lg:p-8">
                {releaseNotes.map((note) => (
                    <div key={note.id} className="rounded-xl border border-secondary bg-primary p-5 shadow-xs">
                        <div className="flex flex-wrap items-center gap-2">
                            <BadgeWithDot size="sm" type="pill-color" color={note.productColor}>
                                {note.product}
                            </BadgeWithDot>
                            <Badge size="sm" type="pill-color" color={typeColor[note.type]}>
                                {note.type}
                            </Badge>
                            <span className="ml-auto text-sm text-tertiary">{note.date}</span>
                        </div>
                        <h3 className="mt-3 text-md font-semibold text-primary">{note.title}</h3>
                        <p className="mt-1 text-sm text-tertiary">{note.description}</p>
                    </div>
                ))}
            </div>
        </AppShell>
    ),
};

/* ------------------------------------------------------------------ */
/* Departments — weekly operating schedules per department.           */
/* ------------------------------------------------------------------ */

interface Department {
    id: string;
    name: string;
    status: "Always Open" | "Always Closed" | "Scheduled";
    hours: string;
    productsSold: number;
}

const departments: Department[] = [
    { id: "1", name: "Pro Shop", status: "Scheduled", hours: "6:00 AM – 8:00 PM", productsSold: 248 },
    { id: "2", name: "Restaurant", status: "Scheduled", hours: "7:00 AM – 9:00 PM", productsSold: 132 },
    { id: "3", name: "Online", status: "Always Open", hours: "24 hours", productsSold: 63 },
    { id: "4", name: "Carts", status: "Always Closed", hours: "Closed", productsSold: 31 },
    { id: "5", name: "Events", status: "Scheduled", hours: "By reservation", productsSold: 29 },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const statusBadge: Record<Department["status"], { color: "success" | "gray" | "brand"; label: string }> = {
    "Always Open": { color: "success", label: "Always Open" },
    "Always Closed": { color: "gray", label: "Always Closed" },
    Scheduled: { color: "brand", label: "Scheduled" },
};

export const Departments: Story = {
    render: () => (
        <AppShell activeUrl="/my-golf-course/departments">
            <PageHeader
                title="Department Schedules"
                subtitle="Set the operating hours that control when each department can take orders."
                action={
                    <Button iconLeading={Plus} size="md">
                        New department
                    </Button>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                {departments.map((dept) => {
                    const badge = statusBadge[dept.status];
                    return (
                        <div key={dept.id} className="rounded-xl border border-secondary bg-primary shadow-xs">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-secondary px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-md font-semibold text-primary">{dept.name}</h3>
                                    <BadgeWithDot size="sm" type="pill-color" color={badge.color}>
                                        {badge.label}
                                    </BadgeWithDot>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-tertiary">
                                        Products sold: <span className="font-medium text-secondary tabular-nums">{dept.productsSold}</span>
                                    </span>
                                    <Button size="sm" color="secondary" iconLeading={Edit01}>
                                        Edit hours
                                    </Button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4 lg:grid-cols-7">
                                {DAYS.map((day) => (
                                    <div key={day} className="rounded-lg bg-secondary px-3 py-2.5 text-center">
                                        <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">{day}</p>
                                        <p className="mt-1 text-sm font-medium text-secondary">{dept.status === "Always Closed" ? "Closed" : dept.hours}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </AppShell>
    ),
};

/* ------------------------------------------------------------------ */
/* Locations — course points of interest with coordinates.            */
/* ------------------------------------------------------------------ */

interface CourseLocation {
    id: string;
    description: string;
    course: string;
    hole: string;
    coordinates: string;
}

const locations: CourseLocation[] = [
    { id: "162", description: "Green", course: "Sagamore Spring GC", hole: "Hole 1", coordinates: "42.5261, -71.0642" },
    { id: "163", description: "Fairway", course: "Sagamore Spring GC", hole: "Hole 2", coordinates: "42.5268, -71.0651" },
    { id: "627", description: "Bar", course: "Sagamore Spring GC", hole: "Hole 1", coordinates: "42.5245, -71.0644" },
    { id: "801", description: "Halfway House", course: "Sagamore Spring GC", hole: "Hole 9", coordinates: "42.5279, -71.0688" },
    { id: "1235", description: "Picnic Table", course: "Sagamore Spring GC", hole: "General", coordinates: "42.5240, -71.0618" },
    { id: "1408", description: "Practice Green", course: "Sagamore Spring GC", hole: "General", coordinates: "42.5233, -71.0609" },
];

export const Locations: Story = {
    render: () => (
        <AppShell activeUrl="/my-golf-course/locations">
            <PageHeader
                title="Locations"
                subtitle="Points of interest across the course, mapped to holes and coordinates."
                action={
                    <Button iconLeading={Plus} size="md">
                        New location
                    </Button>
                }
            />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input size="sm" aria-label="Search locations" placeholder="Search" icon={SearchLg} wrapperClassName="sm:w-80" />
                        <Button size="sm" color="secondary" iconLeading={Download01}>
                            Export
                        </Button>
                    </div>
                    <Table aria-label="Locations">
                        <Table.Header>
                            <Table.Head label="ID" isRowHeader className="w-24" />
                            <Table.Head label="Description" />
                            <Table.Head label="Golf course" />
                            <Table.Head label="Hole" className="w-28" />
                            <Table.Head label="Coordinates" className="w-56" />
                            <Table.Head label="" className="w-20" />
                        </Table.Header>
                        <Table.Body items={locations}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary tabular-nums">{row.id}</Table.Cell>
                                    <Table.Cell className="font-medium text-primary">{row.description}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.course}</Table.Cell>
                                    <Table.Cell>
                                        <Badge size="sm" type="pill-color" color="gray">
                                            {row.hole}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div className="flex flex-col">
                                            <span className="tabular-nums text-secondary">{row.coordinates}</span>
                                            <Button color="link-color" size="sm" className="w-max">
                                                View on maps
                                            </Button>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button color="tertiary" size="sm" iconLeading={Edit01} aria-label={`Edit ${row.description}`} />
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ------------------------------------------------------------------ */
/* Settings — collapsible sections of golf-course configuration.      */
/* ------------------------------------------------------------------ */

interface SettingSection {
    id: string;
    label: string;
    description: string;
    icon: typeof InfoCircle;
}

const settingSections: SettingSection[] = [
    { id: "main", label: "Main Info", description: "Course name, contact details, and address", icon: InfoCircle },
    { id: "links", label: "Links", description: "Website, booking, and social links", icon: Link01 },
    { id: "subcourses", label: "Sub-courses", description: "Front nine, back nine, and executive layouts", icon: Building06 },
    { id: "taxes", label: "Taxes & Fees", description: "Tax rates and surcharges applied at checkout", icon: Percent02 },
    { id: "payments", label: "Payments", description: "Accepted tenders and processor configuration", icon: CreditCard01 },
    { id: "booking", label: "Booking Engine", description: "Online tee-time rules and availability windows", icon: Calendar },
    { id: "notifications", label: "Notifications", description: "Email and SMS confirmations sent to players", icon: Bell01 },
    { id: "tablets", label: "Tablets", description: "Registered pro-shop and starter devices", icon: Tablet01 },
    { id: "printers", label: "Printers", description: "Receipt and kitchen ticket printers", icon: Printer },
    { id: "images", label: "Images", description: "Logo, hero, and gallery imagery", icon: Image01 },
    { id: "documents", label: "Documents", description: "Waivers, policies, and uploaded files", icon: File02 },
    { id: "events", label: "Events", description: "Default event booking and deposit rules", icon: Package },
];

export const Settings: Story = {
    render: () => (
        <AppShell activeUrl="/my-golf-course/settings">
            <PageHeader
                title="Golf Course Settings"
                subtitle="Configure how Sagamore Spring Golf Club operates across booking, payments, and hardware."
                action={
                    <Button size="md" iconLeading={CheckCircle}>
                        Save changes
                    </Button>
                }
            />
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 p-6 lg:p-8">
                {settingSections.map((section) => (
                    <button
                        key={section.id}
                        type="button"
                        className="flex items-center gap-4 rounded-xl border border-secondary bg-primary p-4 text-left shadow-xs transition duration-100 ease-linear hover:bg-primary_hover"
                    >
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-fg-secondary">
                            <section.icon className="size-5" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-primary">{section.label}</span>
                            <span className="block text-sm text-tertiary">{section.description}</span>
                        </span>
                        <ChevronDown className="size-5 shrink-0 text-fg-quaternary" aria-hidden="true" />
                    </button>
                ))}
            </div>
        </AppShell>
    ),
};

/* ------------------------------------------------------------------ */
/* Integrations — connected apps + QuickBooks account sync.           */
/* ------------------------------------------------------------------ */

interface Integration {
    id: string;
    name: string;
    description: string;
    connected: boolean;
    initials: string;
}

const integrations: Integration[] = [
    { id: "qb", name: "QuickBooks Online", description: "Sync sales, payouts, and chart of accounts to your ledger.", connected: true, initials: "QB" },
    { id: "gnow", name: "GolfNow", description: "Publish tee-time inventory to the GolfNow marketplace.", connected: true, initials: "GN" },
    { id: "mailchimp", name: "Mailchimp", description: "Send member campaigns and sync marketing audiences.", connected: false, initials: "MC" },
    { id: "stripe", name: "Stripe", description: "Process online deposits and card-not-present payments.", connected: false, initials: "ST" },
];

interface QbAccount {
    id: string;
    number: string;
    name: string;
    updated: string;
}

const qbAccounts: QbAccount[] = [
    { id: "1", number: "000033", name: "Accounts Payable (A/P)", updated: "Feb 24, 2026 07:52 PM" },
    { id: "2", number: "000084", name: "Accounts Receivable (A/R)", updated: "Feb 24, 2026 07:52 PM" },
    { id: "3", number: "000007", name: "Advertising", updated: "Feb 24, 2026 07:52 PM" },
    { id: "4", number: "000035", name: "Checking", updated: "Feb 24, 2026 07:52 PM" },
    { id: "5", number: "000080", name: "Cost of Goods Sold", updated: "Feb 24, 2026 07:52 PM" },
    { id: "6", number: "000086", name: "Discounts given", updated: "Feb 24, 2026 07:52 PM" },
    { id: "7", number: "000081", name: "Inventory Asset", updated: "Feb 24, 2026 07:52 PM" },
    { id: "8", number: "000045", name: "Landscaping Services", updated: "Feb 24, 2026 07:52 PM" },
];

export const Integrations: Story = {
    render: () => (
        <AppShell activeUrl="/my-golf-course/integrations">
            <PageHeader
                title="Integrations"
                subtitle="Connect Sagamore Spring to the tools that keep your back office in sync."
                action={
                    <Button size="md" color="secondary" iconLeading={SearchLg}>
                        Browse all
                    </Button>
                }
            />
            <div className="flex flex-col gap-6 p-6 lg:p-8">
                {/* Integration cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {integrations.map((app) => (
                        <div key={app.id} className="flex flex-col rounded-xl border border-secondary bg-primary p-5 shadow-xs">
                            <div className="flex items-start justify-between gap-3">
                                <span className="flex size-11 items-center justify-center rounded-lg bg-secondary text-sm font-semibold text-secondary">
                                    {app.initials}
                                </span>
                                {app.connected ? (
                                    <BadgeWithDot size="sm" type="pill-color" color="success">
                                        Connected
                                    </BadgeWithDot>
                                ) : (
                                    <Badge size="sm" type="pill-color" color="gray">
                                        Not connected
                                    </Badge>
                                )}
                            </div>
                            <h3 className="mt-4 text-md font-semibold text-primary">{app.name}</h3>
                            <p className="mt-1 flex-1 text-sm text-tertiary">{app.description}</p>
                            <div className="mt-4">
                                {app.connected ? (
                                    <Button size="sm" color="secondary" iconLeading={Settings01} className="w-full">
                                        Manage
                                    </Button>
                                ) : (
                                    <Button size="sm" iconLeading={Plus} className="w-full">
                                        Connect
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* QuickBooks account sync table */}
                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2.5">
                            <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-sm font-semibold text-secondary">QB</span>
                            <div>
                                <p className="text-sm font-semibold text-primary">QuickBooks Accounts</p>
                                <p className="text-sm text-tertiary">Last synced Feb 24, 2026 · 96 accounts mapped</p>
                            </div>
                        </div>
                        <Button size="sm" iconLeading={RefreshCcw01}>
                            Connect &amp; sync
                        </Button>
                    </div>
                    <Table aria-label="QuickBooks accounts">
                        <Table.Header>
                            <Table.Head label="#" isRowHeader className="w-32" />
                            <Table.Head label="Name" />
                            <Table.Head label="Last updated" className="w-64" />
                        </Table.Header>
                        <Table.Body items={qbAccounts}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary tabular-nums">{row.number}</Table.Cell>
                                    <Table.Cell className="text-secondary">{row.name}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.updated}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <div className="flex items-center justify-between gap-4 border-t border-secondary px-4 py-3">
                        <span className="text-sm text-tertiary">Showing 8 of 96 accounts</span>
                        <Button size="sm" color="link-color" iconTrailing={ArrowRight}>
                            View all
                        </Button>
                    </div>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

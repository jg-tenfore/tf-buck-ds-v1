import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDate,
    Clock,
    CurrencyDollar,
    Download01,
    FilterLines,
    MessageSquare01,
    Plus,
    SearchLg,
} from "@untitledui/icons";
import { AppShell } from "@/components/application/app-navigation/app-shell";
import { PageHeader } from "@/components/application/screen-kit";
import { MetricCard } from "@/components/application/metrics/metric-card";
import { Table, TableCard } from "@/components/application/table/table";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import type { BadgeColor } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";

const meta = {
    title: "App Screens/Employees",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;


/* ------------------------------------------------------------------ */
/* Employees list                                                      */
/* ------------------------------------------------------------------ */

type AuthRole = "Course Owner" | "Course Admin" | "Course Accountant" | "Instructor" | "Employee" | "TenFore Admin" | "Customer";

const authBadgeColor: Record<AuthRole, BadgeColor<"pill-color">> = {
    "Course Owner": "purple",
    "Course Admin": "brand",
    "Course Accountant": "indigo",
    Instructor: "blue",
    Employee: "gray",
    "TenFore Admin": "orange",
    Customer: "success",
};

interface Employee {
    id: string;
    name: string;
    email: string;
    auth: AuthRole;
    phone?: string;
    pin: string;
    lastActivity: string;
    avatar?: string;
}

const employees: Employee[] = [
    { id: "1", name: "Rachel Donovan", email: "rachel.donovan@sagamoregolf.com", auth: "Course Owner", phone: "(781) 555-0142", pin: "1704", lastActivity: "Jul 24, 2026 10:26 AM", avatar: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80" },
    { id: "2", name: "Marcus Bennett", email: "marcus.bennett@sagamoregolf.com", auth: "Course Admin", phone: "(781) 555-0188", pin: "4411", lastActivity: "Jul 24, 2026 9:12 AM", avatar: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80" },
    { id: "3", name: "Priya Nair", email: "priya.nair@sagamoregolf.com", auth: "Course Accountant", pin: "0919", lastActivity: "Jul 23, 2026 4:49 PM", avatar: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80" },
    { id: "4", name: "Sean O'Malley", email: "sean.omalley@sagamoregolf.com", auth: "Instructor", phone: "(781) 555-8995", pin: "6633", lastActivity: "Jul 23, 2026 2:05 PM" },
    { id: "5", name: "Dana Lee", email: "dana.lee@sagamoregolf.com", auth: "Employee", phone: "(617) 555-0199", pin: "9988", lastActivity: "Jul 24, 2026 6:58 AM", avatar: "https://www.untitledui.com/images/avatars/candice-wu?fm=webp&q=80" },
    { id: "6", name: "James Park", email: "james.park@sagamoregolf.com", auth: "Employee", pin: "2255", lastActivity: "Jul 22, 2026 8:31 AM" },
    { id: "7", name: "Sofia Rossi", email: "sofia.rossi@sagamoregolf.com", auth: "Course Admin", phone: "(617) 555-0173", pin: "5662", lastActivity: "Jul 24, 2026 7:44 AM", avatar: "https://www.untitledui.com/images/avatars/natali-craig?fm=webp&q=80" },
    { id: "8", name: "Aaron Cole", email: "aaron.cole@sagamoregolf.com", auth: "Employee", pin: "1213", lastActivity: "Jul 20, 2026 11:15 AM" },
    { id: "9", name: "Blake Sims", email: "blake.sims@sagamoregolf.com", auth: "Employee", pin: "3131", lastActivity: "None" },
    { id: "10", name: "Igor Kuznetsov", email: "igor@tenfore.golf", auth: "TenFore Admin", phone: "(801) 555-9585", pin: "1008", lastActivity: "Jul 21, 2026 3:27 PM" },
    { id: "11", name: "Nikki Prichard", email: "nikki.prichard@sagamoregolf.com", auth: "Employee", pin: "8881", lastActivity: "None" },
    { id: "12", name: "CT Carswell", email: "ct.carswell@sagamoregolf.com", auth: "Customer", pin: "1239", lastActivity: "Jul 19, 2026 5:13 PM" },
];

/** Employees — the full staff roster with auth roles, PINs, and last activity. */
export const Employees_: Story = {
    name: "Employees",
    render: () => (
        <AppShell activeUrl="/employees/list">
            <PageHeader
                title="Employees"
                subtitle="Everyone with access to the point of sale and back office."
                action={
                    <Button iconLeading={Plus} size="md">
                        New employee
                    </Button>
                }
            />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input size="sm" aria-label="Search employees" placeholder="Search" icon={SearchLg} wrapperClassName="sm:w-80" />
                        <div className="flex items-center gap-2">
                            <Button size="sm" color="secondary" iconLeading={FilterLines}>
                                Filters
                            </Button>
                            <Button size="sm" color="secondary" iconLeading={Download01}>
                                Export
                            </Button>
                        </div>
                    </div>
                    <Table aria-label="Employees">
                        <Table.Header>
                            <Table.Head label="Name" isRowHeader />
                            <Table.Head label="Email" />
                            <Table.Head label="Auth" className="w-44" />
                            <Table.Head label="Phone" className="w-40" />
                            <Table.Head label="PIN" className="w-24" />
                            <Table.Head label="Last Activity" className="w-48" />
                        </Table.Header>
                        <Table.Body items={employees}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell>
                                        <div className="flex items-center gap-2.5">
                                            <Avatar size="sm" src={row.avatar} alt={row.name} initials={row.name.charAt(0)} />
                                            <span className="text-sm font-medium text-primary">{row.name}</span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.email}</Table.Cell>
                                    <Table.Cell>
                                        <Badge size="sm" type="pill-color" color={authBadgeColor[row.auth]}>
                                            {row.auth}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell className="tabular-nums text-tertiary">{row.phone ?? "—"}</Table.Cell>
                                    <Table.Cell className="font-medium tabular-nums text-primary">{row.pin}</Table.Cell>
                                    <Table.Cell className="tabular-nums text-tertiary">{row.lastActivity}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <div className="flex items-center justify-between gap-4 border-t border-secondary px-4 py-3">
                        <Button size="sm" color="secondary" iconLeading={ArrowLeft}>
                            Previous
                        </Button>
                        <span className="text-sm text-tertiary">Page 1 of 4</span>
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
/* Time Clock — Employee Hours                                         */
/* ------------------------------------------------------------------ */

interface TimeEntry {
    id: string;
    name: string;
    avatar?: string;
    time: string;
    action: "Clock In" | "Clock Out";
    roles: string;
    credit: string;
}

const timeEntries: TimeEntry[] = [
    { id: "1", name: "Dana Lee", avatar: "https://www.untitledui.com/images/avatars/candice-wu?fm=webp&q=80", time: "Jul 24, 2026 6:58 AM", action: "Clock In", roles: "Pro Shop", credit: "—" },
    { id: "2", name: "Marcus Bennett", avatar: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80", time: "Jul 24, 2026 7:02 AM", action: "Clock In", roles: "Manager", credit: "—" },
    { id: "3", name: "James Park", time: "Jul 24, 2026 7:15 AM", action: "Clock In", roles: "F&B", credit: "—" },
    { id: "4", name: "Dana Lee", avatar: "https://www.untitledui.com/images/avatars/candice-wu?fm=webp&q=80", time: "Jul 24, 2026 11:30 AM", action: "Clock Out", roles: "Pro Shop", credit: "4.53 hrs" },
    { id: "5", name: "Aaron Cole", time: "Jul 24, 2026 12:04 PM", action: "Clock In", roles: "Cart Barn", credit: "—" },
];

/** Time Clock — Employee Hours. Tracked-hours and tips totals, a time-clock message, and the punch feed. */
export const TimeClockEmployeeHours: Story = {
    name: "Time Clock — Employee Hours",
    render: () => (
        <AppShell activeUrl="/employees/time-clock/employee-hours">
            <PageHeader
                title="Employee Hours"
                subtitle="Live punch feed for the current pay period."
                action={
                    <Button iconLeading={Plus} size="md">
                        New time clock entry
                    </Button>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <MetricCard title="Total hours" value="38.75" change={12} changeLabel="Tracked hours" icon={Clock} />
                    <MetricCard title="Total tips" value="$412.00" change={8} changeLabel="Employee tips" icon={CurrencyDollar} />
                </div>

                {/* Time clock message */}
                <div className="flex flex-col gap-3 rounded-xl bg-secondary p-4 sm:flex-row sm:items-end sm:justify-between">
                    <Input
                        size="sm"
                        label="Time clock message"
                        placeholder="Enter a message shown on the time clock"
                        icon={MessageSquare01}
                        wrapperClassName="sm:max-w-2xl sm:flex-1"
                    />
                    <Button size="sm" className="shrink-0">
                        Save
                    </Button>
                </div>

                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input size="sm" aria-label="Search entries" placeholder="Search" icon={SearchLg} wrapperClassName="sm:w-80" />
                        <Button size="sm" color="secondary" iconLeading={Download01}>
                            Export
                        </Button>
                    </div>
                    <Table aria-label="Time clock entries">
                        <Table.Header>
                            <Table.Head label="Employee" isRowHeader />
                            <Table.Head label="Time" className="w-56" />
                            <Table.Head label="Action" className="w-36" />
                            <Table.Head label="Roles" className="w-36" />
                            <Table.Head label="Credit" className="w-28 text-right" />
                        </Table.Header>
                        <Table.Body items={timeEntries}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell>
                                        <div className="flex items-center gap-2.5">
                                            <Avatar size="sm" src={row.avatar} alt={row.name} initials={row.name.charAt(0)} />
                                            <span className="text-sm font-medium text-primary">{row.name}</span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="tabular-nums text-tertiary">{row.time}</Table.Cell>
                                    <Table.Cell>
                                        <Badge size="sm" type="pill-color" color={row.action === "Clock In" ? "success" : "gray"}>
                                            {row.action}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.roles}</Table.Cell>
                                    <Table.Cell className="text-right font-medium tabular-nums text-primary">{row.credit}</Table.Cell>
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
/* Time Clock — All Hours                                              */
/* ------------------------------------------------------------------ */

interface HoursRow {
    id: string;
    name: string;
    avatar?: string;
    roles: string;
    hours: number;
}

const allHours: HoursRow[] = [
    { id: "1", name: "Dana Lee", avatar: "https://www.untitledui.com/images/avatars/candice-wu?fm=webp&q=80", roles: "Pro Shop", hours: 32.5 },
    { id: "2", name: "Marcus Bennett", avatar: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80", roles: "Manager", hours: 40.0 },
    { id: "3", name: "James Park", roles: "F&B", hours: 28.25 },
    { id: "4", name: "Aaron Cole", roles: "Cart Barn", hours: 24.75 },
    { id: "5", name: "Sean O'Malley", roles: "Instructor", hours: 18.5 },
    { id: "6", name: "Nikki Prichard", roles: "Pro Shop", hours: 30.0 },
];

const totalHours = allHours.reduce((sum, r) => sum + r.hours, 0);

/** Time Clock — All Hours. A period rollup of hours per employee with a total. */
export const TimeClockAllHours: Story = {
    name: "Time Clock — All Hours",
    render: () => (
        <AppShell activeUrl="/employees/time-clock/all-hours">
            <PageHeader
                title="All Employee Hours"
                subtitle="Total hours worked per employee this pay period."
                action={
                    <Button size="md" color="secondary" iconLeading={CalendarDate}>
                        Jul 20 – Jul 26, 2026
                    </Button>
                }
            />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input size="sm" aria-label="Search employees" placeholder="Search" icon={SearchLg} wrapperClassName="sm:w-80" />
                        <Button size="sm" color="secondary" iconLeading={Download01}>
                            Export
                        </Button>
                    </div>
                    <Table aria-label="All employee hours">
                        <Table.Header>
                            <Table.Head label="Employee" isRowHeader />
                            <Table.Head label="Roles" />
                            <Table.Head label="Hours" className="w-32 text-right" />
                        </Table.Header>
                        <Table.Body items={allHours}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell>
                                        <div className="flex items-center gap-2.5">
                                            <Avatar size="sm" src={row.avatar} alt={row.name} initials={row.name.charAt(0)} />
                                            <span className="text-sm font-medium text-primary">{row.name}</span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.roles}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-primary">{row.hours.toFixed(2)}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <div className="flex items-center justify-between gap-4 border-t border-secondary px-4 py-3">
                        <span className="text-sm font-semibold text-primary">Total hours</span>
                        <span className="text-sm font-semibold tabular-nums text-primary">{totalHours.toFixed(2)}</span>
                    </div>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ------------------------------------------------------------------ */
/* Tip Outs                                                            */
/* ------------------------------------------------------------------ */

interface TipOut {
    id: string;
    date: string;
    from: string;
    to: string;
    amount: string;
}

const tipOuts: TipOut[] = [
    { id: "TO-1042", date: "Jul 23, 2026", from: "Dana Lee", to: "James Park", amount: "$24.00" },
    { id: "TO-1041", date: "Jul 23, 2026", from: "Marcus Bennett", to: "Aaron Cole", amount: "$18.50" },
    { id: "TO-1039", date: "Jul 22, 2026", from: "Sofia Rossi", to: "Nikki Prichard", amount: "$32.75" },
    { id: "TO-1036", date: "Jul 21, 2026", from: "Dana Lee", to: "Sean O'Malley", amount: "$15.00" },
    { id: "TO-1033", date: "Jul 20, 2026", from: "James Park", to: "Aaron Cole", amount: "$21.25" },
];

/** Tip Outs — the ledger of tips passed between staff. */
export const TipOuts: Story = {
    render: () => (
        <AppShell activeUrl="/employees/tip-outs">
            <PageHeader
                title="Tip Outs"
                subtitle="Tips distributed from one employee to another."
                action={
                    <Button iconLeading={Plus} size="md">
                        New tip out
                    </Button>
                }
            />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input size="sm" aria-label="Search tip outs" placeholder="Search" icon={SearchLg} wrapperClassName="sm:w-80" />
                        <Button size="sm" color="secondary" iconLeading={Download01}>
                            Export
                        </Button>
                    </div>
                    <Table aria-label="Tip outs">
                        <Table.Header>
                            <Table.Head label="ID" isRowHeader className="w-32" />
                            <Table.Head label="Date" className="w-40" />
                            <Table.Head label="From" />
                            <Table.Head label="To" />
                            <Table.Head label="Amount" className="w-32 text-right" />
                        </Table.Header>
                        <Table.Body items={tipOuts}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary tabular-nums">{row.id}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.date}</Table.Cell>
                                    <Table.Cell className="font-medium text-primary">{row.from}</Table.Cell>
                                    <Table.Cell className="font-medium text-primary">{row.to}</Table.Cell>
                                    <Table.Cell className="text-right font-medium tabular-nums text-success-primary">{row.amount}</Table.Cell>
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
/* Tips Report                                                         */
/* ------------------------------------------------------------------ */

interface TipReportRow {
    id: string;
    name: string;
    hours: number;
    fba: string;
    golf: string;
    cc: string;
    cash: string;
    total: string;
    tips: string;
    net: string;
    service: string;
}

const tipReport: TipReportRow[] = [
    { id: "1", name: "Dana Lee", hours: 32.5, fba: "$1,240", golf: "$820", cc: "$1,860", cash: "$200", total: "$2,060", tips: "$186", net: "$168", service: "$42" },
    { id: "2", name: "James Park", hours: 28.25, fba: "$2,410", golf: "$0", cc: "$2,100", cash: "$310", total: "$2,410", tips: "$264", net: "$264", service: "$88" },
    { id: "3", name: "Marcus Bennett", hours: 40.0, fba: "$640", golf: "$3,120", cc: "$3,500", cash: "$260", total: "$3,760", tips: "$142", net: "$118", service: "$36" },
    { id: "4", name: "Aaron Cole", hours: 24.75, fba: "$380", golf: "$1,480", cc: "$1,700", cash: "$160", total: "$1,860", tips: "$96", net: "$114", service: "$28" },
    { id: "5", name: "Nikki Prichard", hours: 30.0, fba: "$1,010", golf: "$540", cc: "$1,320", cash: "$230", total: "$1,550", tips: "$132", net: "$120", service: "$34" },
];

/** Tips Report — a date-ranged breakdown of sales, tips, and service charges per employee. */
export const TipsReport: Story = {
    render: () => (
        <AppShell activeUrl="/employees/tips-report">
            <PageHeader title="Tips Report" subtitle="Sales, tips, and service charges by employee for a date range." />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                {/* Date range controls */}
                <div className="flex flex-col gap-3 rounded-xl bg-secondary p-4 sm:flex-row sm:items-end">
                    <Input size="sm" label="Start date" defaultValue="Jul 20, 2026" icon={CalendarDate} wrapperClassName="sm:w-56" />
                    <Input size="sm" label="End date" defaultValue="Jul 26, 2026" icon={CalendarDate} wrapperClassName="sm:w-56" />
                    <Button size="md" iconLeading={SearchLg} className="shrink-0">
                        Run report
                    </Button>
                </div>

                <TableCard.Root className="overflow-x-auto">
                    <Table aria-label="Tips report">
                        <Table.Header>
                            <Table.Head label="Employee" isRowHeader />
                            <Table.Head label="Hours" className="text-right" />
                            <Table.Head label="F/B/A Sales" className="text-right" />
                            <Table.Head label="Golf Sales" className="text-right" />
                            <Table.Head label="CC Payments" className="text-right" />
                            <Table.Head label="Cash Payments" className="text-right" />
                            <Table.Head label="Total Sales" className="text-right" />
                            <Table.Head label="Tips" className="text-right" />
                            <Table.Head label="Net Tips" className="text-right" />
                            <Table.Head label="Service" className="text-right" />
                        </Table.Header>
                        <Table.Body items={tipReport}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary whitespace-nowrap">{row.name}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.hours.toFixed(2)}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.fba}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.golf}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.cc}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.cash}</Table.Cell>
                                    <Table.Cell className="text-right font-medium tabular-nums text-primary">{row.total}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.tips}</Table.Cell>
                                    <Table.Cell className="text-right font-medium tabular-nums text-success-primary">{row.net}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.service}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

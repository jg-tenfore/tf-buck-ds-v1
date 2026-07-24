import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Copy01,
    Download01,
    Edit01,
    Lock01,
    Plus,
    Printer,
    RefreshCcw01,
    SearchLg,
    SlashCircle01,
    Tag01,
    Trash01,
    UserPlus01,
} from "@untitledui/icons";
import { AppShell } from "@/components/application/app-navigation/app-shell";
import { PageHeader } from "@/components/application/screen-kit";
import { Table, TableCard, TableRowActionsDropdown } from "@/components/application/table/table";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";

const meta = {
    title: "App Screens/Golf",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;


const SUB_COURSES = [
    { id: "north", label: "North Course" },
    { id: "east", label: "East Course" },
    { id: "west", label: "West Course" },
];

/* ------------------------------------------------------------------ */
/* Daily Tee Sheet                                                     */
/* ------------------------------------------------------------------ */

type SlotCell =
    | { kind: "open" }
    | { kind: "blocked"; reason: string }
    | { kind: "booked"; name: string; rate: string; price: string; membership: "member" | "guest" };

interface TeeSlot {
    time: string;
    cells: SlotCell[];
}

const open = (): SlotCell => ({ kind: "open" });
const blocked = (reason: string): SlotCell => ({ kind: "blocked", reason });
const booked = (name: string, rate: string, price: string, membership: "member" | "guest"): SlotCell => ({
    kind: "booked",
    name,
    rate,
    price,
    membership,
});

const teeSlots: TeeSlot[] = [
    {
        time: "6:40 AM",
        cells: [
            booked("Marcus Avery", "Member", "Included", "member"),
            booked("Priya Raghavan", "Member", "Included", "member"),
            booked("Dale Whitmore", "Rack", "$89", "guest"),
            open(),
        ],
    },
    { time: "6:50 AM", cells: [open(), open(), open(), open()] },
    {
        time: "7:00 AM",
        cells: [booked("Sofia Mendes", "Rack", "$89", "guest"), booked("Owen Park", "Rack", "$89", "guest"), open(), open()],
    },
    { time: "7:10 AM", cells: [open(), open(), open(), open()] },
    {
        time: "7:20 AM",
        cells: [blocked("Frost delay"), blocked("Frost delay"), blocked("Frost delay"), blocked("Frost delay")],
    },
    {
        time: "7:30 AM",
        cells: [
            booked("Ken Nakamura", "Senior", "$52", "guest"),
            booked("Rosa Delgado", "Senior", "$52", "guest"),
            booked("Ida Whitfield", "Senior", "$52", "guest"),
            open(),
        ],
    },
    { time: "7:40 AM", cells: [open(), open(), open(), open()] },
    {
        time: "7:50 AM",
        cells: [
            booked("James Cole", "Rack", "$89", "guest"),
            booked("Tom Brady", "Rack", "$89", "guest"),
            booked("Ava Lin", "Twilight", "$55", "guest"),
            booked("Noah Reed", "Twilight", "$55", "guest"),
        ],
    },
    {
        time: "8:00 AM",
        cells: [booked("League — A Flight", "League", "$40", "member"), booked("League — A Flight", "League", "$40", "member"), open(), open()],
    },
    { time: "8:10 AM", cells: [open(), open(), open(), open()] },
    {
        time: "8:20 AM",
        cells: [blocked("Maintenance"), blocked("Maintenance"), blocked("Maintenance"), blocked("Maintenance")],
    },
    {
        time: "8:30 AM",
        cells: [booked("Grace Okafor", "Rack", "$89", "guest"), open(), open(), open()],
    },
];

const bookedCount = teeSlots.reduce((n, s) => n + s.cells.filter((c) => c.kind === "booked").length, 0);
const blockedCount = teeSlots.reduce((n, s) => n + s.cells.filter((c) => c.kind === "blocked").length, 0);

const Cell = ({ cell }: { cell: SlotCell }) => {
    if (cell.kind === "open") {
        return (
            <button
                type="button"
                className="flex min-h-14 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-secondary bg-primary text-sm text-quaternary transition duration-100 ease-linear hover:border-brand hover:text-brand-secondary"
            >
                <UserPlus01 className="size-4" aria-hidden="true" />
                Open
            </button>
        );
    }

    if (cell.kind === "blocked") {
        return (
            <div className="flex min-h-14 w-full flex-col justify-center gap-0.5 rounded-lg bg-secondary px-3 py-2 ring-1 ring-secondary ring-inset">
                <div className="flex items-center gap-1.5 text-sm font-medium text-tertiary">
                    <Lock01 className="size-3.5" aria-hidden="true" />
                    Blocked
                </div>
                <span className="truncate text-xs text-quaternary">{cell.reason}</span>
            </div>
        );
    }

    return (
        <div className="flex min-h-14 w-full flex-col justify-center gap-0.5 rounded-lg bg-primary px-3 py-2 ring-1 ring-secondary ring-inset">
            <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium text-primary">{cell.name}</span>
                <span className="shrink-0 text-xs font-medium text-tertiary tabular-nums">{cell.price}</span>
            </div>
            <BadgeWithDot size="sm" type="pill-color" color={cell.membership === "member" ? "brand" : "gray"}>
                {cell.rate}
            </BadgeWithDot>
        </div>
    );
};

/** Daily Tee Sheet — the working grid: a date + sub-course header, an action toolbar, and time-slot rows each with up to four player cells. */
export const DailyTeeSheet: Story = {
    name: "Daily Tee Sheet",
    render: () => (
        <AppShell activeUrl="/golf/tee-sheet/daily">
            <PageHeader
                title="Daily Tee Sheet"
                subtitle="Sagamore Golf Club · Book, block, and manage the day off the tee."
                action={
                    <div className="flex items-center gap-2">
                        <Button size="md" color="secondary" iconLeading={Printer}>
                            Cart signs
                        </Button>
                        <Button size="md" iconLeading={Plus}>
                            Add booking
                        </Button>
                    </div>
                }
            />

            <div className="flex flex-col gap-5 p-6 lg:p-8">
                {/* Controls: date nav + sub-course + notes */}
                <div className="flex flex-col gap-4 rounded-xl bg-primary p-4 ring-1 ring-secondary lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex flex-wrap items-end gap-4">
                        <div>
                            <span className="mb-1.5 block text-sm font-medium text-secondary">Date</span>
                            <div className="flex items-center gap-1.5">
                                <Button size="md" color="secondary" iconLeading={ChevronLeft} aria-label="Previous day" />
                                <div className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 ring-1 ring-secondary ring-inset">
                                    <Calendar className="size-4 text-fg-quaternary" aria-hidden="true" />
                                    <span className="text-sm font-medium text-primary">Fri, Jul 24, 2026</span>
                                </div>
                                <Button size="md" color="secondary" iconTrailing={ChevronRight} aria-label="Next day" />
                            </div>
                        </div>
                        <div className="w-56">
                            <Select
                                size="md"
                                label="Sub-course"
                                defaultSelectedKey="north"
                                items={SUB_COURSES}
                                aria-label="Sub-course"
                            >
                                {(item) => <Select.Item id={item.id} label={item.label} />}
                            </Select>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                        <div>
                            <span className="text-tertiary">Booked</span>{" "}
                            <span className="font-semibold text-primary tabular-nums">{bookedCount}</span>
                        </div>
                        <div>
                            <span className="text-tertiary">Blocked</span>{" "}
                            <span className="font-semibold text-primary tabular-nums">{blockedCount}</span>
                        </div>
                        <div>
                            <span className="text-tertiary">Open</span>{" "}
                            <span className="font-semibold text-success-primary tabular-nums">{teeSlots.length * 4 - bookedCount - blockedCount}</span>
                        </div>
                    </div>
                </div>

                {/* Action toolbar */}
                <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" color="secondary" iconLeading={Tag01}>
                        Reserve
                    </Button>
                    <Button size="sm" color="secondary" iconLeading={SlashCircle01}>
                        Block / Unblock
                    </Button>
                    <Button size="sm" color="secondary" iconLeading={Plus}>
                        Add
                    </Button>
                    <Button size="sm" color="secondary" iconLeading={RefreshCcw01}>
                        Reset
                    </Button>
                    <Button size="sm" color="secondary" iconLeading={Edit01}>
                        Save notes
                    </Button>
                    <div className="ml-auto flex items-center gap-2">
                        <Button size="sm" color="tertiary">
                            Front 9
                        </Button>
                        <Button size="sm" color="tertiary">
                            Back 9
                        </Button>
                    </div>
                </div>

                {/* Tee-time grid */}
                <div className="overflow-hidden rounded-xl bg-primary ring-1 ring-secondary">
                    <div className="hidden items-center gap-4 border-b border-secondary bg-secondary px-4 py-2.5 sm:flex">
                        <div className="w-24 shrink-0 text-xs font-semibold text-tertiary uppercase">Time</div>
                        <div className="grid flex-1 grid-cols-2 gap-3 text-xs font-semibold text-tertiary uppercase lg:grid-cols-4">
                            <span>Player 1</span>
                            <span>Player 2</span>
                            <span>Player 3</span>
                            <span>Player 4</span>
                        </div>
                    </div>
                    <div className="divide-y divide-secondary">
                        {teeSlots.map((slot) => (
                            <div key={slot.time} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
                                <div className="flex w-24 shrink-0 items-center gap-2">
                                    <span className="text-sm font-semibold text-brand-secondary tabular-nums">{slot.time}</span>
                                </div>
                                <div className="grid flex-1 grid-cols-2 gap-3 lg:grid-cols-4">
                                    {slot.cells.map((cell, i) => (
                                        <Cell key={i} cell={cell} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-tertiary">
                    <div className="flex items-center gap-2">
                        <span className="size-3 rounded-full bg-brand-solid" aria-hidden="true" />
                        Member
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="size-3 rounded-full bg-quaternary" aria-hidden="true" />
                        Public / guest
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="size-3 rounded-sm bg-secondary ring-1 ring-secondary ring-inset" aria-hidden="true" />
                        Blocked
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="size-3 rounded-sm border border-dashed border-secondary" aria-hidden="true" />
                        Open
                    </div>
                </div>
            </div>
        </AppShell>
    ),
};

/* ------------------------------------------------------------------ */
/* Tee Schedules                                                       */
/* ------------------------------------------------------------------ */

interface TeeSchedule {
    id: string;
    number: string;
    description: string;
    gap: string;
    startDate: string;
    endDate: string;
    shotgun: boolean;
    split: boolean;
    isDefault: boolean;
}

const teeSchedules: TeeSchedule[] = [
    { id: "2038", number: "2038", description: "Marlin Schedule", gap: "15 min", startDate: "Jan 1, 2029", endDate: "Dec 31, 2029", shotgun: false, split: false, isDefault: false },
    { id: "2097", number: "2097", description: "Weekend Peak", gap: "5 min", startDate: "Sep 6, 2026", endDate: "Jul 16, 2027", shotgun: false, split: true, isDefault: false },
    { id: "2010", number: "2010", description: "Shotgun — Member Guest", gap: "10 min", startDate: "Jul 6, 2026", endDate: "Jul 6, 2026", shotgun: true, split: false, isDefault: false },
    { id: "2033", number: "2033", description: "Shotgun — Charity Scramble", gap: "9 min", startDate: "Jun 27, 2026", endDate: "Jun 27, 2026", shotgun: true, split: false, isDefault: false },
    { id: "1134", number: "1134", description: "Main Tee Time Schedule", gap: "10 min", startDate: "Dec 1, 2025", endDate: "Mar 31, 2028", shotgun: false, split: false, isDefault: true },
];

/** Tee Schedules — the interval / shotgun templates that generate the tee sheet. */
export const Schedules: Story = {
    render: () => (
        <AppShell activeUrl="/golf/tee-sheet/schedules">
            <PageHeader
                title="Tee Schedules"
                subtitle="Interval and shotgun templates that build each day's sheet."
                action={
                    <div className="flex items-center gap-2">
                        <Button size="md" color="secondary" iconLeading={Copy01}>
                            Clone
                        </Button>
                        <Button size="md" iconLeading={Plus}>
                            New schedule
                        </Button>
                    </div>
                }
            />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input size="sm" aria-label="Search schedules" placeholder="Search" icon={SearchLg} wrapperClassName="sm:w-80" />
                        <Button size="sm" color="secondary" iconLeading={Download01}>
                            Export
                        </Button>
                    </div>
                    <Table aria-label="Tee schedules">
                        <Table.Header>
                            <Table.Head label="#" isRowHeader className="w-20" />
                            <Table.Head label="Description" />
                            <Table.Head label="Gap" className="w-28" />
                            <Table.Head label="Start date" className="w-36" />
                            <Table.Head label="End date" className="w-36" />
                            <Table.Head label="Type" className="w-32" />
                            <Table.Head label="Default" className="w-24" />
                            <Table.Head label="" className="w-16" />
                        </Table.Header>
                        <Table.Body items={teeSchedules}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary tabular-nums">{row.number}</Table.Cell>
                                    <Table.Cell className="font-medium text-primary">{row.description}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.gap}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.startDate}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.endDate}</Table.Cell>
                                    <Table.Cell>
                                        {row.shotgun ? (
                                            <Badge size="sm" type="pill-color" color="orange">
                                                Shotgun
                                            </Badge>
                                        ) : row.split ? (
                                            <Badge size="sm" type="pill-color" color="indigo">
                                                Split
                                            </Badge>
                                        ) : (
                                            <Badge size="sm" type="pill-color" color="gray">
                                                Interval
                                            </Badge>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {row.isDefault && (
                                            <BadgeWithDot size="sm" type="pill-color" color="success">
                                                Default
                                            </BadgeWithDot>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <TableRowActionsDropdown />
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
/* Auto-Block Templates                                                */
/* ------------------------------------------------------------------ */

interface BlockTemplate {
    id: string;
    number: string;
    name: string;
    schedule: string;
    positions: number;
    enabled: boolean;
}

const blockTemplates: BlockTemplate[] = [
    { id: "9", number: "9", name: "Morning Maintenance Hold", schedule: "Main Tee Time Schedule", positions: 4, enabled: true },
    { id: "7", number: "7", name: "League Night — Back 9", schedule: "Weekend Peak", positions: 2, enabled: true },
    { id: "5", number: "5", name: "Aerification Week", schedule: "Main Tee Time Schedule", positions: 4, enabled: false },
    { id: "3", number: "3", name: "Member Guest Reserve", schedule: "Shotgun — Member Guest", positions: 4, enabled: true },
];

/** Auto-Block Templates — recurring holds automatically applied to the sheet. */
export const AutoBlockTemplates: Story = {
    name: "Auto-Block Templates",
    render: () => (
        <AppShell activeUrl="/golf/tee-sheet/auto-block-templates">
            <PageHeader
                title="Auto-Block Templates"
                subtitle="Recurring holds that block slots automatically as the sheet generates."
                action={
                    <Button size="md" iconLeading={Plus}>
                        New template
                    </Button>
                }
            />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <Table aria-label="Auto-block templates">
                        <Table.Header>
                            <Table.Head label="#" isRowHeader className="w-20" />
                            <Table.Head label="Name" />
                            <Table.Head label="Tee schedule" />
                            <Table.Head label="Positions" className="w-32 text-right" />
                            <Table.Head label="Status" className="w-32" />
                            <Table.Head label="" className="w-16" />
                        </Table.Header>
                        <Table.Body items={blockTemplates}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary tabular-nums">{row.number}</Table.Cell>
                                    <Table.Cell className="font-medium text-primary">{row.name}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.schedule}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums">{row.positions}</Table.Cell>
                                    <Table.Cell>
                                        <BadgeWithDot size="sm" type="pill-color" color={row.enabled ? "success" : "gray"}>
                                            {row.enabled ? "Enabled" : "Disabled"}
                                        </BadgeWithDot>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <TableRowActionsDropdown />
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
/* Starter Sheet                                                       */
/* ------------------------------------------------------------------ */

interface StarterRow {
    id: string;
    time: string;
    players: string[];
}

const starterRows: StarterRow[] = [
    { id: "s1", time: "6:40 AM", players: ["Marcus Avery", "Priya Raghavan", "Dale Whitmore", "—"] },
    { id: "s2", time: "6:50 AM", players: ["—", "—", "—", "—"] },
    { id: "s3", time: "7:00 AM", players: ["Sofia Mendes", "Owen Park", "—", "—"] },
    { id: "s4", time: "7:10 AM", players: ["—", "—", "—", "—"] },
    { id: "s5", time: "7:30 AM", players: ["Ken Nakamura", "Rosa Delgado", "Ida Whitfield", "—"] },
    { id: "s6", time: "7:50 AM", players: ["James Cole", "Tom Brady", "Ava Lin", "Noah Reed"] },
    { id: "s7", time: "8:00 AM", players: ["League — A Flight", "League — A Flight", "—", "—"] },
    { id: "s8", time: "8:30 AM", players: ["Grace Okafor", "—", "—", "—"] },
];

const STARTER_VIEWS = ["Detailed", "Simple A", "Simple B", "Groups"];

const StarterPlayerCell = ({ name }: { name: string }) => {
    if (name === "—") {
        return <span className="text-sm text-quaternary">—</span>;
    }
    return (
        <div className="flex flex-col">
            <span className="text-sm font-medium text-primary">{name}</span>
            <span className="text-xs text-quaternary">CART ____ · TKT# ________</span>
        </div>
    );
};

/** Starter Sheet — the printable starter roster for the day, with slots for cart and ticket numbers. */
export const StarterSheet: Story = {
    name: "Starter Sheet",
    render: () => (
        <AppShell activeUrl="/golf/tee-sheet/starter-sheet">
            <PageHeader
                title="Starter Sheet"
                subtitle="North Course · Fri, Jul 24, 2026"
                action={
                    <div className="flex items-center gap-2">
                        <Button size="md" color="secondary" iconLeading={Printer}>
                            Print
                        </Button>
                        <Button size="md" color="secondary" iconLeading={Download01}>
                            Export
                        </Button>
                    </div>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                {/* Report controls */}
                <div className="flex flex-col gap-4 rounded-xl bg-primary p-4 ring-1 ring-secondary sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="w-52">
                            <Select size="md" label="Sub-course" defaultSelectedKey="north" items={SUB_COURSES} aria-label="Sub-course">
                                {(item) => <Select.Item id={item.id} label={item.label} />}
                            </Select>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 ring-1 ring-secondary ring-inset">
                            <Calendar className="size-4 text-fg-quaternary" aria-hidden="true" />
                            <span className="text-sm font-medium text-primary">Jul 24, 2026</span>
                        </div>
                        <Button size="md">Run report</Button>
                    </div>
                    {/* View switcher */}
                    <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
                        {STARTER_VIEWS.map((view, i) => (
                            <button
                                key={view}
                                type="button"
                                className={
                                    i === 0
                                        ? "rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary shadow-xs"
                                        : "rounded-md px-3 py-1.5 text-sm font-medium text-tertiary hover:text-secondary"
                                }
                            >
                                {view}
                            </button>
                        ))}
                    </div>
                </div>

                <TableCard.Root>
                    <TableCard.Header title="Starter sheet — Jul 24, 2026" badge={`${starterRows.length} times`} description="Detailed view" />
                    <Table aria-label="Starter sheet">
                        <Table.Header>
                            <Table.Head label="Time" isRowHeader className="w-28" />
                            <Table.Head label="Player 1" />
                            <Table.Head label="Player 2" />
                            <Table.Head label="Player 3" />
                            <Table.Head label="Player 4" />
                        </Table.Header>
                        <Table.Body items={starterRows}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="align-top font-semibold text-brand-secondary tabular-nums">{row.time}</Table.Cell>
                                    {row.players.map((name, i) => (
                                        <Table.Cell key={i} className="align-top">
                                            <StarterPlayerCell name={name} />
                                        </Table.Cell>
                                    ))}
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
/* Tee Fees                                                            */
/* ------------------------------------------------------------------ */

interface TeeFee {
    id: string;
    number: string;
    title: string;
    glCode: string;
    window: string;
    days: string; // 7 chars for S M T W T F S, uppercase active
    discount: string;
    online: string;
    nine: string;
    eighteen: string;
    rackRate: boolean;
    everyone: boolean;
}

const teeFees: TeeFee[] = [
    { id: "3639", number: "3639", title: "Rack — Prime", glCode: "1230000", window: "4:25 AM – 9:59 PM", days: "SMTWTFS", discount: "0%", online: "0%", nine: "$52.67", eighteen: "$105.34", rackRate: true, everyone: true },
    { id: "4015", number: "4015", title: "Rack — Non-Prime", glCode: "1230000", window: "3:00 PM – 12:59 AM", days: "SMTWTFS", discount: "0%", online: "0%", nine: "$25.00", eighteen: "$35.00", rackRate: false, everyone: true },
    { id: "2612", number: "2612", title: "Gold Fee (50%)", glCode: "143852", window: "6:00 AM – 10:00 PM", days: "SMTWTFS", discount: "50%", online: "0%", nine: "$0.00", eighteen: "$0.00", rackRate: false, everyone: false },
    { id: "4095", number: "4095", title: "Senior Weekday", glCode: "22334", window: "6:00 AM – 7:00 PM", days: "smTWTFs", discount: "0%", online: "0%", nine: "$18.99", eighteen: "$28.48", rackRate: false, everyone: false },
    { id: "4942", number: "4942", title: "Online Discount", glCode: "—", window: "5:28 AM – 11:28 PM", days: "SMTWTFS", discount: "0%", online: "10%", nine: "$25.00", eighteen: "$50.00", rackRate: false, everyone: false },
    { id: "3105", number: "3105", title: "Twilight", glCode: "22334", window: "6:00 AM – 11:59 PM", days: "SMTWTFS", discount: "0%", online: "0%", nine: "$6.50", eighteen: "$10.83", rackRate: false, everyone: false },
    { id: "4859", number: "4859", title: "Weekday Member", glCode: "—", window: "7:30 AM – 4:30 PM", days: "smTWTFs", discount: "25%", online: "0%", nine: "$41.63", eighteen: "$41.63", rackRate: false, everyone: false },
    { id: "2611", number: "2611", title: "Birdie (25%)", glCode: "—", window: "7:00 AM – 11:00 PM", days: "SMTWTFS", discount: "25%", online: "0%", nine: "$1.00", eighteen: "$1.00", rackRate: false, everyone: false },
];

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

const DaysCell = ({ days }: { days: string }) => (
    <div className="flex items-center gap-1">
        {DAY_LABELS.map((label, i) => {
            const active = days[i] === days[i].toUpperCase() && days[i] !== days[i].toLowerCase();
            return (
                <span
                    key={i}
                    className={
                        active
                            ? "flex size-5 items-center justify-center rounded-full bg-brand-secondary text-xs font-semibold text-brand-secondary"
                            : "flex size-5 items-center justify-center rounded-full text-xs font-medium text-quaternary"
                    }
                >
                    {label}
                </span>
            );
        })}
    </div>
);

const FEE_TABS = ["Tee Fees", "Transportation Fees"];

/** Tee Fees — the rate card: pricing rules with GL codes, time windows, active days, and 9/18-hole prices. */
export const Fees: Story = {
    render: () => (
        <AppShell activeUrl="/golf/fees">
            <PageHeader
                title="Tee Fees"
                subtitle="The rate card — pricing rules applied to bookings across the sheet."
                action={
                    <div className="flex items-center gap-2">
                        <Button size="md" color="secondary" iconLeading={Plus}>
                            Transportation fee
                        </Button>
                        <Button size="md" iconLeading={Plus}>
                            New tee fee
                        </Button>
                    </div>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                {/* Fee type tabs */}
                <div className="flex items-center gap-1 border-b border-secondary">
                    {FEE_TABS.map((tab, i) => (
                        <button
                            key={tab}
                            type="button"
                            className={
                                i === 0
                                    ? "-mb-px border-b-2 border-brand px-3 py-2.5 text-sm font-semibold text-brand-secondary"
                                    : "-mb-px border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-tertiary hover:text-secondary"
                            }
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input size="sm" aria-label="Search fees" placeholder="Search fees" icon={SearchLg} wrapperClassName="sm:w-80" />
                        <div className="flex items-center gap-2">
                            <Button size="sm" color="secondary-destructive" iconLeading={Trash01}>
                                Remove expired
                            </Button>
                            <Button size="sm" color="secondary" iconLeading={Download01}>
                                Export
                            </Button>
                        </div>
                    </div>
                    <Table aria-label="Tee fees">
                        <Table.Header>
                            <Table.Head label="ID" isRowHeader className="w-20" />
                            <Table.Head label="Title" />
                            <Table.Head label="GL code" className="w-28" />
                            <Table.Head label="Window" className="w-48" />
                            <Table.Head label="Days" className="w-44" />
                            <Table.Head label="Rack" className="w-20" />
                            <Table.Head label="Disc." className="w-20 text-right" />
                            <Table.Head label="9" className="w-24 text-right" />
                            <Table.Head label="18" className="w-24 text-right" />
                            <Table.Head label="" className="w-16" />
                        </Table.Header>
                        <Table.Body items={teeFees}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.number}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-primary">{row.title}</span>
                                            {row.everyone && (
                                                <Badge size="sm" type="pill-color" color="gray">
                                                    All
                                                </Badge>
                                            )}
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.glCode}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.window}</Table.Cell>
                                    <Table.Cell>
                                        <DaysCell days={row.days} />
                                    </Table.Cell>
                                    <Table.Cell>
                                        {row.rackRate ? (
                                            <CheckCircle className="size-4 text-fg-success-primary" aria-label="Rack rate" />
                                        ) : (
                                            <span className="text-quaternary">—</span>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.discount}</Table.Cell>
                                    <Table.Cell className="text-right font-medium text-primary tabular-nums">{row.nine}</Table.Cell>
                                    <Table.Cell className="text-right font-medium text-primary tabular-nums">{row.eighteen}</Table.Cell>
                                    <Table.Cell>
                                        <TableRowActionsDropdown />
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

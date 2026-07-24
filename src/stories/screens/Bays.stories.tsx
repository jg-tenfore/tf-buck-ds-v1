import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowLeft, ArrowRight, Calendar, Clock, Copy01, FilterLines, Monitor04, Plus, SearchLg, Trash01, Users01 } from "@untitledui/icons";
import { AppShell } from "@/components/application/app-navigation/app-shell";
import { PageHeader } from "@/components/application/screen-kit";
import { Table, TableCard } from "@/components/application/table/table";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";

const meta = {
    title: "App Screens/Bays (beta)",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;


// ---------------------------------------------------------------------------
// Bay List
// ---------------------------------------------------------------------------

interface Bay {
    id: string;
    bayNo: string;
    name: string;
    type: string;
    maxPlayers: number;
    status: "active" | "maintenance";
}

const bays: Bay[] = [
    { id: "1012", bayNo: "1012", name: "Blue Bay", type: "TrackMan", maxPlayers: 5, status: "active" },
    { id: "8", bayNo: "8", name: "Green Bay", type: "TrackMan", maxPlayers: 5, status: "active" },
    { id: "2", bayNo: "2", name: "Orange Bay", type: "Foresight GCQuad", maxPlayers: 9, status: "active" },
    { id: "1", bayNo: "1", name: "Purple Bay", type: "Foresight GCQuad", maxPlayers: 3, status: "maintenance" },
    { id: "1068", bayNo: "1068", name: "Red Bay", type: "TrackMan", maxPlayers: 4, status: "active" },
    { id: "1069", bayNo: "1069", name: "Yellow Bay", type: "Uneekor EYE XO", maxPlayers: 6, status: "active" },
];

/** Bay List — the simulator bays available for booking, with capacity and status. */
export const BayList: Story = {
    name: "Bay List",
    render: () => (
        <AppShell activeUrl="/bays-beta/list">
            <PageHeader
                title="Bay Management"
                subtitle="Simulator bays available for reservations. Select a row to edit its details."
                action={
                    <Button iconLeading={Plus} size="md">
                        New bay
                    </Button>
                }
            />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input size="sm" aria-label="Search bays" placeholder="Search bays" icon={SearchLg} wrapperClassName="sm:w-80" />
                        <Button size="sm" color="secondary" iconLeading={FilterLines}>
                            Filters
                        </Button>
                    </div>
                    <Table aria-label="Bays">
                        <Table.Header>
                            <Table.Head label="ID" isRowHeader className="w-28" />
                            <Table.Head label="Description" />
                            <Table.Head label="Type" className="w-56" />
                            <Table.Head label="Max players" className="w-36 text-right" />
                            <Table.Head label="Status" className="w-40" />
                            <Table.Head label="" className="w-16" />
                        </Table.Header>
                        <Table.Body items={bays}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary tabular-nums">{row.bayNo}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex size-8 items-center justify-center rounded-md bg-brand-secondary text-brand-secondary">
                                                <Monitor04 className="size-4" aria-hidden="true" />
                                            </div>
                                            <span className="text-sm font-medium text-primary">{row.name}</span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.type}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums">{row.maxPlayers}</Table.Cell>
                                    <Table.Cell>
                                        {row.status === "active" ? (
                                            <BadgeWithDot size="sm" type="pill-color" color="success">
                                                Active
                                            </BadgeWithDot>
                                        ) : (
                                            <BadgeWithDot size="sm" type="pill-color" color="warning">
                                                Maintenance
                                            </BadgeWithDot>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button size="sm" color="tertiary" iconLeading={Trash01} className="text-error-primary" aria-label="Delete bay" />
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

// ---------------------------------------------------------------------------
// Bay Reservations
// ---------------------------------------------------------------------------

interface Reservation {
    id: string;
    time: string;
    bay: string;
    customer: string;
    avatar?: string;
    players: number;
    duration: string;
    status: "confirmed" | "checked-in" | "pending";
}

const reservations: Reservation[] = [
    { id: "r1", time: "9:00 AM", bay: "Blue Bay", customer: "Olivia Chen", players: 4, duration: "60 min", status: "checked-in", avatar: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80" },
    { id: "r2", time: "10:00 AM", bay: "Green Bay", customer: "Marcus Bennett", players: 2, duration: "60 min", status: "confirmed" },
    { id: "r3", time: "11:30 AM", bay: "Orange Bay", customer: "Priya Nair", players: 6, duration: "90 min", status: "confirmed", avatar: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80" },
    { id: "r4", time: "1:00 PM", bay: "Red Bay", customer: "James Park", players: 3, duration: "60 min", status: "pending" },
    { id: "r5", time: "2:30 PM", bay: "Blue Bay", customer: "Dana Lee", players: 4, duration: "120 min", status: "confirmed", avatar: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80" },
    { id: "r6", time: "4:00 PM", bay: "Yellow Bay", customer: "Chris Wu", players: 2, duration: "60 min", status: "confirmed" },
];

const statusBadge = (status: Reservation["status"]) => {
    switch (status) {
        case "checked-in":
            return (
                <BadgeWithDot size="sm" type="pill-color" color="success">
                    Checked in
                </BadgeWithDot>
            );
        case "pending":
            return (
                <BadgeWithDot size="sm" type="pill-color" color="warning">
                    Pending
                </BadgeWithDot>
            );
        default:
            return (
                <BadgeWithDot size="sm" type="pill-color" color="blue">
                    Confirmed
                </BadgeWithDot>
            );
    }
};

/** Bay Reservations — reservations for the selected day with a date filter and search. */
export const BayReservations: Story = {
    name: "Bay Reservations",
    render: () => (
        <AppShell activeUrl="/bays-beta/reservations">
            <PageHeader
                title="Bay Reservations"
                subtitle="Sagamore Spring Golf Club — Thursday, July 24, 2026"
                action={
                    <Button iconLeading={Plus} size="md">
                        New reservation
                    </Button>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <Input size="sm" type="date" label="Date" defaultValue="2026-07-24" wrapperClassName="sm:w-56" />
                    <div className="flex items-center gap-2">
                        <Input size="sm" aria-label="Search reservations" placeholder="Search customer or bay" icon={SearchLg} wrapperClassName="sm:w-72" />
                        <Button size="sm" color="secondary" iconLeading={FilterLines}>
                            Filters
                        </Button>
                    </div>
                </div>

                <TableCard.Root>
                    <TableCard.Header title="Reservations" badge="6 booked" description="Select a reservation to view or edit details." />
                    <Table aria-label="Bay reservations">
                        <Table.Header>
                            <Table.Head label="Time" isRowHeader className="w-32" />
                            <Table.Head label="Bay" className="w-44" />
                            <Table.Head label="Customer" />
                            <Table.Head label="Players" className="w-28 text-right" />
                            <Table.Head label="Duration" className="w-32" />
                            <Table.Head label="Status" className="w-40" />
                        </Table.Header>
                        <Table.Body items={reservations}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary tabular-nums">
                                        <div className="flex items-center gap-2">
                                            <Clock className="size-4 text-quaternary" aria-hidden="true" />
                                            {row.time}
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.bay}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center gap-2.5">
                                            <Avatar size="sm" src={row.avatar} alt={row.customer} initials={row.customer.charAt(0)} />
                                            <span className="text-sm font-medium text-primary">{row.customer}</span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="text-right tabular-nums">{row.players}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.duration}</Table.Cell>
                                    <Table.Cell>{statusBadge(row.status)}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <div className="flex items-center justify-between gap-4 border-t border-secondary px-4 py-3">
                        <Button size="sm" color="secondary" iconLeading={ArrowLeft}>
                            Previous
                        </Button>
                        <span className="text-sm text-tertiary">July 24, 2026</span>
                        <Button size="sm" color="secondary" iconTrailing={ArrowRight}>
                            Next
                        </Button>
                    </div>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

// ---------------------------------------------------------------------------
// Bay Schedules
// ---------------------------------------------------------------------------

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Schedule {
    id: string;
    name: string;
    priority: number;
    gap: string;
    timeRange: string;
    dateRange: string;
    days: string[];
    bays: number;
    slots: number;
}

const schedules: Schedule[] = [
    { id: "s1", name: "Blue Bay 1 Monday", priority: 1, gap: "30m", timeRange: "9:00 AM - 5:00 PM", dateRange: "Sep 22, 2025 - Dec 31, 2025", days: DAYS, bays: 5, slots: 16 },
    { id: "s2", name: "Weekend Prime", priority: 2, gap: "60m", timeRange: "8:00 AM - 8:00 PM", dateRange: "Jun 1, 2026 - Sep 30, 2026", days: ["Sat", "Sun"], bays: 6, slots: 12 },
    { id: "s3", name: "Weekday Evenings", priority: 3, gap: "30m", timeRange: "4:00 PM - 10:00 PM", dateRange: "Jan 1, 2026 - Dec 31, 2026", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], bays: 4, slots: 12 },
    { id: "s4", name: "League Nights", priority: 4, gap: "90m", timeRange: "6:00 PM - 9:00 PM", dateRange: "Oct 1, 2025 - Mar 31, 2026", days: ["Tue", "Thu"], bays: 6, slots: 8 },
];

/** Bay Schedules — recurring availability rules that generate bookable slots. */
export const BaySchedules: Story = {
    name: "Bay Schedules",
    render: () => (
        <AppShell activeUrl="/bays-beta/schedules">
            <PageHeader
                title="Bay Schedules"
                subtitle="Recurring rules that generate bookable simulator slots."
                action={
                    <Button iconLeading={Plus} size="md">
                        New schedule
                    </Button>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Input size="sm" aria-label="Search schedules" placeholder="Search schedules" icon={SearchLg} wrapperClassName="sm:w-80" />
                    <Button size="sm" color="secondary" iconLeading={FilterLines}>
                        Filters
                    </Button>
                </div>

                <TableCard.Root>
                    <Table aria-label="Bay schedules">
                        <Table.Header>
                            <Table.Head label="Description" isRowHeader />
                            <Table.Head label="Gap" className="w-24" />
                            <Table.Head label="Time range" className="w-48" />
                            <Table.Head label="Date range" className="w-56" />
                            <Table.Head label="Days" />
                            <Table.Head label="Bays" className="w-24 text-right" />
                            <Table.Head label="Slots" className="w-24 text-right" />
                            <Table.Head label="" className="w-24" />
                        </Table.Header>
                        <Table.Body items={schedules}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell>
                                        <span className="text-sm font-medium text-primary">{row.name}</span>
                                        <p className="text-xs text-tertiary">Priority: {row.priority}</p>
                                    </Table.Cell>
                                    <Table.Cell className="tabular-nums text-tertiary">{row.gap}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.timeRange}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.dateRange}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex flex-wrap gap-1">
                                            {row.days.map((day) => (
                                                <Badge key={day} size="sm" type="pill-color" color="blue">
                                                    {day}
                                                </Badge>
                                            ))}
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.bays}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.slots}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center gap-1">
                                            <Button size="sm" color="tertiary" iconLeading={Copy01} aria-label="Duplicate schedule" />
                                            <Button size="sm" color="tertiary" iconLeading={Trash01} className="text-error-primary" aria-label="Delete schedule" />
                                        </div>
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

// ---------------------------------------------------------------------------
// Bay Waitlist
// ---------------------------------------------------------------------------

interface WaitlistEntry {
    id: string;
    position: number;
    customer: string;
    avatar?: string;
    phone: string;
    requested: string;
    partySize: number;
    added: string;
    status: "waiting" | "notified";
}

const waitlist: WaitlistEntry[] = [
    { id: "w1", position: 1, customer: "Sofia Rossi", phone: "(617) 555-0173", requested: "Any bay · 60 min", partySize: 4, added: "8:42 AM", status: "notified", avatar: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80" },
    { id: "w2", position: 2, customer: "Aaron Cole", phone: "(781) 555-0155", requested: "Blue Bay · 90 min", partySize: 2, added: "9:05 AM", status: "waiting" },
    { id: "w3", position: 3, customer: "Nadia Ahmed", phone: "(978) 555-0121", requested: "Any bay · 60 min", partySize: 3, added: "9:20 AM", status: "waiting", avatar: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80" },
    { id: "w4", position: 4, customer: "Ben Carter", phone: "(603) 555-0198", requested: "Orange Bay · 120 min", partySize: 6, added: "9:47 AM", status: "waiting" },
];

/** Bay Waitlist — customers waiting for a bay to open on the selected day. */
export const BayWaitlist: Story = {
    name: "Bay Waitlist",
    render: () => (
        <AppShell activeUrl="/bays-beta/waitlist">
            <PageHeader
                title="Bay Waitlist"
                subtitle="Customers waiting for an open simulator bay."
                action={
                    <Button iconLeading={Plus} size="md">
                        Add to waitlist
                    </Button>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <Input size="sm" type="date" label="Date" defaultValue="2026-07-24" wrapperClassName="sm:w-56" />
                    <Input size="sm" aria-label="Search waitlist" placeholder="Search customer" icon={SearchLg} wrapperClassName="sm:w-72" />
                </div>

                <TableCard.Root>
                    <TableCard.Header title="Waitlist" badge="4 waiting" description="Select an entry to view or edit details." />
                    <Table aria-label="Bay waitlist">
                        <Table.Header>
                            <Table.Head label="#" isRowHeader className="w-16" />
                            <Table.Head label="Customer" />
                            <Table.Head label="Phone" className="w-44" />
                            <Table.Head label="Requested" className="w-56" />
                            <Table.Head label="Party" className="w-24 text-right" />
                            <Table.Head label="Added" className="w-28" />
                            <Table.Head label="Status" className="w-36" />
                        </Table.Header>
                        <Table.Body items={waitlist}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary tabular-nums">{row.position}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center gap-2.5">
                                            <Avatar size="sm" src={row.avatar} alt={row.customer} initials={row.customer.charAt(0)} />
                                            <span className="text-sm font-medium text-primary">{row.customer}</span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="tabular-nums text-tertiary">{row.phone}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.requested}</Table.Cell>
                                    <Table.Cell className="text-right">
                                        <div className="flex items-center justify-end gap-1 tabular-nums text-tertiary">
                                            <Users01 className="size-4 text-quaternary" aria-hidden="true" />
                                            {row.partySize}
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="tabular-nums text-tertiary">{row.added}</Table.Cell>
                                    <Table.Cell>
                                        {row.status === "notified" ? (
                                            <BadgeWithDot size="sm" type="pill-color" color="success">
                                                Notified
                                            </BadgeWithDot>
                                        ) : (
                                            <BadgeWithDot size="sm" type="pill-color" color="warning">
                                                Waiting
                                            </BadgeWithDot>
                                        )}
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

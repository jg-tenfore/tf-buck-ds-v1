import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowLeft, ArrowRight, CheckCircle, Download01, FilterLines, Plus, SearchLg, SlashCircle01 } from "@untitledui/icons";
import { AppShell } from "@/components/application/app-navigation/app-shell";
import { PageHeader } from "@/components/application/screen-kit";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Toggle } from "@/components/base/toggle/toggle";

const meta = {
    title: "App Screens/Simulator Bays",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;


/** Toolbar with search + filter/export, used above list tables. */
const ListToolbar = ({ searchLabel }: { searchLabel: string }) => (
    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
        <Input size="sm" aria-label={searchLabel} placeholder="Search" icon={SearchLg} wrapperClassName="sm:w-80" />
        <div className="flex items-center gap-2">
            <Button size="sm" color="secondary" iconLeading={FilterLines}>
                Filters
            </Button>
            <Button size="sm" color="secondary" iconLeading={Download01}>
                Export
            </Button>
        </div>
    </div>
);

const ALL_DAYS = "Sun, Mon, Tue, Wed, Thu, Fri, Sat";

/* ------------------------------------------------------------------ Bays */

interface Bay {
    id: string;
    title: string;
    type: string;
    capacity: number;
    maxBookingDays: string;
    status: "available" | "occupied" | "maintenance";
}

const bays: Bay[] = [
    { id: "1", title: "Blue Bay", type: "Simulator Bay", capacity: 4, maxBookingDays: "7", status: "available" },
    { id: "2", title: "Green Bay", type: "Simulator Bay", capacity: 4, maxBookingDays: "—", status: "occupied" },
    { id: "3", title: "Magenta Bay", type: "Simulator Bay", capacity: 8, maxBookingDays: "—", status: "available" },
    { id: "4", title: "Orange Bay", type: "Simulator Bay", capacity: 4, maxBookingDays: "—", status: "occupied" },
    { id: "5", title: "Red Bay", type: "Simulator Bay", capacity: 8, maxBookingDays: "—", status: "maintenance" },
    { id: "6", title: "White Bay", type: "Simulator Bay", capacity: 6, maxBookingDays: "—", status: "available" },
];

const bayStatus = {
    available: { color: "success" as const, label: "Available" },
    occupied: { color: "blue" as const, label: "Occupied" },
    maintenance: { color: "warning" as const, label: "Maintenance" },
};

/** Bays — the physical simulator bays configured for the club, with capacity and booking window. */
export const Bays: Story = {
    render: () => (
        <AppShell activeUrl="/simulator-bays/bays">
            <PageHeader
                title="Simulator Bays"
                subtitle="Indoor golf simulators available for booking at Sagamore Spring."
                action={
                    <Button iconLeading={Plus} size="md">
                        New bay
                    </Button>
                }
            />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <TableCard.Header title="Bays" badge="6 bays" description="Each bay can be booked independently by staff or members." />
                    <ListToolbar searchLabel="Search bays" />
                    <Table aria-label="Simulator bays">
                        <Table.Header>
                            <Table.Head label="Title" isRowHeader />
                            <Table.Head label="Type" />
                            <Table.Head label="Status" className="w-40" />
                            <Table.Head label="Max capacity" className="w-36 text-right" />
                            <Table.Head label="Max booking days" className="w-40 text-right" />
                        </Table.Header>
                        <Table.Body items={bays}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary">{row.title}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.type}</Table.Cell>
                                    <Table.Cell>
                                        <BadgeWithDot size="sm" type="pill-color" color={bayStatus[row.status].color}>
                                            {bayStatus[row.status].label}
                                        </BadgeWithDot>
                                    </Table.Cell>
                                    <Table.Cell className="text-right tabular-nums">{row.capacity}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.maxBookingDays}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ------------------------------------------------------------------ Fees */

interface Fee {
    id: string;
    title: string;
    type: string;
    price: string;
    minutes: number;
    priority: number;
    days: string;
}

const fees: Fee[] = [
    { id: "1", title: "Walk-in 15 min", type: "Simulator Bay", price: "$25.00", minutes: 15, priority: 0, days: "Mon" },
    { id: "2", title: "Sim Hour — Standard", type: "Simulator Bay", price: "$100.00", minutes: 60, priority: 1, days: ALL_DAYS },
    { id: "3", title: "Sim Hour — Peak", type: "Simulator Bay", price: "$150.00", minutes: 60, priority: 2, days: ALL_DAYS },
    { id: "4", title: "Member Morning", type: "Simulator Bay", price: "$30.00", minutes: 60, priority: 3, days: ALL_DAYS },
    { id: "5", title: "Member Afternoon", type: "Simulator Bay", price: "$50.00", minutes: 60, priority: 4, days: ALL_DAYS },
];

/** Fees — the rate rules applied to bay bookings, evaluated by priority. */
export const Fees: Story = {
    render: () => (
        <AppShell activeUrl="/simulator-bays/fees">
            <PageHeader
                title="Simulator Bay Fees"
                subtitle="Pricing rules applied to bay bookings by duration, day, and priority."
                action={
                    <Button iconLeading={Plus} size="md">
                        New fee
                    </Button>
                }
            />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <ListToolbar searchLabel="Search fees" />
                    <Table aria-label="Simulator bay fees">
                        <Table.Header>
                            <Table.Head label="Title" isRowHeader />
                            <Table.Head label="Type" />
                            <Table.Head label="Price" className="w-28 text-right" />
                            <Table.Head label="Minutes" className="w-28 text-right" />
                            <Table.Head label="Priority" className="w-24 text-right" />
                            <Table.Head label="Days" />
                        </Table.Header>
                        <Table.Body items={fees}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary">{row.title}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.type}</Table.Cell>
                                    <Table.Cell className="text-right font-medium text-primary tabular-nums">{row.price}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums">{row.minutes}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.priority}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.days}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ------------------------------------------------------------------ Schedules */

interface Schedule {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    gap: number;
    days: string;
}

const schedules: Schedule[] = [
    { id: "1", title: "Members Only", startDate: "Jan 31, 2026", endDate: "Dec 31, 2027", startTime: "8:00 PM", endTime: "11:30 PM", gap: 30, days: ALL_DAYS },
    { id: "2", title: "Normal Daily Bays", startDate: "Jan 01, 2024", endDate: "Jan 01, 2030", startTime: "10:00 AM", endTime: "7:59 PM", gap: 30, days: ALL_DAYS },
    { id: "3", title: "Pickleball", startDate: "Jan 26, 2026", endDate: "Jul 31, 2026", startTime: "6:00 AM", endTime: "11:00 PM", gap: 60, days: ALL_DAYS },
];

/** Schedules — the recurring availability windows that generate bookable slots. */
export const Schedules: Story = {
    render: () => (
        <AppShell activeUrl="/simulator-bays/schedules">
            <PageHeader
                title="Simulator Bay Schedules"
                subtitle="Availability windows and slot spacing for each booking program."
                action={
                    <Button iconLeading={Plus} size="md">
                        New schedule
                    </Button>
                }
            />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <ListToolbar searchLabel="Search schedules" />
                    <Table aria-label="Simulator bay schedules">
                        <Table.Header>
                            <Table.Head label="Title" isRowHeader />
                            <Table.Head label="Start date" className="w-32" />
                            <Table.Head label="End date" className="w-32" />
                            <Table.Head label="Start time" className="w-28" />
                            <Table.Head label="End time" className="w-28" />
                            <Table.Head label="Gap (min)" className="w-24 text-right" />
                            <Table.Head label="Days" />
                        </Table.Header>
                        <Table.Body items={schedules}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary">{row.title}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.startDate}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.endDate}</Table.Cell>
                                    <Table.Cell className="tabular-nums">{row.startTime}</Table.Cell>
                                    <Table.Cell className="tabular-nums">{row.endTime}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.gap}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.days}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ------------------------------------------------------------------ Bookings */

interface Booking {
    id: string;
    resource: string;
    customer: string;
    start: string;
    end: string;
    players: number;
    purchased: boolean;
}

const bookings: Booking[] = [
    { id: "1", resource: "Orange Bay", customer: "Corporate Block", start: "Jul 23, 2026 12:45 PM", end: "Jul 23, 2026 02:15 PM", players: 1, purchased: false },
    { id: "2", resource: "Red Bay", customer: "Chance Hindbaugh", start: "Jul 23, 2026 12:00 PM", end: "Jul 23, 2026 01:30 PM", players: 1, purchased: false },
    { id: "3", resource: "Red Bay", customer: "Kyler Brooksby", start: "Jul 17, 2026 11:15 AM", end: "Jul 17, 2026 12:30 PM", players: 5, purchased: false },
    { id: "4", resource: "Orange Bay", customer: "Ivar Brennevin", start: "Jun 23, 2026 10:00 AM", end: "Jun 23, 2026 11:30 AM", players: 1, purchased: false },
    { id: "5", resource: "Blue Bay", customer: "June Sixteen", start: "Jun 16, 2026 07:00 PM", end: "Jun 16, 2026 07:30 PM", players: 1, purchased: false },
    { id: "6", resource: "Magenta Bay", customer: "Priya Nair", start: "Jun 16, 2026 05:00 PM", end: "Jun 16, 2026 05:30 PM", players: 1, purchased: false },
    { id: "7", resource: "Orange Bay", customer: "Olav Brennevin", start: "Jun 09, 2026 11:15 AM", end: "Jun 09, 2026 12:45 PM", players: 2, purchased: true },
    { id: "8", resource: "Orange Bay", customer: "Trevor Nash", start: "Jun 05, 2026 12:45 PM", end: "Jun 05, 2026 03:45 PM", players: 1, purchased: true },
    { id: "9", resource: "Red Bay", customer: "Kyler Brooksby", start: "May 29, 2026 10:45 AM", end: "May 29, 2026 12:15 PM", players: 1, purchased: true },
    { id: "10", resource: "Green Bay", customer: "Ivar Brennevin", start: "May 21, 2026 12:00 PM", end: "May 21, 2026 01:30 PM", players: 1, purchased: true },
    { id: "11", resource: "Green Bay", customer: "Ivar Brennevin", start: "May 13, 2026 11:30 AM", end: "May 13, 2026 01:00 PM", players: 1, purchased: false },
    { id: "12", resource: "Orange Bay", customer: "Bob West", start: "Apr 14, 2026 12:00 PM", end: "Apr 14, 2026 01:45 PM", players: 1, purchased: true },
    { id: "13", resource: "Red Bay", customer: "Avery Robertson", start: "Apr 06, 2026 12:30 PM", end: "Apr 06, 2026 01:30 PM", players: 2, purchased: false },
    { id: "14", resource: "Red Bay", customer: "Kyler Brooksby", start: "Apr 01, 2026 10:45 AM", end: "Apr 01, 2026 12:15 PM", players: 8, purchased: true },
];

/** Bookings — every reserved or purchased simulator slot, newest first. */
export const Bookings: Story = {
    render: () => (
        <AppShell activeUrl="/simulator-bays/bookings">
            <PageHeader
                title="Simulator Bay Bookings"
                subtitle="Reserved and purchased slots across all bays."
                action={
                    <Button iconLeading={Plus} size="md">
                        New booking
                    </Button>
                }
            />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <ListToolbar searchLabel="Search bookings" />
                    <Table aria-label="Simulator bay bookings">
                        <Table.Header>
                            <Table.Head label="Resource" isRowHeader className="w-36" />
                            <Table.Head label="Customer / block" />
                            <Table.Head label="Start" className="w-52" />
                            <Table.Head label="End" className="w-52" />
                            <Table.Head label="Players" className="w-24 text-right" />
                            <Table.Head label="Purchased" className="w-32" />
                        </Table.Header>
                        <Table.Body items={bookings}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary">{row.resource}</Table.Cell>
                                    <Table.Cell>{row.customer}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.start}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.end}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums">{row.players}</Table.Cell>
                                    <Table.Cell>
                                        {row.purchased ? (
                                            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success-primary">
                                                <CheckCircle className="size-4" aria-hidden="true" />
                                                Paid
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 text-sm text-tertiary">
                                                <SlashCircle01 className="size-4" aria-hidden="true" />
                                                Reserved
                                            </span>
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <div className="flex items-center justify-between gap-4 border-t border-secondary px-4 py-3">
                        <Button size="sm" color="secondary" iconLeading={ArrowLeft}>
                            Previous
                        </Button>
                        <span className="text-sm text-tertiary">Showing 1–50</span>
                        <Button size="sm" color="secondary" iconTrailing={ArrowRight}>
                            Next
                        </Button>
                    </div>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ------------------------------------------------------------------ Settings */

const requirementToggles = [
    { label: "Require card on file", hint: "A payment card must be saved before booking.", defaultSelected: true },
    { label: "Require email", hint: "Collect an email address at booking.", defaultSelected: true },
    { label: "Require name", hint: "Collect the guest's name at booking.", defaultSelected: true },
    { label: "Require phone", hint: "Collect a phone number at booking.", defaultSelected: false },
];

const behaviorToggles = [
    { label: "Disable reserve", hint: "Turn off hold-without-payment reservations.", defaultSelected: false },
    { label: "Disable cart", hint: "Prevent adding bay time to the shop cart.", defaultSelected: false },
    { label: "Members only", hint: "Restrict online booking to members.", defaultSelected: false },
    { label: "Share slots", hint: "Allow multiple parties to share one slot.", defaultSelected: false },
];

/** Settings — booking requirements, behavior flags, and cancellation rules for the bays program. */
export const Settings: Story = {
    render: () => (
        <AppShell activeUrl="/simulator-bays/settings">
            <PageHeader
                title="Simulator Bay Settings"
                subtitle="Control what's required to book and how slots are released."
                action={<Button size="md">Save changes</Button>}
            />
            <div className="flex flex-col gap-6 p-6 lg:p-8">
                <TableCard.Root>
                    <TableCard.Header title="Booking requirements" description="What guests must provide to complete a booking." />
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 p-6 sm:grid-cols-2">
                        {requirementToggles.map((t) => (
                            <Toggle key={t.label} label={t.label} hint={t.hint} defaultSelected={t.defaultSelected} />
                        ))}
                    </div>
                </TableCard.Root>

                <TableCard.Root>
                    <TableCard.Header title="Booking behavior" description="Options that change how bays can be reserved and sold." />
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 p-6 sm:grid-cols-2">
                        {behaviorToggles.map((t) => (
                            <Toggle key={t.label} label={t.label} hint={t.hint} defaultSelected={t.defaultSelected} />
                        ))}
                    </div>
                </TableCard.Root>

                <TableCard.Root>
                    <TableCard.Header title="Cancellation & release" description="Timing rules for cancellations and next-day slot release." />
                    <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
                        <Input
                            size="md"
                            label="Hours before cancellation"
                            defaultValue="1"
                            hint="How far ahead a guest can cancel without penalty."
                        />
                        <Input
                            size="md"
                            label="Next day release time"
                            defaultValue="06:03 PM"
                            hint="When the next day's slots open for booking."
                        />
                    </div>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

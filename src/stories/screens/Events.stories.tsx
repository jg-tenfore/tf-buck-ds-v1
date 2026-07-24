import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowLeft, ArrowRight, CalendarCheck01, Clock, CurrencyDollar, Download01, FilterLines, Plus, SearchLg, Trophy01, Users01 } from "@untitledui/icons";
import { AppShell } from "@/components/application/app-navigation/app-shell";
import { PageHeader } from "@/components/application/screen-kit";
import { MetricCard } from "@/components/application/metrics/metric-card";
import { Table, TableCard } from "@/components/application/table/table";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";

const meta = {
    title: "App Screens/Events",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;


const money = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });

type EventStatus = "scheduled" | "in-progress" | "completed" | "closed";

const STATUS_UI: Record<EventStatus, { label: string; color: "blue" | "warning" | "success" | "gray" }> = {
    scheduled: { label: "Scheduled", color: "blue" },
    "in-progress": { label: "In progress", color: "warning" },
    completed: { label: "Completed", color: "success" },
    closed: { label: "Closed", color: "gray" },
};

interface GolfEvent {
    id: string;
    name: string;
    dates: string;
    registrations: number;
    capacity: number;
    status: EventStatus;
    total: number;
    paid: number;
}

const events: GolfEvent[] = [
    { id: "7315", name: "2026 Member-Guest Invitational", dates: "Sep 12 – 13, 2026", registrations: 84, capacity: 96, status: "scheduled", total: 16688, paid: 9420 },
    { id: "7379", name: "Fourth of July Shootout", dates: "Jul 4, 2026", registrations: 72, capacity: 72, status: "completed", total: 5400, paid: 5400 },
    { id: "7186", name: "Spring Ice Breaker Scramble", dates: "May 20, 2026", registrations: 108, capacity: 120, status: "completed", total: 14400, paid: 13081 },
    { id: "7420", name: "Sunset 9 & Dine League — Week 8", dates: "Jul 24, 2026", registrations: 40, capacity: 48, status: "in-progress", total: 2400, paid: 1960 },
    { id: "7466", name: "Rally for the Cure Charity Classic", dates: "Aug 9, 2026", registrations: 56, capacity: 88, status: "scheduled", total: 11200, paid: 4480 },
    { id: "5946", name: "2-Person Scramble Championship", dates: "Aug 22 – 23, 2026", registrations: 62, capacity: 72, status: "scheduled", total: 12400, paid: 3100 },
    { id: "7501", name: "Junior Summer Clinic Series", dates: "Jul 7 – Aug 11, 2026", registrations: 34, capacity: 40, status: "in-progress", total: 4080, paid: 4080 },
    { id: "5197", name: "Ladies Invitational", dates: "Jun 14, 2026", registrations: 48, capacity: 60, status: "completed", total: 6720, paid: 6720 },
    { id: "6276", name: "Acme Co. Corporate Outing", dates: "Mar 7, 2026", registrations: 96, capacity: 96, status: "closed", total: 12289, paid: 12289 },
    { id: "7290", name: "Club Championship", dates: "Sep 26 – 27, 2026", registrations: 28, capacity: 64, status: "scheduled", total: 5600, paid: 1400 },
];

/** Events list — the roster of tournaments, outings, leagues, and clinics with registration + billing status. */
export const Events_: Story = {
    name: "Events",
    render: () => (
        <AppShell activeUrl="/events/list">
            <PageHeader
                title="Events"
                subtitle="Tournaments, outings, leagues, and clinics at Sagamore Spring GC."
                action={
                    <Button iconLeading={Plus} size="md">
                        New event
                    </Button>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                {/* Summary metrics */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard title="Upcoming events" value="12" change={20} icon={CalendarCheck01} />
                    <MetricCard title="Total registrations" value="628" change={14} icon={Users01} />
                    <MetricCard title="Revenue booked" value="$91.2k" change={9} icon={CurrencyDollar} />
                    <MetricCard title="Outstanding balance" value="$28.4k" change={-6} icon={Trophy01} />
                </div>

                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input size="sm" aria-label="Search events" placeholder="Search events" icon={SearchLg} wrapperClassName="sm:w-80" />
                        <div className="flex items-center gap-2">
                            <Button size="sm" color="secondary" iconLeading={FilterLines}>
                                Filters
                            </Button>
                            <Button size="sm" color="secondary" iconLeading={Download01}>
                                Export
                            </Button>
                        </div>
                    </div>
                    <Table aria-label="Events">
                        <Table.Header>
                            <Table.Head label="ID" isRowHeader className="w-20" />
                            <Table.Head label="Event" />
                            <Table.Head label="Dates" className="w-44" />
                            <Table.Head label="Registrations" className="w-32" />
                            <Table.Head label="Status" className="w-36" />
                            <Table.Head label="Total" className="w-28 text-right" />
                            <Table.Head label="Paid" className="w-28 text-right" />
                            <Table.Head label="Balance" className="w-32 text-right" />
                        </Table.Header>
                        <Table.Body items={events}>
                            {(row) => {
                                const balance = row.total - row.paid;
                                const status = STATUS_UI[row.status];
                                return (
                                    <Table.Row id={row.id}>
                                        <Table.Cell className="font-medium text-primary tabular-nums">{row.id}</Table.Cell>
                                        <Table.Cell className="font-medium text-primary">{row.name}</Table.Cell>
                                        <Table.Cell className="text-tertiary">{row.dates}</Table.Cell>
                                        <Table.Cell className="tabular-nums text-tertiary">
                                            {row.registrations} / {row.capacity}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Badge size="sm" type="pill-color" color={status.color}>
                                                {status.label}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell className="text-right tabular-nums text-tertiary">{money(row.total)}</Table.Cell>
                                        <Table.Cell className="text-right tabular-nums text-tertiary">{money(row.paid)}</Table.Cell>
                                        <Table.Cell className="text-right tabular-nums">
                                            <span className={balance > 0 ? "font-medium text-error-primary" : "font-medium text-success-primary"}>
                                                {money(balance)}
                                            </span>
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            }}
                        </Table.Body>
                    </Table>
                    <div className="flex items-center justify-between gap-4 border-t border-secondary px-4 py-3">
                        <Button size="sm" color="secondary" iconLeading={ArrowLeft}>
                            Previous
                        </Button>
                        <span className="text-sm text-tertiary">Page 1 of 9</span>
                        <Button size="sm" color="secondary" iconTrailing={ArrowRight}>
                            Next
                        </Button>
                    </div>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

interface Registrant {
    id: string;
    name: string;
    type: "Member" | "Guest";
    team: string;
    handicap: number;
    amount: number;
    paid: boolean;
    avatar?: string;
}

const registrants: Registrant[] = [
    { id: "1", name: "Olivia Chen", type: "Member", team: "Team 1", handicap: 8, amount: 175, paid: true, avatar: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80" },
    { id: "2", name: "Marcus Bennett", type: "Guest", team: "Team 1", handicap: 14, amount: 220, paid: true },
    { id: "3", name: "Priya Nair", type: "Member", team: "Team 2", handicap: 5, amount: 175, paid: true, avatar: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80" },
    { id: "4", name: "James Park", type: "Guest", team: "Team 2", handicap: 18, amount: 220, paid: false },
    { id: "5", name: "Dana Lee", type: "Member", team: "Team 3", handicap: 11, amount: 175, paid: true, avatar: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80" },
    { id: "6", name: "Chris Wu", type: "Guest", team: "Team 3", handicap: 22, amount: 220, paid: false },
    { id: "7", name: "Sofia Rossi", type: "Member", team: "Team 4", handicap: 9, amount: 175, paid: true, avatar: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80" },
    { id: "8", name: "Aaron Cole", type: "Guest", team: "Team 4", handicap: 16, amount: 220, paid: true },
];

/** Event details — a single tournament with its registration roster, billing, and schedule. */
export const EventDetails: Story = {
    render: () => (
        <AppShell activeUrl="/events/details">
            <PageHeader
                title="2026 Member-Guest Invitational"
                subtitle="Sep 12 – 13, 2026 · 4-person scramble · The Sagamore Course"
                action={
                    <div className="flex items-center gap-2">
                        <Button size="md" color="secondary">
                            Edit event
                        </Button>
                        <Button size="md" iconLeading={Plus}>
                            Add registrant
                        </Button>
                    </div>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard title="Registrations" value="84 / 96" icon={Users01} />
                    <MetricCard title="Total billed" value="$16,688" icon={CurrencyDollar} />
                    <MetricCard title="Collected" value="$9,420" change={12} icon={Trophy01} />
                    <MetricCard title="Days until start" value="50" icon={Clock} />
                </div>

                <TableCard.Root>
                    <TableCard.Header
                        title="Registrants"
                        badge={
                            <Badge size="sm" type="pill-color" color="brand">
                                84 players
                            </Badge>
                        }
                        description="Everyone entered in the field, grouped by team."
                        contentTrailing={
                            <Button size="sm" color="secondary" iconLeading={Download01}>
                                Export roster
                            </Button>
                        }
                    />
                    <Table aria-label="Registrants">
                        <Table.Header>
                            <Table.Head label="Player" isRowHeader />
                            <Table.Head label="Type" className="w-28" />
                            <Table.Head label="Team" className="w-28" />
                            <Table.Head label="Handicap" className="w-28 text-right" />
                            <Table.Head label="Entry fee" className="w-28 text-right" />
                            <Table.Head label="Payment" className="w-32" />
                        </Table.Header>
                        <Table.Body items={registrants}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell>
                                        <div className="flex items-center gap-2.5">
                                            <Avatar size="sm" src={row.avatar} alt={row.name} initials={row.name.charAt(0)} />
                                            <span className="text-sm font-medium text-primary">{row.name}</span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge size="sm" type="pill-color" color={row.type === "Member" ? "brand" : "gray"}>
                                            {row.type}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.team}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.handicap}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{money(row.amount)}</Table.Cell>
                                    <Table.Cell>
                                        <Badge size="sm" type="pill-color" color={row.paid ? "success" : "warning"}>
                                            {row.paid ? "Paid" : "Balance due"}
                                        </Badge>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <div className="flex items-center justify-between gap-4 border-t border-secondary px-4 py-3">
                        <Button size="sm" color="secondary" iconLeading={ArrowLeft}>
                            Previous
                        </Button>
                        <span className="text-sm text-tertiary">Showing 1 – 8 of 84</span>
                        <Button size="sm" color="secondary" iconTrailing={ArrowRight}>
                            Next
                        </Button>
                    </div>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

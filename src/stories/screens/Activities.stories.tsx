import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Activity, ArrowLeft, ArrowRight, FilterLines, HeartHand, Plus, SearchLg, Settings01, Trophy01 } from "@untitledui/icons";
import type { FC } from "react";
import { AppShell } from "@/components/application/app-navigation/app-shell";
import { PageHeader } from "@/components/application/screen-kit";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Toggle } from "@/components/base/toggle/toggle";

const meta = {
    title: "App Screens/Activities",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;


/** Search + filter toolbar reused across the list screens. */
const ListToolbar = ({ label }: { label: string }) => (
    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
        <Input size="sm" aria-label={label} placeholder="Search" icon={SearchLg} wrapperClassName="sm:w-80" />
        <Button size="sm" color="secondary" iconLeading={FilterLines}>
            Filters
        </Button>
    </div>
);

const DayBadges = ({ days }: { days: string[] }) => (
    <div className="flex flex-wrap gap-1">
        {days.map((d) => (
            <Badge key={d} size="sm" type="pill-color" color="gray">
                {d}
            </Badge>
        ))}
    </div>
);

const ALL_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ---------------------------------------------------------------- Resources */

interface Resource {
    id: string;
    title: string;
    type: string;
    maxCapacity: number;
    maxBookingDays: number;
}

const resources: Resource[] = [
    { id: "1", title: "Pickleball Courts", type: "Courts", maxCapacity: 6, maxBookingDays: 8 },
    { id: "2", title: "Tennis Courts", type: "Courts", maxCapacity: 4, maxBookingDays: 14 },
    { id: "3", title: "Fitness Studio", type: "Fitness", maxCapacity: 20, maxBookingDays: 7 },
    { id: "4", title: "Physical Therapy Room", type: "Physical Therapy", maxCapacity: 2, maxBookingDays: 30 },
    { id: "5", title: "Yoga Lawn", type: "Fitness", maxCapacity: 24, maxBookingDays: 10 },
];

/** Activity Resources — the bookable facilities (courts, studios, rooms). */
export const Resources_: Story = {
    name: "Resources",
    render: () => (
        <AppShell activeUrl="/activities/resources">
            <PageHeader
                title="Activity Resources"
                subtitle="Bookable facilities at Sagamore Spring Golf Club."
                action={
                    <Button iconLeading={Plus} size="md">
                        New resource
                    </Button>
                }
            />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <ListToolbar label="Search resources" />
                    <Table aria-label="Activity resources">
                        <Table.Header>
                            <Table.Head label="Title" isRowHeader />
                            <Table.Head label="Type" />
                            <Table.Head label="Max Capacity" className="w-40 text-right" />
                            <Table.Head label="Max Booking Days" className="w-48 text-right" />
                        </Table.Header>
                        <Table.Body items={resources}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary">{row.title}</Table.Cell>
                                    <Table.Cell>
                                        <Badge size="sm" type="pill-color" color="gray">
                                            {row.type}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell className="text-right tabular-nums">{row.maxCapacity}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums">{row.maxBookingDays}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* -------------------------------------------------------------------- Fees */

interface Fee {
    id: string;
    title: string;
    type: string;
    price: string;
    minutes: number;
    priority: number;
    days: string[];
}

const fees: Fee[] = [
    { id: "1", title: "Pickleball — Public", type: "Courts", price: "$10.00", minutes: 60, priority: 0, days: ALL_DAYS },
    { id: "2", title: "Pickleball — Member", type: "Courts", price: "$0.00", minutes: 60, priority: 1, days: ALL_DAYS },
    { id: "3", title: "Tennis — Peak", type: "Courts", price: "$18.00", minutes: 90, priority: 0, days: ["Fri", "Sat", "Sun"] },
    { id: "4", title: "Fitness Class Drop-in", type: "Fitness", price: "$15.00", minutes: 45, priority: 2, days: ["Mon", "Wed", "Fri"] },
    { id: "5", title: "Physical Therapy Session", type: "Physical Therapy", price: "$60.00", minutes: 60, priority: 0, days: ["Tue", "Thu"] },
];

/** Activity Fees — pricing rules per resource type, duration, and day. */
export const Fees_: Story = {
    name: "Fees",
    render: () => (
        <AppShell activeUrl="/activities/fees">
            <PageHeader
                title="Activity Fees"
                subtitle="Pricing rules applied to activity bookings."
                action={
                    <Button iconLeading={Plus} size="md">
                        New fee
                    </Button>
                }
            />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <ListToolbar label="Search fees" />
                    <Table aria-label="Activity fees">
                        <Table.Header>
                            <Table.Head label="Title" isRowHeader />
                            <Table.Head label="Type" />
                            <Table.Head label="Price" className="w-28 text-right" />
                            <Table.Head label="Minutes" className="w-24 text-right" />
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
                                    <Table.Cell className="text-right tabular-nums">{row.priority}</Table.Cell>
                                    <Table.Cell>
                                        <DayBadges days={row.days} />
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

/* --------------------------------------------------------------- Schedules */

interface Schedule {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    gap: number;
    days: string[];
}

const schedules: Schedule[] = [
    { id: "1", title: "Members Only", startDate: "Jan 31, 2026", endDate: "Dec 31, 2027", startTime: "8:00 PM", endTime: "11:30 PM", gap: 30, days: ALL_DAYS },
    { id: "2", title: "Normal Daily Hours", startDate: "Jan 01, 2024", endDate: "Jan 01, 2030", startTime: "10:00 AM", endTime: "7:59 PM", gap: 30, days: ALL_DAYS },
    { id: "3", title: "Pickleball", startDate: "Jan 26, 2026", endDate: "Jul 31, 2026", startTime: "6:00 AM", endTime: "11:00 PM", gap: 60, days: ALL_DAYS },
    { id: "4", title: "Fitness Mornings", startDate: "Feb 01, 2026", endDate: "Dec 31, 2026", startTime: "5:30 AM", endTime: "10:00 AM", gap: 45, days: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
];

/** Activity Schedules — recurring availability windows for resources. */
export const Schedules_: Story = {
    name: "Schedules",
    render: () => (
        <AppShell activeUrl="/activities/schedules">
            <PageHeader
                title="Activity Schedules"
                subtitle="Availability windows and booking gaps per resource."
                action={
                    <Button iconLeading={Plus} size="md">
                        New schedule
                    </Button>
                }
            />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <ListToolbar label="Search schedules" />
                    <Table aria-label="Activity schedules">
                        <Table.Header>
                            <Table.Head label="Title" isRowHeader />
                            <Table.Head label="Start Date" className="w-32" />
                            <Table.Head label="End Date" className="w-32" />
                            <Table.Head label="Start Time" className="w-28" />
                            <Table.Head label="End Time" className="w-28" />
                            <Table.Head label="Gap (min)" className="w-24 text-right" />
                            <Table.Head label="Days" />
                        </Table.Header>
                        <Table.Body items={schedules}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary">{row.title}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.startDate}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.endDate}</Table.Cell>
                                    <Table.Cell className="tabular-nums">{row.startTime}</Table.Cell>
                                    <Table.Cell className="tabular-nums">{row.endTime}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums">{row.gap}</Table.Cell>
                                    <Table.Cell>
                                        <DayBadges days={row.days} />
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

/* ---------------------------------------------------------------- Bookings */

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
    { id: "1", resource: "Pickleball Courts", customer: "Jarrette Schule", start: "Apr 13, 2026 06:00 PM", end: "Apr 13, 2026 07:00 PM", players: 2, purchased: true },
    { id: "2", resource: "Pickleball Courts", customer: "Sean Butler", start: "Feb 03, 2026 12:00 PM", end: "Feb 03, 2026 01:00 PM", players: 1, purchased: false },
    { id: "3", resource: "Pickleball Courts", customer: "Sean Butler", start: "Jan 30, 2026 03:00 PM", end: "Jan 30, 2026 04:00 PM", players: 1, purchased: true },
    { id: "4", resource: "Pickleball Courts", customer: "Sean Butler", start: "Jan 30, 2026 01:00 PM", end: "Jan 30, 2026 02:00 PM", players: 1, purchased: false },
    { id: "5", resource: "Pickleball Courts", customer: "Sean Butler", start: "Jan 30, 2026 11:00 AM", end: "Jan 30, 2026 12:00 PM", players: 1, purchased: false },
    { id: "6", resource: "Fitness Studio", customer: "Cody Sanders", start: "Jan 13, 2026 09:30 AM", end: "Jan 13, 2026 10:30 AM", players: 1, purchased: false },
    { id: "7", resource: "Fitness Studio", customer: "Cody Sanders", start: "Jan 08, 2026 11:00 AM", end: "Jan 08, 2026 12:00 PM", players: 1, purchased: false },
    { id: "8", resource: "Tennis Courts", customer: "Avery Robertson", start: "Jan 07, 2026 01:00 PM", end: "Jan 07, 2026 02:30 PM", players: 4, purchased: false },
    { id: "9", resource: "Tennis Courts", customer: "Avery Robertson", start: "Dec 30, 2025 08:30 AM", end: "Dec 30, 2025 10:00 AM", players: 4, purchased: false },
    { id: "10", resource: "Physical Therapy Room", customer: "Kyler Brooksby", start: "Dec 15, 2025 04:15 PM", end: "Dec 15, 2025 05:45 PM", players: 5, purchased: false },
];

/** Activity Bookings — reservations across every resource. */
export const Bookings_: Story = {
    name: "Bookings",
    render: () => (
        <AppShell activeUrl="/activities/bookings">
            <PageHeader
                title="Activity Bookings"
                subtitle="Reservations across courts, studios, and treatment rooms."
                action={
                    <Button iconLeading={Plus} size="md">
                        New booking
                    </Button>
                }
            />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <ListToolbar label="Search bookings" />
                    <Table aria-label="Activity bookings">
                        <Table.Header>
                            <Table.Head label="Resource" isRowHeader />
                            <Table.Head label="Customer / Block" />
                            <Table.Head label="Start" className="w-56" />
                            <Table.Head label="End" className="w-56" />
                            <Table.Head label="Players" className="w-24 text-right" />
                            <Table.Head label="Purchased" className="w-32" />
                        </Table.Header>
                        <Table.Body items={bookings}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary">{row.resource}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.customer}</Table.Cell>
                                    <Table.Cell className="tabular-nums">{row.start}</Table.Cell>
                                    <Table.Cell className="tabular-nums">{row.end}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums">{row.players}</Table.Cell>
                                    <Table.Cell>
                                        {row.purchased ? (
                                            <Badge size="sm" type="pill-color" color="success">
                                                Paid
                                            </Badge>
                                        ) : (
                                            <Badge size="sm" type="pill-color" color="gray">
                                                Pending
                                            </Badge>
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <div className="flex items-center justify-between gap-4 border-t border-secondary px-4 py-3">
                        <span className="text-sm text-tertiary">Showing 1–10 of 11</span>
                        <div className="flex items-center gap-2">
                            <Button size="sm" color="secondary" iconLeading={ArrowLeft} isDisabled>
                                Prev
                            </Button>
                            <Button size="sm" color="secondary" iconTrailing={ArrowRight}>
                                Next
                            </Button>
                        </div>
                    </div>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ---------------------------------------------------------------- Settings */

const SETTING_TOGGLES = [
    { label: "Require Card on File", on: false },
    { label: "Require Email", on: true },
    { label: "Require Name", on: true },
    { label: "Require Phone", on: false },
    { label: "Disable Reserve", on: false },
    { label: "Disable Cart", on: false },
    { label: "Members Only", on: false },
    { label: "Share Slots", on: true },
];

interface SettingsGroup {
    id: string;
    title: string;
    icon: FC<{ className?: string }>;
    toggles: { label: string; on: boolean }[];
    hoursBeforeCancellation: string;
    nextDayReleaseTime: string;
}

const settingsGroups: SettingsGroup[] = [
    {
        id: "courts",
        title: "Courts",
        icon: Trophy01,
        toggles: SETTING_TOGGLES,
        hoursBeforeCancellation: "24",
        nextDayReleaseTime: "6:00 AM",
    },
    {
        id: "fitness",
        title: "Fitness",
        icon: Activity,
        toggles: SETTING_TOGGLES.map((t) => (t.label === "Members Only" ? { ...t, on: true } : t)),
        hoursBeforeCancellation: "12",
        nextDayReleaseTime: "5:00 AM",
    },
    {
        id: "physical-therapy",
        title: "Physical Therapy",
        icon: HeartHand,
        toggles: SETTING_TOGGLES.map((t) => (t.label === "Require Card on File" ? { ...t, on: true } : t)),
        hoursBeforeCancellation: "48",
        nextDayReleaseTime: "7:00 AM",
    },
];

/** Activity Settings — booking policy toggles grouped by resource type. */
export const Settings_: Story = {
    name: "Settings",
    render: () => (
        <AppShell activeUrl="/activities/settings">
            <PageHeader
                title="Activity Settings"
                subtitle="Booking requirements and release policies per resource type."
                action={
                    <Button iconLeading={Settings01} size="md">
                        Save changes
                    </Button>
                }
            />
            <div className="flex flex-col gap-6 p-6 lg:p-8">
                {settingsGroups.map((group) => {
                    const Icon = group.icon;
                    return (
                        <section key={group.id} className="rounded-xl bg-primary ring-1 ring-secondary ring-inset">
                            <div className="flex items-center gap-2.5 border-b border-secondary px-5 py-4">
                                <Icon className="size-5 text-fg-quaternary" aria-hidden="true" />
                                <h2 className="text-md font-semibold text-primary">{group.title}</h2>
                            </div>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:grid-cols-2 lg:grid-cols-4">
                                {group.toggles.map((t) => (
                                    <Toggle key={t.label} label={t.label} isSelected={t.on} />
                                ))}
                            </div>
                            <div className="grid grid-cols-1 gap-5 border-t border-secondary p-5 sm:grid-cols-2">
                                <Input
                                    size="sm"
                                    label="Hours Before Cancellation"
                                    defaultValue={group.hoursBeforeCancellation}
                                    aria-label="Hours before cancellation"
                                />
                                <Input
                                    size="sm"
                                    label="Next Day Release Time"
                                    defaultValue={group.nextDayReleaseTime}
                                    aria-label="Next day release time"
                                />
                            </div>
                        </section>
                    );
                })}
            </div>
        </AppShell>
    ),
};

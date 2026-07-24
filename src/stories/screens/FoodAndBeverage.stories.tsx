import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
    ArrowLeft,
    ArrowRight,
    CalendarCheck01,
    CalendarPlus01,
    Clock,
    CurrencyDollar,
    Download01,
    Edit01,
    FilterLines,
    Mail01,
    Phone,
    Plus,
    SearchLg,
    Users01,
} from "@untitledui/icons";
import { AppShell } from "@/components/application/app-navigation/app-shell";
import { PageHeader } from "@/components/application/screen-kit";
import { MetricCard } from "@/components/application/metrics/metric-card";
import { Table, TableCard } from "@/components/application/table/table";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { sagamoreImagesByCategory } from "@/components/foundations/sagamore/sagamore-assets";

const meta = {
    title: "App Screens/F & B",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;


/* -------------------------------------------------------------------------- */
/* Reservations                                                               */
/* -------------------------------------------------------------------------- */

interface Reservation {
    id: string;
    date: string;
    time: string;
    partySize: number;
    name: string;
    email: string;
    phone: string;
    group: string;
    status: "confirmed" | "seated" | "pending" | "cancelled";
    notes: string;
    avatar?: string;
}

const reservations: Reservation[] = [
    { id: "R-4821", date: "Jul 24, 2026", time: "6:00 PM", partySize: 4, name: "Olivia Chen", email: "olivia.chen@example.com", phone: "(617) 555-0142", group: "Twilight League", status: "confirmed", notes: "Window table requested", avatar: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80" },
    { id: "R-4822", date: "Jul 24, 2026", time: "6:15 PM", partySize: 2, name: "Marcus Bennett", email: "marcus@example.com", phone: "(617) 555-0188", group: "—", status: "seated", notes: "Anniversary" },
    { id: "R-4823", date: "Jul 24, 2026", time: "6:30 PM", partySize: 6, name: "Priya Nair", email: "priya.nair@example.com", phone: "(781) 555-0110", group: "Ladies Clinic", status: "confirmed", notes: "1 high chair", avatar: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80" },
    { id: "R-4824", date: "Jul 24, 2026", time: "7:00 PM", partySize: 8, name: "James Park", email: "james.park@example.com", phone: "(978) 555-0164", group: "Member Outing", status: "pending", notes: "Prepaid deposit" },
    { id: "R-4825", date: "Jul 24, 2026", time: "7:15 PM", partySize: 3, name: "Dana Lee", email: "dana.lee@example.com", phone: "(617) 555-0199", group: "—", status: "confirmed", notes: "Gluten-free menu", avatar: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80" },
    { id: "R-4826", date: "Jul 24, 2026", time: "7:30 PM", partySize: 2, name: "Chris Wu", email: "chris.wu@example.com", phone: "(603) 555-0121", group: "—", status: "cancelled", notes: "Called to cancel" },
    { id: "R-4827", date: "Jul 24, 2026", time: "7:45 PM", partySize: 5, name: "Sofia Rossi", email: "sofia.rossi@example.com", phone: "(617) 555-0173", group: "Birthday", status: "confirmed", notes: "Cake at table", avatar: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80" },
    { id: "R-4828", date: "Jul 24, 2026", time: "8:00 PM", partySize: 4, name: "Aaron Cole", email: "aaron.cole@example.com", phone: "(781) 555-0155", group: "Post-Round", status: "pending", notes: "Patio if available" },
];

const statusBadge = {
    confirmed: <BadgeWithDot size="sm" type="pill-color" color="success">Confirmed</BadgeWithDot>,
    seated: <BadgeWithDot size="sm" type="pill-color" color="brand">Seated</BadgeWithDot>,
    pending: <BadgeWithDot size="sm" type="pill-color" color="warning">Pending</BadgeWithDot>,
    cancelled: <BadgeWithDot size="sm" type="pill-color" color="gray">Cancelled</BadgeWithDot>,
} as const;

/** Restaurant Reservations — the booking book for the clubhouse dining room, with a live-day summary and a searchable reservations table. */
export const Reservations: Story = {
    render: () => (
        <AppShell activeUrl="/f-and-b/restaurant/reservations">
            <PageHeader
                title="Restaurant Reservations"
                subtitle="The Grille Room at Sagamore Spring Golf Club · Friday, Jul 24"
                action={
                    <Button iconLeading={Plus} size="md">
                        New reservation
                    </Button>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                {/* Day summary */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard title="Covers today" value="164" change={12} changeLabel="vs last Fri" icon={Users01} />
                    <MetricCard title="Reservations" value="42" change={8} changeLabel="vs last Fri" icon={CalendarCheck01} />
                    <MetricCard title="Seated now" value="9" changeLabel="tables in service" icon={Clock} />
                    <MetricCard title="Projected sales" value="$6,820" change={5} changeLabel="vs last Fri" icon={CurrencyDollar} />
                </div>

                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input size="sm" aria-label="Search reservations" placeholder="Search name, phone, or ID" icon={SearchLg} wrapperClassName="sm:w-80" />
                        <div className="flex items-center gap-2">
                            <Button size="sm" color="secondary" iconLeading={FilterLines}>
                                Filters
                            </Button>
                            <Button size="sm" color="secondary" iconLeading={Download01}>
                                Export
                            </Button>
                        </div>
                    </div>
                    <Table aria-label="Reservations">
                        <Table.Header>
                            <Table.Head label="ID" isRowHeader className="w-24" />
                            <Table.Head label="Time" className="w-24" />
                            <Table.Head label="Party" className="w-20" />
                            <Table.Head label="Guest" />
                            <Table.Head label="Contact" />
                            <Table.Head label="Group" className="w-40" />
                            <Table.Head label="Status" className="w-36" />
                            <Table.Head label="Notes" />
                        </Table.Header>
                        <Table.Body items={reservations}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary tabular-nums">{row.id}</Table.Cell>
                                    <Table.Cell className="tabular-nums text-secondary">{row.time}</Table.Cell>
                                    <Table.Cell className="tabular-nums text-secondary">{row.partySize}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center gap-2.5">
                                            <Avatar size="sm" src={row.avatar} alt={row.name} initials={row.name.charAt(0)} />
                                            <span className="text-sm font-medium text-primary">{row.name}</span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div className="flex flex-col">
                                            <span className="text-tertiary">{row.email}</span>
                                            <span className="tabular-nums text-tertiary">{row.phone}</span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.group}</Table.Cell>
                                    <Table.Cell>{statusBadge[row.status]}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.notes}</Table.Cell>
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

/* -------------------------------------------------------------------------- */
/* Restaurant (menu / overview)                                               */
/* -------------------------------------------------------------------------- */

const diningImages = sagamoreImagesByCategory("dining");
const dishImg = (i: number) => diningImages[i % diningImages.length]?.src;

interface MenuItem {
    id: string;
    name: string;
    description: string;
    category: string;
    price: string;
    status: "available" | "86'd";
    image?: string;
}

const menuItems: MenuItem[] = [
    { id: "1", name: "Chilled Oysters, Half Dozen", description: "Local mignonette, cocktail sauce, lemon", category: "Starters", price: "$18", status: "available", image: dishImg(1) },
    { id: "2", name: "Grille Room Burger", description: "Dry-aged beef, aged cheddar, house pickles, fries", category: "Mains", price: "$21", status: "available", image: dishImg(0) },
    { id: "3", name: "Grilled Ribeye", description: "12oz, roasted potatoes, seasonal vegetables", category: "Mains", price: "$42", status: "available", image: dishImg(2) },
    { id: "4", name: "Clubhouse Caesar", description: "Baby gem, parmesan crisp, white anchovy", category: "Starters", price: "$14", status: "available" },
    { id: "5", name: "Fish & Chips", description: "Beer-battered haddock, tartar, malt vinegar", category: "Mains", price: "$24", status: "86'd" },
    { id: "6", name: "Warm Apple Crumble", description: "Vanilla bean ice cream, salted caramel", category: "Desserts", price: "$11", status: "available" },
];

const categoryColor: Record<string, "brand" | "blue" | "purple"> = {
    Starters: "blue",
    Mains: "brand",
    Desserts: "purple",
};

/** Restaurant — the clubhouse dining overview: today's service snapshot and the live menu with 86'd items. */
export const Restaurant: Story = {
    render: () => (
        <AppShell activeUrl="/f-and-b/restaurant">
            <PageHeader
                title="Restaurant"
                subtitle="The Grille Room — menu, service, and floor at Sagamore Spring."
                action={
                    <div className="flex items-center gap-2">
                        <Button size="md" color="secondary" iconLeading={CalendarPlus01} href="/f-and-b/restaurant/reservations">
                            Reservations
                        </Button>
                        <Button iconLeading={Plus} size="md">
                            Add menu item
                        </Button>
                    </div>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard title="Open tables" value="7" changeLabel="of 24 in service" icon={Users01} />
                    <MetricCard title="Avg. check" value="$41.60" change={6} icon={CurrencyDollar} />
                    <MetricCard title="Turn time" value="72 min" change={-4} changeLabel="vs last week" icon={Clock} />
                    <MetricCard title="Items 86'd" value="1" changeLabel="on the menu today" icon={Edit01} />
                </div>

                <TableCard.Root>
                    <TableCard.Header title="Menu" badge={`${menuItems.length} items`} description="Live menu for the current service. 86'd items are hidden from guest-facing ordering." />
                    <Table aria-label="Menu">
                        <Table.Header>
                            <Table.Head label="Item" isRowHeader />
                            <Table.Head label="Category" className="w-40" />
                            <Table.Head label="Price" className="w-28" />
                            <Table.Head label="Status" className="w-36" />
                            <Table.Head label="" className="w-16" />
                        </Table.Header>
                        <Table.Body items={menuItems}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell>
                                        <div className="flex items-center gap-3">
                                            {row.image ? (
                                                <img src={row.image} alt={row.name} className="size-11 shrink-0 rounded-lg object-cover ring-1 ring-secondary" />
                                            ) : (
                                                <div className="size-11 shrink-0 rounded-lg bg-secondary ring-1 ring-secondary" />
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-primary">{row.name}</span>
                                                <span className="text-xs text-tertiary">{row.description}</span>
                                            </div>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge size="sm" type="pill-color" color={categoryColor[row.category]}>
                                            {row.category}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell className="font-medium text-primary tabular-nums">{row.price}</Table.Cell>
                                    <Table.Cell>
                                        {row.status === "available" ? (
                                            <BadgeWithDot size="sm" type="pill-color" color="success">
                                                Available
                                            </BadgeWithDot>
                                        ) : (
                                            <BadgeWithDot size="sm" type="pill-color" color="error">
                                                86&apos;d
                                            </BadgeWithDot>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button size="sm" color="tertiary" iconLeading={Edit01} aria-label={`Edit ${row.name}`} />
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </TableCard.Root>

                {/* Upcoming reservations rail */}
                <TableCard.Root>
                    <TableCard.Header title="Next up" description="The next parties expected in the dining room." />
                    <div className="divide-y divide-secondary">
                        {reservations
                            .filter((r) => r.status !== "cancelled")
                            .slice(0, 4)
                            .map((r) => (
                                <div key={r.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar size="md" src={r.avatar} alt={r.name} initials={r.name.charAt(0)} />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-primary">{r.name}</span>
                                            <span className="text-xs text-tertiary">
                                                Party of {r.partySize} · {r.notes}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-1.5 text-sm text-secondary">
                                            <Clock className="size-4 text-fg-quaternary" aria-hidden="true" />
                                            <span className="tabular-nums">{r.time}</span>
                                        </div>
                                        <div className="hidden items-center gap-4 text-tertiary sm:flex">
                                            <span className="flex items-center gap-1.5 text-sm">
                                                <Phone className="size-4 text-fg-quaternary" aria-hidden="true" />
                                                <span className="tabular-nums">{r.phone}</span>
                                            </span>
                                            <span className="flex items-center gap-1.5 text-sm">
                                                <Mail01 className="size-4 text-fg-quaternary" aria-hidden="true" />
                                                {r.email}
                                            </span>
                                        </div>
                                        {statusBadge[r.status]}
                                    </div>
                                </div>
                            ))}
                    </div>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

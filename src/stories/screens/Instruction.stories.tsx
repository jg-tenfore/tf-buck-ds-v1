import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDate,
    CheckCircle,
    Download01,
    Edit01,
    File02,
    FilterLines,
    Mail01,
    Plus,
    Printer,
    SearchLg,
    SlashCircle01,
    Trash01,
} from "@untitledui/icons";
import { AppShell } from "@/components/application/app-navigation/app-shell";
import { PageHeader } from "@/components/application/screen-kit";
import { Table, TableCard, TableRowActionsDropdown } from "@/components/application/table/table";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge, BadgeWithIcon } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";

const meta = {
    title: "App Screens/Instruction",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;


/* -------------------------------------------------------------------------- */
/* Templates                                                                  */
/* -------------------------------------------------------------------------- */

interface ClinicTemplate {
    id: string;
    title: string;
    type: "Clinic" | "Camp" | "Private Lesson";
    ageRange: string;
    gender: "Any" | "Men" | "Women";
    discount: string;
    live: boolean;
    instances: number;
}

const templates: ClinicTemplate[] = [
    { id: "t1", title: "3 Week November", type: "Clinic", ageRange: "3 – 15", gender: "Any", discount: "3+ / $5.00", live: true, instances: 6 },
    { id: "t2", title: "4 Week December", type: "Clinic", ageRange: "1 – 99", gender: "Any", discount: "4+ / $5.00", live: true, instances: 4 },
    { id: "t3", title: "5 Week October", type: "Clinic", ageRange: "3 – 15", gender: "Any", discount: "5+ / $5.00", live: true, instances: 5 },
    { id: "t4", title: "Advanced Techniques", type: "Clinic", ageRange: "0 – 99", gender: "Any", discount: "—", live: true, instances: 47 },
    { id: "t5", title: "Beginner Golfer", type: "Clinic", ageRange: "0 – 99", gender: "Any", discount: "5+ / 30%", live: true, instances: 19 },
    { id: "t6", title: "Driver Clinic", type: "Clinic", ageRange: "18 – 99", gender: "Any", discount: "3+ / 50%", live: true, instances: 71 },
    { id: "t7", title: "Fall Get Golf Ready — Men's", type: "Clinic", ageRange: "18 – 100", gender: "Men", discount: "—", live: true, instances: 12 },
    { id: "t8", title: "Fall Stroke Saver — Ladies", type: "Clinic", ageRange: "18 – 100", gender: "Women", discount: "4+ / $20.00", live: true, instances: 36 },
    { id: "t9", title: "Girls Summer Camp", type: "Camp", ageRange: "7 – 16", gender: "Women", discount: "3+ / 50%", live: true, instances: 184 },
    { id: "t10", title: "Junior Camp (Age 8–12)", type: "Camp", ageRange: "8 – 12", gender: "Any", discount: "3+ / 25%", live: true, instances: 8 },
    { id: "t11", title: "Private Lessons — 1 Hour", type: "Private Lesson", ageRange: "0 – 99", gender: "Any", discount: "—", live: true, instances: 25 },
    { id: "t12", title: "Barebones Template", type: "Clinic", ageRange: "—", gender: "Any", discount: "—", live: false, instances: 0 },
];

const typeColor: Record<ClinicTemplate["type"], "brand" | "purple" | "blue"> = {
    Clinic: "brand",
    Camp: "purple",
    "Private Lesson": "blue",
};

/** Clinic Templates — the reusable blueprints instructors publish sessions from. */
export const ClinicTemplates: Story = {
    name: "Clinic Templates",
    render: () => (
        <AppShell activeUrl="/instruction/clinics/templates">
            <PageHeader
                title="Clinic Templates"
                subtitle="Reusable blueprints for clinics, camps, and private lessons at Sagamore."
                action={
                    <Button iconLeading={Plus} size="md">
                        Add template
                    </Button>
                }
            />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input size="sm" aria-label="Search templates" placeholder="Search by title" icon={SearchLg} wrapperClassName="sm:w-80" />
                        <div className="flex items-center gap-2">
                            <Button size="sm" color="secondary" iconLeading={FilterLines}>
                                Filters
                            </Button>
                            <Button size="sm" color="secondary" iconLeading={Download01}>
                                Export
                            </Button>
                        </div>
                    </div>
                    <Table aria-label="Clinic templates">
                        <Table.Header>
                            <Table.Head label="Title" isRowHeader />
                            <Table.Head label="Type" className="w-40" />
                            <Table.Head label="Age range" className="w-32" />
                            <Table.Head label="Gender" className="w-28" />
                            <Table.Head label="Discount" className="w-36" />
                            <Table.Head label="Live" className="w-24" />
                            <Table.Head label="Instances" className="w-28 text-right" />
                            <Table.Head label="" className="w-16" />
                        </Table.Header>
                        <Table.Body items={templates}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary">{row.title}</Table.Cell>
                                    <Table.Cell>
                                        <Badge size="sm" type="pill-color" color={typeColor[row.type]}>
                                            {row.type}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.ageRange}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.gender}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.discount}</Table.Cell>
                                    <Table.Cell>
                                        {row.live ? (
                                            <BadgeWithIcon size="sm" type="pill-color" color="success" iconLeading={CheckCircle}>
                                                Live
                                            </BadgeWithIcon>
                                        ) : (
                                            <Badge size="sm" type="pill-color" color="gray">
                                                Draft
                                            </Badge>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell className="text-right font-medium text-primary tabular-nums">{row.instances}</Table.Cell>
                                    <Table.Cell>
                                        <TableRowActionsDropdown />
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <div className="flex items-center justify-between gap-4 border-t border-secondary px-4 py-3">
                        <span className="text-sm text-tertiary">Showing 1–12 of 38</span>
                        <div className="flex items-center gap-3">
                            <Button size="sm" color="secondary" iconLeading={ArrowLeft} isDisabled>
                                Prev
                            </Button>
                            <span className="text-sm text-tertiary">Page 1 of 2</span>
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

/* -------------------------------------------------------------------------- */
/* Instances                                                                  */
/* -------------------------------------------------------------------------- */

interface ClinicInstance {
    id: string;
    template: string;
    start: string;
    end: string;
    participants: string;
    min: number;
    price: string;
    live: boolean;
}

const instances: ClinicInstance[] = [
    { id: "1042", template: "Beginner Golfer", start: "Jul 28, 2026 · 9:00 AM", end: "Jul 28, 2026 · 10:30 AM", participants: "8 / 12", min: 4, price: "$45.00", live: true },
    { id: "1043", template: "Driver Clinic", start: "Jul 29, 2026 · 5:30 PM", end: "Jul 29, 2026 · 7:00 PM", participants: "11 / 12", min: 4, price: "$60.00", live: true },
    { id: "1044", template: "Girls Summer Camp", start: "Aug 3, 2026 · 8:00 AM", end: "Aug 7, 2026 · 12:00 PM", participants: "16 / 20", min: 6, price: "$220.00", live: true },
    { id: "1045", template: "Advanced Techniques", start: "Aug 5, 2026 · 4:00 PM", end: "Aug 5, 2026 · 5:30 PM", participants: "6 / 10", min: 4, price: "$75.00", live: true },
    { id: "1046", template: "Fall Stroke Saver — Ladies", start: "Aug 12, 2026 · 10:00 AM", end: "Aug 12, 2026 · 11:30 AM", participants: "3 / 12", min: 4, price: "$55.00", live: false },
    { id: "1047", template: "Junior Camp (Age 8–12)", start: "Aug 17, 2026 · 9:00 AM", end: "Aug 21, 2026 · 12:00 PM", participants: "14 / 16", min: 6, price: "$185.00", live: true },
];

/** Clinic Instances — the scheduled sessions published from templates, filterable by date and status. */
export const ClinicInstances: Story = {
    name: "Clinic Instances",
    render: () => (
        <AppShell activeUrl="/instruction/clinics/instances">
            <PageHeader
                title="Clinic Instances"
                subtitle="Scheduled clinic sessions across the season."
                action={
                    <div className="flex items-center gap-2">
                        <Button size="md" color="secondary" iconLeading={Mail01}>
                            Email participants
                        </Button>
                        <Button size="md" iconLeading={Plus}>
                            Add instance
                        </Button>
                    </div>
                }
            />
            <div className="p-6 lg:p-8">
                {/* Filter bar */}
                <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Select label="Template" placeholder="All templates" items={templates.map((t) => ({ id: t.id, label: t.title }))}>
                        {(item) => <Select.Item id={item.id} label={item.label} />}
                    </Select>
                    <Input size="md" label="Start date" placeholder="mm/dd/yyyy" icon={CalendarDate} />
                    <Input size="md" label="End date" placeholder="mm/dd/yyyy" icon={CalendarDate} />
                    <Select
                        label="Live"
                        placeholder="Any"
                        items={[
                            { id: "any", label: "Any" },
                            { id: "yes", label: "Live only" },
                            { id: "no", label: "Draft only" },
                        ]}
                    >
                        {(item) => <Select.Item id={item.id} label={item.label} />}
                    </Select>
                </div>

                <TableCard.Root>
                    <Table aria-label="Clinic instances">
                        <Table.Header>
                            <Table.Head label="ID" isRowHeader className="w-24" />
                            <Table.Head label="Template" />
                            <Table.Head label="Start" className="w-52" />
                            <Table.Head label="End" className="w-52" />
                            <Table.Head label="Participants" className="w-32" />
                            <Table.Head label="Min" className="w-20 text-right" />
                            <Table.Head label="Price" className="w-28 text-right" />
                            <Table.Head label="Live" className="w-24" />
                        </Table.Header>
                        <Table.Body items={instances}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary tabular-nums">{row.id}</Table.Cell>
                                    <Table.Cell className="font-medium text-primary">{row.template}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.start}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.end}</Table.Cell>
                                    <Table.Cell className="tabular-nums">{row.participants}</Table.Cell>
                                    <Table.Cell className="text-right text-tertiary tabular-nums">{row.min}</Table.Cell>
                                    <Table.Cell className="text-right font-medium text-primary tabular-nums">{row.price}</Table.Cell>
                                    <Table.Cell>
                                        {row.live ? (
                                            <Badge size="sm" type="pill-color" color="success">
                                                Live
                                            </Badge>
                                        ) : (
                                            <Badge size="sm" type="pill-color" color="gray">
                                                Draft
                                            </Badge>
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

/* -------------------------------------------------------------------------- */
/* Waitlist                                                                    */
/* -------------------------------------------------------------------------- */

interface WaitlistEntry {
    id: string;
    name: string;
    email: string;
    phone: string;
    template: string;
    instance: string;
    avatar?: string;
}

const waitlist: WaitlistEntry[] = [
    { id: "236", name: "April Fourteen", email: "april.fourteen@example.com", phone: "—", template: "Beginner Golfer", instance: "—" },
    { id: "151", name: "Taylor Reed", email: "taylor.reed@example.com", phone: "(617) 555-0142", template: "Junior Camp (Age 8–12)", instance: "Apr 15, 2026 · 5:00 PM", avatar: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80" },
    { id: "77", name: "Austin Wride", email: "austin.wride@example.com", phone: "(817) 703-6301", template: "Junior Camp (Age 8–12)", instance: "—" },
    { id: "40", name: "Chance Hindbaugh", email: "chance.h@example.com", phone: "(810) 931-6167", template: "Junior Camp (Age 8–12)", instance: "—" },
    { id: "3", name: "Charlie Carswell", email: "charlie.c@example.com", phone: "(828) 734-3957", template: "Get Golf Ready", instance: "Nov 25, 2025 · 9:43 AM", avatar: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80" },
    { id: "2", name: "Jarrett Schule", email: "jarrett.schule@example.com", phone: "(210) 445-5887", template: "Girls Summer Camp", instance: "—" },
    { id: "1", name: "Jarrett Schule", email: "jarrett.schule@example.com", phone: "(210) 445-5887", template: "Girls Summer Camp", instance: "Aug 3, 2026 · 8:00 AM" },
];

/** Clinics Waitlist — golfers waiting on a spot, with quick export to CSV, PDF, or print. */
export const ClinicWaitlist: Story = {
    name: "Clinic Waitlist",
    render: () => (
        <AppShell activeUrl="/instruction/clinics/waitlist">
            <PageHeader
                title="Clinics Waitlist"
                subtitle="Golfers waiting on an open spot in a clinic or camp."
                action={
                    <Button iconLeading={Plus} size="md">
                        Add to waitlist
                    </Button>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                <Checkbox label="Show today only" size="sm" />

                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input size="sm" aria-label="Search waitlist" placeholder="Search by name, email, or template" icon={SearchLg} wrapperClassName="sm:w-96" />
                        <div className="flex items-center gap-2">
                            <Button size="sm" color="secondary" iconLeading={File02}>
                                CSV
                            </Button>
                            <Button size="sm" color="secondary" iconLeading={File02}>
                                PDF
                            </Button>
                            <Button size="sm" color="secondary" iconLeading={Printer}>
                                Print
                            </Button>
                        </div>
                    </div>
                    <Table aria-label="Clinics waitlist">
                        <Table.Header>
                            <Table.Head label="ID" isRowHeader className="w-20" />
                            <Table.Head label="Name" />
                            <Table.Head label="Email" />
                            <Table.Head label="Phone" className="w-40" />
                            <Table.Head label="Template" className="w-52" />
                            <Table.Head label="Instance" className="w-52" />
                            <Table.Head label="" className="w-16" />
                        </Table.Header>
                        <Table.Body items={waitlist}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.id}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center gap-2.5">
                                            <Avatar size="sm" src={row.avatar} alt={row.name} initials={row.name.charAt(0)} />
                                            <span className="text-sm font-medium text-primary">{row.name}</span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.email}</Table.Cell>
                                    <Table.Cell className="tabular-nums">{row.phone}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.template}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.instance}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center gap-1">
                                            <Button size="sm" color="tertiary" iconLeading={Edit01} aria-label="Edit entry" />
                                            <Button size="sm" color="tertiary" iconLeading={Trash01} aria-label="Remove entry" />
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

/* -------------------------------------------------------------------------- */
/* Sold                                                                        */
/* -------------------------------------------------------------------------- */

interface SoldOrder {
    id: string;
    order: string;
    customer: string;
    email: string;
    clinic: string;
    date: string;
    qty: number;
    amount: string;
    status: "Paid" | "Refunded";
    avatar?: string;
}

const soldOrders: SoldOrder[] = [
    { id: "s1", order: "#590608", customer: "Sofia Rossi", email: "sofia.rossi@example.com", clinic: "Driver Clinic", date: "Jul 22, 2026", qty: 1, amount: "$60.00", status: "Paid", avatar: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80" },
    { id: "s2", order: "#590571", customer: "Marcus Bennett", email: "marcus@example.com", clinic: "Girls Summer Camp", date: "Jul 21, 2026", qty: 2, amount: "$440.00", status: "Paid" },
    { id: "s3", order: "#590544", customer: "Priya Nair", email: "priya.nair@example.com", clinic: "Beginner Golfer", date: "Jul 20, 2026", qty: 1, amount: "$45.00", status: "Paid", avatar: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80" },
    { id: "s4", order: "#590519", customer: "James Park", email: "james.park@example.com", clinic: "Advanced Techniques", date: "Jul 19, 2026", qty: 1, amount: "$75.00", status: "Refunded" },
    { id: "s5", order: "#590482", customer: "Dana Lee", email: "dana.lee@example.com", clinic: "Junior Camp (Age 8–12)", date: "Jul 18, 2026", qty: 1, amount: "$185.00", status: "Paid", avatar: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80" },
    { id: "s6", order: "#590455", customer: "Aaron Cole", email: "aaron.cole@example.com", clinic: "Fall Stroke Saver — Ladies", date: "Jul 17, 2026", qty: 1, amount: "$55.00", status: "Paid" },
    { id: "s7", order: "#590431", customer: "Chris Wu", email: "chris.wu@example.com", clinic: "Private Lessons — 1 Hour", date: "Jul 16, 2026", qty: 3, amount: "$225.00", status: "Paid" },
];

/** Clinics Sold — the receipts for every clinic, camp, and lesson purchased. */
export const ClinicSold: Story = {
    name: "Clinic Sold",
    render: () => (
        <AppShell activeUrl="/instruction/clinics/sold">
            <PageHeader
                title="Clinics Sold"
                subtitle="Receipts for every clinic, camp, and lesson purchased."
                action={
                    <Button iconLeading={Download01} size="md" color="secondary">
                        Export
                    </Button>
                }
            />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input size="sm" aria-label="Search orders" placeholder="Search orders" icon={SearchLg} wrapperClassName="sm:w-80" />
                        <Button size="sm" color="secondary" iconLeading={FilterLines}>
                            Filters
                        </Button>
                    </div>
                    <Table aria-label="Clinics sold">
                        <Table.Header>
                            <Table.Head label="Order" isRowHeader className="w-32" />
                            <Table.Head label="Customer" />
                            <Table.Head label="Clinic" className="w-56" />
                            <Table.Head label="Date" className="w-32" />
                            <Table.Head label="Qty" className="w-20 text-right" />
                            <Table.Head label="Amount" className="w-28 text-right" />
                            <Table.Head label="Status" className="w-28" />
                        </Table.Header>
                        <Table.Body items={soldOrders}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary tabular-nums">{row.order}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center gap-2.5">
                                            <Avatar size="sm" src={row.avatar} alt={row.customer} initials={row.customer.charAt(0)} />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-primary">{row.customer}</span>
                                                <span className="text-xs text-tertiary">{row.email}</span>
                                            </div>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.clinic}</Table.Cell>
                                    <Table.Cell className="text-tertiary tabular-nums">{row.date}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums">{row.qty}</Table.Cell>
                                    <Table.Cell className="text-right font-medium text-primary tabular-nums">{row.amount}</Table.Cell>
                                    <Table.Cell>
                                        {row.status === "Paid" ? (
                                            <BadgeWithIcon size="sm" type="pill-color" color="success" iconLeading={CheckCircle}>
                                                Paid
                                            </BadgeWithIcon>
                                        ) : (
                                            <BadgeWithIcon size="sm" type="pill-color" color="error" iconLeading={SlashCircle01}>
                                                Refunded
                                            </BadgeWithIcon>
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <div className="flex items-center justify-between gap-4 border-t border-secondary px-4 py-3">
                        <span className="text-sm text-tertiary">Showing 1–7 of 342</span>
                        <div className="flex items-center gap-3">
                            <Button size="sm" color="secondary" iconLeading={ArrowLeft} isDisabled>
                                Prev
                            </Button>
                            <span className="text-sm text-tertiary">Page 1 of 49</span>
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

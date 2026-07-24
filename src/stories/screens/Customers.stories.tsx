import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowLeft, ArrowRight, Download01, FilterLines, Plus, SearchLg } from "@untitledui/icons";
import { AppShell } from "@/components/application/app-navigation/app-shell";
import { PageHeader } from "@/components/application/screen-kit";
import { Table, TableCard } from "@/components/application/table/table";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";

const meta = {
    title: "App Screens/Customers",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;


interface Customer {
    id: string;
    customerNo: string;
    name: string;
    email: string;
    phone: string;
    created: string;
    avatar?: string;
}

const customers: Customer[] = [
    { id: "222916", customerNo: "355183", name: "Olivia Chen", email: "olivia.chen@example.com", phone: "(617) 555-0142", created: "Oct 29, 2023", avatar: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80" },
    { id: "223457", customerNo: "355611", name: "Marcus Bennett", email: "marcus@example.com", phone: "(617) 555-0188", created: "Nov 3, 2023" },
    { id: "278128", customerNo: "427286", name: "Priya Nair", email: "priya.nair@example.com", phone: "(781) 555-0110", created: "Apr 8, 2024", avatar: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80" },
    { id: "282073", customerNo: "430799", name: "James Park", email: "james.park@example.com", phone: "(978) 555-0164", created: "Apr 30, 2024" },
    { id: "297311", customerNo: "444266", name: "Dana Lee", email: "dana.lee@example.com", phone: "(617) 555-0199", created: "Jul 30, 2024", avatar: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80" },
    { id: "300573", customerNo: "447348", name: "Chris Wu", email: "chris.wu@example.com", phone: "(603) 555-0121", created: "Aug 4, 2024" },
    { id: "423858", customerNo: "590608", name: "Sofia Rossi", email: "sofia.rossi@example.com", phone: "(617) 555-0173", created: "Jan 17, 2025", avatar: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80" },
    { id: "487369", customerNo: "644314", name: "Aaron Cole", email: "aaron.cole@example.com", phone: "(781) 555-0155", created: "Mar 3, 2025" },
];

const COMPANIES = ["Sample Company", "Schule Oaks", "Bushwood Country Club", "Sagamore Spring GC"];

/** Customers list — company filter chips, search + export toolbar, and a paginated table. */
export const Customers_: Story = {
    name: "Customers",
    render: () => (
        <AppShell activeUrl="/customers/list">
            <PageHeader
                title="Customers"
                subtitle="Everyone who has booked, shopped, or joined."
                action={
                    <Button iconLeading={Plus} size="md">
                        New customer
                    </Button>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                {/* Company filter chips */}
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

                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input size="sm" aria-label="Search customers" placeholder="Search" icon={SearchLg} wrapperClassName="sm:w-80" />
                        <div className="flex items-center gap-2">
                            <Button size="sm" color="secondary" iconLeading={FilterLines}>
                                Filters
                            </Button>
                            <Button size="sm" color="secondary" iconLeading={Download01}>
                                Export
                            </Button>
                        </div>
                    </div>
                    <Table aria-label="Customers">
                        <Table.Header>
                            <Table.Head label="Customer #" isRowHeader className="w-32" />
                            <Table.Head label="Name" />
                            <Table.Head label="Email" />
                            <Table.Head label="Phone" className="w-40" />
                            <Table.Head label="Created" className="w-32" />
                        </Table.Header>
                        <Table.Body items={customers}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary tabular-nums">{row.customerNo}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center gap-2.5">
                                            <Avatar size="sm" src={row.avatar} alt={row.name} initials={row.name.charAt(0)} />
                                            <span className="text-sm font-medium text-primary">{row.name}</span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.email}</Table.Cell>
                                    <Table.Cell className="tabular-nums">{row.phone}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.created}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <div className="flex items-center justify-between gap-4 border-t border-secondary px-4 py-3">
                        <Button size="sm" color="secondary" iconLeading={ArrowLeft}>
                            Previous
                        </Button>
                        <span className="text-sm text-tertiary">Page 1 of 128</span>
                        <Button size="sm" color="secondary" iconTrailing={ArrowRight}>
                            Next
                        </Button>
                    </div>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

interface CustomerType {
    id: string;
    name: string;
    description: string;
    rate: string;
    count: number;
}
const customerTypes: CustomerType[] = [
    { id: "1", name: "Public", description: "Walk-in and online public bookings", rate: "Standard", count: 4821 },
    { id: "2", name: "Member", description: "Annual and seasonal members", rate: "Member", count: 612 },
    { id: "3", name: "Junior", description: "Under 18", rate: "Junior", count: 208 },
    { id: "4", name: "Senior", description: "65 and over", rate: "Senior", count: 496 },
    { id: "5", name: "League", description: "Recurring league players", rate: "League", count: 154 },
];

/** Customer Types — the rate categories a customer can belong to. */
export const CustomerTypes: Story = {
    render: () => (
        <AppShell activeUrl="/customers/types">
            <PageHeader
                title="Customer Types"
                subtitle="Rate categories used across bookings and reports."
                action={
                    <Button iconLeading={Plus} size="md">
                        New type
                    </Button>
                }
            />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <Table aria-label="Customer types">
                        <Table.Header>
                            <Table.Head label="Type" isRowHeader />
                            <Table.Head label="Description" />
                            <Table.Head label="Rate" className="w-40" />
                            <Table.Head label="Customers" className="w-32 text-right" />
                        </Table.Header>
                        <Table.Body items={customerTypes}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary">{row.name}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.description}</Table.Cell>
                                    <Table.Cell>
                                        <Badge size="sm" type="pill-color" color="gray">
                                            {row.rate}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell className="text-right tabular-nums">{row.count.toLocaleString()}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

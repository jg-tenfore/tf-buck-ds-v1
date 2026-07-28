import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
    ArrowLeft,
    ArrowRight,
    ChevronDown,
    Clipboard,
    CreditCard01,
    CurrencyDollar,
    Download01,
    FilterLines,
    RefreshCcw01,
    SearchLg,
    ShoppingCart01,
    Tag01,
    Users01,
} from "@untitledui/icons";
import { AppShell } from "@/components/application/app-navigation/app-shell";
import { PageHeader } from "@/components/application/screen-kit";
import { MetricCard } from "@/components/application/metrics/metric-card";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";

const meta = {
    title: "App Screens/Orders",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;


type OrderStatus = "Paid" | "Partial" | "Open" | "Refunded";

const STATUS_COLOR: Record<OrderStatus, "success" | "orange" | "warning" | "error"> = {
    Paid: "success",
    Partial: "orange",
    Open: "warning",
    Refunded: "error",
};

interface Order {
    id: string;
    orderNo: string;
    date: string;
    channel: string;
    dept: string;
    customer: string;
    employee: string;
    items: number;
    total: string;
    status: OrderStatus;
}

const orders: Order[] = [
    { id: "1", orderNo: "10428", date: "Jul 24, 9:42 AM", channel: "Pro Shop POS", dept: "Pro Shop", customer: "Olivia Chen", employee: "M. Bennett", items: 3, total: "$184.00", status: "Paid" },
    { id: "2", orderNo: "10427", date: "Jul 24, 9:18 AM", channel: "Tee Sheet", dept: "Golf", customer: "James Park", employee: "D. Lee", items: 4, total: "$236.00", status: "Paid" },
    { id: "3", orderNo: "10426", date: "Jul 24, 8:55 AM", channel: "Online", dept: "Golf", customer: "Priya Nair", employee: "—", items: 2, total: "$118.00", status: "Paid" },
    { id: "4", orderNo: "10425", date: "Jul 23, 6:31 PM", channel: "F&B POS", dept: "F & B", customer: "Walk-in", employee: "S. Rossi", items: 6, total: "$74.50", status: "Open" },
    { id: "5", orderNo: "10424", date: "Jul 23, 4:12 PM", channel: "Pro Shop POS", dept: "Pro Shop", customer: "Aaron Cole", employee: "M. Bennett", items: 1, total: "$59.00", status: "Refunded" },
    { id: "6", orderNo: "10423", date: "Jul 23, 2:47 PM", channel: "Simulator", dept: "Simulator Bays", customer: "Chris Wu", employee: "D. Lee", items: 2, total: "$96.00", status: "Partial" },
    { id: "7", orderNo: "10422", date: "Jul 23, 1:05 PM", channel: "Online", dept: "Instruction", customer: "Dana Lee", employee: "T. Alvarez", items: 1, total: "$140.00", status: "Paid" },
    { id: "8", orderNo: "10421", date: "Jul 23, 11:30 AM", channel: "F&B POS", dept: "F & B", customer: "Sofia Rossi", employee: "S. Rossi", items: 5, total: "$52.25", status: "Paid" },
    { id: "9", orderNo: "10420", date: "Jul 23, 10:14 AM", channel: "Tee Sheet", dept: "Golf", customer: "Marcus Bennett", employee: "D. Lee", items: 4, total: "$212.00", status: "Paid" },
    { id: "10", orderNo: "10419", date: "Jul 22, 5:58 PM", channel: "Pro Shop POS", dept: "Pro Shop", customer: "Walk-in", employee: "M. Bennett", items: 2, total: "$88.00", status: "Open" },
];

/**
 * All Orders — a metrics row summarizing the day, a search + export toolbar,
 * and a paginated orders table with status badges. Restyle of the legacy
 * "All Orders" screen for Sagamore Spring Golf Club.
 */
export const AllOrders: Story = {
    name: "All Orders",
    render: () => (
        <AppShell activeUrl="/orders/all">
            <PageHeader
                title="All Orders"
                subtitle="Every sale across the pro shop, tee sheet, F&B, and simulators."
                action={
                    <div className="flex items-center gap-2">
                        <Button size="md" color="secondary" iconLeading={Download01}>
                            Export
                        </Button>
                        <Button size="md" iconLeading={ShoppingCart01}>
                            New order
                        </Button>
                    </div>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                {/* Metrics row — today's totals */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <MetricCard title="# Orders" value="128" change={12} icon={Clipboard} trendData={[{ value: 84 }, { value: 96 }, { value: 91 }, { value: 108 }, { value: 118 }, { value: 128 }]} />
                    <MetricCard title="Total Sales" value="$14,820" change={8} icon={CurrencyDollar} trendData={[{ value: 9 }, { value: 11 }, { value: 10 }, { value: 13 }, { value: 14 }, { value: 14.8 }]} />
                    <MetricCard title="Payments" value="$13,940" change={7} icon={CreditCard01} trendData={[{ value: 8 }, { value: 10 }, { value: 11 }, { value: 12 }, { value: 13 }, { value: 13.9 }]} />
                    <MetricCard title="# Covers" value="312" change={5} icon={Users01} trendData={[{ value: 240 }, { value: 265 }, { value: 258 }, { value: 290 }, { value: 305 }, { value: 312 }]} />
                    <MetricCard title="Refunds" value="$420" change={-3} icon={RefreshCcw01} trendData={[{ value: 6 }, { value: 5 }, { value: 5.5 }, { value: 4.8 }, { value: 4.4 }, { value: 4.2 }]} />
                    <MetricCard title="Discounts" value="$1,180" change={2} icon={Tag01} trendData={[{ value: 10 }, { value: 11 }, { value: 10.5 }, { value: 11.4 }, { value: 11.6 }, { value: 11.8 }]} />
                </div>

                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input size="sm" aria-label="Search orders" placeholder="Search by order #, customer, or employee" icon={SearchLg} wrapperClassName="sm:w-96" />
                        <div className="flex items-center gap-2">
                            <Button size="sm" color="secondary" iconLeading={FilterLines}>
                                Filters
                            </Button>
                            <Button size="sm" color="secondary" iconTrailing={ChevronDown} iconLeading={Download01}>
                                Export
                            </Button>
                        </div>
                    </div>
                    <Table aria-label="Orders">
                        <Table.Header>
                            <Table.Head label="Order #" isRowHeader className="w-28" />
                            <Table.Head label="Date" className="w-40" />
                            <Table.Head label="Channel" />
                            <Table.Head label="Dept." />
                            <Table.Head label="Customer" />
                            <Table.Head label="Employee" />
                            <Table.Head label="Items" className="w-20 text-right" />
                            <Table.Head label="Total" className="w-28 text-right" />
                            <Table.Head label="Status" className="w-32" />
                        </Table.Header>
                        <Table.Body items={orders}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary tabular-nums">{row.orderNo}</Table.Cell>
                                    <Table.Cell className="text-tertiary whitespace-nowrap">{row.date}</Table.Cell>
                                    <Table.Cell className="text-secondary">{row.channel}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.dept}</Table.Cell>
                                    <Table.Cell className="font-medium text-primary">{row.customer}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.employee}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums">{row.items}</Table.Cell>
                                    <Table.Cell className="text-right font-medium text-primary tabular-nums">{row.total}</Table.Cell>
                                    <Table.Cell>
                                        <Badge size="sm" type="pill-color" color={STATUS_COLOR[row.status]}>
                                            {row.status}
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
                        <span className="text-sm text-tertiary">Page 1 of 13</span>
                        <Button size="sm" color="secondary" iconTrailing={ArrowRight}>
                            Next
                        </Button>
                    </div>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

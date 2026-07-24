import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowLeft, ArrowRight, Download01, FilterLines, Package, Plus, SearchLg, Trash01 } from "@untitledui/icons";
import { AppShell } from "@/components/application/app-navigation/app-shell";
import { PageHeader } from "@/components/application/screen-kit";
import { MetricCard } from "@/components/application/metrics/metric-card";
import { Tabs } from "@/components/application/tabs/tabs";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";

const meta = {
    title: "App Screens/Inventory",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;


type CategoryColor = "brand" | "orange" | "blue" | "purple" | "success";

interface Count {
    id: string;
    countNo: string;
    category: string;
    categoryColor: CategoryColor;
    title: string;
    date: string;
    employee: string;
    varUnits: number | null;
    varAmount: number | null;
}

const counts: Count[] = [
    { id: "3439", countNo: "3439", category: "Bar & Beverage", categoryColor: "orange", title: "Mid-week bar count", date: "Jul 16, 2026", employee: "Sawyer Pearson", varUnits: -8, varAmount: -142.5 },
    { id: "3436", countNo: "3436", category: "Bar & Beverage", categoryColor: "orange", title: "Weekend restock", date: "Jul 11, 2026", employee: "John Alvarez", varUnits: 0, varAmount: 0 },
    { id: "3431", countNo: "3431", category: "Bar & Beverage", categoryColor: "orange", title: "Draft & bottle count", date: "Jul 8, 2026", employee: "Sawyer Pearson", varUnits: 4, varAmount: 36.0 },
    { id: "3429", countNo: "3429", category: "Kitchen", categoryColor: "purple", title: "Breakfast items", date: "Jul 4, 2026", employee: "John Alvarez", varUnits: -3, varAmount: -21.75 },
    { id: "3405", countNo: "3405", category: "Bar & Beverage", categoryColor: "orange", title: "Beer cooler count", date: "Jun 26, 2026", employee: "Sawyer Pearson", varUnits: 0, varAmount: 0 },
    { id: "3298", countNo: "3298", category: "Pro Shop", categoryColor: "brand", title: "Apparel quarterly count", date: "Jun 18, 2026", employee: "Dana Whitfield", varUnits: -19, varAmount: -1062.13 },
    { id: "3235", countNo: "3235", category: "Golf Balls", categoryColor: "blue", title: "Range ball inventory", date: "Jun 12, 2026", employee: "Austin Wride", varUnits: 12, varAmount: 48.0 },
    { id: "3153", countNo: "3153", category: "Bar & Beverage", categoryColor: "orange", title: "Snack bar audit", date: "May 30, 2026", employee: "Sawyer Pearson", varUnits: 15, varAmount: 80.12 },
    { id: "3060", countNo: "3060", category: "Kitchen", categoryColor: "purple", title: "Walk-in freezer count", date: "May 24, 2026", employee: "John Alvarez", varUnits: 0, varAmount: 0 },
    { id: "3058", countNo: "3058", category: "Pro Shop", categoryColor: "brand", title: "Accessories count", date: "May 24, 2026", employee: "Dana Whitfield", varUnits: -5, varAmount: -212.4 },
    { id: "2998", countNo: "2998", category: "Golf Balls", categoryColor: "blue", title: "Pro shop ball wall", date: "May 12, 2026", employee: "Charles Carswell", varUnits: 29, varAmount: 185.79 },
    { id: "2928", countNo: "2928", category: "Bar & Beverage", categoryColor: "orange", title: "Beverage cart restock", date: "Apr 26, 2026", employee: "Charles Carswell", varUnits: 15, varAmount: 87.25 },
];

const money = (n: number) => `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Signed number cell with success/error semantics. */
const Variance = ({ value, format = "number" }: { value: number | null; format?: "number" | "money" }) => {
    if (value == null) return <span className="text-quaternary">—</span>;
    const display = format === "money" ? money(value) : value > 0 ? `+${value}` : `${value}`;
    const tone = value > 0 ? "text-success-primary" : value < 0 ? "text-error-primary" : "text-tertiary";
    return <span className={`tabular-nums ${tone}`}>{display}</span>;
};

/**
 * Inventory Counts — the list of stock-count sheets across the pro shop, kitchen, and bar.
 * Metrics summarize open counts and shrinkage; the table shows each count's variance in units and dollars.
 */
export const InventoryCounts: Story = {
    name: "Inventory Counts",
    render: () => (
        <AppShell activeUrl="/inventory/counts">
            <PageHeader
                title="Inventory Counts"
                subtitle="Stock-count sheets across the pro shop, kitchen, and bar."
                action={
                    <Button iconLeading={Plus} size="md">
                        New count
                    </Button>
                }
            />
            <div className="flex flex-col gap-6 p-6 lg:p-8">
                {/* KPI row */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <MetricCard title="Counts this month" value="8" change={14} changeLabel="vs last month" icon={Package} />
                    <MetricCard title="Open count sheets" value="3" change={-25} changeLabel="vs last month" icon={Package} />
                    <MetricCard title="Net variance (units)" value="-32" change={-8} changeLabel="vs last month" icon={Package} />
                    <MetricCard title="Shrinkage (value)" value="$1,340" change={-11} changeLabel="vs last month" icon={Package} />
                </div>

                {/* View tabs */}
                <Tabs>
                    <Tabs.List type="button-brand" size="sm">
                        <Tabs.Item id="list" label="All counts" />
                        <Tabs.Item id="sheet" label="Count sheet" />
                        <Tabs.Item id="archived" label="Archived" />
                    </Tabs.List>
                </Tabs>

                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input size="sm" aria-label="Search counts" placeholder="Search by title, category, or employee" icon={SearchLg} wrapperClassName="sm:w-96" />
                        <div className="flex items-center gap-2">
                            <Button size="sm" color="secondary" iconLeading={FilterLines}>
                                Filters
                            </Button>
                            <Button size="sm" color="secondary" iconLeading={Download01}>
                                Export
                            </Button>
                        </div>
                    </div>
                    <Table aria-label="Inventory counts">
                        <Table.Header>
                            <Table.Head label="ID" isRowHeader className="w-20" />
                            <Table.Head label="Category" className="w-44" />
                            <Table.Head label="Title" />
                            <Table.Head label="Date" className="w-32" />
                            <Table.Head label="Employee" className="w-44" />
                            <Table.Head label="Var. units" className="w-28 text-right" />
                            <Table.Head label="Var. amount" className="w-32 text-right" />
                            <Table.Head label="" className="w-16" />
                        </Table.Header>
                        <Table.Body items={counts}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary tabular-nums">{row.countNo}</Table.Cell>
                                    <Table.Cell>
                                        <Badge size="sm" type="pill-color" color={row.categoryColor}>
                                            {row.category}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell className="font-medium text-primary">{row.title}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.date}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.employee || "—"}</Table.Cell>
                                    <Table.Cell className="text-right">
                                        <Variance value={row.varUnits} />
                                    </Table.Cell>
                                    <Table.Cell className="text-right">
                                        <Variance value={row.varAmount} format="money" />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button size="sm" color="tertiary-destructive" iconLeading={Trash01} aria-label={`Delete count ${row.countNo}`} />
                                    </Table.Cell>
                                </Table.Row>
                            )}
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

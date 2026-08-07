import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CurrencyDollar, Flag06, LineChartUp01, Plus, Users01 } from "@untitledui/icons";
import { MetricCard } from "@/components/application/metrics/metric-card";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { PaletteScope, type Palette } from "@/components/foundations/palette-scope";
import { cx } from "@/utils/cx";

/**
 * # Course Dashboard — color exploration
 *
 * The same Sagamore dashboard rendered three ways so we can feel the brand in
 * context: **Green** (default brand), **Navy** (brand ramp swapped to navy), and
 * **Green & Navy** (navy structure + green actions). The only thing that changes
 * between them is the color treatment — every component is shared.
 */
const meta = {
    title: "Explorations/Dashboard",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const revenue = [
    { d: "Mon", v: 58 },
    { d: "Tue", v: 46 },
    { d: "Wed", v: 71 },
    { d: "Thu", v: 83 },
    { d: "Fri", v: 94 },
    { d: "Sat", v: 100 },
    { d: "Sun", v: 76 },
];

interface Booking {
    id: string;
    time: string;
    player: string;
    holes: number;
    status: string;
    badge: "brand" | "success" | "gray" | "warning";
}

const bookings: Booking[] = [
    { id: "1", time: "7:10 AM", player: "Bobby Jones", holes: 18, status: "Confirmed", badge: "brand" },
    { id: "2", time: "7:20 AM", player: "Patty Berg", holes: 18, status: "Checked in", badge: "success" },
    { id: "3", time: "7:30 AM", player: "Walter Hagen", holes: 9, status: "Pending", badge: "gray" },
    { id: "4", time: "7:40 AM", player: "Mickey Wright", holes: 18, status: "Confirmed", badge: "brand" },
    { id: "5", time: "7:50 AM", player: "Gene Sarazen", holes: 9, status: "Waitlist", badge: "warning" },
];

const DashboardExploration = ({ mode }: { mode: Palette }) => {
    // green/navy use the (themed) brand-section band; green & navy uses an explicit
    // deep navy band so the green actions inside read as the second color.
    const heroClass = mode === "green-navy" ? "bg-navy-900" : "bg-brand-section";

    return (
        <PaletteScope palette={mode} className="min-h-screen bg-secondary">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6 lg:p-8">
                {/* Hero */}
                <div className={cx("flex flex-col gap-5 rounded-2xl p-6 md:flex-row md:items-center md:justify-between md:p-8", heroClass)}>
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-white/70">Sagamore Spring Golf Club</p>
                        <h1 className="text-display-sm font-semibold text-white">Good morning, Marcus</h1>
                        <p className="text-md text-white/70">Clear skies, 72°F — a strong day on the tee sheet.</p>
                    </div>
                    <div className="flex shrink-0 gap-3">
                        <Button color="secondary" size="lg">
                            View tee sheet
                        </Button>
                        <Button color="primary" size="lg" iconLeading={Plus} className={mode === "green-navy" ? undefined : "ring-1 ring-white/25"}>
                            New booking
                        </Button>
                    </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <MetricCard title="Revenue" value="$14.8k" change={8} icon={CurrencyDollar} trendData={[{ value: 9 }, { value: 11 }, { value: 10 }, { value: 13 }, { value: 15 }]} />
                    <MetricCard title="Rounds" value="182" change={12} icon={Flag06} trendData={[{ value: 120 }, { value: 140 }, { value: 150 }, { value: 165 }, { value: 182 }]} />
                    <MetricCard title="Members" value="1,204" change={3} icon={Users01} trendData={[{ value: 1150 }, { value: 1170 }, { value: 1185 }, { value: 1200 }, { value: 1204 }]} />
                    <MetricCard title="Avg / round" value="$81" change={-2} icon={LineChartUp01} trendData={[{ value: 86 }, { value: 84 }, { value: 83 }, { value: 82 }, { value: 81 }]} />
                </div>

                {/* Chart + goal */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl bg-primary p-5 ring-1 ring-secondary lg:col-span-2">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-tertiary">This week</p>
                                <p className="text-lg font-semibold text-primary">Revenue by day</p>
                            </div>
                            <Badge color="brand" type="pill-color" size="md">
                                +8% vs last week
                            </Badge>
                        </div>
                        <div className="flex h-48 items-end gap-3">
                            {revenue.map((r) => (
                                <div key={r.d} className="flex flex-1 flex-col items-center gap-2">
                                    <div className="flex w-full flex-1 items-end">
                                        <div className="w-full rounded-t-md bg-brand-solid transition-all" style={{ height: `${r.v}%` }} />
                                    </div>
                                    <span className="text-xs text-tertiary">{r.d}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 rounded-2xl bg-primary p-5 ring-1 ring-secondary">
                        <p className="text-lg font-semibold text-primary">Monthly goals</p>
                        {[
                            { label: "Revenue", value: "$212k / $260k", pct: 82 },
                            { label: "Rounds", value: "3,140 / 4,000", pct: 78 },
                            { label: "New members", value: "48 / 60", pct: 80 },
                        ].map((g) => (
                            <div key={g.label} className="flex flex-col gap-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-tertiary">{g.label}</span>
                                    <span className="font-medium text-primary tabular-nums">{g.value}</span>
                                </div>
                                <div className="h-2.5 w-full overflow-hidden rounded-full bg-quaternary">
                                    <div className="h-full rounded-full bg-brand-solid" style={{ width: `${g.pct}%` }} />
                                </div>
                            </div>
                        ))}
                        <Button color="primary" className="mt-auto">
                            View full report
                        </Button>
                    </div>
                </div>

                {/* Bookings */}
                <TableCard.Root size="sm">
                    <TableCard.Header title="Today's bookings" badge="24 booked" description="Front nine, morning block." />
                    <Table aria-label="Today's bookings" size="sm">
                        <Table.Header>
                            <Table.Head label="Time" isRowHeader className="w-28" />
                            <Table.Head label="Player" />
                            <Table.Head label="Holes" className="w-20 text-right" />
                            <Table.Head label="Status" className="w-36" />
                        </Table.Header>
                        <Table.Body items={bookings}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary">{row.time}</Table.Cell>
                                    <Table.Cell className="text-secondary">{row.player}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums">{row.holes}</Table.Cell>
                                    <Table.Cell>
                                        <Badge color={row.badge} type="pill-color" size="sm">
                                            {row.status}
                                        </Badge>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </TableCard.Root>
            </div>
        </PaletteScope>
    );
};

/** Default brand — green accents, actions, and charts on light surfaces. */
export const Green: Story = { name: "Green", render: () => <DashboardExploration mode="green" /> };

/** Brand ramp swapped to navy — buttons, badges, bars, and the hero all read navy. */
export const Navy: Story = { name: "Navy", render: () => <DashboardExploration mode="navy" /> };

/** Two-tone — a deep navy hero and structure paired with green actions and accents. */
export const GreenNavy: Story = { name: "Green & Navy", render: () => <DashboardExploration mode="green-navy" /> };

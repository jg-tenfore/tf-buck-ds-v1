"use client";

import { useState } from "react";
import { CalendarCheck01, CurrencyDollar, Download01, Flag06, SlashCircle01, Star01, TrendUp01, UserPlus01, Users01 } from "@untitledui/icons";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ActivityFeed } from "@/components/application/activity-feed/activity-feed";
import { axisProps, BRAND, ChartCard, ChartLegend, CHART_INK, CHART_SERIES, ChartTooltip } from "@/components/application/charts/chart-kit";
import { MetricCard } from "@/components/application/metrics/metric-card";
import { Table } from "@/components/application/table/table";
import { Avatar } from "@/components/base/avatar/avatar";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { sagamoreImagesByCategory } from "@/components/foundations/sagamore/sagamore-assets";
import { SagamoreLogo } from "@/components/foundations/sagamore/sagamore-logo";
import { cx } from "@/utils/cx";

const heroAsset = sagamoreImagesByCategory("photography").find((asset) => asset.isHighRes) ?? sagamoreImagesByCategory("photography")[0];
const heroSrc = heroAsset?.src ?? "";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
const spark = (points: number[]) => points.map((value) => ({ value }));

const revenueTrend = MONTHS.map((month, i) => ({
    month,
    "Green fees": [42, 46, 58, 79, 104, 126, 118][i],
    "Pro shop": [18, 20, 24, 31, 38, 44, 41][i],
    "F & B": [12, 13, 17, 22, 28, 33, 30][i],
}));
const revenueSeries = ["Green fees", "Pro shop", "F & B"] as const;

const revenueMix = [
    { name: "Green fees", value: 148 },
    { name: "Pro shop", value: 62 },
    { name: "F & B", value: 44 },
    { name: "Lessons", value: 28 },
    { name: "Events", value: 21 },
];
const mixTotal = revenueMix.reduce((sum, d) => sum + d.value, 0);

const bookings = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
    day,
    Members: [24, 28, 26, 30, 44, 68, 62][i],
    Public: [12, 14, 18, 20, 34, 52, 48][i],
}));

const money = (v: React.ReactNode) => `$${Number(v).toLocaleString()}k`;

type TeeStatus = "On the tee" | "Out on the course" | "Holed out" | "No-show";
const statusColor: Record<TeeStatus, "brand" | "success" | "gray" | "warning"> = {
    "On the tee": "brand",
    "Out on the course": "success",
    "Holed out": "gray",
    "No-show": "warning",
};
const teeSheet: { id: string; time: string; player: string; avatar?: string; holes: string; status: TeeStatus }[] = [
    { id: "1", time: "7:10", player: "Bobby Jones", avatar: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80", holes: "18", status: "Out on the course" },
    { id: "2", time: "7:20", player: "Patty Berg", holes: "18", status: "On the tee" },
    { id: "3", time: "7:30", player: "Walter Hagen", avatar: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80", holes: "9", status: "Holed out" },
    { id: "4", time: "7:40", player: "Mickey Wright", holes: "18", status: "No-show" },
    { id: "5", time: "7:50", player: "Gene Sarazen", avatar: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80", holes: "9", status: "On the tee" },
];

const bold = (name: string) => <span className="font-semibold text-primary">{name}</span>;
const feedItems = [
    { id: "1", icon: CalendarCheck01, color: "brand" as const, title: <>{bold("Olivia Chen")} booked Sat 9:20 AM</>, timestamp: "2m" },
    { id: "2", icon: CurrencyDollar, color: "success" as const, title: <>{bold("$148.00")} received from {bold("Marcus Bennett")}</>, timestamp: "18m" },
    { id: "3", icon: UserPlus01, color: "brand" as const, title: <>{bold("James Park")} joined as an annual member</>, timestamp: "1h" },
    { id: "4", icon: Star01, color: "warning" as const, title: <>{bold("Dana Lee")} left a 5-star clinic review</>, timestamp: "3h" },
    { id: "5", icon: SlashCircle01, color: "error" as const, title: <>{bold("Chris Wu")} cancelled today 2:40 PM</>, timestamp: "5h" },
];

const RANGES = ["7D", "30D", "MTD", "QTD", "YTD"] as const;

/**
 * A course operations dashboard — activity + revenue at a glance. Composes the
 * DS metric, chart, gauge, table, and activity-feed pieces into a single screen.
 */
export const CourseDashboard = () => {
    const [range, setRange] = useState<(typeof RANGES)[number]>("MTD");

    return (
        <div className="flex min-h-screen flex-col gap-6 bg-secondary p-6 lg:p-8">
            {/* Sagamore course hero */}
            <div className="relative overflow-hidden rounded-2xl ring-1 ring-secondary">
                {heroSrc && <img src={heroSrc} alt="Sagamore Spring Golf Club" className="h-40 w-full object-cover lg:h-52" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-5 lg:p-6">
                    <div className="flex items-center gap-3">
                        <span className="flex h-12 items-center justify-center rounded-xl bg-white/95 px-2.5 shadow-sm">
                            <SagamoreLogo className="h-8 w-auto" />
                        </span>
                        <div>
                            <h1 className="text-display-xs font-semibold text-white">Sagamore Spring Golf Club</h1>
                            <p className="text-sm text-white/85">Dashboard · month to date</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-3">
                <div className="inline-flex rounded-lg bg-primary p-0.5 ring-1 ring-secondary">
                    {RANGES.map((r) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => setRange(r)}
                            className={cx(
                                "rounded-md px-3 py-1.5 text-sm transition duration-100 ease-linear",
                                range === r ? "bg-secondary font-medium text-primary" : "text-tertiary hover:text-secondary",
                            )}
                        >
                            {r}
                        </button>
                    ))}
                </div>
                <Button size="md" color="secondary" iconLeading={Download01} className="max-sm:hidden">
                    Export
                </Button>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard title="Total revenue" value="$264k" change={12.4} icon={CurrencyDollar} trendData={spark([40, 44, 42, 51, 58, 64, 72])} />
                <MetricCard title="Rounds played" value="3,204" change={8.1} icon={Flag06} trendData={spark([28, 30, 33, 31, 38, 42, 46])} />
                <MetricCard title="New members" value="122" change={-3.2} icon={Users01} trendData={spark([22, 24, 20, 19, 18, 17, 16])} />
                <MetricCard title="Avg. spend / round" value="$82.40" change={2.6} icon={TrendUp01} trendData={spark([70, 72, 74, 73, 78, 80, 82])} />
            </div>

            {/* Revenue trend + mix */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <ChartCard
                    className="lg:col-span-2"
                    title="Revenue by channel"
                    subtitle="Monthly, in thousands"
                    actions={<ChartLegend items={revenueSeries.map((label, i) => ({ label, color: CHART_SERIES[i] }))} />}
                >
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={revenueTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                            <defs>
                                {revenueSeries.map((key, i) => (
                                    <linearGradient key={key} id={`rev-${i}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={CHART_SERIES[i]} stopOpacity={0.2} />
                                        <stop offset="100%" stopColor={CHART_SERIES[i]} stopOpacity={0} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid stroke={CHART_INK.grid} vertical={false} />
                            <XAxis dataKey="month" {...axisProps} />
                            <YAxis {...axisProps} width={44} tickFormatter={(v) => `$${v}k`} />
                            <Tooltip content={<ChartTooltip valueFormatter={money} />} cursor={{ stroke: CHART_INK.axis }} />
                            {revenueSeries.map((key, i) => (
                                <Area key={key} type="monotone" dataKey={key} stackId="rev" stroke={CHART_SERIES[i]} strokeWidth={2} fill={`url(#rev-${i})`} />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Revenue mix" subtitle="Share of revenue">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative h-44 w-44">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={revenueMix} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={56} outerRadius={86} paddingAngle={2} stroke="#ffffff" strokeWidth={2}>
                                        {revenueMix.map((_, i) => (
                                            <Cell key={i} fill={CHART_SERIES[i]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<ChartTooltip valueFormatter={money} />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xs text-tertiary">Total</span>
                                <span className="text-xl font-semibold text-primary tabular-nums">${mixTotal}k</span>
                            </div>
                        </div>
                        <ul className="flex w-full flex-col gap-1.5">
                            {revenueMix.map((slice, i) => (
                                <li key={slice.name} className="flex items-center gap-2 text-sm">
                                    <span className="size-2.5 rounded-full" style={{ backgroundColor: CHART_SERIES[i] }} aria-hidden="true" />
                                    <span className="text-secondary">{slice.name}</span>
                                    <span className="ml-auto font-medium text-primary tabular-nums">${slice.value}k</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </ChartCard>
            </div>

            {/* Bookings + utilization gauge */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <ChartCard
                    className="lg:col-span-2"
                    title="Bookings by day"
                    subtitle="This week"
                    actions={<ChartLegend items={(["Members", "Public"] as const).map((label, i) => ({ label, color: CHART_SERIES[i] }))} />}
                >
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={bookings} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                            <CartesianGrid stroke={CHART_INK.grid} vertical={false} />
                            <XAxis dataKey="day" {...axisProps} />
                            <YAxis {...axisProps} width={32} />
                            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                            <Bar dataKey="Members" stackId="b" fill={CHART_SERIES[0]} maxBarSize={28} />
                            <Bar dataKey="Public" stackId="b" fill={CHART_SERIES[1]} radius={[4, 4, 0, 0]} maxBarSize={28} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Tee sheet utilization" subtitle="Today">
                    <div className="flex flex-col items-center gap-3 py-2">
                        <div className="relative size-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart innerRadius="78%" outerRadius="100%" data={[{ value: 74 }]} startAngle={90} endAngle={-270}>
                                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
                                    <RadialBar background={{ fill: CHART_INK.grid }} dataKey="value" cornerRadius={999} fill={BRAND[600]} />
                                </RadialBarChart>
                            </ResponsiveContainer>
                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-semibold text-primary tabular-nums">74%</span>
                            </div>
                        </div>
                        <p className="text-sm text-tertiary">182 of 246 slots booked</p>
                    </div>
                </ChartCard>
            </div>

            {/* Tee sheet table + activity feed */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div className="flex flex-col gap-4 rounded-xl bg-primary p-5 ring-1 ring-secondary lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-md font-semibold text-primary">Today's tee sheet</h3>
                            <p className="text-sm text-tertiary">First tee, front nine</p>
                        </div>
                        <Button size="sm" color="link-color">
                            View all
                        </Button>
                    </div>
                    <Table aria-label="Today's tee sheet">
                        <Table.Header>
                            <Table.Head label="Time" isRowHeader className="w-20" />
                            <Table.Head label="Player" />
                            <Table.Head label="Holes" className="w-20" />
                            <Table.Head label="Status" className="w-44" />
                        </Table.Header>
                        <Table.Body items={teeSheet}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell className="font-medium text-primary tabular-nums">{row.time}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center gap-2.5">
                                            <Avatar size="sm" src={row.avatar} alt={row.player} initials={row.player.charAt(0)} />
                                            <span className="text-sm font-medium text-primary">{row.player}</span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>{row.holes}</Table.Cell>
                                    <Table.Cell>
                                        <BadgeWithDot size="sm" type="pill-color" color={statusColor[row.status]}>
                                            {row.status}
                                        </BadgeWithDot>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </div>

                <div className="flex flex-col gap-4 rounded-xl bg-primary p-5 ring-1 ring-secondary">
                    <h3 className="text-md font-semibold text-primary">Recent activity</h3>
                    <ActivityFeed items={feedItems} />
                </div>
            </div>
        </div>
    );
};

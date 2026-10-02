"use client";

import { useState } from "react";
import { CurrencyDollar, Download01, LineChartUp01, SearchLg } from "@untitledui/icons";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";
import { Button } from "@/components/base/buttons/button";
import { Toggle } from "@/components/base/toggle/toggle";
import { COMBINED_REPORT_SECTIONS, REVENUE_SECTIONS, money } from "../data";
import type { RevenueSection } from "../data";
import { DateField, LinkText, ScreenShell, TableCard, Td, Th } from "../kit";
import { NAV_IDS } from "../nav-tree";
import { REPORT_PARTS, REPORT_TOTALS, REVENUE_PERIOD, reportAmount, revenueTable } from "../revenue-data";
import { CombinedReportScreen, CombinedRevenueScreen } from "../screens-revenue";
import { RecordFlow } from "./drilldown";
import { MainCard, PanelGroup, PanelRow, PanelStat, RailBlock, RecordHeader, RecordLayout, SlidePanel, StatBar } from "./ideas-kit";
import { REPORT_LINE_INFO, SECTION_GROUP } from "./ideas-panels";

const DAY = "Oct 1, 2026";

/* ========================================================================== */
/*  6 · Combined Report — September 2026, derived from Combined Revenue        */
/* ========================================================================== */

/* ========================================================================== */
/*  7 · Combined Revenue — an empty period across 15 sections                 */
/* ========================================================================== */

const GROUPS: { title: string; ids: string[] }[] = [
    { title: "Sales", ids: ["green-fees", "transportation", "product-sales", "event-sales", "activity-sales", "fee-rule-sales", "open-misc", "gift-cards"] },
    { title: "Taxes & fees", ids: ["taxes", "fees-tips"] },
    { title: "Money in", ids: ["event-payments", "money-collected", "charge-payments"] },
    { title: "Informational", ids: ["discounts", "adjustments"] },
];
const section = (id: string) => REVENUE_SECTIONS.find((s) => s.id === id)!;

const GroupBy = () => {
    const [groupBy, setGroupBy] = useState("product");
    return (
        <ButtonGroup size="sm" selectedKeys={new Set([groupBy])} onSelectionChange={(k) => k.size && setGroupBy(String([...k][0]))}>
            <ButtonGroupItem id="product">Product</ButtonGroupItem>
            <ButtonGroupItem id="group">Group</ButtonGroupItem>
        </ButtonGroup>
    );
};

/* ========================================================================== */
/*  Idea 2 flows — click a line in today's report to open its page            */
/* ========================================================================== */

const DAY_RANGE = "Oct 1, 2026";

const PeriodRail = ({ from = DAY_RANGE, to = DAY_RANGE, extra }: { from?: string; to?: string; extra?: React.ReactNode }) => (
    <>
        <RailBlock title="Period">
            <DateField label="From" value={from} />
            <DateField label="To" value={to} className="mt-2" />
        </RailBlock>
        {extra}
    </>
);

/** One Combined Report line as a record page. */
export const ReportLineRecordPage = ({ line }: { line: string }) => {
    const info = REPORT_LINE_INFO[line];
    const amount = reportAmount(line);
    const share = (amount / REPORT_TOTALS.sales(COMBINED_REPORT_SECTIONS)) * 100;
    return (
        <ScreenShell
            nav={{ activeId: NAV_IDS.combinedReport, initialQuery: "combin" }}
            course="dunes"
            title={line}
            description=""
            header={
                <RecordHeader
                    breadcrumb="Combined Report"
                    breadcrumbIcon={CurrencyDollar}
                    title={line}
                    subtitle={info.includes}
                    actions={
                        <Button color="secondary" size="md" iconLeading={Download01}>
                            Export
                        </Button>
                    }
                />
            }
        >
            <StatBar
                stats={[
                    { label: line, value: money(amount) },
                    { label: "Share of total sales", value: `${share.toFixed(1)}%` },
                    { label: "Period", value: REVENUE_PERIOD.label },
                ]}
            />
            <RecordLayout
                main={
                    <MainCard title="Breakdown">
                        <TableCard>
                            <thead>
                                <tr>
                                    <Th>Source</Th>
                                    <Th className="text-right">Amount</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {REPORT_PARTS[line].map((p) => (
                                    <tr key={p.label}>
                                        <Td>{p.label}</Td>
                                        <Td className="text-right tabular-nums">{money(p.amount)}</Td>
                                    </tr>
                                ))}
                                <tr>
                                    <Td className="bg-secondary font-semibold">Total</Td>
                                    <Td className="bg-secondary text-right font-semibold tabular-nums">{money(amount)}</Td>
                                </tr>
                            </tbody>
                        </TableCard>
                    </MainCard>
                }
                rail={
                    <PeriodRail
                        from={REVENUE_PERIOD.from}
                        to={REVENUE_PERIOD.to}
                        extra={
                            <RailBlock title="See it in detail">
                                {info.related.map((r) => (
                                    <LinkText key={r}>{r}</LinkText>
                                ))}
                            </RailBlock>
                        }
                    />
                }
            />
        </ScreenShell>
    );
};

/** One Combined Revenue section as a record page. */
export const RevenueSectionRecordPage = ({ section }: { section: RevenueSection }) => {
    const { rows, total, amount } = revenueTable(section);
    return (
        <ScreenShell
            nav={{ activeId: NAV_IDS.combinedRevenue, initialQuery: "combin" }}
            course="dunes"
            title={section.title}
            description=""
            header={
                <RecordHeader
                    breadcrumb="Combined Revenue"
                    breadcrumbIcon={CurrencyDollar}
                    title={section.title}
                    subtitle={`${SECTION_GROUP[section.id]} · ${REVENUE_PERIOD.label}`}
                    actions={
                        <Button color="secondary" size="md" iconLeading={Download01}>
                            Export
                        </Button>
                    }
                />
            }
        >
            <StatBar
                stats={[
                    { label: "Total", value: money(amount) },
                    { label: "Group", value: SECTION_GROUP[section.id] },
                    { label: "Period", value: REVENUE_PERIOD.label },
                ]}
            />
            <RecordLayout
                main={
                    <>
                        <MainCard title="Breakdown">
                            <TableCard>
                                <thead>
                                    <tr>
                                        {section.columns.map((c, i) => (
                                            <Th key={c} className={i > 0 ? "text-right" : undefined}>
                                                {c}
                                            </Th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.length ? (
                                        <>
                                            {rows.map((row, r) => (
                                                <tr key={r}>
                                                    {row.map((cell, c) => (
                                                        <Td key={c} className={c > 0 ? "text-right tabular-nums" : undefined}>
                                                            {cell}
                                                        </Td>
                                                    ))}
                                                </tr>
                                            ))}
                                            {total && (
                                                <tr>
                                                    {total.map((cell, c) => (
                                                        <Td
                                                            key={c}
                                                            className={
                                                                c > 0 ? "bg-secondary text-right font-semibold tabular-nums" : "bg-secondary font-semibold"
                                                            }
                                                        >
                                                            {cell}
                                                        </Td>
                                                    ))}
                                                </tr>
                                            )}
                                        </>
                                    ) : (
                                        <tr>
                                            <Td colSpan={section.columns.length} className="py-10 text-center text-tertiary">
                                                {section.empty}
                                            </Td>
                                        </tr>
                                    )}
                                </tbody>
                            </TableCard>
                        </MainCard>
                        {section.footnote && <p className="text-xs text-tertiary">{section.footnote}</p>}
                    </>
                }
                rail={
                    <PeriodRail
                        from={REVENUE_PERIOD.from}
                        to={REVENUE_PERIOD.to}
                        extra={
                            <>
                                <RailBlock title="Group products by">
                                    <GroupBy />
                                </RailBlock>
                                <RailBlock title="All courses" action={<Toggle aria-label="All courses" size="md" />}>
                                    <span className="text-xs text-tertiary">Company-wide</span>
                                </RailBlock>
                            </>
                        }
                    />
                }
            />
        </ScreenShell>
    );
};

/** Idea 2: from today's Combined Report, a line opens its page. */
export const CombinedReportIdea2 = () => (
    <RecordFlow
        screen={(open) => <CombinedReportScreen onOpenRow={open} />}
        rows={COMBINED_REPORT_SECTIONS}
        page={(line) => <ReportLineRecordPage line={line} />}
    />
);

/** Idea 2: from today's Combined Revenue, a section opens its page. */
export const CombinedRevenueIdea2 = () => (
    <RecordFlow
        screen={(open) => <CombinedRevenueScreen initiallyCollapsed onOpenRow={open} />}
        rows={REVENUE_SECTIONS}
        page={(section) => <RevenueSectionRecordPage section={section} />}
    />
);

/* Idea 1 now lives in ideas-panels.tsx (row-stepping panels with sub-navigation). */
export { CombinedReportIdea1, CombinedRevenueIdea1 } from "./ideas-panels";

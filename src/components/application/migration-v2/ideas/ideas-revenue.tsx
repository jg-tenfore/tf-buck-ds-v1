"use client";

import { useState } from "react";
import { CurrencyDollar, Download01, LineChartUp01, PieChart01, SearchLg } from "@untitledui/icons";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";
import { Button } from "@/components/base/buttons/button";
import { Toggle } from "@/components/base/toggle/toggle";
import { COMBINED_REPORT_SECTIONS, REVENUE_SECTIONS } from "../data";
import type { RevenueSection } from "../data";
import { DateField, LinkText, ScreenShell, TableCard, Td, Th } from "../kit";
import { NAV_IDS } from "../nav-tree";
import { CombinedReportScreen, CombinedRevenueScreen } from "../screens-revenue";
import { RecordFlow } from "./drilldown";
import { EmptyCard, MainCard, PanelGroup, PanelRow, PanelStat, RailBlock, RecordHeader, RecordLayout, SlidePanel, StatBar } from "./ideas-kit";
import { REPORT_LINE_INFO, SECTION_GROUP } from "./ideas-panels";

const DAY = "Oct 1, 2026";

/* ========================================================================== */
/*  6 · Combined Report — a period with no sales or payments                  */
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

const PeriodRail = ({ extra }: { extra?: React.ReactNode }) => (
    <>
        <RailBlock title="Period">
            <DateField label="From" value={DAY_RANGE} />
            <DateField label="To" value={DAY_RANGE} className="mt-2" />
        </RailBlock>
        {extra}
    </>
);

/** One Combined Report line as a record page. */
export const ReportLineRecordPage = ({ line }: { line: string }) => {
    const info = REPORT_LINE_INFO[line];
    return (
        <ScreenShell
            nav={{ activeId: NAV_IDS.combinedReport, initialQuery: "combin" }}
            course="bushwood"
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
                    { label: line, value: "$0.00" },
                    { label: "Share of total sales", value: "0%" },
                    { label: "Period", value: DAY_RANGE },
                ]}
            />
            <RecordLayout
                main={
                    <MainCard title="Breakdown">
                        <EmptyCard message={`No ${line.toLowerCase()} on ${DAY_RANGE}.`} icon={PieChart01} />
                    </MainCard>
                }
                rail={
                    <PeriodRail
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
export const RevenueSectionRecordPage = ({ section }: { section: RevenueSection }) => (
    <ScreenShell
        nav={{ activeId: NAV_IDS.combinedRevenue, initialQuery: "combin" }}
        course="bushwood"
        title={section.title}
        description=""
        header={
            <RecordHeader
                breadcrumb="Combined Revenue"
                breadcrumbIcon={CurrencyDollar}
                title={section.title}
                subtitle={`${SECTION_GROUP[section.id]} · ${DAY_RANGE}`}
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
                { label: "Total", value: "$0.00" },
                { label: "Group", value: SECTION_GROUP[section.id] },
                { label: "Period", value: DAY_RANGE },
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
                                {section.rows ? (
                                    <>
                                        {section.rows.map((r) => (
                                            <tr key={r}>
                                                <Td>{r}</Td>
                                                <Td className="text-right text-tertiary tabular-nums">$0.00</Td>
                                            </tr>
                                        ))}
                                        {section.totalRow && (
                                            <tr>
                                                <Td className="bg-secondary font-semibold">Total</Td>
                                                <Td className="bg-secondary text-right font-semibold tabular-nums">$0.00</Td>
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

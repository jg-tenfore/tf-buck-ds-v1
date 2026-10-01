"use client";

import { useState } from "react";
import { ChevronDown, ChevronDownDouble, ChevronUpDouble, SearchLg } from "@untitledui/icons";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";
import { Button } from "@/components/base/buttons/button";
import { Label } from "@/components/base/input/label";
import { Toggle } from "@/components/base/toggle/toggle";
import { cx } from "@/utils/cx";
import { COMBINED_REPORT_SECTIONS, REVENUE_SECTIONS } from "./data";
import { DateField, ExportButton, LinkText, ScreenShell, TableCard, Td, Th, clickableRow } from "./kit";
import { NAV_IDS } from "./nav-tree";

/* ========================================================================== */
/*  6 · Revenue › Combined Report                                             */
/* ========================================================================== */

/** Combined Report: sales by category and payments by type, side by side, for one date range. */
export const CombinedReportScreen = ({ onOpenRow }: { onOpenRow?: (index: number) => void } = {}) => (
    <ScreenShell
        nav={{ activeId: NAV_IDS.combinedReport, initialQuery: "combin" }}
        course="bushwood"
        title="Combined Report"
        description="Sales by category and payments by type, side by side, for one date range."
    >
        <div className="flex items-end justify-between gap-4">
            <div className="flex items-end gap-4">
                <DateField label="Start Date" value="Oct 1, 2026" className="w-48" />
                <DateField label="End Date" value="Oct 1, 2026" className="w-48" />
                <Button size="md" iconLeading={SearchLg}>
                    Run Report
                </Button>
            </div>
            <ExportButton />
        </div>
        <TableCard>
            <thead>
                <tr>
                    <Th>Section</Th>
                    <Th className="text-right">Amount</Th>
                </tr>
            </thead>
            <tbody>
                {COMBINED_REPORT_SECTIONS.map((s, i) => (
                    <tr key={s} {...clickableRow(onOpenRow ? () => onOpenRow(i) : undefined)}>
                        <Td>{onOpenRow ? <LinkText onClick={() => onOpenRow(i)}>{s}</LinkText> : s}</Td>
                        <Td className="text-right tabular-nums">$0.00</Td>
                    </tr>
                ))}
                <tr>
                    <Td className="bg-secondary font-semibold">Total Sales</Td>
                    <Td className="bg-secondary text-right font-semibold tabular-nums">$0.00</Td>
                </tr>
                <tr>
                    <Th colSpan={2} className="border-t border-secondary">
                        Payment Types
                    </Th>
                </tr>
                <tr>
                    <Td className="bg-secondary font-semibold">Total Payments</Td>
                    <Td className="bg-secondary text-right font-semibold tabular-nums">$0.00</Td>
                </tr>
            </tbody>
        </TableCard>
    </ScreenShell>
);

/* ========================================================================== */
/*  7 · Revenue › Combined Revenue                                            */
/* ========================================================================== */

/**
 * Combined Revenue: every revenue line for the period, reconciled against
 * money in. Fifteen collapsible sections, each with its own table and empty
 * state, then a Money In summary.
 */
export const CombinedRevenueScreen = ({ initiallyCollapsed = false, onOpenRow }: { initiallyCollapsed?: boolean; onOpenRow?: (index: number) => void }) => {
    const [open, setOpen] = useState<Set<string>>(() => new Set(initiallyCollapsed ? [] : REVENUE_SECTIONS.map((s) => s.id)));
    const [groupBy, setGroupBy] = useState<"product" | "group">("product");
    const allOpen = open.size === REVENUE_SECTIONS.length;

    const toggle = (id: string) =>
        setOpen((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    return (
        <ScreenShell
            nav={{ activeId: NAV_IDS.combinedRevenue, initialQuery: "combin" }}
            course="bushwood"
            title="Combined Revenue"
            description="Every revenue line for the period, reconciled against money in."
        >
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-wrap items-end gap-4">
                    <DateField label="From" value="Oct 1, 2026" className="w-44" />
                    <DateField label="To" value="Oct 1, 2026" className="w-44" />
                    <div className="flex flex-col gap-1.5">
                        <Label>Group Products By</Label>
                        <ButtonGroup
                            size="md"
                            selectedKeys={new Set([groupBy])}
                            onSelectionChange={(keys) => keys.size && setGroupBy([...keys][0] as typeof groupBy)}
                        >
                            <ButtonGroupItem id="product">Product</ButtonGroupItem>
                            <ButtonGroupItem id="group">Group</ButtonGroupItem>
                        </ButtonGroup>
                    </div>
                    <div className="flex flex-col gap-2.5 pb-2">
                        <Label>All Courses</Label>
                        <Toggle size="md" label="Company-wide" className="items-center" />
                    </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <ExportButton />
                    <Button
                        color="secondary"
                        size="sm"
                        iconLeading={allOpen ? ChevronUpDouble : ChevronDownDouble}
                        onClick={() => setOpen(allOpen ? new Set() : new Set(REVENUE_SECTIONS.map((s) => s.id)))}
                    >
                        {allOpen ? "Collapse all" : "Expand all"}
                    </Button>
                </div>
            </div>

            <div className="divide-y divide-secondary rounded-xl bg-primary shadow-xs ring-1 ring-secondary">
                {REVENUE_SECTIONS.map((s, i) => {
                    const isOpen = open.has(s.id);
                    const title = s.id === "product-sales" ? `Product Sales by ${groupBy === "product" ? "Product" : "Group"}` : s.title;
                    const columns = s.id === "product-sales" && groupBy === "group" ? s.columns.filter((c) => c !== "Product") : s.columns;
                    return (
                        <section key={s.id}>
                            <button
                                type="button"
                                aria-expanded={isOpen}
                                onClick={() => (onOpenRow ? onOpenRow(i) : toggle(s.id))}
                                className="flex w-full cursor-pointer items-center gap-3 px-5 py-4 text-left hover:bg-primary_hover"
                            >
                                <ChevronDown className={cx("size-4 text-fg-quaternary transition-transform", !isOpen && "-rotate-90")} />
                                <span
                                    className={cx(
                                        "flex-1 text-xs font-semibold tracking-[0.14em] uppercase",
                                        onOpenRow ? "text-brand-secondary" : "text-secondary",
                                    )}
                                >
                                    {title}
                                </span>
                                <span className="text-md font-semibold text-primary tabular-nums">$0.00</span>
                            </button>
                            {isOpen && (
                                <div className="flex flex-col gap-2 px-5 pb-5">
                                    <TableCard className="shadow-none">
                                        <thead>
                                            <tr>
                                                {columns.map((c, i) => (
                                                    <Th key={c} className={i > 0 ? "text-right" : undefined}>
                                                        {c}
                                                    </Th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {s.rows ? (
                                                <>
                                                    {s.rows.map((r) => (
                                                        <tr key={r}>
                                                            <Td>{r}</Td>
                                                            <Td className="text-right tabular-nums">
                                                                {s.linkAmounts ? (
                                                                    <span className="cursor-pointer text-brand-secondary underline decoration-dotted underline-offset-4">
                                                                        $0.00
                                                                    </span>
                                                                ) : (
                                                                    "$0.00"
                                                                )}
                                                            </Td>
                                                        </tr>
                                                    ))}
                                                    {s.totalRow && (
                                                        <tr>
                                                            <Td className="bg-secondary font-semibold">Total</Td>
                                                            <Td className="bg-secondary text-right font-semibold tabular-nums">$0.00</Td>
                                                        </tr>
                                                    )}
                                                </>
                                            ) : (
                                                <tr>
                                                    <Td colSpan={columns.length} className="py-10 text-center text-tertiary">
                                                        {s.empty}
                                                    </Td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </TableCard>
                                    {s.footnote && <p className="text-xs text-tertiary">{s.footnote}</p>}
                                </div>
                            )}
                        </section>
                    );
                })}
            </div>

            <div className="flex justify-end">
                <dl className="flex w-full max-w-md flex-col gap-3 rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary">
                    <dt className="text-xs font-semibold tracking-[0.14em] text-tertiary uppercase">Money In</dt>
                    {["Money In (excluding events)", "Money In (events closed this period)"].map((k) => (
                        <div key={k} className="flex justify-between text-md text-secondary">
                            <span>{k}</span>
                            <span className="font-semibold text-primary tabular-nums">$0.00</span>
                        </div>
                    ))}
                    <div className="flex justify-between border-t border-secondary pt-3 text-lg font-semibold text-primary">
                        <span>Total Money In</span>
                        <span className="tabular-nums">$0.00</span>
                    </div>
                </dl>
            </div>
        </ScreenShell>
    );
};

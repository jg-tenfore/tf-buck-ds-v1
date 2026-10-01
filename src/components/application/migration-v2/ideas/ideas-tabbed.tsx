"use client";

import type { FC, ReactNode } from "react";
import { useRef, useState } from "react";
import { BookClosed, ClockRewind, CurrencyDollar, ReceiptCheck, Ticket01, User01 } from "@untitledui/icons";
import type { CourseKey, CustomerProfile } from "../data";
import {
    CHARGE_PAYMENTS,
    COMBINED_REPORT_SECTIONS,
    CREDIT_BOOKS,
    CUSTOMER_CHARGES,
    HISTORY_LINES,
    HISTORY_SEARCH,
    PUNCH_CARDS,
    REVENUE_SECTIONS,
} from "../data";
import type { GlobalNavProps } from "../global-nav";
import { EmbeddedShellContext, HeaderAction, ScreenShell, TabStrip } from "../kit";
import { NAV_IDS } from "../nav-tree";
import { ChargeHistoryScreen, ChargesScreen, PaymentsScreen } from "../screens-charges";
import { CreditBooksScreen, PunchCardsScreen } from "../screens-credits";
import { CombinedReportScreen, CombinedRevenueScreen } from "../screens-revenue";
import type { PanelPage } from "./drilldown";
import { SteppedPanel } from "./drilldown";
import { CustomerRecordPage, PROFILE_DETAILS, addressPage, fieldPage, personFrom, profilePage, sectionPage, settingsPage } from "./full-profile";
import { HistoryRecordPage, PaymentRecordPage } from "./ideas-charges";
import { CreditBookRecordPage, PunchCardRecordPage } from "./ideas-credits";
import { EditFlyoutContext, RecordNavContext } from "./ideas-kit";
import { bulkEntryPage, chargePage, creditBookPage, historyLinePage, paymentPage, punchCardPage, reportLinePage, revenueSectionPage } from "./ideas-panels";
import { ReportLineRecordPage, RevenueSectionRecordPage } from "./ideas-revenue";

/*
 * Idea 3 — tabbed records, side panel for edits.
 *
 * Today's tab strip comes back: clicking a row opens it as a closable tab, and
 * the tab's content uses the record-page layout (summary bar, main column,
 * details rail). Anything you'd change — a pencil in the rail or a More actions
 * item — opens the side panel over the tab, already on the right page.
 * ↑ / ↓ in the tab steps that tab through the table's rows.
 */

type Tab = { key: number; index: number };

interface TabbedIdeaProps<T> {
    nav: GlobalNavProps;
    course?: CourseKey;
    title: string;
    description: string;
    action?: ReactNode;
    listLabel: string;
    /** Today's table (rendered inside the first tab). */
    screen: (openRow: (index: number) => void, openFlyout: (page: PanelPage) => void) => ReactNode;
    rows: T[];
    tabLabel: (row: T, index: number) => string;
    tabIcon: FC<{ className?: string }>;
    /** The record-page layout shown in a row's tab. */
    record: (row: T, index: number) => ReactNode;
    /** The side panel's first page for a row. */
    flyout: (row: T, index: number) => PanelPage;
    /** Pages to open on top of the first one for an edit hint ("Billing address", …). */
    flyoutStack?: (row: T, index: number, hint: string) => PanelPage[];
    step?: boolean;
}

type Flyout = { index: number; hint: string } | { page: PanelPage } | null;

const TabbedIdea = <T,>({
    nav,
    course,
    title,
    description,
    action,
    listLabel,
    screen,
    rows,
    tabLabel,
    tabIcon,
    record,
    flyout,
    flyoutStack,
    step = true,
}: TabbedIdeaProps<T>) => {
    const [tabs, setTabs] = useState<Tab[]>([]);
    const [active, setActive] = useState<number | "list">("list");
    const [panel, setPanel] = useState<Flyout>(null);
    const nextKey = useRef(1);
    const keyFor = useRef(new Map<number, number>());

    // Idempotent: a link inside a row and the row itself can both fire for one click.
    const openRow = (index: number) => {
        const key = keyFor.current.get(index) ?? nextKey.current++;
        keyFor.current.set(index, key);
        setTabs((t) => (t.some((x) => x.key === key) ? t : [...t, { key, index }]));
        setActive(key);
    };
    const closeTab = (key: number) => {
        for (const [i, k] of keyFor.current) if (k === key) keyFor.current.delete(i);
        setTabs((t) => t.filter((x) => x.key !== key));
        if (active === key) setActive("list");
    };
    const moveTab = (key: number, index: number) => {
        for (const [i, k] of keyFor.current) if (k === key) keyFor.current.delete(i);
        keyFor.current.set(index, key);
        setTabs((t) => t.map((x) => (x.key === key ? { ...x, index } : x)));
    };

    const current = tabs.find((t) => t.key === active);

    return (
        <ScreenShell
            nav={nav}
            course={course}
            title={title}
            description={description}
            action={action}
            tabs={
                <TabStrip
                    tabs={[
                        { id: "list", label: listLabel },
                        ...tabs.map((t) => ({ id: String(t.key), label: tabLabel(rows[t.index], t.index), icon: tabIcon, closable: true })),
                    ]}
                    activeId={String(active)}
                    onSelect={(id) => setActive(id === "list" ? "list" : Number(id))}
                    onClose={(id) => closeTab(Number(id))}
                />
            }
        >
            <EmbeddedShellContext.Provider value>
                {active === "list" || !current ? (
                    screen(openRow, (page) => setPanel({ page }))
                ) : (
                    <EditFlyoutContext.Provider value={(hint) => setPanel({ index: current.index, hint })}>
                        <RecordNavContext.Provider
                            key={`${current.key}-${current.index}`}
                            value={{
                                onBack: () => setActive("list"),
                                stepper: step
                                    ? {
                                          index: current.index,
                                          total: rows.length,
                                          onPrev: current.index > 0 ? () => moveTab(current.key, current.index - 1) : undefined,
                                          onNext: current.index < rows.length - 1 ? () => moveTab(current.key, current.index + 1) : undefined,
                                      }
                                    : undefined,
                            }}
                        >
                            {record(rows[current.index], current.index)}
                        </RecordNavContext.Provider>
                    </EditFlyoutContext.Provider>
                )}
            </EmbeddedShellContext.Provider>
            {panel && "page" in panel && <SteppedPanel rows={[0]} root={() => panel.page} showStepper={false} onClose={() => setPanel(null)} />}
            {panel && "index" in panel && (
                <SteppedPanel
                    key={`${panel.index}-${panel.hint}`}
                    rows={rows}
                    initialIndex={panel.index}
                    root={flyout}
                    initialStack={(row, i) => flyoutStack?.(row, i, panel.hint) ?? []}
                    showStepper={false}
                    onClose={() => setPanel(null)}
                />
            )}
        </ScreenShell>
    );
};

/** Edit hints on a customer record → the side-panel pages that edit them. */
const customerEditStack = (c: CustomerProfile, hint: string): PanelPage[] => {
    const d = PROFILE_DETAILS;
    const profile = profilePage(c);
    const map: Record<string, PanelPage[]> = {
        "Contact information": [profile],
        Personal: [profile],
        "Billing address": [profile, addressPage("billing")],
        "Shipping address": [profile, addressPage("shipping")],
        Settings: [profile, settingsPage],
        Notes: [profile, fieldPage("Notes", d.notes)],
        "Purchase preferences": [profile, fieldPage("Purchase preferences", d.purchasePreferences)],
        "Reset Customer Password": [profile],
        "Payment methods": [sectionPage("payment-methods")],
        "Family members": [sectionPage("family")],
    };
    return map[hint] ?? [];
};

const chargeCustomer = (c: (typeof CUSTOMER_CHARGES)[number], i: number) => personFrom(c.name, String(1351034 + i * 7), c.email);
const caseyRow = HISTORY_SEARCH.results[0];

/* -------------------------------------------------------------------------- */
/*  The seven screens                                                         */
/* -------------------------------------------------------------------------- */

export const PunchCardsIdea3 = () => (
    <TabbedIdea
        nav={{ activeId: NAV_IDS.punchCards, initialQuery: "punch" }}
        title="Punch Cards"
        description="Punch cards sold, and how many punches are left."
        listLabel="Punch Cards"
        screen={(open, openFlyout) => <PunchCardsScreen initialView="list" onOpenRow={open} onBulkEntry={() => openFlyout(bulkEntryPage)} />}
        rows={PUNCH_CARDS}
        tabLabel={(r) => r.customer ?? `Punch card ${r.cpcId}`}
        tabIcon={Ticket01}
        record={(r) => <PunchCardRecordPage row={r} />}
        flyout={punchCardPage}
    />
);

export const CreditBooksIdea3 = () => (
    <TabbedIdea
        nav={{ activeId: NAV_IDS.creditBooks, initialQuery: "cred" }}
        title="Credit Books"
        description="Course-funded credit balances customers can spend against."
        action={<HeaderAction label="Add Credit Book" />}
        listLabel="Credit Books"
        screen={(open) => <CreditBooksScreen initialView="list" onOpenRow={open} />}
        rows={CREDIT_BOOKS}
        tabLabel={(b) => b.title}
        tabIcon={BookClosed}
        record={(b) => <CreditBookRecordPage book={b} />}
        flyout={creditBookPage}
    />
);

export const ChargesIdea3 = () => (
    <TabbedIdea
        nav={{ activeId: NAV_IDS.charges, initialQuery: "charges" }}
        title="Customer Charges"
        description="Orders charged to a customer account, by date range."
        action={<HeaderAction label="Add Customer Charge" />}
        listLabel="Charges"
        screen={(open) => <ChargesScreen initialView="list" onOpenRow={open} />}
        rows={CUSTOMER_CHARGES}
        tabLabel={(c) => c.name}
        tabIcon={User01}
        record={(c, i) => <CustomerRecordPage customer={chargeCustomer(c, i)} />}
        flyout={chargePage}
        flyoutStack={(c, i, hint) => customerEditStack(chargeCustomer(c, i), hint)}
    />
);

export const PaymentsIdea3 = () => (
    <TabbedIdea
        nav={{ activeId: NAV_IDS.payments, initialQuery: "payments" }}
        title="Customer Charge Payments"
        description="Payments taken against customer charges, by date range."
        action={<HeaderAction label="Add Payment" />}
        listLabel="Payments"
        screen={(open) => <PaymentsScreen initialView="declined-collapsed" onOpenRow={open} />}
        rows={CHARGE_PAYMENTS}
        tabLabel={(p) => `Payment ${p.ccpId}`}
        tabIcon={ReceiptCheck}
        record={(p) => <PaymentRecordPage row={p} />}
        flyout={paymentPage}
    />
);

export const HistoryIdea3 = () => (
    <TabbedIdea
        nav={{ activeId: NAV_IDS.history, initialQuery: "hist" }}
        course="bushwood"
        title="Customer Charge History"
        description="Every charge, payment and frozen invoice for one customer."
        listLabel="History"
        screen={(open) => <ChargeHistoryScreen initialView="activity" onOpenRow={open} />}
        rows={HISTORY_LINES}
        tabLabel={() => caseyRow.name}
        tabIcon={ClockRewind}
        record={() => <HistoryRecordPage />}
        flyout={historyLinePage}
        step={false}
    />
);

export const CombinedReportIdea3 = () => (
    <TabbedIdea
        nav={{ activeId: NAV_IDS.combinedReport, initialQuery: "combin" }}
        course="bushwood"
        title="Combined Report"
        description="Sales by category and payments by type, side by side, for one date range."
        listLabel="Combined Report"
        screen={(open) => <CombinedReportScreen onOpenRow={open} />}
        rows={COMBINED_REPORT_SECTIONS}
        tabLabel={(line) => line}
        tabIcon={CurrencyDollar}
        record={(line) => <ReportLineRecordPage line={line} />}
        flyout={(line) => reportLinePage(line)}
    />
);

export const CombinedRevenueIdea3 = () => (
    <TabbedIdea
        nav={{ activeId: NAV_IDS.combinedRevenue, initialQuery: "combin" }}
        course="bushwood"
        title="Combined Revenue"
        description="Every revenue line for the period, reconciled against money in."
        listLabel="Combined Revenue"
        screen={(open) => <CombinedRevenueScreen initiallyCollapsed onOpenRow={open} />}
        rows={REVENUE_SECTIONS}
        tabLabel={(s) => s.title}
        tabIcon={CurrencyDollar}
        record={(s) => <RevenueSectionRecordPage section={s} />}
        flyout={revenueSectionPage}
    />
);

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PunchCardsScreen } from "@/components/application/migration-v2/screens-credits";
import { ALL_SCOPE_CARDS } from "@/components/application/punch-cards-table/data";
import { LisaConcerns } from "@/components/application/punch-cards-table/lisa-concerns";
import { PunchCardsTable } from "@/components/application/punch-cards-table/punch-cards-table";

/**
 * Archive: earlier explorations of Reports › Credits › Punch Cards and Lisa's 1c round, kept for reference.
 * The final design is "1 Customer Punch Cards". Story IDs are fixed, so links shared earlier still work.
 */
const meta = {
    title: "Prototypes/Punch Cards/3 Archive/Customer Punch Cards Explorations",
    id: "prototypes-punch-cards-table",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Agreed direction (Loom, 10/27): flexible filters, no summary boxes, no caption line. Offering types and their balances per card. */
export const FlexibleFiltersNoSummary: Story = {
    name: "1b · (final is in 1 Customer Punch Cards)",
    render: () => <PunchCardsTable version="filters" showSummary={false} showIntro={false} detailTabs cardFilter />,
};

/** The existing report, starting on the customer-card table. Bulk Entry opens the screen from the supplied reference. */
export const Original: Story = { name: "Explore · 0 Original report", render: () => <PunchCardsScreen initialView="list" /> };

/** 1a · Reference-inspired filter chips, with the four summary boxes and caption that 1b removed. */
export const FlexibleFilters: Story = { name: "Explore · 1a Flexible filters", render: () => <PunchCardsTable version="filters" /> };

/** Six offering workspaces. Columns switch to the relevant product, activity duration, clinic or instructor. */
export const OfferingWorkspaces: Story = { name: "Explore · 2 Offering workspaces", render: () => <PunchCardsTable version="offerings" /> };

/** Operational segments and collapsible groups by punch-card product or customer. */
export const PortfolioViews: Story = { name: "Explore · 3 Portfolio views", render: () => <PunchCardsTable version="groups" /> };

/** Lisa's 1c round: 1b with a column per offering. Superseded: the team keeps 1b here, and Lisa's view is the Products › Punch Cards list. */
export const LisaEdits: Story = {
    name: "Lisa · 1c Offering columns (superseded)",
    render: () => <PunchCardsTable version="filters" showSummary={false} showIntro={false} offeringColumns />,
};

/** All vs specific, as text ("Any activity · 60 min" vs "Simulator Bays · 60 min"). Weston's pick applies to the Products › Punch Cards list. */
export const LisaEditsScopeText: Story = {
    name: "Lisa · 1c-A All vs specific: text",
    render: () => <PunchCardsTable version="filters" showSummary={false} showIntro={false} offeringColumns scopeDisplay="text" extraCards={ALL_SCOPE_CARDS} />,
};

/** All vs specific, as an "All" tag beside whole-category balances. Weston's pick applies to the Products › Punch Cards list. */
export const LisaEditsScopeTag: Story = {
    name: "Lisa · 1c-B All vs specific: tag",
    render: () => <PunchCardsTable version="filters" showSummary={false} showIntro={false} offeringColumns scopeDisplay="tag" extraCards={ALL_SCOPE_CARDS} />,
};

/** All vs specific, as a compact "All" / "Specific" chip. Weston's pick applies to the Products › Punch Cards list. */
export const LisaEditsScopeChip: Story = {
    name: "Lisa · 1c-C All vs specific: chip",
    render: () => <PunchCardsTable version="filters" showSummary={false} showIntro={false} offeringColumns scopeDisplay="chip" extraCards={ALL_SCOPE_CARDS} />,
};

/** Notes: Lisa's concern, the 10/27 decisions, and where things landed after the Loom. */
export const LisaConcernsNotes: Story = { name: "Lisa · Notes", render: () => <LisaConcerns /> };

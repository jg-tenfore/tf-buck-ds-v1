import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PunchCardsScreen } from "@/components/application/migration-v2/screens-credits";
import { PunchCardsTable } from "@/components/application/punch-cards-table/punch-cards-table";

const meta = {
    title: "Prototypes/Punch Cards Table",
    id: "prototypes-punch-cards-table",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The existing report, starting on the customer-card table. Bulk Entry opens the screen from the supplied reference. */
export const Original: Story = { name: "0 · Original report", render: () => <PunchCardsScreen initialView="list" /> };

/** 1a · Reference-inspired filter chips. Offering types use OR; status, course, membership, purchase period and search narrow the result together. */
export const FlexibleFilters: Story = { name: "1a · Flexible filters", render: () => <PunchCardsTable version="filters" /> };

/** 1b · Same as 1a without the four summary boxes, so the filters and table start higher on the page. Status filtering stays in Filters. */
export const FlexibleFiltersNoSummary: Story = {
    name: "1b · Flexible filters, no summary boxes",
    render: () => <PunchCardsTable version="filters" showSummary={false} />,
};

/** Six offering workspaces. Columns switch to the relevant product, activity duration, clinic or instructor; mixed cards retain their other balances in details. */
export const OfferingWorkspaces: Story = { name: "2 · Offering workspaces", render: () => <PunchCardsTable version="offerings" /> };

/** Operational segments and collapsible groups. Switch grouping between punch-card product and customer without double-counting mixed cards. */
export const PortfolioViews: Story = { name: "3 · Portfolio views", render: () => <PunchCardsTable version="groups" /> };

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PunchCardsScreen } from "@/components/application/migration-v2/screens-credits";
import { LisaConcerns } from "@/components/application/punch-cards-table/lisa-concerns";
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

/** 1b · Same as 1a without the summary boxes or the caption line above the table, so the table starts right under the page header. Status filtering stays in Filters. */
export const FlexibleFiltersNoSummary: Story = {
    name: "1b · Flexible filters, no summary boxes",
    render: () => <PunchCardsTable version="filters" showSummary={false} showIntro={false} />,
};

/**
 * 1c · Lisa Edits - 102726. Built off 1b (no summary boxes, no caption), with one column per offering instead of
 * "Offering types" + a combined balance: Rounds, Transportation, Activities, Clinics, Products, Lessons, each
 * remaining / awarded. Filtering by offering type narrows the columns; Columns can hide any of them.
 */
export const LisaEdits: Story = {
    name: "1c · Lisa Edits - 102726",
    render: () => <PunchCardsTable version="filters" showSummary={false} showIntro={false} offeringColumns />,
};

/** 1c · Lisa's concerns: the missed view, what 1c changes from 1b, and open questions. */
export const LisaConcernsNotes: Story = { name: "1c · Lisa's concerns", render: () => <LisaConcerns /> };

/** Six offering workspaces. Columns switch to the relevant product, activity duration, clinic or instructor; mixed cards retain their other balances in details. */
export const OfferingWorkspaces: Story = { name: "2 · Offering workspaces", render: () => <PunchCardsTable version="offerings" /> };

/** Operational segments and collapsible groups. Switch grouping between punch-card product and customer without double-counting mixed cards. */
export const PortfolioViews: Story = { name: "3 · Portfolio views", render: () => <PunchCardsTable version="groups" /> };

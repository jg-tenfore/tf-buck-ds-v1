import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as ChargesIdeas from "@/components/application/migration-v2/ideas/ideas-charges";
import * as Tabbed from "@/components/application/migration-v2/ideas/ideas-tabbed";
import { ChargeHistoryScreen } from "@/components/application/migration-v2/screens-charges";

/**
 * A customer's charges, payments and frozen invoices.
 *
 * The same edge case three ways — the screen as it works today, then two
 * proposals that only re-arrange what exists (no new fields or features).
 */
const meta = {
    title: "Migration V2 Ideas/5 Charges › History",
    id: "migration-v2-ideas-history",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Today's screen. */
export const Original: Story = {
    name: "1. Original",
    render: () => <ChargeHistoryScreen initialView="activity" />,
};

/** Idea 1 · Slide-over panel. Starts on today's table — click a name to open its panel; ↑/↓ steps through the rows. The history opens in a panel: totals as cards, payments, charges and invoices as rows, Reset invoices as a drill-down. */
export const Idea1: Story = {
    name: "2. Idea 1",
    render: () => <ChargesIdeas.HistoryIdea1 />,
};

/** Idea 2 · Record page. Starts on today's table — click a name to load its page; the back arrow returns to the table. The history as a page: totals in the summary bar, both tables in the main column, export formats and reset under More actions. */
export const Idea2: Story = {
    name: "3. Idea 2",
    render: () => <ChargesIdeas.HistoryIdea2 />,
};

/** Idea 3 · Tabbed records. Starts on today's table — click a row to open it as a tab laid out like Idea 2; edits (pencils, More actions) open the side panel from Idea 1. */
export const Idea3: Story = {
    name: "4. Idea 3",
    render: () => <Tabbed.HistoryIdea3 />,
};

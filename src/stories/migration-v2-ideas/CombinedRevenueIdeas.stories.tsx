import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as RevenueIdeas from "@/components/application/migration-v2/ideas/ideas-revenue";
import * as Tabbed from "@/components/application/migration-v2/ideas/ideas-tabbed";
import { CombinedRevenueScreen } from "@/components/application/migration-v2/screens-revenue";

/**
 * An empty period across 15 sections.
 *
 * The same edge case three ways — the screen as it works today, then two
 * proposals that only re-arrange what exists (no new fields or features).
 */
const meta = {
    title: "Migration V2 Ideas/7 Revenue › Combined Revenue",
    id: "migration-v2-ideas-combined-revenue",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Today's screen. */
export const Original: Story = {
    name: "1. Original",
    render: () => <CombinedRevenueScreen />,
};

/** Idea 1 · Slide-over panel. Starts on today's table — click a name to open its panel; ↑/↓ steps through the rows. The 15 sections become grouped rows with totals in a panel; empty ones are muted. */
export const Idea1: Story = {
    name: "2. Idea 1",
    render: () => <RevenueIdeas.CombinedRevenueIdea1 />,
};

/** Idea 2 · Record page. Starts on today's table — click a name to load its page; the back arrow returns to the table. One summary of all 15 sections instead of 15 empty tables; filters and Money In in the rail. */
export const Idea2: Story = {
    name: "3. Idea 2",
    render: () => <RevenueIdeas.CombinedRevenueIdea2 />,
};

/** Idea 3 · Tabbed records. Starts on today's table — click a row to open it as a tab laid out like Idea 2; edits (pencils, More actions) open the side panel from Idea 1. */
export const Idea3: Story = {
    name: "4. Idea 3",
    render: () => <Tabbed.CombinedRevenueIdea3 />,
};

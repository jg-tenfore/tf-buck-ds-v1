import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as RevenueIdeas from "@/components/application/migration-v2/ideas/ideas-revenue";
import * as Tabbed from "@/components/application/migration-v2/ideas/ideas-tabbed";
import { CombinedReportScreen } from "@/components/application/migration-v2/screens-revenue";

/**
 * September 2026, derived from the Combined Revenue data (references/100226).
 *
 * The same report three ways — the screen as it works today, then two
 * proposals that only re-arrange what exists (no new fields or features).
 */
const meta = {
    title: "Migration V2 Ideas/6 Revenue › Combined Report",
    id: "migration-v2-ideas-combined-report",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Today's screen. */
export const Original: Story = {
    name: "1. Original",
    render: () => <CombinedReportScreen />,
};

/** Idea 1 · Slide-over panel. Starts on today's table — click a name to open its panel; ↑/↓ steps through the rows. The report opens as a panel: period up top, totals as cards, lines as rows. */
export const Idea1: Story = {
    name: "2. Idea 1",
    render: () => <RevenueIdeas.CombinedReportIdea1 />,
};

/** Idea 2 · Record page. Starts on today's table — click a name to load its page; the back arrow returns to the table. The report as a page: totals in the summary bar, the period in the rail. */
export const Idea2: Story = {
    name: "3. Idea 2",
    render: () => <RevenueIdeas.CombinedReportIdea2 />,
};

/** Idea 3 · Tabbed records. Starts on today's table — click a row to open it as a tab laid out like Idea 2; edits (pencils, More actions) open the side panel from Idea 1. */
export const Idea3: Story = {
    name: "4. Idea 3",
    render: () => <Tabbed.CombinedReportIdea3 />,
};

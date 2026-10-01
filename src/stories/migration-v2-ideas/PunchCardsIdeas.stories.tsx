import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as CreditsIdeas from "@/components/application/migration-v2/ideas/ideas-credits";
import * as Tabbed from "@/components/application/migration-v2/ideas/ideas-tabbed";
import { PunchCardsScreen } from "@/components/application/migration-v2/screens-credits";

/**
 * Bulk entry for a customer who isn't on file.
 *
 * The same edge case three ways — the screen as it works today, then two
 * proposals that only re-arrange what exists (no new fields or features).
 */
const meta = {
    title: "Migration V2 Ideas/1 Credits › Punch Cards",
    id: "migration-v2-ideas-punch-cards",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Today's screen. */
export const Original: Story = {
    name: "1. Original",
    render: () => <PunchCardsScreen initialView="bulk-new-customer" />,
};

/** Idea 1 · Slide-over panel. Starts on today's table — click a name to open its panel; ↑/↓ steps through the rows. Bulk Entry opens as a panel over the punch-card list. */
export const Idea1: Story = {
    name: "2. Idea 1",
    render: () => <CreditsIdeas.PunchCardsIdea1 />,
};

/** Idea 2 · Record page. Starts on today's table — click a name to load its page; the back arrow returns to the table. Bulk Entry as its own page: cards in the main column, batch settings in the rail. */
export const Idea2: Story = {
    name: "3. Idea 2",
    render: () => <CreditsIdeas.PunchCardsIdea2 />,
};

/** Idea 3 · Tabbed records. Starts on today's table — click a row to open it as a tab laid out like Idea 2; edits (pencils, More actions) open the side panel from Idea 1. */
export const Idea3: Story = {
    name: "4. Idea 3",
    render: () => <Tabbed.PunchCardsIdea3 />,
};

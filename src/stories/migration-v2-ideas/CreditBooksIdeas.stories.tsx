import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as CreditsIdeas from "@/components/application/migration-v2/ideas/ideas-credits";
import * as Tabbed from "@/components/application/migration-v2/ideas/ideas-tabbed";
import { CreditBooksScreen } from "@/components/application/migration-v2/screens-credits";

/**
 * Funding a credit book that has no product linked.
 *
 * The same edge case three ways — the screen as it works today, then two
 * proposals that only re-arrange what exists (no new fields or features).
 */
const meta = {
    title: "Migration V2 Ideas/2 Credits › Credit Books",
    id: "migration-v2-ideas-credit-books",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Today's screen. */
export const Original: Story = {
    name: "1. Original",
    render: () => <CreditBooksScreen initialView="fund" />,
};

/** Idea 1 · Slide-over panel. Starts on today's table — click a name to open its panel; ↑/↓ steps through the rows. The book opens in a panel over the list; Fund is a drill-down page with the blocker shown as a warning. */
export const Idea1: Story = {
    name: "2. Idea 1",
    render: () => <CreditsIdeas.CreditBooksIdea1 />,
};

/** Idea 2 · Record page. Starts on today's table — click a name to load its page; the back arrow returns to the table. The book as a record page; Fund stays visible but disabled, with the reason inline. */
export const Idea2: Story = {
    name: "3. Idea 2",
    render: () => <CreditsIdeas.CreditBooksIdea2 />,
};

/** Idea 3 · Tabbed records. Starts on today's table — click a row to open it as a tab laid out like Idea 2; edits (pencils, More actions) open the side panel from Idea 1. */
export const Idea3: Story = {
    name: "4. Idea 3",
    render: () => <Tabbed.CreditBooksIdea3 />,
};

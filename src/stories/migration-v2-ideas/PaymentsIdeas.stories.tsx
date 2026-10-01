import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as ChargesIdeas from "@/components/application/migration-v2/ideas/ideas-charges";
import * as Tabbed from "@/components/application/migration-v2/ideas/ideas-tabbed";
import { PaymentsScreen } from "@/components/application/migration-v2/screens-charges";

/**
 * Refunding a payment.
 *
 * The same edge case three ways — the screen as it works today, then two
 * proposals that only re-arrange what exists (no new fields or features).
 */
const meta = {
    title: "Migration V2 Ideas/4 Charges › Payments",
    id: "migration-v2-ideas-payments",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Today's screen. */
export const Original: Story = {
    name: "1. Original",
    render: () => <PaymentsScreen initialView="refund" />,
};

/** Idea 1 · Slide-over panel. Starts on today's table — click a name to open its panel; ↑/↓ steps through the rows. The payment opens in a panel over the list; Refund drills into its own page. */
export const Idea1: Story = {
    name: "2. Idea 1",
    render: () => <ChargesIdeas.PaymentsIdea1 />,
};

/** Idea 2 · Record page. Starts on today's table — click a name to load its page; the back arrow returns to the table. The payment as a record page; Refund lives in More actions and opens the same confirmation. */
export const Idea2: Story = {
    name: "3. Idea 2",
    render: () => <ChargesIdeas.PaymentsIdea2 />,
};

/** Idea 3 · Tabbed records. Starts on today's table — click a row to open it as a tab laid out like Idea 2; edits (pencils, More actions) open the side panel from Idea 1. */
export const Idea3: Story = {
    name: "4. Idea 3",
    render: () => <Tabbed.PaymentsIdea3 />,
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PunchCardsOverview } from "@/components/application/punch-cards-table/punch-cards-overview";

/** Start here: the two punch card pages, links to their final stories, and the decisions behind them. */
const meta = {
    title: "Prototypes/Punch Cards/0 Overview",
    id: "prototypes-punch-cards-overview",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const FinalDeliverables: Story = { name: "Final deliverables", render: () => <PunchCardsOverview /> };

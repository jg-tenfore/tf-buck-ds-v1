import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { combination } from "@/components/application/punch-cards-v2/data";
import { PunchCardBuilder } from "@/components/application/punch-cards-v2/punch-card-page";

/** Hypothetical 6 · Range & Refresh. Two products on one card, no golf: range buckets and a drink. Fully interactive: edit, add or remove items. */
const meta = {
    title: "Prototypes/Punch Cards/3 Archive/Combos/Combo 6 · Range & Refresh",
    id: "prototypes-punch-cards-v2-combo-6",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BuiltCard: Story = { name: "Built card", render: () => <PunchCardBuilder initial={combination("range-refresh").card} /> };

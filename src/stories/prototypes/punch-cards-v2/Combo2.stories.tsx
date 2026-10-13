import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { combination } from "@/components/application/punch-cards-v2/data";
import { PunchCardBuilder } from "@/components/application/punch-cards-v2/punch-card-page";

/** Hypothetical 2 · Range Buckets. A single product: 10 large range buckets. Fully interactive: edit, add or remove items. */
const meta = {
    title: "Prototypes/Punch Cards V2/Combo 2 · Range Buckets",
    id: "prototypes-punch-cards-v2-combo-2",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BuiltCard: Story = { name: "Built card", render: () => <PunchCardBuilder initial={combination("range").card} /> };

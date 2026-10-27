import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { combination } from "@/components/application/punch-cards-v2/data";
import { PunchCardBuilder } from "@/components/application/punch-cards-v2/punch-card-page";

/** Hypothetical 8 · Everything Card. The Loom example: all six kinds on one card. Fully interactive: edit, add or remove items. */
const meta = {
    title: "Prototypes/Punch Cards/3 Archive/Combos/Combo 8 · Everything Card",
    id: "prototypes-punch-cards-v2-combo-8",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BuiltCard: Story = { name: "Built card", render: () => <PunchCardBuilder initial={combination("everything").card} /> };

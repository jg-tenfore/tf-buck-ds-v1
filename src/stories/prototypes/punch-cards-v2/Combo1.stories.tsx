import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { combination } from "@/components/application/punch-cards-v2/data";
import { PunchCardBuilder } from "@/components/application/punch-cards-v2/punch-card-page";

/** Hypothetical 1 · Golf & Cart. Rounds + cart fees: today's punch card, built the new way. Fully interactive: edit, add or remove items. */
const meta = {
    title: "Prototypes/Punch Cards/3 Archive/Combos/Combo 1 · Golf & Cart",
    id: "prototypes-punch-cards-v2-combo-1",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BuiltCard: Story = { name: "Built card", render: () => <PunchCardBuilder initial={combination("golf-cart").card} /> };

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { combination } from "@/components/application/punch-cards-v2/data";
import { PunchCardBuilder } from "@/components/application/punch-cards-v2/punch-card-page";

/** Hypothetical 4 · Clinic Pass. Group lessons: 4 clinics. Fully interactive: edit, add or remove items. */
const meta = {
    title: "Prototypes/Punch Cards/3 Archive/Combos/Combo 4 · Clinic Pass",
    id: "prototypes-punch-cards-v2-combo-4",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BuiltCard: Story = { name: "Built card", render: () => <PunchCardBuilder initial={combination("clinic").card} /> };

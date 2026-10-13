import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { combination } from "@/components/application/punch-cards-v2/data";
import { PunchCardBuilder } from "@/components/application/punch-cards-v2/punch-card-page";

/** Hypothetical 5 · Lesson Pack. Private lessons: 5 × 30 minutes with one pro. Fully interactive: edit, add or remove items. */
const meta = {
    title: "Prototypes/Punch Cards V2/Combo 5 · Lesson Pack",
    id: "prototypes-punch-cards-v2-combo-5",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BuiltCard: Story = { name: "Built card", render: () => <PunchCardBuilder initial={combination("lessons").card} /> };

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { combination } from "@/components/application/punch-cards-v2/data";
import { StackedConceptPage } from "@/components/application/punch-cards-v2/stacked-concept";

/**
 * Concept D · Stacked. Details and pricing in one section, and every section
 * the same full width so the page fills the screen: Details & Pricing, Punch
 * Card Items, Expiration, Applicable Courses. Add Item uses Concept A's dialog.
 */
const meta = {
    title: "Prototypes/Punch Cards/3 Archive/Builder 3D · Stacked",
    id: "prototypes-punch-cards-v2-full-flow-stacked",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const StartEmpty: Story = { name: "Start empty", render: () => <StackedConceptPage /> };

export const Filled: Story = { name: "Golf & Range Bundle · filled", render: () => <StackedConceptPage initial={combination("bundle").card} /> };

export const AddItemOpen: Story = {
    name: "Add Item open",
    render: () => <StackedConceptPage initial={combination("bundle").card} initialModal={{ open: true }} />,
};

export const Everything: Story = { name: "Everything Card · filled", render: () => <StackedConceptPage initial={combination("everything").card} /> };

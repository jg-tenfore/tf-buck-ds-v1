import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CombinationsGallery } from "@/components/application/punch-cards-v2/combinations";

/**
 * Eight hypothetical punch cards side by side, from a single item to every
 * kind at once, to see how each mix renders. Each also has its own full-page
 * component (Combo 1–8) built in the full flow.
 */
const meta = {
    title: "Prototypes/Punch Cards V2/4 Combinations Side by Side",
    id: "prototypes-punch-cards-v2-combinations",
    parameters: { layout: "fullscreen" },
    decorators: [(Story) => <div className="min-h-screen bg-secondary p-8">{Story()}</div>],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllCombinations: Story = { name: "All combinations", render: () => <CombinationsGallery /> };

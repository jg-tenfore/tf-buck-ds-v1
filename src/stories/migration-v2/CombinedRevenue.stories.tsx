import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CombinedRevenueScreen } from "@/components/application/migration-v2/screens-revenue";

/** Reports › Revenue › Combined Revenue (design: references/100126/7-6-revenue-combinedRevenue; data: references/100226). */
const meta = {
    title: "Migration V2/7 Revenue › Combined Revenue",
    id: "migration-v2-combined-revenue",
    component: CombinedRevenueScreen,
    parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CombinedRevenueScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** All 15 sections open with September 2026 data, then the Money In summary. */
export const AllSections: Story = { name: "All sections · September" };

/** Every section collapsed to its header and total. */
export const Collapsed: Story = { args: { initiallyCollapsed: true } };

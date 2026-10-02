import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CombinedReportScreen } from "@/components/application/migration-v2/screens-revenue";

/** Reports › Revenue › Combined Report (design: references/100126/6-revenue-combinedReport; data: derived from references/100226). */
const meta = {
    title: "Migration V2/6 Revenue › Combined Report",
    id: "migration-v2-combined-report",
    component: CombinedReportScreen,
    parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CombinedReportScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** September 2026: sales by category and payments by type, derived from the Combined Revenue data. */
export const EmptyPeriod: Story = { name: "September" };

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CombinedReportScreen } from "@/components/application/migration-v2/screens-revenue";

/** Reports › Revenue › Combined Report (references/100126/6-revenue-combinedReport). */
const meta = {
    title: "Migration V2/6 Revenue › Combined Report",
    id: "migration-v2-combined-report",
    component: CombinedReportScreen,
    parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CombinedReportScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A day with no sales or payments — every line $0.00. */
export const EmptyPeriod: Story = { name: "Empty period" };

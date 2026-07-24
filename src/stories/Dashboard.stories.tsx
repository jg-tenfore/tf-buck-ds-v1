import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CourseDashboard } from "@/components/application/dashboard/course-dashboard";

const meta = {
    title: "App Screens/Dashboard",
    component: CourseDashboard,
    parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CourseDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A course operations dashboard — activity + revenue at a glance. KPI tiles,
 * a revenue-by-channel trend, revenue mix, weekly bookings, tee-sheet
 * utilization, today's tee sheet, and a recent-activity feed. The same screen
 * is embedded in the **App Chrome / Global Nav** story beside the live nav.
 */
export const Default: Story = {
    render: () => <CourseDashboard />,
};

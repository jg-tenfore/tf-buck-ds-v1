import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Nov17LessonPackagesOverview } from "@/components/application/nov-17-2026/lesson-packages/overview";

const meta = {
    title: "Reviews/Nov 17 · Lesson packages (punch-card style)/Summary",
    id: "nov-17-2026-lesson-packages-overview",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = { name: "Overview", render: () => <Nov17LessonPackagesOverview /> };

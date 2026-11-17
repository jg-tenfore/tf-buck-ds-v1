import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Nov17Overview } from "@/components/application/nov-17-2026/overview";

const meta = {
    title: "Reviews/Nov 17 · Bay sheet & feedback/Summary",
    id: "nov-17-2026-overview",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = { name: "Overview", render: () => <Nov17Overview /> };

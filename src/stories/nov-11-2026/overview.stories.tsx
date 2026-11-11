import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Nov11Overview } from "@/components/application/nov-11-2026/overview";

const meta = {
    title: "Nov 11, 2026/Overview",
    id: "nov-11-2026-overview",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = { name: "Overview", render: () => <Nov11Overview /> };

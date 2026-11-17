import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Nov17PhotosOverview } from "@/components/application/nov-17-2026/default-photos-overview";

const meta = {
    title: "Reviews/Nov 17 · Default clinic photos/Summary",
    id: "nov-17-2026-default-photos-overview",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = { name: "Overview", render: () => <Nov17PhotosOverview /> };

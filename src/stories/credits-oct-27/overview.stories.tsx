import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CreditsOverview } from "@/components/application/credits-oct-27/overview";

/** The layout convention from the 10/27 check-in with Weston, the sub-tab decision, and links to every screen. */
const meta = {
    title: "Credits - OCT 27/0 Overview",
    id: "credits-oct-27-overview",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = { name: "Layout & decisions", render: () => <CreditsOverview /> };

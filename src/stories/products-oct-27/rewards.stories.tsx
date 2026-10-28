import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RewardsPage } from "@/components/application/products-oct-27/rewards";

/** Products › Rewards: a settings page. Save changes is the primary action at the top. */
const meta = {
    title: "Products - OCT 27/Rewards",
    id: "products-oct-27-rewards",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Products: Story = { name: "Products", render: () => <RewardsPage /> };

export const TeeFees: Story = { name: "Tee fees", render: () => <RewardsPage initialTab="tee" /> };

export const Transportation: Story = { name: "Transportation", render: () => <RewardsPage initialTab="transport" /> };

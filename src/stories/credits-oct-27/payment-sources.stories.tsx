import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PaymentSourcesPage } from "@/components/application/credits-oct-27/payment-sources";

/** Reports › Credits › Payment Sources in the new header. List only; reorganizing it was deferred on the 10/27 call. */
const meta = {
    title: "Credits - OCT 27/3 Payment Sources",
    id: "credits-oct-27-payment-sources",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const List: Story = { render: () => <PaymentSourcesPage /> };

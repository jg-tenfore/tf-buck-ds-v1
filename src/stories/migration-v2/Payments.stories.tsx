import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PaymentsScreen } from "@/components/application/migration-v2/screens-charges";

/** Reports › Charges › Payments — payments taken against charges (references/100126/4-charges->payments). */
const meta = {
    title: "Migration V2/4 Charges › Payments",
    id: "migration-v2-payments",
    component: PaymentsScreen,
    parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PaymentsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Successful payments, with the declined-payments summary open above the table. */
export const List: Story = { name: "List · declines expanded", args: { initialView: "list" } };

/** Declined summary collapsed to one line. */
export const DeclinesCollapsed: Story = { name: "Declines collapsed", args: { initialView: "declined-collapsed" } };

/** The Status filter open: Successful / Declined / All. */
export const StatusMenu: Story = { name: "Status menu open", args: { initialView: "status-menu" } };

/** The wide table scrolled right to the surcharge and amount columns and their totals. */
export const ScrolledToAmount: Story = { name: "Scrolled to amount", args: { initialView: "scrolled" } };

/** One payment opened as a tab. */
export const PaymentDetail: Story = { name: "Payment detail", args: { initialView: "detail" } };

/** Refund confirmation, capped at the payment amount. */
export const RefundModal: Story = { name: "Refund modal", args: { initialView: "refund" } };

/** The paying customer opened from the GCC ID. */
export const CustomerTab: Story = { name: "Customer tab", args: { initialView: "customer" } };

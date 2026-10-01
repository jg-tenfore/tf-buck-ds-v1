import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChargeHistoryScreen } from "@/components/application/migration-v2/screens-charges";

/** Reports › Charges › History — every charge, payment and frozen invoice for one customer (references/100126/5-charges->customerHistory). */
const meta = {
    title: "Migration V2/5 Charges › History",
    id: "migration-v2-charge-history",
    component: ChargeHistoryScreen,
    parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ChargeHistoryScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nothing selected yet. */
export const Empty: Story = { args: { initialView: "empty" } };

/** Customer search showing matches with email and phone. */
export const CustomerSearch: Story = { name: "Customer search", args: { initialView: "searching" } };

/** A customer selected with no charges, payments or invoices in the range. */
export const CustomerNoActivity: Story = { name: "Customer selected · no activity", args: { initialView: "selected" } };

/** A customer with activity: charges and payments (payments tinted), totals with a negative difference, and 14 frozen invoices — including irregular periods and a balance that jumps between invoices. */
export const CustomerWithActivity: Story = { name: "Customer with activity", args: { initialView: "activity" } };

/** Export formats: Excel, CSV, PDF, Copy to Clipboard, Print. */
export const ExportMenu: Story = { name: "Export menu open", args: { initialView: "export-menu" } };

/** Confirming Reset Invoices — destructive and can't be undone. */
export const ResetInvoicesConfirm: Story = { name: "Reset invoices confirm", args: { initialView: "reset-confirm" } };

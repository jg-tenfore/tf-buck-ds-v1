import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CreditBooksPage } from "@/components/application/credits-oct-27/credit-books";

/**
 * Reports › Credits › Credit Books in the new layout. Each book opens in its
 * own tab; Add Credit Book opens a Draft tab. Option A stacks Details,
 * Customers and Transactions as sections; Option B keeps them as sub-tabs.
 */
const meta = {
    title: "Credits - OCT 27/5 Credit Books",
    id: "credits-oct-27-credit-books",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const List: Story = { render: () => <CreditBooksPage /> };

/** Credit book #380: Balance, Details, Customers (23) and Transactions (39) on one page. */
export const OptionASections: Story = { name: "Option A · sections", render: () => <CreditBooksPage mode="sections" initialOpen={["380"]} /> };

/** The same book with sub-tabs: Details · Customers (23) · Transactions (39). */
export const OptionBSubTabs: Story = { name: "Option B · sub-tabs", render: () => <CreditBooksPage mode="tabs" initialOpen={["380"]} /> };

/** Option B on the Customers sub-tab. */
export const OptionBCustomers: Story = {
    name: "Option B · sub-tabs · Customers",
    render: () => <CreditBooksPage mode="tabs" initialOpen={["380"]} initialTab="customers" />,
};

/** Add Credit Book: a Draft tab with the details; funding and customers come after it's saved. */
export const NewCreditBook: Story = { name: "New credit book", render: () => <CreditBooksPage initialOpen={["new"]} /> };

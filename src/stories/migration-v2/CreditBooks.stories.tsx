import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CreditBooksScreen } from "@/components/application/migration-v2/screens-credits";

/** Reports › Credits › Credit Books — course-funded credit balances (references/100126/2-credits->creditBooks). */
const meta = {
    title: "Migration V2/2 Credits › Credit Books",
    id: "migration-v2-credit-books",
    component: CreditBooksScreen,
    parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CreditBooksScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** All 23 books with positive, zero and negative balances and a total row. */
export const List: Story = { args: { initialView: "list" } };

/** Add Credit Book modal: title, what it applies to, and expiration. */
export const AddModal: Story = { name: "Add modal", args: { initialView: "add" } };

/** A book open as a tab, on Details. */
export const Details: Story = { args: { initialView: "details" } };

/** Fund Credit Book modal when no product is linked yet — the submit button stays disabled. */
export const FundModal: Story = { name: "Fund modal · no product linked", args: { initialView: "fund" } };

/** The book's customers, with bulk actions disabled until rows are selected. */
export const Customers: Story = { args: { initialView: "customers" } };

/** A customer opened from the book as a third tab. */
export const CustomerTab: Story = { name: "Customer tab", args: { initialView: "customer" } };

/** All 30 transactions on the book (gift-card payouts). */
export const Transactions: Story = { args: { initialView: "transactions" } };

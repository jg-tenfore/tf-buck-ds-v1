import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PunchCardsScreen } from "@/components/application/migration-v2/screens-credits";

/** Reports › Credits › Punch Cards — punch cards sold and punches left (references/100126/1-credits->punchCards). */
const meta = {
    title: "Migration V2/1 Credits › Punch Cards",
    id: "migration-v2-punch-cards",
    component: PunchCardsScreen,
    parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PunchCardsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** All punch cards: linked customers, missing customer (N/A), one bought through an order, duplicate and lowercase names. */
export const List: Story = { args: { initialView: "list" } };

/** Bulk Entry tab for back-filling paper cards: one row, customer lookup, nothing saved yet. */
export const BulkEntry: Story = { name: "Bulk entry", args: { initialView: "bulk" } };

/** Bulk Entry when the customer isn't on file: enter a new customer (email or phone required). */
export const BulkEntryNewCustomer: Story = { name: "Bulk entry · new customer", args: { initialView: "bulk-new-customer" } };

/** Clicking a customer opens their profile as a closable tab (a new customer — every section empty). */
export const CustomerTab: Story = { name: "Customer tab", args: { initialView: "customer" } };

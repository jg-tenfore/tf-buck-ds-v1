import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChargesScreen } from "@/components/application/migration-v2/screens-charges";

/** Reports › Charges › Charges — orders charged to a customer account (references/100126/3-charges->charges). */
const meta = {
    title: "Migration V2/3 Charges › Charges",
    id: "migration-v2-charges",
    component: ChargesScreen,
    parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ChargesScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Charges for one day. */
export const List: Story = { args: { initialView: "list" } };

/** A customer opened from the list: header card plus 18 collapsed sections. */
export const Customer: Story = { args: { initialView: "customer" } };

/** The Profile section open: details, addresses and other settings. */
export const ProfileExpanded: Story = { name: "Profile expanded", args: { initialView: "profile-expanded" } };

/** Every section open — tables where there's history, empty states everywhere else. */
export const AllSectionsExpanded: Story = { name: "All sections expanded · empty states", args: { initialView: "all-sections" } };

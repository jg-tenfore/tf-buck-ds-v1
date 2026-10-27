import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PunchCardsTable } from "@/components/application/punch-cards-table/punch-cards-table";

/**
 * Reports › Credits › Punch Cards (customer cards): the agreed 1b list, and a
 * card's tab in Builder 3D's stacked layout with Cancel / Save at the top and
 * Transfer + History. Closing a tab with unsaved changes asks first.
 */
const meta = {
    title: "Credits - OCT 27/4 Punch Cards (Customer Cards)",
    id: "credits-oct-27-customer-punch-cards",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const props = { version: "filters", showSummary: false, showIntro: false, detailTabs: true, cardFilter: true, badge: "Beta", stackedDetail: true } as const;

export const List: Story = { render: () => <PunchCardsTable {...props} /> };

/** Mara Thompson's Range & Refresh (CPC-10493): Included Items, Details, Customer & History. */
export const CardOpen: Story = { name: "Card open", render: () => <PunchCardsTable {...props} initialOpenIds={["CPC-10493"]} /> };

/** Transfer the card and its remaining punches to another customer. */
export const Transfer: Story = { render: () => <PunchCardsTable {...props} initialOpenIds={["CPC-10493"]} initialModal="transfer" /> };

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PunchCardsTable } from "@/components/application/punch-cards-table/punch-cards-table";

/**
 * Page 1: Reports › Credits › Punch Cards, the customers who own a punch card. Final design (1b plus the 10/27 call):
 * each card's included items with remaining / awarded, a punch card filter, and a card opening as its own closable tab
 * where Used, the expiration date and transfers are edited.
 */
const meta = {
    title: "Prototypes/Punch Cards/1 Customer Punch Cards (Reports › Credits)",
    id: "prototypes-punch-cards-customer",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const final = { version: "filters", showSummary: false, showIntro: false, detailTabs: true, cardFilter: true } as const;

/** The list. Click a customer or punch card to open it as a tab. */
export const List: Story = { name: "List", render: () => <PunchCardsTable {...final} /> };

/** Filtered to one punch card (Range & Refresh) with the new Punch card filter. */
export const FilteredByPunchCard: Story = { name: "Filtered by punch card", render: () => <PunchCardsTable {...final} initialCardTitle="Range & Refresh" /> };

/** A card open in its own tab: correct Used, change the expiration date, or transfer it to another customer. */
export const CardOpenInATab: Story = { name: "Card open in a tab", render: () => <PunchCardsTable {...final} initialOpenIds={["CPC-10493"]} /> };

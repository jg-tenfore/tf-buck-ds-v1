import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GiftCardsPage } from "@/components/application/credits-oct-27/gift-cards";

/**
 * Reports › Credits › Gift Cards in the new layout: the list is the first tab,
 * and each card opens in its own tab with Cancel / Save at the top and
 * full-width sections. Option A stacks every former sub-tab as a section;
 * Option B keeps them as sub-tabs.
 */
const meta = {
    title: "Credits - OCT 27/1 Gift Cards",
    id: "credits-oct-27-gift-cards",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const List: Story = { render: () => <GiftCardsPage /> };

/** Gift card 274402 with Details, Restrictions, Customer & History, Orders, Credit Books and Emails all on one page. */
export const OptionASections: Story = { name: "Option A · sections", render: () => <GiftCardsPage mode="sections" initialOpen={["274402"]} /> };

/** The same card with the sub-tabs kept: Details · Outgoing orders · Incoming orders · Credit books · Resend emails. */
export const OptionBSubTabs: Story = { name: "Option B · sub-tabs", render: () => <GiftCardsPage mode="tabs" initialOpen={["274402"]} /> };

/** Transfer: pick the new holder, then confirm. The balance moves and the transfer lands in History. */
export const Transfer: Story = { render: () => <GiftCardsPage initialOpen={["274402"]} initialModal="transfer" /> };

/** Adjust balance from the Balance & Details section. */
export const AdjustBalance: Story = { name: "Adjust balance", render: () => <GiftCardsPage initialOpen={["274402"]} initialModal="adjust" /> };

/** Closing the tab with an unsaved change asks first. */
export const UnsavedChanges: Story = { name: "Unsaved changes warning", render: () => <GiftCardsPage initialOpen={["274402"]} unsavedWarning /> };

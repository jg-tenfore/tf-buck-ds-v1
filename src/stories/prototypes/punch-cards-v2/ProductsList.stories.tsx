import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PunchCardProducts } from "@/components/application/punch-cards-v2/products-list";

/**
 * Page 2 of 2: Products › Punch Cards (Beta), the punch cards created to be sold (not assigned to a customer).
 * Lisa's missing view. Per the 10/27 call: no Rounds / Transpos columns; one Included column lists every item and its
 * number ("Any round", "Tee Socks", "Any activity · 60 min each"), like 1b but with no progress bar. Add Punch Card opens a
 * new card in its own tab; a row opens that card to edit in a tab (same tabs as Customer Punch Cards). Builder: 3A.
 */
const meta = {
    title: "Prototypes/Punch Cards/2 Punch Card Products (Products › Punch Cards)/1 List",
    id: "prototypes-punch-card-products-list",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** QA's cards (same totals, incl. Clinic Golf & Activities), two "Any …" cards, then the Punch Cards V2 examples. Click a row or Add Punch Card. */
export const List: Story = { name: "List", render: () => <PunchCardProducts /> };

/** Filtered to cards that include activities or clinics. */
export const ActivitiesAndClinics: Story = { name: "List · activities & clinics", render: () => <PunchCardProducts initialKinds={["activity", "clinic"]} /> };

/** A row opened in its own tab: "Golf + Activity" in the builder to edit. Cancel closes the tab; the list tab stays. */
export const EditingACard: Story = { name: "Editing a card", render: () => <PunchCardProducts initialOpen={[{ id: 5 }]} /> };

/** Two tabs open: a card being edited and a new card, with the list one click away. */
export const TwoTabsOpen: Story = { name: "Two tabs open", render: () => <PunchCardProducts initialOpen={[{ id: 6 }, {}]} /> };

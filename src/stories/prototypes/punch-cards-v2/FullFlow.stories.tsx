import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { combination } from "@/components/application/punch-cards-v2/data";
import { CATALOG, PunchCardProducts } from "@/components/application/punch-cards-v2/products-list";

/**
 * Create & edit (builder 3A), inside the Products › Punch Cards page with the same tabs as Customer Punch Cards:
 * the list is the first tab, and each card opens in its own closable tab. Add Item → choose a kind → set it up →
 * Save Item adds it to the card; pencil edits, trash removes. Save Punch Card unlocks with a title, a price, at least
 * one item and one course, then updates the list. Cancel closes the tab.
 */
const meta = {
    title: "Prototypes/Punch Cards/2 Punch Card Products (Products › Punch Cards)/2 Create & Edit/1 Full Flow (3A)",
    id: "prototypes-punch-cards-v2-full-flow",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const bundle = combination("bundle").card;
/** The Golf & Range Bundle's row in the Products list. */
const bundleId = CATALOG.find((row) => row.card === bundle)!.id;

/** Add Punch Card pressed: a "New punch card" tab, blank, next to the list tab. */
export const StartEmpty: Story = { name: "Start empty", render: () => <PunchCardProducts initialOpen={[{}]} /> };

/** A new card's tab with Add Item already open on step 1. */
export const AddItemOpen: Story = { name: "Add Item open", render: () => <PunchCardProducts initialOpen={[{ modal: { open: true } }]} /> };

/** A row opened from the list: the Golf & Range Bundle in its own Edit tab, filled in and ready to save. */
export const Filled: Story = { name: "Golf & Range Bundle · filled", render: () => <PunchCardProducts initialOpen={[{ id: bundleId }]} /> };

/** Editing an item in that tab: the pencil opens Add Item straight on step 2 with its values. */
export const Editing: Story = {
    name: "Editing an item",
    render: () => {
        const item = bundle.items[2];
        return (
            <PunchCardProducts
                initialOpen={[
                    {
                        id: bundleId,
                        modal: {
                            open: true,
                            step: "details",
                            editingId: item.id,
                            draft: { kind: item.kind, punches: item.punches, target: item.target, duration: item.duration ?? 60, query: "" },
                        },
                    },
                ]}
            />
        );
    },
};

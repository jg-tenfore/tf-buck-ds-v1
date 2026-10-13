import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { combination } from "@/components/application/punch-cards-v2/data";
import { PunchCardBuilder } from "@/components/application/punch-cards-v2/punch-card-page";

/**
 * The whole flow working together, in today's back-office chrome with
 * Products › Punch Cards active. Add Item → choose a kind → set it up →
 * Save Item adds it to the card; pencil edits, trash removes. Save Punch Card
 * unlocks with a title, a price, at least one item and one course.
 */
const meta = {
    title: "Prototypes/Punch Cards V2/3 Full Flow",
    id: "prototypes-punch-cards-v2-full-flow",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** A blank New Punch Card: build one from scratch. */
export const StartEmpty: Story = { name: "Start empty", render: () => <PunchCardBuilder /> };

/** Add Item already open on step 1. */
export const AddItemOpen: Story = { name: "Add Item open", render: () => <PunchCardBuilder initialModal={{ open: true }} /> };

/** The concept screenshot, filled in and ready to save. */
export const Filled: Story = { name: "Golf & Range Bundle · filled", render: () => <PunchCardBuilder initial={combination("bundle").card} /> };

/** Editing an item opens straight on step 2 with its values. */
export const Editing: Story = {
    name: "Editing an item",
    render: () => {
        const card = combination("bundle").card;
        const item = card.items[2];
        return (
            <PunchCardBuilder
                initial={card}
                initialModal={{
                    open: true,
                    step: "details",
                    editingId: item.id,
                    draft: { kind: item.kind, punches: item.punches, target: item.target, duration: item.duration ?? 60, query: "" },
                }}
            />
        );
    },
};

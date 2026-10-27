import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EMPTY_DRAFT, draftFrom, withKind } from "@/components/application/punch-cards-v2/add-item";
import { combination } from "@/components/application/punch-cards-v2/data";
import { InlineConceptPage } from "@/components/application/punch-cards-v2/inline-concept";

/**
 * Concept B · Inline. The same page, but adding an item never leaves it: pick
 * a kind from the chips under the list and its fields open right there (one
 * step, nothing covering the card); the pencil opens a line in place.
 */
const meta = {
    title: "Prototypes/Punch Cards/3 Archive/Builder 3B · Inline",
    id: "prototypes-punch-cards-v2-full-flow-inline",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const bundle = combination("bundle").card;

export const StartEmpty: Story = { name: "Start empty", render: () => <InlineConceptPage /> };

/** A kind picked: its fields open under the list. */
export const Adding: Story = {
    name: "Adding an activity",
    render: () => (
        <InlineConceptPage
            initial={bundle}
            initialComposer={{ draft: { ...withKind(EMPTY_DRAFT, "activity"), duration: 45, punches: 8, target: "Fitness Classes" } }}
        />
    ),
};

/** The pencil opens the line in place. */
export const Editing: Story = {
    name: "Editing an item in place",
    render: () => <InlineConceptPage initial={bundle} initialComposer={{ draft: draftFrom(bundle.items[2]), editingId: bundle.items[2].id }} />,
};

export const Everything: Story = { name: "Everything Card · filled", render: () => <InlineConceptPage initial={combination("everything").card} /> };

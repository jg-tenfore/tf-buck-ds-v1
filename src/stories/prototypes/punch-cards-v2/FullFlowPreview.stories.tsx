import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EMPTY_DRAFT, draftFrom, withKind } from "@/components/application/punch-cards-v2/add-item";
import { combination } from "@/components/application/punch-cards-v2/data";
import { PreviewConceptPage } from "@/components/application/punch-cards-v2/preview-concept";

/**
 * Concept C · Live preview. One form column next to a sticky preview of the
 * card the customer gets. Kinds are big tiles that open a side panel straight
 * on that kind (no "choose type" step), and every change shows on the card.
 */
const meta = {
    title: "Prototypes/Punch Cards V2/3C Full Flow · Live Preview",
    id: "prototypes-punch-cards-v2-full-flow-preview",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const bundle = combination("bundle").card;

export const StartEmpty: Story = { name: "Start empty", render: () => <PreviewConceptPage /> };

export const Filled: Story = { name: "Golf & Range Bundle · filled", render: () => <PreviewConceptPage initial={bundle} /> };

/** A tile picked: the side panel opens on that kind. */
export const Adding: Story = {
    name: "Adding a lesson",
    render: () => (
        <PreviewConceptPage
            initial={bundle}
            initialDrawer={{ draft: { ...withKind(EMPTY_DRAFT, "lesson"), target: "Sam Ortega", duration: 45, punches: 3 } }}
        />
    ),
};

export const Editing: Story = {
    name: "Editing an item",
    render: () => <PreviewConceptPage initial={bundle} initialDrawer={{ draft: draftFrom(bundle.items[2]), editingId: bundle.items[2].id }} />,
};

export const Everything: Story = { name: "Everything Card · filled", render: () => <PreviewConceptPage initial={combination("everything").card} /> };

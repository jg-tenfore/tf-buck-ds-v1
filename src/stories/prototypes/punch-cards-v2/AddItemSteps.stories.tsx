import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AddItemPanelDemo } from "@/components/application/punch-cards-v2/add-item";
import { combination } from "@/components/application/punch-cards-v2/data";

/**
 * The Add Item dialog on its own. Step 1 picks what's being added; step 2
 * sets it up for that kind, then the number of punches. Each story is live:
 * Next, Back, Change and Save Item all work (Save resets the story).
 */
const meta = {
    title: "Prototypes/Punch Cards V2/2 Add Item Steps",
    id: "prototypes-punch-cards-v2-add-item-steps",
    parameters: { layout: "centered" },
    decorators: [(Story) => <div className="w-[512px]">{Story()}</div>],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Step 1: what are you adding? Six kinds; Next unlocks once one is picked. */
export const ChooseType: Story = { name: "1. Choose type", render: () => <AddItemPanelDemo /> };

export const ChooseTypeSelected: Story = {
    name: "1. Choose type · Activity picked",
    render: () => <AddItemPanelDemo draft={{ kind: "activity", punches: 5, target: "Simulator Bays", duration: 60, query: "" }} />,
};

/** Green fee: just the punches. */
export const GreenFee: Story = {
    name: "2. Green Fee",
    render: () => <AddItemPanelDemo step="details" draft={{ kind: "green-fee", punches: 10, target: "Any green fee", duration: 60, query: "" }} />,
};

/** Transportation: which fee (any cart fee, riding, single rider, push cart), then punches. */
export const Transportation: Story = {
    name: "2. Transportation",
    render: () => <AddItemPanelDemo step="details" draft={{ kind: "transportation", punches: 10, target: "Any cart fee", duration: 60, query: "" }} />,
};

/** Product: search the catalog, pick one, then punches. */
export const Product: Story = {
    name: "2. Product",
    render: () => <AddItemPanelDemo step="details" draft={{ kind: "product", punches: 10, target: "Range Bucket – Large", duration: 60, query: "range" }} />,
};

/** Product before one is picked: Save Item stays disabled. */
export const ProductUnpicked: Story = {
    name: "2. Product · nothing picked",
    render: () => <AddItemPanelDemo step="details" draft={{ kind: "product", punches: 10, target: "", duration: 60, query: "" }} />,
};

/** Activity: type, minutes per punch (an input box), then punches. */
export const Activity: Story = {
    name: "2. Activity",
    render: () => <AddItemPanelDemo step="details" draft={{ kind: "activity", punches: 5, target: "Simulator Bays", duration: 60, query: "" }} />,
};

/** Clinic: any clinic or a specific one, then punches. */
export const Clinic: Story = {
    name: "2. Clinic",
    render: () => <AddItemPanelDemo step="details" draft={{ kind: "clinic", punches: 1, target: "Any clinic", duration: 60, query: "" }} />,
};

/** Any length works: type the minutes per punch, e.g. a 45-minute class. */
export const ActivityCustom: Story = {
    name: "2. Activity · 45-minute class",
    render: () => <AddItemPanelDemo step="details" draft={{ kind: "activity", punches: 8, target: "Fitness Classes", duration: 45, query: "" }} />,
};

/** Lesson: any pro or a specific one, the lesson length in minutes, then punches. */
export const Lesson: Story = {
    name: "2. Lesson",
    render: () => <AddItemPanelDemo step="details" draft={{ kind: "lesson", punches: 5, target: "Sam Ortega", duration: 30, query: "" }} />,
};

/** Adding something already on the card: the dialog says it will merge into that line (10 + 5 = 15). */
export const ProductMerges: Story = {
    name: "2. Product · already on the card",
    render: () => (
        <AddItemPanelDemo
            step="details"
            existing={combination("bundle").card.items}
            draft={{ kind: "product", punches: 5, target: "Range Bucket – Large", duration: 60, query: "range" }}
        />
    ),
};

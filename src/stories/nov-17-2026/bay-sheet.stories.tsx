import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BaySheetPage } from "@/components/application/nov-11-2026/bay-sheet";

/**
 * Simulator Bays › Bay Sheet, with the Nov 17 changes: bays share the width
 * (fewer bays, wider columns), drag a booking to move it, drag its bottom edge
 * (or use +30m / +1h in its panel) to extend it, and no New booking button,
 * since booking starts on the sheet. Layout A (bay columns) was picked on
 * Nov 24, so Layout B is gone from here; both Nov 11 layouts are kept under
 * Reviews › Nov 11.
 */
const meta = {
    title: "Prototypes/Simulator Bays/Bay Sheet",
    id: "nov-17-2026-bay-sheet",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const H = (h: number, m = 0) => h * 60 + m;

/** Concept A: bays across, time down. Drag to move, drag the bottom edge to extend. */
export const ConceptA: Story = { name: "A · Bay columns", render: () => <BaySheetPage layout="columns" /> };

/** Four bays picked: each column takes a quarter of the width instead of a fixed 148px. */
export const FewerBays: Story = {
    name: "Fewer bays, wider columns",
    render: () => <BaySheetPage layout="columns" initialBays={["bay-1", "bay-2", "bay-3", "bay-4"]} />,
};

/** Tom Okafor's 10:30 in Bay 4: +30m and +1h in the panel. Nothing follows him, so both are open. */
export const Extend: Story = {
    name: "Extend from the booking",
    render: () => <BaySheetPage layout="columns" initialPanel={{ kind: "details", id: "r-4" }} />,
};

/** Clicking open time is how a booking starts now. */
export const Book: Story = {
    name: "Book from the sheet",
    render: () => <BaySheetPage layout="columns" initialPanel={{ kind: "book", draft: { bayId: "bay-2", start: H(11) } }} />,
};

/** Block a bay stays as a page action: a block isn't a booking, so it has no slot to start from. */
export const BlockBay: Story = {
    name: "Block a bay",
    render: () => <BaySheetPage layout="columns" initialPanel={{ kind: "block", draft: { bayId: "bay-3", start: H(12) } }} />,
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BaySheetPage } from "@/components/application/nov-11-2026/bay-sheet";

/**
 * Simulator Bays › Bay Sheet: the visual sheet customers asked for on the
 * Nov 11 call. It works like Birdie's bay sheet (book, repeat, notes, blocks,
 * check in, tabs, no-shows) and is drawn in Buck's own design system. Two
 * layouts share every panel, so they can be compared side by side.
 */
const meta = {
    title: "Nov 11, 2026/Bay Sheet",
    id: "nov-11-2026-bay-sheet",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const H = (h: number, m = 0) => h * 60 + m;

/** Concept A: bays across, time running down. Birdie's chosen layout, in Buck styling. */
export const ConceptA: Story = { name: "A · Bay columns", render: () => <BaySheetPage layout="columns" /> };

/** Concept B: the Daily Tee Sheet's layout (calendar, day stats, one row per half hour). */
export const ConceptB: Story = { name: "B · Tee sheet rows", render: () => <BaySheetPage layout="rows" /> };

/** Clicking open time on Bay 2 at 11:00 opens the booking panel there. */
export const Book: Story = {
    name: "Book a bay",
    render: () => <BaySheetPage layout="columns" initialPanel={{ kind: "book", draft: { bayId: "bay-2", start: H(11) } }} />,
};

/** Bay 4 is taken 10:30–12:30, so an 11:00 booking is refused. No override: it's red. */
export const Overlap: Story = {
    name: "Overlap is refused",
    render: () => <BaySheetPage layout="columns" initialPanel={{ kind: "book", draft: { bayId: "bay-4", start: H(11), customerId: "c-5" } }} />,
};

/** Maya already has two bookings today. The limit is a warning with an override: it's amber. */
export const DailyLimit: Story = {
    name: "Over the daily limit",
    render: () => <BaySheetPage layout="columns" initialPanel={{ kind: "book", draft: { bayId: "bay-2", start: H(12), customerId: "c-1" } }} />,
};

/** Sam's sim membership card has one punch left; a two-hour booking needs two. */
export const PunchShortfall: Story = {
    name: "Punch card falls short",
    render: () => <BaySheetPage layout="columns" initialPanel={{ kind: "book", draft: { bayId: "bay-1", start: H(11), customerId: "c-7", duration: 120 } }} />,
};

/** The standing Tuesday lesson: a weekly series, so it can be cancelled once or as a whole. */
export const Details: Story = {
    name: "Booking details · repeating",
    render: () => <BaySheetPage layout="columns" initialPanel={{ kind: "details", id: "r-7" }} />,
};

/** Checked in with a tab running. */
export const DetailsTab: Story = {
    name: "Booking details · tab open",
    render: () => <BaySheetPage layout="rows" initialPanel={{ kind: "details", id: "r-3" }} />,
};

/** Block time with a reason. A block can cover several bays at once and repeat. */
export const BlockBay: Story = {
    name: "Block a bay",
    render: () => <BaySheetPage layout="columns" initialPanel={{ kind: "block", draft: { bayId: "bay-3", start: H(12) } }} />,
};

/** Four bays picked and a golfer searched: everyone else fades back. */
export const Filtered: Story = {
    name: "Filtered and searched",
    render: () => <BaySheetPage layout="columns" initialBays={["bay-1", "bay-2", "bay-3", "bay-4"]} initialQuery="priya" />,
};

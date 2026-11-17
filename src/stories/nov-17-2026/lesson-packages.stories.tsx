import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NEW_PACKAGE } from "@/components/application/nov-17-2026/lesson-packages/data";
import { CustomerCredits as CustomerCreditsScreen, LessonPackages } from "@/components/application/nov-17-2026/lesson-packages/lesson-packages";

/**
 * Instruction › Lesson Packages, from the Nov 17 call: golfers buy a pack of lesson credits and
 * book the lessons one at a time, like a punch card. Staff set "5 lessons for $X" and Buck works
 * out the price per lesson and the saving against the instructor's single-lesson price. The
 * builder's preview is the card golfers see in Crane. The list, builder and customer credits
 * stories are all live: Save, Extend and Apply change what's on screen.
 */
const meta = {
    title: "Prototypes/Instruction/Lesson Packages",
    id: "nov-17-2026-lesson-packages",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Mike Kenny, 45-Minute Private ($115 single), 5 lessons, $520 typed: $104 a lesson, save $55 (10%). */
export const BuilderFivePack: Story = {
    name: "Builder · new 5-pack",
    render: () => <LessonPackages initialView="new" draft={{ ...NEW_PACKAGE, price: 520 }} />,
};

/** Doug Hamilton's 10-pack at three courses, opened from the list: $835, $83.50 a lesson (golfers see $84), save $115 (12%). */
export const BuilderTenPack: Story = {
    name: "Builder · 10-pack",
    render: () => <LessonPackages initialView="edit" editId="doug-hamilton--pack-10" />,
};

/** $600 for 5 against $575 singly: the pack costs $25 more, so the builder warns and the card shows no saving. */
export const BuilderAboveSingles: Story = {
    name: "Builder · price above singles",
    render: () => <LessonPackages initialView="new" draft={{ ...NEW_PACKAGE, price: 600 }} />,
};

/** Kate Schanuel, 10 lessons for $500 against $900 singly: 44% off, over the 40% line. */
export const BuilderDeepDiscount: Story = {
    name: "Builder · deep discount",
    render: () => <LessonPackages initialView="new" draft={{ ...NEW_PACKAGE, instructorId: "kate-schanuel", credits: 10, price: 500 }} />,
};

/** Every pack: Crane's nine on sale plus two drafts, with per-lesson price, saving, status and number sold. A row opens the builder. */
export const PackagesList: Story = {
    name: "Packages list",
    render: () => <LessonPackages initialView="list" />,
};

/** Mara Linden's three packs: credits left, purchase and expiry dates, redemption history, Extend expiry and Apply a credit. */
export const CustomerCredits: Story = {
    name: "Customer credits",
    render: () => <CustomerCreditsScreen />,
};

/** Kate Schanuel's pack expires in 7 days: extend it by 3 months to Feb 24, 2027, with a reason. */
export const ExtendExpiry: Story = {
    name: "Extend-expiry dialog",
    render: () => <CustomerCreditsScreen initialDialog="extend" extendId="bal-ks-5" initialReason="Injury or illness" />,
};

/** Mike Kenny applies one of Mara's credits to today's 2:00 PM lesson at the tee. Packs for other instructors can't pay for it. */
export const ApplyCredit: Story = {
    name: "Apply a credit dialog",
    render: () => <CustomerCreditsScreen initialDialog="apply" />,
};

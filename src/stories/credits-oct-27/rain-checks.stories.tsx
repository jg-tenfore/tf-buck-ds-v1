import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RainChecksPage } from "@/components/application/credits-oct-27/rain-checks";

/**
 * Reports › Credits › Rain Checks in the new layout. Each rain check opens in
 * its own tab; Add Rain Check opens a Draft tab. Option A stacks the former
 * sub-tabs as sections; Option B keeps them as sub-tabs.
 */
const meta = {
    title: "Credits - OCT 27/2 Rain Checks",
    id: "credits-oct-27-rain-checks",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const List: Story = { render: () => <RainChecksPage /> };

/** Rain check 58576: Balance & Details, Customer & History and Transactions on one page. */
export const OptionASections: Story = { name: "Option A · sections", render: () => <RainChecksPage mode="sections" initialOpen={["58576"]} /> };

/** The same rain check with sub-tabs: Details · Transactions. */
export const OptionBSubTabs: Story = { name: "Option B · sub-tabs", render: () => <RainChecksPage mode="tabs" initialOpen={["58576"]} /> };

/** Transfer to another customer (they need a reservation at this course). */
export const Transfer: Story = { render: () => <RainChecksPage initialOpen={["58576"]} initialModal="transfer" /> };

/** Void, from the record header. */
export const Void: Story = { render: () => <RainChecksPage initialOpen={["58576"]} initialModal="void" /> };

/** Add Rain Check: a Draft tab to issue one against a reservation at this course. */
export const NewRainCheck: Story = { name: "New rain check", render: () => <RainChecksPage initialOpen={["new"]} /> };

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GlobalNav } from "@/components/application/migration-v2/global-nav";
import { NAV_IDS } from "@/components/application/migration-v2/nav-tree";

/**
 * The back-office accordion nav, rebuilt from the production screenshots
 * (references/100126/global nav). Every Migration V2 screen renders inside it.
 * Try it: open and close sections, use expand/collapse all, or type to filter.
 */
const meta = {
    title: "Migration V2/Global Nav",
    component: GlobalNav,
    parameters: { layout: "fullscreen" },
    decorators: [
        (Story) => (
            <div className="h-screen min-h-[720px] bg-secondary">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof GlobalNav>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every section closed — the nav at rest. */
export const Collapsed: Story = { args: { initialExpanded: "none" } };

/** Everything expanded (expand-all), from the top: three levels with guide lines. */
export const Expanded: Story = { args: { initialExpanded: "all" } };

/** Expanded and scrolled down to the active page (Reports › Revenue › Combined Revenue). */
export const ExpandedScrolledToActive: Story = {
    name: "Expanded · scrolled to active",
    args: { initialExpanded: "all", activeId: NAV_IDS.combinedRevenue, scrollToActive: true },
};

/** Only the active page's path is open; the active row is tinted and its ancestors' icons turn brand green. */
export const ActiveItem: Story = { name: "Active item", args: { activeId: NAV_IDS.combinedRevenue } };

/** Typing filters to matching pages plus their parents; the expand-all button becomes a close button. */
export const SearchFiltering: Story = { name: "Search filtering", args: { initialQuery: "punch", activeId: NAV_IDS.punchCards } };

/** A search that matches nothing. */
export const SearchNoResults: Story = { name: "Search · no results", args: { initialQuery: "zzz" } };

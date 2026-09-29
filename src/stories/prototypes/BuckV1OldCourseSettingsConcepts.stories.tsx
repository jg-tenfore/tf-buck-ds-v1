import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ConceptCommandMenu } from "@/components/application/buck-v1-old/concept-command-menu";
import { ConceptRelayout } from "@/components/application/buck-v1-old/concept-relayout";
import { ConceptSearch } from "@/components/application/buck-v1-old/concept-search";
import { ConceptSearchDialog } from "@/components/application/buck-v1-old/concept-search-dialog";

/**
 * Three directions for making the (very long) course settings easier to work
 * with, built on the "Buck V1 Old – Course Settings" rebuild. Also live at
 * http://localhost:6020/concept-1-relayout, /concept-2-search and
 * /concept-3-command-menu and /concept-4-search-dialog (`npm run proto:course-settings`).
 */
const meta = {
    title: "Prototypes/Buck V1 Old – Course Settings/Concepts",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Sections redesigned case by case: chips + Manage for payment types, tax matrix, compact switch grids, and more. */
export const Relayout: Story = {
    name: "1 · Re-laid out",
    render: () => <ConceptRelayout />,
};

/** Search rail + narrower settings. Unrelated settings dim to 10% and lock; matches are highlighted and listed. */
export const DynamicSearch: Story = {
    name: "2 · Dynamic search",
    render: () => <ConceptSearch />,
};

/** The original screen with a big command-menu search bar above it (grouped results, breadcrumbs, Ask TenFore AI). */
export const CommandMenu: Story = {
    name: "3 · Command menu",
    render: () => <ConceptCommandMenu />,
};

/** Concept 1's re-laid out page; the rail search (or ⌘K) opens concept 3's search as a dialog, and ↵ jumps to the setting. */
export const SearchDialog: Story = {
    name: "4 · Re-laid out + search dialog",
    render: () => <ConceptSearchDialog />,
};

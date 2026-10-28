import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ModifiersPage } from "@/components/application/products-oct-27/modifiers";

/** Products › Modifiers: two lists as the first tabs; modifiers and groups each open in their own tab. */
const meta = {
    title: "Products - OCT 27/Modifiers",
    id: "products-oct-27-modifiers",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const List: Story = { name: "Modifiers", render: () => <ModifiersPage /> };

export const ModifierGroups: Story = { name: "Modifier groups", render: () => <ModifiersPage initialList="groups" /> };

/** 2 Egg in its tab. */
export const EditModifier: Story = { name: "Edit modifier", render: () => <ModifiersPage initialOpen={[{ modifier: 1 }]} /> };

/** Burger Temps in its tab (a modal in prod). */
export const EditModifierGroup: Story = { name: "Edit modifier group", render: () => <ModifiersPage initialList="groups" initialOpen={[{ group: 1501 }]} /> };

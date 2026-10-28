import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MenusPage } from "@/components/application/products-oct-27/menus";

/** Products › Menus: reorder with up / down; each menu (and Add menu) opens in its own tab. */
const meta = {
    title: "Products - OCT 27/Menus",
    id: "products-oct-27-menus",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const List: Story = { name: "List", render: () => <MenusPage /> };

/** Happy Hour in its tab. */
export const EditMenu: Story = { name: "Edit menu", render: () => <MenusPage initialOpen={[6]} /> };

/** Add menu pressed: a Draft tab that can start as a copy of another menu. */
export const NewMenu: Story = { name: "New menu", render: () => <MenusPage initialOpen={["new"]} /> };

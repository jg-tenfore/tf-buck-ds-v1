import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProductGroupsPage } from "@/components/application/products-oct-27/product-groups";

/** Products › Groups: drag to reorder; each group opens in its own tab with its sub-groups. */
const meta = {
    title: "Products - OCT 27/Product Groups",
    id: "products-oct-27-product-groups",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const List: Story = { name: "List", render: () => <ProductGroupsPage /> };

/** Accessories, which has sub-groups. */
export const EditGroup: Story = { name: "Edit group", render: () => <ProductGroupsPage initialOpen={[439]} /> };

export const NewGroup: Story = { name: "New group", render: () => <ProductGroupsPage initialOpen={["new"]} /> };

export const AddFamily: Story = { name: "Add family", render: () => <ProductGroupsPage initialOpen={["new"]} initialModal="family" /> };

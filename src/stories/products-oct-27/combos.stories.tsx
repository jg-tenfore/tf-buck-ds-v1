import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CombosPage } from "@/components/application/products-oct-27/combos";

/** Products › Combos: bundles sold as one item. Each combo opens in its own tab; its products are added and edited in a dialog. */
const meta = {
    title: "Products - OCT 27/Combos",
    id: "products-oct-27-combos",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const List: Story = { name: "List", render: () => <CombosPage /> };

/** The 6 Pack Combo in its tab. */
export const EditCombo: Story = { name: "Edit combo", render: () => <CombosPage initialOpen={[1]} /> };

/** Add product pressed on the 6 Pack Combo. */
export const AddProduct: Story = { name: "Add a product", render: () => <CombosPage initialOpen={[1]} initialModal="add" /> };

/** A product in the combo being edited. */
export const EditProduct: Story = { name: "Edit a product", render: () => <CombosPage initialOpen={[1]} initialModal="edit" /> };

export const NewCombo: Story = { name: "New combo", render: () => <CombosPage initialOpen={["new"]} /> };

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DiscountTypesPage } from "@/components/application/products-oct-27/discount-types";

/** Products › Discount Types: each discount opens in its own tab; one choice of kind replaces the three amount fields. */
const meta = {
    title: "Products - OCT 27/Discount Types",
    id: "products-oct-27-discount-types",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const List: Story = { name: "List", render: () => <DiscountTypesPage /> };

/** 10% Everything in its tab. */
export const EditDiscountType: Story = { name: "Edit discount type", render: () => <DiscountTypesPage initialOpen={[1]} /> };

export const NewDiscountType: Story = { name: "New discount type", render: () => <DiscountTypesPage initialOpen={["new"]} /> };

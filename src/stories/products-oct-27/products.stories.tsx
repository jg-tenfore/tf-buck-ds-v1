import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProductsListPage } from "@/components/application/products-oct-27/products";

/**
 * Products › List in the new header. New product is the primary action;
 * Featured products, Copy to another course and Export sit in the Actions menu
 * beside it (more than three actions). Each product opens in its own tab, with
 * today's eight sub-tabs as stacked sections (A) or kept as sub-tabs (B).
 */
const meta = {
    title: "Products - OCT 27/Products",
    id: "products-oct-27-products",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const List: Story = { name: "List", render: () => <ProductsListPage /> };

/** Premium Vodka – Bottle with every former sub-tab stacked as a section. */
export const OptionASections: Story = { name: "Edit product · Option A sections", render: () => <ProductsListPage initialOpen={[77274]} /> };

/** The same product with the sub-tabs kept under the record header. */
export const OptionBSubTabs: Story = { name: "Edit product · Option B sub-tabs", render: () => <ProductsListPage mode="tabs" initialOpen={[77274]} /> };

/** New product pressed: a blank Draft tab. */
export const NewProduct: Story = { name: "New product", render: () => <ProductsListPage initialOpen={["new"]} /> };

export const FeaturedProducts: Story = { name: "Featured products", render: () => <ProductsListPage initialModal="featured" /> };

export const CopyToCourse: Story = { name: "Copy to another course", render: () => <ProductsListPage initialModal="copy" /> };

/** A price change that hasn't been saved, and its tab being closed. */
export const UnsavedChanges: Story = { name: "Unsaved changes warning", render: () => <ProductsListPage initialOpen={[77274]} unsavedWarning /> };

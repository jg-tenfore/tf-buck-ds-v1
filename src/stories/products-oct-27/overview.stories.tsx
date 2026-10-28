import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProductsOverview } from "@/components/application/products-oct-27/overview";

/** The layout convention, the primary / secondary actions rule, and links to every Products screen. */
const meta = {
    title: "Products - OCT 27/Overview",
    id: "products-oct-27-overview",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = { name: "Layout & actions", render: () => <ProductsOverview /> };

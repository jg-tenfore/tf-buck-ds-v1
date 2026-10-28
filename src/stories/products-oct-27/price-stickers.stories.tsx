import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PriceStickersPage } from "@/components/application/products-oct-27/price-stickers";

/** Products › Price Stickers: Star, Dymo and Avery 5160. Print is the primary action; a live preview shows the sticker. */
const meta = {
    title: "Products - OCT 27/Price Stickers",
    id: "products-oct-27-price-stickers",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Star: Story = { name: "Star", render: () => <PriceStickersPage printer="star" /> };

/** A product picked, so the preview shows it. */
export const StarPicked: Story = { name: "Star · product picked", render: () => <PriceStickersPage printer="star" initialProduct="Tour Golf Balls – Dozen" /> };

export const Dymo: Story = { name: "Dymo", render: () => <PriceStickersPage printer="dymo" /> };

export const Avery5160: Story = { name: "Avery 5160", render: () => <PriceStickersPage printer="avery" /> };

/** Twelve labels on the sheet, ready to print. */
export const Avery5160Filled: Story = {
    name: "Avery 5160 · sheet started",
    render: () => <PriceStickersPage printer="avery" initialProduct="Logo Golf Glove" initialSheet={12} />,
};

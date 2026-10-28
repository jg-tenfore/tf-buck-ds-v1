import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { combination } from "@/components/application/punch-cards-v2/data";
import { CATALOG, PunchCardProducts } from "@/components/application/punch-cards-v2/products-list";

/**
 * Builder 3D · Stacked inside the Products › Punch Cards page header: breadcrumbs,
 * "Punch Cards" (Beta) with Export CSV / Add Punch Card, and the tab strip (the
 * list is the first tab, each card opens in its own closable tab). The card's
 * tab holds the stacked layout: Details & Pricing, Items, Expiration and
 * Applicable Courses, each full width in one column. Closing a tab (or Cancel)
 * with unsaved changes asks first.
 */
const meta = {
    title: "Products - OCT 27/Punch Cards",
    id: "products-oct-27-punch-cards",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The catalog row for a combination card (Golf & Range Bundle, Everything Card). */
const rowId = (key: string) => CATALOG.find((row) => row.card === combination(key).card)!.id;

/** The catalog, in the list tab. */
export const List: Story = { name: "List", render: () => <PunchCardProducts builder="stacked" confirmClose /> };

/** Add Punch Card pressed: a blank "New punch card" tab next to the list tab. */
export const StartEmpty: Story = { name: "Start empty", render: () => <PunchCardProducts builder="stacked" confirmClose initialOpen={[{}]} /> };

/** The 10 Rounder (#1) opened from the list in its own Edit tab. */
export const TenRounder: Story = { name: "10 Rounder · edit", render: () => <PunchCardProducts builder="stacked" confirmClose initialOpen={[{ id: 1 }]} /> };

/** The Golf & Range Bundle in its Edit tab, filled in and ready to save. */
export const Filled: Story = {
    name: "Golf & Range Bundle · filled",
    render: () => <PunchCardProducts builder="stacked" confirmClose initialOpen={[{ id: rowId("bundle") }]} />,
};

/** The bundle's tab with Add Item open on step 1. */
export const AddItemOpen: Story = {
    name: "Add Item open",
    render: () => <PunchCardProducts builder="stacked" confirmClose initialOpen={[{ id: rowId("bundle"), modal: { open: true } }]} />,
};

/** The Everything Card (all six kinds) in its Edit tab. */
export const Everything: Story = {
    name: "Everything Card · filled",
    render: () => <PunchCardProducts builder="stacked" confirmClose initialOpen={[{ id: rowId("everything") }]} />,
};

import type { ReactNode } from "react";
import { ArrowUpRight } from "@untitledui/icons";

const B = ({ children }: { children: ReactNode }) => <strong className="font-semibold text-primary">{children}</strong>;

/** A link to another story, opened in the Storybook window (works locally and on GitHub Pages / Netlify). */
const StoryLink = ({ id, children }: { id: string; children: ReactNode }) => (
    <a
        href={`./?path=/story/${id}`}
        target="_top"
        className="inline-flex items-center gap-1 font-medium text-brand-secondary hover:text-brand-secondary_hover hover:underline"
    >
        {children}
        <ArrowUpRight aria-hidden="true" className="size-3.5" />
    </a>
);

const Block = ({ title, children }: { title: string; children: ReactNode }) => (
    <section className="flex flex-col gap-2">
        <h2 className="text-md font-semibold text-primary">{title}</h2>
        <div className="flex flex-col gap-2 text-sm leading-relaxed text-secondary">{children}</div>
    </section>
);

/** In the order of today's Products menu. */
const PAGES: { name: string; actions: string; links: [string, string][] }[] = [
    {
        name: "Products",
        actions:
            "New product + Actions (Featured products, Copy to another course, Export). Record: Cancel, Actions (Duplicate, Put on hold, Print price sticker, Copy, Delete), Save.",
        links: [
            ["products-oct-27-products--list", "List"],
            ["products-oct-27-products--option-a-sections", "Edit · Option A sections"],
            ["products-oct-27-products--option-b-sub-tabs", "Edit · Option B sub-tabs"],
            ["products-oct-27-products--new-product", "New product"],
            ["products-oct-27-products--featured-products", "Featured products"],
            ["products-oct-27-products--copy-to-course", "Copy to another course"],
            ["products-oct-27-products--unsaved-changes", "Unsaved changes"],
        ],
    },
    {
        name: "Combos",
        actions: "Add combo. Record: Cancel, Actions (Duplicate, Delete), Save.",
        links: [
            ["products-oct-27-combos--list", "List"],
            ["products-oct-27-combos--edit-combo", "Edit combo"],
            ["products-oct-27-combos--add-product", "Add a product"],
            ["products-oct-27-combos--new-combo", "New combo"],
        ],
    },
    {
        name: "Price Stickers",
        actions: "Print is the primary action (disabled until there's something to print). Avery adds Clear sheet.",
        links: [
            ["products-oct-27-price-stickers--star", "Star"],
            ["products-oct-27-price-stickers--dymo", "Dymo"],
            ["products-oct-27-price-stickers--avery-5160", "Avery 5160"],
            ["products-oct-27-price-stickers--avery-5160-filled", "Avery 5160 · sheet started"],
        ],
    },
    {
        name: "Product Groups",
        actions: "New group + Add family. Record: Delete, Cancel, Save.",
        links: [
            ["products-oct-27-product-groups--list", "List"],
            ["products-oct-27-product-groups--edit-group", "Edit group"],
            ["products-oct-27-product-groups--new-group", "New group"],
            ["products-oct-27-product-groups--add-family", "Add family"],
        ],
    },
    {
        name: "Menus",
        actions: "Add menu + Export. Record: Cancel, Actions (Duplicate, Delete), Save.",
        links: [
            ["products-oct-27-menus--list", "List"],
            ["products-oct-27-menus--edit-menu", "Edit menu"],
            ["products-oct-27-menus--new-menu", "New menu"],
        ],
    },
    {
        name: "Rewards",
        actions: "Save changes is the primary action (a settings page, no tabs). Discard changes appears once something changed.",
        links: [
            ["products-oct-27-rewards--products", "Products"],
            ["products-oct-27-rewards--tee-fees", "Tee fees"],
        ],
    },
    {
        name: "Modifiers",
        actions: "Add modifier / Add modifier group (follows the list you're on) + Export. Records: Delete, Cancel, Save.",
        links: [
            ["products-oct-27-modifiers--list", "Modifiers"],
            ["products-oct-27-modifiers--modifier-groups", "Modifier groups"],
            ["products-oct-27-modifiers--edit-modifier", "Edit modifier"],
            ["products-oct-27-modifiers--edit-modifier-group", "Edit modifier group"],
        ],
    },
    {
        name: "Discount Types",
        actions: "Add discount type. Record: Delete, Cancel, Save.",
        links: [
            ["products-oct-27-discount-types--list", "List"],
            ["products-oct-27-discount-types--edit-discount-type", "Edit discount type"],
            ["products-oct-27-discount-types--new-discount-type", "New discount type"],
        ],
    },
    {
        name: "Punch Cards",
        actions: "Export CSV + Add Punch Card. Moved here from Credits - OCT 27.",
        links: [
            ["products-oct-27-punch-cards--list", "List"],
            ["products-oct-27-punch-cards--start-empty", "New card"],
            ["products-oct-27-punch-cards--ten-rounder", "10 Rounder · edit"],
            ["products-oct-27-punch-cards--filled", "Golf & Range Bundle"],
        ],
    },
];

/** Products - OCT 27: the Credits layout convention applied to every Products Beta screen, plus the actions rule. */
export function ProductsOverview() {
    return (
        <div className="min-h-screen bg-secondary px-8 py-10">
            <article className="mx-auto flex max-w-3xl flex-col gap-8 rounded-2xl bg-primary p-8 shadow-xs ring-1 ring-secondary">
                <header className="flex flex-col gap-2 border-b border-secondary pb-6">
                    <span className="text-xs font-semibold tracking-wider text-brand-secondary uppercase">Products · 10/28/26 · first pass</span>
                    <h1 className="text-display-xs font-semibold text-primary">Products in the Credits layout</h1>
                    <p className="text-sm text-tertiary">
                        Every Products Beta screen from references/102826, rebuilt on the header, tabs and Builder 3D body set up in Credits - OCT 27.
                    </p>
                </header>

                <Block title="Same convention as Credits">
                    <ul className="list-disc pl-5">
                        <li>
                            <B>Header:</B> breadcrumbs, title with a Beta badge, description, actions top right.
                        </li>
                        <li>
                            <B>Tabs:</B> the list is the first tab (Modifiers has two lists); each record opens in its own closable tab. New records open as a
                            Draft tab.
                        </li>
                        <li>
                            <B>Body:</B> full-width sections in one column. <B>Save and Cancel at the top.</B> Closing a tab or pressing Cancel with unsaved
                            changes asks first.
                        </li>
                        <li>Edits that were modals in prod (Edit modifier group, Add menu) are tabs now, like every other record.</li>
                    </ul>
                </Block>

                <Block title="New: primary and secondary actions">
                    <ul className="list-disc pl-5">
                        <li>
                            <B>One primary action</B>, always the rightmost button (New product, Add combo, Print, Save changes).
                        </li>
                        <li>
                            <B>Up to three actions</B> show as buttons. <B>More than three:</B> every secondary action moves into an <B>Actions ▾</B> menu right
                            beside the primary.
                        </li>
                        <li>
                            The same rule applies inside a record: Cancel and Save always show; a single extra (Delete) is a button before Cancel; two or more
                            go in Actions between Cancel and Save. Destructive items sit last in the menu, in red, and always confirm.
                        </li>
                        <li>Export is one menu (Excel, CSV, PDF, Copy to clipboard, Print), shown as its own button or as a section inside Actions.</li>
                    </ul>
                </Block>

                <Block title="Screens (in today's Products menu order)">
                    <div className="flex flex-col gap-3">
                        {PAGES.map((page) => (
                            <div key={page.name} className="rounded-xl p-4 ring-1 ring-secondary">
                                <p className="font-semibold text-primary">{page.name}</p>
                                <p className="text-xs text-tertiary">{page.actions}</p>
                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                                    {page.links.map(([id, label]) => (
                                        <StoryLink key={id} id={id}>
                                            {label}
                                        </StoryLink>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Block>

                <Block title="Changed on purpose (worth a look)">
                    <ul className="list-disc pl-5">
                        <li>Products: the old bottom bar (Delete, On Hold, Update) moved to the top; On Hold is an action plus a badge and banner.</li>
                        <li>Products › Where it's sold: each department's group picker sits on the department's own row, instead of a separate panel.</li>
                        <li>
                            Discount Types: the three "fill in exactly one" amount fields are now one choice (Percent off / Cost plus / Dollar amount) and one
                            amount.
                        </li>
                        <li>Price Stickers: a live preview of the sticker; Avery shows the 30-label sheet filling up.</li>
                        <li>Menus: reorder with up / down; days are pill toggles with Every day / Weekdays shortcuts.</li>
                    </ul>
                </Block>

                <Block title="Not in the screenshots (left out)">
                    <ul className="list-disc pl-5">
                        <li>What's on a menu (its products and order). Only the schedule and days are built.</li>
                        <li>Product search with typeahead in Price Stickers and Combos uses a simple picker for now.</li>
                        <li>
                            The old, non-Beta pages (Combos, Menus, Rewards…). Products and Product Groups have no Beta badge in prod but are already the new
                            style, so they're included.
                        </li>
                    </ul>
                </Block>
            </article>
        </div>
    );
}

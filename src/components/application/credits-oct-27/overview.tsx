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

const PAGES: { name: string; where: string; links: [string, string][] }[] = [
    {
        name: "Gift Cards",
        where: "Reports › Credits",
        links: [
            ["credits-oct-27-gift-cards--list", "List"],
            ["credits-oct-27-gift-cards--option-a-sections", "Option A · sections"],
            ["credits-oct-27-gift-cards--option-b-sub-tabs", "Option B · sub-tabs"],
            ["credits-oct-27-gift-cards--transfer", "Transfer"],
            ["credits-oct-27-gift-cards--unsaved-changes", "Unsaved changes warning"],
        ],
    },
    {
        name: "Rain Checks",
        where: "Reports › Credits",
        links: [
            ["credits-oct-27-rain-checks--list", "List"],
            ["credits-oct-27-rain-checks--option-a-sections", "Option A · sections"],
            ["credits-oct-27-rain-checks--option-b-sub-tabs", "Option B · sub-tabs"],
            ["credits-oct-27-rain-checks--transfer", "Transfer"],
            ["credits-oct-27-rain-checks--new-rain-check", "New rain check"],
        ],
    },
    { name: "Payment Sources", where: "Reports › Credits · list only for now", links: [["credits-oct-27-payment-sources--list", "List"]] },
    {
        name: "Punch Cards (customer cards)",
        where: "Reports › Credits",
        links: [
            ["credits-oct-27-customer-punch-cards--list", "List"],
            ["credits-oct-27-customer-punch-cards--card-open", "Card open"],
            ["credits-oct-27-customer-punch-cards--transfer", "Transfer"],
        ],
    },
    {
        name: "Credit Books",
        where: "Reports › Credits",
        links: [
            ["credits-oct-27-credit-books--list", "List"],
            ["credits-oct-27-credit-books--option-a-sections", "Option A · sections"],
            ["credits-oct-27-credit-books--option-b-sub-tabs", "Option B · sub-tabs"],
            ["credits-oct-27-credit-books--new-credit-book", "New credit book"],
        ],
    },
    {
        name: "Punch Card Products",
        where: "Products › Punch Cards · moved to Products - OCT 27",
        links: [
            ["products-oct-27-punch-cards--start-empty", "New card"],
            ["products-oct-27-punch-cards--ten-rounder", "10 Rounder · edit"],
            ["products-oct-27-punch-cards--filled", "Golf & Range Bundle"],
        ],
    },
];

/** Credits - OCT 27: what changed on the 10/27 call with Weston, and every screen in the new layout. */
export function CreditsOverview() {
    return (
        <div className="min-h-screen bg-secondary px-8 py-10">
            <article className="mx-auto flex max-w-3xl flex-col gap-8 rounded-2xl bg-primary p-8 shadow-xs ring-1 ring-secondary">
                <header className="flex flex-col gap-2 border-b border-secondary pb-6">
                    <span className="text-xs font-semibold tracking-wider text-brand-secondary uppercase">Credits · 10/27/26</span>
                    <h1 className="text-display-xs font-semibold text-primary">Credits in one layout</h1>
                    <p className="text-sm text-tertiary">
                        Every Reports › Credits screen, plus Products › Punch Cards, rebuilt on the same header, tabs and Builder 3D body. From the 10/27
                        check-in with Weston.
                    </p>
                </header>

                <Block title="The layout convention">
                    <ul className="list-disc pl-5">
                        <li>
                            <B>Header:</B> breadcrumbs, title with a Beta badge, description, and the page's actions top right (Export, Add …).
                        </li>
                        <li>
                            <B>Tabs:</B> the list is the first tab; each record opens in its own closable tab beside it. New records open as a Draft tab.
                        </li>
                        <li>
                            <B>Body (Builder 3D · Stacked):</B> full-width sections in one column, nothing side by side.
                        </li>
                        <li>
                            <B>Save and Cancel at the top</B> of the record, never at the bottom. Closing a tab or pressing Cancel with unsaved changes asks
                            first.
                        </li>
                        <li>
                            <B>Transfer</B> is a dedicated button on punch cards, gift cards and rain checks (never an editable customer field). Each transfer
                            is listed in the record's history.
                        </li>
                    </ul>
                </Block>

                <Block title="Decide: sub-tabs inside a record">
                    <p>Gift cards, rain checks and credit books had sub-tabs inside a record. Both options are built:</p>
                    <ul className="list-disc pl-5">
                        <li>
                            <B>Option A · sections:</B> every former sub-tab is a section on one scrolling page.
                        </li>
                        <li>
                            <B>Option B · sub-tabs:</B> the sub-tabs stay under the record header; each one's body is stacked sections.
                        </li>
                    </ul>
                </Block>

                <Block title="Screens">
                    <div className="flex flex-col gap-3">
                        {PAGES.map((page) => (
                            <div key={page.name} className="rounded-xl p-4 ring-1 ring-secondary">
                                <p className="font-semibold text-primary">{page.name}</p>
                                <p className="text-xs text-tertiary">{page.where}</p>
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

                <Block title="Not changed">
                    <ul className="list-disc pl-5">
                        <li>The list views keep their columns; only the header and tabs are new.</li>
                        <li>Payment Sources is list only. Reorganizing it was deferred.</li>
                    </ul>
                </Block>

                <Block title="Follow-ups">
                    <ul className="list-disc pl-5">
                        <li>Justin: create a "Credits" project in Linear and write up these decisions with screenshots.</li>
                        <li>Weston: send the existing Buck tickets and tag Justin on future design changes.</li>
                    </ul>
                </Block>
            </article>
        </div>
    );
}

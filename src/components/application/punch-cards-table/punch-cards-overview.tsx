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

const Page = ({ number, title, where, children }: { number: string; title: string; where: string; children: ReactNode }) => (
    <section className="flex flex-col gap-3 rounded-xl p-5 ring-1 ring-secondary">
        <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold tracking-wider text-brand-secondary uppercase">Page {number}</span>
            <h2 className="text-lg font-semibold text-primary">{title}</h2>
            <p className="text-sm text-tertiary">{where}</p>
        </div>
        {children}
    </section>
);

const Block = ({ title, children }: { title: string; children: ReactNode }) => (
    <section className="flex flex-col gap-2">
        <h2 className="text-md font-semibold text-primary">{title}</h2>
        <div className="flex flex-col gap-2 text-sm leading-relaxed text-secondary">{children}</div>
    </section>
);

/** Final deliverables for punch cards: the two pages, their stories, and the decisions behind them. */
export function PunchCardsOverview() {
    return (
        <div className="min-h-screen bg-secondary px-8 py-10">
            <article className="mx-auto flex max-w-3xl flex-col gap-8 rounded-2xl bg-primary p-8 shadow-xs ring-1 ring-secondary">
                <header className="flex flex-col gap-2 border-b border-secondary pb-6">
                    <span className="text-xs font-semibold tracking-wider text-brand-secondary uppercase">Final deliverables · 10/27/26</span>
                    <h1 className="text-display-xs font-semibold text-primary">Punch Cards</h1>
                    <p className="text-sm text-tertiary">
                        Two pages, agreed with Weston and Lisa on the 10/27 call. Everything else is in <B>3 Archive</B> for reference.
                    </p>
                </header>

                <Page number="1" title="Customer Punch Cards" where="Reports › Credits › Punch Cards · customers who own a card and their balances">
                    <ul className="flex flex-col gap-1.5 text-sm text-secondary">
                        <li>
                            <StoryLink id="prototypes-punch-cards-customer--list">List</StoryLink>: each card's items with remaining / awarded, search,
                            offering-type, punch card and other filters.
                        </li>
                        <li>
                            <StoryLink id="prototypes-punch-cards-customer--filtered-by-punch-card">Filtered by punch card</StoryLink>: e.g. only Range &amp;
                            Refresh.
                        </li>
                        <li>
                            <StoryLink id="prototypes-punch-cards-customer--card-open-in-a-tab">Card open in a tab</StoryLink>: correct Used, change the
                            expiration date, transfer to another customer.
                        </li>
                    </ul>
                </Page>

                <Page number="2" title="Punch Card Products" where="Products › Punch Cards (Beta) · the punch cards created to be sold">
                    <ul className="flex flex-col gap-1.5 text-sm text-secondary">
                        <li>
                            <StoryLink id="prototypes-punch-card-products-list--list">List</StoryLink>: one row per card, with an Included column listing every
                            item and its number.
                        </li>
                        <li>
                            <StoryLink id="prototypes-punch-card-products-list--editing-a-card">Editing a card</StoryLink>: a row opens the card in its own tab
                            to edit; Add Punch Card opens a new-card tab. Same tabs as page 1.
                        </li>
                        <li>
                            Create &amp; edit (builder 3A): <StoryLink id="prototypes-punch-cards-v2-full-flow--start-empty">Full flow</StoryLink>,{" "}
                            <StoryLink id="prototypes-punch-cards-v2-add-item-steps--choose-type">Add Item steps</StoryLink>,{" "}
                            <StoryLink id="prototypes-punch-cards-v2-page-sections--items">Page sections</StoryLink>.
                        </li>
                    </ul>
                </Page>

                <Block title="Decisions">
                    <ul className="list-disc pl-5">
                        <li>
                            On both pages a card opens as its own closable <B>tab</B>, not a modal. Several can be open at once. On page 1, edits and{" "}
                            <B>Transfer</B>
                            live in that tab (no transfer button in the list); on page 2, the tab holds the builder.
                        </li>
                        <li>
                            Both lists drop the Rounds and Transpos columns for a <B>list of included items</B>. The customer list shows remaining / awarded
                            with a bar; the products list shows just the item and its number.
                        </li>
                        <li>
                            Items read like QA: <B>Any round</B>, <B>Any transportation</B>, <B>Any activity</B>, <B>Any clinic</B>, <B>Any product</B>,{" "}
                            <B>Any pro</B>, or the specific item's name.
                        </li>
                        <li>
                            Creating and editing a punch card uses <B>builder 3A</B>: a page with a two-step Add Item dialog.
                        </li>
                    </ul>
                </Block>

                <Block title="Bugs to write up (Lisa)">
                    <ul className="list-disc pl-5">
                        <li>
                            <B>High priority:</B> creating a punch card from the beta page doesn't create or link its product. The old page does.
                        </li>
                        <li>Highlighting text inside a modal and releasing outside it closes the modal.</li>
                    </ul>
                </Block>

                <Block title="Still open">
                    <ul className="list-disc pl-5">
                        <li>Does the Products list need an Active / Retired status for cards no longer sold?</li>
                    </ul>
                </Block>
            </article>
        </div>
    );
}

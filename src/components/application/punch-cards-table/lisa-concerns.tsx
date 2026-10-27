import type { ReactNode } from "react";

const Block = ({ title, children }: { title: string; children: ReactNode }) => (
    <section className="flex flex-col gap-2">
        <h2 className="text-md font-semibold text-primary">{title}</h2>
        <div className="flex flex-col gap-2 text-sm leading-relaxed text-secondary">{children}</div>
    </section>
);

const B = ({ children }: { children: ReactNode }) => <strong className="font-semibold text-primary">{children}</strong>;

/** Notes for Lisa's punch card round: the concern, and where things landed after the 10/27 Loom and call with Weston and Lisa. */
export function LisaConcerns() {
    return (
        <div className="min-h-screen bg-secondary px-8 py-10">
            <article className="mx-auto flex max-w-3xl flex-col gap-8 rounded-2xl bg-primary p-8 shadow-xs ring-1 ring-secondary">
                <header className="flex flex-col gap-2 border-b border-secondary pb-6">
                    <span className="text-xs font-semibold tracking-wider text-brand-secondary uppercase">Lisa Edits · 10/27/26</span>
                    <h1 className="text-display-xs font-semibold text-primary">Punch card lists: where things landed</h1>
                    <p className="text-sm text-tertiary">After Weston's Loom and the 10/27 call with Weston and Lisa.</p>
                </header>

                <Block title="The concern">
                    <p>
                        A view was missed in planning. The punch card list only had <B>Rounds</B> and <B>Transpos</B> columns, so new offerings disappeared. For
                        example, "Golf + Activity" (3 rounds and 2 activities) showed 3 rounds and 0 transportation, and its activities appeared nowhere.
                    </p>
                </Block>

                <Block title="Two pages">
                    <ul className="list-disc pl-5">
                        <li>
                            <B>Reports › Credits › Punch Cards</B>: customers who own a card. <B>1b</B> is the design, with three changes from the call:
                            <ul className="mt-1 list-[circle] pl-5">
                                <li>A card opens as its own closable tab (not a modal); several can be open at once.</li>
                                <li>
                                    Edits live in that tab: correct Used, change the expiration date, and <B>Transfer</B> to another customer. No transfer
                                    button in the list.
                                </li>
                                <li>New filter: by punch card (e.g. only Range &amp; Refresh).</li>
                            </ul>
                        </li>
                        <li>
                            <B>Products › Punch Cards</B>: the punch cards created to be sold (Lisa's missing view). The Rounds and Transpos columns go; one{" "}
                            <B>Included</B> column lists every item and its number, like 1b's list but with no progress bar, since nothing is used yet.
                        </li>
                    </ul>
                </Block>

                <Block title="Decisions">
                    <ul className="list-disc pl-5">
                        <li>
                            <B>Any vs specific.</B> Wording matches QA: <B>Any round</B>, <B>Any transportation</B>, <B>Any activity</B>, <B>Any clinic</B>,{" "}
                            <B>Any product</B>, <B>Any pro</B>, or the specific item's name (e.g. Tee Socks, Short Game Clinic).
                        </li>
                        <li>
                            The 1c offering-column idea and the 1c-A/B/C display options are superseded by the Included column above. They're kept for
                            reference.
                        </li>
                    </ul>
                </Block>

                <Block title="Bugs to write up (Lisa)">
                    <ul className="list-disc pl-5">
                        <li>
                            <B>High priority:</B> creating a punch card from the new (beta) page doesn't create or link its product. The old page does, and then
                            only "where to sell it" is set in Products.
                        </li>
                        <li>Highlighting text inside a modal and releasing outside it closes the modal.</li>
                    </ul>
                </Block>

                <Block title="Still open">
                    <ul className="list-disc pl-5">
                        <li>Which builder concept (3A–3D) is the create / edit flow? The Products list opens 3A for now.</li>
                        <li>Does the Products list need an Active / Retired status for cards no longer sold?</li>
                    </ul>
                </Block>
            </article>
        </div>
    );
}

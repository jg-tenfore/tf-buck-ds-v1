import type { ReactNode } from "react";

const Block = ({ title, children }: { title: string; children: ReactNode }) => (
    <section className="flex flex-col gap-2">
        <h2 className="text-md font-semibold text-primary">{title}</h2>
        <div className="flex flex-col gap-2 text-sm leading-relaxed text-secondary">{children}</div>
    </section>
);

const B = ({ children }: { children: ReactNode }) => <strong className="font-semibold text-primary">{children}</strong>;

/** Notes for option 1c (Lisa Edits - 102726): the concern, what 1c changes from 1b, and what's still open. */
export function LisaConcerns() {
    return (
        <div className="min-h-screen bg-secondary px-8 py-10">
            <article className="mx-auto flex max-w-3xl flex-col gap-8 rounded-2xl bg-primary p-8 shadow-xs ring-1 ring-secondary">
                <header className="flex flex-col gap-2 border-b border-secondary pb-6">
                    <span className="text-xs font-semibold tracking-wider text-brand-secondary uppercase">Lisa Edits · 10/27/26</span>
                    <h1 className="text-display-xs font-semibold text-primary">Activities and clinics in the punch card list</h1>
                    <p className="text-sm text-tertiary">Notes for option 1c.</p>
                </header>

                <Block title="The concern">
                    <p>
                        A view was missed in planning. Today's punch card list only has <B>Rounds</B> and <B>Transpos</B> columns, so the new offerings don't
                        show. For example, "Golf + Activity" (3 rounds and 2 activities) shows 3 rounds and 0 transportation, and its 2 activities appear
                        nowhere. The list needs columns for <B>Activities</B> and <B>Clinics</B>.
                    </p>
                </Block>

                <Block title="What 1c changes from 1b">
                    <ul className="list-disc pl-5">
                        <li>Same screen as 1b: no summary boxes, no caption, same search, filters, Columns and Export.</li>
                        <li>
                            "Offering types" and the combined "Remaining / awarded" column become one column per offering: <B>Green fees</B>, <B>Transport</B>,{" "}
                            <B>Activities</B>, <B>Clinics</B>, then <B>Products</B> and <B>Lessons</B>, so no balance is lost.
                        </li>
                        <li>Each cell shows remaining / awarded with a bar, and what it's for when that's specific (e.g. Simulator Bays · 60 min).</li>
                        <li>Picking an offering type narrows the table to those columns. Columns › Offering columns can hide any of them.</li>
                    </ul>
                </Block>

                <Block title="Decisions · 10/27">
                    <ul className="list-disc pl-5">
                        <li>
                            <B>Rounds → Green fees.</B> The 1c columns now say Green fees, and the punch card builder prototype already says Green Fee. The live
                            builder still shows "Rounds", so the dev team needs to change it there too.
                        </li>
                        <li>
                            <B>All vs specific.</B> Activities, clinics and products can cover the whole category or specific items. The builder prototype now
                            offers <B>All activities</B>, <B>All clinics</B> and <B>All products</B> alongside the specific ones.
                        </li>
                    </ul>
                </Block>

                <Block title="For Weston: how should the list show all vs specific?">
                    <p>Three options, each the same 1c screen with example cards at the top (Activity Pass, Pro Shop Punches, Range &amp; Sim Mix):</p>
                    <ul className="list-disc pl-5">
                        <li>
                            <B>1c-A · Text:</B> a line under the balance names it, e.g. "All activities · 60 min" or "Simulator Bays · 60 min".
                        </li>
                        <li>
                            <B>1c-B · Tag:</B> an "All" tag beside whole-category balances. Specific items keep their name.
                        </li>
                        <li>
                            <B>1c-C · Chip:</B> just "All" or "Specific" under each balance (most compact). The full name shows on hover.
                        </li>
                    </ul>
                </Block>

                <Block title="Still open">
                    <ul className="list-disc pl-5">
                        <li>
                            Lisa's screenshot was the <B>Products › Punch Cards (Beta)</B> list (the punch cards for sale). 1c adds the columns to the
                            customer-cards screen. Does the Products list need the same columns?
                        </li>
                        <li>Should Products and Lessons stay visible by default, or start hidden under Columns?</li>
                    </ul>
                </Block>
            </article>
        </div>
    );
}

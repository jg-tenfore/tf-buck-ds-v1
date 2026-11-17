import type { ReactNode } from "react";
import { ArrowUpRight } from "@untitledui/icons";

const B = ({ children }: { children: ReactNode }) => <strong className="font-semibold text-primary">{children}</strong>;

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

const Links = ({ links }: { links: [string, string][] }) => (
    <div className="flex flex-wrap gap-x-4 gap-y-1">
        {links.map(([id, label]) => (
            <StoryLink key={id} id={id}>
                {label}
            </StoryLink>
        ))}
    </div>
);

const NOW = "nov-17-2026-bay-sheet--";
const THEN = "nov-11-2026-bay-sheet--";

const CHANGES: { title: string; body: ReactNode; links: [string, string][] }[] = [
    {
        title: "1 · Bays share the width",
        body: "Columns used to be a fixed 148px, so four bays left most of the screen empty. Now the bays split the width, so fewer bays get wider columns and more of each booking shows (names, notes). No column gets narrower than 132px: when the bays shown need more room than the screen has, the sheet scrolls sideways, as before.",
        links: [
            [`${NOW}fewer-bays`, "Four bays"],
            [`${NOW}concept-a`, "All ten bays"],
        ],
    },
    {
        title: "2 · Drag a booking to move it",
        body: (
            <>
                Pick up a booking and drop it on any open half hour, in the same bay or another. The drop is checked like a new booking: no overlap with another
                booking or a block, the party has to fit the bay, and nothing runs past closing. If it can't move, the sheet says why. A move can be{" "}
                <B>undone</B>. On a repeating booking only that day moves.
            </>
        ),
        links: [[`${NOW}concept-a`, "Try it on A"]],
    },
    {
        title: "3 · Extend from the sheet",
        body: (
            <>
                Drag a booking's bottom edge down to make it longer (it snaps to half hours and shows the new end time while you drag). Or open it and use{" "}
                <B>+30m</B> or <B>+1h</B>, which are greyed out with the reason when the next booking or a block is in the way. The fee follows the new length.
            </>
        ),
        links: [
            [`${NOW}extend`, "Extend from the booking"],
            [`${NOW}extend-tab`, "On B, tab open"],
        ],
    },
    {
        title: "4 · No New booking button",
        body: "Booking starts on the sheet: click open time on A, or Book on a row on B. Block a bay stays as a page action, since a block isn't tied to one slot and can cover several bays.",
        links: [
            [`${NOW}book`, "Book from the sheet"],
            [`${NOW}block-bay`, "Block a bay"],
        ],
    },
];

/** Nov 17, 2026: the Bay Sheet changes from the Nov 17 call with Weston. */
export function Nov17Overview() {
    return (
        <div className="min-h-screen bg-secondary px-8 py-10">
            <article className="mx-auto flex max-w-3xl flex-col gap-8 rounded-2xl bg-primary p-8 shadow-xs ring-1 ring-secondary">
                <header className="flex flex-col gap-2 border-b border-secondary pb-6">
                    <span className="text-xs font-semibold tracking-wider text-brand-secondary uppercase">Nov 17, 2026 · call with Weston</span>
                    <h1 className="text-display-xs font-semibold text-primary">Bay Sheet & feedback, round 2</h1>
                    <p className="text-sm text-tertiary">
                        On the Nov 17 call we went back over the Nov 11 Bay Sheet. Four changes came out of it, all built here. The sheet in Prototypes is now
                        this version; the Nov 11 version is kept in its own review folder to compare against.
                    </p>
                </header>

                <Block title="What changed">
                    <div className="flex flex-col gap-3">
                        {CHANGES.map((c) => (
                            <div key={c.title} className="rounded-xl p-4 ring-1 ring-secondary">
                                <p className="font-semibold text-primary">{c.title}</p>
                                <p className="mt-1 text-xs leading-relaxed text-tertiary">{c.body}</p>
                                <div className="mt-2">
                                    <Links links={c.links} />
                                </div>
                            </div>
                        ))}
                    </div>
                </Block>

                <Block title="Compare with Nov 11">
                    <p>Same data, same panels. Only the four changes above differ.</p>
                    <Links
                        links={[
                            [`${NOW}concept-a`, "Nov 17 · A"],
                            [`${THEN}concept-a`, "Nov 11 · A"],
                            [`${NOW}concept-b`, "Nov 17 · B"],
                            [`${THEN}concept-b`, "Nov 11 · B"],
                        ]}
                    />
                </Block>

                <Block title="Feedback file">
                    <p>
                        No new Buck rows on this call. The Nov 11 fixes (search on Rounds by Customer and the tee sheet reports, refunded no-shows kept in
                        history, the All Orders filter kept across courses, cancelled orders out of Problem Orders) are unchanged.
                    </p>
                    <Links
                        links={[
                            ["nov-11-2026-feedback--rounds-search", "Rounds by Customer"],
                            ["nov-11-2026-feedback--orders-filter-kept", "All Orders"],
                            ["nov-11-2026-overview--overview", "Nov 11 Summary"],
                        ]}
                    />
                </Block>

                <Block title="Still open">
                    <ul className="list-disc pl-5">
                        <li>Layout A (bay columns) or B (tee sheet rows). Drag to move and drag to extend are built on A only; B extends from the booking.</li>
                        <li>Whether the daily limit counts bookings or hours, and whether repeats need an end date (from Nov 11).</li>
                    </ul>
                </Block>

                <Block title="Also from the call, not in Buck">
                    <ul className="list-disc pl-5">
                        <li>
                            The chosen lessons and clinics prototype (Prototype 3) moves into the Crane repo, landing on clean lesson tiles with filters behind
                            a button.
                        </li>
                        <li>
                            A course's wish list for private lessons (permissions, messaging, packages, payroll and more) is for later; one story per item once
                            it arrives.
                        </li>
                    </ul>
                </Block>
            </article>
        </div>
    );
}

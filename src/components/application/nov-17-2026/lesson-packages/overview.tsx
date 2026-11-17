import type { ReactNode } from "react";
import { ArrowUpRight } from "@untitledui/icons";
import { packageById } from "./data";
import { PackCard } from "./pack-card";

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

const S = "nov-17-2026-lesson-packages--";

const BUILT: { title: string; body: ReactNode; links: [string, string][] }[] = [
    {
        title: "1 · Package builder",
        body: (
            <>
                Instruction › Lesson Packages › New package. Pick the <B>instructor</B> (or <B>Any academy instructor</B> for an academy-wide pack at the
                Academy rate) and the <B>lesson type</B>, which shows that instructor's single-lesson price. Pick <B>5</B>, <B>10</B> or a custom number of
                lessons, then type the one number that matters: the <B>pack price</B>. Then the courses where credits work, a badge if you want one, and
                transferable (off by default).
            </>
        ),
        links: [
            [`${S}builder-five-pack`, "New 5-pack"],
            [`${S}builder-ten-pack`, "10-pack (edit)"],
        ],
    },
    {
        title: "2 · Worked out for you",
        body: (
            <>
                Under the price, Buck shows the <B>price per lesson</B>, what the golfer <B>saves in dollars and percent</B> against buying the lessons singly,
                and a warning when the pack costs <B>more</B> than singles or the discount is <B>over 40%</B>. $520 for 5 against a $115 single shows $104 a
                lesson and saves $55 (10%). A per-lesson price with cents ($83.50) shows to golfers rounded, as Crane does ($84).
            </>
        ),
        links: [
            [`${S}builder-above-singles`, "Price above singles"],
            [`${S}builder-deep-discount`, "Deep discount"],
        ],
    },
    {
        title: "3 · The rulings, built in",
        body: (
            <>
                <B>Expiry is fixed</B> at 1 year after purchase, with the date a pack bought today would get. <B>One golfer per credit</B>, and the{" "}
                <B>24-hour rule</B> (cancel 24 hours ahead and the credit comes back; only instructors move a lesson) are shown as locked terms, not settings.
            </>
        ),
        links: [[`${S}builder-five-pack`, "Terms section"]],
    },
    {
        title: "4 · Live preview",
        body: "Beside the form, the pack card exactly as Crane shows golfers under Packages & credits: instructor, badge, Save $X, one dot per credit, courses, expiry, transfer, price and price per lesson. It changes as you type.",
        links: [[`${S}builder-five-pack`, "Preview"]],
    },
    {
        title: "5 · Packages list",
        body: "Every pack in a table: instructor, lesson, count, price, per-lesson price (single struck through), saving, courses, Active or Draft, and number sold, with totals on top. Crane's nine packs are on sale at Crane's prices, plus two drafts. A row opens the builder; Save brings it back.",
        links: [[`${S}packages-list`, "Packages list"]],
    },
    {
        title: "6 · Customer credits",
        body: (
            <>
                One golfer's packs: credits left as dots, value held, purchased and expiry dates, where they're valid, and the <B>redemption history</B>{" "}
                (bought, booked with a credit, applied at the lesson tee, credit returned under the 24-hour rule, expiry extended). Staff can{" "}
                <B>Extend expiry</B> for this golfer's pack only, by 1, 3, 6 or 12 months, with a required reason that goes into the history. Instructors{" "}
                <B>apply a credit</B> to a lesson at the lesson tee; packs for another instructor or lesson can't be picked.
            </>
        ),
        links: [
            [`${S}customer-credits`, "Customer credits"],
            [`${S}extend-expiry`, "Extend expiry"],
            [`${S}apply-credit`, "Apply a credit"],
        ],
    },
];

/** Nov 17, 2026: lesson packages (punch-card style), from the Nov 17 call with Weston and Jared. */
export function Nov17LessonPackagesOverview() {
    const sample = packageById("mike-kenny--pack-5")!;
    return (
        <div className="min-h-screen bg-secondary px-8 py-10">
            <article className="mx-auto flex max-w-3xl flex-col gap-8 rounded-2xl bg-primary p-8 shadow-xs ring-1 ring-secondary">
                <header className="flex flex-col gap-2 border-b border-secondary pb-6">
                    <span className="text-xs font-semibold tracking-wider text-brand-secondary uppercase">Nov 17, 2026 · call with Weston and Jared</span>
                    <h1 className="text-display-xs font-semibold text-primary">Lesson packages (punch-card style)</h1>
                    <p className="text-sm text-tertiary">
                        Golfers buy a pack of lesson credits and book the lessons one at a time, like a punch card. Today's system books every session at once.
                        Jared confirmed this fits the existing backend. In Buck, staff set "5 lessons for $X" and the builder does the math.
                    </p>
                </header>

                <Block title="What was asked">
                    <ul className="list-disc pl-5">
                        <li>Sell a pack of lesson credits (say 5) that the golfer books one lesson at a time later.</li>
                        <li>
                            An instructor or admin sets "5 lessons for $X", and Buck works out the per-lesson price and the discount against that instructor's
                            single-lesson price.
                        </li>
                        <li>Earlier rulings: credits expire 1 year after purchase (a date per pack), and admins can extend one golfer's pack.</li>
                        <li>
                            Golfers pay at booking, and pack credits redeem one per lesson. Cancelling 24 hours ahead returns the credit. Only instructors can
                            move a lesson.
                        </li>
                    </ul>
                </Block>

                <Block title="The card golfers see">
                    <div className="grid items-start gap-5 sm:grid-cols-[minmax(0,1fr)_330px]">
                        <p>
                            Set up here, Mike Kenny's 5-pack is the same card Crane shows golfers: <B>$520</B>, <B>$104 per lesson</B>, <B>Save $55</B> against
                            $575 for five singles. Buck uses Crane's instructors, lessons, rates and words ("5 × 45-Minute Private", "Expires 1 year after
                            purchase", "Non-transferable"), so every number on the list matches Crane's catalog.
                        </p>
                        <PackCard pack={sample} />
                    </div>
                </Block>

                <Block title="What was built">
                    <div className="flex flex-col gap-3">
                        {BUILT.map((c) => (
                            <div key={c.title} className="rounded-xl p-4 ring-1 ring-secondary">
                                <p className="font-semibold text-primary">{c.title}</p>
                                <p className="mt-1 text-xs leading-relaxed text-tertiary">{c.body}</p>
                                <div className="mt-2">
                                    <Links links={c.links} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <p>
                        It reuses Buck's patterns: the clinic template builder's layout (form left, sticky preview right), the Punch Cards add-item radio cards,
                        and the Credits tables, facts and modal.
                    </p>
                </Block>

                <Block title="Still open">
                    <ul className="list-disc pl-5">
                        <li>
                            <B>Who can create packs?</B> Built so anyone with Instruction access can. If only admins should, instructors would see the list and
                            customer credits but not New package or Edit.
                        </li>
                        <li>
                            <B>Can one pack mix lesson types?</B> Built as one lesson type per pack, like Crane (a 45-minute credit pays for a 45-minute
                            private). Mixing would need a rule for what a credit is worth on a longer or shorter lesson.
                        </li>
                        <li>
                            <B>A pack priced above singles.</B> The builder warns but still lets it publish, in case a pack bundles extras. It could block
                            publishing instead.
                        </li>
                        <li>
                            <B>No Lesson Packages item in the Global Nav yet.</B> These screens sit under Instruction; adding a sub-item is a one-line change
                            once the name is agreed.
                        </li>
                    </ul>
                </Block>
            </article>
        </div>
    );
}

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

const BAY = "nov-11-2026-bay-sheet--";
const FB = "nov-11-2026-feedback--";

/** Nov 11, 2026: what came out of the call with Weston, as screens. */
export function Nov11Overview() {
    return (
        <div className="min-h-screen bg-secondary px-8 py-10">
            <article className="mx-auto flex max-w-3xl flex-col gap-8 rounded-2xl bg-primary p-8 shadow-xs ring-1 ring-secondary">
                <header className="flex flex-col gap-2 border-b border-secondary pb-6">
                    <span className="text-xs font-semibold tracking-wider text-brand-secondary uppercase">Nov 11, 2026 · call with Weston · first pass</span>
                    <h1 className="text-display-xs font-semibold text-primary">Bay Sheet for Buck, plus the feedback file</h1>
                    <p className="text-sm text-tertiary">
                        Courses on the MCG call asked for a visual bay sheet in Buck. Buck has every booking, but only as a table. This category is that sheet
                        in two layouts, and the Buck rows from the MCG feedback file.
                    </p>
                </header>

                <Block title="1 · Bay Sheet: what Weston asked for">
                    <ul className="list-disc pl-5">
                        <li>
                            <B>See every bay at once</B>, like the tee sheet does for tee times, instead of the Simulator Bay Bookings table.
                        </li>
                        <li>
                            <B>Work like Birdie's bay sheet</B>: book the same way, repeat a booking, add a note. Function comes first.
                        </li>
                        <li>
                            <B>Look like Buck</B>, so going from the tee sheet to the bay sheet isn't jarring. It isn't a touchscreen, so it gets Buck's
                            navigation and mouse-sized controls.
                        </li>
                        <li>Match first, then compare the two side by side and improve for a v2.</li>
                    </ul>
                </Block>

                <Block title="Two layouts, same panels">
                    <div className="flex flex-col gap-3">
                        <div className="rounded-xl p-4 ring-1 ring-secondary">
                            <p className="font-semibold text-primary">A · Bay columns</p>
                            <p className="text-xs text-tertiary">
                                Birdie's chosen layout (Nov 2 review): bays across, time down, a booking's height is its length. Best for "which bay is free at
                                6?"
                            </p>
                            <div className="mt-2">
                                <Links links={[[`${BAY}concept-a`, "Open A"]]} />
                            </div>
                        </div>
                        <div className="rounded-xl p-4 ring-1 ring-secondary">
                            <p className="font-semibold text-primary">B · Tee sheet rows</p>
                            <p className="text-xs text-tertiary">
                                Buck's Daily Tee Sheet layout: month calendar, day stats with an hourly chart, notes, then one row per half hour with what
                                starts then and how many bays are free. Best for "what's happening next?"
                            </p>
                            <div className="mt-2">
                                <Links links={[[`${BAY}concept-b`, "Open B"]]} />
                            </div>
                        </div>
                    </div>
                    <p>
                        Both open the same <B>560px slide-over</B> (Birdie's direction for its dialogs), so the sheet stays visible while booking:
                    </p>
                    <Links
                        links={[
                            [`${BAY}book`, "Book a bay"],
                            [`${BAY}overlap`, "Overlap is refused"],
                            [`${BAY}daily-limit`, "Over the daily limit"],
                            [`${BAY}punch-shortfall`, "Punch card falls short"],
                            [`${BAY}details`, "Details · repeating"],
                            [`${BAY}details-tab`, "Details · tab open"],
                            [`${BAY}block-bay`, "Block a bay"],
                            [`${BAY}filtered`, "Filtered and searched"],
                        ]}
                    />
                </Block>

                <Block title="Same rules as Birdie">
                    <ul className="list-disc pl-5">
                        <li>
                            <B>Overlaps are refused</B> (red, no way past). <B>The daily limit warns</B> (amber, with an override). One is physics, the other is
                            policy.
                        </li>
                        <li>Cancelled and no-show bookings give their time back; a no-show still counts toward the limit.</li>
                        <li>Repeats: daily, weekly, every 2 weeks, monthly. Editing one day changes only that day; the series can be cancelled whole.</li>
                        <li>The fee follows the golfer's membership and the time of day; a punch card covers whole hours and the shortfall is shown.</li>
                        <li>Blocks need a reason, can cover several bays at once, can repeat, and can't land on a live booking.</li>
                        <li>
                            The left edge (A) or bottom bar (B) is the golfer's <B>membership colour</B>, picked on the plan, the same way the tee sheet draws
                            it. Bays have no colour.
                        </li>
                        <li>
                            Global Nav: <B>Simulator Bays › Bay Sheet</B> is added first, the way Tee Sheet leads Golf.
                        </li>
                    </ul>
                </Block>

                <Block title="2 · Feedback file (Buck rows)">
                    <div className="flex flex-col gap-3">
                        <div className="rounded-xl p-4 ring-1 ring-secondary">
                            <p className="font-semibold text-primary">Row 53 · Rounds by Customer needs a search</p>
                            <p className="text-xs text-tertiary">
                                Search by name, phone, email or customer #, and open a customer in place instead of going profile by profile.
                            </p>
                            <div className="mt-2">
                                <Links links={[[`${FB}rounds-search`, "Search"]]} />
                            </div>
                        </div>
                        <div className="rounded-xl p-4 ring-1 ring-secondary">
                            <p className="font-semibold text-primary">Row 22 · Refunded no-shows vanish from rounds history</p>
                            <p className="text-xs text-tertiary">They stay, marked "No-show · refunded", with a no-show count up top.</p>
                            <div className="mt-2">
                                <Links links={[[`${FB}rounds-expanded`, "Customer opened"]]} />
                            </div>
                        </div>
                        <div className="rounded-xl p-4 ring-1 ring-secondary">
                            <p className="font-semibold text-primary">Row 26 · Tee sheet reports need a search by name</p>
                            <p className="text-xs text-tertiary">
                                One search bar on Booked Reservations, Online Reservations and No Shows: name, phone, email or confirmation #.
                            </p>
                            <div className="mt-2">
                                <Links
                                    links={[
                                        [`${FB}booked-reservations`, "Booked"],
                                        [`${FB}online-reservations`, "Online"],
                                        [`${FB}no-shows`, "No Shows"],
                                    ]}
                                />
                            </div>
                        </div>
                        <div className="rounded-xl p-4 ring-1 ring-secondary">
                            <p className="font-semibold text-primary">Row 48 · All Orders filter resets on course switch; Problem Orders shows cancelled</p>
                            <p className="text-xs text-tertiary">
                                The status filter is kept when the course changes, and says where it came from. Problem Orders hides cancelled orders, with a
                                switch to show them.
                            </p>
                            <div className="mt-2">
                                <Links
                                    links={[
                                        [`${FB}orders-filter-kept`, "Filter kept"],
                                        [`${FB}problem-orders`, "Problem Orders"],
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                </Block>

                <Block title="Seen in the file, not taken here">
                    <ul className="list-disc pl-5">
                        <li>Birdie rows (gift card search by phone, raincheck default to 0%, Exec 9 vs Main notes): Birdie work, not Buck.</li>
                        <li>Mobile app: the waitlist confirmation should name the course (Exec 9 vs Main).</li>
                        <li>Row 35 · inventory sales history on the Products page: a bigger Products change, worth its own pass.</li>
                        <li>Row 30 · TIPS beta report fit and default day: a fix to the existing report, not new design.</li>
                    </ul>
                </Block>

                <Block title="Also from the call, not in this category">
                    <ul className="list-disc pl-5">
                        <li>
                            CraneWeb shop (replacing Fox): remap the Fox web layouts; mobile category menu or search; checkout with a shipping address for tax.
                            Timing depends on how big the tax work is.
                        </li>
                        <li>New Jackrabbit kiosk screens for marketing videos: already sent.</li>
                    </ul>
                </Block>

                <Block title="Open questions for Weston">
                    <ul className="list-disc pl-5">
                        <li>Which layout, A or B, or A with B's day stats on top?</li>
                        <li>Does the daily limit count bookings or hours, and can every role override it?</li>
                        <li>Do repeats need an end date, or is 12 weeks ahead enough?</li>
                    </ul>
                </Block>
            </article>
        </div>
    );
}

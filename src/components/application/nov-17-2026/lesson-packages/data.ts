/**
 * Lesson packages (punch-card style), from the Nov 17, 2026 call with Weston and Jared.
 *
 * A golfer buys a pack of lesson credits (say 5) and books the lessons one at a time later.
 * Staff set "5 lessons for $X" and Buck works out the price per lesson and the saving against
 * that instructor's single-lesson price.
 *
 * The instructors, lessons, prices and vocabulary match Crane's golfer-side packages
 * (tf-crane-ds-v1 `src/screens/web/instruction/data/packages.ts` and `catalog.ts`), so a pack set
 * up here is the card golfers see there: Mike Kenny's 5-pack is $520, $104 a lesson, save $55
 * against $575. Sample data on MCG Golf Academy's roster; the rates are a model, not MCG's prices.
 */

/* -------------------------------------------------------------------------- */
/*  Today                                                                     */
/* -------------------------------------------------------------------------- */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** The prototype's "today": the day of the call. */
export const TODAY = new Date(2026, 10, 17);

/** "Nov 17, 2026". */
export const fmtDate = (d: Date) => `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

/** "Nov 17, 2026" → Date (local). */
export const parseDate = (s: string) => {
    const [mon, day, year] = s.replace(",", "").split(" ");
    return new Date(Number(year), MONTHS.indexOf(mon), Number(day));
};

export const addMonths = (d: Date, n: number) => {
    const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
    const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
    return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), last));
};

/** Whole days from today to a date (negative once it's past). */
export const daysUntil = (d: Date) => Math.round((d.getTime() - TODAY.getTime()) / 86_400_000);

/* -------------------------------------------------------------------------- */
/*  The expiry ruling                                                         */
/* -------------------------------------------------------------------------- */

/** Justin's ruling: credits expire 1 year after purchase, a date per pack. Admins can extend one golfer's pack. */
export const CREDIT_TERM = "1 year after purchase";

/** A purchase date plus 12 months. */
export const expiryAfter = (purchased: Date) => new Date(purchased.getFullYear() + 1, purchased.getMonth(), purchased.getDate());

/* -------------------------------------------------------------------------- */
/*  Courses                                                                   */
/* -------------------------------------------------------------------------- */

export interface Course {
    id: string;
    name: string;
}

/** MCG Golf Academy's courses, in the Academy's order. */
export const COURSES: Course[] = [
    { id: "falls-road", name: "Falls Road" },
    { id: "hampshire-greens", name: "Hampshire Greens" },
    { id: "laytonsville", name: "Laytonsville" },
    { id: "little-bennett", name: "Little Bennett" },
    { id: "northwest", name: "Northwest" },
    { id: "needwood", name: "Needwood" },
    { id: "crossvines", name: "The Crossvines" },
    { id: "rattlewood", name: "Rattlewood" },
    { id: "sligo-creek", name: "Sligo Creek" },
];

export const courseName = (id: string) => COURSES.find((c) => c.id === id)?.name ?? id;

/* -------------------------------------------------------------------------- */
/*  Instructors                                                               */
/* -------------------------------------------------------------------------- */

export interface Instructor {
    id: string;
    name: string;
    credential: string | null;
    title: string;
    initials: string;
    courseIds: string[];
    /** Added to the Academy rate for a private (Crane's model: by Academy title). */
    priceAdj: number;
    /** An instructor's own single-lesson price for a lesson type, replacing rate + adjustment. */
    own?: Record<string, number>;
}

/** "Any academy instructor": an academy-wide pack, at the Academy rate, at every course. */
export const ANY_INSTRUCTOR: Instructor = {
    id: "any",
    name: "Any academy instructor",
    credential: null,
    title: "Academy-wide pack · Academy rate",
    initials: "MCG",
    courseIds: COURSES.map((c) => c.id),
    priceAdj: 0,
};

const ins = (
    id: string,
    name: string,
    credential: string | null,
    title: string,
    courseIds: string[],
    priceAdj: number,
    own?: Record<string, number>,
): Instructor => ({
    id,
    name,
    credential,
    title,
    initials: name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2),
    courseIds,
    priceAdj,
    own,
});

/** The instructors in the sample, in the Academy roster's order (Crane's ids and titles). */
export const INSTRUCTORS: Instructor[] = [
    ins("mike-kenny", "Mike Kenny", "PGA", "Director Of Instruction", ["falls-road"], 25),
    ins("brent-wilkerson", "Brent Wilkerson", null, "MCG Lead Instructor", ["falls-road"], 15),
    ins("doug-hamilton", "Doug Hamilton", "Master PGA", "MCG Certified Instructor", ["laytonsville", "little-bennett", "falls-road"], 5, {
        "private-45": 95,
        "private-60": 120,
    }),
    ins("kate-schanuel", "Kate Schanuel", "LPGA", "MCG Academy Instructor", ["falls-road"], 0),
    ins("brad-cameron", "Brad Cameron", null, "MCG Academy Instructor", ["laytonsville"], 0),
    ins("shellie-ferguson", "Shellie Ferguson", "PGA", "MCG Academy Instructor", ["laytonsville"], 0),
    ins("mike-dickson", "Mike Dickson", "Master PGA", "MCG Master Instructor", ["little-bennett"], 25),
    ins("martin-zadravec", "Martin Zadravec", null, "MCG Lead Instructor", ["northwest"], 15),
    ins("dustin-stearns", "Dustin Stearns", "PGA", "MCG Master Instructor", ["needwood"], 25),
];

export const instructorById = (id: string): Instructor => (id === "any" ? ANY_INSTRUCTOR : (INSTRUCTORS.find((i) => i.id === id) ?? ANY_INSTRUCTOR));

/** "Mike Kenny, PGA". */
export const displayName = (i: Instructor) => (i.credential ? `${i.name}, ${i.credential}` : i.name);

/* -------------------------------------------------------------------------- */
/*  Lesson types                                                              */
/* -------------------------------------------------------------------------- */

export interface LessonType {
    id: string;
    name: string;
    minutes: number;
    /** The Academy rate for one golfer. */
    academyRate: number;
    /** "45-minute privates", as the pack card says it. */
    plural: string;
}

/** Crane's private lessons (`catalog.ts` LESSON_SERVICES), one golfer each. */
export const LESSON_TYPES: LessonType[] = [
    { id: "private-45", name: "45-Minute Private", minutes: 45, academyRate: 90, plural: "45-minute privates" },
    { id: "private-60", name: "60-Minute Private", minutes: 60, academyRate: 115, plural: "60-minute privates" },
    { id: "private-30", name: "30-Minute Tune-Up", minutes: 30, academyRate: 60, plural: "30-minute tune-ups" },
    { id: "playing-9", name: "9-Hole Playing Lesson", minutes: 120, academyRate: 170, plural: "9-hole playing lessons" },
    { id: "junior-30", name: "Junior Private", minutes: 30, academyRate: 55, plural: "30-minute junior privates" },
    { id: "senior-45", name: "Senior Private", minutes: 45, academyRate: 75, plural: "45-minute senior privates" },
];

export const lessonById = (id: string): LessonType => LESSON_TYPES.find((l) => l.id === id) ?? LESSON_TYPES[0];

/** What one lesson of this type costs with this instructor, booked on its own (Crane's `servicePrice`, one golfer). */
export const singlePrice = (instructor: Instructor, lesson: LessonType) => instructor.own?.[lesson.id] ?? lesson.academyRate + instructor.priceAdj;

/* -------------------------------------------------------------------------- */
/*  The math                                                                  */
/* -------------------------------------------------------------------------- */

/** Over this, a discount is "unusually deep" and the builder asks staff to check. */
export const DEEP_DISCOUNT_PCT = 40;

export type PackWarning = "above-singles" | "deep-discount" | null;

export interface PackMath {
    single: number;
    /** What the same lessons cost booked one at a time. */
    listPrice: number;
    /** Exact price per lesson (may have cents). */
    perLessonExact: number;
    /** Price per lesson as golfers see it: whole dollars, like Crane's card. */
    perLesson: number;
    /** Dollars saved against buying singly (negative when the pack costs more). */
    savings: number;
    /** Whole percent saved against buying singly (negative when the pack costs more). */
    pct: number;
    warning: PackWarning;
}

/** Everything the builder works out from the one number staff type. */
export const packMath = (single: number, credits: number, price: number): PackMath => {
    const listPrice = single * credits;
    const savings = listPrice - price;
    const pct = listPrice ? Math.round((savings / listPrice) * 100) : 0;
    const perLessonExact = credits ? price / credits : 0;
    const warning: PackWarning = price > listPrice ? "above-singles" : listPrice && (savings / listPrice) * 100 > DEEP_DISCOUNT_PCT ? "deep-discount" : null;
    return { single, listPrice, perLessonExact, perLesson: Math.round(perLessonExact), savings, pct, warning };
};

/** "$520". */
export const money0 = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
/** "$83.50", or "$104" when it's whole. */
export const moneyExact = (n: number) => (Number.isInteger(n) ? money0(n) : `$${n.toFixed(2)}`);

/* -------------------------------------------------------------------------- */
/*  Packages                                                                  */
/* -------------------------------------------------------------------------- */

export type PackStatus = "active" | "draft";

export interface LessonPackage {
    id: string;
    instructorId: string;
    lessonId: string;
    credits: number;
    price: number;
    courseIds: string[];
    transferable: boolean;
    badge?: string;
    status: PackStatus;
    /** Packs sold so far. */
    sold: number;
}

/** "5 × 45-Minute Private", the pack's name on Crane's card. */
export const packLabel = (p: Pick<LessonPackage, "credits" | "lessonId">) => `${p.credits} × ${lessonById(p.lessonId).name}`;

export const mathFor = (p: Pick<LessonPackage, "instructorId" | "lessonId" | "credits" | "price">) =>
    packMath(singlePrice(instructorById(p.instructorId), lessonById(p.lessonId)), p.credits, p.price);

const to5 = (n: number) => Math.round(n / 5) * 5;

/** Crane's `packFor`: a pack on a 45-minute private, priced off the instructor's single rate. */
const packFor = (instructorId: string, credits: number, discount: number, sold: number, badge?: string): LessonPackage => {
    const instructor = instructorById(instructorId);
    const listPrice = singlePrice(instructor, lessonById("private-45")) * credits;
    return {
        id: `${instructorId}--pack-${credits}`,
        instructorId,
        lessonId: "private-45",
        credits,
        price: to5(listPrice * (1 - discount)),
        courseIds: instructor.courseIds,
        transferable: false,
        badge,
        status: "active",
        sold,
    };
};

/** Every pack: Crane's nine online packs (same prices), plus two drafts staff are still setting up. */
export const PACKAGES: LessonPackage[] = [
    packFor("mike-kenny", 5, 0.1, 38),
    packFor("mike-kenny", 10, 0.14, 12, "Best value"),
    packFor("mike-dickson", 5, 0.1, 21),
    packFor("doug-hamilton", 5, 0.09, 17),
    packFor("doug-hamilton", 10, 0.12, 6, "Best value"),
    packFor("brent-wilkerson", 5, 0.09, 14),
    packFor("kate-schanuel", 5, 0.09, 19),
    packFor("dustin-stearns", 5, 0.08, 9),
    packFor("brad-cameron", 5, 0.08, 11),
    {
        id: "any--pack-5",
        instructorId: "any",
        lessonId: "private-45",
        credits: 5,
        price: 405,
        courseIds: COURSES.map((c) => c.id),
        transferable: false,
        status: "draft",
        sold: 0,
    },
    {
        id: "martin-zadravec--pack-5-60",
        instructorId: "martin-zadravec",
        lessonId: "private-60",
        credits: 5,
        price: 585,
        courseIds: ["northwest"],
        transferable: false,
        status: "draft",
        sold: 0,
    },
];

export const packageById = (id: string) => PACKAGES.find((p) => p.id === id);

/** A blank pack for New package: Mike Kenny's 45-minute private, 5 lessons, no price yet. */
export const NEW_PACKAGE: LessonPackage = {
    id: "new",
    instructorId: "mike-kenny",
    lessonId: "private-45",
    credits: 5,
    price: 0,
    courseIds: ["falls-road"],
    transferable: false,
    status: "draft",
    sold: 0,
};

/* -------------------------------------------------------------------------- */
/*  One golfer's credits                                                      */
/* -------------------------------------------------------------------------- */

export const STAFF = "Aaron Whitfield";

export const GOLFER = { name: "Mara Linden", customerId: "1290318", email: "mara.linden@example.com", phone: "(512) 555-0161" };

export type CreditEventKind = "purchased" | "issued" | "booked" | "applied" | "returned" | "extended";

export interface CreditEvent {
    date: string;
    kind: CreditEventKind;
    /** "45-Minute Private · Falls Road · Thu Oct 9, 9:00 AM". */
    label: string;
    /** Who did it. */
    by: string;
    /** Credits moved: −1 when one is spent, +1 when one comes back, 0 for no change. */
    credits: number;
    note?: string;
}

export interface CreditBalance {
    id: string;
    packageId: string;
    /** Only for packs not in PACKAGES (the Thrive import). */
    label?: string;
    instructorId: string;
    lessonId: string;
    creditsTotal: number;
    creditsRemaining: number;
    /** Price per lesson paid, for the value still held. */
    perLesson: number;
    purchasedOn: string;
    expiresOn?: string;
    /** Assigned by the Academy (an import or comp), not bought. */
    assigned?: boolean;
    transferable: boolean;
    history: CreditEvent[];
}

/** Mara's three packs: a Mike Kenny 5-pack in use, a Kate Schanuel pack about to expire, and credits imported from Thrive. */
export const BALANCES: CreditBalance[] = [
    {
        id: "bal-mk-5",
        packageId: "mike-kenny--pack-5",
        instructorId: "mike-kenny",
        lessonId: "private-45",
        creditsTotal: 5,
        creditsRemaining: 3,
        perLesson: 104,
        purchasedOn: "Sep 2, 2026",
        expiresOn: fmtDate(expiryAfter(parseDate("Sep 2, 2026"))),
        transferable: false,
        history: [
            { date: "Nov 6, 2026", kind: "applied", label: "45-Minute Private · Falls Road · Fri Nov 6, 10:00 AM", by: "Mike Kenny", credits: -1 },
            {
                date: "Oct 21, 2026",
                kind: "returned",
                label: "45-Minute Private · Falls Road · Fri Oct 23, 4:00 PM",
                by: "Mara Linden",
                credits: 1,
                note: "Cancelled 2 days ahead, so the credit came back",
            },
            {
                date: "Oct 19, 2026",
                kind: "booked",
                label: "45-Minute Private · Falls Road · Fri Oct 23, 4:00 PM",
                by: "Mara Linden",
                credits: -1,
                note: "Booked online",
            },
            {
                date: "Oct 9, 2026",
                kind: "booked",
                label: "45-Minute Private · Falls Road · Fri Oct 9, 9:00 AM",
                by: "Mara Linden",
                credits: -1,
                note: "Booked online",
            },
            { date: "Sep 2, 2026", kind: "purchased", label: "5 × 45-Minute Private · $520", by: "Mara Linden", credits: 5, note: "Bought online" },
        ],
    },
    {
        id: "bal-ks-5",
        packageId: "kate-schanuel--pack-5",
        instructorId: "kate-schanuel",
        lessonId: "private-45",
        creditsTotal: 5,
        creditsRemaining: 2,
        perLesson: 82,
        purchasedOn: "Nov 24, 2025",
        expiresOn: fmtDate(expiryAfter(parseDate("Nov 24, 2025"))),
        transferable: false,
        history: [
            {
                date: "Jun 12, 2026",
                kind: "booked",
                label: "45-Minute Private · Falls Road · Fri Jun 12, 5:30 PM",
                by: "Mara Linden",
                credits: -1,
                note: "Booked online",
            },
            { date: "Apr 30, 2026", kind: "applied", label: "45-Minute Private · Falls Road · Thu Apr 30, 6:00 PM", by: "Kate Schanuel", credits: -1 },
            {
                date: "Mar 28, 2026",
                kind: "booked",
                label: "45-Minute Private · Falls Road · Sat Mar 28, 11:00 AM",
                by: "Mara Linden",
                credits: -1,
                note: "Booked online",
            },
            {
                date: "Nov 24, 2025",
                kind: "purchased",
                label: "5 × 45-Minute Private · $410",
                by: "Mara Linden",
                credits: 5,
                note: "Bought at the Falls Road pro shop",
            },
        ],
    },
    {
        id: "bal-dh-thrive",
        packageId: "doug-hamilton--thrive-import",
        label: "Transferred Lesson Credits",
        instructorId: "doug-hamilton",
        lessonId: "private-45",
        creditsTotal: 4,
        creditsRemaining: 2,
        perLesson: 90,
        purchasedOn: "Feb 14, 2026",
        assigned: true,
        transferable: true,
        history: [
            {
                date: "Apr 18, 2026",
                kind: "booked",
                label: "45-Minute Private · Little Bennett · Sat Apr 18, 9:00 AM",
                by: "Mara Linden",
                credits: -1,
                note: "Booked online",
            },
            {
                date: "Mar 21, 2026",
                kind: "booked",
                label: "45-Minute Private · Laytonsville · Sat Mar 21, 10:00 AM",
                by: "Mara Linden",
                credits: -1,
                note: "Booked online",
            },
            { date: "Feb 14, 2026", kind: "issued", label: "4 credits carried over from Thrive", by: STAFF, credits: 4, note: "Imported balance, no expiry" },
        ],
    },
];

/** Today's lesson at the tee that a credit could pay for. */
export const TODAYS_LESSON = {
    id: "lesson-today",
    instructorId: "mike-kenny",
    lessonId: "private-45",
    courseId: "falls-road",
    when: "Today, 2:00 PM",
    label: "45-Minute Private · Falls Road · Today, 2:00 PM",
};

export const balanceLabel = (b: CreditBalance) => b.label ?? packLabel({ credits: b.creditsTotal, lessonId: b.lessonId });

/** Why a balance can't pay for a lesson, or null when it can. */
export const cannotPayFor = (b: CreditBalance, lesson: { instructorId: string; lessonId: string }) => {
    if (b.creditsRemaining === 0) return "No credits left";
    if (b.expiresOn && daysUntil(parseDate(b.expiresOn)) < 0) return "Expired";
    if (b.instructorId !== "any" && b.instructorId !== lesson.instructorId) return `Only for ${instructorById(b.instructorId).name}'s lessons`;
    if (b.lessonId !== lesson.lessonId) return `For ${lessonById(b.lessonId).name} only`;
    return null;
};

export const EXTEND_REASONS = ["Injury or illness", "Instructor unavailable", "Weather or course closure", "Goodwill", "Other"];

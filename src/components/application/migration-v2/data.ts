/**
 * Content for the Migration V2 screens, transcribed from references/100126.
 *
 * IDs, amounts, dates, statuses and row counts match the production
 * screenshots exactly. People's names, emails and phone numbers are replaced
 * with made-up ones (this Storybook is public), keeping the same quirks —
 * duplicate customers, lowercase names, missing emails/phones, unformatted
 * phone numbers — because those are the edge cases the screens must handle.
 */

export const COURSES = {
    dunes: { name: "The Dunes of Delgado PROD", logo: "buck-v1-old/course-logo.png" },
    bushwood: { name: "Bushwood Country Club", logo: "sagamore-images/Sagamore_ninth_2-1024x652.jpg" },
} as const;
export type CourseKey = keyof typeof COURSES;

/* ------------------------------------------------------------------ */
/*  1 · Punch Cards                                                    */
/* ------------------------------------------------------------------ */

export type PunchCardRow = {
    cpcId: string;
    gccId: string;
    customer: string | null;
    member: string | null;
    orderId: string | null;
    orderItemId: string | null;
    pricePreTax: string;
    created: string;
    expires: string;
    awarded: number;
    used: number;
};

const pc = (
    cpcId: string,
    gccId: string,
    customer: string | null,
    member: string | null,
    created: string,
    expires: string,
    awarded: number,
    extra: Partial<PunchCardRow> = {},
): PunchCardRow => ({ cpcId, gccId, customer, member, orderId: null, orderItemId: null, pricePreTax: "$0.00", created, expires, awarded, used: 0, ...extra });

export const PUNCH_CARDS: PunchCardRow[] = [
    pc("21323", "205444", "Mara Linden", "26576", "10/1/2026", "Never expires", 10),
    pc("21322", "665888", "felix harlow", "48569", "10/1/2026", "Never expires", 10),
    pc("21073", "217097", "Cade Sorensen", "30224", "9/27/2026", "10/27/2026", 3),
    pc("21064", "927228", null, "136253", "9/24/2026", "Never expires", 10),
    pc("21057", "279869", "Priya Shah", "38695", "9/20/2026", "10/20/2026", 3),
    pc("21039", "1989454", "Neo Castillo", null, "9/15/2026", "7/14/2122", 10, { orderId: "6297138", orderItemId: "14380658", pricePreTax: "$238.20" }),
    pc("20005", "301862", "Brittany Holloway", "135758", "9/10/2026", "10/10/2026", 3),
    pc("19991", "313001", "Unknown Unknown", "67507", "9/9/2026", "10/9/2026", 10),
    pc("19990", "1072267", "Hans Bergstrom", "59942", "9/9/2026", "10/9/2026", 3),
    pc("19989", "481210", "Birdie Member", "45046", "9/9/2026", "Never expires", 3),
    pc("19979", "161730", "jordan Shaw", "31753", "9/7/2026", "Never expires", 3),
    pc("19978", "166155", "Aaron Zeller", "24126", "9/7/2026", "Never expires", 3),
    pc("19977", "196486", "Daniel Hartley", "24454", "9/7/2026", "Never expires", 3),
    pc("19976", "196487", "uwe brandt", "24455", "9/7/2026", "Never expires", 3),
    pc("19975", "206718", "Trevor Nolan", "59818", "9/7/2026", "Never expires", 3),
    pc("19974", "213034", "jordan shaws", "40471", "9/7/2026", "Never expires", 3),
    pc("19973", "226390", "Ayush Mehta", "32096", "9/7/2026", "Never expires", 3),
    pc("19972", "278448", "p shah", "38716", "9/7/2026", "Never expires", 3),
    pc("19971", "292592", "Ayush Mehta", "38920", "9/7/2026", "Never expires", 3),
    pc("19970", "311490", "Rickie Holloway", "50785", "9/7/2026", "Never expires", 3),
];

/* ------------------------------------------------------------------ */
/*  2 · Credit Books                                                   */
/* ------------------------------------------------------------------ */

export type CreditBook = { id: string; title: string; balance: number };

export const CREDIT_BOOKS: CreditBook[] = (
    [
        ["380", "Alex Test!", 2.95],
        ["288", "Chucks", -35],
        ["396", "Chuck's Golf Tournament", -15],
        ["212", "Chuck's Tournament", -1070],
        ["176", "Club Champ test - Ashford", -772],
        ["296", "Empty Credit Book", -100],
        ["1", "Hole in One Club", -687.8],
        ["135", "Clubhouse Test for PH", 800],
        ["30", "initial balance club", 1246],
        ["319", "June Credits", -50],
        ["364", "Mike's 4 ball invitational", -200],
        ["370", "MAX Golf Finals", -780],
        ["655", "Men's league", 60],
        ["2", "Men's League Weekly Play", 1575.94],
        ["33", "Summer League Events", 0],
        ["402", "Super Seniors", 420],
        ["417", "Tuesday Twilight League", 310.5],
        ["388", "Ladies 9-Hole Group", 185.25],
        ["421", "Turkey Shoot 2026", -90],
        ["409", "Junior Camp Credits", 250],
        ["377", "Member-Guest", 128.56],
        ["430", "Winter Series", 0],
        ["433", "Women's Golf Day", 0],
    ] as const
)
    .map(([id, title, balance]) => ({ id, title, balance }))
    .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }));

export const CREDIT_BOOK_DETAIL = {
    id: "380",
    title: "Alex Test!",
    balance: 2.95,
    appliesTo: ["Merchandise", "Food & Beverage", "Tee Fees", "Alcohol"],
    expiration: "No expiration",
};

export type Person = { id: string; name: string; email: string | null; phone: string | null };

export const CREDIT_BOOK_CUSTOMERS: Person[] = [
    { id: "16274", name: "Aaron Whitfield", email: "aaron.whitfield@example.com", phone: "(817) 555-0134" },
    { id: "16275", name: "Aaron Whitfield", email: "aaron.whitfield@example.com", phone: "(817) 555-0134" },
    { id: "16276", name: "Jon whitfield", email: "jwhitfield@example.golf", phone: null },
    { id: "16277", name: "Andy Sloane", email: "andy@sloane.golf", phone: null },
    { id: "16278", name: "Aaron Sloane", email: null, phone: "(555) 555-0144" },
    { id: "16279", name: "Billy Sloane", email: "billy@sloane.golf", phone: "(888) 555-0178" },
    { id: "16280", name: "Billy Sloane", email: "b@sloane.golf", phone: null },
    { id: "16281", name: "Bob Sloane", email: "ggg@4.fff", phone: null },
    { id: "16282", name: "bobby sloane", email: null, phone: "(333) 555-0166" },
    { id: "16283", name: "bobby sloane", email: "bobby@sloane.com", phone: null },
    { id: "16285", name: "Tyler Woodson", email: "twoodson@test.com", phone: "1234567890" },
    { id: "16286", name: "Tyler Woodson", email: "tyler@woodson.com", phone: "(212) 555-0155" },
    { id: "16287", name: "tyler woodson", email: "tyler@woodson.com", phone: null },
    { id: "16288", name: "Tyler Woodsen", email: null, phone: "(888) 555-0100" },
    { id: "16440", name: "jordan Shaw", email: "jordan.shaw@example.golf", phone: null },
    { id: "16441", name: "Richard Bowman", email: null, phone: "(760) 555-0144" },
    { id: "16442", name: "Alex Trent Jr.", email: "alex@trent.com", phone: null },
    { id: "16443", name: "Tom Sloane", email: "tom@tomsloane.com", phone: null },
    { id: "16444", name: "Michael Arden", email: "marden@example.com", phone: "(248) 555-0176" },
    { id: "16445", name: "andy carlson", email: "ff@w.com", phone: null },
    { id: "16446", name: "Casey Morgan", email: "casey.morgan@example.com", phone: "(602) 555-0190" },
    { id: "16447", name: "Dana Price", email: null, phone: "(480) 555-0122" },
    { id: "16448", name: "Erin Walsh", email: "erin@walsh.golf", phone: null },
];

export type CreditBookTransaction = { id: string; date: string; type: string; employee: string; giftCard: string; amount: number };

export const CREDIT_BOOK_TRANSACTIONS: CreditBookTransaction[] = [
    ...[0, 1, 2].map((i) => ({
        id: String(59501 + i),
        date: "08/25/25 02:56 PM",
        type: "Payout",
        employee: "Aaron Whitfield",
        giftCard: String(99344 + i),
        amount: -20.11,
    })),
    ...Array.from({ length: 27 }, (_, i) => ({
        id: String(59514 + i),
        date: "08/25/25 03:10 PM",
        type: "Payout",
        employee: "Aaron Whitfield",
        giftCard: String(99353 + i),
        amount: -43.98,
    })),
];

/* ------------------------------------------------------------------ */
/*  Customer profile (shared by every customer tab)                    */
/* ------------------------------------------------------------------ */

export type CustomerProfile = {
    name: string;
    gccId: string;
    customerId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
};

export const CUSTOMERS = {
    mara: {
        name: "Mara Linden",
        gccId: "205444",
        customerId: "1290318",
        firstName: "Mara",
        lastName: "Linden",
        email: "mara.linden@example.com",
        phone: "(512) 555-0161",
    },
    aaron: {
        name: "Aaron Whitfield",
        gccId: "203797",
        customerId: "1288470",
        firstName: "Aaron",
        lastName: "Whitfield",
        email: "aaron.whitfield@example.com",
        phone: "(817) 555-0134",
    },
    parent: {
        name: "Parent Number1",
        gccId: "1351034",
        customerId: "1433359",
        firstName: "Parent",
        lastName: "Number1",
        email: "qa+parent.number1@example.golf",
        phone: "2085550123",
    },
} satisfies Record<string, CustomerProfile>;

/** The rich, partly-empty profile captured for Parent Number1 (charges › customer). */
export const PROFILE_SECTIONS = {
    teeTimes: [
        { id: "6844096", course: COURSES.dunes.name, subCourse: "", date: "May 05, 2026 07:30 AM", players: 4 },
        { id: "6844096", course: COURSES.dunes.name, subCourse: "", date: "May 05, 2026 07:30 AM", players: 4 },
        { id: "6844096", course: COURSES.dunes.name, subCourse: "", date: "May 05, 2026 07:30 AM", players: 4 },
        { id: "6844096", course: COURSES.dunes.name, subCourse: "", date: "May 05, 2026 07:30 AM", players: 4 },
        { id: "6829999", course: COURSES.dunes.name, subCourse: "", date: "Apr 30, 2026 11:40 AM", players: 2 },
    ],
    orders: [
        { id: "6459660", course: COURSES.dunes.name, date: "Oct 01, 2026 02:00 AM", amount: "$53.63" },
        { id: "6459661", course: COURSES.dunes.name, date: "Oct 01, 2026 02:00 AM", amount: "$53.63" },
        { id: "6459662", course: COURSES.dunes.name, date: "Oct 01, 2026 02:00 AM", amount: "$32.18" },
        { id: "6459663", course: COURSES.dunes.name, date: "Oct 01, 2026 02:00 AM", amount: "$53.63" },
        { id: "6458975", course: COURSES.dunes.name, date: "Sep 30, 2026 05:02 PM", amount: "$275.00" },
        { id: "6458408", course: COURSES.dunes.name, date: "Sep 30, 2026 04:14 PM", amount: "$16.69" },
    ],
    familyMembers: [{ id: "1351035", name: "Child number1", dob: "" }],
    memberships: [{ course: COURSES.dunes.name, membership: "Cheapos", expires: "Nov 01, 2026 02:00 AM" }],
    activities: [
        { id: "10488664", date: "May 05, 2026 06:36 PM", user: "Sam Porter", activity: "Reservation Moved", notes: "N/A" },
        { id: "9032602", date: "Apr 15, 2026 06:10 PM", user: "Sam Porter", activity: "Reservation Canceled", notes: "TeeTimeCustomers5Controller" },
        {
            id: "7107228",
            date: "Jan 15, 2026 02:52 PM",
            user: "Parent Number1",
            activity: "Membership Deleted",
            notes: "Deleted membership for Parent Number1",
        },
    ],
};

/* ------------------------------------------------------------------ */
/*  3 · Customer Charges                                               */
/* ------------------------------------------------------------------ */

export const CUSTOMER_CHARGES = [
    { orderId: "6459663", name: "Parent Number1", email: "qa+parent.number1@example.golf", total: "$53.63" },
    { orderId: "6459662", name: "Ivan Kozlov", email: "ivan.kozlov@example.com", total: "$32.18" },
    { orderId: "6459661", name: "Aging Three", email: "qa+aging.three@example.golf", total: "$53.63" },
    { orderId: "6459660", name: "Cheapo Member", email: "qa+cheapo.member@example.golf", total: "$53.63" },
].map((r) => ({ ...r, app: "TenFore Gopher API", created: "10/1/2026 2:00 AM", completed: "10/1/2026 2:00 AM", status: "Completed", employee: "" }));

/* ------------------------------------------------------------------ */
/*  4 · Customer Charge Payments                                       */
/* ------------------------------------------------------------------ */

export const DECLINE_SUMMARY = {
    count: 17,
    notCollected: "$61,912.72",
    reasons: [
        { count: 5, reason: "Clover payment processing failed", amount: 37962.64 },
        { count: 4, reason: "ACH payment processing failed", amount: 0 },
        { count: 4, reason: "Card expired - not attempted. Collect a new card.", amount: 21145.06 },
        { count: 3, reason: "Invalid token, code 98", amount: 1289.6 },
        { count: 1, reason: "Declined. No term record on First Data system., code 515", amount: 1515.42 },
    ],
};

export type ChargePayment = {
    ccpId: string;
    gccId: string;
    first: string;
    last: string;
    email: string | null;
    card: string;
    surcharge: number;
    amount: number;
};

export const CHARGE_PAYMENTS: ChargePayment[] = [
    {
        ccpId: "185811",
        gccId: "203797",
        first: "Aaron",
        last: "Whitfield",
        email: "aaron.whitfield@example.com",
        card: "****0498",
        surcharge: 0.05,
        amount: 1.19,
    },
    { ccpId: "185810", gccId: "177955", first: "Donny", last: "Twoshoes", email: "d2shoe@example.com", card: "****4242", surcharge: 4.37, amount: 113.63 },
    { ccpId: "185804", gccId: "1839925", first: "July", last: "Prod", email: "qa+jp@example.golf", card: "****4242", surcharge: 0.04, amount: 1.04 },
    {
        ccpId: "185799",
        gccId: "481214",
        first: "Eagle",
        last: "Member",
        email: "qa+eagle.member@example.golf",
        card: "****4242",
        surcharge: 21.64,
        amount: 639.98,
    },
    { ccpId: "185797", gccId: "1347425", first: "Ivan", last: "Kozlov", email: "ivan.kozlov@example.com", card: "****4242", surcharge: 1.29, amount: 33.47 },
    { ccpId: "185796", gccId: "311490", first: "Rickie", last: "Holloway", email: null, card: "****4242", surcharge: 17.91, amount: 465.75 },
    {
        ccpId: "185793",
        gccId: "982794",
        first: "August",
        last: "Eight",
        email: "qa+august.eight@example.golf",
        card: "****4242",
        surcharge: 0.19,
        amount: 4.84,
    },
    {
        ccpId: "185792",
        gccId: "244329",
        first: "Fox-User",
        last: "Dunes",
        email: "foxuserdunes1@example.com",
        card: "****4242",
        surcharge: 22.87,
        amount: 676.21,
    },
    { ccpId: "185790", gccId: "304911", first: "Olav", last: "Berg", email: "qa+testolav@example.golf", card: "****5096", surcharge: 22.91, amount: 677.53 },
    { ccpId: "185789", gccId: "196487", first: "uwe", last: "brandt", email: "uwe@example.com", card: "****4242", surcharge: 0.04, amount: 1.01 },
];

export const PAYMENT_DETAIL = {
    ccpId: "185811",
    type: "Credit",
    status: "Complete",
    date: "Oct 1, 2026",
    declineReason: "—",
    amount: "$1.19",
    surcharge: "$0.05",
    applied: "$1.14",
    customer: "Aaron Whitfield",
    customerEmail: "aaron.whitfield@example.com",
    employee: "(none)",
    processorTxn: "274010714449",
};

/* ------------------------------------------------------------------ */
/*  6/7 · Revenue                                                      */
/* ------------------------------------------------------------------ */

export const COMBINED_REPORT_SECTIONS = ["Food Sales", "Alcohol Sales", "Golf Sales", "Transportation Sales", "Pro Shop Sales", "Taxes", "Fees"];

export type RevenueSection = {
    id: string;
    title: string;
    columns: string[];
    /** Rows shown even when the period is empty (fixed line items). */
    rows?: string[];
    empty?: string;
    totalRow?: boolean;
    linkAmounts?: boolean;
    footnote?: string;
};

export const REVENUE_SECTIONS: RevenueSection[] = [
    { id: "green-fees", title: "Green Fees", columns: ["Tee Fee", "Holes", "Rounds", "Gross", "Tax", "Fees", "Net"], empty: "No green fee sales." },
    {
        id: "transportation",
        title: "Transportation",
        columns: ["Transportation", "Holes", "Rounds", "Gross", "Tax", "Fees", "Net"],
        empty: "No transportation sales.",
    },
    { id: "product-sales", title: "Product Sales by Product", columns: ["Product", "Group", "Qty", "Gross", "Tax", "Fees", "Net"], empty: "No product sales." },
    { id: "event-sales", title: "Event Sales", columns: ["Event / Category", "Qty", "Gross", "Tax", "Fees", "Net"], empty: "No event sales." },
    { id: "event-payments", title: "Event Payments", columns: ["Payment Type", "Credit Fees", "Amount"], empty: "No event payments." },
    { id: "activity-sales", title: "Activity Sales", columns: ["Activity Fee", "Quantity", "Gross", "Tax", "Fees", "Net"], empty: "No activity sales." },
    { id: "fee-rule-sales", title: "Fee Rule Sales", columns: ["Fee Rule Type", "Quantity", "Gross", "Tax", "Fees", "Net"], empty: "No fee rule sales." },
    { id: "open-misc", title: "Open / Misc Sales", columns: ["Department / Item", "Quantity", "Gross", "Tax", "Fees", "Net"], empty: "No open / misc sales." },
    { id: "gift-cards", title: "Gift Card Sales", columns: ["Gift Card", "Gross", "Net"], empty: "No gift card sales." },
    { id: "taxes", title: "Taxes", columns: ["Tax Description", "Tax Amount"], empty: "No taxes." },
    {
        id: "fees-tips",
        title: "Fees, Tips & Service Charges",
        columns: ["Fee Type", "Amount"],
        rows: ["TenFore Fees", "Credit Card Fees", "Tips", "Service Charges", "Credit Card Surcharges"],
        totalRow: true,
    },
    { id: "money-collected", title: "Total Money Collected", columns: ["Source / Payment Type", "Amount"], empty: "No money collected." },
    { id: "charge-payments", title: "Customer Charge Payments", columns: ["Payment Type", "Credit Fees", "Amount"], empty: "No customer charge payments." },
    {
        id: "discounts",
        title: "Discounts, Comps, Refunds & Rewards",
        columns: ["Type", "Amount"],
        rows: ["Discounts", "Comps", "Refunds", "Redeemed Rewards"],
        totalRow: true,
        linkAmounts: true,
        footnote:
            "Informational — these reduce or return revenue and are already reflected in the sales sections above; they are not added to any sales or Money In total.",
    },
    { id: "adjustments", title: "Adjustments", columns: ["Description", "Amount"], empty: "No adjustments." },
];

/* ------------------------------------------------------------------ */
/*  Formatting                                                         */
/* ------------------------------------------------------------------ */

export const money = (value: number) => {
    const abs = Math.abs(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${value < 0 ? "-" : ""}$${abs}`;
};

/* ------------------------------------------------------------------ */
/*  5 · Customer Charge History                                        */
/* ------------------------------------------------------------------ */

/** Customer search matches for "Casey Card" (a saved-card test account). */
export const HISTORY_SEARCH = {
    query: "Casey Card",
    results: [
        { name: "Casey Card", email: "qa+saved.card@example.golf", phone: "(209) 555-0134" },
        { name: "Cardwell McCardinston", email: "cardwell@example.com", phone: "(881) 555-0164" },
    ],
    range: { from: "Apr 1, 2026", to: "Oct 1, 2026" },
};

/**
 * Casey Card's activity, Apr 1 – Oct 1 2026 (oldGUI captures). Charges are
 * orders put on account; payments are charge payments against them.
 */
export type HistoryLine = { id: string; eventId: string; app: string; date: string; amount: number; kind: "charge" | "payment" };

const charge = (id: string, app: string, date: string, amount: number): HistoryLine => ({ id, eventId: "", app, date, amount, kind: "charge" });

export const HISTORY_LINES: HistoryLine[] = [
    charge("5899410", "TenFore Portal", "7/29/2026 12:36 PM", 126.56),
    charge("4334038", "TenFore Fox 1.0", "5/4/2026 6:30 PM", 1.03),
    ...["4273560", "4273477", "4273411", "4273387", "4273389", "4273306", "4273205", "4273000"].map((id) =>
        charge(id, "TenFore Portal", "4/30/2026 2:36 PM", 1),
    ),
    { id: "182333", eventId: "", app: "TenFore Gopher API", date: "9/1/2026 3:00 AM", amount: 304.81, kind: "payment" },
    { id: "176497", eventId: "", app: "TenFore Gopher API", date: "7/1/2026 3:00 AM", amount: 127.6, kind: "payment" },
];

export const HISTORY_TOTALS = {
    charges: HISTORY_LINES.filter((l) => l.kind === "charge").reduce((s, l) => s + l.amount, 0),
    payments: HISTORY_LINES.filter((l) => l.kind === "payment").reduce((s, l) => s + l.amount, 0),
};

/** Frozen monthly invoices. Note the irregular periods (11/30 → 12/31, …) and the $304.81 → $177.22 jump between 299436 and 299757 — the "frozen" edge case. */
export type Invoice = { id: string; start: string; end: string; starting: number; charges: number; payments: number; ending: number };

export const HISTORY_INVOICES: Invoice[] = (
    [
        ["299425", "8/1/2025", "8/31/2025", 462.06, 0, 0, 462.06],
        ["299426", "9/1/2025", "9/30/2025", 462.06, 21.79, 0, 483.85],
        ["299427", "10/1/2025", "10/31/2025", 483.85, 610.34, 0, 1094.19],
        ["299428", "11/1/2025", "11/30/2025", 1094.19, 0, 177.22, 916.97],
        ["299429", "11/30/2025", "12/31/2025", 916.97, 0, 0, 916.97],
        ["299430", "12/31/2025", "1/31/2026", 916.97, 107.26, 0, 1024.23],
        ["299431", "1/31/2026", "2/28/2026", 1024.23, 0, 0, 1024.23],
        ["299432", "2/28/2026", "3/31/2026", 1024.23, 12.34, 739.75, 296.82],
        ["299433", "4/1/2026", "4/30/2026", 296.82, 8, 0, 304.82],
        ["299434", "5/1/2026", "5/31/2026", 304.82, 1.03, 0, 305.85],
        ["299435", "6/1/2026", "6/30/2026", 305.85, 0, 0, 305.85],
        ["299436", "7/1/2026", "7/31/2026", 305.85, 126.56, 127.6, 304.81],
        ["299757", "8/1/2026", "9/1/2026", 177.22, 0, 0, 177.22],
        ["306208", "9/1/2026", "10/1/2026", 177.22, 0, 0, 177.22],
    ] as const
).map(([id, start, end, starting, charges, payments, ending]) => ({ id, start, end, starting, charges, payments, ending }));

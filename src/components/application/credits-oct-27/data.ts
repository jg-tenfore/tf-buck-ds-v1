/**
 * Content for Credits - OCT 27, transcribed from references/102726 (today's
 * Reports › Credits screens). IDs, amounts, dates and row counts match the
 * screenshots; people's names, emails, phones and streets are invented (this
 * Storybook is public), keeping the same quirks: lowercase names, duplicates,
 * missing emails, test accounts.
 */
import { CREDIT_BOOK_CUSTOMERS, type Person } from "../migration-v2/data";

/** Global Nav ids for Reports › Credits. */
export const CREDITS_NAV = {
    giftCards: "reports/credits/gift-cards",
    rainChecks: "reports/credits/rain-checks",
    paymentSources: "reports/credits/payment-sources",
    punchCards: "reports/credits/punch-cards",
    creditBooks: "reports/credits/credit-books",
} as const;

export const COURSE = "The Dunes of Delgado PROD";

/** Customers a gift card, rain check or punch card can be transferred to. */
export const TRANSFER_CUSTOMERS = [
    { name: "Casey Morgan", detail: "casey.morgan@example.com" },
    { name: "Dana Price", detail: "(480) 555-0122" },
    { name: "Erin Walsh", detail: "erin@walsh.golf" },
    { name: "Michael Arden", detail: "marden@example.com" },
    { name: "Priya Shah", detail: "priya.shah@example.com" },
    { name: "Tyler Woodson", detail: "tyler@woodson.com" },
    { name: "Aaron Whitfield", detail: "aaron.whitfield@example.com" },
    { name: "Mara Linden", detail: "mara.linden@example.com" },
];

/** One line in a credit's history: issued, transferred, adjusted, edited. */
export type HistoryEntry = { date: string; action: string; detail: string; by: string };

/* ------------------------------------------------------------------ */
/*  Gift Cards                                                         */
/* ------------------------------------------------------------------ */

export type GiftCard = {
    id: string;
    to: string;
    from: string | null;
    upc: string;
    type: string;
    created: string;
    expires: string;
    realized: string | null;
    awarded: number;
    used: number;
};

const gc = (id: string, to: string, created: string, expires: string, awarded: number, used = 0): GiftCard => ({
    id,
    to,
    from: null,
    upc: `cb${id}`,
    type: "Winnings",
    created,
    expires,
    realized: null,
    awarded,
    used,
});

export const GIFT_CARDS: GiftCard[] = [
    gc("274402", "jordan Pierce", "10/27/2026", "08/25/2122", 5),
    gc("274400", "Jon whitlock", "10/27/2026", "08/25/2122", 10),
    gc("274401", "Tyler Woodson", "10/27/2026", "08/25/2122", 10),
    gc("274377", "Billy Sloane", "10/27/2026", "08/25/2122", 20),
    gc("274378", "bobby sloane", "10/27/2026", "08/25/2122", 20),
    gc("274379", "Tyler Woodson", "10/27/2026", "08/25/2122", 20),
    gc("274033", "Aaron Whitfield", "10/21/2026", "08/19/2122", 2),
    gc("274034", "Adam Dovner", "10/21/2026", "08/19/2122", 2),
    gc("274035", "Casey Morgan", "10/21/2026", "08/19/2122", 2),
    gc("273990", "Erin Walsh", "10/19/2026", "08/17/2122", 25, 12.5),
    gc("273988", "Michael Arden", "10/19/2026", "08/17/2122", 50, 50),
    gc("273921", "Dana Price", "10/14/2026", "08/12/2122", 100, 37.4),
];

/** The full report behind the first page (893 cards). */
export const GIFT_CARD_TOTALS = { count: 893, balance: 75582.81 };

/** Gift card 274402, opened from the list. */
export const GIFT_CARD_DETAIL = {
    id: "274402",
    customer: "jordan Pierce",
    email: "jordan.pierce@example.com",
    awarded: 5,
    used: 0,
    created: "Oct 27, 2026 01:17 PM",
    imported: "",
    expires: "2122-08-25",
    upc: "cb274402",
    restrictions: { paymentPending: false, foodBeverage: true, alcohol: true, merchandise: true, teeFees: true },
    outgoingOrders: [] as { id: string; paymentId: string; course: string; date: string; status: string; amount: number }[],
    incomingOrders: [] as { id: string; itemId: string; date: string; status: string; amount: number }[],
    creditBooks: [{ id: "105740", name: "Alex Test!", date: "10/27/2026 1:17 PM", amount: 5 }],
    purchaser: null as string | null,
    history: [
        { date: "Oct 27, 2026 1:17 PM", action: "Issued", detail: "Paid out from credit book Alex Test! ($5.00)", by: "Aaron Whitfield" },
    ] as HistoryEntry[],
};

/* ------------------------------------------------------------------ */
/*  Rain Checks                                                        */
/* ------------------------------------------------------------------ */

export type RainCheck = {
    id: string;
    customer: string;
    bookedBy?: string;
    round: string;
    created: string;
    expires: string;
    realized: string | null;
    awarded: number;
    used: number;
};

const rc = (id: string, customer: string, round: string, created: string, expires: string, awarded: number, bookedBy?: string): RainCheck => ({
    id,
    customer,
    bookedBy,
    round,
    created,
    expires,
    realized: null,
    awarded,
    used: 0,
});

export const RAIN_CHECKS: RainCheck[] = [
    rc("58576", "Graham Ellery", "Oct 21, 2026 10:30 AM · 18 holes", "10/21/2026", "10/21/2027", 35.83),
    rc("58577", "Graham Ellery", "Oct 21, 2026 10:30 AM · 18 holes", "10/21/2026", "10/21/2027", 105, "Reid Ostrander"),
    rc("58578", "ryan dunmore", "Oct 21, 2026 10:30 AM · 18 holes", "10/21/2026", "10/21/2027", 105),
    rc("58579", "John Delacroix", "Oct 21, 2026 10:30 AM · 18 holes", "10/21/2026", "10/21/2027", 35.83),
    rc("58525", "Graham Ellery", "Oct 19, 2026 8:10 PM · 18 holes", "10/19/2026", "10/19/2027", 35.83),
    rc("58526", "Reid Ostrander", "Oct 19, 2026 8:10 PM · 18 holes", "10/19/2026", "10/19/2027", 130.34),
    rc("58527", "John Dalton", "Oct 19, 2026 8:10 PM · 18 holes", "10/19/2026", "10/19/2027", 130.34),
];

/** Rain check 58576, opened from the list. */
export const RAIN_CHECK_DETAIL = {
    id: "58576",
    customer: "Graham Ellery",
    reservation: "13732729",
    round: "Oct 21, 2026 10:30 AM · 18 holes",
    amount: 35.83,
    used: 0,
    created: "Oct 21, 2026 11:21 AM",
    expires: "2027-10-21",
    exhausted: "",
    realized: "",
    transactions: [] as { id: string; date: string; order: string; amount: number }[],
    history: [{ date: "Oct 21, 2026 11:21 AM", action: "Issued", detail: "Rained out · reservation 13732729, 18 holes", by: "Pro Shop" }] as HistoryEntry[],
};

/** Reservations at this course that a new rain check can be issued against. */
export const RESERVATIONS = [
    { id: "13732729", customer: "Graham Ellery", round: "Oct 21, 2026 10:30 AM · 18 holes", paid: 35.83 },
    { id: "13732731", customer: "John Delacroix", round: "Oct 21, 2026 10:30 AM · 18 holes", paid: 35.83 },
    { id: "13733102", customer: "Casey Morgan", round: "Oct 27, 2026 9:20 AM · 9 holes", paid: 52.5 },
];

/* ------------------------------------------------------------------ */
/*  Payment Sources                                                    */
/* ------------------------------------------------------------------ */

export type PaymentSource = {
    psid: string;
    customer: string;
    postal: string | null;
    postalFlag?: boolean;
    cardholder: string;
    street: string | null;
    merchantId?: string;
    app?: string;
    details: string;
    created?: string;
    expiration: string;
    expired?: boolean;
};

export const PAYMENT_SOURCES: PaymentSource[] = [
    { psid: "87", customer: "Thomas Reardon", postal: null, cardholder: "Thomas Reardon", street: null, details: "test ach", expiration: "-" },
    {
        psid: "88",
        customer: "Huck Fenwick",
        postal: "78163",
        postalFlag: true,
        cardholder: "Huck Fenwick",
        street: null,
        details: "VISA 1443",
        expiration: "01/40",
    },
    { psid: "90", customer: "john smyth", postal: null, cardholder: "john smyth", street: null, details: "Visa 9999", expiration: "12/21", expired: true },
    { psid: "92", customer: "test ddf", postal: null, cardholder: "test ddf", street: null, details: "Visa 9999", expiration: "12/21", expired: true },
    {
        psid: "93",
        customer: "test militarys",
        postal: null,
        cardholder: "test militarys",
        street: null,
        details: "Visa 9999",
        expiration: "12/21",
        expired: true,
    },
    {
        psid: "1190",
        customer: "lauri pierce",
        postal: "78163",
        cardholder: "Jordan Pierce",
        street: "4410 Fairway Ln",
        merchantId: "850000000054",
        app: "Crane Android",
        details: "VISA 4242",
        created: "May 29, 2026",
        expiration: "08/29",
    },
    {
        psid: "1194",
        customer: "Testy McTest",
        postal: "27606",
        postalFlag: true,
        cardholder: "Testy McTest",
        street: null,
        details: "My Account",
        expiration: "-",
    },
    { psid: "2627", customer: "John Smyth", postal: null, cardholder: "John Smyth", street: null, details: "test ach", expiration: "-" },
    { psid: "3004", customer: "Bruce Jensen", postal: null, cardholder: "Bruce Jensen", street: null, details: "Bruce ACH", expiration: "-" },
    {
        psid: "12266",
        customer: "Ct Calloway",
        postal: null,
        cardholder: "Ct Calloway",
        street: null,
        details: "Mastercard 0869",
        expiration: "04/26",
        expired: true,
    },
    {
        psid: "12541",
        customer: "Richard Dunmore",
        postal: null,
        cardholder: "Richard Dunmore",
        street: null,
        details: "Visa 9999",
        expiration: "12/21",
        expired: true,
    },
];

/* ------------------------------------------------------------------ */
/*  Credit Books                                                       */
/* ------------------------------------------------------------------ */

export type CreditBookRow = { id: string; title: string; customers: number; transactions: number; balance: number | null };

export const CREDIT_BOOK_ROWS: CreditBookRow[] = (
    [
        ["380", "Alex Test!", 23, 39, 17.95],
        ["288", "Chucks", 23, 18, 70],
        ["396", "Chuck's Golf Tournament", 1, 1, -15],
        ["176", "Club Champ test - Ashford", 3, 5, -772],
        ["718", "Club Championship", 1, 1, -200],
        ["296", "Empty Credit Book", 1, 1, -100],
        ["702", "Hamlet's Book Son!", 1, 0, null],
        ["1", "Hole in One Club", 21, 149, -687.8],
        ["135", "Clubhouse Test for PH", 1, 3, 800],
        ["30", "initial balance club", 3, 5, 1246],
        ["212", "Chuck's Tournament", 3, 10, -1070],
        ["319", "June Credits", 1, 1, -50],
        ["364", "Mike's 4 ball invitational", 4, 4, -200],
        ["370", "MAX Golf Finals", 8, 12, -780],
        ["655", "Men's league", 16, 22, 60],
        ["2", "Men's League Weekly Play", 41, 310, 1575.94],
        ["33", "Summer League Events", 0, 0, 0],
        ["402", "Super Seniors", 12, 30, 420],
        ["417", "Tuesday Twilight League", 18, 44, 310.5],
        ["388", "Ladies 9-Hole Group", 14, 27, 185.25],
        ["421", "Turkey Shoot 2026", 6, 6, -90],
        ["409", "Junior Camp Credits", 9, 9, 250],
        ["377", "Member-Guest", 32, 64, 128.56],
        ["430", "Winter Series", 0, 0, 0],
        ["433", "Women's Golf Day", 0, 0, 0],
    ] as const
).map(([id, title, customers, transactions, balance]) => ({ id, title, customers, transactions, balance }));

export const creditBookTotals = (rows: CreditBookRow[]) => {
    const inCredit = rows.reduce((sum, r) => sum + Math.max(0, r.balance ?? 0), 0);
    const overdrawn = rows.reduce((sum, r) => sum + Math.min(0, r.balance ?? 0), 0);
    return { inCredit, overdrawn, net: inCredit + overdrawn };
};

/** Credit book #380, opened from the list. */
export const CREDIT_BOOK = {
    id: "380",
    title: "Alex Test!",
    balance: 17.95,
    created: "08/25/25",
    expiration: "Course default",
    appliesTo: { merchandise: true, foodBeverage: true, teeFees: true, alcohol: true },
    customers: CREDIT_BOOK_CUSTOMERS satisfies Person[],
    transactions: [
        ...[0, 1, 2].map((i) => ({
            id: String(59501 + i),
            date: "08/25/25 02:56 PM",
            type: "Payout",
            employee: "Aaron Whitfield",
            giftCard: String(99344 + i),
            amount: -20.11,
        })),
        ...Array.from({ length: 35 }, (_, i) => ({
            id: String(59514 + i),
            date: "08/25/25 03:10 PM",
            type: "Payout",
            employee: "Aaron Whitfield",
            giftCard: String(99353 + i),
            amount: -43.98,
        })),
        { id: "61022", date: "10/27/26 01:17 PM", type: "Payout", employee: "Aaron Whitfield", giftCard: "274402", amount: -5 },
    ],
};

export const GIFT_CARD_EXPIRATIONS = ["Course default", "No expiration", "6 months", "1 year", "2 years"];

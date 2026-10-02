/**
 * Combined Revenue data for Sep 1 – 30, 2026 at The Dunes of Delgado PROD,
 * transcribed from references/100226 and shown in the existing Combined
 * Revenue design (sections from REVENUE_SECTIONS in data.ts).
 *
 * Every visible amount matches the production screenshots. Two departures:
 * people's first names inside test product names are swapped for made-up
 * ones (this Storybook is public), and the Pro Shop Merch rows that fell
 * between two screenshots are invented so the department still reconciles.
 */
import type { RevenueSection } from "./data";
import { money } from "./data";

export const REVENUE_PERIOD = {
    from: "Sep 1, 2026",
    to: "Sep 30, 2026",
    label: "Sep 1 – Sep 30, 2026",
    moneyIn: { excludingEvents: 61500.14, events: 5539.84 },
};

/** A cell: text, a number (formatted by its column), or `null` for "—". */
export type RevenueCell = string | number | null;

const r = (...cells: RevenueCell[]) => cells;

/** One row per line, one cell per column of the section. */
export const REVENUE_ROWS: Record<string, RevenueCell[][]> = {
    "green-fees": [
        r("Cheapos", 18, 35, 372.57, 27.52, 9.97, 335.08),
        r("Dunes Rack Prime", 18, 5, 650.28, 32.9, 18.69, 598.69),
        r("Easterners - Copy", 18, 6, 330.0, 0, 9.63, 320.37),
        r("Easterners - Copy", 9, 1, 25.0, 0, 0.73, 24.27),
        r("Gold Fee (50%)", 18, 3, 60.56, 4.48, 1.62, 54.46),
        r("Hamlet's Super Fee", 18, 2, 0, 0, 0, 0),
        r("Public Rate - Weekday - Copy", 18, 63, 4919.01, 364.47, 134.54, 4420.0),
        r("Senior Weekday", 9, 1, 18.99, 0.96, 0.53, 17.5),
        r("Gold Punch Membership", 18, 9, 8.73, 0.63, 0, 8.1),
        r("Players Club", 18, 1, 54.63, 3.63, 1.0, 50.0),
        r("Golf Reround", 18, 1, 30.0, 2.22, 0.81, 26.97),
    ],
    transportation: [
        r("Dunes Cart", 18, 98, 2473.26, 186.3, 22.07, 2264.89),
        r("Dunes Cart", 18, 1, 21.65, 1.61, 0.58, 19.46),
        r("Dunes Cart", 9, 2, 30.0, 2.28, 0, 27.72),
        r("Dunes Walking", 18, 10, 83.2, 5.62, 1.07, 76.51),
        r("Marcus Week Day Mem Trans", 18, 6, 129.9, 9.66, 3.48, 116.76),
    ],
    "product-sales": [
        r("Busch Prod", "Beer", 8, 43.24, 3.24, 0, 40.0),
        r("Carlsberg Pilsner", "Beer", 7, 60.97, 4.97, 0, 56.0),
        r("Full Grown Man", "Beer", 9, 78.39, 6.39, 0, 72.0),
        r("Hamm", "Beer", 1, 7.51, 0.12, 0, 7.39),
        r("Hamm's Beer", "Beer", 2, 15.02, 0.24, 0, 14.78),
        r("login test update", "Beer", 0, 0, 0, 0, 0),
        r("Miller Light", "Beer", 2, 2.0, 0, 0.04, 1.96),
        r("Miller Lite", "Beer", 2, 10.14, 0.8, 0.18, 9.16),
        r("Pearl Beer", "Beer", 5, 59.03, 4.31, 0, 54.72),
        r("Schlitz", "Beer", 14, 91.56, 7.56, 0, 84.0),
        r("Stone IPA", "Beer", 5, 25.26, 2.0, 0.36, 22.9),
        r("FireFly Sweet Tea", "Liquor", 2, 8.0, 0.72, 0, 7.28),
        r("Lee Morgan Product", "Events", -1, -50.0, -3.39, 0, -46.61),
        r("bacon double cheeseburger", "19th Hole Menu", 2, 31.16, 2.32, 0.84, 28.0),
        r("Crown n Coke", "19th Hole Menu", 2, 24.0, 1.78, 0.64, 21.58),
        r("Service Fee Product", "19th Hole Menu", 1, 10.0, 0, 0, 10.0),
        r("Chicken Wings", "Appetizers", 9, 120.6, 0.24, 0.45, 119.91),
        r("Potato Skins", "Appetizers", 1, 16.24, 1.34, 0.42, 14.48),
        r("Bubbler / Redbull", "Beverages", 2, 7.46, 0, 0, 7.46),
        r("Coffee", "Beverages", 2, 3.72, 0, 0, 3.72),
        r("Coke", "Beverages", 2, 3.95, 0.29, 0, 3.66),
        r("Dr. Pepper", "Beverages", 1, 2.03, 0.16, 0.04, 1.83),
        r("Gatorade", "Beverages", 0, 0, 0, 0, 0),
        r("Mountain Dew", "Beverages", 2, 4.06, 0.32, 0.08, 3.66),
        r("Pepsi", "Beverages", 2, 4.03, 0.29, 0.08, 3.66),
        r("Sprite", "Beverages", 1, 2.03, 0.16, 0.04, 1.83),
        r("Water", "Beverages", 2, 5.58, 0, 0, 5.58),
        r("Open Burger", "Hamburgers", 10, 130.18, 9.99, 0.31, 119.88),
        r("Paella", "Japanese Cuisine", 5, 26.64, 8.44, 0.55, 17.65),
        r("Scallops & Green Peppercorns", "Khmer Cuisine", 1, 9.13, 0.8, 0.24, 8.09),
        r("Banana Blossom Salad", "Myanmar Cuisine", 1, 6.6, 0.58, 0.18, 5.84),
        r("Egg Curry", "Myanmar Cuisine", 1, 7.1, 0.62, 0.19, 6.29),
        r("Chicken Salad Sandwich Hank's Super Special", "Sandwiches", 2, 24.16, 1.84, 0.32, 22.0),
        r("Meatball Sub", "Sandwiches", 5, 29.62, 2.36, 0.26, 27.0),
        r("Turkey Club Sandwich", "Sandwiches", 3, 29.68, 2.22, 0.59, 26.87),
        r("Wed Special", "Sandwiches", 1, 11.33, 0.89, 0.2, 10.24),
        r("Lays Potato Chips", "Snacks", 5, 11.1, 0.85, 0.25, 10.0),
        r("Branded Bill Hats", "Other", 1, 30.0, 0, 0, 30.0),
        r("eGiftify Gift Card", "Other", 1, 200.0, 0, 0, 200.0),
        r("Tees - assorted size/color (50ct)", "Accessories", 1, 15.01, 1.02, 0, 13.99),
        r("Devon Gift Card Test", "Accessories", 1, 14.99, 1.11, 0.4, 13.48),
        r("Women Sock2", "Accessories", 1, 0, 0, 0, 0),
        r("Bubly Blackberry (Pretend Golf Ball)", "Golf Balls", 5, 21.45, 1.45, 0, 20.0),
        r("Callaway Supersoft (Dozen)", "Golf Balls", 1, 23.0, 2.65, 0.4, 19.95),
        r("Chance Ball Tester (Dozen)", "Golf Balls", 3, 49.47, 3.57, 0.9, 45.0),
        r("Logo Golf Ball", "Golf Balls", 27, 25.12, 0.01, 0.81, 24.3),
        r("Nike Golf Balls", "Golf Balls", 2, 10.8, 0.8, 0, 10.0),
        r("Titleist Pro V1x (Dozen)", "Golf Balls", 2, 72.9, 5.96, 0.79, 66.15),
        r("Devon Test Golf Balls(12)", "Golf Balls", 1, 15.37, 0.37, 0, 15.0),
        r("Vice Tour (Dozen)", "Golf Balls", 2, 49.28, 6.22, 0.84, 42.22),
        r("Bad Birdie Bad Rope Hat", "Hats", 2, 67.67, 4.79, 0.88, 62.0),
        r("Birdie Rollins Snapback", "Hats", 1, 48.07, 3.19, 0.88, 44.0),
        r("Callaway Golf Tour Authentic Adjustable Hat", "Hats", 1, 36.06, 2.4, 0.66, 33.0),
        r("Callaway Men's Corduroy Golf Hat", "Hats", 2, 52.32, 3.36, 0.96, 48.0),
        r("KABOOM Baby Cuff Beanie", "Hats", 1, 43.7, 2.9, 0.8, 40.0),
        r("KILLER T'S SNAPBACK", "Hats", 1, 43.7, 2.9, 0.8, 40.0),
        r("NIKE Classic99 US Open Limited Edition", "Hats", 1, 41.78, 2.83, 0, 38.95),
        r("Test Hat PS", "Hats", 2, 32.68, 2.68, 0, 30.0),
        r("30 Day booking window", "Memberships", 9, 289.62, 19.62, 0, 270.0),
        r("50% Off Rack Member", "Memberships", 1, 1.0, 0, 0, 1.0),
        r("Rowan Membership", "Memberships", 2, 2.14, 0.14, 0, 2.0),
        r("Cheapos", "Memberships", 9, 429.3, 29.74, 2.9, 396.66),
        r("Eagle Membership", "Memberships", 1, 103.0, 0, 3.0, 100.0),
        // Not captured between screenshots; invented so the subtotal reconciles.
        r("Platinum Membership", "Memberships", 2, 2140.0, 140.0, 0, 2000.0),
        r("Senior Annual Membership", "Memberships", 3, 3210.0, 210.0, 0, 3000.0),
        r("FootJoy HydroLite Rain Jacket", "Outerwear", 2, 344.8, 22.4, 2.4, 320.0),
        r("Peter Millar Performance Polo", "Polos", 4, 419.44, 27.44, 0, 392.0),
        r("TenFore Logo Polo", "Polos", 7, 337.05, 22.05, 0, 315.0),
        r("Scotty Cameron Special Select Putter", "Putters", 2, 966.92, 63.0, 3.92, 900.0),
        r("Bushnell Pro X3 Rangefinder", "Rangefinders", 3, 2212.49, 169.49, 3.0, 2040.0),
        // End of invented rows.
        r("FootJoy Men's Fury Golf Shoes", "Shoes", 11, 1558.29, 111.9, 29.5, 1416.89),
        r("Puma Ignite", "Shoes", 4, 449.92, 39.92, 10.0, 400.0),
        r("Large Bucket", "Range Balls", 3, 38.23, 2.63, 0.8, 34.8),
        r("Large Bucket sp", "Range Balls", 8, 44.48, 3.28, 1.2, 40.0),
        r("Medium Bucket", "Range Balls", 1, 8.0, 0.59, 0.21, 7.2),
        r("Realized GiftCard", "Realized Income", 79, 16741.19, 0, 0, 16741.19),
        r("Nike Club Set Rental - 9 Holes", "Rental Clubs", 3, 99.69, 7.44, 2.25, 90.0),
        r("Titliest Permasoft Glove", "Gloves", 6, 74.04, 5.04, 0, 69.0),
        r("Muskeateer's Bar", "Devon Test", 2, 6.68, 0.5, 0.18, 6.0),
        r("test slow speed name update", "Devon Test", 4, 17.41, 1.29, 0.46, 15.66),
    ],
    "event-sales": [r("Waterchase PGA · Dunes Rack Prime", 4, 399.92, 55.2, null, 344.72), r("Waterchase PGA · Dunes Cart", 4, 99.92, 7.4, null, 92.52)],
    "event-payments": [r("Cash", 0, 8207.44), r("Credit", 0, 2500.0), r("Customer Charge", 0, 696.0)],
    "activity-sales": [r("Sim Hour", 2, 265.0, 15.0, 0, 250.0)],
    "fee-rule-sales": [r("Advanced Tee Time Booking", 2, 21.64, 1.64, 0, 20.0), r("Booking Deposit Fee", 15, 162.38, 12.38, 0, 150.0)],
    "open-misc": [],
    "gift-cards": [r("Gift Cards", 1340.38, 1340.01)],
    taxes: [
        r(null, 19.9),
        r("Admissions Tax", 3.16),
        r("Sales Tax Test", 33.86),
        r("Standard Sales Tax", 7.44),
        r("Standard Tax", 1638.75),
        r("Tax Exempt", 15.32),
        r("TB tax", 2.6),
    ],
    "fees-tips": [r("TenFore Fees", 279.98), r("Credit Card Fees", 0), r("Tips", 178.2), r("Service Charges", 619.81), r("Credit Card Surcharges", 183.49)],
    "money-collected": [
        r("Customer Payments · Cash", 1993.72),
        r("Customer Payments · Credit (Mastercard)", 585.6),
        r("Customer Payments · Credit (Visa)", 11075.88),
        r("Customer Payments · Gift Card", 5229.05),
        r("Events · Cash", 5539.84),
        r("Orders · Cash", 9488.28),
        r("Orders · Credit (AMEX)", 200.24),
        r("Orders · Credit (Mastercard)", 563.47),
        r("Orders · Credit (VISA)", 4879.46),
        r("Orders · Customer Charge", 10157.81),
        r("Orders · Gift Card", 16991.21),
        r("Orders · Rain Check", 335.42),
    ],
    "charge-payments": [r("Cash", 0, 1993.72), r("Credit", 0, 11661.48), r("Gift Card", 0, 5229.05)],
    discounts: [r("Discounts", 123.7), r("Comps", 0), r("Refunds", 1047.16), r("Redeemed Rewards", 4.98)],
    adjustments: [r("Cash Payouts", 65.0)],
};

const COUNT_COLUMNS = ["Holes", "Rounds", "Qty", "Quantity"];
const isText = (label: string, i: number) => i === 0 || label === "Group";
const cents = (n: number) => Math.round(n * 100) / 100;

const format = (value: RevenueCell, label: string, i: number) =>
    value === null ? "—" : typeof value === "string" ? value : isText(label, i) || COUNT_COLUMNS.includes(label) ? String(value) : money(value);

/** Column totals: text columns and Holes stay blank, an all-"—" column stays "—". */
const sum = (rows: RevenueCell[][], columns: string[]): RevenueCell[] =>
    columns.map((label, i) => {
        if (isText(label, i) || label === "Holes") return "";
        const values = rows.map((row) => row[i]).filter((v): v is number => typeof v === "number");
        return values.length ? cents(values.reduce((a, b) => a + b, 0)) : null;
    });

/**
 * A section's rows and Total as display strings. `byGroup` (product sales
 * only) drops the Product column and rolls items up into their group.
 */
export const revenueTable = (section: RevenueSection, byGroup = false) => {
    const grouped = byGroup && section.id === "product-sales";
    const columns = grouped ? section.columns.filter((c) => c !== "Product") : section.columns;
    let rows = REVENUE_ROWS[section.id] ?? [];
    if (grouped) {
        const byName = new Map<string, RevenueCell[][]>();
        for (const row of rows) byName.set(String(row[1]), [...(byName.get(String(row[1])) ?? []), row.slice(1)]);
        rows = [...byName].map(([name, items]) => [name, ...sum(items, columns).slice(1)]);
    }
    const total = rows.length ? sum(rows, columns) : null;
    const last = total?.[total.length - 1];
    return {
        columns,
        rows: rows.map((row) => row.map((cell, i) => format(cell, columns[i], i))),
        total: total && total.map((cell, i) => (i === 0 ? "Total" : format(cell, columns[i], i))),
        amount: typeof last === "number" ? last : 0,
    };
};

/* ------------------------------------------------------------------ */
/*  Combined Report — derived                                          */
/* ------------------------------------------------------------------ */

/*
 * There are no Combined Report screenshots for September, so its lines are
 * built from the Combined Revenue rows above, following each line's
 * definition (REPORT_LINE_INFO). Amounts are net of tax and fees.
 */

export type ReportPart = { label: string; amount: number };

const netOf = (row: RevenueCell[]) => row[row.length - 1] as number;
const rowsOf = (id: string) => REVENUE_ROWS[id] ?? [];
const total = (parts: ReportPart[]) => cents(parts.reduce((a, p) => a + p.amount, 0));
const eventRow = (name: string) => rowsOf("event-sales").find((row) => String(row[0]).endsWith(name))!;

/** Product groups rolled up by net, in the order given. */
const productGroups = (groups: string[]): ReportPart[] =>
    groups.map((group) => ({
        label: group,
        amount: cents(
            rowsOf("product-sales")
                .filter((row) => row[1] === group)
                .reduce((a, row) => a + netOf(row), 0),
        ),
    }));

/** What makes up each Combined Report line, keyed by line name. */
export const REPORT_PARTS: Record<string, ReportPart[]> = {
    "Food Sales": productGroups([
        "19th Hole Menu",
        "Appetizers",
        "Beverages",
        "Hamburgers",
        "Japanese Cuisine",
        "Khmer Cuisine",
        "Myanmar Cuisine",
        "Sandwiches",
        "Snacks",
    ]),
    "Alcohol Sales": productGroups(["Beer", "Liquor"]),
    "Golf Sales": [
        { label: "Green fees", amount: total(rowsOf("green-fees").map((row) => ({ label: "", amount: netOf(row) }))) },
        { label: String(eventRow("Dunes Rack Prime")[0]), amount: netOf(eventRow("Dunes Rack Prime")) },
    ],
    "Transportation Sales": [
        { label: "Cart and walking fees", amount: total(rowsOf("transportation").map((row) => ({ label: "", amount: netOf(row) }))) },
        { label: String(eventRow("Dunes Cart")[0]), amount: netOf(eventRow("Dunes Cart")) },
    ],
    "Pro Shop Sales": productGroups(["Accessories", "Golf Balls", "Hats", "Memberships", "Outerwear", "Polos", "Putters", "Rangefinders", "Shoes", "Gloves"]),
    Taxes: rowsOf("taxes").map((row) => ({ label: row[0] === null ? "—" : String(row[0]), amount: netOf(row) })),
    Fees: rowsOf("fees-tips")
        .filter((row) => ["TenFore Fees", "Service Charges", "Credit Card Surcharges"].includes(String(row[0])))
        .map((row) => ({ label: String(row[0]), amount: netOf(row) })),
};

/** Each Combined Report line's amount. */
export const reportAmount = (line: string) => total(REPORT_PARTS[line] ?? []);

/** Total Money Collected regrouped by payment type ("Orders · Credit (VISA)" → "Credit (Visa)"). */
export const REPORT_PAYMENTS: ReportPart[] = (() => {
    const byType = new Map<string, number>();
    for (const row of rowsOf("money-collected")) {
        const type = String(row[0]).split(" · ")[1].replace("(VISA)", "(Visa)");
        byType.set(type, cents((byType.get(type) ?? 0) + netOf(row)));
    }
    return [...byType].map(([label, amount]) => ({ label, amount })).sort((a, b) => a.label.localeCompare(b.label));
})();

export const REPORT_TOTALS = {
    sales: (lines: string[]) => total(lines.map((line) => ({ label: line, amount: reportAmount(line) }))),
    payments: total(REPORT_PAYMENTS),
};

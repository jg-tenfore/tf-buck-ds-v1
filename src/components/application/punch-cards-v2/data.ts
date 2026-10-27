import type { FC } from "react";
import { Car01, Flag01, GraduationHat01, Monitor01, ShoppingBag01, Users01 } from "@untitledui/icons";

/**
 * Punch Cards V2: a punch card can now hold several items of different kinds
 * (green fees, transportation, products, activities, clinics, lessons), not
 * just rounds and cart fees. Content follows the Loom brief and the concept
 * screenshots (Golf & Range Bundle, Add Item steps).
 */

export type ItemKind = "green-fee" | "transportation" | "product" | "activity" | "clinic" | "lesson";

export type ItemKindMeta = {
    kind: ItemKind;
    label: string;
    description: string;
    icon: FC<{ className?: string }>;
    /** What one punch is worth, shown under the punches stepper. */
    rule: string;
};

export const ITEM_KINDS: ItemKindMeta[] = [
    {
        kind: "green-fee",
        label: "Green Fee",
        description: "Rounds of golf at the applicable courses",
        icon: Flag01,
        rule: "1 punch = 1 green fee at any applicable course.",
    },
    {
        kind: "transportation",
        label: "Transportation",
        description: "Cart or other transportation fees",
        icon: Car01,
        rule: "1 punch = 1 transportation fee at any applicable course.",
    },
    {
        kind: "product",
        label: "Product",
        description: "Any product, such as a drink or a range bucket",
        icon: ShoppingBag01,
        rule: "1 punch = 1 of this product.",
    },
    {
        kind: "activity",
        label: "Activity",
        description: "Simulator bays, fitness classes, physical therapy",
        icon: Monitor01,
        rule: "1 punch = 1 booking up to the duration set.",
    },
    { kind: "clinic", label: "Clinic", description: "Group instruction clinics", icon: Users01, rule: "1 punch = 1 seat in a clinic." },
    {
        kind: "lesson",
        label: "Lesson",
        description: "Private lessons with any pro or a specific one",
        icon: GraduationHat01,
        rule: "1 punch = 1 lesson up to the length set.",
    },
];

export const kindMeta = (kind: ItemKind) => ITEM_KINDS.find((k) => k.kind === kind)!;

export type PunchItem = {
    id: string;
    kind: ItemKind;
    punches: number;
    /** Green fee / transportation type, product name, activity type, clinic or instructor. */
    target: string;
    /** Activities and lessons: minutes per punch. */
    duration?: number;
};

export const TRANSPORTATION_TYPES = ["Any cart fee", "Riding Cart", "Single Rider Cart", "Push Cart"];
/** Activities, clinics and products can cover the whole category ("All …") or one specific item. */
export const ALL_ACTIVITIES = "All activities";
export const ALL_CLINICS = "All clinics";
export const ALL_PRODUCTS = "All products";
export const ACTIVITY_TYPES = [ALL_ACTIVITIES, "Simulator Bays", "Fitness Classes", "Physical Therapy"];
export const INSTRUCTORS = ["Any pro", "Jordan Pike · Head Pro", "Sam Ortega", "Riley Chen"];
export const CLINICS = [ALL_CLINICS, "Junior Golf Clinic", "Short Game Clinic", "Ladies' Night Clinic", "Beginner Golf 101"];

export type Product = { name: string; group: string; location: string };

export const PRODUCTS: Product[] = [
    { name: "Range Bucket – Small", group: "Range", location: "Golf Shop" },
    { name: "Range Bucket – Medium", group: "Range", location: "Golf Shop" },
    { name: "Range Bucket – Large", group: "Range", location: "Golf Shop" },
    { name: "Bottled Water", group: "Beverages", location: "Grill" },
    { name: "Gatorade", group: "Beverages", location: "Grill" },
    { name: "Domestic Beer", group: "Beer", location: "19th Hole" },
    { name: "Hot Dog", group: "Grill", location: "Snack Bar" },
    { name: "Logo Golf Balls (Sleeve)", group: "Golf Balls", location: "Golf Shop" },
    { name: "Titleist Pro V1 (Dozen)", group: "Golf Balls", location: "Golf Shop" },
    { name: "Club Rental – 18 Holes", group: "Rental Clubs", location: "Golf Shop" },
    { name: "Locker Rental – Day", group: "Lockers", location: "Clubhouse" },
];

export const TAX_RATES = [
    { value: "sales", label: "Sales Tax (7.26%)", rate: 0.0726 },
    { value: "liquor", label: "Liquor Tax (9.00%)", rate: 0.09 },
    { value: "admissions", label: "Admissions Tax (5.00%)", rate: 0.05 },
    { value: "exempt", label: "Tax Exempt (0%)", rate: 0 },
];

export const SECOND_TAX_RATES = [
    { value: "none", label: "No second tax", rate: 0 },
    { value: "city", label: "City Tax (1.00%)", rate: 0.01 },
    { value: "county", label: "County Tax (0.50%)", rate: 0.005 },
];

export const COURSES = ["Bushwood Country Club", "Orange County Convention Center", "Schule Oaks", "The Big Loop International"];

/** Kinds whose punches are worth a length of time (minutes per punch). */
const DURATION_KINDS: ItemKind[] = ["activity", "lesson"];
export const hasDuration = (kind?: ItemKind) => Boolean(kind && DURATION_KINDS.includes(kind));

/* ------------------------------------------------------------------ */
/*  Item display                                                       */
/* ------------------------------------------------------------------ */

/** The item's name as listed on the card, e.g. "Simulator Bays · 60 min each". */
export const itemLabel = (item: Pick<PunchItem, "kind" | "target" | "duration">) =>
    item.kind === "activity"
        ? `${item.target} · ${item.duration} min each`
        : item.kind === "lesson"
          ? `${item.target.split(" · ")[0]} · ${item.duration} min lesson`
          : item.target;

/** Same thing on the card (kind, what it covers, length): adding it again merges punches. */
export const sameItem = (a: Pick<PunchItem, "kind" | "target" | "duration">, b: Pick<PunchItem, "kind" | "target" | "duration">) =>
    a.kind === b.kind && a.target === b.target && (!hasDuration(a.kind) || a.duration === b.duration);

/** True when an item covers a whole category ("All activities", "Any pro"…) rather than one specific item. */
export const isAllScope = (target: string) => target.startsWith("All ") || target.startsWith("Any ");

/** "Simulator Bays" → "Simulator Bay", "Fitness Classes" → "Fitness Class". */
const singular = (s: string) => (s.endsWith("sses") ? s.slice(0, -2) : s.replace(/s$/, ""));

export const punchesLabel = (n: number) => (n === 1 ? "punch" : "punches");

/** The "This card will include …" sentence in the Add Item dialog. */
export const itemSummary = (item: Pick<PunchItem, "kind" | "target" | "duration" | "punches">) => {
    const n = item.punches;
    switch (item.kind) {
        case "green-fee":
            return `${n} Green Fee ${punchesLabel(n)}`;
        case "transportation":
            return item.target === "Any cart fee" ? `${n} cart fee ${punchesLabel(n)}` : `${n} × ${item.target}`;
        case "product":
            return item.target === ALL_PRODUCTS
                ? `${n} ${punchesLabel(n)} for any product`
                : item.target
                  ? `${n} × ${item.target}`
                  : `${n} product ${punchesLabel(n)}`;
        case "activity":
            return item.target === ALL_ACTIVITIES
                ? `${n} × ${item.duration}-minute ${punchesLabel(n)} for any activity`
                : `${n} × ${item.duration}-minute ${singular(item.target)} ${punchesLabel(n)}`;
        case "clinic":
            return item.target === ALL_CLINICS ? `${n} clinic ${punchesLabel(n)}, any clinic` : `${n} × ${item.target}`;
        case "lesson":
            return `${n} × ${item.duration}-minute lesson ${punchesLabel(n)} with ${item.target === "Any pro" ? "any pro" : item.target.split(" · ")[0]}`;
    }
};

/** Defaults when an item kind is picked in step 1. */
export const defaultTarget: Record<ItemKind, string> = {
    "green-fee": "Any green fee",
    transportation: TRANSPORTATION_TYPES[0],
    product: "",
    activity: ACTIVITY_TYPES[0],
    clinic: CLINICS[0],
    lesson: INSTRUCTORS[0],
};

/* ------------------------------------------------------------------ */
/*  Punch cards                                                        */
/* ------------------------------------------------------------------ */

export type Expiration = { mode: "never" | "days" | "date"; days: number; date: string };

export const NEVER_EXPIRES: Expiration = { mode: "never", days: 365, date: "12/31/2026" };

export const expirationLabel = (e: Expiration) => (e.mode === "never" ? "Never expires" : e.mode === "days" ? `${e.days} days after purchase` : `On ${e.date}`);

export type PunchCard = {
    title: string;
    description: string;
    price: number;
    tax: string;
    tax2: string;
    items: PunchItem[];
    courses: string[];
    expiration: Expiration;
};

export const EMPTY_CARD: PunchCard = { title: "", description: "", price: 0, tax: "sales", tax2: "none", items: [], courses: [], expiration: NEVER_EXPIRES };

export const cardTotals = (card: Pick<PunchCard, "price" | "tax" | "tax2">) => {
    const round = (n: number) => Math.round(n * 100) / 100;
    const tax = round(card.price * (TAX_RATES.find((t) => t.value === card.tax)?.rate ?? 0));
    const tax2 = round(card.price * (SECOND_TAX_RATES.find((t) => t.value === card.tax2)?.rate ?? 0));
    const fees = 0;
    return { tax, tax2, fees, total: round(card.price + tax + tax2 + fees) };
};

let nextId = 0;
const item = (kind: ItemKind, punches: number, target = defaultTarget[kind], duration?: number): PunchItem => ({
    id: `seed-${++nextId}`,
    kind,
    punches,
    target,
    duration,
});

export type Combination = { id: string; name: string; why: string; card: PunchCard };

/** Hypothetical punch cards: what different item mixes look like once built. */
export const COMBINATIONS: Combination[] = [
    {
        id: "golf-cart",
        name: "Golf & Cart",
        why: "Today's punch card (rounds + cart fees), built the new way.",
        card: {
            title: "10-Round Golf & Cart Card",
            description: "Ten rounds of golf, each with a riding cart.",
            price: 450,
            tax: "sales",
            tax2: "none",
            items: [item("green-fee", 10), item("transportation", 10)],
            courses: ["Bushwood Country Club", "Schule Oaks"],
            expiration: NEVER_EXPIRES,
        },
    },
    {
        id: "range",
        name: "Range Buckets",
        why: "A single product: the most-asked-for new use.",
        card: {
            title: "Range Bucket 10-Pack",
            description: "Ten large buckets at the driving range.",
            price: 90,
            tax: "sales",
            tax2: "none",
            items: [item("product", 10, "Range Bucket – Large")],
            courses: ["Bushwood Country Club"],
            expiration: { mode: "days", days: 365, date: "" },
        },
    },
    {
        id: "simulator",
        name: "Simulator Hours",
        why: "A single activity with a duration per punch.",
        card: {
            title: "Simulator Hours",
            description: "Ten one-hour sessions in any simulator bay.",
            price: 400,
            tax: "admissions",
            tax2: "none",
            items: [item("activity", 10, "Simulator Bays", 60)],
            courses: ["Bushwood Country Club", "The Big Loop International"],
            expiration: { mode: "date", days: 365, date: "03/31/2027" },
        },
    },
    {
        id: "clinic",
        name: "Clinic Pass",
        why: "Lessons: group clinics only.",
        card: {
            title: "Clinic Pass",
            description: "Any four group clinics this season.",
            price: 160,
            tax: "exempt",
            tax2: "none",
            items: [item("clinic", 4)],
            courses: ["Schule Oaks"],
            expiration: { mode: "date", days: 365, date: "12/31/2026" },
        },
    },
    {
        id: "lessons",
        name: "Lesson Pack",
        why: "Private lessons with one pro, 30 minutes each.",
        card: {
            title: "Lesson Pack with Sam",
            description: "Five 30-minute private lessons with Sam Ortega.",
            price: 300,
            tax: "exempt",
            tax2: "none",
            items: [item("lesson", 5, "Sam Ortega", 30)],
            courses: ["Bushwood Country Club"],
            expiration: { mode: "days", days: 180, date: "" },
        },
    },
    {
        id: "range-refresh",
        name: "Range & Refresh",
        why: "Two products on one card, with no golf at all.",
        card: {
            title: "Range & Refresh",
            description: "A medium bucket and a Gatorade for every visit.",
            price: 120,
            tax: "sales",
            tax2: "city",
            items: [item("product", 10, "Range Bucket – Medium"), item("product", 10, "Gatorade")],
            courses: ["Bushwood Country Club"],
            expiration: { mode: "days", days: 90, date: "" },
        },
    },
    {
        id: "bundle",
        name: "Golf & Range Bundle",
        why: "The concept screenshot: four kinds on one card.",
        card: {
            title: "Golf & Range Bundle",
            description: "10 rounds, 10 large range buckets, 5 simulator hours and a free clinic.",
            price: 650,
            tax: "sales",
            tax2: "none",
            items: [item("green-fee", 10), item("product", 10, "Range Bucket – Large"), item("activity", 5, "Simulator Bays", 60), item("clinic", 1)],
            courses: ["Bushwood Country Club", "Schule Oaks"],
            expiration: { mode: "days", days: 365, date: "" },
        },
    },
    {
        id: "everything",
        name: "Everything Card",
        why: "The Loom example: all six kinds on one card.",
        card: {
            title: "The Everything Card",
            description: "10 rounds with carts, 5 range buckets, a clinic, a lesson and 5 simulator hours.",
            price: 995,
            tax: "sales",
            tax2: "none",
            items: [
                item("green-fee", 10),
                item("transportation", 10),
                item("product", 5, "Range Bucket – Large"),
                item("clinic", 1),
                item("lesson", 1, "Any pro", 60),
                item("activity", 5, "Simulator Bays", 60),
            ],
            courses: COURSES,
            expiration: { mode: "date", days: 365, date: "12/31/2027" },
        },
    },
];

export const combination = (id: string) => COMBINATIONS.find((c) => c.id === id)!;

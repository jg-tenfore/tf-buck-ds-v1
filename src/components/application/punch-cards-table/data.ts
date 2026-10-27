import { ALL_ACTIVITIES, ALL_CLINICS, ALL_PRODUCTS, COMBINATIONS, type ItemKind } from "@/components/application/punch-cards-v2/data";

/** Fixed reporting date keeps the sample's expiring/expired states reproducible. */
export const AS_OF = "2026-10-15";
export type OwnedItem = { kind: ItemKind; target: string; duration?: number; awarded: number; used: number };
export type OwnedCard = {
    id: string;
    customer: string | null;
    email: string;
    member: boolean;
    title: string;
    course: string;
    purchased: string;
    expires: string | null;
    price: number;
    order: string;
    items: OwnedItem[];
};

const people = [
    ["Mara Thompson", "mara.thompson@example.com"],
    ["James Wilson", "james.wilson@example.com"],
    ["Olivia Martinez", "olivia.martinez@example.com"],
    ["William Chen", "william.chen@example.com"],
    ["Sophia Davis", "sophia.davis@example.com"],
    ["Noah Anderson", "noah.anderson@example.com"],
    ["Emma Taylor", "emma.taylor@example.com"],
    ["Liam Brooks", "liam.brooks@example.com"],
] as const;

export const OWNED_CARDS: OwnedCard[] = Array.from({ length: 24 }, (_, i) => {
    const card = COMBINATIONS[i % COMBINATIONS.length].card;
    const person = people[(i + Math.floor(i / people.length) * 3) % people.length];
    return {
        id: `CPC-${10480 + i}`,
        customer: i === 15 ? null : person[0],
        email: i === 15 ? "" : person[1],
        member: i % 3 === 0 && i !== 15,
        title: card.title,
        course: card.courses.includes("Schule Oaks") && i % 3 === 0 ? "Schule Oaks" : card.courses[0],
        purchased: i % 4 === 0 ? "2026-09-22" : `2026-10-${String(1 + (i % 14)).padStart(2, "0")}`,
        expires: i % 7 === 0 ? null : i % 6 === 0 ? "2026-10-01" : i % 3 === 0 ? "2026-10-28" : "2027-03-31",
        price: card.price,
        order: `ORD-${9280 + i}`,
        items: card.items.map((item, j) => ({
            kind: item.kind,
            target: item.target,
            duration: item.duration,
            awarded: item.punches,
            used: i % 5 === 0 ? 0 : i % 7 === 0 ? item.punches : Math.min(item.punches, 1 + ((i + j) % Math.max(1, item.punches - 1))),
        })),
    };
});

/**
 * Extra customer cards for the 1c "all vs specific" variants: items that cover a whole category
 * (All activities / All products / All clinics) next to specific ones, so each display can be compared.
 */
export const ALL_SCOPE_CARDS: OwnedCard[] = [
    {
        id: "CPC-10504",
        customer: "Olivia Martinez",
        email: "olivia.martinez@example.com",
        member: true,
        title: "Activity Pass",
        course: "Bushwood Country Club",
        purchased: "2026-10-15",
        expires: "2027-03-31",
        price: 300,
        order: "ORD-9304",
        items: [{ kind: "activity", target: ALL_ACTIVITIES, duration: 60, awarded: 10, used: 3 }],
    },
    {
        id: "CPC-10505",
        customer: "William Chen",
        email: "william.chen@example.com",
        member: false,
        title: "Pro Shop Punches",
        course: "Schule Oaks",
        purchased: "2026-10-15",
        expires: "2027-03-31",
        price: 120,
        order: "ORD-9305",
        items: [
            { kind: "product", target: ALL_PRODUCTS, awarded: 5, used: 1 },
            { kind: "clinic", target: ALL_CLINICS, awarded: 2, used: 0 },
        ],
    },
    {
        id: "CPC-10506",
        customer: "Liam Brooks",
        email: "liam.brooks@example.com",
        member: true,
        title: "Range & Sim Mix",
        course: "Bushwood Country Club",
        purchased: "2026-10-15",
        expires: "2027-03-31",
        price: 260,
        order: "ORD-9306",
        items: [
            { kind: "product", target: "Range Bucket – Large", awarded: 10, used: 4 },
            { kind: "activity", target: "Simulator Bays", duration: 60, awarded: 4, used: 1 },
            { kind: "activity", target: ALL_ACTIVITIES, duration: 30, awarded: 4, used: 0 },
            { kind: "clinic", target: "Short Game Clinic", awarded: 1, used: 0 },
        ],
    },
];

export type CardStatus = "Active" | "Expiring soon" | "Exhausted" | "Expired";
export const remaining = (item: OwnedItem) => item.awarded - item.used;
export const statusOf = (card: OwnedCard): CardStatus => {
    if (card.expires && card.expires < AS_OF) return "Expired";
    if (card.items.every((item) => remaining(item) === 0)) return "Exhausted";
    if (card.expires && card.expires <= "2026-11-14") return "Expiring soon";
    return "Active";
};
export const money = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
export const date = (value: string | null) =>
    value ? new Date(`${value}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No expiration";
export const unitOf = (kind: ItemKind) =>
    ({ "green-fee": "rounds", transportation: "cart fees", product: "items", activity: "sessions", clinic: "seats", lesson: "lessons" })[kind];

export type Segment = "all" | "ready" | "unused" | "expiring" | "partial" | "exhausted" | "expired";
export const SEGMENTS: { id: Segment; label: string; hint: string }[] = [
    { id: "all", label: "All customer cards", hint: "Every card sold to a customer" },
    { id: "ready", label: "Ready to use", hint: "Active cards with a remaining balance" },
    { id: "expiring", label: "Expiring soon", hint: "Usable cards expiring in the next 30 days" },
    { id: "unused", label: "Unused", hint: "Usable cards with no redemptions" },
    { id: "partial", label: "Partially used", hint: "Usable cards with redemptions and a balance" },
    { id: "exhausted", label: "Exhausted", hint: "All included items have been redeemed" },
    { id: "expired", label: "Expired", hint: "Past their expiration date" },
];
export const inSegment = (card: OwnedCard, segment: Segment) => {
    const status = statusOf(card);
    const usable = status === "Active" || status === "Expiring soon";
    if (segment === "all") return true;
    if (segment === "ready") return usable;
    if (segment === "unused") return usable && card.items.every((item) => item.used === 0);
    if (segment === "partial") return usable && card.items.some((item) => item.used > 0);
    return status === ({ expiring: "Expiring soon", exhausted: "Exhausted", expired: "Expired" } as const)[segment];
};

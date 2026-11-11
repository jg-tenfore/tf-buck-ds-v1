/*
 * Bay Sheet data for Buck. The rules (fees, overlap, daily limit, repeats,
 * blocks) are the ones Birdie's Oct 30 bay sheet settled on, so a booking made
 * in Buck behaves the way the same booking does at the counter. Names, rates
 * and the seeded day are invented.
 */

export const SHEET_DATE = "Tue, Nov 17, 2026";
/** Tuesday: picks the Sun–Thu rate. */
export const SHEET_WEEKDAY = 2;

/** Minutes from midnight, so the arithmetic stays plain. */
export const DAY_START = 8 * 60;
export const DAY_END = 22 * 60;
export const SLOT = 30;

/** A bay is a resource: a name and a capacity. No colour field exists on the backend, so none is drawn. */
export const BAYS = [
    { id: "bay-1", name: "Bay 1", capacity: 6 },
    { id: "bay-2", name: "Bay 2", capacity: 6 },
    { id: "bay-3", name: "Bay 3", capacity: 6 },
    { id: "bay-4", name: "Bay 4", capacity: 8 },
    { id: "bay-5", name: "Bay 5", capacity: 8 },
    { id: "lesson", name: "Lesson Bay", capacity: 2 },
    { id: "nicklaus", name: "Nicklaus Bay", capacity: 8 },
    { id: "palmer", name: "Palmer Bay", capacity: 6 },
    { id: "east-porch", name: "East Porch Sim", capacity: 1 },
    { id: "west-porch", name: "West Porch Sim", capacity: 1 },
] as const;

export type Bay = (typeof BAYS)[number];
export const bayById = (id: string): Bay => BAYS.find((b) => b.id === id) ?? BAYS[0];

export const fmtTime = (minutes: number) => {
    const h24 = Math.floor(minutes / 60);
    const m = minutes % 60;
    const h = h24 % 12 === 0 ? 12 : h24 % 12;
    return `${h}:${String(m).padStart(2, "0")} ${h24 < 12 ? "AM" : "PM"}`;
};

/** "8a", "12p" — the hour labels under the tee sheet's chart. */
export const fmtHour = (minutes: number) => {
    const h24 = Math.floor(minutes / 60);
    const h = h24 % 12 === 0 ? 12 : h24 % 12;
    return `${h}${h24 < 12 ? "a" : "p"}`;
};

export const fmtDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h === 0 ? `${m}m` : m === 0 ? `${h}h` : `${h}h ${m}m`;
};

export const usd = (v: number) => `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* -------------------------------------------------------------------------- */
/*  People                                                                    */
/* -------------------------------------------------------------------------- */

/** A membership the course created. Its colour is picked on the plan and drawn as given, like the tee sheet does. */
export type Membership = { id: string; name: string; color: string; punchCard?: string };

export const MEMBERSHIPS: Membership[] = [
    { id: "sim", name: "Sim Hours Membership", color: "#C77700", punchCard: "Sim 10-Pack" },
    { id: "club", name: "Club Membership", color: "#5E35B1" },
    { id: "monthly", name: "Monthly Range", color: "#2E7D9A" },
];

export const NO_MEMBERSHIP = { name: "No membership", color: "#A4A7AE" };
export const membershipOf = (c?: Customer) => MEMBERSHIPS.find((m) => m.id === c?.membershipId);

export type Customer = {
    id: string;
    name: string;
    email: string;
    phone: string;
    membershipId?: string;
    punchesLeft?: number;
};

export const CUSTOMERS: Customer[] = [
    { id: "c-1", name: "Maya Fischer", email: "maya.fischer@example.com", phone: "(555) 201-4410", membershipId: "sim", punchesLeft: 6 },
    { id: "c-2", name: "Andre Collins", email: "andre.c@example.com", phone: "(555) 201-7720", membershipId: "club" },
    { id: "c-3", name: "Priya Shah", email: "priya.shah@example.com", phone: "(555) 318-0094" },
    { id: "c-4", name: "Tom Okafor", email: "tom.okafor@example.com", phone: "(555) 412-6631", membershipId: "monthly" },
    { id: "c-5", name: "Lena Brooks", email: "lena.brooks@example.com", phone: "(555) 519-2208" },
    { id: "c-6", name: "Junior Golf League", email: "league@example.com", phone: "(555) 600-1100", membershipId: "club" },
    { id: "c-7", name: "Sam Ortega", email: "sam.ortega@example.com", phone: "(555) 733-4120", membershipId: "sim", punchesLeft: 1 },
    { id: "c-8", name: "Coach Dana Wells", email: "dana.wells@example.com", phone: "(555) 845-9012" },
    { id: "c-9", name: "Grace Lindqvist", email: "grace.l@example.com", phone: "(555) 902-3307" },
    { id: "c-10", name: "Ravi Menon", email: "ravi.menon@example.com", phone: "(555) 118-5546", membershipId: "club" },
];

export const customerById = (id: string) => CUSTOMERS.find((c) => c.id === id);

/** Name, email, phone or the last digits of a phone. */
export const searchCustomers = (q: string) => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    const digits = s.replace(/\D/g, "");
    return CUSTOMERS.filter(
        (c) => c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s) || (digits.length >= 3 && c.phone.replace(/\D/g, "").includes(digits)),
    ).slice(0, 6);
};

/* -------------------------------------------------------------------------- */
/*  Fees                                                                      */
/* -------------------------------------------------------------------------- */

type Fee = { name: string; hourly: number; from: number; to: number; membershipIds: string[] };

const FEES: Fee[] = [
    { name: "Sim Hour Sun–Thu", hourly: 60, from: DAY_START, to: 16 * 60, membershipIds: [] },
    { name: "Sim Hour Evening", hourly: 75, from: 16 * 60, to: DAY_END, membershipIds: [] },
    { name: "Member Sim Hour", hourly: 40, from: DAY_START, to: DAY_END, membershipIds: ["club", "monthly"] },
];

/** The most specific fee wins: one that names the golfer's membership beats one for everybody. */
export const feeFor = (customer: Customer | undefined, start: number, duration: number) => {
    const held = customer?.membershipId;
    const fee =
        FEES.filter((f) => start >= f.from && start < f.to)
            .filter((f) => f.membershipIds.length === 0 || (held && f.membershipIds.includes(held)))
            .sort((a, b) => b.membershipIds.length - a.membershipIds.length)[0] ?? FEES[0];
    return { name: fee.name, hourly: fee.hourly, amount: Number(((fee.hourly * duration) / 60).toFixed(2)) };
};

/** One punch buys one hour. */
export const punchesNeeded = (duration: number) => Math.ceil(duration / 60);

/* -------------------------------------------------------------------------- */
/*  Reservations and blocks                                                   */
/* -------------------------------------------------------------------------- */

export type Status = "booked" | "checkedIn" | "cancelled" | "noShow";
export type Repeat = "none" | "daily" | "weekly" | "biweekly" | "monthly";

export const REPEAT_LABEL: Record<Repeat, string> = {
    none: "Does not repeat",
    daily: "Daily",
    weekly: "Weekly",
    biweekly: "Every 2 weeks",
    monthly: "Monthly",
};

export const STATUS_LABEL: Record<Status, string> = { booked: "Booked", checkedIn: "Checked in", cancelled: "Cancelled", noShow: "No-show" };

export type Reservation = {
    id: string;
    bayId: string;
    start: number;
    duration: number;
    customerId: string;
    party: number;
    status: Status;
    paid: boolean;
    tabOpen: boolean;
    note?: string;
    repeat: Repeat;
    seriesId?: string;
    punchesUsed?: number;
};

export type Block = { id: string; bayId: string; start: number; duration: number; label: string; repeat: Repeat; seriesId?: string };

const r = (id: string, bayId: string, start: number, duration: number, customerId: string, party: number, extra: Partial<Reservation> = {}): Reservation => ({
    id,
    bayId,
    start,
    duration,
    customerId,
    party,
    status: "booked",
    paid: false,
    tabOpen: false,
    repeat: "none",
    ...extra,
});

const H = (h: number, m = 0) => h * 60 + m;

/** A day that carries every state at once: checked in, open tab, paid, notes, a weekly series, a cancellation, a no-show and blocks. */
export const SEED_RESERVATIONS: Reservation[] = [
    r("r-1", "bay-1", H(8, 30), 60, "c-1", 2, { status: "checkedIn", paid: true, punchesUsed: 1 }),
    r("r-2", "bay-2", H(9), 90, "c-3", 4, { note: "Birthday — two extra chairs and the big screen" }),
    r("r-3", "bay-3", H(10), 60, "c-2", 1, { status: "checkedIn", tabOpen: true }),
    r("r-4", "bay-4", H(10, 30), 120, "c-4", 6, { paid: true }),
    r("r-5", "bay-5", H(11), 60, "c-5", 2, { status: "noShow" }),
    r("r-6", "nicklaus", H(12), 60, "c-9", 3, { status: "cancelled" }),
    r("r-7", "lesson", H(13), 60, "c-8", 2, { repeat: "weekly", seriesId: "s-1", note: "Standing Tuesday lesson" }),
    r("r-8", "palmer", H(14), 90, "c-3", 4),
    r("r-9", "bay-1", H(16), 60, "c-4", 2),
    r("r-10", "bay-3", H(17), 120, "c-6", 8, { note: "League practice — invoice to the league", repeat: "weekly", seriesId: "s-2" }),
    r("r-11", "bay-4", H(18, 30), 60, "c-10", 2),
    r("r-12", "east-porch", H(8, 30), 90, "c-7", 1, { status: "checkedIn", paid: true, punchesUsed: 1 }),
    r("r-13", "west-porch", H(9, 30), 60, "c-9", 1, { status: "checkedIn", tabOpen: true }),
    r("r-14", "nicklaus", H(15), 120, "c-2", 6, { note: "Corporate outing — wants the long tee mats" }),
    r("r-15", "bay-2", H(19), 90, "c-5", 4, { repeat: "biweekly", seriesId: "s-3" }),
    r("r-16", "bay-5", H(16), 60, "c-1", 2),
];

export const SEED_BLOCKS: Block[] = [
    { id: "b-1", bayId: "bay-5", start: H(13), duration: 120, label: "Projector repair", repeat: "none" },
    { id: "b-2", bayId: "palmer", start: H(18), duration: 180, label: "League night setup", repeat: "weekly", seriesId: "s-4" },
];

/* -------------------------------------------------------------------------- */
/*  Guards                                                                    */
/* -------------------------------------------------------------------------- */

/** Cancelled and no-show bookings give their time back. */
export const holdsTime = (res: Reservation) => res.status === "booked" || res.status === "checkedIn";

const overlaps = (aStart: number, aDur: number, bStart: number, bDur: number) => aStart < bStart + bDur && bStart < aStart + aDur;

/** An overlap is refused outright: there's no override for two parties in one bay. */
export const conflictFor = (
    reservations: Reservation[],
    blocks: Block[],
    draft: { bayId: string; start: number; duration: number; id?: string },
): { kind: "reservation"; with: Reservation } | { kind: "block"; with: Block } | undefined => {
    const clash = reservations.find(
        (x) => x.id !== draft.id && x.bayId === draft.bayId && holdsTime(x) && overlaps(draft.start, draft.duration, x.start, x.duration),
    );
    if (clash) return { kind: "reservation", with: clash };
    const blocked = blocks.find((b) => b.id !== draft.id && b.bayId === draft.bayId && overlaps(draft.start, draft.duration, b.start, b.duration));
    return blocked ? { kind: "block", with: blocked } : undefined;
};

/** Bookings per golfer per day. A no-show still counts; a cancellation doesn't. Staff can override. */
export const DAILY_LIMIT = 2;

export const bookingsToday = (reservations: Reservation[], customerId: string, exceptId?: string) =>
    reservations.filter((x) => x.customerId === customerId && x.id !== exceptId && x.status !== "cancelled");

/** Where a booking sits on the sheet's half-hour grid. */
export const slots = () => {
    const out: number[] = [];
    for (let t = DAY_START; t < DAY_END; t += SLOT) out.push(t);
    return out;
};

export const DURATIONS = [30, 60, 90, 120, 150, 180, 240];

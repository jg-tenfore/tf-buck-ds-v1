/**
 * Sagamore Spring Golf Club — booking domain content.
 *
 * A single source of truth for the tee-time booking experience: course facts,
 * green-fee rates, add-ons, a deterministic tee-time generator, and sample
 * bookings. Keep UI components pure and feed them from here so the experience
 * stays consistent and easy to evolve.
 */

export const course = {
    name: "Sagamore Spring Golf Club",
    shortName: "Sagamore Spring",
    address: "1287 Main St, Lynnfield, MA 01940",
    city: "Lynnfield, MA",
    phone: "(781) 334-3151",
    holes: 18,
    par: 70,
    yards: 5936,
    type: "Public · 18 holes",
    established: 1928,
} as const;

export type HoleCount = 9 | 18;
export type Ride = "walking" | "cart";
export type DayType = "weekday" | "weekend";
export type TimeOfDay = "morning" | "midday" | "twilight";

/** Per-player green fees in USD. Representative public-course pricing. */
export const rates: Record<HoleCount, Record<DayType, Record<Ride, number>>> = {
    18: {
        weekday: { walking: 44, cart: 62 },
        weekend: { walking: 52, cart: 70 },
    },
    9: {
        weekday: { walking: 26, cart: 35 },
        weekend: { walking: 30, cart: 39 },
    },
};

/** Twilight (after 3 PM) is a flat discounted rate per player, cart included. */
export const twilightRate: Record<HoleCount, number> = { 18: 32, 9: 22 };

export interface AddOn {
    id: string;
    label: string;
    description: string;
    /** Price in USD; `per` clarifies the unit. */
    price: number;
    per: "rider" | "round" | "player";
}

export const addOns: AddOn[] = [
    { id: "cart", label: "Golf cart", description: "Shared riding cart for the round", price: 18, per: "rider" },
    { id: "rental-clubs", label: "Club rental", description: "Premium rental set with bag", price: 35, per: "player" },
    { id: "range", label: "Range balls", description: "Warm up on the practice range", price: 8, per: "player" },
    { id: "push-cart", label: "Push cart", description: "Walking trolley for your bag", price: 7, per: "player" },
];

export interface TeeTime {
    id: string;
    /** Display label, e.g. "7:10 AM". */
    label: string;
    /** Minutes since midnight, for sorting/grouping. */
    minutes: number;
    timeOfDay: TimeOfDay;
    /** Per-player price for 18 holes riding on this slot. */
    price: number;
    /** Open spots remaining (1–4). */
    spotsAvailable: number;
}

const pad = (n: number) => n.toString().padStart(2, "0");

const formatTime = (minutes: number): string => {
    const h24 = Math.floor(minutes / 60);
    const m = minutes % 60;
    const period = h24 < 12 ? "AM" : "PM";
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return `${h12}:${pad(m)} ${period}`;
};

const timeOfDayFor = (minutes: number): TimeOfDay => {
    if (minutes < 11 * 60) return "morning";
    if (minutes < 15 * 60) return "midday";
    return "twilight";
};

/**
 * Deterministically generate the day's tee sheet (no randomness, so stories and
 * SSR stay stable). Slots run 6:40 AM → 6:00 PM at 10-minute intervals. Price
 * follows the day type, with twilight slots discounted; availability varies by
 * slot in a fixed pattern.
 */
export function generateTeeTimes(dayType: DayType = "weekday"): TeeTime[] {
    const start = 6 * 60 + 40;
    const end = 18 * 60;
    const step = 10;
    const slots: TeeTime[] = [];

    for (let minutes = start, i = 0; minutes <= end; minutes += step, i++) {
        const timeOfDay = timeOfDayFor(minutes);
        const base = rates[18][dayType].cart;
        const price = timeOfDay === "twilight" ? twilightRate[18] : base;
        // Fixed availability pattern: most slots open, some partially booked, a few full.
        const cycle = i % 7;
        const spotsAvailable = cycle === 3 ? 0 : cycle === 5 ? 1 : cycle === 1 ? 2 : 4;

        slots.push({
            id: `t-${pad(Math.floor(minutes / 60))}${pad(minutes % 60)}`,
            label: formatTime(minutes),
            minutes,
            timeOfDay,
            price,
            spotsAvailable,
        });
    }

    return slots;
}

/** Tee times grouped into the three booking windows, full slots filtered out. */
export function groupTeeTimes(dayType: DayType = "weekday"): Record<TimeOfDay, TeeTime[]> {
    const groups: Record<TimeOfDay, TeeTime[]> = { morning: [], midday: [], twilight: [] };
    for (const slot of generateTeeTimes(dayType)) {
        if (slot.spotsAvailable > 0) groups[slot.timeOfDay].push(slot);
    }
    return groups;
}

export const timeOfDayLabels: Record<TimeOfDay, string> = {
    morning: "Morning",
    midday: "Midday",
    twilight: "Twilight",
};

export interface PlayerProfile {
    name: string;
    initials: string;
    avatarSrc?: string;
}

export interface Booking {
    id: string;
    /** Human date, e.g. "Sat, Jun 21". */
    dateLabel: string;
    timeLabel: string;
    holes: HoleCount;
    players: number;
    ride: Ride;
    /** Total price in USD for the party. */
    total: number;
    status: "upcoming" | "completed" | "cancelled";
    organizer: PlayerProfile;
}

/** Sample bookings for the "My rounds" experience. */
export const sampleBookings: Booking[] = [
    {
        id: "b-1042",
        dateLabel: "Sat, Jun 21",
        timeLabel: "7:10 AM",
        holes: 18,
        players: 4,
        ride: "cart",
        total: 280,
        status: "upcoming",
        organizer: { name: "Olivia Rhye", initials: "OR" },
    },
    {
        id: "b-1036",
        dateLabel: "Wed, Jun 18",
        timeLabel: "4:40 PM",
        holes: 9,
        players: 2,
        ride: "walking",
        total: 52,
        status: "upcoming",
        organizer: { name: "Olivia Rhye", initials: "OR" },
    },
    {
        id: "b-0987",
        dateLabel: "Sun, Jun 8",
        timeLabel: "8:30 AM",
        holes: 18,
        players: 3,
        ride: "cart",
        total: 210,
        status: "completed",
        organizer: { name: "Olivia Rhye", initials: "OR" },
    },
    {
        id: "b-0942",
        dateLabel: "Sat, May 31",
        timeLabel: "9:00 AM",
        holes: 18,
        players: 4,
        ride: "cart",
        total: 280,
        status: "completed",
        organizer: { name: "Olivia Rhye", initials: "OR" },
    },
];

/** Format a USD amount with no decimals (e.g. 62 → "$62"). */
export const formatPrice = (usd: number): string => `$${usd.toLocaleString("en-US")}`;

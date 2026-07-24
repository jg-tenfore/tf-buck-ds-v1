/**
 * Sagamore Events catalog — the "shop all" experience applied to golf events.
 * Five event concepts (scrambles, clinics, chip-&-putt contests, a Rally-for-the-
 * Cure charity series, and leagues/nights) populate a card grid, a details page,
 * and a monthly calendar. Dated across July–August 2026; imagery is the golf photo
 * set served at `events-images/`. Prices/ratings/capacities are synthesized.
 */

export type EventConcept = "scramble" | "clinic" | "contest" | "charity" | "league";

export interface GolfEvent {
    id: string;
    title: string;
    concept: EventConcept;
    /** ISO date for calendar placement + sorting, e.g. "2026-07-08". */
    isoDate: string;
    /** Display date, e.g. "Wed, Jul 8, 2026". */
    date: string;
    /** Display time, e.g. "5:30 PM" or "11:30 AM – 2:00 PM". */
    time: string;
    /** Accent line on the card (host / organizer). */
    presenter: string;
    /** On-property location, e.g. "Learning Center". */
    location: string;
    /** Play format, e.g. "4-person scramble". */
    format: string;
    /** Instructor — shown for clinics. */
    host?: string;
    /** Eligibility, e.g. "Ages 7–12". */
    ageGroup?: string;
    /** Recurring-series note, e.g. "8-week league". */
    series?: string;
    /** Event image served via `events-images/`. */
    image: string;
    /** Long description for the details page. */
    description: string;
    /** "What's included" bullets for the details page. */
    included: string[];
    price: number;
    priceUnit: string;
    spotsLeft: number;
    capacity: number;
    rating: number;
    reviews: number;
    charity?: boolean;
    featured?: boolean;
}

export const CONCEPTS: { key: EventConcept; label: string }[] = [
    { key: "scramble", label: "Scrambles" },
    { key: "clinic", label: "Clinics" },
    { key: "contest", label: "Chip & Putt" },
    { key: "charity", label: "Charity" },
    { key: "league", label: "Leagues & Nights" },
];

const img = (n: number) => `events-images/event-${n}.png`;

export const GOLF_EVENTS: GolfEvent[] = [
    // ---- Clinics ---------------------------------------------------------
    {
        id: "clinic-short-game",
        title: "Short Game Clinic with PGA Pro Mike Doucette",
        concept: "clinic",
        isoDate: "2026-07-08",
        date: "Wed, Jul 8, 2026",
        time: "5:30 PM – 7:00 PM",
        presenter: "Mike Doucette, PGA",
        location: "Learning Center",
        format: "Small-group clinic",
        host: "Mike Doucette, PGA",
        image: img(7),
        description:
            "Sharpen the scoring end of your game in a focused 90-minute session with Sagamore's Head PGA Professional. We cover chipping, pitching, and greenside bunker technique, with hands-on reps and individual feedback on the short-game practice area.",
        included: ["90 minutes of PGA instruction", "Small groups (max 16)", "Range & short-game balls", "Post-session practice plan"],
        price: 40,
        priceUnit: "per player",
        spotsLeft: 4,
        capacity: 16,
        rating: 4.9,
        reviews: 61,
    },
    {
        id: "clinic-driver-distance",
        title: "Driver Distance Clinic",
        concept: "clinic",
        isoDate: "2026-07-16",
        date: "Thu, Jul 16, 2026",
        time: "6:00 PM – 7:00 PM",
        presenter: "Sarah Lin, PGA",
        location: "Practice Range",
        format: "Range clinic",
        host: "Sarah Lin, PGA",
        image: img(3),
        description:
            "Add yards off the tee. This one-hour range clinic breaks down setup, sequencing, and launch conditions, with launch-monitor numbers so you can see the gains in real time.",
        included: ["60 minutes of PGA instruction", "Launch-monitor feedback", "Range balls", "Take-home swing notes"],
        price: 35,
        priceUnit: "per player",
        spotsLeft: 10,
        capacity: 20,
        rating: 4.7,
        reviews: 38,
    },
    {
        id: "clinic-junior-academy",
        title: "Junior Golf Academy",
        concept: "clinic",
        isoDate: "2026-07-11",
        date: "Sat, Jul 11, 2026",
        time: "9:00 AM – 10:30 AM",
        presenter: "Mike Doucette, PGA",
        location: "Learning Center",
        format: "Youth instruction series",
        host: "Mike Doucette, PGA",
        ageGroup: "Ages 8–14",
        series: "4 Saturdays",
        image: img(1),
        description:
            "A four-week Saturday series that builds fundamentals — full swing, short game, and on-course etiquette — in a fun, supportive environment for junior golfers ages 8 to 14.",
        included: ["4 weekly 90-min sessions", "PGA-certified coaches", "All equipment provided", "End-of-series scramble"],
        price: 180,
        priceUnit: "per junior",
        spotsLeft: 12,
        capacity: 24,
        rating: 4.8,
        reviews: 44,
    },
    {
        id: "clinic-putting-lab",
        title: "Putting Lab: Read Greens Like a Pro",
        concept: "clinic",
        isoDate: "2026-07-21",
        date: "Tue, Jul 21, 2026",
        time: "5:00 PM – 6:15 PM",
        presenter: "Sarah Lin, PGA",
        location: "Practice Green",
        format: "Green-reading clinic",
        host: "Sarah Lin, PGA",
        image: img(4),
        description:
            "Lower your scores from the fringe in. Learn a repeatable green-reading routine, speed control drills, and start-line fundamentals on Sagamore's championship putting surface.",
        included: ["75 minutes of PGA instruction", "Putting-path & speed drills", "Practice green access", "Personalized routine"],
        price: 45,
        priceUnit: "per player",
        spotsLeft: 8,
        capacity: 12,
        rating: 4.6,
        reviews: 29,
    },
    {
        id: "clinic-bunker-play",
        title: "Bunker Play Clinic",
        concept: "clinic",
        isoDate: "2026-08-04",
        date: "Tue, Aug 4, 2026",
        time: "6:00 PM – 7:15 PM",
        presenter: "Sarah Lin, PGA",
        location: "Practice Facility",
        format: "Short-game clinic",
        host: "Sarah Lin, PGA",
        image: img(4),
        description:
            "Escape the sand with confidence. This clinic covers setup, technique, and shot selection from greenside and fairway bunkers, with plenty of supervised reps in the practice bunker.",
        included: ["75 minutes of PGA instruction", "Practice-bunker access", "Range & bunker balls", "Take-home drills"],
        price: 45,
        priceUnit: "per player",
        spotsLeft: 9,
        capacity: 14,
        rating: 4.7,
        reviews: 31,
    },
    {
        id: "clinic-playing-lessons",
        title: "Playing Lessons: On-Course Strategy",
        concept: "clinic",
        isoDate: "2026-08-09",
        date: "Sun, Aug 9, 2026",
        time: "1:00 PM – 3:00 PM",
        presenter: "Mike Doucette, PGA",
        location: "Championship Course",
        format: "On-course playing lesson",
        host: "Mike Doucette, PGA",
        image: img(2),
        description:
            "Take your range game to the course. Play holes alongside a PGA pro who coaches course management, shot selection, and on-course decision-making in real time.",
        included: ["2 hours on course with a PGA pro", "Cart included", "Strategy & scoring guidance", "Personalized game plan"],
        price: 85,
        priceUnit: "per player",
        spotsLeft: 4,
        capacity: 6,
        rating: 4.9,
        reviews: 22,
    },

    // ---- Scrambles -------------------------------------------------------
    {
        id: "scramble-twilight-9",
        title: "Twilight 9-Hole Scramble",
        concept: "scramble",
        isoDate: "2026-07-10",
        date: "Fri, Jul 10, 2026",
        time: "4:30 PM shotgun",
        presenter: "Sagamore Golf Club",
        location: "1st Tee",
        format: "2-person scramble",
        image: img(6),
        description:
            "An easygoing Friday-evening 9-hole scramble to close out the week. Grab a partner, play the front nine at twilight, and stick around for drinks and prizes on the patio.",
        included: ["9 holes, cart included", "2-person scramble format", "Range access before play", "Patio drink & prizes"],
        price: 45,
        priceUnit: "per player",
        spotsLeft: 6,
        capacity: 40,
        rating: 4.5,
        reviews: 54,
    },
    {
        id: "scramble-sunrise-skins",
        title: "Sunrise Skins Scramble",
        concept: "scramble",
        isoDate: "2026-07-19",
        date: "Sun, Jul 19, 2026",
        time: "7:00 AM shotgun",
        presenter: "Sagamore Golf Club",
        location: "Championship Course",
        format: "4-person scramble",
        image: img(5),
        description:
            "Beat the heat with an early-morning skins game. Foursomes compete for the pot hole-by-hole across all 18, with breakfast sandwiches at the turn.",
        included: ["18 holes, cart included", "Skins game entry", "Breakfast at the turn", "Closest-to-pin contests"],
        price: 95,
        priceUnit: "per player",
        spotsLeft: 0,
        capacity: 72,
        rating: 4.6,
        reviews: 73,
    },
    {
        id: "scramble-summer-kickoff",
        title: "Summer Kickoff 4-Person Scramble",
        concept: "scramble",
        isoDate: "2026-07-25",
        date: "Sat, Jul 25, 2026",
        time: "8:00 AM shotgun",
        presenter: "Sagamore Golf Club",
        location: "Championship Course",
        format: "4-person scramble",
        image: img(2),
        description:
            "Our marquee summer scramble. Build a foursome and play a full 18-hole shotgun with contests on every par 3, followed by lunch and an awards ceremony in the clubhouse.",
        included: ["18 holes, cart included", "Contests & on-course games", "Lunch + awards ceremony", "Tee gift for every player"],
        price: 120,
        priceUnit: "per player",
        spotsLeft: 24,
        capacity: 72,
        rating: 4.7,
        reviews: 86,
        featured: true,
    },
    {
        id: "scramble-member-guest",
        title: "Member-Guest Invitational Scramble",
        concept: "scramble",
        isoDate: "2026-08-08",
        date: "Sat, Aug 8, 2026",
        time: "9:00 AM shotgun",
        presenter: "Sagamore Golf Club",
        location: "Championship Course",
        format: "4-person scramble",
        image: img(5),
        description:
            "Bring your guests for Sagamore's signature member-guest. A festive 18-hole shotgun with a flighted format, on-course hospitality stations, and a clubhouse reception to finish.",
        included: ["18 holes, cart included", "Flighted scramble format", "On-course hospitality", "Clubhouse reception"],
        price: 160,
        priceUnit: "per team",
        spotsLeft: 40,
        capacity: 72,
        rating: 4.8,
        reviews: 112,
    },

    // ---- Chip & Putt contests (age groups) -------------------------------
    {
        id: "contest-junior-cp",
        title: "Junior Chip & Putt Championship",
        concept: "contest",
        isoDate: "2026-08-01",
        date: "Sat, Aug 1, 2026",
        time: "10:00 AM",
        presenter: "Sagamore Golf Club",
        location: "Practice Green",
        format: "Chip & putt contest",
        ageGroup: "Ages 7–12",
        image: img(1),
        description:
            "A friendly chipping-and-putting contest for our youngest golfers. Kids rotate through skill stations and compete for medals, with a snack and a photo on the 18th green.",
        included: ["Chip & putt stations", "Medals for top finishers", "Snacks & drinks", "Green-side photo"],
        price: 20,
        priceUnit: "per player",
        spotsLeft: 22,
        capacity: 48,
        rating: 4.7,
        reviews: 51,
    },
    {
        id: "contest-teen-cp",
        title: "Teen Chip & Putt Shootout",
        concept: "contest",
        isoDate: "2026-08-01",
        date: "Sat, Aug 1, 2026",
        time: "1:00 PM",
        presenter: "Sagamore Golf Club",
        location: "Practice Green",
        format: "Chip & putt contest",
        ageGroup: "Ages 13–17",
        image: img(4),
        description:
            "A bracket-style chip-and-putt shootout for teens. Advance through rounds of closest-to-pin and make-the-putt challenges to reach the final on the practice green.",
        included: ["Bracket shootout format", "Prizes for finalists", "Drinks & snacks", "Leaderboard & awards"],
        price: 25,
        priceUnit: "per player",
        spotsLeft: 16,
        capacity: 32,
        rating: 4.5,
        reviews: 33,
    },
    {
        id: "contest-adult-cp",
        title: "Adult Chip & Putt Open",
        concept: "contest",
        isoDate: "2026-08-02",
        date: "Sun, Aug 2, 2026",
        time: "11:00 AM",
        presenter: "Sagamore Golf Club",
        location: "Practice Green",
        format: "Chip & putt contest",
        ageGroup: "Ages 18+",
        image: img(4),
        description:
            "Test your touch in the adult chip-and-putt open. Compete across a series of scored stations for gift-shop credit and season bragging rights.",
        included: ["Scored skill stations", "Pro-shop credit for winners", "Beverage ticket", "Awards on the green"],
        price: 30,
        priceUnit: "per player",
        spotsLeft: 9,
        capacity: 32,
        rating: 4.6,
        reviews: 40,
    },
    {
        id: "contest-family-cp",
        title: "Family Chip & Putt",
        concept: "contest",
        isoDate: "2026-08-02",
        date: "Sun, Aug 2, 2026",
        time: "2:00 PM",
        presenter: "Sagamore Golf Club",
        location: "Practice Green",
        format: "Chip & putt contest",
        ageGroup: "All ages",
        image: img(1),
        description:
            "Bring the whole family for an afternoon of chipping and putting games. Teams of up to four play together, with prizes for every age group and ice cream to finish.",
        included: ["Team stations (up to 4)", "Prizes by age group", "Ice-cream social", "Family photo"],
        price: 50,
        priceUnit: "per family",
        spotsLeft: 14,
        capacity: 30,
        rating: 4.9,
        reviews: 58,
    },

    // ---- Charity: Rally for the Cure -------------------------------------
    {
        id: "charity-pink-out",
        title: "Pink Out Women's Scramble",
        concept: "charity",
        isoDate: "2026-08-15",
        date: "Sat, Aug 15, 2026",
        time: "9:00 AM shotgun",
        presenter: "Rally for the Cure",
        location: "Championship Course",
        format: "Women's 4-person scramble",
        image: img(2),
        description:
            "Our signature women's scramble supporting breast cancer research. Play 18 holes in your best pink, enjoy on-course treats, and join the survivor celebration and auction afterward. 100% of proceeds are donated.",
        included: ["18 holes, cart included", "Pink Out tee gift", "On-course refreshments", "Reception, auction & raffle"],
        price: 110,
        priceUnit: "per player",
        spotsLeft: 28,
        capacity: 72,
        rating: 4.9,
        reviews: 97,
        charity: true,
        featured: true,
    },
    {
        id: "charity-putts-for-pink",
        title: "Putts for Pink Putting Contest",
        concept: "charity",
        isoDate: "2026-08-15",
        date: "Sat, Aug 15, 2026",
        time: "1:00 PM",
        presenter: "Rally for the Cure",
        location: "Practice Green",
        format: "Putting contest",
        image: img(4),
        description:
            "A drop-in putting contest to cap off Pink Out day. Sink the long putt for prizes; every entry adds to the day's donation to breast cancer research.",
        included: ["Long-putt contest entry", "Prizes for the leaderboard", "Beverage ticket", "All proceeds donated"],
        price: 15,
        priceUnit: "per player",
        spotsLeft: 30,
        capacity: 60,
        rating: 4.7,
        reviews: 35,
        charity: true,
    },
    {
        id: "charity-rally-9-wine",
        title: "Rally for the Cure — 9 & Wine",
        concept: "charity",
        isoDate: "2026-08-20",
        date: "Thu, Aug 20, 2026",
        time: "4:00 PM shotgun",
        presenter: "Rally for the Cure",
        location: "Front Nine",
        format: "Women's 9-hole scramble",
        image: img(6),
        description:
            "An elegant evening 9 & wine benefiting the cause. Play a relaxed nine, sip featured wines at tasting stations along the course, and finish with a sunset toast on the terrace.",
        included: ["9 holes, cart included", "Wine tasting stations", "Terrace reception", "Donation to research"],
        price: 65,
        priceUnit: "per player",
        spotsLeft: 12,
        capacity: 36,
        rating: 4.8,
        reviews: 46,
        charity: true,
    },

    // ---- Leagues & Nights ------------------------------------------------
    {
        id: "league-9-and-dine",
        title: "Wednesday Night 9 & Dine League",
        concept: "league",
        isoDate: "2026-07-15",
        date: "Wed, Jul 15, 2026",
        time: "5:30 PM",
        presenter: "Sagamore Golf Club",
        location: "The Grill",
        format: "9-hole league + dinner",
        series: "8-week league",
        image: img(6),
        description:
            "A relaxed midweek league that pairs nine holes with a chef's dinner in the Grill. Weekly team play, a running leaderboard, and prizes at the season-ending banquet.",
        included: ["8 weeks of 9-hole play", "Weekly dinner in the Grill", "Season-long leaderboard", "End-of-season banquet"],
        price: 200,
        priceUnit: "per player",
        spotsLeft: 8,
        capacity: 48,
        rating: 4.8,
        reviews: 120,
    },
    {
        id: "league-glow-ball",
        title: "Glow Ball Night Golf",
        concept: "league",
        isoDate: "2026-08-07",
        date: "Fri, Aug 7, 2026",
        time: "8:30 PM shotgun",
        presenter: "Sagamore Golf Club",
        location: "Championship Course",
        format: "9-hole glow scramble",
        image: img(6),
        description:
            "Golf after dark. Play nine holes with glow balls and glowing flagsticks in a party-atmosphere scramble, with music, glow gear, and late-night snacks included.",
        included: ["9 holes under the stars", "Glow balls & glow gear", "Music & late-night snacks", "Prizes for best-lit team"],
        price: 55,
        priceUnit: "per player",
        spotsLeft: 20,
        capacity: 60,
        rating: 4.9,
        reviews: 64,
        featured: true,
    },
    {
        id: "league-couples-twilight",
        title: "Couples Twilight League",
        concept: "league",
        isoDate: "2026-07-23",
        date: "Thu, Jul 23, 2026",
        time: "5:00 PM",
        presenter: "Sagamore Golf Club",
        location: "Front Nine",
        format: "9-hole couples league",
        series: "6-week league",
        image: img(6),
        description:
            "A social couples league over six Thursday evenings. Play a fun nine-hole format with your partner, meet other couples, and enjoy appetizers on the terrace after each round.",
        included: ["6 weeks of couples play", "Weekly terrace appetizers", "Mixers & prizes", "Season finale dinner"],
        price: 150,
        priceUnit: "per couple",
        spotsLeft: 10,
        capacity: 40,
        rating: 4.7,
        reviews: 52,
    },
];

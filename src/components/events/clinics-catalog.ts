/**
 * Sagamore Clinics — the instructor-led subset of the events catalog, enriched
 * with clinic-specific metadata (skill level, focus area, instructor bio,
 * curriculum, prerequisites, and what to bring). Derived from the clinic events in
 * `events-catalog` so the two stay in sync; drives the Clinics list, calendar, and
 * details screens.
 */
import { GOLF_EVENTS, type GolfEvent } from "./events-catalog";

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "All levels";
export type Focus = "Full swing" | "Short game" | "Putting" | "Playing" | "Junior";

export interface ClinicMeta {
    level: SkillLevel;
    focus: Focus;
    instructorInitials: string;
    instructorBio: string;
    /** "What you'll learn" curriculum bullets. */
    learn: string[];
    prerequisites: string;
    /** What to bring. */
    bring: string[];
    /** What the club provides. */
    provided: string[];
}

export interface Clinic extends GolfEvent, ClinicMeta {}

export const FOCUSES: Focus[] = ["Full swing", "Short game", "Putting", "Playing", "Junior"];
export const LEVELS: SkillLevel[] = ["Beginner", "Intermediate", "Advanced", "All levels"];

/** Chip / accent styling per focus area (static classes so Tailwind emits them). */
export const FOCUS_UI: Record<Focus, { bg: string; fg: string; border: string }> = {
    "Full swing": { bg: "bg-utility-orange-50", fg: "text-utility-orange-700", border: "border-utility-orange-500" },
    "Short game": { bg: "bg-utility-green-50", fg: "text-utility-green-700", border: "border-utility-green-500" },
    Putting: { bg: "bg-utility-blue-50", fg: "text-utility-blue-700", border: "border-utility-blue-500" },
    Playing: { bg: "bg-utility-purple-50", fg: "text-utility-purple-700", border: "border-utility-purple-500" },
    Junior: { bg: "bg-utility-pink-50", fg: "text-utility-pink-700", border: "border-utility-pink-500" },
};

/** Badge color per skill level. */
export const LEVEL_COLOR: Record<SkillLevel, "success" | "blue" | "purple" | "gray"> = {
    Beginner: "success",
    Intermediate: "blue",
    Advanced: "purple",
    "All levels": "gray",
};

const BIO_MIKE = "Sagamore's Head PGA Professional — 18 years coaching, PGA-certified in Short Game & Scoring, and a Best-in-State teacher.";
const BIO_SARAH = "PGA Teaching Professional focused on full-swing biomechanics and player development, with a background coaching collegiate golf.";

const META: Record<string, ClinicMeta> = {
    "clinic-short-game": {
        level: "Intermediate",
        focus: "Short game",
        instructorInitials: "MD",
        instructorBio: BIO_MIKE,
        learn: ["Consistent chipping contact & trajectory control", "Pitch-shot distance windows", "Greenside bunker setup & technique", "Reading lies around the green"],
        prerequisites: "Comfortable making contact from a tight lie. Not for absolute beginners.",
        bring: ["Your wedges (56° & 60° helpful)", "Golf shoes", "Water"],
        provided: ["Short-game & range balls", "Loaner wedges on request"],
    },
    "clinic-driver-distance": {
        level: "All levels",
        focus: "Full swing",
        instructorInitials: "SL",
        instructorBio: BIO_SARAH,
        learn: ["Setup & tee height for launch", "Swing sequencing for speed", "Reading launch-monitor numbers", "Simple speed-training drills"],
        prerequisites: "Open to all members — any handicap.",
        bring: ["Your driver", "Golf shoes"],
        provided: ["Launch monitor", "Range balls", "Loaner driver on request"],
    },
    "clinic-junior-academy": {
        level: "Beginner",
        focus: "Junior",
        instructorInitials: "MD",
        instructorBio: BIO_MIKE,
        learn: ["Grip, stance & posture basics", "Full-swing fundamentals", "Putting & chipping games", "On-course etiquette & rules"],
        prerequisites: "Ages 8–14. No experience necessary.",
        bring: ["Junior clubs if owned", "Sneakers or golf shoes", "Water & a hat"],
        provided: ["Junior loaner clubs", "All balls & tees", "End-of-series scramble"],
    },
    "clinic-putting-lab": {
        level: "Intermediate",
        focus: "Putting",
        instructorInitials: "SL",
        instructorBio: BIO_SARAH,
        learn: ["A repeatable green-reading routine", "Speed control & lag putting", "Start-line & face-control drills", "Building a pre-putt routine"],
        prerequisites: "Any handicap; helpful to know your typical miss.",
        bring: ["Your putter", "Golf shoes"],
        provided: ["Practice-green access", "Training aids", "Loaner putter on request"],
    },
    "clinic-bunker-play": {
        level: "Intermediate",
        focus: "Short game",
        instructorInitials: "SL",
        instructorBio: BIO_SARAH,
        learn: ["Open-face setup & bounce", "Greenside splash technique", "Fairway-bunker ball-striking", "Distance control from sand"],
        prerequisites: "Comfortable making a full swing. Some short-game experience helpful.",
        bring: ["Your sand wedge", "Golf shoes"],
        provided: ["Practice-bunker access", "Range & bunker balls"],
    },
    "clinic-playing-lessons": {
        level: "Advanced",
        focus: "Playing",
        instructorInitials: "MD",
        instructorBio: BIO_MIKE,
        learn: ["Course management & strategy", "Shot selection under pressure", "Scoring from 100 yards in", "Managing misses & recovery"],
        prerequisites: "Established handicap; able to play at pace. Best for single-digit to mid handicaps.",
        bring: ["Your full set", "Golf shoes", "Rain gear if wet"],
        provided: ["Cart", "On-course coaching", "Personalized game plan"],
    },
};

export const CLINICS: Clinic[] = GOLF_EVENTS.filter((e) => e.concept === "clinic").map((e) => ({ ...e, ...META[e.id] }));

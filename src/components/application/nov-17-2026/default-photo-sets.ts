import { staticAsset } from "@/utils/static-asset";

/**
 * TenFore's default clinic photo sets (Nov 17, 2026 call). Six generic sets ship
 * with Buck; a course picks one in the clinic template builder, and any template
 * can override it with its own upload. There is no TenFore-logo fallback: a
 * course that never uploads still gets real photos.
 *
 * Each set has three photos per category, so a list of clinics doesn't repeat
 * one picture: `images/clinic-defaults/<set>/<category>.jpg`, `<category>-2.jpg`
 * and `<category>-3.jpg` (1200px wide, 3:2), with 480px copies in `<set>/thumb/`
 * for pickers and small cards. A template's photo is picked from its id, so it
 * stays the same every time the list loads. They're served at
 * `/clinic-default-images/…` by Storybook's staticDirs and the `public/`
 * symlink, and `staticAsset` adds the build's base path (GitHub Pages).
 */

const BASE = "clinic-default-images";

/** What a clinic template is, for picking its photo. */
export type PhotoCategory = "private-lesson" | "group-clinic" | "junior-camp" | "junior-league" | "op-36";

export const PHOTO_CATEGORIES: { id: PhotoCategory; label: string }[] = [
    { id: "private-lesson", label: "Private lesson" },
    { id: "group-clinic", label: "Group clinic" },
    { id: "junior-camp", label: "Junior camp" },
    { id: "junior-league", label: "Junior league" },
    { id: "op-36", label: "Op 36" },
];

export const categoryLabel = (id: PhotoCategory) => PHOTO_CATEGORIES.find((c) => c.id === id)?.label ?? id;

export type PhotoSetId = "morning-parkland" | "bright-range" | "evening-links" | "overcast-classic" | "indoor-studio" | "autumn";

export interface PhotoSet {
    id: PhotoSetId;
    name: string;
    /** One line on the set's look, shown under its name in the picker. */
    mood: string;
    /** Full-size photos per category (1200 × 800), three each. */
    images: Record<PhotoCategory, string[]>;
    /** 480px copies of the same photos, in the same order, for pickers and small cards. */
    thumbs: Record<PhotoCategory, string[]>;
}

/** Photos per category in every set. */
export const PHOTOS_PER_CATEGORY = 3;

const FILE_SUFFIXES = ["", "-2", "-3"];

const paths = (set: PhotoSetId, folder: "" | "thumb/") =>
    Object.fromEntries(
        PHOTO_CATEGORIES.map((c) => [c.id, FILE_SUFFIXES.map((suffix) => staticAsset(`${BASE}/${set}/${folder}${c.id}${suffix}.jpg`))]),
    ) as Record<PhotoCategory, string[]>;

const set = (id: PhotoSetId, name: string, mood: string): PhotoSet => ({ id, name, mood, images: paths(id, ""), thumbs: paths(id, "thumb/") });

export const DEFAULT_PHOTO_SETS: PhotoSet[] = [
    set("morning-parkland", "Morning parkland", "Low sun through tall trees on a quiet tree-lined course."),
    set("bright-range", "Bright range", "Clear blue sky over a covered range and open practice ground."),
    set("evening-links", "Evening links", "Golden-hour light over dunes and tall fescue."),
    set("overcast-classic", "Overcast classic", "Soft grey light under old oaks: calm and timeless."),
    set("indoor-studio", "Indoor studio", "Simulator bays and putting turf, warm wood, any weather."),
    set("autumn", "Autumn", "Orange and gold leaves around the range and greens."),
];

/**
 * The set a course gets before it picks one. Provisional: which set is the
 * TenFore-wide default is still open (see the Nov 17 Summary).
 */
export const TENFORE_DEFAULT_SET: PhotoSetId = "overcast-classic";

export const photoSet = (id: PhotoSetId): PhotoSet => DEFAULT_PHOTO_SETS.find((s) => s.id === id) ?? DEFAULT_PHOTO_SETS[0];

/**
 * Which of a category's three photos a template or clinic gets, from its id, so
 * the pick is stable (not random). Buck's ids are sequential numbers, so the
 * trailing number mod 3 rotates templates made one after another through all
 * three photos; ids without a number fall back to a string hash.
 */
export const photoIndex = (key: string) => {
    const digits = key.match(/(\d+)\D*$/);
    if (digits) return Number(digits[1]) % PHOTOS_PER_CATEGORY;
    let h = 5381;
    for (let i = 0; i < key.length; i++) h = (h * 33 + key.charCodeAt(i)) >>> 0;
    return h % PHOTOS_PER_CATEGORY;
};

/**
 * The default photo for one category in one set. Pass the template's (or
 * clinic's) id as `key` to rotate through the category's photos; without it,
 * the category's first photo.
 */
export const defaultPhoto = (setId: PhotoSetId, category: PhotoCategory, size: "full" | "thumb" = "full", key?: string) => {
    const list = size === "thumb" ? photoSet(setId).thumbs[category] : photoSet(setId).images[category];
    return list[key === undefined ? 0 : photoIndex(key)];
};

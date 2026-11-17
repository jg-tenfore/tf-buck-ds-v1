import type { ReactNode } from "react";
import { ArrowUpRight } from "@untitledui/icons";
import { DEFAULT_PHOTO_SETS, PHOTO_CATEGORIES } from "./default-photo-sets";

const B = ({ children }: { children: ReactNode }) => <strong className="font-semibold text-primary">{children}</strong>;

const StoryLink = ({ id, children }: { id: string; children: ReactNode }) => (
    <a
        href={`./?path=/story/${id}`}
        target="_top"
        className="inline-flex items-center gap-1 font-medium text-brand-secondary hover:text-brand-secondary_hover hover:underline"
    >
        {children}
        <ArrowUpRight aria-hidden="true" className="size-3.5" />
    </a>
);

const Block = ({ title, children }: { title: string; children: ReactNode }) => (
    <section className="flex flex-col gap-2">
        <h2 className="text-md font-semibold text-primary">{title}</h2>
        <div className="flex flex-col gap-2 text-sm leading-relaxed text-secondary">{children}</div>
    </section>
);

const Links = ({ links }: { links: [string, string][] }) => (
    <div className="flex flex-wrap gap-x-4 gap-y-1">
        {links.map(([id, label]) => (
            <StoryLink key={id} id={id}>
                {label}
            </StoryLink>
        ))}
    </div>
);

const S = "nov-17-2026-default-clinic-photos--";

const BUILT: { title: string; body: ReactNode; links: [string, string][] }[] = [
    {
        title: "1 · Six default photo sets",
        body: (
            <>
                Six generic sets, each with <B>three photos</B> for every kind of template (private lesson, group clinic, junior camp, junior league and Op 36):
                15 per set, 90 in all. No TenFore logo anywhere, so two courses on different sets won't look the same. Morning parkland is marked{" "}
                <B>TenFore default</B> for now.
            </>
        ),
        links: [[`${S}picker-default`, "See the sets"]],
    },
    {
        title: "2 · Default photo in the template builder",
        body: (
            <>
                Clinic Templates › Edit template has a new <B>Default photo</B> section under Details: the six sets as cards with a photo per category in a row,
                and the photo this template will get outlined. <B>See all 15 photos</B> opens a set's full grid. The template's <B>Category</B> (in Details)
                picks the column. The set applies to every template, so picking one here changes the whole list.
            </>
        ),
        links: [
            [`${S}picker-default`, "Default set"],
            [`${S}picker-another-set`, "Another set"],
        ],
    },
    {
        title: "3 · Live preview",
        body: "Beside the picker, the template's card as golfers and staff will see it: photo, category, title, ages and price. It changes as soon as a set, the category or the title changes.",
        links: [[`${S}picker-another-set`, "Junior camp on Evening links"]],
    },
    {
        title: "4 · Upload your own photo",
        body: (
            <>
                Under the preview, an upload for this template only. It shows the upload's progress, then the file with <B>Use default</B> (back to the set's
                photo) and <B>Replace</B>. The set stays picked for every other template.
            </>
        ),
        links: [
            [`${S}uploading`, "Uploading"],
            [`${S}own-photo`, "Own photo uploaded"],
        ],
    },
    {
        title: "5 · Template list as cards",
        body: "Clinic Templates as cards, each with its photo. Templates in the same category rotate through the set's three photos, picked from the template's id, so the list doesn't repeat a picture and a template keeps its photo every time. A label on each photo says whether it's the set's or the course's own, and the banner names the set with a Change set button. Edit opens the builder; Save brings the new set back to every card.",
        links: [
            [`${S}template-list`, "Morning parkland"],
            [`${S}template-list-autumn`, "Autumn"],
        ],
    },
];

/** Nov 17, 2026: TenFore's default clinic photos, from the Nov 17 call with Weston and Jared. */
export function Nov17PhotosOverview() {
    return (
        <div className="min-h-screen bg-secondary px-8 py-10">
            <article className="mx-auto flex max-w-3xl flex-col gap-8 rounded-2xl bg-primary p-8 shadow-xs ring-1 ring-secondary">
                <header className="flex flex-col gap-2 border-b border-secondary pb-6">
                    <span className="text-xs font-semibold tracking-wider text-brand-secondary uppercase">Nov 17, 2026 · call with Weston and Jared</span>
                    <h1 className="text-display-xs font-semibold text-primary">Default clinic photos</h1>
                    <p className="text-sm text-tertiary">
                        Weston and Jared liked the photos on MCG's instruction tiles and clinic cards, but most courses will never upload their own. So TenFore
                        ships six default photo sets, a course picks one in the clinic template builder, and any template can still use its own photo.
                    </p>
                </header>

                <Block title="What was asked">
                    <ul className="list-disc pl-5">
                        <li>Ship six generic default photo sets with Buck.</li>
                        <li>A course picks one in the clinic template builder, and can override the photo per clinic or template.</li>
                        <li>No TenFore logo as the fallback: when every shop used it, they all looked the same.</li>
                    </ul>
                </Block>

                <Block title="The six sets">
                    <div className="flex flex-col gap-3">
                        {DEFAULT_PHOTO_SETS.map((s) => (
                            <div key={s.id} className="flex items-center gap-4">
                                <div className="w-36 shrink-0">
                                    <p className="text-sm font-semibold text-primary">{s.name}</p>
                                    <p className="text-xs text-tertiary">{s.mood}</p>
                                </div>
                                <div className="grid flex-1 grid-cols-5 gap-1.5">
                                    {PHOTO_CATEGORIES.map((c) => (
                                        <img
                                            key={c.id}
                                            src={s.thumbs[c.id][0]}
                                            alt={`${s.name}, ${c.label}`}
                                            loading="lazy"
                                            className="aspect-[3/2] w-full rounded-md object-cover ring-1 ring-secondary"
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                        <p className="text-xs text-tertiary">
                            Columns: {PHOTO_CATEGORIES.map((c) => c.label).join(", ")}. The first of each category's three photos.
                        </p>
                    </div>
                </Block>

                <Block title="What was built">
                    <div className="flex flex-col gap-3">
                        {BUILT.map((c) => (
                            <div key={c.title} className="rounded-xl p-4 ring-1 ring-secondary">
                                <p className="font-semibold text-primary">{c.title}</p>
                                <p className="mt-1 text-xs leading-relaxed text-tertiary">{c.body}</p>
                                <div className="mt-2">
                                    <Links links={c.links} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <p>
                        Buck had no clinic template builder yet (only the list in{" "}
                        <StoryLink id="app-screens-instruction--clinic-templates">Full application › Instruction</StoryLink>), so a small one was added:
                        Details, then Default photo. That list is unchanged.
                    </p>
                </Block>

                <Block title="Still open">
                    <ul className="list-disc pl-5">
                        <li>
                            <B>The TenFore-wide default set.</B> Which set a course gets before it picks one. Morning parkland is a placeholder.
                        </li>
                        <li>
                            <B>Can a course mix sets?</B> Built as one set per course, with an own photo per template. The other way is a set per template (or
                            per category), which gives more variety but one more choice on every template.
                        </li>
                        <li>
                            <B>More than three templates in one category.</B> Photos rotate by template id (the id's number mod 3), so a fourth group clinic
                            repeats one of the three. Fine for most courses; a course with many clinics of one kind may want a fourth photo or its own uploads.
                        </li>
                    </ul>
                </Block>
            </article>
        </div>
    );
}

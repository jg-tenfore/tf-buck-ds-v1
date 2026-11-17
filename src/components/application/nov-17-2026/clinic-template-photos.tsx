"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, ChevronDown, ChevronUp, Edit01, FilterLines, Image01, Plus, ReverseLeft, SearchLg, UploadCloud02 } from "@untitledui/icons";
import { Radio as AriaRadio, RadioGroup as AriaRadioGroup } from "react-aria-components";
import { AppShell } from "@/components/application/app-navigation/app-shell";
import { FileUpload, getReadableFileSize } from "@/components/application/file-upload/file-upload-base";
import { SectionCard } from "@/components/application/punch-cards-v2/page-sections";
import { PageHeader } from "@/components/application/screen-kit";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { RadioButtonBase } from "@/components/base/radio-buttons/radio-buttons";
import { NativeSelect } from "@/components/base/select/select-native";
import { cx } from "@/utils/cx";
import { staticAsset } from "@/utils/static-asset";
import {
    DEFAULT_PHOTO_SETS,
    PHOTOS_PER_CATEGORY,
    PHOTO_CATEGORIES,
    type PhotoCategory,
    type PhotoSetId,
    TENFORE_DEFAULT_SET,
    categoryLabel,
    defaultPhoto,
    photoIndex,
    photoSet,
} from "./default-photo-sets";

/**
 * Instruction › Clinic Templates with TenFore's default photo sets (Nov 17, 2026).
 * The course picks one of six sets in the template builder; each template shows
 * the set's photo for its category unless it has its own upload.
 */

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

/** A photo a course uploaded for one template. */
export interface OwnPhoto {
    name: string;
    size: number;
    src: string;
}

/** A photo on its way up: shown in the preview, committed when it reaches 100%. */
export interface PhotoUpload extends OwnPhoto {
    progress: number;
    /** Keep the progress where it is (for a story that shows the upload state). */
    hold?: boolean;
}

export interface PhotoTemplate {
    id: string;
    title: string;
    category: PhotoCategory;
    ageRange: string;
    gender: "Any" | "Men" | "Women";
    price: string;
    live: boolean;
    instances: number;
}

/** The Clinic Templates list (Prototypes › Full application › Instruction), with each template's photo category. */
export const PHOTO_TEMPLATES: PhotoTemplate[] = [
    { id: "t5", title: "Beginner Golfer", category: "group-clinic", ageRange: "0 – 99", gender: "Any", price: "$45.00", live: true, instances: 19 },
    { id: "t6", title: "Driver Clinic", category: "group-clinic", ageRange: "18 – 99", gender: "Any", price: "$60.00", live: true, instances: 71 },
    {
        id: "t7",
        title: "Fall Get Golf Ready — Men's",
        category: "group-clinic",
        ageRange: "18 – 100",
        gender: "Men",
        price: "$55.00",
        live: true,
        instances: 12,
    },
    { id: "t11", title: "Private Lessons — 1 Hour", category: "private-lesson", ageRange: "0 – 99", gender: "Any", price: "$95.00", live: true, instances: 25 },
    { id: "t9", title: "Girls Summer Camp", category: "junior-camp", ageRange: "7 – 16", gender: "Women", price: "$220.00", live: true, instances: 184 },
    { id: "t10", title: "Junior Camp (Age 8–12)", category: "junior-camp", ageRange: "8 – 12", gender: "Any", price: "$185.00", live: true, instances: 8 },
    {
        id: "t13",
        title: "Junior League — Fall Season",
        category: "junior-league",
        ageRange: "9 – 17",
        gender: "Any",
        price: "$150.00",
        live: true,
        instances: 6,
    },
    { id: "t14", title: "Operation 36 — Spring", category: "op-36", ageRange: "5 – 17", gender: "Any", price: "$175.00", live: false, instances: 0 },
];

/** Sagamore's own photo, uploaded on one template, standing in for a course's upload. */
export const SAMPLE_OWN_PHOTO: OwnPhoto = { name: "sagamore-mens-clinic.jpg", size: 2_480_000, src: staticAsset("sagamore-images/Golf-Day-scaled.jpg") };

/** One template in the list has its own photo; the rest use the set. */
export const SAMPLE_OVERRIDES: Record<string, OwnPhoto> = { t7: SAMPLE_OWN_PHOTO };

const CATEGORY_COLOR: Record<PhotoCategory, "brand" | "blue" | "purple" | "indigo" | "orange"> = {
    "private-lesson": "blue",
    "group-clinic": "brand",
    "junior-camp": "purple",
    "junior-league": "indigo",
    "op-36": "orange",
};

/* -------------------------------------------------------------------------- */
/*  Template card                                                             */
/* -------------------------------------------------------------------------- */

/**
 * A template as a card: its photo on top (own upload, or the set's photo for
 * its category), then category, title and the basics. `source` adds a label on
 * the photo saying where it comes from (the list shows it; the preview doesn't).
 */
export const TemplateCard = ({
    template,
    setId,
    own,
    uploading,
    source,
    onEdit,
}: {
    template: PhotoTemplate;
    setId: PhotoSetId;
    own?: OwnPhoto | null;
    uploading?: boolean;
    source?: boolean;
    onEdit?: () => void;
}) => {
    const src = own?.src ?? defaultPhoto(setId, template.category, "full", template.id);
    return (
        <article className="flex flex-col overflow-hidden rounded-xl bg-primary shadow-xs ring-1 ring-secondary">
            <div className="relative aspect-[3/2] bg-secondary">
                <img src={src} alt="" className={cx("size-full object-cover transition duration-100 ease-linear", uploading && "opacity-60")} />
                {source && (
                    <span className="absolute top-3 left-3">
                        <Badge size="sm" type="modern" color="gray">
                            {own ? "Own photo" : `Default · ${photoSet(setId).name}`}
                        </Badge>
                    </span>
                )}
                {uploading && (
                    <span className="absolute top-3 left-3">
                        <Badge size="sm" type="modern" color="gray">
                            Uploading…
                        </Badge>
                    </span>
                )}
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex items-center gap-2">
                    <Badge size="sm" type="pill-color" color={CATEGORY_COLOR[template.category]}>
                        {categoryLabel(template.category)}
                    </Badge>
                    {!template.live && (
                        <Badge size="sm" type="pill-color" color="gray">
                            Draft
                        </Badge>
                    )}
                </div>
                <h3 className="text-md font-semibold text-primary">{template.title || "Untitled template"}</h3>
                <p className="text-sm text-tertiary">
                    Ages {template.ageRange} · {template.gender === "Any" ? "Any gender" : template.gender} · {template.price}
                </p>
            </div>
            {onEdit && (
                <div className="flex items-center justify-between border-t border-secondary px-4 py-3">
                    <span className="text-sm text-tertiary tabular-nums">
                        {template.instances} {template.instances === 1 ? "instance" : "instances"}
                    </span>
                    <Button size="sm" color="secondary" iconLeading={Edit01} onClick={onEdit}>
                        Edit
                    </Button>
                </div>
            )}
        </article>
    );
};

/* -------------------------------------------------------------------------- */
/*  Photo set picker                                                          */
/* -------------------------------------------------------------------------- */

/**
 * The six sets as selectable cards, each with a photo per category in a row
 * (the category's first photo). This template's category is outlined and shows
 * the exact photo it will get, so the card matches the preview. "See all 15
 * photos" opens the set's three photos per category.
 */
export const PhotoSetPicker = ({
    value,
    onChange,
    category,
    templateId,
}: {
    value: PhotoSetId;
    onChange: (id: PhotoSetId) => void;
    category: PhotoCategory;
    /** Picks which of the category's three photos is outlined (the template's own pick). */
    templateId: string;
}) => {
    const [open, setOpen] = useState<PhotoSetId | null>(null);
    const mine = photoIndex(templateId);
    const total = PHOTO_CATEGORIES.length * PHOTOS_PER_CATEGORY;
    return (
        <AriaRadioGroup aria-label="Default photo set" value={value} onChange={(v) => onChange(v as PhotoSetId)} className="flex flex-col gap-3">
            {DEFAULT_PHOTO_SETS.map((s) => {
                const isOpen = open === s.id;
                return (
                    <div
                        key={s.id}
                        className={cx(
                            "flex flex-col rounded-xl ring-1 transition duration-100 ease-linear ring-inset",
                            value === s.id ? "bg-brand-primary_alt ring-2 ring-brand" : "ring-secondary hover:bg-primary_hover",
                        )}
                    >
                        <AriaRadio value={s.id} className="flex cursor-pointer flex-col gap-3 rounded-xl p-4 pb-2 outline-hidden">
                            {({ isSelected, isFocusVisible }) => (
                                <>
                                    <div className="flex items-start gap-3">
                                        <span className="flex min-w-0 flex-1 flex-col">
                                            <span className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-primary">{s.name}</span>
                                                {s.id === TENFORE_DEFAULT_SET && (
                                                    <Badge size="sm" type="pill-color" color="gray">
                                                        TenFore default
                                                    </Badge>
                                                )}
                                            </span>
                                            <span className="text-sm text-tertiary">{s.mood}</span>
                                        </span>
                                        <RadioButtonBase size="md" isSelected={isSelected} isFocusVisible={isFocusVisible} />
                                    </div>
                                    <div className="grid grid-cols-5 gap-2">
                                        {PHOTO_CATEGORIES.map((c) => (
                                            <figure key={c.id} className="flex min-w-0 flex-col gap-1">
                                                <img
                                                    src={s.thumbs[c.id][c.id === category ? mine : 0]}
                                                    alt=""
                                                    loading="lazy"
                                                    className={cx(
                                                        "aspect-[3/2] w-full rounded-md object-cover",
                                                        c.id === category ? "ring-2 ring-brand" : "ring-1 ring-secondary",
                                                    )}
                                                />
                                                <figcaption
                                                    className={cx(
                                                        "truncate text-xs",
                                                        c.id === category ? "font-semibold text-brand-secondary" : "text-tertiary",
                                                    )}
                                                >
                                                    {c.label}
                                                </figcaption>
                                            </figure>
                                        ))}
                                    </div>
                                </>
                            )}
                        </AriaRadio>
                        <div className="flex flex-col gap-3 px-4 pb-3">
                            <Button
                                size="sm"
                                color="link-gray"
                                iconTrailing={isOpen ? ChevronUp : ChevronDown}
                                aria-expanded={isOpen}
                                onClick={() => setOpen(isOpen ? null : s.id)}
                                className="self-start"
                            >
                                {isOpen ? "Hide photos" : `See all ${total} photos`}
                            </Button>
                            {isOpen && (
                                <div className="grid grid-cols-5 gap-2">
                                    {PHOTO_CATEGORIES.map((c) => (
                                        <div key={c.id} className="flex min-w-0 flex-col gap-2">
                                            {s.thumbs[c.id].map((src, i) => (
                                                <img
                                                    key={src}
                                                    src={src}
                                                    alt={`${s.name}, ${c.label} ${i + 1} of ${PHOTOS_PER_CATEGORY}`}
                                                    loading="lazy"
                                                    className={cx(
                                                        "aspect-[3/2] w-full rounded-md object-cover",
                                                        c.id === category && i === mine ? "ring-2 ring-brand" : "ring-1 ring-secondary",
                                                    )}
                                                />
                                            ))}
                                            <span
                                                className={cx("truncate text-xs", c.id === category ? "font-semibold text-brand-secondary" : "text-tertiary")}
                                            >
                                                {c.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </AriaRadioGroup>
    );
};

/* -------------------------------------------------------------------------- */
/*  Own photo: upload, uploading, uploaded                                    */
/* -------------------------------------------------------------------------- */

/**
 * "Upload your own photo" for this one template: a drop zone, then the upload's
 * progress, then the file with Replace and Use default.
 */
export const OwnPhotoField = ({
    own,
    upload,
    onUpload,
    onCancelUpload,
    onUseDefault,
}: {
    own: OwnPhoto | null;
    upload: PhotoUpload | null;
    onUpload: (file: File) => void;
    onCancelUpload: () => void;
    onUseDefault: () => void;
}) => {
    if (upload) {
        return (
            <FileUpload.List>
                <FileUpload.ListItemProgressBar name={upload.name} size={upload.size} progress={upload.progress} type="jpg" onDelete={onCancelUpload} />
            </FileUpload.List>
        );
    }
    if (own) {
        return (
            <div className="flex flex-col gap-3 rounded-xl p-4 ring-1 ring-secondary">
                <div className="flex items-center gap-3">
                    <img src={own.src} alt="" className="aspect-[3/2] w-16 shrink-0 rounded-md object-cover ring-1 ring-secondary" />
                    <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-medium text-secondary">{own.name}</span>
                        <span className="text-sm text-tertiary">{getReadableFileSize(own.size)} · used instead of the set</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" color="secondary" iconLeading={ReverseLeft} onClick={onUseDefault}>
                        Use default
                    </Button>
                    <ReplaceButton onFile={onUpload} />
                </div>
            </div>
        );
    }
    return (
        <FileUpload.DropZone
            accept="image/*"
            allowsMultiple={false}
            hint="JPG or PNG, landscape, at least 1200 × 800"
            onDropFiles={(files) => files[0] && onUpload(files[0])}
        />
    );
};

/** A hidden file input behind a tertiary button, for replacing an uploaded photo. */
const ReplaceButton = ({ onFile }: { onFile: (file: File) => void }) => {
    const input = useRef<HTMLInputElement>(null);
    return (
        <>
            <input
                ref={input}
                type="file"
                accept="image/*"
                tabIndex={-1}
                aria-hidden="true"
                className="sr-only"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onFile(file);
                    e.target.value = "";
                }}
            />
            <Button size="sm" color="tertiary" iconLeading={UploadCloud02} onClick={() => input.current?.click()}>
                Replace
            </Button>
        </>
    );
};

/* -------------------------------------------------------------------------- */
/*  Default photo section                                                     */
/* -------------------------------------------------------------------------- */

/**
 * The "Default photo" section of the template builder: the set picker on the
 * left; on the right, a live preview of this template's card and the upload
 * that overrides the set for this template only.
 */
export const DefaultPhotoSection = ({
    template,
    setId,
    onSetChange,
    own,
    upload,
    onUpload,
    onCancelUpload,
    onUseDefault,
}: {
    template: PhotoTemplate;
    setId: PhotoSetId;
    onSetChange: (id: PhotoSetId) => void;
    own: OwnPhoto | null;
    upload: PhotoUpload | null;
    onUpload: (file: File) => void;
    onCancelUpload: () => void;
    onUseDefault: () => void;
}) => {
    const shown = upload ?? own;
    return (
        <SectionCard title="Default photo" description="Courses that don't upload a photo use this set. You can change it anytime.">
            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-secondary">Photo set</span>
                        <span className="text-sm text-tertiary">
                            One set covers every template. This template is a{" "}
                            <span className="font-medium text-secondary">{categoryLabel(template.category).toLowerCase()}</span>, so it gets the outlined photo
                            (one of the set's three for that category, picked by template).
                            {own && " It has its own photo for now, so the set covers your other templates."}
                        </span>
                    </div>
                    <PhotoSetPicker value={setId} onChange={onSetChange} category={template.category} templateId={template.id} />
                </div>

                <div className="flex flex-col gap-6 lg:sticky lg:top-6">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-semibold text-secondary">Preview</span>
                            <span className="text-sm text-tertiary">How this template's card looks to golfers and in your list.</span>
                        </div>
                        <TemplateCard template={template} setId={setId} own={shown} uploading={Boolean(upload)} />
                        <p className="flex items-center gap-1.5 text-xs text-tertiary">
                            <Image01 className="size-3.5 shrink-0 text-fg-quaternary" aria-hidden="true" />
                            {upload
                                ? `Uploading ${upload.name}`
                                : own
                                  ? `Your photo: ${own.name}`
                                  : `${photoSet(setId).name} · ${categoryLabel(template.category)}`}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-semibold text-secondary">Upload your own photo</span>
                            <span className="text-sm text-tertiary">Used for this template only, instead of the set's photo.</span>
                        </div>
                        <OwnPhotoField own={own} upload={upload} onUpload={onUpload} onCancelUpload={onCancelUpload} onUseDefault={onUseDefault} />
                    </div>
                </div>
            </div>
        </SectionCard>
    );
};

/* -------------------------------------------------------------------------- */
/*  Template builder (create & edit)                                          */
/* -------------------------------------------------------------------------- */

const UPLOAD_STEP_MS = 90;

/**
 * Clinic Templates › Edit template: Details, then Default photo. Save keeps the
 * set (course-wide), the template's category and its own photo; Cancel drops them.
 */
export const ClinicTemplateEditor = ({
    template: initial,
    setId: initialSet,
    own: initialOwn = null,
    upload: initialUpload = null,
    scrollToPhoto = false,
    onSave,
    onCancel,
}: {
    template: PhotoTemplate;
    setId: PhotoSetId;
    own?: OwnPhoto | null;
    upload?: PhotoUpload | null;
    /** Open scrolled to the Default photo section (for stories about the photo). */
    scrollToPhoto?: boolean;
    onSave?: (result: { template: PhotoTemplate; setId: PhotoSetId; own: OwnPhoto | null }) => void;
    onCancel?: () => void;
}) => {
    const [template, setTemplate] = useState(initial);
    const [setId, setSetId] = useState(initialSet);
    const [own, setOwn] = useState<OwnPhoto | null>(initialOwn);
    const [upload, setUpload] = useState<PhotoUpload | null>(initialUpload);
    const photoSection = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollToPhoto) photoSection.current?.scrollIntoView({ block: "start" });
    }, [scrollToPhoto]);

    // Fake the upload: step the progress up, then the photo becomes the template's own.
    useEffect(() => {
        if (!upload || upload.hold) return;
        if (upload.progress >= 100) {
            setOwn({ name: upload.name, size: upload.size, src: upload.src });
            setUpload(null);
            return;
        }
        const t = setTimeout(() => setUpload((u) => (u ? { ...u, progress: Math.min(100, u.progress + 7) } : u)), UPLOAD_STEP_MS);
        return () => clearTimeout(t);
    }, [upload]);

    const patch = (p: Partial<PhotoTemplate>) => setTemplate((t) => ({ ...t, ...p }));

    return (
        <AppShell activeUrl="/instruction/clinics/templates">
            <PageHeader
                title={template.title || "New template"}
                subtitle={
                    <span className="flex items-center gap-1.5">
                        {onCancel ? (
                            <Button color="link-gray" size="sm" iconLeading={ArrowLeft} onClick={onCancel}>
                                Clinic Templates
                            </Button>
                        ) : (
                            "Clinic Templates"
                        )}
                        <span aria-hidden="true">/</span> Edit template
                    </span>
                }
                action={
                    <div className="flex items-center gap-3">
                        <Button size="md" color="secondary" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button size="md" iconLeading={Check} isDisabled={Boolean(upload)} onClick={() => onSave?.({ template, setId, own })}>
                            Save template
                        </Button>
                    </div>
                }
            />
            <div className="flex flex-col gap-6 p-6 lg:p-8">
                <SectionCard title="Details" description="What golfers see when they browse and book.">
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        <Input label="Title" value={template.title} onChange={(v) => patch({ title: v })} className="xl:col-span-2" />
                        <NativeSelect
                            label="Category"
                            hint="Picks the photo from the set."
                            value={template.category}
                            onChange={(e) => patch({ category: e.target.value as PhotoCategory })}
                            options={PHOTO_CATEGORIES.map((c) => ({ value: c.id, label: c.label }))}
                        />
                        <Input label="Price" value={template.price} onChange={(v) => patch({ price: v })} />
                        <Input label="Age range" value={template.ageRange} onChange={(v) => patch({ ageRange: v })} />
                        <NativeSelect
                            label="Gender"
                            value={template.gender}
                            onChange={(e) => patch({ gender: e.target.value as PhotoTemplate["gender"] })}
                            options={["Any", "Men", "Women"].map((g) => ({ value: g, label: g }))}
                        />
                    </div>
                </SectionCard>

                <div ref={photoSection} className="scroll-mt-6">
                    <DefaultPhotoSection
                        template={template}
                        setId={setId}
                        onSetChange={setSetId}
                        own={own}
                        upload={upload}
                        onUpload={(file) => setUpload({ name: file.name, size: file.size, src: URL.createObjectURL(file), progress: 0 })}
                        onCancelUpload={() => setUpload(null)}
                        onUseDefault={() => setOwn(null)}
                    />
                </div>
            </div>
        </AppShell>
    );
};

/* -------------------------------------------------------------------------- */
/*  Template list as cards                                                    */
/* -------------------------------------------------------------------------- */

/** The current set's five photos in a strip, for the banner over the list. */
const SetStrip = ({ setId }: { setId: PhotoSetId }) => (
    <div className="flex shrink-0 gap-1">
        {PHOTO_CATEGORIES.map((c) => (
            <img key={c.id} src={defaultPhoto(setId, c.id, "thumb")} alt="" className="aspect-[3/2] w-12 rounded object-cover ring-1 ring-secondary" />
        ))}
    </div>
);

/**
 * Clinic Templates as cards: every template shows its photo, from the course's
 * set unless it has its own. The banner names the set and opens the builder.
 */
export const ClinicTemplateCards = ({
    templates,
    setId,
    overrides,
    onEdit,
}: {
    templates: PhotoTemplate[];
    setId: PhotoSetId;
    overrides: Record<string, OwnPhoto | undefined>;
    onEdit?: (id: string) => void;
}) => {
    const usingSet = templates.filter((t) => !overrides[t.id]).length;
    return (
        <AppShell activeUrl="/instruction/clinics/templates">
            <PageHeader
                title="Clinic Templates"
                subtitle="Reusable blueprints for clinics, camps, and private lessons at Sagamore."
                action={
                    <Button iconLeading={Plus} size="md">
                        Add template
                    </Button>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                <div className="flex flex-col gap-4 rounded-xl bg-primary p-4 shadow-xs ring-1 ring-secondary md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <SetStrip setId={setId} />
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-primary">Default photos: {photoSet(setId).name}</span>
                            <span className="text-sm text-tertiary">
                                {usingSet} of {templates.length} templates use the set. The others have their own photo.
                            </span>
                        </div>
                    </div>
                    <Button size="sm" color="secondary" onClick={() => onEdit?.(templates[0].id)}>
                        Change set
                    </Button>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Input size="sm" aria-label="Search templates" placeholder="Search by title" icon={SearchLg} wrapperClassName="sm:w-80" />
                    <Button size="sm" color="secondary" iconLeading={FilterLines}>
                        Filters
                    </Button>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                    {templates.map((t) => (
                        <TemplateCard key={t.id} template={t} setId={setId} own={overrides[t.id]} source onEdit={() => onEdit?.(t.id)} />
                    ))}
                </div>
            </div>
        </AppShell>
    );
};

/* -------------------------------------------------------------------------- */
/*  The flow: list ⇄ builder                                                  */
/* -------------------------------------------------------------------------- */

/**
 * The list and the builder together: Edit opens a template, Save brings the
 * new set and photo back to every card.
 */
export const ClinicTemplatePhotos = ({
    initialView = "list",
    templateId = "t5",
    initialSet = TENFORE_DEFAULT_SET,
    initialOverrides = SAMPLE_OVERRIDES,
    initialUpload = null,
    scrollToPhoto = false,
}: {
    initialView?: "list" | "edit";
    templateId?: string;
    initialSet?: PhotoSetId;
    initialOverrides?: Record<string, OwnPhoto | undefined>;
    initialUpload?: PhotoUpload | null;
    /** Open the builder scrolled to Default photo. */
    scrollToPhoto?: boolean;
}) => {
    const [templates, setTemplates] = useState(PHOTO_TEMPLATES);
    const [setId, setSetId] = useState(initialSet);
    const [overrides, setOverrides] = useState(initialOverrides);
    const [editing, setEditing] = useState<string | null>(initialView === "edit" ? templateId : null);

    // Switching between the list and the builder starts at the top, like a new page.
    const go = (id: string | null) => {
        setEditing(id);
        window.scrollTo({ top: 0 });
    };

    const template = editing ? templates.find((t) => t.id === editing) : undefined;
    if (template) {
        return (
            <ClinicTemplateEditor
                key={template.id}
                template={template}
                setId={setId}
                own={overrides[template.id] ?? null}
                upload={editing === templateId ? initialUpload : null}
                scrollToPhoto={scrollToPhoto && editing === templateId}
                onCancel={() => go(null)}
                onSave={(r) => {
                    setTemplates((all) => all.map((t) => (t.id === r.template.id ? r.template : t)));
                    setSetId(r.setId);
                    setOverrides((o) => ({ ...o, [r.template.id]: r.own ?? undefined }));
                    go(null);
                }}
            />
        );
    }
    return <ClinicTemplateCards templates={templates} setId={setId} overrides={overrides} onEdit={go} />;
};

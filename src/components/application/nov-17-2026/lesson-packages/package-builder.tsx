"use client";

import { type ReactNode, useState } from "react";
import { AlertTriangle, ArrowLeft, Check, CheckCircle, CurrencyDollar, InfoCircle, Lock01 } from "@untitledui/icons";
import { Radio as AriaRadio, RadioGroup as AriaRadioGroup } from "react-aria-components";
import { Alert } from "@/components/application/alerts/alert";
import { AppShell } from "@/components/application/app-navigation/app-shell";
import { SectionCard } from "@/components/application/punch-cards-v2/page-sections";
import { PageHeader } from "@/components/application/screen-kit";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { InputNumber } from "@/components/base/input/input-number";
import { RadioButtonBase } from "@/components/base/radio-buttons/radio-buttons";
import { NativeSelect } from "@/components/base/select/select-native";
import { Toggle } from "@/components/base/toggle/toggle";
import { cx } from "@/utils/cx";
import {
    ANY_INSTRUCTOR,
    COURSES,
    CREDIT_TERM,
    DEEP_DISCOUNT_PCT,
    INSTRUCTORS,
    LESSON_TYPES,
    type LessonPackage,
    type PackMath,
    TODAY,
    displayName,
    expiryAfter,
    fmtDate,
    instructorById,
    lessonById,
    mathFor,
    money0,
    moneyExact,
    packLabel,
    singlePrice,
} from "./data";
import { PackCard } from "./pack-card";

/**
 * Instruction › Lesson Packages › New package (or Edit). Staff pick the instructor and the
 * lesson, the number of lessons, and type one number: the pack price. Buck works out the
 * price per lesson and the saving against that instructor's single-lesson price, warns when
 * the pack costs more than singles or the discount is unusually deep, and shows the card
 * golfers will see in Crane. Layout follows the Nov 17 clinic template builder.
 */

/* -------------------------------------------------------------------------- */
/*  Small pieces                                                              */
/* -------------------------------------------------------------------------- */

const FieldHead = ({ title, hint }: { title: string; hint?: ReactNode }) => (
    <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-secondary">{title}</span>
        {hint && <span className="text-sm text-tertiary">{hint}</span>}
    </div>
);

/** A labelled number in a gray tile ("PER LESSON $104 · vs $115 single"). */
const Tile = ({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: ReactNode; tone?: "success" | "error" }) => (
    <div className="flex flex-col gap-1 rounded-lg bg-secondary px-4 py-3.5">
        <span className="text-xs font-semibold tracking-wider text-quaternary uppercase">{label}</span>
        <span
            className={cx(
                "text-xl font-semibold tabular-nums",
                tone === "success" ? "text-success-primary" : tone === "error" ? "text-error-primary" : "text-primary",
            )}
        >
            {value}
        </span>
        {sub && <span className="text-sm text-tertiary">{sub}</span>}
    </div>
);

/** A rule staff can't change here, with why. */
const FixedRule = ({ title, value, hint }: { title: string; value: ReactNode; hint: ReactNode }) => (
    <div className="flex items-start gap-3 rounded-lg p-4 ring-1 ring-secondary ring-inset">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary">
            <Lock01 className="size-4 text-fg-quaternary" aria-hidden="true" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-sm font-semibold text-secondary">{title}</span>
                <span className="text-sm font-medium text-primary">{value}</span>
            </span>
            <span className="text-sm text-tertiary">{hint}</span>
        </div>
    </div>
);

/* -------------------------------------------------------------------------- */
/*  Number of lessons                                                         */
/* -------------------------------------------------------------------------- */

type CountMode = "5" | "10" | "custom";

const COUNT_OPTIONS: { id: CountMode; title: string; hint: string }[] = [
    { id: "5", title: "5 lessons", hint: "The usual pack" },
    { id: "10", title: "10 lessons", hint: "Often the best value" },
    { id: "custom", title: "Custom", hint: "Any number, 2 to 30" },
];

const LessonCount = ({ credits, onChange }: { credits: number; onChange: (n: number) => void }) => {
    const [mode, setMode] = useState<CountMode>(credits === 5 ? "5" : credits === 10 ? "10" : "custom");
    const [custom, setCustom] = useState(credits === 5 || credits === 10 ? 8 : credits);
    return (
        <div className="flex flex-col gap-3">
            <FieldHead title="Number of lessons" hint="Each lesson is one credit in the golfer's wallet." />
            <AriaRadioGroup
                aria-label="Number of lessons"
                value={mode}
                onChange={(v) => {
                    const m = v as CountMode;
                    setMode(m);
                    onChange(m === "custom" ? custom : Number(m));
                }}
                className="grid gap-3 sm:grid-cols-3"
            >
                {COUNT_OPTIONS.map((o) => (
                    <AriaRadio
                        key={o.id}
                        value={o.id}
                        className={({ isSelected }) =>
                            cx(
                                "flex cursor-pointer items-start gap-3 rounded-xl p-4 ring-1 transition duration-100 ease-linear ring-inset",
                                isSelected ? "bg-brand-primary_alt ring-2 ring-brand" : "ring-secondary hover:bg-primary_hover",
                            )
                        }
                    >
                        {({ isSelected, isFocusVisible }) => (
                            <>
                                <span className="flex min-w-0 flex-1 flex-col">
                                    <span className="text-sm font-semibold text-primary">{o.title}</span>
                                    <span className="text-sm text-tertiary">{o.hint}</span>
                                </span>
                                <RadioButtonBase size="md" isSelected={isSelected} isFocusVisible={isFocusVisible} />
                            </>
                        )}
                    </AriaRadio>
                ))}
            </AriaRadioGroup>
            {mode === "custom" && (
                <InputNumber
                    label="Lessons in the pack"
                    orientation="horizontal"
                    size="sm"
                    minValue={2}
                    maxValue={30}
                    value={custom}
                    onChange={(n) => {
                        const v = Number.isNaN(n) ? 2 : n;
                        setCustom(v);
                        onChange(v);
                    }}
                    wrapperClassName="w-40"
                    inputClassName="text-center"
                />
            )}
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*  The calculated panel                                                      */
/* -------------------------------------------------------------------------- */

/** Price per lesson, saving in dollars and percent, and the warning when there is one. */
export const PriceCheck = ({ math, credits, instructorName, lessonName }: { math: PackMath; credits: number; instructorName: string; lessonName: string }) => {
    const below = math.savings >= 0;
    return (
        <div className="flex flex-col gap-3" data-testid="price-check">
            <FieldHead title="Worked out for you" hint={`Against ${credits} single ${lessonName}s with ${instructorName} at ${money0(math.single)} each.`} />
            <div className="grid gap-3 sm:grid-cols-3">
                <Tile label="Per lesson" value={moneyExact(math.perLessonExact)} sub={`vs ${money0(math.single)} single`} />
                <Tile
                    label={below ? "Golfer saves" : "Golfer pays more"}
                    value={money0(Math.abs(math.savings))}
                    sub={`vs ${money0(math.listPrice)} for ${credits} singly`}
                    tone={math.savings > 0 ? "success" : math.savings < 0 ? "error" : undefined}
                />
                <Tile
                    label={math.pct < 0 ? "Markup" : "Discount"}
                    value={`${Math.abs(math.pct)}%`}
                    sub={math.pct > 0 ? "off buying singly" : math.pct < 0 ? "above buying singly" : "same as singly"}
                    tone={math.warning === "deep-discount" ? "error" : math.pct > 0 ? "success" : math.pct < 0 ? "error" : undefined}
                />
            </div>
            {math.warning === "above-singles" && (
                <Alert color="error" icon={AlertTriangle} title="This pack costs more than booking the lessons one at a time">
                    {credits} singles would cost {money0(math.listPrice)}, so golfers would pay {money0(-math.savings)} more for the pack (
                    {moneyExact(math.perLessonExact)} a lesson against {money0(math.single)}). Price it under {money0(math.listPrice)} so the pack saves
                    something, or keep it as a draft.
                </Alert>
            )}
            {math.warning === "deep-discount" && (
                <Alert color="warning" icon={AlertTriangle} title={`That's ${math.pct}% off, more than the usual ${DEEP_DISCOUNT_PCT}%`}>
                    Golfers would pay {moneyExact(math.perLessonExact)} a lesson against {money0(math.single)}. Check the price before publishing; most packs
                    save 8–15%.
                </Alert>
            )}
            {!math.warning && math.savings === 0 && (
                <Alert color="gray" icon={InfoCircle} title="No saving">
                    The pack costs the same as {credits} singles. Golfers won't see a saving on the card.
                </Alert>
            )}
            {!math.warning && math.savings > 0 && (
                <p className="flex items-center gap-2 rounded-lg bg-success-primary px-4 py-3 text-sm text-success-primary">
                    <CheckCircle className="size-4 shrink-0 text-fg-success-secondary" aria-hidden="true" />
                    Golfers save {money0(math.savings)} ({math.pct}%) and see {money0(math.perLesson)} per lesson on the card.
                </p>
            )}
            {!Number.isInteger(math.perLessonExact) && (
                <p className="text-xs text-tertiary">
                    {moneyExact(math.perLessonExact)} a lesson shows to golfers as {money0(math.perLesson)}, rounded to the dollar like every price on the card.
                </p>
            )}
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*  The builder                                                               */
/* -------------------------------------------------------------------------- */

const BADGES = ["", "Best value", "Most popular"];

export const PackageBuilder = ({
    initial,
    editing = false,
    onCancel,
    onSave,
}: {
    initial: LessonPackage;
    /** Editing a pack that exists (title and buttons change, and sold packs keep their terms). */
    editing?: boolean;
    onCancel?: () => void;
    onSave?: (pack: LessonPackage) => void;
}) => {
    const [pack, setPack] = useState<LessonPackage>(initial);
    const [priceText, setPriceText] = useState(initial.price ? String(initial.price) : "");
    const patch = (p: Partial<LessonPackage>) => setPack((cur) => ({ ...cur, ...p }));

    const instructor = instructorById(pack.instructorId);
    const lesson = lessonById(pack.lessonId);
    const single = singlePrice(instructor, lesson);
    const math = mathFor(pack);
    const priced = pack.price > 0;
    const isAny = instructor.id === ANY_INSTRUCTOR.id;
    const canSave = priced && pack.courseIds.length > 0;
    const exampleExpiry = fmtDate(expiryAfter(TODAY));

    const title = editing ? `${instructor.name} · ${packLabel(pack)}` : "New lesson package";

    return (
        <AppShell activeUrl="/instruction">
            <PageHeader
                title={title}
                badge={
                    <Badge size="sm" type="pill-color" color={pack.status === "active" ? "success" : "gray"}>
                        {pack.status === "active" ? "Active" : "Draft"}
                    </Badge>
                }
                subtitle={
                    <span className="flex items-center gap-1.5">
                        {onCancel ? (
                            <Button color="link-gray" size="sm" iconLeading={ArrowLeft} onClick={onCancel}>
                                Lesson Packages
                            </Button>
                        ) : (
                            "Lesson Packages"
                        )}
                        <span aria-hidden="true">/</span> {editing ? "Edit package" : "New package"}
                    </span>
                }
                action={
                    <div className="flex items-center gap-3">
                        <Button size="md" color="secondary" onClick={onCancel}>
                            Cancel
                        </Button>
                        {pack.status === "draft" && (
                            <Button size="md" color="secondary" isDisabled={!canSave} onClick={() => onSave?.({ ...pack, status: "draft" })}>
                                Save as draft
                            </Button>
                        )}
                        <Button size="md" iconLeading={Check} isDisabled={!canSave} onClick={() => onSave?.({ ...pack, status: "active" })}>
                            {pack.status === "active" ? "Save changes" : "Publish package"}
                        </Button>
                    </div>
                }
            />

            <div className="grid items-start gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-8">
                <div className="flex min-w-0 flex-col gap-6">
                    {editing && pack.sold > 0 && (
                        <Alert color="gray" icon={InfoCircle} title={`${pack.sold} golfers have bought this pack`}>
                            Changes apply to new purchases. Golfers who already bought it keep the price, courses and expiry they bought.
                        </Alert>
                    )}

                    <SectionCard title="Instructor & lesson" description="Who teaches the lessons, and which lesson each credit pays for.">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <NativeSelect
                                label="Instructor"
                                hint={isAny ? "Golfers can spend a credit with any academy instructor, at the Academy rate." : instructor.title}
                                value={pack.instructorId}
                                onChange={(e) => {
                                    const next = instructorById(e.target.value);
                                    patch({ instructorId: next.id, courseIds: next.courseIds });
                                }}
                                options={[
                                    { value: ANY_INSTRUCTOR.id, label: "Any academy instructor" },
                                    ...INSTRUCTORS.map((i) => ({ value: i.id, label: displayName(i) })),
                                ]}
                            />
                            <NativeSelect
                                label="Lesson type"
                                hint={`${isAny ? "The Academy rate" : `${instructor.name}'s price`} for one ${lesson.name}: ${money0(single)}.`}
                                value={pack.lessonId}
                                onChange={(e) => patch({ lessonId: e.target.value })}
                                options={LESSON_TYPES.map((l) => ({ value: l.id, label: `${l.name} · ${money0(singlePrice(instructor, l))}` }))}
                            />
                        </div>
                    </SectionCard>

                    <SectionCard title="Lessons & price" description="Pick how many lessons, then type the pack price. Buck works out the rest.">
                        <LessonCount credits={pack.credits} onChange={(credits) => patch({ credits })} />
                        <div className="flex flex-col gap-1.5 border-t border-secondary pt-5">
                            <Input
                                label="Pack price"
                                icon={CurrencyDollar}
                                placeholder="0"
                                inputMode="decimal"
                                value={priceText}
                                onChange={(v) => {
                                    const clean = v.replace(/[^0-9.]/g, "");
                                    setPriceText(clean);
                                    patch({ price: Number(clean) || 0 });
                                }}
                                hint={`What the golfer pays for all ${pack.credits}. ${pack.credits} singles cost ${money0(math.listPrice)}.`}
                                wrapperClassName="sm:w-60"
                            />
                        </div>
                        {priced ? (
                            <PriceCheck math={math} credits={pack.credits} instructorName={isAny ? "the Academy" : instructor.name} lessonName={lesson.name} />
                        ) : (
                            <p className="rounded-lg bg-secondary px-4 py-6 text-center text-sm text-tertiary">
                                Type a pack price to see the price per lesson and the saving.
                            </p>
                        )}
                    </SectionCard>

                    <SectionCard
                        title="Courses"
                        description={
                            isAny
                                ? "Where golfers can spend a credit."
                                : `Where golfers can spend a credit. ${instructor.name} teaches at ${instructor.courseIds.length === 1 ? "one course" : `${instructor.courseIds.length} courses`}, so the others are off.`
                        }
                        aside={
                            <span className="pt-1 text-sm whitespace-nowrap text-tertiary tabular-nums">
                                {pack.courseIds.length} of {COURSES.length}
                            </span>
                        }
                    >
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {COURSES.map((c) => {
                                const teaches = instructor.courseIds.includes(c.id);
                                return (
                                    <Checkbox
                                        key={c.id}
                                        size="md"
                                        label={c.name}
                                        isDisabled={!teaches}
                                        isSelected={pack.courseIds.includes(c.id)}
                                        onChange={(on) => patch({ courseIds: on ? [...pack.courseIds, c.id] : pack.courseIds.filter((id) => id !== c.id) })}
                                    />
                                );
                            })}
                        </div>
                        {pack.courseIds.length === 0 && <p className="text-sm text-error-primary">Pick at least one course.</p>}
                    </SectionCard>

                    <SectionCard title="Terms" description="How credits from this pack can be used.">
                        <div className="flex flex-col gap-3">
                            <FixedRule
                                title="Expiry"
                                value={CREDIT_TERM}
                                hint={
                                    <>
                                        Each pack gets its own date. Bought today, it would expire on{" "}
                                        <span className="font-medium text-secondary">{exampleExpiry}</span>. Admins can extend one golfer's pack from their
                                        lesson credits.
                                    </>
                                }
                            />
                            <FixedRule
                                title="One golfer per credit"
                                value="1 credit = 1 lesson for 1 golfer"
                                hint="A credit pays for one golfer's lesson. A second golfer joining the lesson pays separately."
                            />
                            <FixedRule
                                title="Cancelling and moving"
                                value="24-hour rule"
                                hint="Golfers who cancel at least 24 hours ahead get the credit back; later than that, it's spent. Only instructors can move a lesson."
                            />
                        </div>
                        <div className="grid gap-5 border-t border-secondary pt-5 sm:grid-cols-2">
                            <div className="min-w-0 rounded-lg p-4 ring-1 ring-secondary ring-inset">
                                <Toggle
                                    size="md"
                                    label="Transferable between golfers"
                                    hint="Off: only the buyer can use them."
                                    isSelected={pack.transferable}
                                    onChange={(transferable) => patch({ transferable })}
                                />
                            </div>
                            <NativeSelect
                                label="Badge on the card"
                                hint="Optional. Crane shows it on 10-packs."
                                value={pack.badge ?? ""}
                                onChange={(e) => patch({ badge: e.target.value || undefined })}
                                options={BADGES.map((b) => ({ value: b, label: b || "None" }))}
                            />
                        </div>
                    </SectionCard>
                </div>

                <aside className="flex flex-col gap-3 lg:sticky lg:top-6">
                    <FieldHead title="Preview" hint="The card golfers see under Packages & credits." />
                    <PackCard pack={pack} className="shadow-xs" />
                    <p className="text-xs text-tertiary">
                        {pack.status === "active" ? "On sale online." : "A draft: golfers don't see it until it's published."}{" "}
                        {math.warning === "above-singles" && priced ? "No saving shows, since the pack costs more than singles." : ""}
                    </p>
                </aside>
            </div>
        </AppShell>
    );
};

import type { FC, ReactNode } from "react";
import { Calendar, Users01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { cx } from "@/utils/cx";
import { CREDIT_TERM, type Instructor, type LessonPackage, courseName, instructorById, lessonById, mathFor, money0, packLabel } from "./data";

/**
 * The golfer-facing pack card, as Crane Web shows it in Instruction › Packages & credits
 * (tf-crane-ds-v1 `packages/pack-card.tsx`, the `full` variant): instructor, badge and saving,
 * the pack with one dot per credit, courses, expiry and transfer terms, then the price and the
 * price per lesson. The builder's live preview, so staff see exactly what golfers will.
 */

/** One dot per lesson credit: filled = still available. */
export const CreditDots = ({ total, remaining, size = "md", muted }: { total: number; remaining: number; size?: "sm" | "md"; muted?: boolean }) => (
    <span className="flex flex-wrap items-center gap-1.5" role="img" aria-label={`${remaining} of ${total} lesson credits remaining`}>
        {Array.from({ length: total }, (_, i) => (
            <span
                key={i}
                className={cx(
                    "shrink-0 rounded-full",
                    size === "sm" ? "size-2.5" : "size-3",
                    i < remaining ? (muted ? "bg-fg-quaternary" : "bg-fg-brand-primary") : "bg-primary ring-1 ring-primary ring-inset",
                )}
            />
        ))}
    </span>
);

/** Instructor initials in a circle (Crane shows the Academy headshot here). */
export const CoachAvatar = ({ instructor, size = "md", className }: { instructor: Instructor; size?: "sm" | "md"; className?: string }) => (
    <span
        aria-hidden="true"
        className={cx(
            "flex shrink-0 items-center justify-center rounded-full bg-brand-solid font-semibold text-white",
            size === "sm" ? "size-9 text-xs" : "size-12 text-sm",
            className,
        )}
    >
        {instructor.initials}
    </span>
);

/** A course as a chip, the way every Academy screen names an MCG course. */
export const CourseChip = ({ id }: { id: string }) => (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary py-1 pr-3 pl-1 ring-1 ring-secondary ring-inset">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-tertiary ring-1 ring-secondary">
            {courseName(id).replace(/^The /, "")[0]}
        </span>
        <span className="text-xs font-semibold text-secondary">{courseName(id)}</span>
    </span>
);

/** Icon + text ("Expires 1 year after purchase"). */
export const MetaLine = ({ icon: Icon, children }: { icon: FC<{ className?: string }>; children: ReactNode }) => (
    <span className="flex items-center gap-1.5 text-sm text-tertiary">
        <Icon className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
        {children}
    </span>
);

export const PackCard = ({ pack, className }: { pack: LessonPackage; className?: string }) => {
    const instructor = instructorById(pack.instructorId);
    const lesson = lessonById(pack.lessonId);
    const math = mathFor(pack);
    const priced = pack.price > 0;
    return (
        <article className={cx("flex flex-col gap-4 rounded-xl bg-primary p-5 ring-1 ring-secondary ring-inset", className)}>
            <div className="flex items-start gap-3.5">
                <CoachAvatar instructor={instructor} />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-md font-semibold text-primary">{instructor.name}</span>
                    <span className="truncate text-sm text-tertiary">{instructor.title}</span>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                    {pack.badge && (
                        <Badge size="sm" type="color" color="brand">
                            {pack.badge}
                        </Badge>
                    )}
                    {priced && math.savings > 0 && (
                        <Badge size="sm" type="pill-color" color="success">
                            Save {money0(math.savings)}
                        </Badge>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2 rounded-lg bg-secondary px-4 py-3.5">
                <span className="text-md font-semibold text-primary">{packLabel(pack)}</span>
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <CreditDots total={Math.min(pack.credits, 20)} remaining={Math.min(pack.credits, 20)} />
                    <span className="text-xs text-tertiary">{lesson.plural}</span>
                </span>
            </div>

            {pack.courseIds.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {pack.courseIds.map((id) => (
                        <CourseChip key={id} id={id} />
                    ))}
                </div>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <MetaLine icon={Calendar}>Expires {CREDIT_TERM}</MetaLine>
                <MetaLine icon={Users01}>{pack.transferable ? "Transferable" : "Non-transferable"}</MetaLine>
            </div>

            <div className="mt-auto flex items-end justify-between gap-3 border-t border-secondary pt-3.5">
                <div className="flex flex-col">
                    <span className="text-xl font-semibold text-primary tabular-nums">{priced ? money0(pack.price) : "$—"}</span>
                    <span className="text-xs text-tertiary tabular-nums">{priced ? `${money0(math.perLesson)} per lesson` : "Enter a pack price"}</span>
                </div>
                <span className="text-sm font-semibold text-brand-secondary">View</span>
            </div>
        </article>
    );
};

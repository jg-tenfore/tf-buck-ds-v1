"use client";

import { useState } from "react";
import { Edit01, Plus, SearchLg } from "@untitledui/icons";
import { AppShell } from "@/components/application/app-navigation/app-shell";
import { BalanceStrip } from "@/components/application/credits-oct-27/kit";
import { TableCard, Td, Th, clickableRow } from "@/components/application/migration-v2/kit";
import { PageHeader } from "@/components/application/screen-kit";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { NativeSelect } from "@/components/base/select/select-native";
import { cx } from "@/utils/cx";
import { ANY_INSTRUCTOR, INSTRUCTORS, type LessonPackage, courseName, instructorById, lessonById, mathFor, money0, packLabel } from "./data";
import { CoachAvatar } from "./pack-card";

/**
 * Instruction › Lesson Packages: every pack, with what Buck worked out (price per lesson and
 * saving), its status and how many have sold. A row opens the builder.
 */
export const PackagesList = ({
    packages,
    onNew,
    onEdit,
    savedMessage,
}: {
    packages: LessonPackage[];
    onNew?: () => void;
    onEdit?: (id: string) => void;
    /** "Mike Kenny · 5 × 45-Minute Private published." after a save. */
    savedMessage?: string | null;
}) => {
    const [query, setQuery] = useState("");
    const [instructor, setInstructor] = useState("all");
    const [status, setStatus] = useState("all");

    const q = query.trim().toLowerCase();
    const rows = packages.filter((p) => {
        const who = instructorById(p.instructorId).name;
        if (q && !`${who} ${packLabel(p)}`.toLowerCase().includes(q)) return false;
        if (instructor !== "all" && p.instructorId !== instructor) return false;
        if (status !== "all" && p.status !== status) return false;
        return true;
    });

    const active = packages.filter((p) => p.status === "active");
    const sold = packages.reduce((n, p) => n + p.sold, 0);
    const revenue = packages.reduce((n, p) => n + p.sold * p.price, 0);

    return (
        <AppShell activeUrl="/instruction/lesson-packages">
            <PageHeader
                title="Lesson Packages"
                subtitle="Packs of lesson credits: golfers buy them now and book the lessons one at a time. Only admins create and change packs."
                action={
                    <Button iconLeading={Plus} size="md" onClick={onNew}>
                        New package
                    </Button>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                {savedMessage && (
                    <div role="status" className="rounded-xl bg-success-primary px-4 py-3 text-sm text-primary ring-1 ring-fg-success-secondary ring-inset">
                        {savedMessage}
                    </div>
                )}

                <BalanceStrip
                    items={[
                        { label: "Active packages", value: String(active.length) },
                        { label: "Drafts", value: String(packages.length - active.length) },
                        { label: "Packs sold", value: String(sold) },
                        { label: "Sales to date", value: money0(revenue), strong: true },
                    ]}
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <Input
                        size="sm"
                        aria-label="Search packages"
                        placeholder="Search by instructor or lesson"
                        icon={SearchLg}
                        value={query}
                        onChange={setQuery}
                        wrapperClassName="sm:w-80"
                    />
                    <NativeSelect
                        aria-label="Instructor"
                        size="sm"
                        value={instructor}
                        onChange={(e) => setInstructor(e.target.value)}
                        options={[
                            { value: "all", label: "All instructors" },
                            { value: ANY_INSTRUCTOR.id, label: ANY_INSTRUCTOR.name },
                            ...INSTRUCTORS.filter((i) => packages.some((p) => p.instructorId === i.id)).map((i) => ({ value: i.id, label: i.name })),
                        ]}
                        className="sm:w-56"
                    />
                    <NativeSelect
                        aria-label="Status"
                        size="sm"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        options={[
                            { value: "all", label: "Active and drafts" },
                            { value: "active", label: "Active" },
                            { value: "draft", label: "Drafts" },
                        ]}
                        className="sm:w-44"
                    />
                    <span className="text-sm whitespace-nowrap text-tertiary sm:ml-auto">
                        {rows.length} of {packages.length} packages
                    </span>
                </div>

                <TableCard>
                    <thead>
                        <tr>
                            <Th>Instructor</Th>
                            <Th>Package</Th>
                            <Th className="text-right">Lessons</Th>
                            <Th className="text-right">Price</Th>
                            <Th className="text-right">Per lesson</Th>
                            <Th className="text-right">Saves</Th>
                            <Th>Courses</Th>
                            <Th>Status</Th>
                            <Th className="text-right">Sold</Th>
                            <Th>
                                <span className="sr-only">Actions</span>
                            </Th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((p) => {
                            const who = instructorById(p.instructorId);
                            const math = mathFor(p);
                            return (
                                <tr key={p.id} {...clickableRow(() => onEdit?.(p.id))} className="cursor-pointer hover:bg-primary_hover">
                                    <Td>
                                        <span className="flex items-center gap-3">
                                            <CoachAvatar instructor={who} size="sm" />
                                            <span className="flex flex-col">
                                                <span className="font-medium text-primary">{who.name}</span>
                                                {who.id === ANY_INSTRUCTOR.id && <span className="text-xs text-tertiary">Academy-wide</span>}
                                            </span>
                                        </span>
                                    </Td>
                                    <Td>
                                        <span className="flex flex-col items-start gap-1">
                                            <span className="font-medium text-primary">{lessonById(p.lessonId).name}</span>
                                            {p.badge && (
                                                <Badge size="sm" type="color" color="brand">
                                                    {p.badge}
                                                </Badge>
                                            )}
                                        </span>
                                    </Td>
                                    <Td className="text-right tabular-nums">{p.credits}</Td>
                                    <Td className="text-right font-semibold tabular-nums">{money0(p.price)}</Td>
                                    <Td className="text-right tabular-nums">
                                        {money0(math.perLesson)}
                                        <span className="ml-1.5 text-xs text-quaternary line-through">{money0(math.single)}</span>
                                    </Td>
                                    <Td className={cx("text-right tabular-nums", math.savings > 0 ? "text-success-primary" : "text-error-primary")}>
                                        {money0(math.savings)} <span className="text-xs">({math.pct}%)</span>
                                    </Td>
                                    <Td className="text-secondary">
                                        {p.courseIds.length > 2 ? `${p.courseIds.length} courses` : p.courseIds.map(courseName).join(", ")}
                                    </Td>
                                    <Td>
                                        <Badge size="sm" type="pill-color" color={p.status === "active" ? "success" : "gray"}>
                                            {p.status === "active" ? "Active" : "Draft"}
                                        </Badge>
                                    </Td>
                                    <Td className="text-right tabular-nums">{p.sold}</Td>
                                    <Td className="text-right">
                                        <Button
                                            size="sm"
                                            color="tertiary"
                                            iconLeading={Edit01}
                                            aria-label={`Edit ${who.name} ${packLabel(p)}`}
                                            onClick={() => onEdit?.(p.id)}
                                        />
                                    </Td>
                                </tr>
                            );
                        })}
                        {rows.length === 0 && (
                            <tr>
                                <Td colSpan={10} className="py-8 text-center text-tertiary">
                                    No packages match. Clear the search or filters.
                                </Td>
                            </tr>
                        )}
                    </tbody>
                </TableCard>
                <p className="text-xs text-tertiary">
                    Per lesson and Saves are worked out from each instructor's single-lesson price (struck through). Golfers see the same numbers on the pack
                    card.
                </p>
            </div>
        </AppShell>
    );
};

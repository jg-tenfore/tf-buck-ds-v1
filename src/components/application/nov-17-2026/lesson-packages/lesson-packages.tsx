"use client";

import { useState } from "react";
import { type LessonPackage, NEW_PACKAGE, PACKAGES, instructorById, packLabel } from "./data";
import { PackageBuilder } from "./package-builder";
import { PackagesList } from "./packages-list";

export { CustomerCredits } from "./customer-credits";

/**
 * Instruction › Lesson Packages as one flow: the list, New package, and a row to edit. Save
 * (draft or publish) brings the pack back to the list.
 */
export const LessonPackages = ({
    initialView = "list",
    draft = NEW_PACKAGE,
    editId,
}: {
    initialView?: "list" | "new" | "edit";
    /** What New package starts with (stories prefill it as if staff had typed it). */
    draft?: LessonPackage;
    /** The pack Edit opens on. */
    editId?: string;
}) => {
    const [packages, setPackages] = useState(PACKAGES);
    const [open, setOpen] = useState<{ pack: LessonPackage; editing: boolean } | null>(() => {
        if (initialView === "new") return { pack: draft, editing: false };
        const found = editId ? PACKAGES.find((p) => p.id === editId) : undefined;
        return initialView === "edit" && found ? { pack: found, editing: true } : null;
    });
    const [message, setMessage] = useState<string | null>(null);

    // Switching between the list and the builder starts at the top, like a new page.
    const go = (next: typeof open) => {
        setOpen(next);
        window.scrollTo({ top: 0 });
    };

    if (open) {
        return (
            <PackageBuilder
                key={open.pack.id}
                initial={open.pack}
                editing={open.editing}
                onCancel={() => go(null)}
                onSave={(saved) => {
                    const id = saved.id === "new" ? `${saved.instructorId}--pack-${saved.credits}-${packages.length}` : saved.id;
                    const pack = { ...saved, id };
                    setPackages((all) => (all.some((p) => p.id === id) ? all.map((p) => (p.id === id ? pack : p)) : [pack, ...all]));
                    setMessage(
                        `${instructorById(pack.instructorId).name} · ${packLabel(pack)} ${pack.status === "active" ? "is on sale" : "saved as a draft"}.`,
                    );
                    go(null);
                }}
            />
        );
    }
    return (
        <PackagesList
            packages={packages}
            savedMessage={message}
            onNew={() => go({ pack: NEW_PACKAGE, editing: false })}
            onEdit={(id) => {
                const pack = packages.find((p) => p.id === id);
                if (pack) go({ pack, editing: true });
            }}
        />
    );
};

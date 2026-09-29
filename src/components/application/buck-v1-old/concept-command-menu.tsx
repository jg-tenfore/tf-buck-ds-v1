"use client";

import { ConceptSwitcher } from "./concept-shell";
import { BuckV1OldCourseSettings } from "./course-settings-page";
import { SettingsCommandBar } from "./settings-command-bar";

/**
 * Concept 3 — Command menu.
 *
 * The original screen, untouched, with one addition: a big search bar pinned
 * above it. Results drop down grouped (Sections / Settings / Records) with
 * breadcrumb paths, plus an "Ask TenFore AI" row; choosing one opens the
 * right accordion and points at the setting.
 */
export const ConceptCommandMenu = ({ conceptPath }: { conceptPath?: string }) => (
    <BuckV1OldCourseSettings
        header={
            <>
                {conceptPath && <ConceptSwitcher current={conceptPath} />}
                <div className="sticky top-18 z-30 border-b border-secondary bg-secondary px-4 py-4 lg:px-8">
                    <SettingsCommandBar />
                </div>
            </>
        }
    />
);

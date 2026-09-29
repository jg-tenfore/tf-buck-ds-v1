import type { ComponentType } from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConceptCommandMenu } from "@/components/application/buck-v1-old/concept-command-menu";
import { ConceptRelayout } from "@/components/application/buck-v1-old/concept-relayout";
import { ConceptSearch } from "@/components/application/buck-v1-old/concept-search";
import { ConceptSearchDialog } from "@/components/application/buck-v1-old/concept-search-dialog";
import { BuckV1OldCourseSettings } from "@/components/application/buck-v1-old/course-settings-page";
import "./app.css";

/**
 * Entry point for the "Buck V1 Old — Course Settings" prototype (port 6020).
 *
 *   /                              the legacy screen, rebuilt as-is
 *   /concept-1-relayout            sections redesigned case by case
 *   /concept-2-search              dynamic search (dim or hide what doesn't match)
 *   /concept-3-command-menu        original screen + a big command-menu search bar
 *   /concept-4-search-dialog       concept 1's layout + concept 3's search as a dialog
 */
const ROUTES: Record<string, ComponentType<{ conceptPath?: string }>> = {
    "/concept-1-relayout": ConceptRelayout,
    "/concept-2-search": ConceptSearch,
    "/concept-3-command-menu": ConceptCommandMenu,
    "/concept-4-search-dialog": ConceptSearchDialog,
};

const path = window.location.pathname.replace(/\/+$/, "") || "/";
const Page = ROUTES[path];

const container = document.getElementById("root");
if (!container) throw new Error("Root container #root not found");

createRoot(container).render(
    <StrictMode>
        <div className="font-body text-primary antialiased">{Page ? <Page conceptPath={path} /> : <BuckV1OldCourseSettings />}</div>
    </StrictMode>,
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrototypeApp } from "@/components/application/prototype/prototype-app";
import "./app.css";

/**
 * Entry point for the standalone Tenfore app. Mounts the clickable prototype —
 * the same `PrototypeApp` documented in Storybook — as a real, self-contained
 * web app. `PrototypeApp` supplies its own React-Aria RouterProvider, so nav
 * clicks and ⌘K drive the app without any router wiring here.
 */
const container = document.getElementById("root");
if (!container) throw new Error("Root container #root not found");

createRoot(container).render(
    <StrictMode>
        <div className="font-body text-primary antialiased">
            <PrototypeApp />
        </div>
    </StrictMode>,
);

import { createContext } from "react";

/**
 * True when a screen is being rendered inside the clickable {@link PrototypeApp}
 * rather than as a standalone story. The app provides a single shared shell
 * (sidebar + command menu), so `AppShell` reads this and collapses to just its
 * children when nested — avoiding a second, duplicate sidebar.
 */
export const PrototypeContext = createContext(false);

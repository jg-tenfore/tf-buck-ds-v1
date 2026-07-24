import type { Preview } from "@storybook/nextjs-vite";
import { RouterProvider } from "react-aria-components";

// Load the full Untitled UI + Tailwind v4 pipeline (theme.css carries the Buck
// palette, ported from the Fox design system) so every story renders on-brand.
import "../src/styles/globals.css";

const preview: Preview = {
    parameters: {
        layout: "centered",
        options: {
            storySort: {
                method: "alphabetical",
                order: [
                    "Introduction",
                    "Foundations",
                    "Components",
                    ["Actions", "Forms", "Feedback & Status", "Layout & Structure", "Charts & Data", "Media & Visuals", "Navigation"],
                    "App Chrome",
                    "App Screens",
                    [
                        "Dashboard",
                        "My Golf Course",
                        "Company",
                        "Orders",
                        "Reports",
                        "Golf",
                        "Simulator Bays",
                        "Activities",
                        "Instruction",
                        "F & B",
                        "Customers",
                        "Employees",
                        "Membership",
                        "Products",
                        "Inventory",
                        "Events",
                        "Bays (beta)",
                        "Marketing",
                        "Admin",
                    ],
                    "Sign in ∕ Sign up",
                    ["Sign up", "Log in", "Forgot password", "Verification"],
                ],
            },
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        a11y: {
            // 'todo' - show a11y violations in the test UI only
            // 'error' - fail CI on a11y violations
            // 'off' - skip a11y checks entirely
            test: "todo",
        },
        backgrounds: {
            options: {
                paper: { name: "Paper", value: "#ffffff" },
                canvas: { name: "Canvas", value: "#fafafa" },
                ink: { name: "Ink", value: "#161616" },
            },
        },
    },
    initialGlobals: {
        backgrounds: { value: "paper" },
    },
    decorators: [
        // Intercept react-aria link navigation so clicking links inside stories
        // (e.g. sidebar nav items) doesn't navigate the preview iframe to a
        // non-existent route and hit Next.js's Not Found page.
        (Story) => (
            <RouterProvider navigate={() => {}}>
                <div className="font-body text-primary antialiased">
                    <Story />
                </div>
            </RouterProvider>
        ),
    ],
};

export default preview;

import type { Preview } from "@storybook/nextjs-vite";

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
                    ["Actions", "Forms", "Feedback & Status", "Layout & Structure", "Media & Visuals", "Navigation"],
                    "Sign in ∕ Sign up",
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
        (Story) => (
            <div className="font-body text-primary antialiased">
                <Story />
            </div>
        ),
    ],
};

export default preview;

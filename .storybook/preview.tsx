import type { Preview } from "@storybook/nextjs-vite";
import { RouterProvider } from "react-aria-components";
// Load the full Buck design-system + Tailwind v4 pipeline (theme.css carries the
// Buck palette, ported from the Fox design system) so every story renders on-brand.
import "../src/styles/globals.css";

const preview: Preview = {
    parameters: {
        layout: "centered",
        options: {
            // The sidebar has six folders, in this order:
            //   Start Here    – what Buck is, the style guide, process & roadmap, how to review.
            //   Prototypes    – the clickable product: the full application plus each feature area.
            //   Design System – styles, components, app chrome and account login.
            //   Reviews       – one folder per review round, newest first, each opening on a Summary.
            //   Research      – today's Buck as shipped (Migration V2) and the nav proposal.
            //   Archive       – superseded explorations, kept for reference (collapsed; see manager.ts).
            // Every story keeps its pre-regroup id (each file sets `id`), so shared links still open.
            // Moved MDX docs pages are redirected by static/legacy-redirects.js.
            storySort: {
                method: "alphabetical",
                order: [
                    "Start Here",
                    ["Overview", "Style guide", "Process & roadmap", "How to review"],
                    "Prototypes",
                    [
                        "Full application",
                        [
                            "Screen index",
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
                        "Credits",
                        ["Gift Cards", "Rain Checks", "Payment Sources", "Punch Cards (Customer Cards)", "Credit Books"],
                        "Products",
                        [
                            "Products",
                            ["List", "*"],
                            "Combos",
                            ["List", "*"],
                            "Price Stickers",
                            ["Star", "Star · product picked", "Dymo", "Avery 5160", "*"],
                            "Product Groups",
                            ["List", "*"],
                            "Menus",
                            ["List", "*"],
                            "Rewards",
                            ["Products", "Tee fees", "Transportation"],
                            "Modifiers",
                            ["Modifiers", "Modifier groups", "*"],
                            "Discount Types",
                            ["List", "*"],
                            "Punch Cards",
                            ["List", "*"],
                        ],
                        "Simulator Bays",
                        ["Bay Sheet", ["A · Bay columns", "B · Tee sheet rows", "Fewer bays, wider columns", "*"]],
                        "Instruction",
                        [
                            "Lesson Packages",
                            [
                                "Builder · new 5-pack",
                                "Builder · 10-pack",
                                "Builder · price above singles",
                                "Builder · deep discount",
                                "Packages list",
                                "Customer credits",
                                "Extend-expiry dialog",
                                "Apply a credit dialog",
                                "*",
                            ],
                            "Default Clinic Photos",
                            ["Picker · default set", "Picker · another set", "Custom photo uploaded", "Uploading a photo", "Template list", "*"],
                        ],
                        "Punch Cards",
                        ["Customer Punch Cards", "Punch Card Products", ["List", "Create & Edit", ["Full Flow (3A)", "Add Item Steps", "Page Sections"]]],
                        "Course Settings",
                        ["Original", "Concepts"],
                        "MCG Feedback Fixes",
                    ],
                    "Design System",
                    [
                        "Styles",
                        ["Colors", "Typography", "Icons", "Logos", "Effect Styles", "Radius", "Border", "Spacing", "Data Visualization"],
                        "Components",
                        [
                            "Actions",
                            "Forms",
                            // Time Picker sits with the other date and time fields; the rest stay alphabetical.
                            ["Calendar", "Checkbox", "Date Picker", "Date Time Picker", "Date Selector", "Time Picker", "*"],
                            "Feedback & Status",
                            "Layout & Structure",
                            "Charts & Data",
                            "Media & Visuals",
                            "Navigation",
                        ],
                        "App Chrome",
                        ["Global Nav", "Command Menu"],
                        "Account Login",
                        ["Sign up", "Log in", "Forgot password", "Verification"],
                    ],
                    "Reviews",
                    [
                        "Nov 17 · Lesson packages (punch-card style)",
                        ["Summary", "*"],
                        "Nov 17 · Default clinic photos",
                        ["Summary", "*"],
                        "Nov 17 · Bay sheet & feedback",
                        ["Summary", "*"],
                        "Nov 11 · Bay sheet & feedback",
                        ["Summary", "Bay Sheet (Nov 11)", ["A · Bay columns", "B · Tee sheet rows", "*"], "*"],
                        "Oct 27 · Products",
                        ["Summary", "*"],
                        "Oct 27 · Credits",
                        ["Summary", "*"],
                        "Oct 27 · Punch cards",
                        ["Summary", "*"],
                    ],
                    "Research",
                    [
                        "Today's Buck (Migration V2)",
                        ["Global Nav", "Punch Cards", "Credit Books", "Charges", "Payments", "History", "Combined Report", "Combined Revenue"],
                        "Nav Proposal",
                    ],
                    "Archive",
                    [
                        "About the archive",
                        "Early explorations",
                        "Migration V2 Ideas",
                        ["Punch Cards", "Credit Books", "Charges", "Payments", "History", "Combined Report", "Combined Revenue"],
                        "Punch Card explorations",
                        "*",
                    ],
                    "*",
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

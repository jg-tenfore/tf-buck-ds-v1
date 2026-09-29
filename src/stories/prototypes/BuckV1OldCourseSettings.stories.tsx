import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BuckV1OldCourseSettings, CourseSettingsPage } from "@/components/application/buck-v1-old/course-settings-page";

/**
 * Rebuild of the legacy Golf Course Settings screen (The Dunes of Delgado PROD)
 * on the Buck design system — the foundation for new settings concepts. Also
 * runs as its own local: `npm run proto:course-settings` → http://localhost:6020.
 */
const meta = {
    title: "Prototypes/Buck V1 Old – Course Settings/Original",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Full screen: recreated legacy sidebar + top bar around the settings page. */
export const FullScreen: Story = {
    name: "Full screen",
    render: () => <BuckV1OldCourseSettings />,
};

/** Just the settings page (header + 17 accordion sections), without the legacy chrome. */
export const SettingsPageOnly: Story = {
    name: "Settings page only",
    render: () => (
        <div className="min-h-screen bg-secondary">
            <CourseSettingsPage />
        </div>
    ),
};

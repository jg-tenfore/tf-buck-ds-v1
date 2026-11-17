import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ClinicTemplatePhotos, SAMPLE_OWN_PHOTO } from "@/components/application/nov-17-2026/clinic-template-photos";

/**
 * Instruction › Clinic Templates with TenFore's six default photo sets, from the
 * Nov 17 call. The course picks a set in the template builder (Default photo);
 * any template can use its own upload instead. Every story is the same flow:
 * Edit opens the builder, Save brings the set and photo back to the list.
 */
const meta = {
    title: "Prototypes/Instruction/Default Clinic Photos",
    id: "nov-17-2026-default-clinic-photos",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Beginner Golfer (a group clinic) on the set every course starts with. */
export const PickerDefault: Story = {
    name: "Picker · default set",
    render: () => <ClinicTemplatePhotos initialView="edit" templateId="t5" initialSet="overcast-classic" />,
};

/** Junior Camp (Age 8–12) with Evening links picked: the preview follows the pick. */
export const PickerAnotherSet: Story = {
    name: "Picker · another set",
    render: () => <ClinicTemplatePhotos initialView="edit" templateId="t10" initialSet="evening-links" scrollToPhoto />,
};

/** Fall Get Golf Ready — Men's with Sagamore's own photo. Use default puts the set's photo back. */
export const OwnPhoto: Story = {
    name: "Custom photo uploaded",
    render: () => <ClinicTemplatePhotos initialView="edit" templateId="t7" initialSet="overcast-classic" scrollToPhoto />,
};

/** Private Lessons with a photo part-way up (held at 64% for review). */
export const Uploading: Story = {
    name: "Uploading a photo",
    render: () => (
        <ClinicTemplatePhotos
            initialView="edit"
            templateId="t11"
            initialSet="bright-range"
            scrollToPhoto
            initialUpload={{ ...SAMPLE_OWN_PHOTO, name: "private-lesson-range.jpg", progress: 64, hold: true }}
        />
    ),
};

/** Clinic Templates as cards: seven use the set's photos (rotating through its three per category), one has its own. */
export const TemplateList: Story = {
    name: "Template list",
    render: () => <ClinicTemplatePhotos initialView="list" initialSet="overcast-classic" />,
};

/** The same list after the course switches to Autumn. */
export const TemplateListAutumn: Story = {
    name: "Template list · Autumn",
    render: () => <ClinicTemplatePhotos initialView="list" initialSet="autumn" />,
};

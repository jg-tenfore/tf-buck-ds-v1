import { getLocalTimeZone, toCalendarDateTime, today } from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DateTimePicker } from "@/components/application/date-picker/date-time-picker";

const at = (hour: number, minute = 0) => toCalendarDateTime(today(getLocalTimeZone())).set({ hour, minute });

/** Minutes after midnight. */
const t = (h: number, m = 0) => h * 60 + m;

/**
 * Pick a day and a time in one popover: the calendar on the left and a scrolling column of
 * available times on the right. On small screens the column turns into a time dropdown above
 * the calendar. Cancel and Apply close it, like the Date Picker.
 *
 * Imported from the Untitled UI "Date time picker" example. Here the times come from
 * `interval`, `startTime` and `endTime` (minutes after midnight), and `unavailableTimes`
 * greys out booked slots. The value is a `CalendarDateTime` from `@internationalized/date`.
 */
const meta = {
    title: "Design System/Components/Forms/Date Time Picker",
    id: "components-forms-date-time-picker",
    component: DateTimePicker,
    parameters: { layout: "centered" },
    argTypes: {
        size: {
            control: "select",
            options: ["xs", "sm", "md", "lg", "xl"],
            description: "Sizes the trigger button.",
        },
        interval: {
            control: "inline-radio",
            options: [15, 30, 60],
            description: "Minutes between the times in the list.",
        },
        startTime: { control: { type: "number", min: 0, max: 1439, step: 30 }, description: "First time, in minutes after midnight." },
        endTime: { control: { type: "number", min: 0, max: 1439, step: 30 }, description: "Last time, in minutes after midnight." },
        isDisabled: { control: "boolean", description: "Greys out the picker when the course is closed." },
    },
} satisfies Meta<typeof DateTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Choose the day and the time you tee off. */
export const Playground: Story = {
    args: {
        size: "sm",
        defaultValue: at(9),
    },
};

/** The trigger button across every size. */
export const Sizes: Story = {
    render: (args) => (
        <div className="flex flex-col items-start gap-4">
            <DateTimePicker {...args} size="sm" />
            <DateTimePicker {...args} size="md" />
            <DateTimePicker {...args} size="lg" />
            <DateTimePicker {...args} size="xl" />
        </div>
    ),
    args: {
        defaultValue: at(9),
    },
};

/** Closed for aeration: the picker is disabled. */
export const Disabled: Story = {
    args: {
        defaultValue: at(9),
        isDisabled: true,
    },
};

/** Opened by default, so the calendar and the column of times are both visible. */
export const Open: Story = {
    render: (args) => (
        <div className="flex min-h-[560px] items-start">
            <DateTimePicker {...args} />
        </div>
    ),
    args: {
        defaultOpen: true,
        defaultValue: at(10, 30),
    },
};

/** Tee times every 15 minutes from 6:00 AM to 6:00 PM, with booked times greyed out. */
export const TeeTimesWithBookedSlots: Story = {
    render: (args) => (
        <div className="flex min-h-[560px] items-start">
            <DateTimePicker {...args} />
        </div>
    ),
    args: {
        defaultOpen: true,
        interval: 15,
        startTime: t(6),
        endTime: t(18),
        timesLabel: "Open tee times",
        unavailableTimes: [t(6, 15), t(6, 30), t(7), t(7, 45), t(8), t(8, 15)],
        defaultValue: at(7, 15),
    },
};

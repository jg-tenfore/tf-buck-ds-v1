import { getLocalTimeZone, today } from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fireEvent, waitFor, within } from "storybook/test";
import { DatePicker } from "@/components/application/date-picker/date-picker";
import { TimePicker } from "@/components/application/time-picker/time-picker";
import { TimeRangePicker } from "@/components/application/time-picker/time-range-picker";

/** t(9, 52) = 9:52 AM, in minutes after midnight. */
const t = (h: number, m = 0) => h * 60 + m;

/**
 * Pick a time from a list, or type the exact one.
 *
 * - **Click the field** and a long, scrollable list of times opens, already scrolled to the
 *   current time (or the nearest one after it).
 * - **Set the gap between times** with `interval`: 15, 30 or 60 minutes.
 * - **Type any exact time** instead: "9:52", "952p", "9 pm", "21:15", "noon". It's checked and
 *   tidied to "9:52 AM" when you press Enter or leave the field.
 * - **Switch AM / PM** by clicking AM or PM in the field to highlight it, then typing A or P
 *   (or pressing ↑ ↓). Typing "9:52p" works too.
 * - **Keyboard:** ↑ ↓ move through the list, Page Up / Page Down jump, Enter picks, Esc closes.
 *
 * The Time Range Picker pairs two of them (Opens at / Closes at) for a day's hours or a booking
 * window.
 *
 * Values are whole minutes after midnight (570 = 9:30 AM). `timeFromString("09:30")` and
 * `timeToString(570)` convert to and from the 24-hour text a form posts.
 */
const meta = {
    title: "Design System/Components/Forms/Time Picker",
    id: "components-forms-time-picker",
    component: TimePicker,
    parameters: { layout: "centered" },
    decorators: [
        (Story) => (
            // Room for the list to open below the field.
            <div className="flex min-h-[460px] min-w-72 flex-col pt-4">
                <Story />
            </div>
        ),
    ],
    argTypes: {
        interval: {
            control: "inline-radio",
            options: [15, 30, 60],
            description: "Minutes between the times in the list. Typing still accepts any minute.",
        },
        size: { control: "inline-radio", options: ["sm", "md", "lg"] },
        isDisabled: { control: "boolean" },
        isRequired: { control: "boolean" },
        minTime: { control: { type: "number", min: 0, max: 1439, step: 15 }, description: "Earliest time, in minutes after midnight." },
        maxTime: { control: { type: "number", min: 0, max: 1439, step: 15 }, description: "Latest time, in minutes after midnight." },
    },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Click the field to open the list, or type an exact time. */
export const Playground: Story = {
    args: {
        label: "Opens at",
        interval: 30,
        defaultValue: t(9, 52),
        size: "md",
    },
};

/** Small, medium and large, matching the other form fields. */
export const Sizes: Story = {
    render: (args) => (
        <div className="flex w-full flex-col gap-4">
            <TimePicker {...args} size="sm" label="Small" />
            <TimePicker {...args} size="md" label="Medium" />
            <TimePicker {...args} size="lg" label="Large" />
        </div>
    ),
    args: {
        defaultValue: t(8),
    },
};

/** Closed for aeration: the field is disabled. */
export const Disabled: Story = {
    args: {
        label: "Tee time",
        defaultValue: t(14),
        isDisabled: true,
    },
};

/** The list every 15 minutes, every 30 minutes and every hour. Typing still takes any minute. */
export const Intervals: Story = {
    render: () => (
        <div className="flex flex-wrap items-start gap-4">
            <TimePicker className="w-52" label="Every 15 minutes" interval={15} defaultValue={t(7, 10)} hint="Tee times" />
            <TimePicker className="w-52" label="Every 30 minutes" interval={30} defaultValue={t(9, 30)} hint="Lessons" />
            <TimePicker className="w-52" label="Every hour" interval={60} defaultValue={t(18)} hint="Bay rentals" />
        </div>
    ),
};

/** Date + time picker: pair the calendar date with a tee-off time for a full booking slot. */
export const DateTimePicker: Story = {
    render: () => (
        <div className="flex items-end gap-3">
            <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-secondary">Tee date</span>
                <DatePicker defaultValue={today(getLocalTimeZone())} size="md" />
            </div>
            <TimePicker className="w-44" label="Tee time" interval={15} defaultValue={t(7, 10)} />
        </div>
    ),
};

type RangeStory = StoryObj<typeof TimeRangePicker>;

/**
 * Time Range Picker: Opens at / Closes at, like a day's hours. The Closes at list starts after
 * the opening time and shows how long after it each time is. A closing time at or before the
 * opening time is flagged.
 */
export const RangePicker: RangeStory = {
    render: (args) => <TimeRangePicker {...args} />,
    args: {
        defaultValue: { start: t(9), end: t(17) },
    },
};

/** A range held to the tee sheet's day (6:00 AM to 8:00 PM) in 15-minute steps. */
export const RangePickerWithLimits: RangeStory = {
    render: (args) => <TimeRangePicker {...args} />,
    args: {
        startLabel: "First tee time",
        endLabel: "Last tee time",
        interval: 15,
        minTime: t(6),
        maxTime: t(20),
        openTo: t(6),
        defaultValue: { start: t(6, 30), end: t(18, 45) },
    },
};

/** A disabled range: the hours are set by the course and can't be changed here. */
export const RangeDisabled: RangeStory = {
    render: (args) => <TimeRangePicker {...args} />,
    args: {
        isDisabled: true,
        defaultValue: { start: t(9), end: t(17) },
    },
};

/**
 * Test only (hidden from the sidebar): "352p" becomes 3:52 PM, typing A over the highlighted PM
 * moves it to the morning, nonsense is flagged.
 */
export const TypingAnExactTime: Story = {
    tags: ["!dev"],
    args: { label: "Start time", interval: 30 },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByRole("combobox", { name: "Start time" });
        // Type a whole entry and press Enter. (fireEvent rather than userEvent.type: in this
        // Storybook, userEvent's typing doesn't reach React's onChange.)
        const enter = (text: string) => {
            fireEvent.change(input, { target: { value: text } });
            fireEvent.keyDown(input, { key: "Enter" });
        };

        input.focus();
        fireEvent.click(input);
        await waitFor(() => expect(input).toHaveAttribute("aria-expanded", "true"));

        enter("352p");
        await waitFor(() => expect(input).toHaveValue("3:52 PM"));

        // Highlight "PM" and type A.
        (input as HTMLInputElement).setSelectionRange(5, 7);
        fireEvent.keyDown(input, { key: "a" });
        await waitFor(() => expect(input).toHaveValue("3:52 AM"));

        enter("25:00");
        await waitFor(() => expect(canvas.getByText("Enter a time like 9:30 AM")).toBeInTheDocument());
        await expect(input).toHaveAttribute("aria-invalid", "true");

        enter("noon");
        await waitFor(() => expect(input).toHaveValue("12:00 PM"));
        await expect(input).not.toHaveAttribute("aria-invalid");
    },
};

"use client";

import { useMemo, useState } from "react";
import { getLocalTimeZone, toCalendarDateTime, today } from "@internationalized/date";
import { useControlledState } from "@react-stately/utils";
import { Calendar as CalendarIcon, Clock } from "@untitledui/icons";
import { useDateFormatter } from "react-aria";
import type { DatePickerProps as AriaDatePickerProps, DateValue, Key } from "react-aria-components";
import { DatePicker as AriaDatePicker, Dialog as AriaDialog, Group as AriaGroup, Popover as AriaPopover, DateField } from "react-aria-components";
import { formatTime } from "@/components/application/time-picker/time-picker";
import { Button, type ButtonProps } from "@/components/base/buttons/button";
import { InputDateBase } from "@/components/base/input/input-date";
import { Select } from "@/components/base/select/select";
import { cx } from "@/utils/cx";
import { Calendar } from "./calendar";

/*
 * Ported from the Untitled UI "Date time picker" example (react/components/date-pickers),
 * made into a component: the times come from `interval`, `startTime` and `endTime` instead of a
 * fixed list, unavailable times can be greyed out, and the props match `DatePicker`.
 */

const highlightedDates = [today(getLocalTimeZone())];

type TimeSlot = { id: string; hour: number; minute: number; label: string; isDisabled?: boolean };

interface DateTimePickerProps extends AriaDatePickerProps<DateValue> {
    /** Called when Apply is pressed. */
    onApply?: () => void;
    /** Called when Cancel is pressed. Cancel doesn't undo the picked value; handle that here if needed. */
    onCancel?: () => void;
    size?: ButtonProps["size"];
    /** Minutes between times in the list. @default 30 */
    interval?: number;
    /** First time in the list, in minutes after midnight. @default 540 (9:00 AM) */
    startTime?: number;
    /** Last time in the list, in minutes after midnight. @default 1320 (10:00 PM) */
    endTime?: number;
    /** Times that show but can't be picked (already booked), in minutes after midnight. */
    unavailableTimes?: number[];
    /** Heading over the list of times. @default "Available times" */
    timesLabel?: string;
}

const slotId = (hour: number, minute: number) => `${hour}:${String(minute).padStart(2, "0")}`;

export const DateTimePicker = ({
    value: valueProp,
    defaultValue,
    onChange,
    onApply,
    onCancel,
    size = "sm",
    interval = 30,
    startTime = 9 * 60,
    endTime = 22 * 60,
    unavailableTimes,
    timesLabel = "Available times",
    ...props
}: DateTimePickerProps) => {
    const [value, setValue] = useControlledState<DateValue | null>(valueProp, defaultValue ?? toCalendarDateTime(today(getLocalTimeZone())), onChange);
    const [focusedValue, setFocusedValue] = useState<DateValue | null>(value);

    const dateFormatter = useDateFormatter({ month: "short", day: "numeric", year: "numeric" });
    const timeFormatter = useDateFormatter({ hour: "numeric", minute: "numeric" });

    const slots = useMemo<TimeSlot[]>(() => {
        const list: TimeSlot[] = [];
        const step = Math.max(1, Math.round(interval));
        for (let t = startTime; t <= endTime; t += step) {
            const hour = Math.floor(t / 60);
            const minute = t % 60;
            list.push({ id: slotId(hour, minute), hour, minute, label: formatTime(t), isDisabled: unavailableTimes?.includes(t) });
        }
        return list;
    }, [interval, startTime, endTime, unavailableTimes]);

    const hasTime = value !== null && "hour" in value;
    const selectedId = hasTime ? slotId(value.hour, value.minute) : null;

    const handleTodayClick = () => {
        const t = today(getLocalTimeZone());
        // Keep the chosen time when jumping to today.
        const date = hasTime ? toCalendarDateTime(t).set({ hour: value.hour, minute: value.minute }) : toCalendarDateTime(t);
        setValue(date);
        setFocusedValue(date);
    };

    const handleTimeClick = (key: Key | null) => {
        const slot = slots.find((s) => s.id === key);
        if (!slot || slot.isDisabled) return;
        const date = value ? toCalendarDateTime(value) : toCalendarDateTime(today(getLocalTimeZone()));
        setValue(date.set({ hour: slot.hour, minute: slot.minute }));
    };

    return (
        <AriaDatePicker aria-label="Date and time" shouldCloseOnSelect={false} {...props} value={value} onChange={setValue}>
            <AriaGroup>
                <Button size={size} color="secondary" iconLeading={CalendarIcon}>
                    {value ? (
                        <>
                            {dateFormatter.format(value.toDate(getLocalTimeZone()))}{" "}
                            {hasTime && <span className="text-quaternary">{timeFormatter.format(value.toDate(getLocalTimeZone()))}</span>}
                        </>
                    ) : (
                        "Select date"
                    )}
                </Button>
            </AriaGroup>
            <AriaPopover
                offset={8}
                placement="bottom right"
                className={({ isEntering, isExiting }) =>
                    cx(
                        "origin-(--trigger-anchor-point) will-change-transform",
                        isEntering &&
                            "duration-150 ease-out animate-in fade-in placement-right:slide-in-from-left-0.5 placement-top:slide-in-from-bottom-0.5 placement-bottom:slide-in-from-top-0.5",
                        isExiting &&
                            "duration-100 ease-in animate-out fade-out placement-right:slide-out-to-left-0.5 placement-top:slide-out-to-bottom-0.5 placement-bottom:slide-out-to-top-0.5",
                    )
                }
            >
                <AriaDialog aria-label="Date and time" className="rounded-2xl bg-primary shadow-xl ring ring-secondary_alt">
                    {({ close }) => (
                        <>
                            <div className="flex">
                                <div className="flex px-6 py-5">
                                    <Calendar highlightedDates={highlightedDates} focusedValue={focusedValue} onFocusChange={setFocusedValue}>
                                        {/* Small screens: date field, Today and a time dropdown above the grid. */}
                                        <div className="flex flex-wrap gap-3 md:hidden">
                                            <div className="flex flex-1 gap-3">
                                                <DateField aria-label="Date" granularity="day" className="flex-1">
                                                    <InputDateBase size="sm" className="flex-1" />
                                                </DateField>
                                                <Button slot={null} size="sm" color="secondary" onClick={handleTodayClick}>
                                                    Today
                                                </Button>
                                            </div>
                                            <Select
                                                aria-label="Time"
                                                size="sm"
                                                placeholder="Time"
                                                icon={Clock}
                                                items={slots}
                                                value={selectedId}
                                                onChange={handleTimeClick}
                                                className="flex-1"
                                            >
                                                {(slot) => (
                                                    <Select.Item id={slot.id} icon={Clock} isDisabled={slot.isDisabled}>
                                                        {slot.label}
                                                    </Select.Item>
                                                )}
                                            </Select>
                                        </div>
                                    </Calendar>
                                </div>

                                {/* Wider screens: a scrolling column of times beside the calendar. */}
                                <div className="relative hidden min-h-0 w-50 flex-col gap-4 md:flex">
                                    <div className="px-5 pt-6.5 text-center text-sm font-semibold text-fg-secondary">{timesLabel}</div>
                                    <div className="relative h-full w-full">
                                        <ul
                                            aria-label={timesLabel}
                                            className="absolute inset-0 flex min-h-0 flex-col gap-1.5 overflow-y-auto mask-b-from-80% mask-b-to-98% px-5 pb-5"
                                        >
                                            {slots.map((slot) => {
                                                const isSelected = slot.id === selectedId;
                                                return (
                                                    <li key={slot.id} className="flex-1">
                                                        <Button
                                                            size="xs"
                                                            color="secondary"
                                                            aria-pressed={isSelected}
                                                            isDisabled={slot.isDisabled}
                                                            className={cx("w-full", isSelected && "bg-primary_hover ring-2 ring-brand")}
                                                            onClick={() => handleTimeClick(slot.id)}
                                                        >
                                                            {slot.label}
                                                        </Button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 border-t border-secondary p-4">
                                <div className="mr-auto hidden gap-3 md:flex">
                                    <DateField aria-label="Date" granularity="day" className="flex-1">
                                        <InputDateBase size="sm" />
                                    </DateField>
                                    <Button size="sm" color="secondary" onClick={handleTodayClick}>
                                        Today
                                    </Button>
                                </div>

                                <Button
                                    size="sm"
                                    color="secondary"
                                    className="max-md:flex-1"
                                    onClick={() => {
                                        onCancel?.();
                                        close();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    color="primary"
                                    className="max-md:flex-1"
                                    onClick={() => {
                                        onApply?.();
                                        close();
                                    }}
                                >
                                    Apply
                                </Button>
                            </div>
                        </>
                    )}
                </AriaDialog>
            </AriaPopover>
        </AriaDatePicker>
    );
};

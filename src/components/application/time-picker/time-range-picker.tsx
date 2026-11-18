"use client";

import { useState } from "react";
import { cx } from "@/utils/cx";
import { TimePicker, type TimePickerProps, formatDuration, formatTime } from "./time-picker";

/** A start and end time, each in minutes after midnight. */
export interface TimeRange {
    start: number | null;
    end: number | null;
}

export interface TimeRangePickerProps extends Pick<
    TimePickerProps,
    "size" | "interval" | "minTime" | "maxTime" | "openTo" | "isDisabled" | "isRequired" | "icon" | "placeholder"
> {
    /** Label over the first field. @default "Opens at" */
    startLabel?: string;
    /** Label over the second field. @default "Closes at" */
    endLabel?: string;
    /** Controlled range. */
    value?: TimeRange;
    /** Starting range when uncontrolled. */
    defaultValue?: TimeRange;
    /** Called whenever either end changes. */
    onChange?: (value: TimeRange) => void;
    /** Shows the total under the fields, like "8 hrs in total". @default true */
    showSummary?: boolean;
    /** Names for the two hidden inputs ("HH:mm"), for plain form posts. */
    startName?: string;
    endName?: string;
    className?: string;
}

/**
 * Two time pickers side by side, for a day's hours or a booking window. The end list starts
 * after the start time and shows how long after it each time is; an end at or before the start
 * is flagged.
 */
export const TimeRangePicker = ({
    startLabel = "Opens at",
    endLabel = "Closes at",
    value: valueProp,
    defaultValue = { start: null, end: null },
    onChange,
    showSummary = true,
    startName,
    endName,
    className,
    size = "md",
    ...shared
}: TimeRangePickerProps) => {
    const [inner, setInner] = useState<TimeRange>(defaultValue);
    const value = valueProp ?? inner;

    const update = (next: TimeRange) => {
        if (valueProp === undefined) setInner(next);
        onChange?.(next);
    };

    const { start, end } = value;
    const endTooEarly = start !== null && end !== null && end <= start;

    return (
        <div className={cx("flex flex-col gap-2", className)}>
            <div className="flex items-start gap-3">
                <TimePicker
                    {...shared}
                    size={size}
                    className="w-44"
                    label={startLabel}
                    name={startName}
                    value={start}
                    onChange={(s) => update({ start: s, end })}
                />
                <TimePicker
                    {...shared}
                    size={size}
                    className="w-44"
                    popoverClassName="min-w-56"
                    label={endLabel}
                    name={endName}
                    value={end}
                    onChange={(e) => update({ start, end: e })}
                    durationFrom={start}
                    isInvalid={endTooEarly}
                    errorMessage={start === null ? undefined : `Must be after ${formatTime(start)}`}
                />
            </div>

            {showSummary && start !== null && end !== null && !endTooEarly && (
                <p className={cx("text-tertiary", size === "sm" ? "text-xs" : "text-sm")}>{formatDuration(end - start)} in total</p>
            )}
        </div>
    );
};

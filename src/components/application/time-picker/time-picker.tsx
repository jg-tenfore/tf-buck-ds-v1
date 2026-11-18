"use client";

import type { FC, KeyboardEvent, ReactNode } from "react";
import { isValidElement, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, Clock } from "@untitledui/icons";
import { HintText } from "@/components/base/input/hint-text";
import { Label } from "@/components/base/input/label";
import { Popover } from "@/components/base/select/popover";
import { sizes as fieldSizes } from "@/components/base/select/select-shared";
import { cx, sortCx } from "@/utils/cx";
import { isReactComponent } from "@/utils/is-react-component";

/* -------------------------------------------------------------------------------------------------
 * Time helpers. A time is a whole number of minutes after midnight (0–1439), so 9:30 AM is 570.
 * -----------------------------------------------------------------------------------------------*/

export type Period = "AM" | "PM";

const DAY = 24 * 60;

/** 570 → "9:30 AM" */
export const formatTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60) % 24;
    const m = minutes % 60;
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

/** "09:30" or "21:15" (24-hour) → minutes. Returns null for anything else. */
export const timeFromString = (value: string): number | null => {
    const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
    if (!match) return null;
    const h = Number(match[1]);
    const m = Number(match[2]);
    return h < 24 && m < 60 ? h * 60 + m : null;
};

/** minutes → "09:30" (24-hour), the format a form posts. */
export const timeToString = (minutes: number): string => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

/**
 * Reads what someone typed. Accepts "9:52 AM", "9:52a", "952p", "9 pm", "21:15", "2115",
 * "noon" and "midnight". When there's no AM/PM and the hour could be either, `fallback` decides.
 */
export const parseTime = (text: string, fallback: Period = "AM"): number | null => {
    const t = text.trim().toLowerCase().replace(/\./g, "").replace(/\s+/g, "");
    if (!t) return null;
    if (t === "noon") return 12 * 60;
    if (t === "midnight") return 0;

    const match = /^(\d{1,4})(?::(\d{1,2}))?(a|am|p|pm)?$/.exec(t);
    if (!match) return null;

    let [, hours, minutes] = match;
    const suffix = match[3];

    // "952" / "1230" → split the last two digits off as minutes.
    if (minutes === undefined && hours.length > 2) {
        minutes = hours.slice(-2);
        hours = hours.slice(0, -2);
    }

    let h = Number(hours);
    const m = minutes === undefined ? 0 : Number(minutes);
    if (m > 59 || (minutes !== undefined && minutes.length !== 2)) return null;

    if (suffix) {
        if (h < 1 || h > 12) return null;
        const pm = suffix.startsWith("p");
        h = (h % 12) + (pm ? 12 : 0);
    } else {
        if (h > 23) return null;
        // 0:xx and 13:00–23:59 can only be 24-hour time; 1–12 follow the AM/PM switch.
        if (h >= 1 && h <= 12) h = (h % 12) + (fallback === "PM" ? 12 : 0);
    }

    return h * 60 + m;
};

/** 90 → "1.5 hrs", 45 → "45 min", 135 → "2 hrs 15 min" */
export const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`;
    const hrs = minutes / 60;
    if (minutes % 30 === 0) return `${hrs} ${hrs === 1 ? "hr" : "hrs"}`;
    const whole = Math.floor(hrs);
    return `${whole} ${whole === 1 ? "hr" : "hrs"} ${minutes % 60} min`;
};

const periodOf = (minutes: number): Period => (minutes >= 12 * 60 ? "PM" : "AM");

/* -------------------------------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------------------------*/

const styles = sortCx({
    option: {
        sm: { root: "gap-2 p-2 pr-2.5", text: "text-sm", check: "size-4 stroke-[2.25px]" },
        md: { root: "gap-2 p-2 pr-2.5", text: "text-md", check: "size-5" },
        lg: { root: "gap-2 p-2.5 pl-2", text: "text-md", check: "size-5" },
    },
});

export interface TimePickerProps {
    /** Field label shown above the input. */
    label?: string;
    /** Helper text below the input. Replaced by the error message while the field is invalid. */
    hint?: string;
    /** Tooltip text for the help icon next to the label. */
    tooltip?: string;
    /** Accessible name when there's no visible label. */
    "aria-label"?: string;
    /** @default "md" */
    size?: "sm" | "md" | "lg";
    /**
     * Minutes between the times in the list: 15, 30 or 60 (any whole number works).
     * Typing still accepts any exact minute.
     * @default 30
     */
    interval?: number;
    /** Selected time, in minutes after midnight (570 = 9:30 AM). `null` for empty. */
    value?: number | null;
    /** Starting time when uncontrolled. */
    defaultValue?: number | null;
    /** Called with the new time (or `null` when cleared) once a time is picked or typed in. */
    onChange?: (value: number | null) => void;
    /** Earliest time in the list and the earliest that can be typed. @default 0 (12:00 AM) */
    minTime?: number;
    /** Latest time in the list and the latest that can be typed. @default 1439 (11:59 PM) */
    maxTime?: number;
    /**
     * Pairs this field with an earlier one (e.g. "Closes at" with "Opens at"): the list starts
     * after that time and every option shows how long after it is, like "5:00 PM  7 hrs".
     */
    durationFrom?: number | null;
    /** Where the list opens when the field is empty. @default 420 (7:00 AM) */
    openTo?: number;
    /** Leading icon. Pass `null` to hide it. @default Clock */
    icon?: FC | ReactNode | null;
    /** @default "Select a time" */
    placeholder?: string;
    isDisabled?: boolean;
    isRequired?: boolean;
    /** Marks the field invalid from outside (e.g. "closes before it opens"). */
    isInvalid?: boolean;
    /** Message shown while `isInvalid` is true. */
    errorMessage?: string;
    hideRequiredIndicator?: boolean;
    /** Name of a hidden input carrying the value as "HH:mm", for plain form posts. */
    name?: string;
    className?: string;
    popoverClassName?: string;
}

export const TimePicker = ({
    label,
    hint,
    tooltip,
    "aria-label": ariaLabel,
    size = "md",
    interval = 30,
    value: valueProp,
    defaultValue = null,
    onChange,
    minTime = 0,
    maxTime = DAY - 1,
    durationFrom = null,
    openTo = 7 * 60,
    icon: IconProp = Clock,
    placeholder = "Select a time",
    isDisabled,
    isRequired,
    isInvalid: isInvalidProp,
    errorMessage,
    hideRequiredIndicator,
    name,
    className,
    popoverClassName,
}: TimePickerProps) => {
    const id = useId();
    const inputId = `${id}-input`;
    const listId = `${id}-list`;
    const hintId = `${id}-hint`;
    const optionId = (minutes: number) => `${id}-opt-${minutes}`;

    const isControlled = valueProp !== undefined;
    const [innerValue, setInnerValue] = useState<number | null>(defaultValue);
    const value = isControlled ? valueProp : innerValue;

    const [text, setText] = useState(value === null ? "" : formatTime(value));
    const [period, setPeriod] = useState<Period>(value === null ? "AM" : periodOf(value));
    const [isOpen, setIsOpen] = useState(false);
    const [highlight, setHighlight] = useState<number | null>(null);
    const [parseError, setParseError] = useState<string | null>(null);

    const groupRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const popoverRef = useRef<HTMLElement>(null);
    const isFocused = useRef(false);

    /** The times in the list. */
    const slots = useMemo(() => {
        const list: number[] = [];
        const step = Math.max(1, Math.round(interval));
        const first = Math.ceil(minTime / step) * step;
        for (let t = first; t <= maxTime; t += step) {
            if (durationFrom === null || t > durationFrom) list.push(t);
        }
        return list;
    }, [interval, minTime, maxTime, durationFrom]);

    // Keep the text in step with a value changed from outside (controlled use), unless someone is typing.
    useEffect(() => {
        if (isFocused.current) return;
        setText(value === null ? "" : formatTime(value));
        if (value !== null) setPeriod(periodOf(value));
    }, [value]);

    const setValue = useCallback(
        (next: number | null) => {
            if (!isControlled) setInnerValue(next);
            if (next !== value) onChange?.(next);
        },
        [isControlled, onChange, value],
    );

    /** First slot at or after `t` (or the last slot). */
    const slotAtOrAfter = useCallback((t: number) => slots.find((s) => s >= t) ?? slots[slots.length - 1], [slots]);

    /** Scrolls the open list so `t` sits in the middle (or just into view when moving with the arrow keys). */
    const scrollTo = useCallback((t: number | undefined, block: "center" | "nearest" = "center") => {
        if (t === undefined) return;
        requestAnimationFrame(() => {
            const container = popoverRef.current;
            const item = container?.querySelector<HTMLElement>(`[data-time="${t}"]`);
            if (!container || !item) return;
            const c = container.getBoundingClientRect();
            const r = item.getBoundingClientRect();
            if (block === "center") {
                container.scrollTop += r.top - c.top - c.height / 2 + r.height / 2;
            } else if (r.top < c.top) {
                container.scrollTop -= c.top - r.top + 4;
            } else if (r.bottom > c.bottom) {
                container.scrollTop += r.bottom - c.bottom + 4;
            }
        });
    }, []);

    /** Where the list should land when it opens: the chosen time, else the nearest time after it. */
    const anchor = useCallback(() => slotAtOrAfter(value ?? durationFrom ?? openTo), [slotAtOrAfter, value, durationFrom, openTo]);

    // Land on the anchor every time the list opens (twice: once the popover mounts, once it has laid out).
    useEffect(() => {
        if (!isOpen) return;
        const target = anchor();
        scrollTo(target);
        const t = setTimeout(() => scrollTo(target), 30);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const open = () => {
        if (isDisabled || isOpen) return;
        setHighlight(null);
        setIsOpen(true);
    };

    const outOfRange = (t: number) => t < minTime || t > maxTime;
    const rangeMessage = `Pick a time from ${formatTime(minTime)} to ${formatTime(maxTime)}`;

    /** Turns the typed text into a value, or flags it. */
    const commit = (raw = text, fallback = period) => {
        if (!raw.trim()) {
            setParseError(null);
            setValue(null);
            return;
        }
        const parsed = parseTime(raw, fallback);
        if (parsed === null) {
            setParseError("Enter a time like 9:30 AM");
            return;
        }
        if (outOfRange(parsed)) {
            setParseError(rangeMessage);
            return;
        }
        setParseError(null);
        setText(formatTime(parsed));
        setPeriod(periodOf(parsed));
        setValue(parsed);
    };

    const choose = (t: number) => {
        setParseError(null);
        setText(formatTime(t));
        setPeriod(periodOf(t));
        setValue(t);
        setIsOpen(false);
        setHighlight(null);
    };

    const switchPeriod = (next: Period) => {
        if (isDisabled) return;
        setPeriod(next);
        const current = parseTime(text, period) ?? value;
        if (current === null) return;
        const shifted = (current % 720) + (next === "PM" ? 720 : 0);
        setText(formatTime(shifted));
        if (outOfRange(shifted)) {
            setParseError(rangeMessage);
            return;
        }
        // Same as picking it, but the list stays as it is (open or closed).
        setParseError(null);
        setValue(shifted);
        setHighlight(null);
        scrollTo(slotAtOrAfter(shifted));
    };

    /** Where "AM" / "PM" sits in the text, when the text is a tidy time like "9:52 AM". */
    const periodRange = (): [number, number] | null => {
        const match = /^\d{1,2}:\d{2} (AM|PM)$/.exec(inputRef.current?.value ?? "");
        if (!match) return null;
        const end = match[0].length;
        return [end - 2, end];
    };

    /** Highlights the AM / PM part, so typing A or P (or ↑ ↓) switches it. */
    const selectPeriod = () => {
        const range = periodRange();
        if (range) inputRef.current?.setSelectionRange(range[0], range[1]);
    };

    const isPeriodSelected = () => {
        const range = periodRange();
        const input = inputRef.current;
        return Boolean(range && input && input.selectionStart === range[0] && input.selectionEnd === range[1]);
    };

    /** Switches AM / PM from the keyboard and keeps it highlighted for another switch. */
    const switchPeriodFromKeyboard = (next: Period) => {
        switchPeriod(next);
        requestAnimationFrame(selectPeriod);
    };

    const move = (step: number) => {
        if (!slots.length) return;
        let index: number;
        if (highlight === null) {
            const from = parseTime(text, period) ?? value ?? durationFrom ?? openTo;
            index = slots.findIndex((s) => s >= from);
            if (index === -1) index = slots.length - 1;
            // Pressing up from a time between two slots lands on the earlier one.
            if (step < 0 && slots[index] > from && index > 0) index -= 1;
            else if (step > 0 && slots[index] === value && index < slots.length - 1) index += 1;
        } else {
            index = Math.min(slots.length - 1, Math.max(0, slots.indexOf(highlight) + step));
        }
        setHighlight(slots[index]);
        scrollTo(slots[index], "nearest");
    };

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        // With AM / PM highlighted: A or P sets it, ↑ ↓ flip it. Anything else types over it as usual.
        if (isPeriodSelected() && !e.metaKey && !e.ctrlKey && !e.altKey) {
            const k = e.key.toLowerCase();
            if (k === "a" || k === "p" || e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
                const next: Period = k === "a" ? "AM" : k === "p" ? "PM" : period === "AM" ? "PM" : "AM";
                switchPeriodFromKeyboard(next);
                return;
            }
        }

        switch (e.key) {
            case "ArrowDown":
            case "ArrowUp": {
                e.preventDefault();
                if (!isOpen) {
                    open();
                    return;
                }
                move(e.key === "ArrowDown" ? 1 : -1);
                return;
            }
            case "PageDown":
            case "PageUp":
                if (!isOpen) return;
                e.preventDefault();
                move(e.key === "PageDown" ? 6 : -6);
                return;
            case "Enter":
                if (isOpen && highlight !== null) {
                    e.preventDefault();
                    choose(highlight);
                } else {
                    commit();
                    setIsOpen(false);
                }
                return;
            case "Escape":
                if (isOpen) {
                    e.preventDefault();
                    setIsOpen(false);
                    setHighlight(null);
                }
                // Throw away half-typed text.
                setText(value === null ? "" : formatTime(value));
                setParseError(null);
                return;
        }
    };

    const isInvalid = Boolean(parseError) || Boolean(isInvalidProp);
    const message = parseError ?? (isInvalidProp ? errorMessage : undefined) ?? hint;
    const showRequired = hideRequiredIndicator ? false : isRequired;

    const Icon = IconProp;

    return (
        <div className={cx("flex flex-col gap-1.5", className)} data-input-size={size}>
            {label && (
                <Label htmlFor={inputId} isRequired={showRequired} isInvalid={isInvalid} tooltip={tooltip}>
                    {label}
                </Label>
            )}

            <div
                ref={groupRef}
                onMouseDown={(e) => {
                    // Clicking anywhere on the field (icon, padding) focuses the input and opens the list.
                    if (isDisabled || e.target === inputRef.current) return;
                    e.preventDefault();
                    inputRef.current?.focus();
                    open();
                }}
                className={cx(
                    "relative flex w-full cursor-text items-center rounded-lg bg-primary shadow-xs ring-1 ring-primary transition-shadow duration-100 ease-linear ring-inset",
                    "*:data-icon:pointer-events-none *:data-icon:shrink-0 *:data-icon:text-fg-quaternary",
                    fieldSizes[size].root,
                    isOpen && !isInvalid && "ring-2 ring-brand",
                    "has-[input:focus]:ring-2 has-[input:focus]:ring-brand",
                    isInvalid && "ring-error_subtle has-[input:focus]:ring-error",
                    isDisabled && "cursor-not-allowed opacity-50",
                )}
            >
                {isReactComponent(Icon) ? <Icon data-icon aria-hidden="true" /> : isValidElement(Icon) ? Icon : null}

                <input
                    ref={inputRef}
                    id={inputId}
                    type="text"
                    role="combobox"
                    inputMode="text"
                    autoComplete="off"
                    spellCheck={false}
                    aria-label={label ? undefined : (ariaLabel ?? "Time")}
                    aria-expanded={isOpen}
                    aria-controls={isOpen ? listId : undefined}
                    aria-autocomplete="none"
                    aria-haspopup="listbox"
                    aria-activedescendant={isOpen && highlight !== null ? optionId(highlight) : undefined}
                    aria-invalid={isInvalid || undefined}
                    aria-required={isRequired || undefined}
                    aria-describedby={message ? hintId : undefined}
                    disabled={isDisabled}
                    placeholder={placeholder}
                    value={text}
                    onFocus={() => {
                        isFocused.current = true;
                        open();
                    }}
                    onClick={() => {
                        open();
                        // A click on (or just before) AM / PM highlights it.
                        const range = periodRange();
                        const input = inputRef.current;
                        if (range && input && input.selectionStart === input.selectionEnd && (input.selectionStart ?? 0) >= range[0] - 1) {
                            selectPeriod();
                        }
                    }}
                    onChange={(e) => {
                        const next = e.target.value;
                        setText(next);
                        setParseError(null);
                        setHighlight(null);
                        if (!isOpen) setIsOpen(true);
                        // Follow along in the list while typing, without picking anything yet.
                        const parsed = parseTime(next, period);
                        if (parsed !== null) {
                            if (/[ap]/i.test(next)) setPeriod(periodOf(parsed));
                            scrollTo(slotAtOrAfter(parsed));
                        }
                    }}
                    onKeyDown={onKeyDown}
                    onBlur={() => {
                        isFocused.current = false;
                        commit();
                        setIsOpen(false);
                        setHighlight(null);
                    }}
                    className={cx(
                        "m-0 w-full min-w-0 flex-1 bg-transparent text-primary outline-hidden selection:bg-brand-secondary placeholder:text-placeholder disabled:cursor-not-allowed",
                        fieldSizes[size].text,
                    )}
                />
            </div>

            <Popover
                ref={popoverRef}
                size={size}
                triggerRef={groupRef}
                isOpen={isOpen && slots.length > 0}
                onOpenChange={setIsOpen}
                isNonModal
                placement="bottom start"
                className={popoverClassName}
            >
                <div id={listId} role="listbox" aria-label={label ?? ariaLabel ?? "Times"} className="outline-hidden">
                    {slots.map((t) => {
                        const isSelected = t === value;
                        const isHighlighted = t === highlight;
                        return (
                            <div
                                key={t}
                                id={optionId(t)}
                                role="option"
                                aria-selected={isSelected}
                                data-time={t}
                                className={cx("w-full py-px", size === "sm" ? "px-1" : "px-1.5")}
                                // Picking with the mouse must not blur the input first.
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => choose(t)}
                                onMouseEnter={() => setHighlight(t)}
                            >
                                <div
                                    className={cx(
                                        "flex cursor-pointer items-center rounded-md select-none",
                                        styles.option[size].root,
                                        (isHighlighted || isSelected) && "bg-primary_hover",
                                    )}
                                >
                                    <span className={cx("font-medium whitespace-nowrap text-primary tabular-nums", styles.option[size].text)}>
                                        {formatTime(t)}
                                    </span>
                                    {durationFrom !== null && (
                                        <span className={cx("whitespace-nowrap text-tertiary", styles.option[size].text)}>
                                            {formatDuration(t - durationFrom)}
                                        </span>
                                    )}
                                    {isSelected && (
                                        <Check aria-hidden="true" className={cx("ml-auto shrink-0 text-fg-brand-primary", styles.option[size].check)} />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Popover>

            {name && <input type="hidden" name={name} value={value === null ? "" : timeToString(value)} />}

            {message && (
                <HintText id={hintId} isInvalid={isInvalid} size={size === "sm" ? "sm" : "md"}>
                    {message}
                </HintText>
            )}
        </div>
    );
};

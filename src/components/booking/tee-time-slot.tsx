"use client";

import { Button as AriaButton } from "react-aria-components";
import { cx, sortCx } from "@/utils/cx";
import { formatPrice, type TeeTime } from "@/components/booking/sagamore-data";

const styles = sortCx({
    common: {
        root: [
            "group flex cursor-pointer flex-col items-center justify-center text-center outline-focus-ring transition duration-100 ease-linear",
            "focus-visible:outline-2 focus-visible:outline-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
        ].join(" "),
        time: "font-semibold",
        meta: "tabular-nums",
    },
    sizes: {
        sm: {
            root: "min-w-16 gap-0.5 rounded-lg px-2.5 py-1.5",
            time: "text-sm",
            meta: "text-xs",
        },
        md: {
            root: "min-w-20 gap-1 rounded-xl px-3.5 py-2.5",
            time: "text-md",
            meta: "text-xs",
        },
    },
    states: {
        default: {
            root: "bg-primary text-primary ring-1 ring-secondary ring-inset hover:bg-primary_hover hover:ring-brand",
            meta: "text-tertiary",
        },
        selected: {
            root: "bg-brand-solid text-white ring-1 ring-transparent ring-inset hover:bg-brand-solid_hover",
            meta: "text-white/80",
        },
    },
});

export interface TeeTimeSlotProps {
    /** A full tee-time record. When provided it fills in time/price/spots. */
    teeTime?: TeeTime;
    /** Display label, e.g. "7:10 AM". Required unless `teeTime` is given. */
    time?: string;
    /** Per-player price in USD. Falls back to `teeTime.price`. */
    price?: number;
    /** Open spots remaining. Falls back to `teeTime.spotsAvailable`. */
    spotsAvailable?: number;
    isSelected?: boolean;
    isDisabled?: boolean;
    onPress?: () => void;
    size?: "sm" | "md";
    className?: string;
}

const spotsLabel = (spots: number): string => {
    if (spots <= 0) return "Full";
    if (spots === 1) return "1 left";
    return `${spots} spots`;
};

export const TeeTimeSlot = ({
    teeTime,
    time = teeTime?.label,
    price = teeTime?.price ?? 0,
    spotsAvailable = teeTime?.spotsAvailable ?? 0,
    isSelected = false,
    isDisabled = false,
    onPress,
    size = "md",
    className,
}: TeeTimeSlotProps) => {
    const isFull = spotsAvailable <= 0;
    const disabled = isDisabled || isFull;
    const state = isSelected ? styles.states.selected : styles.states.default;

    const label = `Tee time ${time}, ${formatPrice(price)} per player, ${isFull ? "full" : `${spotsAvailable} spots available`}`;

    return (
        <AriaButton
            isDisabled={disabled}
            onPress={onPress}
            aria-label={label}
            aria-pressed={isSelected}
            className={cx(styles.common.root, styles.sizes[size].root, state.root, className)}
        >
            <span className={cx(styles.common.time, styles.sizes[size].time)}>{time}</span>
            <span className={cx(styles.common.meta, styles.sizes[size].meta, state.meta)}>{formatPrice(price)}</span>
            <span className={cx(styles.common.meta, styles.sizes[size].meta, state.meta)}>{spotsLabel(spotsAvailable)}</span>
        </AriaButton>
    );
};

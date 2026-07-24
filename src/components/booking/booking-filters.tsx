"use client";

import type { Key } from "react-aria-components";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";
import type { HoleCount, Ride, TimeOfDay } from "@/components/booking/sagamore-data";

type SegmentedSize = "sm" | "md" | "lg";

interface BaseFilterProps {
    size?: SegmentedSize;
    className?: string;
}

/**
 * Bridge the single-select ButtonGroup (which works in react-aria `Key` sets)
 * to a typed `value` / `onChange` pair, ignoring deselection so a segment is
 * always chosen.
 */
function useSegmentSelection<T extends Key>(value: T, onChange: (value: T) => void) {
    return {
        selectedKeys: new Set<Key>([value]),
        onSelectionChange: (keys: Set<Key>) => {
            const next = [...keys][0] as T | undefined;
            if (next !== undefined) onChange(next);
        },
    };
}

export interface HolesFilterProps extends BaseFilterProps {
    value: HoleCount;
    onChange: (value: HoleCount) => void;
}

/** Segmented control for the round length: 9 or 18 holes. */
export const HolesFilter = ({ value, onChange, size = "md", className }: HolesFilterProps) => {
    const selection = useSegmentSelection<Key>(String(value), (key) => onChange(Number(key) as HoleCount));

    return (
        <ButtonGroup size={size} className={className} aria-label="Holes" {...selection}>
            <ButtonGroupItem id="9">9 holes</ButtonGroupItem>
            <ButtonGroupItem id="18">18 holes</ButtonGroupItem>
        </ButtonGroup>
    );
};

export interface RideFilterProps extends BaseFilterProps {
    value: Ride;
    onChange: (value: Ride) => void;
}

/** Segmented control for getting around: walking or riding a cart. */
export const RideFilter = ({ value, onChange, size = "md", className }: RideFilterProps) => {
    const selection = useSegmentSelection<Key>(value, (key) => onChange(key as Ride));

    return (
        <ButtonGroup size={size} className={className} aria-label="Ride" {...selection}>
            <ButtonGroupItem id="walking">Walking</ButtonGroupItem>
            <ButtonGroupItem id="cart">Cart</ButtonGroupItem>
        </ButtonGroup>
    );
};

export interface TimeOfDayFilterProps extends BaseFilterProps {
    value: TimeOfDay;
    onChange: (value: TimeOfDay) => void;
}

/** Segmented control for the booking window: morning, midday, or twilight. */
export const TimeOfDayFilter = ({ value, onChange, size = "md", className }: TimeOfDayFilterProps) => {
    const selection = useSegmentSelection<Key>(value, (key) => onChange(key as TimeOfDay));

    return (
        <ButtonGroup size={size} className={className} aria-label="Time of day" {...selection}>
            <ButtonGroupItem id="morning">Morning</ButtonGroupItem>
            <ButtonGroupItem id="midday">Midday</ButtonGroupItem>
            <ButtonGroupItem id="twilight">Twilight</ButtonGroupItem>
        </ButtonGroup>
    );
};

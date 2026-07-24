"use client";

import { useState } from "react";
import { Minus, Plus } from "@untitledui/icons";
import { Button as AriaButton, Group as AriaGroup } from "react-aria-components";
import { cx, sortCx } from "@/utils/cx";

const styles = sortCx({
    sizes: {
        sm: {
            root: "gap-2.5",
            button: "size-8",
            icon: "size-4",
            value: "min-w-6 text-sm",
        },
        md: {
            root: "gap-3.5",
            button: "size-10",
            icon: "size-5",
            value: "min-w-7 text-md",
        },
        lg: {
            root: "gap-4",
            button: "size-12",
            icon: "size-6",
            value: "min-w-8 text-lg",
        },
    },
});

export type PlayerStepperSize = keyof typeof styles.sizes;

export interface PlayerStepperProps {
    /** Controlled party size. */
    value?: number;
    /** Initial party size for uncontrolled usage. */
    defaultValue?: number;
    /** Smallest allowed party size. */
    min?: number;
    /** Largest allowed party size. */
    max?: number;
    /** Called whenever the party size changes. */
    onChange?: (value: number) => void;
    /** Accessible label for the group, e.g. "Players". */
    label?: string;
    /** Visual size. */
    size?: PlayerStepperSize;
    className?: string;
}

/**
 * A party-size stepper (− N +) for a tee-time reservation. Defaults to a foursome
 * range of 1–4 players. Works controlled (pass `value`) or uncontrolled (pass
 * `defaultValue`). The round − / + buttons disable at the min and max bounds.
 */
export const PlayerStepper = ({
    value,
    defaultValue = 1,
    min = 1,
    max = 4,
    onChange,
    label = "Players",
    size = "md",
    className,
}: PlayerStepperProps) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const current = isControlled ? value : internalValue;

    const sizes = styles.sizes[size];

    const setValue = (next: number) => {
        const clamped = Math.min(max, Math.max(min, next));
        if (clamped === current) return;
        if (!isControlled) setInternalValue(clamped);
        onChange?.(clamped);
    };

    const buttonClasses = cx(
        "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-fg-secondary shadow-skeuomorphic ring-1 ring-primary outline-brand transition duration-100 ease-linear ring-inset",
        "hover:bg-primary_hover hover:text-fg-secondary_hover focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        sizes.button,
    );

    return (
        <AriaGroup role="group" aria-label={label} className={cx("inline-flex items-center", sizes.root, className)}>
            <AriaButton
                slot="decrement"
                aria-label={`Remove a player (decrease ${label.toLowerCase()})`}
                isDisabled={current <= min}
                onPress={() => setValue(current - 1)}
                className={buttonClasses}
            >
                <Minus aria-hidden="true" className={cx("pointer-events-none", sizes.icon)} />
            </AriaButton>

            <span aria-live="polite" aria-atomic="true" className={cx("text-center font-semibold text-primary tabular-nums", sizes.value)}>
                {current}
                <span className="sr-only"> {current === 1 ? "player" : "players"}</span>
            </span>

            <AriaButton
                slot="increment"
                aria-label={`Add a player (increase ${label.toLowerCase()})`}
                isDisabled={current >= max}
                onPress={() => setValue(current + 1)}
                className={buttonClasses}
            >
                <Plus aria-hidden="true" className={cx("pointer-events-none", sizes.icon)} />
            </AriaButton>
        </AriaGroup>
    );
};

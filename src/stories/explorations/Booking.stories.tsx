import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Check, Flag06, Users01 } from "@untitledui/icons";
import { DateSelector } from "@/components/booking/date-selector";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { PaletteScope, type Palette } from "@/components/foundations/palette-scope";
import { cx } from "@/utils/cx";

/**
 * # Tee Time Booking — color exploration
 *
 * A booking flow rendered three ways — **Green**, **Navy**, and **Green & Navy** —
 * so we can see the brand on interactive controls: the date strip, selectable
 * chips, the summary total, and the confirm action all follow the treatment.
 */
const meta = {
    title: "Explorations/Tee Time Booking",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const TIMES = ["6:50", "7:00", "7:10", "7:20", "7:40", "7:50", "8:10", "8:20", "8:30", "8:50", "9:00", "9:20"];

/** A selectable pill; when selected it fills with the brand color, so it follows the palette. */
const Chip = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
        type="button"
        onClick={onClick}
        className={cx(
            "rounded-lg px-4 py-2 text-sm font-medium ring-1 outline-brand transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2",
            selected ? "bg-brand-solid text-white ring-transparent hover:bg-brand-solid_hover" : "bg-primary text-secondary ring-secondary ring-inset hover:bg-secondary_hover",
        )}
    >
        {children}
    </button>
);

const BookingExploration = ({ mode }: { mode: Palette }) => {
    const heroClass = mode === "green-navy" ? "bg-navy-900" : "bg-brand-section";

    const Panel = () => {
        const [time, setTime] = useState("7:40");
        const [players, setPlayers] = useState(2);
        const [holes, setHoles] = useState<9 | 18>(18);

        const greenFee = holes === 18 ? 95 : 55;
        const cart = 20;
        const subtotal = (greenFee + cart) * players;
        const tax = Math.round(subtotal * 0.06);
        const total = subtotal + tax;

        return (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                {/* Selections */}
                <div className="flex flex-col gap-6 rounded-2xl bg-primary p-6 ring-1 ring-secondary lg:col-span-3">
                    <div className="flex flex-col gap-3">
                        <p className="text-sm font-semibold text-primary">Select a date</p>
                        <DateSelector days={10} defaultValue={new Date()} />
                    </div>

                    <div className="flex flex-col gap-3">
                        <p className="text-sm font-semibold text-primary">Players</p>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4].map((n) => (
                                <Chip key={n} selected={players === n} onClick={() => setPlayers(n)}>
                                    {n}
                                </Chip>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <p className="text-sm font-semibold text-primary">Holes</p>
                        <div className="flex gap-2">
                            <Chip selected={holes === 18} onClick={() => setHoles(18)}>
                                18 holes
                            </Chip>
                            <Chip selected={holes === 9} onClick={() => setHoles(9)}>
                                9 holes
                            </Chip>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <p className="text-sm font-semibold text-primary">Available times</p>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                            {TIMES.map((t) => (
                                <Chip key={t} selected={time === t} onClick={() => setTime(t)}>
                                    {t} AM
                                </Chip>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="flex flex-col gap-5 rounded-2xl bg-primary p-6 ring-1 ring-secondary lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-primary">Your tee time</p>
                        <Badge color="brand" type="pill-color" size="md">
                            Member rate
                        </Badge>
                    </div>

                    <div className="flex flex-col gap-3 border-b border-secondary pb-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-brand-secondary">
                                <Flag06 className="size-4.5 text-fg-brand-primary" aria-hidden="true" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-primary">Sagamore Spring — First tee</p>
                                <p className="text-sm text-tertiary">
                                    {time} AM · {holes} holes
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-brand-secondary">
                                <Users01 className="size-4.5 text-fg-brand-primary" aria-hidden="true" />
                            </div>
                            <p className="text-sm font-medium text-primary">
                                {players} {players === 1 ? "player" : "players"}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                        <Row label={`Green fee × ${players}`} value={`$${greenFee * players}`} />
                        <Row label={`Cart × ${players}`} value={`$${cart * players}`} />
                        <Row label="Tax" value={`$${tax}`} />
                        <div className="mt-1 flex items-center justify-between border-t border-secondary pt-3">
                            <span className="text-md font-semibold text-primary">Total</span>
                            <span className="text-md font-semibold text-primary tabular-nums">${total}</span>
                        </div>
                    </div>

                    <Button color="primary" size="lg" iconLeading={Check} className="w-full">
                        Confirm booking
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <PaletteScope palette={mode} className="min-h-screen bg-secondary">
            <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6 lg:p-8">
                <div className={cx("flex flex-col gap-1 rounded-2xl p-6 md:p-8", heroClass)}>
                    <p className="text-sm font-medium text-white/70">Sagamore Spring Golf Club</p>
                    <h1 className="text-display-sm font-semibold text-white">Book a tee time</h1>
                    <p className="text-md text-white/70">Pick your day, group, and time — pay at the counter or online.</p>
                </div>
                <Panel />
            </div>
        </PaletteScope>
    );
};

const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between text-sm">
        <span className="text-tertiary">{label}</span>
        <span className="font-medium text-primary tabular-nums">{value}</span>
    </div>
);

/** Default brand — green date strip, chips, total, and confirm button. */
export const Green: Story = { name: "Green", render: () => <BookingExploration mode="green" /> };

/** Brand ramp swapped to navy — the same controls render navy. */
export const Navy: Story = { name: "Navy", render: () => <BookingExploration mode="navy" /> };

/** Two-tone — a deep navy hero paired with green selections and the confirm action. */
export const GreenNavy: Story = { name: "Green & Navy", render: () => <BookingExploration mode="green-navy" /> };

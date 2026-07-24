"use client";

import type { FC, SVGProps } from "react";
import { CalendarCheck01, Clock, Flag01, Users01 } from "@untitledui/icons";
import { cx, sortCx } from "@/utils/cx";
import { course, formatPrice, type HoleCount, type Ride } from "@/components/booking/sagamore-data";

const styles = sortCx({
    root: "flex w-full max-w-sm flex-col rounded-2xl bg-primary ring-1 ring-secondary ring-inset",
    header: "flex flex-col gap-0.5 border-b border-secondary px-5 py-4",
    courseName: "text-md font-semibold text-primary",
    courseCity: "text-sm text-tertiary",
    details: "flex flex-wrap gap-x-4 gap-y-2 border-b border-secondary px-5 py-4",
    detail: "flex items-center gap-1.5 text-sm text-secondary",
    detailIcon: "size-4 shrink-0 text-fg-quaternary",
    lineItems: "flex flex-col gap-3 px-5 py-4",
    lineItem: "flex items-center justify-between gap-4 text-sm",
    lineItemLabel: "text-secondary",
    lineItemAmount: "tabular-nums text-primary",
    divider: "mx-5 border-t border-secondary",
    total: "flex items-center justify-between gap-4 px-5 py-4",
    totalLabel: "text-md font-semibold text-primary",
    totalAmount: "text-md font-semibold tabular-nums text-primary",
});

export interface BookingSummaryLineItem {
    label: string;
    amount: number;
}

export interface BookingSummaryProps {
    /** Human date, e.g. "Sat, Jun 21". */
    dateLabel: string;
    /** Tee time, e.g. "7:10 AM". */
    timeLabel: string;
    holes: HoleCount;
    players: number;
    ride: Ride;
    /** Itemized charges shown above the total. */
    lineItems: BookingSummaryLineItem[];
    /** Order total. When omitted, the line items are summed. */
    total?: number;
    className?: string;
}

const rideLabel: Record<Ride, string> = {
    walking: "Walking",
    cart: "Riding cart",
};

interface DetailProps {
    icon: FC<SVGProps<SVGSVGElement>>;
    children: string;
}

const Detail = ({ icon: Icon, children }: DetailProps) => (
    <span className={styles.detail}>
        <Icon className={styles.detailIcon} aria-hidden="true" />
        {children}
    </span>
);

export const BookingSummary = ({ dateLabel, timeLabel, holes, players, ride, lineItems, total, className }: BookingSummaryProps) => {
    const computedTotal = total ?? lineItems.reduce((sum, item) => sum + item.amount, 0);
    const playersLabel = `${players} ${players === 1 ? "player" : "players"}`;

    return (
        <section className={cx(styles.root, className)} aria-label="Booking summary">
            <header className={styles.header}>
                <h3 className={styles.courseName}>{course.name}</h3>
                <p className={styles.courseCity}>{course.city}</p>
            </header>

            <div className={styles.details}>
                <Detail icon={CalendarCheck01}>{dateLabel}</Detail>
                <Detail icon={Clock}>{timeLabel}</Detail>
                <Detail icon={Flag01}>{`${holes} holes`}</Detail>
                <Detail icon={Users01}>{playersLabel}</Detail>
                <Detail icon={CalendarCheck01}>{rideLabel[ride]}</Detail>
            </div>

            <ul className={styles.lineItems}>
                {lineItems.map((item, index) => (
                    <li key={`${item.label}-${index}`} className={styles.lineItem}>
                        <span className={styles.lineItemLabel}>{item.label}</span>
                        <span className={styles.lineItemAmount}>{formatPrice(item.amount)}</span>
                    </li>
                ))}
            </ul>

            <hr className={styles.divider} />

            <div className={styles.total}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalAmount}>{formatPrice(computedTotal)}</span>
            </div>
        </section>
    );
};

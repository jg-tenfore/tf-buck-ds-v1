"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/base/badges/badges";
import { formatPrice, type Booking } from "@/components/booking/sagamore-data";
import { sagamoreImagesByCategory } from "@/components/foundations/sagamore/sagamore-assets";
import { cx, sortCx } from "@/utils/cx";

const styles = sortCx({
    root: "flex items-center gap-4 rounded-2xl bg-primary p-4 ring-1 ring-secondary ring-inset",
    thumbnail: "size-20 shrink-0 rounded-xl object-cover",
    body: "flex min-w-0 flex-1 flex-col gap-1",
    headerRow: "flex items-center gap-2",
    datetime: "truncate text-md font-semibold text-primary",
    details: "truncate text-sm text-tertiary",
    total: "text-sm font-semibold text-primary tabular-nums",
    actions: "flex shrink-0 items-center gap-2",
});

/** Status → Badge color: upcoming reads brand/green, completed gray, cancelled error. */
const statusBadge: Record<Booking["status"], { color: "brand" | "gray" | "error"; label: string }> = {
    upcoming: { color: "brand", label: "Upcoming" },
    completed: { color: "gray", label: "Completed" },
    cancelled: { color: "error", label: "Cancelled" },
};

/** Fallback course thumbnail from the Sagamore photography set. */
const fallbackThumbnail = sagamoreImagesByCategory("photography")[0]?.src ?? "";

export interface RoundCardProps {
    /** A single booked round to render. */
    booking: Booking;
    /** Course thumbnail URL; falls back to a Sagamore photo. */
    thumbnailSrc?: string;
    /** Trailing slot for actions, e.g. View / Cancel buttons. */
    actions?: ReactNode;
    className?: string;
}

/** Build the "18 holes · 4 players · Cart" details line. */
const detailsLine = ({ holes, players, ride }: Booking): string => {
    const playersLabel = `${players} ${players === 1 ? "player" : "players"}`;
    const rideLabel = ride === "cart" ? "Cart" : "Walking";
    return `${holes} holes · ${playersLabel} · ${rideLabel}`;
};

/**
 * A Resy-style reservation card for one booked round in the Sagamore Spring
 * "My rounds" list. Shows a course thumbnail, the date and time prominently, a
 * holes · players · ride details line, a status badge, the party total, and a
 * trailing actions slot. Pure and composable — pass content in via props.
 */
export const RoundCard = ({ booking, thumbnailSrc, actions, className }: RoundCardProps) => {
    const { dateLabel, timeLabel, total, status } = booking;
    const badge = statusBadge[status];
    const src = thumbnailSrc ?? fallbackThumbnail;

    return (
        <div className={cx(styles.root, className)}>
            <img src={src} alt="Sagamore Spring Golf Club" className={styles.thumbnail} />

            <div className={styles.body}>
                <div className={styles.headerRow}>
                    <span className={styles.datetime}>
                        {dateLabel} · {timeLabel}
                    </span>
                    <Badge color={badge.color} size="sm">
                        {badge.label}
                    </Badge>
                </div>
                <span className={styles.details}>{detailsLine(booking)}</span>
                <span className={styles.total}>{formatPrice(total)}</span>
            </div>

            {actions && <div className={styles.actions}>{actions}</div>}
        </div>
    );
};

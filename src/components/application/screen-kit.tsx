import type { ReactNode } from "react";

/**
 * Shared page header for App Screens — a title (optional badge beside it), an
 * optional subtitle, and an optional right-aligned action slot, on a bordered
 * bar. One canonical header so every screen reads the same.
 */
export const PageHeader = ({ title, subtitle, badge, action }: { title: string; subtitle?: ReactNode; badge?: ReactNode; action?: ReactNode }) => (
    <div className="flex flex-col gap-4 border-b border-secondary bg-primary px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div>
            <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-semibold text-primary">{title}</h1>
                {badge}
            </div>
            {subtitle && <p className="mt-0.5 text-sm text-tertiary">{subtitle}</p>}
        </div>
        {action}
    </div>
);

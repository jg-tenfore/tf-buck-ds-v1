import { Tool01 } from "@untitledui/icons";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { PageHeader } from "@/components/application/screen-kit";
import { TENFORE_NAV_ITEMS } from "@/components/application/app-navigation/tenfore-nav-data";

/** Look up the friendly label for a nav URL (falls back to the URL itself). */
const labelForUrl = (url: string): string => {
    for (const section of TENFORE_NAV_ITEMS) {
        if (section.href === url) return section.label;
        for (const item of section.items ?? []) {
            if (item.href === url) return `${section.label} · ${item.label}`;
        }
    }
    return url;
};

/**
 * Shown when a nav destination doesn't have a designed screen yet. Keeps the
 * prototype navigable (never a dead end) and makes it obvious what still needs
 * to be built.
 */
export const MissingScreen = ({ url }: { url: string }) => {
    const label = labelForUrl(url);

    return (
        <>
            <PageHeader title={label.split(" · ").pop() ?? label} subtitle={label} />
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
                <FeaturedIcon icon={Tool01} color="gray" theme="modern" size="lg" />
                <div className="flex flex-col gap-1">
                    <p className="text-lg font-semibold text-primary">Screen not designed yet</p>
                    <p className="max-w-md text-sm text-tertiary">
                        This destination is wired into the navigation but doesn't have a prototype screen yet. Use the sidebar or press{" "}
                        <kbd className="rounded-md border border-secondary bg-secondary px-1.5 py-0.5 font-mono text-xs text-secondary">⌘K</kbd> to jump to a
                        built screen.
                    </p>
                    <p className="mt-1 font-mono text-xs text-quaternary">{url}</p>
                </div>
            </div>
        </>
    );
};

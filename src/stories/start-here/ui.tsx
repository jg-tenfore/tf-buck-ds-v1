import type { CSSProperties, ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { type ImageSource, src } from "./tokens";

/**
 * Building blocks for Storybook's front pages (Start Here, the screen index, the archive note).
 *
 * One layout language for all of them: a hero card with real screens, shot cards that open
 * a prototype, a step strip, a shipped list, decision cards, and ONE set of calls to action
 * (see `Cta`), so links look and behave the same everywhere.
 *
 * Styled with Buck's semantic Tailwind tokens. Every component's root carries `sb-unstyled`,
 * so Storybook's own docs typography (unlayered, so it would beat Tailwind's layered
 * utilities) leaves these pages alone. MDX pages are built from these components only,
 * with no markdown, for the same reason.
 */

const UNSTYLED = "sb-unstyled font-body antialiased";

/* -------------------------------------------------------------------- CTA --- */

type CtaKind = "primary" | "secondary" | "link";

const CTA_KIND: Record<CtaKind, string> = {
    primary: "rounded-lg bg-brand-solid px-4 py-2.5 text-white shadow-xs ring-1 ring-transparent ring-inset hover:bg-brand-solid_hover",
    secondary: "rounded-lg bg-primary px-4 py-2.5 text-secondary shadow-xs ring-1 ring-primary ring-inset hover:bg-primary_hover hover:text-secondary_hover",
    link: "py-0.5 text-brand-secondary hover:text-brand-secondary_hover hover:underline",
};

const inStorybook = (href: string) => href.startsWith("./?path=") || href.startsWith("#");

/**
 * The one call to action. Three weights, one rule each:
 *   primary    the main thing to do in a section (at most one): solid brand green
 *   secondary  an alternative of equal standing: white with a grey outline
 *   link       everything else: green text
 * The arrow says where it goes: ↗ opens another site in a new tab, → stays in Storybook.
 */
export const Cta = ({ href, kind = "link", children }: { href: string; kind?: CtaKind; children: ReactNode }) => {
    const local = inStorybook(href);
    const Icon = local ? ArrowRight : ArrowUpRight;
    return (
        <a
            href={href}
            target={local ? "_top" : "_blank"}
            rel="noreferrer"
            className={cx(
                UNSTYLED,
                "inline-flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap no-underline transition duration-100 ease-linear",
                CTA_KIND[kind],
            )}
        >
            {children}
            <Icon aria-hidden="true" className="size-4 shrink-0" />
        </a>
    );
};

export const CtaRow = ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={cx(UNSTYLED, "flex flex-wrap items-center gap-x-5 gap-y-2.5", className)}>{children}</div>
);

/* ------------------------------------------------------------------ Basics --- */

/** The page wrapper every Start Here MDX page opens with. */
export const Page = ({ children }: { children: ReactNode }) => <div className={cx(UNSTYLED, "pb-8 text-primary")}>{children}</div>;

type ChipTone = "plain" | "brand" | "success" | "warning" | "ink";

const CHIP_TONE: Record<ChipTone, string> = {
    plain: "bg-primary text-secondary ring-primary",
    brand: "bg-brand-primary text-brand-secondary ring-transparent",
    success: "bg-success-primary text-success-primary ring-transparent",
    warning: "bg-warning-primary text-warning-primary ring-transparent",
    ink: "bg-primary-solid text-white ring-transparent",
};

export const Chip = ({ children, tone = "plain" }: { children: ReactNode; tone?: ChipTone }) => (
    <span
        className={cx(UNSTYLED, "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset", CHIP_TONE[tone])}
    >
        {children}
    </span>
);

export const Eyebrow = ({ children, muted }: { children: ReactNode; muted?: boolean }) => (
    <div className={cx(UNSTYLED, "text-xs font-semibold tracking-wider uppercase", muted ? "text-quaternary" : "text-brand-secondary")}>{children}</div>
);

/** A paragraph under a section title. A div, not a p, so MDX never nests paragraphs. */
export const Lead = ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={cx(UNSTYLED, "max-w-3xl text-md text-tertiary", className)}>{children}</div>
);

/** A titled part of a page. Used instead of markdown headings so the type stays Buck's. */
export const Section = ({ id, title, intro, children }: { id?: string; title: string; intro?: ReactNode; children: ReactNode }) => (
    <section id={id} className={cx(UNSTYLED, "mt-14 scroll-mt-6 first:mt-0")}>
        <h2 className="m-0 text-display-xs font-semibold text-primary">{title}</h2>
        {intro && <Lead className="mt-2">{intro}</Lead>}
        <div className="mt-5">{children}</div>
    </section>
);

/** A screenshot in a plain browser window, so a picture of a screen reads as a screen. */
export const BrowserFrame = ({ img, alt, className, style }: { img: ImageSource; alt: string; className?: string; style?: CSSProperties }) => (
    <div className={cx(UNSTYLED, "overflow-hidden rounded-lg bg-primary shadow-lg ring-1 ring-secondary", className)} style={style}>
        <div className="flex gap-1.5 border-b border-secondary bg-secondary px-2.5 py-2" aria-hidden="true">
            <span className="size-2 rounded-full bg-quaternary" />
            <span className="size-2 rounded-full bg-quaternary" />
            <span className="size-2 rounded-full bg-quaternary" />
        </div>
        <img src={src(img)} alt={alt} className="block h-auto w-full" />
    </div>
);

/* -------------------------------------------------------------------- Hero --- */

export interface HeroShot {
    img: ImageSource;
    label: string;
    href?: string;
}

/** Fades the art in from the right, so the words on the left sit on a clean surface. */
const ART_FADE = (stop: number) =>
    `linear-gradient(90deg, var(--color-bg-primary) 0%, color-mix(in srgb, var(--color-bg-primary) 94%, transparent) ${stop}%, color-mix(in srgb, var(--color-bg-primary) 0%, transparent) ${stop + 26}%)`;

/**
 * The page's opening card: what this is in one headline, over the art, with real
 * screens beneath. `size="page"` is the shorter version for every page that isn't
 * the front door; without `art` it becomes a plain card with a green edge.
 */
export const Hero = ({
    eyebrow,
    title,
    lead,
    chips = [],
    art,
    actions,
    shots = [],
    caption,
    size = "front",
}: {
    eyebrow: string;
    title: string;
    lead: ReactNode;
    chips?: string[];
    art?: ImageSource;
    actions?: ReactNode;
    shots?: HeroShot[];
    caption?: string;
    size?: "front" | "page";
}) => {
    const front = size === "front";
    return (
        <div className={cx(UNSTYLED, "mb-10 overflow-hidden rounded-2xl bg-primary ring-1 ring-secondary", !art && "border-l-4 border-brand")}>
            <div className="relative bg-cover" style={art ? { backgroundImage: `url(${src(art)})`, backgroundPosition: "right center" } : undefined}>
                {art && <div className="absolute inset-0" style={{ background: ART_FADE(front ? 44 : 50) }} aria-hidden="true" />}
                <div className={cx("relative", art ? "max-w-[500px]" : "max-w-3xl", front ? "px-9 pt-10 pb-9" : "px-8 py-8")}>
                    <Eyebrow>{eyebrow}</Eyebrow>
                    <h1 className={cx("m-0 mt-3 font-semibold text-primary", front ? "text-display-md" : "text-display-sm")}>{title}</h1>
                    <div className="mt-3 text-lg text-tertiary">{lead}</div>
                    {chips.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                            {chips.map((c) => (
                                <Chip key={c}>{c}</Chip>
                            ))}
                        </div>
                    )}
                    {actions && <div className="mt-6">{actions}</div>}
                </div>
            </div>
            {shots.length > 0 && (
                <div
                    className="grid gap-5 border-t border-secondary bg-secondary px-7 pt-6 pb-5"
                    style={{ gridTemplateColumns: `repeat(${shots.length}, minmax(0, 1fr))` }}
                >
                    {shots.map((s) => {
                        const frame = (
                            <>
                                <BrowserFrame img={s.img} alt={s.label} />
                                <div className="mt-2.5 text-center text-sm font-semibold text-secondary">{s.label}</div>
                            </>
                        );
                        return s.href ? (
                            <a key={s.label} href={s.href} target="_top" className="block no-underline transition duration-100 ease-linear hover:opacity-90">
                                {frame}
                            </a>
                        ) : (
                            <div key={s.label}>{frame}</div>
                        );
                    })}
                </div>
            )}
            {caption && <div className="border-t border-secondary bg-primary px-9 py-3 text-sm text-tertiary">{caption}</div>}
        </div>
    );
};

/* -------------------------------------------------------------- Shot cards --- */

export interface ShotCardProps {
    shot: ImageSource;
    eyebrow: string;
    title: string;
    body: ReactNode;
    /** A second, quieter paragraph: what to look for. */
    note?: ReactNode;
    href: string;
    cta: string;
    links?: [string, string][];
    badge?: string;
}

/** A card that leads somewhere: a real screen, what it is, one link. The whole picture is clickable. */
export const ShotCard = ({ shot, eyebrow, title, body, note, href, cta, links = [], badge }: ShotCardProps) => (
    <div className={cx(UNSTYLED, "flex flex-col rounded-2xl bg-primary p-4 shadow-xs ring-1 ring-secondary")}>
        <a
            href={href}
            target={inStorybook(href) ? "_top" : "_blank"}
            rel="noreferrer"
            className="relative block overflow-hidden rounded-xl bg-secondary px-4 pt-4 no-underline transition duration-100 ease-linear hover:bg-secondary_hover"
        >
            <BrowserFrame img={shot} alt={title} className="rounded-b-none" />
            {badge && <span className="absolute top-2.5 right-2.5 rounded-full bg-brand-solid px-2.5 py-0.5 text-xs font-semibold text-white">{badge}</span>}
        </a>
        <div className="flex flex-1 flex-col gap-1.5 px-1 pt-4 pb-1">
            <Eyebrow>{eyebrow}</Eyebrow>
            <div className="text-lg font-semibold text-primary">{title}</div>
            <div className="text-sm text-tertiary">{body}</div>
            {note && <div className="text-sm text-quaternary">{note}</div>}
            <div className="mt-auto pt-3">
                <CtaRow className="gap-x-4 gap-y-1">
                    <Cta href={href}>{cta}</Cta>
                    {links.map(([label, h]) => (
                        <Cta key={label} href={h}>
                            {label}
                        </Cta>
                    ))}
                </CtaRow>
            </div>
        </div>
    </div>
);

export const CardGrid = ({ children, min = 300 }: { children: ReactNode; min?: number }) => (
    <div className={cx(UNSTYLED, "grid gap-4")} style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))` }}>
        {children}
    </div>
);

/* -------------------------------------------------------------- Mini cards --- */

/** A small card for one short point, optionally leading somewhere. */
export const MiniCard = ({
    eyebrow,
    title,
    children,
    href,
    cta,
    links = [],
    tone = "plain",
}: {
    eyebrow?: string;
    title: string;
    children: ReactNode;
    href?: string;
    cta?: string;
    links?: [string, string][];
    tone?: "plain" | "subtle" | "brand";
}) => (
    <div
        className={cx(
            UNSTYLED,
            "flex flex-col gap-1.5 rounded-2xl px-5 py-4 ring-1 ring-secondary",
            tone === "plain" && "bg-primary shadow-xs",
            tone === "subtle" && "bg-secondary_subtle",
            tone === "brand" && "bg-brand-primary ring-transparent",
        )}
    >
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <div className="text-md font-semibold text-primary">{title}</div>
        <div className="text-sm text-tertiary">{children}</div>
        {((href && cta) || links.length > 0) && (
            <div className="mt-auto pt-2">
                <CtaRow className="gap-x-4 gap-y-1">
                    {href && cta && <Cta href={href}>{cta}</Cta>}
                    {links.map(([label, h]) => (
                        <Cta key={label} href={h}>
                            {label}
                        </Cta>
                    ))}
                </CtaRow>
            </div>
        )}
    </div>
);

/* ------------------------------------------------------------------- Steps --- */

export interface StepItem {
    label: string;
    title: string;
    body: ReactNode;
    meta?: string;
}

/** A strip of steps read left to right. */
export const Steps = ({ items }: { items: StepItem[] }) => (
    <div
        className={cx(UNSTYLED, "grid overflow-hidden rounded-2xl ring-1 ring-secondary")}
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
        {items.map((s, i) => (
            <div key={s.title} className={cx("bg-primary px-4 pt-4 pb-5", i > 0 && "border-l border-secondary")}>
                <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-brand-solid text-xs font-semibold text-white">{i + 1}</span>
                    <Eyebrow>{s.label}</Eyebrow>
                </div>
                <div className="mt-3 text-md font-semibold text-primary">{s.title}</div>
                <div className="mt-1 text-sm text-tertiary">{s.body}</div>
                {s.meta && <div className="mt-2 text-xs font-medium text-quaternary">{s.meta}</div>}
            </div>
        ))}
    </div>
);

/* ---------------------------------------------------------------- Shipped --- */

export interface ShippedItem {
    /** ISO date, e.g. "2026-11-11". */
    date: string;
    title: string;
    pr?: number;
    href?: string;
}

const month = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "long", year: "numeric" });
const day = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });

/** What has shipped to main, newest first, grouped by month, on one track. */
export const Shipped = ({ items }: { items: ShippedItem[] }) => {
    const groups: { month: string; items: ShippedItem[] }[] = [];
    for (const item of items) {
        const m = month(item.date);
        const last = groups[groups.length - 1];
        if (last && last.month === m) last.items.push(item);
        else groups.push({ month: m, items: [item] });
    }
    return (
        <div className={cx(UNSTYLED, "flex flex-col gap-6")}>
            {groups.map((g, gi) => (
                <div key={g.month}>
                    <Eyebrow muted>{g.month}</Eyebrow>
                    <ol className="m-0 mt-2 list-none p-0">
                        {g.items.map((item, i) => {
                            const first = gi === 0 && i === 0;
                            return (
                                <li key={`${item.date}-${item.title}`} className="relative grid grid-cols-[64px_20px_minmax(0,1fr)] items-start gap-2 py-1.5">
                                    <span className="pt-0.5 text-sm text-tertiary tabular-nums">{day(item.date)}</span>
                                    <span className="relative flex h-full justify-center" aria-hidden="true">
                                        <span className="absolute top-0 -bottom-3 w-px bg-border-secondary" />
                                        <span
                                            className={cx(
                                                "relative mt-1.5 size-2.5 rounded-full ring-4 ring-bg-primary",
                                                first ? "bg-brand-solid" : "bg-fg-quaternary",
                                            )}
                                        />
                                    </span>
                                    <span className="text-sm text-secondary">
                                        {item.href ? (
                                            <a
                                                href={item.href}
                                                target="_top"
                                                className="font-medium text-secondary underline underline-offset-2 transition duration-100 ease-linear hover:text-brand-secondary"
                                            >
                                                {item.title}
                                            </a>
                                        ) : (
                                            item.title
                                        )}
                                        {item.pr !== undefined && <span className="ml-2 text-xs text-quaternary">#{item.pr}</span>}
                                    </span>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            ))}
        </div>
    );
};

/* ------------------------------------------------------------ Split example --- */

/** Text on one side, a real screen on the other: a rule, with its proof beside it. */
export const Split = ({
    n,
    eyebrow,
    title,
    children,
    shot,
    caption,
    actions,
}: {
    n?: number | string;
    eyebrow?: string;
    title: string;
    children: ReactNode;
    shot: ImageSource;
    caption: string;
    actions?: ReactNode;
}) => (
    <div
        className={cx(
            UNSTYLED,
            "my-4 grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-center gap-7 rounded-2xl bg-primary p-6 shadow-xs ring-1 ring-secondary",
        )}
    >
        <div>
            <div className="flex items-center gap-2.5">
                {n !== undefined && (
                    <span className="flex size-7 items-center justify-center rounded-full bg-brand-solid text-sm font-semibold text-white">{n}</span>
                )}
                {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            </div>
            <div className="mt-3 text-xl font-semibold text-primary">{title}</div>
            <div className="mt-2 text-sm text-tertiary">{children}</div>
            {actions && <div className="mt-4">{actions}</div>}
        </div>
        <figure className="m-0">
            <div className="rounded-xl bg-secondary p-3.5">
                <BrowserFrame img={shot} alt={caption} />
            </div>
            <figcaption className="mt-2 text-center text-xs text-quaternary">{caption}</figcaption>
        </figure>
    </div>
);

/** A short list: bold lead-in, then the rule. */
export const Points = ({ items }: { items: [string, ReactNode][] }) => (
    <ul className={cx(UNSTYLED, "m-0 grid list-none gap-2 p-0")}>
        {items.map(([lead, text]) => (
            <li key={lead} className="grid grid-cols-[10px_minmax(0,1fr)] items-baseline gap-2.5 text-sm text-tertiary">
                <span className="inline-block size-2 rounded-full bg-fg-brand-primary" aria-hidden="true" />
                <span>
                    <b className="font-semibold text-primary">{lead}</b> {text}
                </span>
            </li>
        ))}
    </ul>
);

/** Inline code, for token and class names. */
export const Code = ({ children }: { children: ReactNode }) => (
    <code className={cx(UNSTYLED, "rounded bg-secondary px-1 py-0.5 font-mono text-xs break-words text-secondary ring-1 ring-secondary ring-inset")}>
        {children}
    </code>
);

/* ----------------------------------------------------------- Decision cards --- */

/** An open decision: the question, both options as built, where it was asked, and links to each. */
export const Decision = ({
    title,
    a,
    b,
    source,
    links = [],
}: {
    title: string;
    a: [string, ReactNode];
    b: [string, ReactNode];
    source: ReactNode;
    links?: [string, string][];
}) => (
    <div className={cx(UNSTYLED, "flex flex-col gap-3 rounded-2xl bg-primary p-5 shadow-xs ring-1 ring-secondary")}>
        <div className="text-md font-semibold text-primary">{title}</div>
        <div className="grid grid-cols-2 gap-2.5">
            {[a, b].map(([label, body]) => (
                <div key={label} className="rounded-xl bg-secondary px-3 py-2.5">
                    <Eyebrow>{label}</Eyebrow>
                    <div className="mt-1 text-sm text-secondary">{body}</div>
                </div>
            ))}
        </div>
        <div className="text-xs text-quaternary">{source}</div>
        {links.length > 0 && (
            <div className="mt-auto">
                <CtaRow className="gap-x-4 gap-y-1">
                    {links.map(([label, h]) => (
                        <Cta key={label} href={h}>
                            {label}
                        </Cta>
                    ))}
                </CtaRow>
            </div>
        )}
    </div>
);

/* ----------------------------------------------------------------- Compare --- */

/** Two screens side by side, each with its name and a link: for concepts that answer the same question. */
export const Compare = ({ items }: { items: { img: ImageSource; label: string; note: ReactNode; href: string }[] }) => (
    <div className={cx(UNSTYLED, "grid grid-cols-2 gap-4 rounded-2xl bg-secondary p-4")}>
        {items.map((s) => (
            <div key={s.label} className="flex flex-col gap-2">
                <a href={s.href} target="_top" className="block no-underline transition duration-100 ease-linear hover:opacity-90">
                    <BrowserFrame img={s.img} alt={s.label} />
                </a>
                <div className="px-1 text-sm font-semibold text-primary">{s.label}</div>
                <div className="px-1 text-sm text-tertiary">{s.note}</div>
                <div className="px-1">
                    <Cta href={s.href}>Open {s.label.split(" ")[0]}</Cta>
                </div>
            </div>
        ))}
    </div>
);

/* ----------------------------------------------------------------- Callout --- */

export const Callout = ({ children, tone = "brand" }: { children: ReactNode; tone?: "brand" | "gray" }) => (
    <div
        className={cx(
            UNSTYLED,
            "my-5 rounded-xl border-l-4 px-5 py-3.5 text-sm text-secondary",
            tone === "brand" ? "border-brand bg-brand-primary" : "border-primary bg-secondary",
        )}
    >
        {children}
    </div>
);

/* ------------------------------------------------------------- Link lists --- */

export interface LinkGroup {
    title: string;
    eyebrow?: string;
    note?: ReactNode;
    links: [string, string][];
}

/** A card of plain links, for indexes: a title, a count, every screen one click away. */
export const LinkCard = ({ title, eyebrow, note, links }: LinkGroup) => (
    <div className={cx(UNSTYLED, "flex flex-col rounded-2xl bg-primary px-5 py-4 shadow-xs ring-1 ring-secondary")}>
        <div className="flex items-baseline justify-between gap-3">
            <div>
                {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
                <div className="mt-0.5 text-md font-semibold text-primary">{title}</div>
            </div>
            <Chip>
                {links.length} {links.length === 1 ? "screen" : "screens"}
            </Chip>
        </div>
        {note && <div className="mt-1 text-xs text-quaternary">{note}</div>}
        <ul className="m-0 mt-3 flex list-none flex-col gap-1 p-0">
            {links.map(([label, href]) => (
                <li key={href}>
                    <a
                        href={href}
                        target="_top"
                        className="group inline-flex items-center gap-1 text-sm font-medium text-secondary no-underline transition duration-100 ease-linear hover:text-brand-secondary"
                    >
                        {label}
                        <ArrowRight
                            aria-hidden="true"
                            className="size-3.5 text-fg-quaternary transition duration-100 ease-linear group-hover:text-fg-brand-primary"
                        />
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

/* ---------------------------------------------------------------- Archived --- */

/** The one-line note an archived page opens with: that it is archived, and what replaced it. */
export const Archived = ({ children, href, cta }: { children: ReactNode; href: string; cta: string }) => (
    <div
        className={cx(
            UNSTYLED,
            "my-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border-l-4 border-primary bg-secondary px-5 py-3 text-sm text-secondary",
        )}
    >
        <Chip tone="ink">Archived</Chip>
        <span className="flex-[1_1_320px]">{children}</span>
        <Cta href={href}>{cta}</Cta>
    </div>
);

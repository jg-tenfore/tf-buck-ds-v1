"use client";

import { money } from "../migration-v2/data";
import type { Combination } from "./data";
import { COMBINATIONS, TAX_RATES, cardTotals, expirationLabel, kindMeta } from "./data";
import { ItemRow } from "./page-sections";

/** One hypothetical punch card as a compact, read-only preview. */
export const CombinationPreview = ({ combo }: { combo: Combination }) => {
    const { card } = combo;
    const kinds = [...new Set(card.items.map((i) => kindMeta(i.kind).label))];
    return (
        <article className="flex flex-col gap-4 rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary">
            <header className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-xs font-semibold tracking-wider text-brand-secondary uppercase">{combo.name}</span>
                    <h3 className="text-lg font-semibold text-primary">{card.title}</h3>
                    <p className="text-sm text-tertiary">{card.description}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end">
                    <span className="text-lg font-semibold text-primary tabular-nums">{money(card.price)}</span>
                    <span className="text-xs text-tertiary tabular-nums">{money(cardTotals(card).total)} with tax</span>
                </div>
            </header>
            <ul className="divide-y divide-secondary rounded-xl ring-1 ring-secondary">
                {card.items.map((item) => (
                    <ItemRow key={item.id} item={item} readOnly />
                ))}
            </ul>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                <dt className="text-tertiary">Kinds</dt>
                <dd className="text-secondary">{kinds.join(", ")}</dd>
                <dt className="text-tertiary">Tax</dt>
                <dd className="text-secondary">{TAX_RATES.find((t) => t.value === card.tax)?.label}</dd>
                <dt className="text-tertiary">Expires</dt>
                <dd className="text-secondary">{expirationLabel(card.expiration)}</dd>
                <dt className="text-tertiary">Courses</dt>
                <dd className="text-secondary">{card.courses.join(", ")}</dd>
            </dl>
            <p className="border-t border-secondary pt-3 text-xs text-tertiary">{combo.why}</p>
        </article>
    );
};

/** Every hypothetical side by side, simplest first. */
export const CombinationsGallery = () => (
    <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
        {COMBINATIONS.map((combo) => (
            <CombinationPreview key={combo.id} combo={combo} />
        ))}
    </div>
);

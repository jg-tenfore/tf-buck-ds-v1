"use client";

import { useState } from "react";
import { Plus, Printer, RefreshCcw01, XClose } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { money } from "../migration-v2/data";
import { PRICE_DISPLAY, PRODUCTS_NAV, SECONDARY_LABELS, STAR_PAPER, STAR_PRINTER_LIST, STICKER_GROUPS, STICKER_PRODUCTS, STICKER_TAX } from "./data";
import { FieldGrid, ProductsPage, SectionCard, SectionEmpty, SelectField, Toast } from "./kit";

type Printer = "star" | "dymo" | "avery";
type Product = { name: string; sku: string; price: number };
type Sticker = { id: number; product: Product; secondaryLabel: string; secondaryPrice: string };

const META: Record<Printer, { nav: string; crumb: string; title: string; description: string }> = {
    star: { nav: PRODUCTS_NAV.star, crumb: "Star", title: "Price Stickers · Star", description: "Print price stickers to a Star thermal printer." },
    dymo: { nav: PRODUCTS_NAV.dymo, crumb: "Dymo", title: "Price Stickers · Dymo", description: "Print price stickers to a Dymo label printer." },
    avery: {
        nav: PRODUCTS_NAV.avery,
        crumb: "Avery 5160",
        title: "Price Stickers · Avery 5160",
        description: "Lay out price stickers on Avery 5160 sheets (30 per page).",
    },
};

const SHEET = 30;

/** A sticker as it prints: product, big price, SKU bars, and an optional second price. */
const StickerPreview = ({
    product,
    display = PRICE_DISPLAY[0],
    secondaryLabel,
    secondaryPrice,
    small,
}: {
    product?: Product;
    display?: string;
    secondaryLabel?: string;
    secondaryPrice?: string;
    small?: boolean;
}) => {
    if (!product) return <div className={cx("rounded-md border border-dashed border-primary", small ? "h-14" : "h-36 w-64")} />;
    const after = product.price * (1 + STICKER_TAX);
    const main = display === PRICE_DISPLAY[1] ? after : product.price;
    return (
        <div
            className={cx(
                "flex flex-col justify-between rounded-md bg-white text-gray-900 ring-1 ring-gray-300",
                small ? "h-14 p-1.5" : "h-36 w-64 p-3 shadow-xs",
            )}
        >
            <p className={cx("truncate font-semibold", small ? "text-[9px]" : "text-sm")}>{product.name}</p>
            <div className="flex items-end justify-between gap-2">
                <div>
                    <p className={cx("leading-none font-bold tabular-nums", small ? "text-xs" : "text-display-xs")}>{money(main)}</p>
                    {!small && display === PRICE_DISPLAY[2] && <p className="mt-1 text-xs text-gray-600">{money(after)} with tax</p>}
                    {secondaryLabel && secondaryLabel !== "None" && secondaryPrice && (
                        <p className={cx("mt-0.5 font-medium text-gray-700", small ? "text-[8px]" : "text-xs")}>
                            {secondaryLabel}: {money(Number(secondaryPrice) || 0)}
                        </p>
                    )}
                </div>
                {!small && (
                    <div className="flex flex-col items-end gap-0.5">
                        <div className="flex h-7 items-end gap-px">
                            {product.sku.split("").map((d, i) => (
                                <span key={i} className="bg-gray-900" style={{ width: (Number(d) % 3) + 1, height: "100%" }} />
                            ))}
                        </div>
                        <span className="text-[10px] tabular-nums">{product.sku}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * Products › Price Stickers (Star, Dymo, Avery 5160): a print tool, not a list
 * of records, so no tab strip. Print is the primary action at the top and
 * lights up once there's something to print; a live preview replaces guessing.
 */
export const PriceStickersPage = ({ printer, initialProduct, initialSheet = 0 }: { printer: Printer; initialProduct?: string; initialSheet?: number }) => {
    const meta = META[printer];
    const startGroup = initialProduct ? (STICKER_GROUPS.find((g) => STICKER_PRODUCTS[g].some((p) => p.name === initialProduct)) ?? "") : "";
    const [group, setGroup] = useState(startGroup);
    const [productName, setProductName] = useState(initialProduct ?? "");
    const [count, setCount] = useState("1");
    const [star, setStar] = useState({ printer: "", display: PRICE_DISPLAY[0], paper: "" });
    const [secondaryLabel, setSecondaryLabel] = useState("None");
    const [secondaryPrice, setSecondaryPrice] = useState("");
    const [sheet, setSheet] = useState<Sticker[]>(() =>
        Array.from({ length: initialSheet }, (_, i) => ({ id: i, product: STICKER_PRODUCTS["Golf Balls"][i % 3], secondaryLabel: "None", secondaryPrice: "" })),
    );
    const [message, setMessage] = useState<string | null>(null);
    const products = group ? STICKER_PRODUCTS[group] : [];
    const product = products.find((p) => p.name === productName);
    const n = Math.max(0, Math.floor(Number(count) || 0));
    const room = SHEET - sheet.length;

    const canPrint = printer === "avery" ? sheet.length > 0 : Boolean(product && n > 0 && (printer !== "star" || (star.printer && star.paper)));
    const print = () =>
        setMessage(
            printer === "avery"
                ? `Sheet with ${sheet.length} ${sheet.length === 1 ? "sticker" : "stickers"} sent to the printer.`
                : `${n} ${n === 1 ? "sticker" : "stickers"} for ${product!.name} sent to ${printer === "star" ? star.printer : "the Dymo printer"}.`,
        );

    return (
        <ProductsPage
            navId={meta.nav}
            crumbs={["Products", "Price Stickers", meta.crumb]}
            title={meta.title}
            description={meta.description}
            primary={{
                id: "print",
                label: printer === "avery" ? "Print sheet" : n > 1 ? `Print ${n} stickers` : "Print sticker",
                icon: Printer,
                isDisabled: !canPrint,
                onAction: print,
            }}
            secondary={printer === "avery" && sheet.length ? [{ id: "reset", label: "Clear sheet", icon: RefreshCcw01, onAction: () => setSheet([]) }] : []}
            lists={[]}
        >
            <div className="flex flex-col gap-5">
                <Toast message={message} onDismiss={() => setMessage(null)} />
                <SectionCard title="Product" description="Pick a group to narrow the list, then the product.">
                    <FieldGrid>
                        <SelectField
                            label="Product group"
                            value={group}
                            onChange={(v) => {
                                setGroup(v);
                                setProductName("");
                            }}
                            options={[{ value: "", label: "Select a group" }, ...STICKER_GROUPS]}
                        />
                        <SelectField
                            label="Product"
                            value={productName}
                            onChange={setProductName}
                            options={[
                                { value: "", label: group ? "Select a product" : "Pick a group first" },
                                ...products.map((p) => ({ value: p.name, label: `${p.name} · ${money(p.price)}` })),
                            ]}
                        />
                    </FieldGrid>
                </SectionCard>
                <SectionCard
                    title="Sticker"
                    description={printer === "star" ? "Printer, paper and which price to show." : "How many, and an optional second price (member, sale, was)."}
                >
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
                        {printer === "star" ? (
                            <FieldGrid>
                                <SelectField
                                    label="Printer"
                                    value={star.printer}
                                    onChange={(v) => setStar({ ...star, printer: v })}
                                    options={[{ value: "", label: "Select a printer" }, ...STAR_PRINTER_LIST]}
                                />
                                <Input label="Number of stickers" inputMode="numeric" value={count} onChange={setCount} />
                                <SelectField
                                    label="Price to display"
                                    value={star.display}
                                    onChange={(v) => setStar({ ...star, display: v })}
                                    options={PRICE_DISPLAY}
                                />
                                <SelectField
                                    label="Label paper"
                                    value={star.paper}
                                    onChange={(v) => setStar({ ...star, paper: v })}
                                    options={[{ value: "", label: "Select paper type" }, ...STAR_PAPER]}
                                />
                            </FieldGrid>
                        ) : (
                            <FieldGrid cols={3}>
                                <Input
                                    label={printer === "avery" ? `Number of stickers (${room} left)` : "Number of stickers"}
                                    inputMode="numeric"
                                    value={count}
                                    onChange={setCount}
                                />
                                <SelectField label="Second price label" value={secondaryLabel} onChange={setSecondaryLabel} options={SECONDARY_LABELS} />
                                <Input
                                    label="Second price"
                                    hint="Optional"
                                    inputMode="decimal"
                                    placeholder="0.00"
                                    value={secondaryPrice}
                                    onChange={setSecondaryPrice}
                                    isDisabled={secondaryLabel === "None"}
                                />
                            </FieldGrid>
                        )}
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-secondary">Preview</span>
                            <StickerPreview product={product} display={star.display} secondaryLabel={secondaryLabel} secondaryPrice={secondaryPrice} />
                        </div>
                    </div>
                    {printer === "avery" && (
                        <div>
                            <Button
                                color="secondary"
                                size="md"
                                iconLeading={Plus}
                                isDisabled={!product || n < 1 || room < 1}
                                onClick={() => {
                                    const add = Math.min(n, room);
                                    setSheet((s) => [
                                        ...s,
                                        ...Array.from({ length: add }, (_, i) => ({ id: Date.now() + i, product: product!, secondaryLabel, secondaryPrice })),
                                    ]);
                                }}
                            >
                                Add {Math.min(n, room) || ""} to sheet
                            </Button>
                        </div>
                    )}
                </SectionCard>
                {printer === "avery" && (
                    <SectionCard title="Sheet" description={`${sheet.length} of ${SHEET} labels used. Click a label to remove it.`}>
                        {sheet.length ? (
                            <div className="grid max-w-3xl grid-cols-3 gap-2 rounded-lg bg-secondary p-3">
                                {Array.from({ length: SHEET }, (_, i) => {
                                    const s = sheet[i];
                                    return s ? (
                                        <button
                                            key={s.id}
                                            type="button"
                                            aria-label={`Remove ${s.product.name} label`}
                                            onClick={() => setSheet((all) => all.filter((x) => x.id !== s.id))}
                                            className="group relative cursor-pointer text-left"
                                        >
                                            <StickerPreview product={s.product} secondaryLabel={s.secondaryLabel} secondaryPrice={s.secondaryPrice} small />
                                            <XClose className="absolute top-1 right-1 hidden size-3 text-gray-600 group-hover:block" />
                                        </button>
                                    ) : (
                                        <StickerPreview key={`empty-${i}`} small />
                                    );
                                })}
                            </div>
                        ) : (
                            <SectionEmpty>No stickers yet. Pick a product and use Add to sheet.</SectionEmpty>
                        )}
                    </SectionCard>
                )}
            </div>
        </ProductsPage>
    );
};

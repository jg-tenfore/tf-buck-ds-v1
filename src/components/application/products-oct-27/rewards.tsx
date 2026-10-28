"use client";

import { useState } from "react";
import { Plus, Save01, Trash01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { InnerTabs } from "../migration-v2/kit";
import { PRODUCTS_NAV, PRODUCT_GROUPS, REWARD_PRODUCTS, REWARD_TEE_FEES, REWARD_TRANSPORTATION, REWARD_TYPES, type RewardRow, type RewardRow18 } from "./data";
import { ProductsPage, RowIconButton, STd, STh, SectionCard, SectionEmpty, SectionTable, SelectField, Toast } from "./kit";

const Cell = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div className="w-24">
        <Input aria-label={label} size="sm" inputMode="numeric" value={value} onChange={onChange} />
    </div>
);

/**
 * Products › Rewards: a settings page, not a list of records, so there's no
 * tab strip. Save changes is the primary action at the top and only lights up
 * once something has changed.
 */
export const RewardsPage = ({ initialTab = "products" }: { initialTab?: "products" | "tee" | "transport" }) => {
    const initial = { days: "365", products: REWARD_PRODUCTS, tee: REWARD_TEE_FEES, transport: REWARD_TRANSPORTATION };
    const [saved, setSaved] = useState(initial);
    const [form, setForm] = useState(initial);
    const [tab, setTab] = useState<string>(initialTab);
    const [add, setAdd] = useState({ type: REWARD_TYPES[0], target: "", value: "", cost: "" });
    const [message, setMessage] = useState<string | null>(null);
    const dirty = JSON.stringify(form) !== JSON.stringify(saved);

    const setRow = <K extends "products" | "tee" | "transport">(key: K, id: string, patch: Partial<(typeof form)[K][number]>) =>
        setForm((f) => ({ ...f, [key]: (f[key] as (RewardRow | RewardRow18)[]).map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
    const removeRow = (key: "products" | "tee" | "transport", id: string) =>
        setForm((f) => ({ ...f, [key]: (f[key] as { id: string }[]).filter((r) => r.id !== id) }));
    const targets =
        add.type === "Product group"
            ? PRODUCT_GROUPS.map((g) => g.name)
            : add.type === "Product"
              ? REWARD_PRODUCTS.map((r) => r.name)
              : add.type === "Tee fee"
                ? REWARD_TEE_FEES.map((r) => r.name)
                : ["Dunes Cart"];

    const assign = () => {
        if (add.type === "Product group") {
            setMessage(`Reward value ${add.value || 0} and cost ${add.cost || 0} assigned to every product in ${add.target}. Save to apply.`);
            setForm((f) => ({ ...f, products: [...f.products, { id: `n${Date.now()}`, name: `${add.target} (group)`, value: add.value, cost: add.cost }] }));
        } else if (add.type === "Product") {
            setForm((f) => ({
                ...f,
                products: f.products.some((r) => r.name === add.target)
                    ? f.products.map((r) => (r.name === add.target ? { ...r, value: add.value, cost: add.cost } : r))
                    : [...f.products, { id: `n${Date.now()}`, name: add.target, value: add.value, cost: add.cost }],
            }));
        } else {
            const key = add.type === "Tee fee" ? "tee" : "transport";
            setForm((f) => ({ ...f, [key]: f[key].map((r) => (r.name === add.target ? { ...r, v18: add.value, c18: add.cost } : r)) }));
        }
        setAdd({ ...add, target: "", value: "", cost: "" });
    };

    return (
        <ProductsPage
            navId={PRODUCTS_NAV.rewards}
            crumbs={["Products", "Rewards"]}
            title="Rewards"
            description="How members earn and redeem reward points."
            primary={{
                id: "save",
                label: "Save changes",
                icon: Save01,
                isDisabled: !dirty,
                onAction: () => {
                    setSaved(form);
                    setMessage("Rewards saved.");
                },
            }}
            secondary={
                dirty
                    ? [
                          {
                              id: "discard",
                              label: "Discard changes",
                              onAction: () => {
                                  setForm(saved);
                                  setMessage(null);
                              },
                          },
                      ]
                    : []
            }
            lists={[]}
        >
            <div className="flex flex-col gap-5">
                <Toast message={message} onDismiss={() => setMessage(null)} />
                <SectionCard title="Expiration" description="Points not redeemed within this many days of being earned expire.">
                    <div className="max-w-48">
                        <Input label="Days before rewards expire" inputMode="numeric" value={form.days} onChange={(v) => setForm((f) => ({ ...f, days: v }))} />
                    </div>
                </SectionCard>
                <SectionCard
                    title="Add Rewards"
                    description="Set points earned (value) and points to redeem (cost) for a product, a whole group, a tee fee or transportation."
                >
                    <div className="flex flex-wrap items-end gap-3">
                        <div className="w-44">
                            <SelectField
                                label="Reward type"
                                value={add.type}
                                onChange={(v) => setAdd({ ...add, type: v, target: "" })}
                                options={REWARD_TYPES}
                            />
                        </div>
                        <div className="min-w-56 flex-1">
                            <SelectField
                                label={add.type}
                                value={add.target}
                                onChange={(v) => setAdd({ ...add, target: v })}
                                options={[{ value: "", label: `Select ${add.type.toLowerCase()}` }, ...targets]}
                            />
                        </div>
                        <div className="w-32">
                            <Input
                                label="Reward value"
                                tooltip="Points earned when bought"
                                placeholder="Points"
                                inputMode="numeric"
                                value={add.value}
                                onChange={(v) => setAdd({ ...add, value: v })}
                            />
                        </div>
                        <div className="w-32">
                            <Input
                                label="Reward cost"
                                tooltip="Points needed to redeem it"
                                placeholder="Points"
                                inputMode="numeric"
                                value={add.cost}
                                onChange={(v) => setAdd({ ...add, cost: v })}
                            />
                        </div>
                        <Button color="secondary" size="md" iconLeading={Plus} isDisabled={!add.target || (!add.value && !add.cost)} onClick={assign}>
                            {add.type === "Product group" ? "Assign to group" : "Assign"}
                        </Button>
                    </div>
                </SectionCard>
                <SectionCard title="Points by Item" description="Edit any value or cost in place, then Save changes at the top.">
                    <InnerTabs
                        tabs={[
                            { id: "products", label: `Products (${form.products.length})` },
                            { id: "tee", label: `Tee fees (${form.tee.length})` },
                            { id: "transport", label: `Transportation (${form.transport.length})` },
                        ]}
                        activeId={tab}
                        onChange={setTab}
                    />
                    {tab === "products" ? (
                        <SectionTable
                            head={
                                <tr>
                                    <STh>Product</STh>
                                    <STh>Reward value</STh>
                                    <STh>Reward cost</STh>
                                    <STh />
                                </tr>
                            }
                            empty={!form.products.length && <SectionEmpty>No product rewards.</SectionEmpty>}
                        >
                            {form.products.map((r) => (
                                <tr key={r.id}>
                                    <STd className="font-medium text-primary">{r.name}</STd>
                                    <STd className="py-1.5">
                                        <Cell label={`${r.name} value`} value={r.value} onChange={(v) => setRow("products", r.id, { value: v })} />
                                    </STd>
                                    <STd className="py-1.5">
                                        <Cell label={`${r.name} cost`} value={r.cost} onChange={(v) => setRow("products", r.id, { cost: v })} />
                                    </STd>
                                    <STd className="py-1.5">
                                        <div className="flex justify-end">
                                            <RowIconButton label={`Remove ${r.name}`} icon={Trash01} destructive onClick={() => removeRow("products", r.id)} />
                                        </div>
                                    </STd>
                                </tr>
                            ))}
                        </SectionTable>
                    ) : (
                        <SectionTable
                            head={
                                <tr>
                                    <STh>{tab === "tee" ? "Tee fee" : "Transportation"}</STh>
                                    <STh>Value (18)</STh>
                                    <STh>Cost (18)</STh>
                                    <STh>Value (9)</STh>
                                    <STh>Cost (9)</STh>
                                    <STh />
                                </tr>
                            }
                        >
                            {(tab === "tee" ? form.tee : form.transport).map((r) => {
                                const key = tab === "tee" ? "tee" : "transport";
                                return (
                                    <tr key={r.id}>
                                        <STd className="font-medium text-primary">{r.name}</STd>
                                        {(["v18", "c18", "v9", "c9"] as const).map((k) => (
                                            <STd key={k} className="py-1.5">
                                                <Cell label={`${r.name} ${k}`} value={r[k]} onChange={(v) => setRow(key, r.id, { [k]: v })} />
                                            </STd>
                                        ))}
                                        <STd className="py-1.5">
                                            <div className="flex justify-end">
                                                <RowIconButton label={`Remove ${r.name}`} icon={Trash01} destructive onClick={() => removeRow(key, r.id)} />
                                            </div>
                                        </STd>
                                    </tr>
                                );
                            })}
                        </SectionTable>
                    )}
                </SectionCard>
            </div>
        </ProductsPage>
    );
};

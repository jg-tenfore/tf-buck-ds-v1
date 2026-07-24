import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    Copy01,
    Download01,
    FilterLines,
    Grid01,
    PackagePlus,
    Plus,
    Rows01,
    SearchLg,
    SlashCircle01,
    Star01,
    Tag01,
    Truck01,
} from "@untitledui/icons";
import { AppShell } from "@/components/application/app-navigation/app-shell";
import { PageHeader } from "@/components/application/screen-kit";
import { MetricCard } from "@/components/application/metrics/metric-card";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";

const meta = {
    title: "App Screens/Products",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;


/** Store product images are served from `/store-images/<category>/<subcategory>/<file>`. */
const img = (path: string) => `/store-images/${path}`;

type CategoryName = "Men's Apparel" | "Women's Apparel" | "Golf Shoes" | "Golf Balls" | "Accessories";

const categoryColor: Record<CategoryName, "blue" | "pink" | "purple" | "success" | "orange"> = {
    "Men's Apparel": "blue",
    "Women's Apparel": "pink",
    "Golf Shoes": "purple",
    "Golf Balls": "success",
    Accessories: "orange",
};

interface Product {
    id: string;
    name: string;
    category: CategoryName;
    group: string;
    src: string;
    sku: string;
    price: number;
    cost: number;
    stock: number;
}

/** Real Pro Shop catalog data — titles + imagery pulled from the store asset library. */
const products: Product[] = [
    { id: "77410", name: "Dri-Fit Men's Good Blade Golf Polo Shirt", category: "Men's Apparel", group: "Apparel", src: img("apparel/mens/2000000054595-59-01_pc-dd5b6a8095.webp"), sku: "2104455887", price: 85, cost: 42, stock: 34 },
    { id: "77411", name: "Ultimate 365+ Men's 8.5\" Golf Shorts", category: "Men's Apparel", group: "Apparel", src: img("apparel/mens/2000000054136-5-01_pc-bcf5b790db.webp"), sku: "2104455901", price: 80, cost: 38, stock: 21 },
    { id: "77412", name: "Featherweight Festival Men's Golf Polo", category: "Men's Apparel", group: "Apparel", src: img("apparel/mens/2000000055336-18-01_pc-bd0c08a74e.webp"), sku: "2104456012", price: 90, cost: 44, stock: 7 },
    { id: "77413", name: "Continental Drift Men's Golf Polo", category: "Men's Apparel", group: "Apparel", src: img("apparel/mens/2000000055380-1-01_pc-64326107b6.webp"), sku: "2104456120", price: 88, cost: 43, stock: 0 },
    { id: "77420", name: "Moveknit Zip 2.0 Women's Golf Dress", category: "Women's Apparel", group: "Apparel", src: img("apparel/womens/2000000045603-1109-01_pc-aa571058bd.webp"), sku: "2104460031", price: 128, cost: 61, stock: 12 },
    { id: "77421", name: "Knockout A-Line Women's 16\" Golf Skort", category: "Women's Apparel", group: "Apparel", src: img("apparel/womens/2000000054265-38-01_pc-bd6d26ccfc.webp"), sku: "2104460148", price: 80, cost: 37, stock: 18 },
    { id: "77422", name: "Victory Dri-Fit Women's Golf Polo", category: "Women's Apparel", group: "Apparel", src: img("apparel/womens/2000000054804-927-01_pc-875e548c54.webp"), sku: "2104460255", price: 75, cost: 35, stock: 5 },
    { id: "77430", name: "S-Casual Men's Spikeless Golf Shoes", category: "Golf Shoes", group: "Shoes", src: img("shoes/golf-shoes/2000000047011-5-01_pc-faed680eec.webp"), sku: "2104470118", price: 140, cost: 74, stock: 16 },
    { id: "77431", name: "Fresh Foam Contend v3 Golf Shoes", category: "Golf Shoes", group: "Shoes", src: img("shoes/golf-shoes/2000000055152-39-01_pc-08b315caf1.webp"), sku: "2104470225", price: 130, cost: 68, stock: 9 },
    { id: "77432", name: "Jordan Grind Men's Spikeless Golf Shoes", category: "Golf Shoes", group: "Shoes", src: img("shoes/golf-shoes/2000000056604-87-01_pc-bec7c35579.webp"), sku: "2104470332", price: 210, cost: 118, stock: 4 },
    { id: "77440", name: "TP5x MySymbol 2026 Golf Balls", category: "Golf Balls", group: "Golf Balls", src: img("equipment/golf-balls/2000000042256-92-01_pc-73b40dc309.webp"), sku: "2104480119", price: 55, cost: 32, stock: 58 },
    { id: "77441", name: "Tour Response 2026 Golf Balls", category: "Golf Balls", group: "Golf Balls", src: img("equipment/golf-balls/2000000058262-92-01_pc-7bd37b5e01.webp"), sku: "2104480226", price: 40, cost: 24, stock: 42 },
    { id: "77442", name: "Pro V1 Georgia Tech Golf Balls", category: "Golf Balls", group: "Golf Balls", src: img("equipment/golf-balls/2000000059503-01_pc-9933da1b38.webp"), sku: "2104480333", price: 55, cost: 33, stock: 26 },
    { id: "77443", name: "Supersoft USA 250 Golf Balls 2026", category: "Golf Balls", group: "Golf Balls", src: img("equipment/golf-balls/2000000059357-01_pc-1b849979d7.webp"), sku: "2104480440", price: 28, cost: 16, stock: 6 },
    { id: "77450", name: "Titleist Players Golf Glove", category: "Accessories", group: "Gloves", src: img("equipment/accessories-and-training/0200211000123-01_pc-51c422a3e2.webp"), sku: "2104490117", price: 26, cost: 12, stock: 47 },
    { id: "77451", name: "Approach S44 Golf GPS Watch", category: "Accessories", group: "Accessories", src: img("equipment/accessories-and-training/2000000050686-117-01_pc-e8807554a6.webp"), sku: "2104490224", price: 400, cost: 268, stock: 3 },
    { id: "77452", name: "Club Scrub Pro", category: "Accessories", group: "Accessories", src: img("equipment/accessories-and-training/2000000050257-01_pc-070a7c27c5.webp"), sku: "2104490331", price: 15, cost: 6, stock: 0 },
];

const usd = (n: number) => `$${n.toFixed(2)}`;

const stockBadge = (stock: number) =>
    stock === 0 ? (
        <Badge size="sm" type="pill-color" color="error">
            Out of stock
        </Badge>
    ) : stock <= 8 ? (
        <Badge size="sm" type="pill-color" color="warning">
            Low · {stock}
        </Badge>
    ) : (
        <Badge size="sm" type="pill-color" color="success">
            In stock · {stock}
        </Badge>
    );

/* ------------------------------------------------------------------ */
/* Products — Pro Shop catalog grid                                    */
/* ------------------------------------------------------------------ */

/** Products list restyled as a Pro Shop catalog: KPI row, filter chips, and a product-card grid with real store imagery. */
export const List: Story = {
    render: () => (
        <AppShell activeUrl="/products/list">
            <PageHeader
                title="Products"
                subtitle="Everything sold in the Pro Shop, snack bar, and online store."
                action={
                    <div className="flex items-center gap-2">
                        <Button size="md" color="secondary" iconLeading={Star01}>
                            Featured
                        </Button>
                        <Button size="md" color="secondary" iconLeading={Copy01}>
                            Copy to…
                        </Button>
                        <Button size="md" iconLeading={Plus}>
                            New product
                        </Button>
                    </div>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard title="Active products" value="1,284" change={3.2} icon={Tag01} />
                    <MetricCard title="Inventory value" value="$186.4k" change={5.8} icon={Truck01} />
                    <MetricCard title="Low stock" value="42" change={-8.1} changeLabel="vs last week" icon={SlashCircle01} />
                    <MetricCard title="Sold this month" value="3,972" change={12.4} icon={CheckCircle} />
                </div>

                {/* Category filter chips */}
                <div className="flex flex-wrap gap-2">
                    {["All products", "Men's Apparel", "Women's Apparel", "Golf Shoes", "Golf Balls", "Accessories"].map((cat, i) => (
                        <button
                            key={cat}
                            type="button"
                            className={
                                i === 0
                                    ? "rounded-full bg-brand-solid px-3 py-1.5 text-sm font-medium text-white"
                                    : "rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-secondary ring-1 ring-secondary ring-inset hover:bg-primary_hover"
                            }
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Toolbar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Input size="sm" aria-label="Search products" placeholder="Search products, SKUs…" icon={SearchLg} wrapperClassName="sm:w-96" />
                    <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-lg bg-primary p-0.5 ring-1 ring-secondary ring-inset">
                            <span className="flex size-8 items-center justify-center rounded-md bg-active text-fg-secondary">
                                <Grid01 className="size-4" aria-hidden="true" />
                            </span>
                            <span className="flex size-8 items-center justify-center rounded-md text-fg-quaternary">
                                <Rows01 className="size-4" aria-hidden="true" />
                            </span>
                        </div>
                        <Button size="sm" color="secondary" iconLeading={FilterLines}>
                            Filters
                        </Button>
                        <Button size="sm" color="secondary" iconLeading={Download01}>
                            Export
                        </Button>
                    </div>
                </div>

                {/* Product grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((p) => (
                        <div key={p.id} className="group flex flex-col overflow-hidden rounded-xl bg-primary ring-1 ring-secondary ring-inset transition duration-100 ease-linear hover:ring-brand">
                            <div className="relative aspect-square bg-secondary p-4">
                                <img src={p.src} alt={p.name} className="size-full object-contain" loading="lazy" />
                                <div className="absolute top-3 left-3">
                                    <Badge size="sm" type="pill-color" color={categoryColor[p.category]}>
                                        {p.category}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col gap-3 p-4">
                                <div className="flex flex-1 flex-col gap-1">
                                    <p className="line-clamp-2 text-sm font-semibold text-primary">{p.name}</p>
                                    <p className="text-xs text-tertiary tabular-nums">SKU {p.sku}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold text-primary tabular-nums">{usd(p.price)}</span>
                                    {stockBadge(p.stock)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-secondary pt-4">
                    <Button size="sm" color="secondary" iconLeading={ArrowLeft}>
                        Previous
                    </Button>
                    <span className="text-sm text-tertiary">Page 1 of 74</span>
                    <Button size="sm" color="secondary" iconTrailing={ArrowRight}>
                        Next
                    </Button>
                </div>
            </div>
        </AppShell>
    ),
};

/* ------------------------------------------------------------------ */
/* Product Groups                                                      */
/* ------------------------------------------------------------------ */

interface ProductGroup {
    id: string;
    name: string;
    family: string;
    sellOnline: boolean;
    glCode: string;
    qbClass: string;
    src: string;
    products: number;
}

const groups: ProductGroup[] = [
    { id: "395", name: "Golf Balls", family: "Pro Shop Merch", sellOnline: true, glCode: "4500", qbClass: "Retail", src: img("equipment/golf-balls/2000000058262-92-01_pc-7bd37b5e01.webp"), products: 64 },
    { id: "436", name: "Clubs", family: "Pro Shop Merch", sellOnline: true, glCode: "132134", qbClass: "Retail", src: img("shoes/golf-shoes/2000000053981-87-01_pc-59a8c0130f.webp"), products: 38 },
    { id: "438", name: "Shoes", family: "Pro Shop Merch", sellOnline: true, glCode: "1120", qbClass: "Retail", src: img("shoes/golf-shoes/2000000056604-87-01_pc-bec7c35579.webp"), products: 47 },
    { id: "439", name: "Accessories", family: "Pro Shop Merch", sellOnline: true, glCode: "112025", qbClass: "Retail", src: img("equipment/accessories-and-training/2000000050686-117-01_pc-e8807554a6.webp"), products: 92 },
    { id: "440", name: "Men's Apparel", family: "Soft Goods", sellOnline: true, glCode: "1120", qbClass: "Apparel", src: img("apparel/mens/2000000055336-18-01_pc-bd0c08a74e.webp"), products: 156 },
    { id: "441", name: "Women's Apparel", family: "Soft Goods", sellOnline: true, glCode: "1166", qbClass: "Apparel", src: img("apparel/womens/2000000045603-1109-01_pc-aa571058bd.webp"), products: 118 },
    { id: "442", name: "Gloves", family: "Soft Goods", sellOnline: true, glCode: "1166", qbClass: "Apparel", src: img("equipment/accessories-and-training/0200211000123-01_pc-51c422a3e2.webp"), products: 24 },
    { id: "1513", name: "Range Balls", family: "Range", sellOnline: false, glCode: "4500", qbClass: "Range", src: img("equipment/golf-balls/2000000059357-01_pc-1b849979d7.webp"), products: 3 },
];

/** Product Groups — the merchandise categories that organize the catalog, with families and GL mapping. */
export const Groups: Story = {
    render: () => (
        <AppShell activeUrl="/products/groups">
            <PageHeader
                title="Product Groups"
                subtitle="Merchandise categories that organize the catalog and map to the general ledger."
                action={
                    <div className="flex items-center gap-2">
                        <Button size="md" color="secondary" iconLeading={PackagePlus}>
                            Add family
                        </Button>
                        <Button size="md" iconLeading={Plus}>
                            New group
                        </Button>
                    </div>
                }
            />
            <div className="p-6 lg:p-8">
                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input size="sm" aria-label="Search groups" placeholder="Search groups" icon={SearchLg} wrapperClassName="sm:w-80" />
                        <Button size="sm" color="secondary" iconLeading={FilterLines}>
                            Filters
                        </Button>
                    </div>
                    <Table aria-label="Product groups">
                        <Table.Header>
                            <Table.Head label="Group" isRowHeader />
                            <Table.Head label="Family" className="w-44" />
                            <Table.Head label="Products" className="w-28 text-right" />
                            <Table.Head label="Sell online" className="w-32" />
                            <Table.Head label="GL code" className="w-32" />
                            <Table.Head label="QB class" className="w-32" />
                        </Table.Header>
                        <Table.Body items={groups}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell>
                                        <div className="flex items-center gap-3">
                                            <img src={row.src} alt={row.name} className="size-10 rounded-lg bg-secondary object-contain p-1 ring-1 ring-secondary ring-inset" loading="lazy" />
                                            <div>
                                                <p className="text-sm font-medium text-primary">{row.name}</p>
                                                <p className="text-xs text-tertiary tabular-nums">ID {row.id}</p>
                                            </div>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge size="sm" type="pill-color" color="gray">
                                            {row.family}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.products}</Table.Cell>
                                    <Table.Cell>
                                        {row.sellOnline ? (
                                            <span className="inline-flex items-center gap-1.5 text-sm text-success-primary">
                                                <CheckCircle className="size-4" aria-hidden="true" />
                                                Yes
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 text-sm text-tertiary">
                                                <SlashCircle01 className="size-4" aria-hidden="true" />
                                                No
                                            </span>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell className="tabular-nums text-tertiary">{row.glCode}</Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.qbClass}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ------------------------------------------------------------------ */
/* Inventory — stock levels                                            */
/* ------------------------------------------------------------------ */

/** Inventory — on-hand stock levels across the Pro Shop, with reorder status. */
export const Inventory: Story = {
    render: () => (
        <AppShell activeUrl="/products/inventory">
            <PageHeader
                title="Inventory"
                subtitle="On-hand stock across the Pro Shop, with reorder points and status."
                action={
                    <div className="flex items-center gap-2">
                        <Button size="md" color="secondary" iconLeading={Download01}>
                            Export
                        </Button>
                        <Button size="md" iconLeading={PackagePlus}>
                            Adjust stock
                        </Button>
                    </div>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <MetricCard title="Units on hand" value="8,412" change={2.1} icon={Truck01} />
                    <MetricCard title="Below reorder point" value="18" change={-4.3} changeLabel="vs last week" icon={SlashCircle01} />
                    <MetricCard title="Out of stock" value="6" change={1.0} changeLabel="vs last week" icon={SlashCircle01} />
                </div>

                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input size="sm" aria-label="Search inventory" placeholder="Search inventory" icon={SearchLg} wrapperClassName="sm:w-80" />
                        <Button size="sm" color="secondary" iconLeading={FilterLines}>
                            Filters
                        </Button>
                    </div>
                    <Table aria-label="Inventory">
                        <Table.Header>
                            <Table.Head label="Product" isRowHeader />
                            <Table.Head label="Group" className="w-40" />
                            <Table.Head label="On hand" className="w-28 text-right" />
                            <Table.Head label="Reorder at" className="w-28 text-right" />
                            <Table.Head label="Retail" className="w-28 text-right" />
                            <Table.Head label="Status" className="w-40" />
                        </Table.Header>
                        <Table.Body items={products}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell>
                                        <div className="flex items-center gap-3">
                                            <img src={row.src} alt={row.name} className="size-10 rounded-lg bg-secondary object-contain p-1 ring-1 ring-secondary ring-inset" loading="lazy" />
                                            <div>
                                                <p className="text-sm font-medium text-primary">{row.name}</p>
                                                <p className="text-xs text-tertiary tabular-nums">#{row.id}</p>
                                            </div>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.group}</Table.Cell>
                                    <Table.Cell className="text-right font-medium text-primary tabular-nums">{row.stock}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">10</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{usd(row.price)}</Table.Cell>
                                    <Table.Cell>{stockBadge(row.stock)}</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <div className="flex items-center justify-between gap-4 border-t border-secondary px-4 py-3">
                        <Button size="sm" color="secondary" iconLeading={ArrowLeft}>
                            Previous
                        </Button>
                        <span className="text-sm text-tertiary">Page 1 of 52</span>
                        <Button size="sm" color="secondary" iconTrailing={ArrowRight}>
                            Next
                        </Button>
                    </div>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

/* ------------------------------------------------------------------ */
/* Inventory Receivables                                               */
/* ------------------------------------------------------------------ */

interface Receivable {
    id: string;
    name: string;
    group: string;
    src: string;
    cost: number;
    avgCost: number;
    price: number;
    received: number;
    receivedDate?: string;
    sold: number;
    current: number;
}

const receivables: Receivable[] = [
    { id: "77440", name: "TP5x MySymbol 2026 Golf Balls", group: "Golf Balls", src: img("equipment/golf-balls/2000000042256-92-01_pc-73b40dc309.webp"), cost: 32, avgCost: 32, price: 55, received: 48, receivedDate: "Jul 18, 2026", sold: 14, current: 58 },
    { id: "77441", name: "Tour Response 2026 Golf Balls", group: "Golf Balls", src: img("equipment/golf-balls/2000000058262-92-01_pc-7bd37b5e01.webp"), cost: 24, avgCost: 24, price: 40, received: 36, receivedDate: "Jul 18, 2026", sold: 22, current: 42 },
    { id: "77410", name: "Dri-Fit Men's Good Blade Golf Polo", group: "Apparel", src: img("apparel/mens/2000000054595-59-01_pc-dd5b6a8095.webp"), cost: 42, avgCost: 42, price: 85, received: 24, receivedDate: "Jul 9, 2026", sold: 8, current: 34 },
    { id: "77420", name: "Moveknit Zip 2.0 Women's Golf Dress", group: "Apparel", src: img("apparel/womens/2000000045603-1109-01_pc-aa571058bd.webp"), cost: 61, avgCost: 61, price: 128, received: 18, receivedDate: "Jul 9, 2026", sold: 6, current: 12 },
    { id: "77430", name: "S-Casual Men's Spikeless Golf Shoes", group: "Shoes", src: img("shoes/golf-shoes/2000000047011-5-01_pc-faed680eec.webp"), cost: 74, avgCost: 74, price: 140, received: 12, receivedDate: "Jun 30, 2026", sold: 4, current: 16 },
    { id: "77432", name: "Jordan Grind Men's Spikeless Golf Shoes", group: "Shoes", src: img("shoes/golf-shoes/2000000056604-87-01_pc-bec7c35579.webp"), cost: 118, avgCost: 118, price: 210, received: 8, receivedDate: "Jun 30, 2026", sold: 4, current: 4 },
    { id: "77450", name: "Titleist Players Golf Glove", group: "Gloves", src: img("equipment/accessories-and-training/0200211000123-01_pc-51c422a3e2.webp"), cost: 12, avgCost: 12, price: 26, received: 60, receivedDate: "Jun 25, 2026", sold: 13, current: 47 },
    { id: "77451", name: "Approach S44 Golf GPS Watch", group: "Accessories", src: img("equipment/accessories-and-training/2000000050686-117-01_pc-e8807554a6.webp"), cost: 268, avgCost: 268, price: 400, received: 6, receivedDate: "Jun 12, 2026", sold: 3, current: 3 },
];

/** Inventory Receivables — cost, receiving history, and current stock per product. */
export const Receivables: Story = {
    render: () => (
        <AppShell activeUrl="/products/inventory/receivables">
            <PageHeader
                title="Inventory Receivables"
                subtitle="Cost basis, receiving history, and current on-hand for every stocked product."
                action={
                    <div className="flex items-center gap-2">
                        <Button size="md" color="secondary" iconLeading={Plus}>
                            New product
                        </Button>
                        <Button size="md" iconLeading={Truck01}>
                            New shipment
                        </Button>
                    </div>
                }
            />
            <div className="flex flex-col gap-5 p-6 lg:p-8">
                {/* View tabs */}
                <div className="flex items-center gap-1 rounded-lg bg-secondary p-1 sm:w-fit">
                    <button type="button" className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary shadow-xs">
                        By product
                    </button>
                    <button type="button" className="rounded-md px-3 py-1.5 text-sm font-medium text-tertiary hover:text-secondary">
                        By shipment
                    </button>
                </div>

                <TableCard.Root>
                    <div className="flex flex-col gap-3 border-b border-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input size="sm" aria-label="Search receivables" placeholder="Search" icon={SearchLg} wrapperClassName="sm:w-80" />
                        <div className="flex items-center gap-2">
                            <Button size="sm" color="secondary" iconLeading={FilterLines}>
                                Filters
                            </Button>
                            <Button size="sm" color="secondary" iconLeading={Download01}>
                                Export
                            </Button>
                        </div>
                    </div>
                    <Table aria-label="Inventory receivables">
                        <Table.Header>
                            <Table.Head label="Product" isRowHeader />
                            <Table.Head label="Group" className="w-36" />
                            <Table.Head label="Cost" className="w-28 text-right" />
                            <Table.Head label="Avg. cost" className="w-28 text-right" />
                            <Table.Head label="Retail" className="w-24 text-right" />
                            <Table.Head label="Received" className="w-44" />
                            <Table.Head label="Sold" className="w-20 text-right" />
                            <Table.Head label="Current" className="w-28 text-right" />
                        </Table.Header>
                        <Table.Body items={receivables}>
                            {(row) => (
                                <Table.Row id={row.id}>
                                    <Table.Cell>
                                        <div className="flex items-center gap-3">
                                            <img src={row.src} alt={row.name} className="size-9 rounded-md bg-secondary object-contain p-1 ring-1 ring-secondary ring-inset" loading="lazy" />
                                            <div>
                                                <p className="text-sm font-medium text-primary">{row.name}</p>
                                                <p className="text-xs text-tertiary tabular-nums">#{row.id}</p>
                                            </div>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className="text-tertiary">{row.group}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{usd(row.cost)}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{usd(row.avgCost)}</Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{usd(row.price)}</Table.Cell>
                                    <Table.Cell>
                                        {row.received > 0 ? (
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-primary tabular-nums">{row.received} units</span>
                                                {row.receivedDate && <span className="text-xs text-tertiary">{row.receivedDate}</span>}
                                            </div>
                                        ) : (
                                            <span className="text-tertiary">—</span>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell className="text-right tabular-nums text-tertiary">{row.sold}</Table.Cell>
                                    <Table.Cell className="text-right">
                                        <span className={row.current === 0 ? "font-medium text-error-primary tabular-nums" : "font-medium text-primary tabular-nums"}>{row.current}</span>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    <div className="flex items-center justify-between gap-4 border-t border-secondary px-4 py-3">
                        <Button size="sm" color="secondary" iconLeading={ArrowLeft}>
                            Previous
                        </Button>
                        <span className="text-sm text-tertiary">Page 1 of 31</span>
                        <Button size="sm" color="secondary" iconTrailing={ArrowRight}>
                            Next
                        </Button>
                    </div>
                </TableCard.Root>
            </div>
        </AppShell>
    ),
};

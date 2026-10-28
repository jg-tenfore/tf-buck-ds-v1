/**
 * Sample data for Products - OCT 27, modeled on the Products Beta screens in
 * references/102826. Names, products and amounts are invented.
 */

/** Global Nav ids (Products in today's nav tree). */
export const PRODUCTS_NAV = {
    list: "products/list",
    groups: "products/groups",
    combos: "products/combos",
    menus: "products/menus",
    modifiers: "products/modifiers",
    discountTypes: "products/discount-types",
    punchCards: "products/punch-cards",
    rewards: "products/rewards",
    star: "products/price-stickers/star",
    dymo: "products/price-stickers/dymo",
    avery: "products/price-stickers/avery-5160",
} as const;

export const COURSE = "The Dunes of Delgado PROD";
export const COURSES = [COURSE, "Bushwood Country Club", "Schule Oaks", "Orange County Convention Center", "The Big Loop International"];

/* -------------------------------------------------------------------------- */
/*  Taxes                                                                     */
/* -------------------------------------------------------------------------- */

export const TAX_TYPES = [
    { id: "none", label: "No tax", rate: 0 },
    { id: "standard", label: "Standard Tax (8.25%)", rate: 0.0825 },
    { id: "alcohol", label: "Alcohol Tax (6.70%)", rate: 0.067 },
    { id: "county", label: "County Tax (2.00%)", rate: 0.02 },
];
export const TAX2_TYPES = [{ id: "none", label: "No second tax", rate: 0 }, ...TAX_TYPES.slice(1)];
export const taxRate = (id: string) => TAX_TYPES.find((t) => t.id === id)?.rate ?? 0;
export const round2 = (n: number) => Math.round(n * 100) / 100;

/* -------------------------------------------------------------------------- */
/*  Products › List                                                           */
/* -------------------------------------------------------------------------- */

export type ProductRow = {
    id: number;
    name: string;
    group: string;
    vendor?: string;
    sku?: string;
    gl: string;
    price: number;
    tax: number;
    tax2: number;
    fees: number;
    onHold?: boolean;
};

const row = (id: number, name: string, group: string, price: number, fees: number, sku?: string, extra: Partial<ProductRow> = {}): ProductRow => ({
    id,
    name,
    group,
    sku,
    gl: group === "Liquor" ? "3341" : group === "Beer" ? "3320" : "5700",
    price,
    tax: round2(price * 0.0825),
    tax2: 0,
    fees,
    ...extra,
});

export const PRODUCTS: ProductRow[] = [
    row(77274, "Premium Vodka – Bottle", "Liquor", 6.37, 0.19, "2104455887"),
    row(77275, "House Vodka – Bottle", "Liquor", 4.55, 0.14, "1277275"),
    row(77276, "Citrus Vodka – Bottle", "Liquor", 4.55, 0, "1210877276"),
    row(77277, "Small-Batch Vodka – Bottle", "Liquor", 4.55, 0.14, "1168977277"),
    row(77278, "Rail Vodka – Bottle", "Liquor", 3.64, 0.11, "1168977278"),
    row(77279, "Sweet Tea Vodka", "Liquor", 3.64, 0, "1477279"),
    row(77281, "London Dry Gin – Bottle", "Liquor", 5.01, 0),
    row(77282, "Navy Strength Gin", "Liquor", 4.58, 0.14, "1477282"),
    row(77283, "Silver Rum", "Liquor", 3.64, 0),
    row(77284, "Spiced Rum – Bottle", "Liquor", 4.1, 0, undefined, { onHold: true }),
    row(77286, "Light Rum – Bottle", "Liquor", 4.1, 0),
    row(77289, "Tennessee Whiskey – Bottle", "Liquor", 5.46, 0),
    row(78102, "Light Lager – Can", "Beer", 1.81, 0.04, "3301001", { vendor: "Coastal Distributing" }),
    row(78103, "Hazy IPA – Can", "Beer", 1.81, 0.04, "3301002", { vendor: "Coastal Distributing" }),
    row(80410, "Tour Golf Balls – Dozen", "Golf Balls", 49.99, 0, "5700410", { vendor: "Fairway Supply Co." }),
    row(80455, "Logo Golf Glove", "Accessories", 24.0, 0, "5700455", { vendor: "Fairway Supply Co." }),
];

export const grandTotal = (p: Pick<ProductRow, "price" | "tax" | "tax2" | "fees">) => round2(p.price + p.tax + p.tax2 + p.fees);

export const ACCOUNTING_CATEGORIES = [
    "Alcohol",
    "Club Repair",
    "Driving Range",
    "Equipment",
    "Food and Beverage",
    "Lessons",
    "Merchandise",
    "Rentals",
    "Tee Fees",
];
export const BRANDS = ["Select brand", "Dunes Private Label", "Fairway Supply Co.", "Coastal Distributing"];
export const PARTNERS = ["None", "Online Store", "Tee Sheet Partner"];
export const CREDIT_BOOKS = ["None", "Member F&B Credit", "Tournament Prize Fund"];
export const SUB_GROUPS: Record<string, string[]> = {
    Liquor: ["None", "Vodka", "Gin", "Rum", "Whiskey"],
    Beer: ["None", "Domestic", "Craft", "Import"],
    "Golf Balls": ["None", "Tour", "Distance"],
    Accessories: ["None", "Gloves", "Tees", "Towels"],
};

export const DEPARTMENTS = ["Carts", "Restaurant", "Pro Shop", "Events", "Online", "Sim", "Jackrabbit (kiosk)", "Crane (mobile)"];
export const DEPARTMENT_GROUPS = ["Liquor", "Beer", "Accessories", "Golf Balls", "Snacks", "Beverages"];

export const PRODUCT_OPTIONS = [
    { id: "inventory", label: "Inventory item", hint: "Stock is tracked and adjusted when this sells.", group: "sale" },
    { id: "priceOverride", label: "Price override", hint: "Staff can change the price at the point of sale.", group: "sale" },
    { id: "notes", label: "Prompt for notes", hint: "Ask for a note when this is added to an order.", group: "sale" },
    { id: "cardOnFile", label: "Require card on file", hint: "Only sell to customers with a saved card.", group: "sale" },
    { id: "doNotFire", label: "Do not fire", hint: "Never sent to a kitchen printer.", group: "sale" },
    { id: "redeemable", label: "Redeemable", hint: "Can be redeemed with reward points.", group: "sale" },
    { id: "mixer", label: "Mixer", hint: "Offered as a mixer on drinks.", group: "sale" },
    { id: "greenFee", label: "Green fee", hint: "Reported as a green fee.", group: "type" },
    { id: "transportation", label: "Transportation", hint: "Reported as a cart or transportation fee.", group: "type" },
    { id: "gratuity", label: "Gratuity", hint: "Reported as a gratuity, not a sale.", group: "type" },
    { id: "cashBack", label: "Cash back", hint: "Pays out cash to the customer.", group: "type" },
] as const;
export type ProductOptionId = (typeof PRODUCT_OPTIONS)[number]["id"];

export type ProductDetail = {
    row: ProductRow;
    description: string;
    category: string;
    subGroup: string;
    glOverride: string;
    brand: string;
    partner: string;
    partnerCode: string;
    creditBook: string;
    vendorCode: string;
    rewardsValue: string;
    rewardsCost: string;
    departments: Record<string, string | null>;
    cost: number;
    exposedCost: string;
    serviceCharge: string;
    taxType: string;
    tax2Type: string;
    options: Record<ProductOptionId, boolean>;
    modifierGroups: string[];
    stock: number;
    sold: number;
    inventory: { date: string; invoice: string; qty: number; unitCost: number }[];
};

const NO_OPTIONS = Object.fromEntries(PRODUCT_OPTIONS.map((o) => [o.id, false])) as Record<ProductOptionId, boolean>;

/** Every product opens as the Premium Vodka detail with its own row (sample data). */
export const productDetail = (row: ProductRow): ProductDetail => ({
    row,
    description: "",
    category: row.group === "Liquor" || row.group === "Beer" ? "Alcohol" : "Merchandise",
    subGroup: "None",
    glOverride: "",
    brand: "Select brand",
    partner: "None",
    partnerCode: "",
    creditBook: "None",
    vendorCode: "",
    rewardsValue: "",
    rewardsCost: "",
    departments: { Restaurant: row.group, "Pro Shop": row.group, Online: "Accessories" },
    cost: 0,
    exposedCost: "",
    serviceCharge: "5",
    taxType: "standard",
    tax2Type: "none",
    options: { ...NO_OPTIONS, inventory: row.group !== "Liquor" },
    modifierGroups: row.group === "Liquor" ? ["Mixers"] : [],
    stock: -2,
    sold: 2,
    inventory: [{ date: "Jun 25, 2026 1:27 PM", invoice: "—", qty: 10, unitCost: 0 }],
});

export const blankProduct = (): ProductDetail => ({
    ...productDetail({ id: 0, name: "", group: "", gl: "", price: 0, tax: 0, tax2: 0, fees: 0 }),
    category: "",
    departments: {},
    serviceCharge: "",
    options: { ...NO_OPTIONS },
    modifierGroups: [],
    stock: 0,
    sold: 0,
    inventory: [],
});

/* -------------------------------------------------------------------------- */
/*  Product Groups                                                            */
/* -------------------------------------------------------------------------- */

export type ProductGroup = {
    id: number;
    name: string;
    family: string;
    sellOnline: boolean;
    forceServiceCharge: boolean;
    gl?: string;
    qbClass?: string;
    subGroups: { id: number; name: string }[];
};

export const PRODUCT_FAMILIES = ["Pro Shop Merch", "Food", "Beverages", "Fees", "Rentals", "Lessons"];
export const QB_CLASSES = ["None", "Pro Shop", "Food & Beverage", "Golf Operations"];
export const GL_CODES = ["None", "1120", "3320", "3341", "5700", "112025", "8675309"];
export const STAR_PRINTERS = ["Kitchen", "Bar", "Turn Stand"];
export const MODIFIER_GROUP_NAMES = ["Mixers", "Burger Temps", "Wing Flavors", "Side Sauces", "Sandwich Toppings", "Cheeses"];
export const MODIFIER_NAMES = ["Add Bacon", "Add Egg", "No Ice", "Extra Shot", "Gluten Free Bun"];

export const PRODUCT_GROUPS: ProductGroup[] = [
    { id: 395, name: "Golf Balls", family: "Pro Shop Merch", sellOnline: true, forceServiceCharge: false, gl: "5700", subGroups: [] },
    {
        id: 439,
        name: "Accessories",
        family: "Pro Shop Merch",
        sellOnline: true,
        forceServiceCharge: false,
        gl: "112025",
        subGroups: [
            { id: 4401, name: "Gloves" },
            { id: 4402, name: "Tees" },
            { id: 4403, name: "Towels" },
        ],
    },
    { id: 440, name: "Hats", family: "Pro Shop Merch", sellOnline: true, forceServiceCharge: false, gl: "1120", subGroups: [] },
    { id: 3341, name: "Liquor", family: "Beverages", sellOnline: false, forceServiceCharge: false, gl: "3341", qbClass: "Food & Beverage", subGroups: [] },
    { id: 3320, name: "Beer", family: "Beverages", sellOnline: false, forceServiceCharge: false, gl: "3320", qbClass: "Food & Beverage", subGroups: [] },
    { id: 4784, name: "Sandwiches", family: "Food", sellOnline: false, forceServiceCharge: true, subGroups: [] },
    { id: 4785, name: "Snacks", family: "Food", sellOnline: false, forceServiceCharge: false, subGroups: [] },
    { id: 4206, name: "Event Fees", family: "Fees", sellOnline: false, forceServiceCharge: false, gl: "8675309", subGroups: [] },
    { id: 3705, name: "Waitlist Fees", family: "Fees", sellOnline: false, forceServiceCharge: false, subGroups: [] },
    { id: 4759, name: "Club Rentals", family: "Rentals", sellOnline: true, forceServiceCharge: false, subGroups: [] },
];

/* -------------------------------------------------------------------------- */
/*  Combos                                                                    */
/* -------------------------------------------------------------------------- */

export const COMBO_DEPARTMENTS = ["Pro Shop", "Restaurant", "Bev Carts"];

export type ComboItem = { id: string; product: string; unitPrice: number; fees: number; taxType: string; tax2Type: string; qty: number };
export type Combo = { id: number; title: string; description: string; department: string; items: ComboItem[] };

export const comboItemTax = (i: ComboItem) => round2(i.unitPrice * taxRate(i.taxType));
export const comboItemTax2 = (i: ComboItem) => round2(i.unitPrice * taxRate(i.tax2Type));
export const comboItemTotal = (i: ComboItem) => round2((i.unitPrice + i.fees + comboItemTax(i) + comboItemTax2(i)) * i.qty);
export const comboBeforeTax = (c: Pick<Combo, "items">) => round2(c.items.reduce((s, i) => s + i.unitPrice * i.qty, 0));
export const comboAfterTax = (c: Pick<Combo, "items">) => round2(c.items.reduce((s, i) => s + comboItemTotal(i), 0));

const ci = (id: string, product: string, unitPrice: number, fees: number, qty: number, taxType = "standard", tax2Type = "none"): ComboItem => ({
    id,
    product,
    unitPrice,
    fees,
    taxType,
    tax2Type,
    qty,
});

export const COMBOS: Combo[] = [
    {
        id: 1,
        title: "6 Pack Combo",
        description: "Variety of beers",
        department: "Pro Shop",
        items: [
            ci("a", "Light Lager – Can", 1.81, 0.04, 3),
            ci("b", "Hazy IPA – Can", 1.81, 0.04, 3),
            ci("c", "Gratuity", 4.66, 0, 1),
            ci("d", "Root Beer – Bottle", 1.0, 0, 2),
        ],
    },
    {
        id: 2,
        title: "Balls and Beers",
        description: "Sleeve of balls and two beers",
        department: "Pro Shop",
        items: [ci("a", "Tour Golf Balls – Sleeve", 14.0, 0, 1), ci("b", "Light Lager – Can", 3.98, 0, 2)],
    },
    {
        id: 3,
        title: "Sandwich Bonanza",
        description: "Sandwiches",
        department: "Bev Carts",
        items: [ci("a", "Open Burger", 10, 0, 4), ci("b", "Fountain Soda", 2, 0, 2)],
    },
    {
        id: 4,
        title: "Turn Special",
        description: "Hot dog, chips and a drink at the turn",
        department: "Restaurant",
        items: [ci("a", "Hot Dog", 4.5, 0, 1), ci("b", "Chips", 1.5, 0, 1), ci("c", "Bottled Water", 1.5, 0, 1)],
    },
    {
        id: 5,
        title: "Tee Fee and Balls",
        description: "Tee fee with a bucket of range balls",
        department: "Pro Shop",
        items: [ci("a", "Twilight Tee Fee", 12.3, 0, 1, "none"), ci("b", "Range Balls – Large", 6, 0, 1)],
    },
    {
        id: 6,
        title: "Friday League Combo",
        description: "League fee, cart and a drink",
        department: "Pro Shop",
        items: [ci("a", "League Fee", 25, 0, 1, "none"), ci("b", "Cart Fee", 12, 0, 1), ci("c", "Light Lager – Can", 3, 0, 1)],
    },
    { id: 7, title: "Glove and Shirt Combo", description: "Glove and logo shirt", department: "Pro Shop", items: [] },
];

export const COMBO_PRODUCTS = [
    "Light Lager – Can",
    "Hazy IPA – Can",
    "Root Beer – Bottle",
    "Open Burger",
    "Hot Dog",
    "Chips",
    "Bottled Water",
    "Fountain Soda",
    "Tour Golf Balls – Sleeve",
    "Range Balls – Large",
    "Cart Fee",
    "Gratuity",
];

/* -------------------------------------------------------------------------- */
/*  Menus                                                                     */
/* -------------------------------------------------------------------------- */

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export type Menu = { id: number; title: string; startDate: string; endDate: string; startTime: string; endTime: string; days: string[] };

export const MENUS: Menu[] = [
    { id: 3, title: "Dinner", startDate: "", endDate: "", startTime: "17:00", endTime: "21:00", days: [...DAYS] },
    {
        id: 6,
        title: "Happy Hour",
        startDate: "2026-11-01",
        endDate: "2026-12-31",
        startTime: "16:20",
        endTime: "18:30",
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
    { id: 4, title: "19th Hole Menu", startDate: "", endDate: "", startTime: "08:00", endTime: "21:00", days: [...DAYS] },
    { id: 92, title: "Member-Guest Weekend", startDate: "2026-11-14", endDate: "2026-11-15", startTime: "07:00", endTime: "19:00", days: ["Sat", "Sun"] },
    { id: 37, title: "Turn Stand", startDate: "", endDate: "", startTime: "15:00", endTime: "18:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
];

/** "17:00" → "5:00 PM". */
export const time12 = (t: string) => {
    if (!t) return "—";
    const [h, m] = t.split(":").map(Number);
    return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};
/** "2026-11-01" → "11/1/2026". */
export const dateShort = (d: string) => {
    if (!d) return "—";
    const [y, m, day] = d.split("-").map(Number);
    return `${m}/${day}/${y}`;
};

/* -------------------------------------------------------------------------- */
/*  Modifiers                                                                 */
/* -------------------------------------------------------------------------- */

export type Modifier = { id: number; title: string; price: number; taxType: string; tax2Type: string; groups: string[] };
export type ModifierGroup = { id: number; description: string; sequence: number | null; color: string | null; modifiers: number[] };

export const MODIFIERS: Modifier[] = [
    { id: 1, title: "2 Egg", price: 1.99, taxType: "standard", tax2Type: "none", groups: ["Brunch"] },
    { id: 2, title: "Add Bacon", price: 1.0, taxType: "standard", tax2Type: "none", groups: ["Burger Temps", "Sandwich Toppings"] },
    { id: 3, title: "Add Chicken", price: 2.02, taxType: "standard", tax2Type: "none", groups: ["Burger Temps"] },
    { id: 4, title: "Add Egg", price: 0.99, taxType: "standard", tax2Type: "none", groups: ["Burger Temps", "Brunch"] },
    { id: 5, title: "Add Onions", price: 1.76, taxType: "standard", tax2Type: "none", groups: ["Burger Temps"] },
    { id: 6, title: "Add Shrimp", price: 2.02, taxType: "standard", tax2Type: "none", groups: [] },
    { id: 7, title: "Add Steak", price: 3.03, taxType: "standard", tax2Type: "none", groups: ["Burger Temps"] },
    { id: 8, title: "Apple Slices", price: 1.01, taxType: "standard", tax2Type: "none", groups: ["Sides"] },
    { id: 9, title: "BBQ", price: 0, taxType: "none", tax2Type: "none", groups: ["Wing Flavors", "Side Sauces"] },
    { id: 10, title: "Blue Cheese", price: 0.69, taxType: "standard", tax2Type: "none", groups: ["Side Sauces", "Cheeses"] },
    { id: 11, title: "Buffalo", price: 0, taxType: "none", tax2Type: "none", groups: ["Wing Flavors"] },
    { id: 12, title: "Carrots & Celery", price: 1.84, taxType: "standard", tax2Type: "none", groups: ["Sides"] },
    { id: 13, title: "Medium Rare", price: 0, taxType: "none", tax2Type: "none", groups: ["Temp"] },
    { id: 14, title: "Well Done", price: 0, taxType: "none", tax2Type: "none", groups: ["Temp"] },
];

export const MODIFIER_GROUPS: ModifierGroup[] = [
    { id: 1501, description: "Burger Temps", sequence: 1, color: null, modifiers: [2, 3, 4, 5, 7] },
    { id: 3482, description: "Wing Flavors", sequence: 1, color: null, modifiers: [9, 11] },
    { id: 3480, description: "Side Sauces", sequence: 2, color: "gray", modifiers: [9, 10] },
    { id: 3, description: "Sides", sequence: 2, color: null, modifiers: [8, 12] },
    { id: 1489, description: "Brunch", sequence: 3, color: "orange", modifiers: [1, 4] },
    { id: 5, description: "Sandwich Toppings", sequence: 3, color: "blue", modifiers: [2] },
    { id: 4, description: "Cheeses", sequence: 4, color: "error", modifiers: [10] },
    { id: 2, description: "Temp", sequence: 4, color: null, modifiers: [13, 14] },
    { id: 1515, description: "Allergies", sequence: null, color: null, modifiers: [] },
];

/** Background colors a modifier group's button can have on the ordering screen. */
export const GROUP_COLORS = ["gray", "brand", "blue", "orange", "error", "success"] as const;

/* -------------------------------------------------------------------------- */
/*  Discount Types                                                            */
/* -------------------------------------------------------------------------- */

export type DiscountKind = "percent" | "costPlus" | "amount";
export type DiscountType = { id: number; description: string; kind: DiscountKind; value: number; approval: boolean; categories: string[] };

const ALL = [...ACCOUNTING_CATEGORIES];
export const DISCOUNT_TYPES: DiscountType[] = [
    { id: 1, description: "10% Everything", kind: "percent", value: 10, approval: false, categories: ALL },
    { id: 2, description: "20% off F&B", kind: "percent", value: 20, approval: false, categories: ["Alcohol", "Food and Beverage"] },
    { id: 3, description: "BOGO Lunch", kind: "percent", value: 100, approval: false, categories: ["Food and Beverage"] },
    { id: 4, description: "Cost Plus", kind: "costPlus", value: 10, approval: true, categories: ["Equipment", "Merchandise"] },
    { id: 5, description: "Dollar Off", kind: "amount", value: 1, approval: false, categories: ALL },
    { id: 6, description: "Employee Merch Discount", kind: "costPlus", value: 15, approval: false, categories: ["Merchandise", "Equipment"] },
    { id: 7, description: "Food Only Discount", kind: "percent", value: 50, approval: false, categories: ["Food and Beverage"] },
    { id: 8, description: "League Pass", kind: "percent", value: 20, approval: false, categories: ["Tee Fees"] },
    { id: 9, description: "Manager's Discount", kind: "percent", value: 20, approval: true, categories: ALL },
    { id: 10, description: "Memberships", kind: "amount", value: 25, approval: false, categories: ["Tee Fees"] },
    { id: 11, description: "Military", kind: "percent", value: 25, approval: true, categories: ALL },
    { id: 12, description: "Senior", kind: "percent", value: 22, approval: false, categories: ["Tee Fees", "Food and Beverage"] },
    { id: 13, description: "Shift Drink", kind: "percent", value: 100, approval: false, categories: ["Alcohol"] },
];

/* -------------------------------------------------------------------------- */
/*  Rewards                                                                   */
/* -------------------------------------------------------------------------- */

export type RewardRow = { id: string; name: string; value: string; cost: string };
export type RewardRow18 = { id: string; name: string; v18: string; c18: string; v9: string; c9: string };

export const REWARD_PRODUCTS: RewardRow[] = [
    ["10 Pre-Paid Guest Rounds", "45", "650"],
    ["8 Round Punch Card", "55", "500"],
    ["9 Rounds", "3", "20"],
    ["Annual Membership", "0", ""],
    ["Birdie Membership", "1000", ""],
    ["Logo Snapback", "1", "1"],
    ["Social Membership", "200", ""],
    ["Sparkling Water – Lime", "10", ""],
    ["Lip Balm", "10", "25"],
    ["Tour Golf Balls – Dozen", "25", "400"],
    ["Logo Golf Glove", "12", "200"],
    ["Range Balls – Large", "4", "60"],
].map(([name, value, cost], i) => ({ id: `p${i}`, name, value, cost }));

export const REWARD_TEE_FEES: RewardRow18[] = [
    ["Birdie (25%)", "100", "1000", "50", "500"],
    ["Twilight", "1", "10", "1", "10"],
    ["Dunes Rack Non-Prime", "32", "350", "19", "175"],
    ["Dunes Rack Prime", "50", "16", "3", "8"],
    ["Dunes Rack Prime – East", "50", "16", "3", "8"],
    ["Gold Fee (50%)", "20", "", "10", ""],
    ["Senior Weekday", "27", "350", "18", "175"],
].map(([name, v18, c18, v9, c9], i) => ({ id: `t${i}`, name, v18, c18, v9, c9 }));

export const REWARD_TRANSPORTATION: RewardRow18[] = [{ id: "x0", name: "Dunes Cart", v18: "20", c18: "100", v9: "10", c9: "50" }];
export const REWARD_TYPES = ["Product group", "Product", "Tee fee", "Transportation"];

/* -------------------------------------------------------------------------- */
/*  Price Stickers                                                            */
/* -------------------------------------------------------------------------- */

export const STICKER_GROUPS = ["Golf Balls", "Accessories", "Hats", "Shirts", "Gloves", "Snacks", "Beverages"];
export const STICKER_PRODUCTS: Record<string, { name: string; sku: string; price: number }[]> = {
    "Golf Balls": [
        { name: "Tour Golf Balls – Dozen", sku: "5700410", price: 49.99 },
        { name: "Distance Golf Balls – Dozen", sku: "5700411", price: 29.99 },
        { name: "Tour Golf Balls – Sleeve", sku: "5700412", price: 14.0 },
    ],
    Accessories: [
        { name: "Logo Golf Glove", sku: "5700455", price: 24.0 },
        { name: "Bamboo Tees – 50 Pack", sku: "5700456", price: 6.5 },
        { name: "Microfiber Towel", sku: "5700457", price: 18.0 },
    ],
    Hats: [
        { name: "Logo Snapback", sku: "1120001", price: 32.0 },
        { name: "Performance Visor", sku: "1120002", price: 26.0 },
    ],
    Shirts: [{ name: "Dunes Logo Polo", sku: "1130001", price: 78.0 }],
    Gloves: [{ name: "Cabretta Glove – Left", sku: "5700501", price: 22.0 }],
    Snacks: [{ name: "Trail Mix", sku: "4785001", price: 3.5 }],
    Beverages: [{ name: "Sports Drink", sku: "4790001", price: 3.25 }],
};
export const STAR_PRINTER_LIST = ["Pro Shop Counter (Star TSP143)", "Back Office (Star TSP654)"];
export const STAR_PAPER = ["2.25 × 1.25 in labels", "2 × 1 in labels", "Continuous receipt paper"];
export const PRICE_DISPLAY = ["Price before tax", "Price after tax", "Both"];
export const SECONDARY_LABELS = ["None", "Member price", "Sale price", "Was"];
export const STICKER_TAX = 0.0825;

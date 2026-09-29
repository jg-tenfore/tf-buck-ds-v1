/**
 * Content for the "Buck V1 Old — Course Settings" prototype.
 *
 * Every value here was transcribed from the legacy production screen
 * (references/092926 — The Dunes of Delgado PROD, captured 2026-09-29), so the
 * prototype is a faithful foundation to build new concepts on top of.
 */

/**
 * URL for a file in public/buck-v1-old/, respecting the build's base path so
 * images also resolve when Storybook is served from a sub-path (GitHub Pages).
 */
const BASE = ((import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? "/").replace(/\/?$/, "/");
export const asset = (file: string) => `${BASE}buck-v1-old/${file}`;

export const COURSE = {
    name: "The Dunes of Delgado PROD",
    settingsId: "#10",
    user: { name: "Justin Girard", role: "Course Admin" },
};

export type Option = { id: string; label: string };

const opts = (...labels: string[]): Option[] => labels.map((label) => ({ id: label, label }));

export const OPTIONS = {
    courseType: opts("Public", "Private", "Semi-Private", "Resort", "Municipal"),
    state: opts("TEXAS", "ARIZONA", "CALIFORNIA", "COLORADO", "FLORIDA", "NEVADA", "UTAH"),
    country: opts("United States", "Canada", "Mexico", "United Kingdom"),
    timeZone: opts("Eastern Standard Time", "Central Standard Time", "Mountain Standard Time", "Pacific Standard Time"),
    holes: opts("9", "18", "27", "36"),
    invoiceType: opts("Modern", "Classic"),
    linkType: opts("Facebook", "Instagram", "X (Twitter)", "YouTube", "TikTok", "Website", "Booking"),
    holeCount: opts("9 holes", "18 holes"),
    taxRate: opts("Standard Tax (8.25%)", "TB tax (6%)", "Tax Exempt (0%)", "Admissions Tax (7.5%)", "chan tax (8.875%)"),
    bookingEngineType: opts("Standard", "Dynamic", "Marketplace"),
    minHoles: opts("9", "18"),
    maxHoles: opts("9", "18"),
    leadTime: opts("5 Minutes", "10 Minutes", "15 Minutes", "30 Minutes", "60 Minutes"),
    cartSignout: opts("Quick or Signout", "Quick", "Signout"),
    eventTeeFee: opts("Dunes Rack Prime", "Dunes Rack Twilight", "Dunes Member"),
    eventTransport: opts("Dunes Cart", "Walk", "Push Cart"),
    days: opts("1", "5", "10", "15", "30"),
    domain: opts("All", "Tee times", "Activities"),
    category: opts("All", "Eligibility", "Lead time", "Limits"),
};

export const MAIN_INFO = {
    courseName: COURSE.name,
    subcourseAlias: "North Course",
    courseType: "Public",
    street: "3064 Clarke Rd.",
    city: "Bulverde",
    state: "TEXAS",
    zip: "78163",
    country: "United States",
    phone: "901-636-0932",
    email: "sales@tenfore.golf",
    website: "https://tenfore.golf",
    latitude: "40.3662",
    longitude: "-111.8029",
    geofenceRadius: "25",
    timeZone: "Central Standard Time",
    currencyCountry: "United States",
    languageCountry: "United States",
    numberOfHoles: "18",
    invoiceType: "Modern",
    backgroundColor: "#9E9E9E",
    foregroundColor: "#1E3FAE",
    rewardsExpiration: "365",
    rainCheckExpiration: "365",
    giftCardExpiration: "35000",
    reportingEndTime: "02:00 AM",
    egiftifySubdomain: "https://www.google.com",
    googleTagManagerId: "",
    ga4MeasurementId: "G-KMGX92G9MT",
};

export const MAIN_INFO_TOGGLES = [
    { label: "Realizes Expired Credits", description: "Write expired credits off as revenue when they lapse.", on: true },
    { label: "Show All Company Clinics", on: false },
    { label: "Expose Player Lookup", on: true },
    { label: "Include Family Member Spending", on: true },
];

export const TENFORE_ONLY = {
    parentCompany: "Sample Company",
    vanityName: "dunes",
    plan: "Full Plan",
    status: "Demo Mode",
    // Masked on purpose: the production screenshot showed a live SendGrid key, and this repo is public.
    emailApiKey: "SG.••••••••••••••••••••••.••••••••••••••••••••••••••••••••••••••••••",
    usesMenu: true,
};

export const LINKS = [
    { id: "fb", type: "Facebook", url: "https://facebook.com/dunes" },
    { id: "ig", type: "Instagram", url: "https://instagram.com/dunes" },
];

export const SUB_COURSES = [
    { id: "east", name: "East Course", holes: "18 holes", minBookable: "" },
    { id: "west", name: "West Course", holes: "18 holes", minBookable: "9 holes" },
];

export const TAX_RATE_FIELDS = [
    { label: "General Tee Fee Tax Rate", value: "Standard Tax (8.25%)" },
    { label: "General Tee Fee Tax Rate 2", value: "Standard Tax (8.25%)" },
    { label: "Transportation Tax Rate", value: "Standard Tax (8.25%)" },
    { label: "Transportation Tax Rate 2", value: "Standard Tax (8.25%)" },
    { label: "Open Food Tax Rate", value: "TB tax (6%)" },
    { label: "Open Food Tax Rate 2", value: "TB tax (6%)" },
    { label: "Open Liquor Tax Rate", value: "TB tax (6%)" },
    { label: "Open Liquor Tax Rate 2", value: "TB tax (6%)" },
];

export const SERVICE_CHARGES = [
    { label: "Credit Card Surcharge", value: "4" },
    { label: "F&B Service Charge", value: "21" },
    { label: "Event Service Charge", value: "20" },
];

export const TAX_TYPES = [
    { id: "45", name: "Standard Tax", rate: "8.2500%", alcohol: false, isDefault: true },
    { id: "52", name: "Tax Exempt", rate: "0.0000%", alcohol: false, isDefault: false },
    { id: "2091", name: "TB tax", rate: "6.0000%", alcohol: false, isDefault: false },
    { id: "2104", name: "Admissions Tax", rate: "7.5000%", alcohol: false, isDefault: false },
    { id: "2110", name: "Tax 2", rate: "3.2570%", alcohol: false, isDefault: false },
    { id: "2168", name: "Crazy Taxes", rate: "95.0000%", alcohol: false, isDefault: false },
    { id: "2184", name: "PH", rate: "6.5000%", alcohol: false, isDefault: false },
    { id: "2380", name: "", rate: "10000.0000%", alcohol: false, isDefault: false },
    { id: "2389", name: "Sales Tax Test", rate: "5.5000%", alcohol: false, isDefault: false },
    { id: "2421", name: "The Nest Test", rate: "6.5000%", alcohol: false, isDefault: false },
    { id: "2438", name: "chan tax", rate: "8.8750%", alcohol: false, isDefault: true },
];

export type FeeRow = {
    memberships: string;
    customerTypes: string;
    percent: string;
    amount: string;
    online: boolean;
    inPerson: boolean;
    minDays: string;
    perBooking: string;
    paymentTiming: string;
    refundableBy: string;
};

export const FEE_TABLES: { title: string; tooltip: string; rows: FeeRow[] }[] = [
    {
        title: "Advanced Tee Time Booking Fee",
        tooltip: "Charged when a tee time is booked further ahead than the standard window.",
        rows: [
            {
                memberships: "20 Day Booking window , 30 Day booking window +22",
                customerTypes: "Austin Test, Average Person +15",
                percent: "",
                amount: "$2.00",
                online: false,
                inPerson: true,
                minDays: "4",
                perBooking: "",
                paymentTiming: "At Check-In",
                refundableBy: "Not refundable",
            },
            {
                memberships: "All",
                customerTypes: "All",
                percent: "",
                amount: "$10.00",
                online: false,
                inPerson: true,
                minDays: "0",
                perBooking: "",
                paymentTiming: "At Check-In",
                refundableBy: "Customer",
            },
        ],
    },
    {
        title: "Clinic Registration Fee",
        tooltip: "Added to every clinic registration.",
        rows: [
            {
                memberships: "All",
                customerTypes: "All",
                percent: "",
                amount: "$5.00",
                online: false,
                inPerson: true,
                minDays: "",
                perBooking: "",
                paymentTiming: "At Booking",
                refundableBy: "Not refundable",
            },
        ],
    },
    {
        title: "Booking Deposit",
        tooltip: "Collected up front to hold a booking.",
        rows: [
            {
                memberships: "All",
                customerTypes: "All",
                percent: "",
                amount: "$10.00",
                online: false,
                inPerson: true,
                minDays: "0",
                perBooking: "",
                paymentTiming: "At Booking",
                refundableBy: "Employee",
            },
        ],
    },
];

/** `enabled` payment types also show their "Disable tip line" switch. */
export const PAYMENT_TYPES: { name: string; enabled: boolean }[] = [
    { name: "Accounts Receivable", enabled: true },
    { name: "ACH", enabled: true },
    { name: "Android Pay", enabled: true },
    { name: "Bad Debt", enabled: true },
    { name: "Balance Forward", enabled: false },
    { name: "Cash", enabled: true },
    { name: "Check", enabled: true },
    { name: "Club Account", enabled: true },
    { name: "Course Custom", enabled: true },
    { name: "Credit", enabled: true },
    { name: "Custom", enabled: false },
    { name: "Customer Balance Import", enabled: false },
    { name: "Customer Charge", enabled: true },
    { name: "eGiftify Gift Card", enabled: false },
    { name: "External ACH", enabled: false },
    { name: "Gift Card", enabled: true },
    { name: "Givex Gift Card", enabled: false },
    { name: "Internet Sales", enabled: true },
    { name: "Management", enabled: true },
    { name: "Multiple", enabled: false },
    { name: "Owner Credit", enabled: false },
    { name: "Prepaid Food Minimum", enabled: false },
    { name: "Promotions", enabled: false },
    { name: "Rain Check", enabled: true },
    { name: "Realized Income", enabled: false },
    { name: "Room Charge - HK", enabled: false },
    { name: "Room Charge - OHIP", enabled: false },
    { name: "Room Charge - RM", enabled: false },
    { name: "Sponsorship", enabled: false },
    { name: "Tab", enabled: true },
    { name: "Trade", enabled: false },
    { name: "VIP Host", enabled: false },
];

export const ADDITIONAL_MIDS = [
    { type: "Pro Shop Only", processor: "Card Connect", mid: "850000000054", clover: false },
    { type: "Restaurant Only", processor: "Card Connect", mid: "850000000054", clover: true },
    { type: "ACH Only", processor: "Card Connect", mid: "850000000054", clover: false },
];

export const PAYMENT_OTHER_FIELDS = [
    { label: "Back of House Distribution", value: "12" },
    { label: "Front of House Distribution", value: "3" },
    { label: "Back of House Event Distribution", value: "15" },
    { label: "Front of House Event Distribution", value: "5" },
    { label: "Surcharge Notice Percentage", value: "3.6" },
    { label: "Auto Charge Credit Surcharge", value: "3.5" },
];

export const PAYMENT_TOGGLES = [
    { label: "Tab Skip Credit Needs Approval", on: false },
    { label: "CardConnectV4", on: true },
    { label: "Order Cancels Require Manager", on: true },
    { label: "Tee Fee Edits Require Manager", on: false },
    { label: "Pro Shop Accepts Tips", on: false },
    { label: "Save Card When Membership Purchased", on: true },
    { label: "Paperless Tipping in Restaurant", on: true },
    { label: "Request Signatures on Cardpointe", on: false },
    { label: "Allow refunds without manager pin", on: true },
    { label: "Consolidate GLA CC Brands", on: false },
    { label: "Credit Card Tips As Cash", on: false },
];

export const BOOKING_ENGINE = {
    type: "Standard",
    maxDaysPublic: "7",
    maxDaysMembers: "14",
    bookingsAvailableAt: "12:01 AM",
    cancelHours: "12",
    minHoles: "9",
    maxHoles: "18",
    maxPerDay: "1",
    minPlayers: "1",
    maxPlayers: "4",
    maxCourtDays: "10",
    standbyOpen: "",
    standbyClose: "",
};

export const BOOKING_TOGGLES = [
    { label: "Disable Booking Engine", on: false },
    { label: "Members Only", on: false },
    { label: "Disable Reserve", on: false },
    { label: "Disable Purchase", on: false },
    { label: "Activities Disable Reserve", on: false },
    { label: "Activities Disable Purchase", on: false },
    { label: "Show split times in booking engine", on: false },
    { label: "Require card on file", on: true },
    { label: "Require phone number", on: false },
    { label: "Force singles to group", on: true },
    { label: "Only one group per time", on: false },
    { label: "Collect guest info", on: true },
    { label: "Rainchecks Only on Tee Times", on: true },
    { label: "Enable Back 9 Booking Functionality", on: true },
    { label: "Require Identity Verification Booking", on: false },
    { label: "Show Tee Fee Only", on: true },
    { label: "Disable Anonymous Golfers", on: false },
];

/** Disclaimer bodies, stored as the HTML the legacy editor saved. */
export const DISCLAIMERS = {
    booking: `<p>xss test</p>
<p><br></p>
<p style="text-align:center">Coral Canyon Golf Course welcomes you to come out and enjoy some great golf here in the Greater Zion area.</p>
<p style="text-align:center"><u>A Credit Card is required at the time of booking both online and over the phone to make a tee time reservation.</u></p>
<p><br></p>
<p><strong><u>The price reflecting on here for the tee time is per person and does not include tax. Tax (6.75%) will be added at time of check out either online or in person at the golf course. </u></strong></p>
<p><br></p>
<p style="text-align:center"><strong style="color:#e05b5b">*** Starting September 1st 2025, we will not be allowing any "extra riders or extra carts" for any groups. ***</strong></p>
<p><br></p>
<p><strong><u>Course Maintenance:</u></strong></p>
<p><strong style="background-color:#ffff00">The Driving Range is closed on Tuesday in the afternoon for maintenance. Times vary throughout the year, please call the golf shop for more details. 435-688-1700</strong></p>
<p><br></p>
<p><strong>Aeration Dates:</strong></p>
<p><strong>May 4th</strong> Starting at 1:00 PM</p>
<p><strong>May 5th - 6th All Day</strong>.</p>
<p><strong>August 15th - 25th</strong>. Greens and golf course aeration.</p>
<p><br></p>
<p>--Range balls are included in your golf fee and available prior to your tee time.</p>
<p>--Cancellations must be made outside of 24 hours. Any no show or cancellation within 24 hours will be charged full rate.</p>
<p>--Dress code is in effect for the golf course.</p>
<p>--Proper golf attire is expected at all times.</p>
<p>--A shirt, pants/shorts, and footwear must be worn at all times.</p>
<p>--Denim of any kind is strictly prohibited, and collared shirts are required. Prohibited items include but are not limited to gym clothes, sleeveless and tank tops, and any items adorned with offensive, profane, or inappropriate words or images.</p>
<p>--Z Golf management in its sole and absolute discretion may at any time deem attire inappropriate.</p>
<p>--We please ask you to arrive at least thirty minutes before your scheduled tee time for ample check-in time.</p>
<p>--*** Twilight Tee Times do not guarantee you to finish 18 Holes of golf, that is why the tee times are discounted fees. You have the option in our twilight time frames to only play 9 holes and pay the 9 hole rate. Please check with the golf shop staff at time of check -----in***</p>
<p><br></p>
<p style="font-size:1.15em"><em>Coral Canyon is&nbsp; proud to partner with Ship Sticks to provide an easier way to get your golf clubs to and from on your golf trip. Visit <a href="https://www.shipsticks.com/coral-canyon" target="_blank" rel="noreferrer">https://www.shipsticks.com/coral-canyon </a>today to set up your shipment.</em></p>
<p style="text-align:center;font-size:1.15em"><strong><em>Save 10% by using our link</em></strong></p>
<p><img src="${asset("ship-sticks.png")}" alt="Ship Sticks" style="width:205px"></p>`,
    cancellation: `<p><img src="${asset("missing-image.png")}" alt=""></p>
<p><br></p>
<h1>Cancelation Policy</h1>
<p>This cancelation is updatable in the <strong>database</strong></p>
<p>You must give at least a <strong><em>24 hour notice</em></strong></p>`,
    clinic: `<p><img src="${asset("missing-image.png")}" alt=""></p>
<p><img src="${asset("missing-image.png")}" alt=""></p>
<p><br></p>
<p>Clinics are great!</p>`,
};

export const BOOKING_RULES = [
    {
        id: 1,
        rule: "trevor test 60 minute leeway",
        type: "Minimum Lead Time",
        domain: "Tee times",
        appliesTo: "Everyone",
        limit: "60",
        when: "Always",
        outcome: "Block" as const,
        channels: "Online",
        enabled: true,
    },
    {
        id: 2,
        rule: "Early Bird (Halla)",
        type: "Booking-Set Eligibility",
        domain: "Activities",
        appliesTo: "Average Person",
        limit: "",
        when: "7:00 AM–7:59 AM · 2026-01-01 to 2026-12-31",
        outcome: "Grant" as const,
        channels: "Online",
        enabled: true,
    },
];

export const WAITLIST_TOGGLES = [
    { label: "Enable Waitlist", on: true },
    { label: "Notify by Email", description: "Allow customers to receive waitlist notifications by email.", on: true },
    { label: "Notify by Text", description: "Allow customers to receive waitlist notifications by text message.", on: true },
    { label: "Allow Waitlist With Available Times", description: "Permit creating waitlists even when matching tee times are available.", on: true },
];

export const BIRDIE_DEFAULTS = {
    cartSignout: "Quick or Signout",
    eventTeeFee: "Dunes Rack Prime",
    eventTransport: "Dunes Cart",
    commonHoles: "18",
};

export const BIRDIE_TOGGLES = [
    { label: "Auto Print Pro Shop Receipts", on: true },
    { label: "Auto Print Starter Tickets", on: true },
    { label: "Tip Suggestions on F&B Receipts", on: true },
    { label: "Roll Fees Into Items on Receipts", on: false },
    { label: "Search By SKU", on: true },
    { label: "Blind Checkout", on: true },
    { label: "Force Registered Tee Times", on: false },
    { label: "Require Credit Card To Start Tab", on: false },
    { label: "Only Members Can Charge", on: true },
    { label: "Disallow Negative Balance", on: false },
    { label: "Cross Course Member Balance", on: false },
];

export const RECEIPT_TEXT = {
    proShop: "Thank you for playing!",
    restaurant: "Emerald Isle Test!!",
    cartDisclaimer: "",
};

const t = (id: string, description: string, identifier: string, printer = "") => ({ id, description, identifier, printer });

export const TABLETS = [
    t("000004", "Jarrett emu elo 15", "abdd51bb19c28469", "Lisa's Demo Printer"),
    t("000007", "Jarrette Samsung S6 (local)", "8634ee3b783eed43"),
    t("000008", "TenFore Tab S6 (google play)", "37a87d64dbdf8052"),
    t("000021", "Jarrette Emu Tab S6", "5ad702000b30ac60"),
    t("000022", "Jarrette Galaxy Tab A (google play)", "af25d5f98759a510"),
    t("000023", "Jarrette Flex 3 Local", "60a58339d16b06a1"),
    t("000027", "Jarrette Galaxy Tab A (Google)", "f4d7fde21fada5c2"),
    t("000028", "Jarrette Win Emu", "4165c87a91e79301"),
    t("000032", "Not Used", "444ba30e61552031", "Lisa's Demo Printer"),
    t("000034", "Jarrette Flex V4", "5524d055732ddacc"),
    t("000044", "Sawyer's Mini", "9b96ecbb0d72ac3c", "QA1 Test Printer"),
    t("000047", "Jarrette Flex 3 Sandbox", "e416611230017010"),
    t("000057", "Elo-i3-15Std-Chance", "cc32d0619d67bd1a", "Lisa's Demo Printer"),
    t("000064", "Jarrette TCL1 Google Play", "85703b43980dc38a", "Pro Shop 1"),
    t("000070", "Jarrette Laptop", "20662ae0c03797bd"),
    t("000079", "Jarrette Phone", "5d5485f2a5b055a8", "Lisa's Demo Printer"),
    t("000110", "Jarrette Clover Mini Dev Kit P", "b36fa43f172cbc85", "Lisa's Demo Printer"),
    t("000116", "jarrette emu tab A7 10.4", "8e40090c470295c3"),
    t("000134", "Developer Device 1", "277bdb8b3b261403"),
    t("000135", "Android SDK built for x86", "5838c3493fc69acb"),
    t("000136", "Jay2", "c7c8ce3134235c2f"),
    t("000137", "Dev Jarrette Flex WiFi Emulator", "f29cfeb0f717404f"),
    t("000138", "Android SDK built for x86", "79c463ea2bb0e024"),
    t("000140", "SportyJay1", "ec2bf09d6b1e0478"),
    t("000141", "SM-A305F", "8715919abc5ef875"),
    t("000142", "Redmi Note 5", "dd2febbc62fb68e2"),
    t("000143", "Jarrette PC", "5f3043a77543e252"),
    t("000144", "Android SDK built for x86", "a336b9bafd0636b4"),
    t("000145", "Android SDK built for x86", "b96128d91c505558"),
    t("000148", "Jarrette Emu Pixel 5", "fc7b0e1d585366f2"),
    t("000149", "jonathan flex", "ca381e5bceb52bb5"),
    t("000150", "Ryan Ewer Windows11", "a31a03c31d8f5813"),
    t("000151", "sdk_gphone64_x86_64", "785e6ff5b20ad2b9"),
    t("000153", "Android SDK built for x86", "a9bb998e27dcf041"),
    t("000158", "Jarrette TCL Tab Local", "954acc6754a4eac0", "Lisa's Demo Printer"),
    t("000161", "Charlie's Samsung Test Tablet", "502b7e6ee17330ae", "Charlie's Fake Printer"),
    t("000195", "Nest Test 1 *Do not Use", "46cb2af7eba75dbb"),
    t("000196", "nest test 2", "81d0d2a287f5f005"),
    t("000197", "Test Nest 4", "fa03c51007303915"),
    t("000224", "Android SDK built for x86", "c39e7e6a921fc95d"),
    t("000225", "Emu Jarrette 22", "e8ccbba25f8e7b12"),
    t("000233", "Android SDK built for x86", "bc5a6a9722ea1420"),
    t("000234", "QA1 Clover Mini", "be23ac18636d59c2", "QA1 Test Printer"),
    t("000241", "sdk_gphone64_x86_64", "877f63c99ec4be6d"),
    t("000242", "Android SDK built for x86", "b997dbdf344bbfb7"),
    t("000243", "Redmi Note 5 Pro", "fb0aa780c4a02c27"),
    t("000244", "Android SDK built for x86", "afe476906725db8d"),
    t("001196", "Lisa's Clover Flex", "70b9ab2b7b81ffa4", "QA1 Test Printer"),
    t("001237", "Sawyer's Emulator", "6d0100b971383c89"),
    t("001252", "Austin MicroTouch 22", "e6fbcb48bc557cb9"),
    t("001254", "Jensen Quest Handheld", "b3d0719f634c52c0"),
    t("001257", "Austin MicroTouch 15", "83a68213bbe5af5e"),
    t("001258", "Austin Esper 22", "926072b747c5e0aa"),
    t("001262", "Steven's TenFore", "4a1b2ba1191a6f49"),
    t("001263", "Jensen macOS Desktop", "501639bfb013ba47", "Matt Jensen TSP100"),
    t("001266", "Austin quest", "69ccb636beff7d22"),
    t("001267", "22in-I-Series-4-Value", "c88c8d7139ba707a"),
];

export const TRANSPORTATION_TYPES = [
    { type: "Cart", booking: true, isDefault: true },
    { type: "Walk", booking: true, isDefault: false },
    { type: "Push Cart", booking: false, isDefault: false },
];

export const NOTIFICATIONS = {
    billingFromEmail: "hello@tenfore.golf",
    statementAfterDay: "1",
    chargeAfterDay: "1",
    twilioPhone: "8305901104",
    sendGridDomain: "reply.tenfore.golf",
    defaultFromEmail: "sales@tenfore.golf",
    defaultFromName: COURSE.name,
    defaultReplyTo: "dunes@reply.tenfore.golf",
};

export const NOTIFICATION_TOGGLES = [
    { label: "Restaurant Reservations Require Email", on: true },
    { label: "Send Statement Emails", on: true },
    { label: "Show Statements Online", on: false },
];

export const SCHEDULED_NOTIFICATIONS = [
    { id: "001024", type: "Online reservation", frequency: "Instantly", recipients: "Hamlet Suazo, Weston Farnsworth" },
    { id: "001072", type: "High customer charge balances", frequency: "Monthly", recipients: "Sauce Boss" },
    { id: "001074", type: "Payment Job", frequency: "Instantly", recipients: "Sawyer Pearson" },
    { id: "001092", type: "Online reservation", frequency: "Instantly", recipients: "Chance Hindbaugh" },
];

export const PRINTERS = [
    { name: "Chance Test Printer", uses: ["F&B Receipt Printer", "Pro Shop Printer"], mac: "00:00:00:00:00:99", jobs: 0, popOnCash: true },
    {
        name: "Charlie's Fake Printer",
        uses: ["Service Printer", "F&B Receipt Printer", "Pro Shop Printer"],
        mac: "00:00:00:00:00:44",
        jobs: 0,
        popOnCash: false,
    },
    { name: "Jarrette MC-Label3", uses: ["Sticker Printer"], mac: "00:11:62:45:66:39", jobs: 0, popOnCash: false },
    { name: "Jensen Wrong Printer", uses: [], mac: "00:11:62:56:f8:f6", jobs: 0, popOnCash: false },
    {
        name: "Lisa's Demo Printer",
        uses: ["F&B Receipt Printer", "Pro Shop Printer", "Service Printer", "Sticker Printer"],
        mac: "00:11:62:1e:18:f0",
        jobs: 1,
        popOnCash: false,
    },
    { name: "Matt Jensen TSP100", uses: ["Service Printer"], mac: "00:11:62:5A:A7:F8", jobs: 0, popOnCash: false },
    { name: "QA1 Test Printer", uses: ["F&B Receipt Printer"], mac: "00:11:62:1D:FB:ED", jobs: 1, popOnCash: false },
    { name: "Sawyer's Printer", uses: ["Pro Shop Printer", "F&B Receipt Printer"], mac: "00:11:62:1D:FB:ED", jobs: 1, popOnCash: false },
    { name: "Test Kitchen Cold", uses: [], mac: "00:00:00:00:00:01", jobs: 0, popOnCash: false },
    { name: "Test Kitchen Expo", uses: [], mac: "00:00:00:00:00:03", jobs: 0, popOnCash: false },
    { name: "Test Kitchen Hot - 19th Hole", uses: [], mac: "00:00:00:00:00:02", jobs: 0, popOnCash: false },
    { name: "Test Pro Shop", uses: ["F&B Receipt Printer", "Pro Shop Printer"], mac: "00:00:00:00:00:09", jobs: 44, popOnCash: false },
];

export const IMAGES = [
    { label: "Hero Image", src: asset("hero-image.png"), fit: "cover" as const },
    { label: "Course Photography", src: asset("course-photography.png"), fit: "cover" as const },
    { label: "Course Logo", src: asset("course-logo.png"), fit: "contain" as const },
];

export const DOCUMENTS = [
    {
        description: "First Document",
        minUserType: "Customer",
        membersOnly: true,
        created: { at: "Apr 17, 2024 01:26 AM", by: "Jarrette Schule" },
        updated: { at: "Apr 17, 2024 10:00 AM", by: "Jarrette Schule" },
    },
    {
        description: "Test Doc",
        minUserType: "Portal Registrants",
        membersOnly: true,
        created: { at: "Nov 21, 2024 12:56 PM", by: "Chance Hindbaugh" },
        updated: { at: "Nov 21, 2024 12:59 PM", by: "Chance Hindbaugh" },
    },
    {
        description: "eicar test document",
        minUserType: "Customer",
        membersOnly: false,
        created: { at: "Jan 26, 2026 07:48 PM", by: "Sean Butler" },
        updated: { at: "Jan 26, 2026 07:48 PM", by: "Sean Butler" },
    },
    { description: "html test", minUserType: "Customer", membersOnly: false, created: { at: "Jan 26, 2026 07:50 PM", by: "Sean Butler" }, updated: null },
    { description: "empty test file", minUserType: "Customer", membersOnly: false, created: { at: "Jan 27, 2026 08:26 AM", by: "Sean Butler" }, updated: null },
    { description: "api test", minUserType: "Customer", membersOnly: true, created: { at: "Feb 04, 2026 02:10 PM", by: "Sean Butler" }, updated: null },
    { description: "Chris Test", minUserType: "Customer", membersOnly: false, created: { at: "Mar 20, 2026 12:27 PM", by: "Chris O'Dell" }, updated: null },
    {
        description: "file upload retest - eicar",
        minUserType: "Employee",
        membersOnly: false,
        created: { at: "Sep 09, 2026 09:05 AM", by: "Sean Butler" },
        updated: { at: "Sep 09, 2026 09:34 AM", by: "Sean Butler" },
    },
];

export const COMPANY = {
    dailyRoundLimit: "100",
    storeCustomersCourse: "None",
    bookingOverlapHours: "4",
};

export const COMPANY_TOGGLES = [
    { label: "Share Booking Engine", on: true },
    { label: "Search All Company Courses", on: false },
    {
        label: "Share Customer Search",
        description: "Let the company's courses see each other's customers. The All Courses option on reports returns nothing without this.",
        on: true,
    },
];

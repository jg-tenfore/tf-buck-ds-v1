/**
 * Intent keywords for settings search.
 *
 * Settings are named the way the product talks ("Order Cancels Require
 * Manager"); people search the way they think ("stop my staff from voiding
 * orders"). Each entry adds the words someone might use for that goal, keyed by
 * the setting's exact label. This is the hand-tuned seed for what could later
 * come from the AI assistant.
 */

const STAFF = "block restrict prevent stop employee staff permission approval manager pin override";
const TIPS = "tip tips gratuity";
const CARD_FEES = "credit card fee processing convenience pass on cost";
const TENDER = "payment method tender accept take pay with";

export const SEARCH_KEYWORDS: Record<string, string> = {
    // Main Info
    "Course Name": "business name facility club title rename",
    "Subcourse Alias": "nickname course name",
    "Course Type": "public private semi-private resort municipal",
    "Contact Phone": "phone number call telephone",
    "Contact Email": "email address contact support",
    "Website URL": "website site homepage link",
    Latitude: "location gps map coordinates",
    Longitude: "location gps map coordinates",
    "GeoFence Radius": "location gps distance app check-in nearby geofencing",
    "Time Zone": "timezone clock hours dates daylight",
    "Currency Country": "money currency dollars",
    "Language Country": "language locale translation",
    "Number of Holes": "holes 9 18",
    "Invoice Type": "invoice statement format bill",
    "Background Color": "brand colors theme logo look",
    "Foreground Color": "brand colors theme logo look",
    "Rewards Expiration (days)": "loyalty points rewards expire expiry",
    "Rain Check Expiration (days)": "rain check weather credit expire expiry",
    "Gift Card Expiration (days)": "gift card certificate expire expiry",
    "Reporting End Time": "end of day close out reports cutoff business day",
    "EGiftify Subdomain": "gift card online store egiftify",
    "Google Tag Manager ID": "analytics tracking marketing pixel gtm",
    "GA4 Measurement ID": "google analytics tracking marketing",
    "Realizes Expired Credits": "revenue expired credits breakage accounting",
    "Show All Company Clinics": "lessons clinics instruction other courses",
    "Expose Player Lookup": "player search find golfer lookup",
    "Include Family Member Spending": "family household spending dependents",
    "Email API Key": "sendgrid email key",

    // Taxes & Fees
    "Credit Card Surcharge": CARD_FEES,
    "F&B Service Charge": "food beverage restaurant gratuity service charge auto grat",
    "Event Service Charge": "event outing banquet service charge",

    // Payments
    "Tab Skip Credit Needs Approval": `${STAFF} tab bar credit card`,
    CardConnectV4: "card processor cardconnect terminal integration",
    "Order Cancels Require Manager": `${STAFF} cancel void delete orders`,
    "Tee Fee Edits Require Manager": `${STAFF} change price edit discount tee fee rate`,
    "Pro Shop Accepts Tips": `${TIPS} pro shop`,
    "Save Card When Membership Purchased": "card on file save credit card membership recurring dues",
    "Paperless Tipping in Restaurant": `${TIPS} restaurant signature receipt paperless`,
    "Request Signatures on Cardpointe": "signature sign terminal cardpointe",
    "Allow refunds without manager pin": `${STAFF} refund return money back`,
    "Consolidate GLA CC Brands": "accounting general ledger visa mastercard amex combine",
    "Credit Card Tips As Cash": `${TIPS} payout cash out employees`,
    "Surcharge Notice Percentage": CARD_FEES,
    "Auto Charge Credit Surcharge": CARD_FEES,
    "Back of House Distribution": `${TIPS} split pool kitchen distribution`,
    "Front of House Distribution": `${TIPS} split pool servers distribution`,
    "Back of House Event Distribution": `${TIPS} split pool kitchen event`,
    "Front of House Event Distribution": `${TIPS} split pool servers event`,

    // Booking Engine
    "Booking Engine Type": "online booking tee times website",
    "Max days out a player can book (public)": "booking window advance how far ahead days out public",
    "Max days out a player can book (members)": "booking window advance how far ahead days out members",
    "What time do bookings come available?": "booking window opens release time midnight",
    "Hours before time users can cancel": "cancellation window cancel policy no show",
    "Minimum Holes Players Can Book": "9 holes 18 holes minimum",
    "Maximum Holes Players Can Book": "9 holes 18 holes maximum",
    "Max times a player can book per day": "limit bookings per day hoarding",
    "Minimum players to book": "group size party size singles",
    "Maximum players to book": "group size party size foursome",
    "Max Court Booking Days Out": "pickleball tennis court booking window",
    "Disable Booking Engine": "turn off online booking stop tee times close website booking",
    "Members Only": "private restrict public booking members block non-members",
    "Disable Reserve": "block reserve without paying hold",
    "Disable Purchase": "block prepay pay online",
    "Require card on file": "credit card required no show protection guarantee",
    "Require phone number": "phone required contact",
    "Force singles to group": "singles fill pairing join group",
    "Only one group per time": "private tee time one group",
    "Collect guest info": "guest names emails players contact",
    "Rainchecks Only on Tee Times": "rain check weather credit",
    "Enable Back 9 Booking Functionality": "back nine 10th tee split tee",
    "Require Identity Verification Booking": "id verify identity fraud",
    "Show Tee Fee Only": "price display fees hidden cart fee",
    "Disable Anonymous Golfers": "guest walk-in unnamed player require name",
    "Booking Disclaimer": "terms policy dress code message notes booking page",
    "Cancellation Disclaimer": "terms cancel policy refund message",
    "Clinic Terms": "terms lessons instruction waiver",

    // Booking Waitlist
    "Enable Waitlist": "standby notify when tee time opens sold out",
    "Notify by Email": "email alerts standby",
    "Notify by Text": "sms text alerts standby",

    // Birdie
    "Cart Signout Method": "golf cart sign out kiosk",
    "Auto Print Pro Shop Receipts": "printer receipt print automatically",
    "Auto Print Starter Tickets": "printer starter ticket print automatically",
    "Tip Suggestions on F&B Receipts": `${TIPS} suggested percentages restaurant`,
    "Search By SKU": "barcode scan product lookup",
    "Blind Checkout": "cash drawer count close out",
    "Require Credit Card To Start Tab": `${STAFF} tab bar card`,
    "Only Members Can Charge": "house account charge members block non-members",
    "Disallow Negative Balance": "overdraft balance block credit",
    "Cross Course Member Balance": "multi course balance share members",
    "Pro Shop Receipt Tag": "receipt footer message thank you",
    "Restaurant Receipt Tag": "receipt footer message thank you",
    "Cart Sign Out Disclaimer": "golf cart waiver terms",

    // Notifications
    "Twilio Phone Number": "sms text message phone number",
    "Send Grid Inbound Domain": "email replies sendgrid",
    "Default From Email": "email sender from address",
    "Default From Name": "email sender name",
    "Default Reply To Email": "email reply address",
    "Billing From Email": "statements invoices email sender",
    "Send Statement Emails": "statements invoices billing email monthly",
    "Show Statements Online": "statements invoices portal online",
    "Restaurant Reservations Require Email": "restaurant reservation email required",

    // Company
    "Share Booking Engine": "multi course share booking",
    "Share Customer Search": "multi course share customers",
    "Daily Round Limit": "limit rounds per day",
};

/** Everything a payment-type row should answer to. */
export const PAYMENT_TYPE_KEYWORDS = TENDER;

/** Goal-style searches offered before the user types — shows off intent matching. */
export const SUGGESTED_SEARCHES = [
    "Block employees from refunds",
    "How far ahead can players book",
    "Credit card fees",
    "Tips",
    "Receipt printer",
    "Turn off online booking",
];

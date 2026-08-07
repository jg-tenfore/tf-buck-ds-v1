import { type ComponentType, type ReactNode, lazy } from "react";

/** The screen that opens first when the prototype loads. */
export const DEFAULT_URL = "/my-golf-course/dashboard";

type StoryLike = { render?: (...args: never[]) => ReactNode };

/**
 * Build a lazily-loaded screen from a dynamic import of a story module plus the
 * export name to render. This is what keeps the standalone Next.js app light:
 * each screen is its own code-split chunk, so navigating to a screen compiles
 * and loads ONLY that screen — never all 65 at once (which otherwise blows up
 * dev-server memory). Storybook (Vite) code-splits the same way.
 */
const screen = (loader: () => Promise<Record<string, unknown>>, exportName: string): ComponentType =>
    lazy(async () => {
        const mod = await loader();
        const story = mod[exportName] as StoryLike;
        const Screen = () => <>{(story.render as () => ReactNode)()}</>;
        return { default: Screen };
    });

/**
 * Maps every nav URL that has a built screen to a lazily-loaded component. The
 * component reuses the exact same story shown in "App Screens/…", so the
 * prototype and the standalone stories can never drift apart. URLs not listed
 * here fall back to the MissingScreen placeholder.
 */
export const SCREEN_REGISTRY: Record<string, ComponentType> = {
    // My Golf Course
    "/my-golf-course/dashboard": screen(() => import("@/stories/screens/MyGolfCourse.stories"), "Dashboard"),
    "/my-golf-course/whats-new": screen(() => import("@/stories/screens/MyGolfCourse.stories"), "WhatsNew"),
    "/my-golf-course/departments": screen(() => import("@/stories/screens/MyGolfCourse.stories"), "Departments"),
    "/my-golf-course/locations": screen(() => import("@/stories/screens/MyGolfCourse.stories"), "Locations"),
    "/my-golf-course/settings": screen(() => import("@/stories/screens/MyGolfCourse.stories"), "Settings"),
    "/my-golf-course/integrations": screen(() => import("@/stories/screens/MyGolfCourse.stories"), "Integrations"),

    // Company
    "/company/settings": screen(() => import("@/stories/screens/Company.stories"), "Settings"),
    "/company/duplicate-customers": screen(() => import("@/stories/screens/Company.stories"), "DuplicateCustomers"),

    // Orders
    "/orders/all": screen(() => import("@/stories/screens/Orders.stories"), "AllOrders"),

    // Reports
    "/reports/general-ledger": screen(() => import("@/stories/screens/Reports.stories"), "GeneralLedgerReport"),
    "/reports/general-ledger/codes": screen(() => import("@/stories/screens/Reports.stories"), "GeneralLedgerCodes"),
    "/reports/user-activities": screen(() => import("@/stories/screens/Reports.stories"), "UserActivities"),
    "/reports/waitlists": screen(() => import("@/stories/screens/Reports.stories"), "Waitlists"),
    "/reports/credits/gift-cards": screen(() => import("@/stories/screens/Reports.stories"), "GiftCards"),
    "/reports/credits/rain-checks": screen(() => import("@/stories/screens/Reports.stories"), "RainChecks"),
    "/reports/credits/payment-sources": screen(() => import("@/stories/screens/Reports.stories"), "PaymentSources"),
    "/reports/credits/punch-cards": screen(() => import("@/stories/screens/Reports.stories"), "PunchCards"),
    "/reports/charges/statements": screen(() => import("@/stories/screens/Reports.stories"), "Statements"),
    "/reports/charges/aging": screen(() => import("@/stories/screens/Reports.stories"), "Aging"),
    "/reports/revenue/sales-by-category": screen(() => import("@/stories/screens/Reports.stories"), "SalesByCategory"),
    "/reports/revenue/combined": screen(() => import("@/stories/screens/Reports.stories"), "CombinedReport"),
    "/reports/revenue/discounts-promos": screen(() => import("@/stories/screens/Reports.stories"), "DiscountsPromos"),
    "/reports/rounds/weekly": screen(() => import("@/stories/screens/Reports.stories"), "WeeklyRounds"),
    "/reports/rounds/monthly": screen(() => import("@/stories/screens/Reports.stories"), "MonthlyRounds"),

    // Golf
    "/golf/tee-sheet/daily": screen(() => import("@/stories/screens/Golf.stories"), "DailyTeeSheet"),
    "/golf/tee-sheet/schedules": screen(() => import("@/stories/screens/Golf.stories"), "Schedules"),
    "/golf/tee-sheet/auto-block-templates": screen(() => import("@/stories/screens/Golf.stories"), "AutoBlockTemplates"),
    "/golf/tee-sheet/starter-sheet": screen(() => import("@/stories/screens/Golf.stories"), "StarterSheet"),
    "/golf/fees": screen(() => import("@/stories/screens/Golf.stories"), "Fees"),

    // Simulator Bays
    "/simulator-bays/bays": screen(() => import("@/stories/screens/SimulatorBays.stories"), "Bays"),
    "/simulator-bays/fees": screen(() => import("@/stories/screens/SimulatorBays.stories"), "Fees"),
    "/simulator-bays/schedules": screen(() => import("@/stories/screens/SimulatorBays.stories"), "Schedules"),
    "/simulator-bays/bookings": screen(() => import("@/stories/screens/SimulatorBays.stories"), "Bookings"),
    "/simulator-bays/settings": screen(() => import("@/stories/screens/SimulatorBays.stories"), "Settings"),

    // Activities
    "/activities/resources": screen(() => import("@/stories/screens/Activities.stories"), "Resources_"),
    "/activities/fees": screen(() => import("@/stories/screens/Activities.stories"), "Fees_"),
    "/activities/schedules": screen(() => import("@/stories/screens/Activities.stories"), "Schedules_"),
    "/activities/bookings": screen(() => import("@/stories/screens/Activities.stories"), "Bookings_"),
    "/activities/settings": screen(() => import("@/stories/screens/Activities.stories"), "Settings_"),

    // Instruction
    "/instruction/clinics/templates": screen(() => import("@/stories/screens/Instruction.stories"), "ClinicTemplates"),
    "/instruction/clinics/instances": screen(() => import("@/stories/screens/Instruction.stories"), "ClinicInstances"),
    "/instruction/clinics/waitlist": screen(() => import("@/stories/screens/Instruction.stories"), "ClinicWaitlist"),
    "/instruction/clinics/sold": screen(() => import("@/stories/screens/Instruction.stories"), "ClinicSold"),

    // F & B
    "/f-and-b/restaurant": screen(() => import("@/stories/screens/FoodAndBeverage.stories"), "Restaurant"),
    "/f-and-b/restaurant/reservations": screen(() => import("@/stories/screens/FoodAndBeverage.stories"), "Reservations"),

    // Customers
    "/customers/list": screen(() => import("@/stories/screens/Customers.stories"), "Customers_"),
    "/customers/types": screen(() => import("@/stories/screens/Customers.stories"), "CustomerTypes"),

    // Employees
    "/employees/list": screen(() => import("@/stories/screens/Employees.stories"), "Employees_"),
    "/employees/time-clock/employee-hours": screen(() => import("@/stories/screens/Employees.stories"), "TimeClockEmployeeHours"),
    "/employees/time-clock/all-hours": screen(() => import("@/stories/screens/Employees.stories"), "TimeClockAllHours"),
    "/employees/tip-outs": screen(() => import("@/stories/screens/Employees.stories"), "TipOuts"),
    "/employees/tips-report": screen(() => import("@/stories/screens/Employees.stories"), "TipsReport"),

    // Membership
    "/membership/memberships": screen(() => import("@/stories/screens/Membership.stories"), "Memberships"),
    "/membership/members": screen(() => import("@/stories/screens/Membership.stories"), "Members"),
    "/membership/member-report": screen(() => import("@/stories/screens/Membership.stories"), "MemberReport"),

    // Products
    "/products/list": screen(() => import("@/stories/screens/Products.stories"), "List"),
    "/products/groups": screen(() => import("@/stories/screens/Products.stories"), "Groups"),
    "/products/inventory": screen(() => import("@/stories/screens/Products.stories"), "Inventory"),
    "/products/inventory/receivables": screen(() => import("@/stories/screens/Products.stories"), "Receivables"),

    // Inventory
    "/inventory/counts": screen(() => import("@/stories/screens/Inventory.stories"), "InventoryCounts"),

    // Events
    "/events/list": screen(() => import("@/stories/screens/Events.stories"), "Events_"),
    "/events/details": screen(() => import("@/stories/screens/Events.stories"), "EventDetails"),

    // Bays (beta)
    "/bays-beta/list": screen(() => import("@/stories/screens/Bays.stories"), "BayList"),
    "/bays-beta/reservations": screen(() => import("@/stories/screens/Bays.stories"), "BayReservations"),
    "/bays-beta/schedules": screen(() => import("@/stories/screens/Bays.stories"), "BaySchedules"),
    "/bays-beta/waitlist": screen(() => import("@/stories/screens/Bays.stories"), "BayWaitlist"),

    // Marketing
    "/marketing/email": screen(() => import("@/stories/screens/Marketing.stories"), "Campaigns"),

    // Admin
    "/admin/reports": screen(() => import("@/stories/screens/Admin.stories"), "ErrorReport"),
    "/admin/scheduled-jobs": screen(() => import("@/stories/screens/Admin.stories"), "ScheduledJobs"),
    "/admin/trades": screen(() => import("@/stories/screens/Admin.stories"), "Trades"),
    "/admin/tablets": screen(() => import("@/stories/screens/Admin.stories"), "Tablets"),
};

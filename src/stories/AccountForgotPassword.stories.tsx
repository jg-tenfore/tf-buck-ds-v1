import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowLeft, CheckCircle, Key01, Lock01, Mail01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";

/**
 * Full password-reset PAGES for the Sagamore member booking account. Each story
 * is a centered Buck-style layout with a `FeaturedIcon` at the top, built
 * from existing base components. Monochromatic, so featured icons stay `gray`
 * except the final success screen. Voice: a member resetting their booking login.
 */
const meta: Meta = {
    title: "Sign in ∕ Sign up/Forgot password",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Step 1 — request a reset link with the member's email. */
export const ForgotPassword: Story = {
    render: () => (
        <div className="flex min-h-screen items-center justify-center bg-primary p-6">
            <div className="w-full max-w-sm text-center">
                <div className="mb-6 flex justify-center">
                    <FeaturedIcon icon={Key01} color="gray" theme="light" size="lg" />
                </div>
                <h1 className="text-2xl font-semibold text-primary">Forgot password?</h1>
                <p className="mt-2 text-md text-tertiary">No worries, we'll send you reset instructions.</p>

                <form className="mt-8 flex flex-col gap-6 text-left">
                    <Input isRequired type="email" label="Email" placeholder="olivia@sagamore.golf" />
                    <Button type="submit" size="lg" className="w-full">
                        Reset password
                    </Button>
                </form>

                <div className="mt-8 flex justify-center">
                    <Button color="link-gray" size="md" iconLeading={ArrowLeft}>
                        Back to log in
                    </Button>
                </div>
            </div>
        </div>
    ),
};

/** Step 2 — confirmation that the reset link is on its way. */
export const CheckEmail: Story = {
    render: () => (
        <div className="flex min-h-screen items-center justify-center bg-primary p-6">
            <div className="w-full max-w-sm text-center">
                <div className="mb-6 flex justify-center">
                    <FeaturedIcon icon={Mail01} color="gray" theme="light" size="lg" />
                </div>
                <h1 className="text-2xl font-semibold text-primary">Check your email</h1>
                <p className="mt-2 text-md text-tertiary">We sent a password reset link to olivia@sagamore.golf</p>

                <div className="mt-8 flex flex-col gap-6">
                    <Button size="lg" className="w-full">
                        Open email app
                    </Button>
                    <p className="text-sm text-tertiary">
                        Didn't receive the email?{" "}
                        <Button color="link-color" size="sm">
                            Click to resend
                        </Button>
                    </p>
                </div>

                <div className="mt-8 flex justify-center">
                    <Button color="link-gray" size="md" iconLeading={ArrowLeft}>
                        Back to log in
                    </Button>
                </div>
            </div>
        </div>
    ),
};

/** Step 3 — choose a new password against the requirements checklist. */
export const SetNewPassword: Story = {
    render: () => (
        <div className="flex min-h-screen items-center justify-center bg-primary p-6">
            <div className="w-full max-w-sm text-center">
                <div className="mb-6 flex justify-center">
                    <FeaturedIcon icon={Lock01} color="gray" theme="light" size="lg" />
                </div>
                <h1 className="text-2xl font-semibold text-primary">Set new password</h1>
                <p className="mt-2 text-md text-tertiary">Your new password must be different from previously used passwords.</p>

                <form className="mt-8 flex flex-col gap-6 text-left">
                    <Input isRequired type="password" label="New password" placeholder="••••••••" />
                    <Input isRequired type="password" label="Confirm password" placeholder="••••••••" />

                    <ul className="flex flex-col gap-2">
                        <li className="flex items-center gap-2 text-sm text-tertiary">
                            <CheckCircle className="size-5 shrink-0 text-tertiary" aria-hidden="true" />
                            Must be at least 8 characters
                        </li>
                        <li className="flex items-center gap-2 text-sm text-tertiary">
                            <CheckCircle className="size-5 shrink-0 text-tertiary" aria-hidden="true" />
                            Must contain one special character
                        </li>
                    </ul>

                    <Button type="submit" size="lg" className="w-full">
                        Reset password
                    </Button>
                </form>
            </div>
        </div>
    ),
};

/** Step 4 — success confirmation, ready to head back into the account. */
export const PasswordReset: Story = {
    render: () => (
        <div className="flex min-h-screen items-center justify-center bg-primary p-6">
            <div className="w-full max-w-sm text-center">
                <div className="mb-6 flex justify-center">
                    <FeaturedIcon icon={CheckCircle} color="success" theme="light" size="lg" />
                </div>
                <h1 className="text-2xl font-semibold text-primary">Password reset</h1>
                <p className="mt-2 text-md text-tertiary">Your password has been successfully reset. Click below to log back in to your Sagamore account.</p>

                <div className="mt-8">
                    <Button size="lg" className="w-full">
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    ),
};

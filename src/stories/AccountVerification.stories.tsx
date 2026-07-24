import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowLeft, ArrowRight, CheckCircle, Mail01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { PinInput } from "@/components/base/input/pin-input";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";

/**
 * Full-page account verification flows for the Sagamore member portal — the
 * monochromatic screens a new golfer sees while we confirm their email and
 * phone before their first booking. Composed entirely from existing design
 * system parts: FeaturedIcon, PinInput, Button and the Tenfore logo.
 */
const meta: Meta = {
    title: "Sign in ∕ Sign up/Verification",
    parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** "Check your email" — a verification link was sent to the member's inbox. */
export const EmailVerification: Story = {
    render: () => (
        <div className="flex min-h-screen items-center justify-center bg-primary p-6">
            <div className="flex w-full max-w-sm flex-col items-center text-center">
                <FeaturedIcon icon={Mail01} size="lg" color="gray" theme="modern" />

                <h1 className="mt-6 text-display-xs font-semibold text-primary">Check your email</h1>
                <p className="mt-2 text-md text-tertiary">
                    We sent a verification link to <span className="font-medium text-secondary">olivia@sagamore.golf</span>
                </p>

                <div className="mt-8 flex w-full flex-col gap-3">
                    <Button size="lg" color="primary" className="w-full">
                        Open email app
                    </Button>
                    <Button size="lg" color="secondary" className="w-full">
                        Enter code manually
                    </Button>
                </div>

                <p className="mt-8 text-sm text-tertiary">
                    Didn&apos;t receive the email?{" "}
                    <Button color="link-color" className="align-baseline">
                        Click to resend
                    </Button>
                </p>

                <div className="mt-8">
                    <Button color="link-gray" iconLeading={ArrowLeft}>
                        Back to log in
                    </Button>
                </div>
            </div>
        </div>
    ),
};

/** "Enter verification code" — six-digit code entry via the PinInput. */
export const CodeEntry: Story = {
    render: () => (
        <div className="flex min-h-screen items-center justify-center bg-primary p-6">
            <div className="flex w-full max-w-md flex-col items-center text-center">
                <FeaturedIcon icon={Mail01} size="lg" color="gray" theme="modern" />

                <h1 className="mt-6 text-display-xs font-semibold text-primary">Enter verification code</h1>
                <p className="mt-2 text-md text-tertiary">
                    We sent a 6-digit code to <span className="font-medium text-secondary">olivia@sagamore.golf</span>. Enter it below to confirm your account.
                </p>

                <PinInput size="xs" className="mt-8 items-center">
                    <PinInput.Group maxLength={6} containerClassName="justify-center">
                        <PinInput.Slot index={0} />
                        <PinInput.Slot index={1} />
                        <PinInput.Slot index={2} />
                        <PinInput.Slot index={3} />
                        <PinInput.Slot index={4} />
                        <PinInput.Slot index={5} />
                    </PinInput.Group>
                </PinInput>

                <Button size="lg" color="primary" className="mt-8 w-full max-w-sm">
                    Verify
                </Button>

                <p className="mt-8 text-sm text-tertiary">
                    Didn&apos;t receive a code?{" "}
                    <Button color="link-color" className="align-baseline">
                        Click to resend
                    </Button>
                </p>
            </div>
        </div>
    ),
};

/** "Email verified" — confirmation screen handing the member to their dashboard. */
export const Success: Story = {
    render: () => (
        <div className="flex min-h-screen items-center justify-center bg-primary p-6">
            <div className="flex w-full max-w-sm flex-col items-center text-center">
                <FeaturedIcon icon={CheckCircle} size="lg" color="success" theme="light" />

                <h1 className="mt-6 text-display-xs font-semibold text-primary">Email verified</h1>
                <p className="mt-2 text-md text-tertiary">
                    Your account is confirmed. You&apos;re all set to book your first round at Sagamore.
                </p>

                <Button size="lg" color="primary" className="mt-8 w-full" iconTrailing={ArrowRight}>
                    Continue to dashboard
                </Button>
            </div>
        </div>
    ),
};

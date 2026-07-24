import { useState } from "react";
import { Mail01 } from "@untitledui/icons";
import { Tabs } from "@/components/application/tabs/tabs";
import { Button } from "@/components/base/buttons/button";
import { SocialButton } from "@/components/base/buttons/social-button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { Select } from "@/components/base/select/select";
import { TfLogo } from "@/components/foundations/logo/tf-logo";

/** Birthday dropdown options — MM / DD / YYYY. */
const pad = (n: number) => String(n).padStart(2, "0");
const MONTHS = Array.from({ length: 12 }, (_, i) => ({ id: pad(i + 1), label: pad(i + 1) }));
const DAYS = Array.from({ length: 31 }, (_, i) => ({ id: pad(i + 1), label: pad(i + 1) }));
const YEARS = Array.from({ length: 90 }, (_, i) => ({ id: String(2008 - i), label: String(2008 - i) }));

/** Google / Apple icon-only color social buttons, shown below the primary CTA. */
const SocialGroup = () => (
    <div className="flex flex-col items-center gap-3">
        <span className="text-sm text-tertiary">Or continue with</span>
        <div className="flex justify-center gap-3">
            <SocialButton social="google" theme="color" aria-label="Continue with Google" />
            <SocialButton social="apple" theme="color" aria-label="Continue with Apple" />
        </div>
    </div>
);

/**
 * Simple Sagamore auth card, styled on the Untitled UI sign-up-simple
 * component: an elevated white card on a subtle gray page, a Sign up / Log in
 * segmented toggle, logo + heading, the form with a green primary CTA, and the
 * Google / Apple social group. Semantic tokens only.
 */
export const AuthSimple = ({ defaultMode = "login" }: { defaultMode?: "login" | "signup" }) => {
    const [mode, setMode] = useState<"login" | "signup">(defaultMode);

    return (
        <div className="flex min-h-screen items-center justify-center bg-secondary px-4 py-12">
            <div className="w-full max-w-md rounded-2xl bg-primary px-6 py-8 shadow-lg ring-1 ring-secondary sm:px-8">
                <div className="flex flex-col items-center gap-5 text-center">
                    <TfLogo className="h-12 w-auto" />
                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-2xl font-semibold text-primary">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
                        <p className="text-md text-tertiary">{mode === "login" ? "Sign in to your account to continue" : "Create an account to get started."}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <Tabs selectedKey={mode} onSelectionChange={(key) => setMode(key as "login" | "signup")}>
                        <Tabs.List type="button-border" fullWidth>
                            <Tabs.Item id="signup" label="Sign up" />
                            <Tabs.Item id="login" label="Log in" />
                        </Tabs.List>
                    </Tabs>
                </div>

                {mode === "login" ? (
                    <Form onSubmit={(event) => event.preventDefault()} className="mt-6 flex w-full flex-col gap-5">
                        <Input isRequired type="email" name="email" label="Email" placeholder="member@sagamore.club" icon={Mail01} />
                        <Input isRequired type="password" name="password" label="Password" placeholder="••••••••" />

                        <div className="flex items-center justify-between">
                            <Checkbox label="Remember me" />
                            <Button href="#" color="link-color" size="sm">
                                Forgot password?
                            </Button>
                        </div>

                        <Button type="submit" size="lg" className="w-full">
                            Sign in
                        </Button>

                        <SocialGroup />
                    </Form>
                ) : (
                    <form className="mt-6 flex w-full flex-col gap-5">
                        <Input label="Email" type="email" placeholder="you@example.com" isRequired />

                        <div className="grid grid-cols-2 gap-4">
                            <Input label="First name" placeholder="First name" isRequired />
                            <Input label="Last name" placeholder="Last name" isRequired />
                        </div>

                        <Input label="Password" type="password" placeholder="Create a password" hint="Must be at least 8 characters." isRequired />
                        <Input label="Confirm password" type="password" placeholder="Re-enter your password" isRequired />

                        <div className="flex flex-col gap-1.5">
                            <Label>Birthday</Label>
                            <div className="grid grid-cols-3 gap-3">
                                <Select aria-label="Birth month" placeholder="MM" items={MONTHS}>
                                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                </Select>
                                <Select aria-label="Birth day" placeholder="DD" items={DAYS}>
                                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                </Select>
                                <Select aria-label="Birth year" placeholder="YYYY" items={YEARS}>
                                    {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                </Select>
                            </div>
                        </div>

                        <Input label="Phone number" type="tel" placeholder="(555) 555-5555" isRequired />

                        <Button size="lg" className="w-full">
                            Create account
                        </Button>

                        <SocialGroup />
                    </form>
                )}
            </div>
        </div>
    );
};

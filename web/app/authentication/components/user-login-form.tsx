"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserLoginForm } from "./use-user-login-form";

export function UserLoginForm() {
  const { form, state } = useUserLoginForm();

  return (
    <div className="grid gap-6">
      <form onSubmit={form.handlers.handleSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="Email"
              type="email"
              autoCapitalize="none"
              autoCorrect="off"
              onChange={form.handlers.handleChange}
              value={form.values.email}
              disabled={state.isFormLoading}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              name="password"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              onChange={form.handlers.handleChange}
              value={form.values.password}
              disabled={state.isFormLoading}
            />
          </div>
          <Button disabled={state.isFormLoading} type="submit">
            {state.isFormLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Login
          </Button>
        </div>
      </form>
    </div>
  );
}

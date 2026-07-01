"use client";

import { useActionState } from "react";
import { loginUser } from "../actions/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await loginUser(formData);
    },
    null
  );

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and password to log in
        </p>
      </div>
      <form action={formAction} className="grid gap-4">
        <div className="grid gap-2">
          <Input id="email" name="email" type="email" placeholder="m@example.com" required />
          <Input id="password" name="password" type="password" required />
        </div>
        {state?.error && (
          <div className="text-sm text-red-500 font-medium">{state.error}</div>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </Button>
      </form>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="underline underline-offset-4 hover:text-primary">
          Register
        </Link>
      </div>
    </div>
  );
}

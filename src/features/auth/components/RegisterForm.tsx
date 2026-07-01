"use client";

import { useActionState } from "react";
import { registerUser } from "../actions/register";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await registerUser(formData);
      if (result?.success) {
        router.push("/login");
      }
      return result;
    },
    null
  );

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your details below to create your account
        </p>
      </div>
      <form action={formAction} className="grid gap-4">
        <div className="grid gap-2">
          <Input id="name" name="name" type="text" placeholder="John Doe" required />
          <Input id="email" name="email" type="email" placeholder="m@example.com" required />
          <Input id="password" name="password" type="password" required />
        </div>
        {state?.error && (
          <div className="text-sm text-red-500 font-medium">{state.error}</div>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating account..." : "Register"}
        </Button>
      </form>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
          Login
        </Link>
      </div>
    </div>
  );
}

"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { loginSchema } from "../validators/auth.schema";

export async function loginUser(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const validated = loginSchema.safeParse(data);
  
  if (!validated.success) {
    return { error: "Invalid credentials" };
  }
  
  const { email, password } = validated.data;
  
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
}

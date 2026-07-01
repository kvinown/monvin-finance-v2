"use server";

import { registerSchema } from "../validators/auth.schema";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function registerUser(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  
  const validated = registerSchema.safeParse(data);
  
  if (!validated.success) {
    return { error: "Invalid input data" };
  }
  
  const { name, email, password } = validated.data;
  
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return { error: "Email already exists" };
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    
    return { success: true };
  } catch (error) {
    return { error: "Failed to register user" };
  }
}

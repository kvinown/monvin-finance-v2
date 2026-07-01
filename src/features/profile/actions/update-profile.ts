"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: any) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const {
      name,
      occupation,
      monthlyIncome,
      dateOfBirth,
      financialGoal,
      riskTolerance,
    } = data;

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        occupation,
        monthlyIncome: monthlyIncome ? parseFloat(monthlyIncome) : null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        financialGoal,
        riskTolerance,
      },
    });

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

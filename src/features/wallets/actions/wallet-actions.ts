"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { WalletType } from "@prisma/client";

export async function createWallet(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id as string;

    const name = formData.get("name") as string;
    const type = formData.get("type") as WalletType;
    const balance = parseFloat(formData.get("balance") as string || "0");
    const currency = formData.get("currency") as string || "IDR";

    if (!name || !type) throw new Error("Name and type are required");

    await prisma.wallet.create({
      data: {
        name,
        type,
        balance,
        currency,
        userId,
      }
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create wallet" };
  }
}

export async function getUserWallets() {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];
    return await prisma.wallet.findMany({ where: { userId: session.user.id } });
  } catch (error) {
    return [];
  }
}

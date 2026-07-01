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

export async function updateWallet(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const type = formData.get("type") as WalletType;
    
    if (!id || !name || !type) throw new Error("Missing required fields");

    // Verify ownership
    const wallet = await prisma.wallet.findFirst({ where: { id, userId: session.user.id } });
    if (!wallet) throw new Error("Wallet not found");

    await prisma.wallet.update({
      where: { id },
      data: { name, type }
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update wallet" };
  }
}

export async function deleteWallet(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const wallet = await prisma.wallet.findFirst({ where: { id, userId: session.user.id } });
    if (!wallet) throw new Error("Wallet not found");

    // Check if wallet has transactions
    const txCount = await prisma.transaction.count({ where: { walletId: id } });
    if (txCount > 0) throw new Error("Cannot delete wallet with existing transactions");

    await prisma.wallet.delete({ where: { id } });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete wallet" };
  }
}

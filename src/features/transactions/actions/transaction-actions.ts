"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createIncome(walletId: string, amount: number, category: string, description: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;

    const wallet = await prisma.wallet.findFirst({ where: { id: walletId, userId } });
    if (!wallet) throw new Error("Wallet not found");

    await prisma.$transaction([
      prisma.wallet.update({ where: { id: wallet.id }, data: { balance: { increment: amount } } }),
      prisma.transaction.create({
        data: { amount, type: "INCOME", category, description, walletId: wallet.id }
      })
    ]);

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create income transaction" };
  }
}

export async function createExpense(walletId: string, amount: number, category: string, description: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;

    const wallet = await prisma.wallet.findFirst({ where: { id: walletId, userId } });
    if (!wallet) throw new Error("Wallet not found");
    if (Number(wallet.balance) < amount) throw new Error(`Insufficient balance in ${wallet.name}`);

    await prisma.$transaction([
      prisma.wallet.update({ where: { id: wallet.id }, data: { balance: { decrement: amount } } }),
      prisma.transaction.create({
        data: { amount, type: "EXPENSE", category, description, walletId: wallet.id }
      })
    ]);

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create expense transaction" };
  }
}

export async function createInternalTransfer(sourceId: string, targetId: string, amount: number, category: string, description: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;

    if (sourceId === targetId) throw new Error("Cannot transfer to the same wallet");

    const sourceWallet = await prisma.wallet.findFirst({ where: { id: sourceId, userId } });
    const targetWallet = await prisma.wallet.findFirst({ where: { id: targetId, userId } });
    
    if (!sourceWallet || !targetWallet) throw new Error("One or both wallets not found");
    if (Number(sourceWallet.balance) < amount) throw new Error(`Insufficient balance in ${sourceWallet.name}`);

    await prisma.$transaction([
      prisma.wallet.update({ where: { id: sourceWallet.id }, data: { balance: { decrement: amount } } }),
      prisma.wallet.update({ where: { id: targetWallet.id }, data: { balance: { increment: amount } } }),
      prisma.transaction.create({
        data: { amount, type: "TRANSFER", category, description: description || `Transfer to ${targetWallet.name}`, walletId: sourceWallet.id }
      }),
      prisma.transaction.create({
        data: { amount, type: "TRANSFER", category, description: description || `Transfer from ${sourceWallet.name}`, walletId: targetWallet.id }
      })
    ]);

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create internal transfer" };
  }
}

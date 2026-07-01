"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createSavingGoal(data: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const name = data.get("name") as string;
    const target = data.get("target") ? parseFloat(data.get("target") as string) : null;

    if (!name) throw new Error("Name is required");

    await prisma.saving.create({
      data: {
        name,
        target,
        current: 0,
        userId: session.user.id,
      }
    });

    revalidatePath("/dashboard/savings");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create saving goal" };
  }
}

export async function depositToSaving(savingId: string, walletId: string, amount: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Start transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      const saving = await tx.saving.findUnique({ where: { id: savingId } });
      const wallet = await tx.wallet.findUnique({ where: { id: walletId } });

      if (!saving || saving.userId !== session.user.id) throw new Error("Saving not found");
      if (!wallet || wallet.userId !== session.user.id) throw new Error("Wallet not found");
      if (Number(wallet.balance) < amount) throw new Error("Insufficient balance in wallet");

      // 1. Deduct from wallet
      await tx.wallet.update({
        where: { id: walletId },
        data: { balance: { decrement: amount } }
      });

      // 2. Add to savings
      await tx.saving.update({
        where: { id: savingId },
        data: { current: { increment: amount } }
      });

      // 3. Create transaction record
      await tx.transaction.create({
        data: {
          amount,
          type: "SAVING_DEPOSIT",
          category: "Savings",
          description: `Deposit to ${saving.name}`,
          walletId,
          savingId,
        }
      });
    });

    revalidatePath("/dashboard/savings");
    revalidatePath(`/dashboard/savings/${savingId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to deposit" };
  }
}

export async function withdrawFromSaving(savingId: string, walletId: string, amount: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.$transaction(async (tx) => {
      const saving = await tx.saving.findUnique({ where: { id: savingId } });
      const wallet = await tx.wallet.findUnique({ where: { id: walletId } });

      if (!saving || saving.userId !== session.user.id) throw new Error("Saving not found");
      if (!wallet || wallet.userId !== session.user.id) throw new Error("Wallet not found");
      if (Number(saving.current) < amount) throw new Error("Insufficient savings balance");

      // 1. Add to wallet
      await tx.wallet.update({
        where: { id: walletId },
        data: { balance: { increment: amount } }
      });

      // 2. Deduct from savings
      await tx.saving.update({
        where: { id: savingId },
        data: { current: { decrement: amount } }
      });

      // 3. Create transaction record
      await tx.transaction.create({
        data: {
          amount,
          type: "SAVING_WITHDRAWAL",
          category: "Savings",
          description: `Withdraw from ${saving.name}`,
          walletId,
          savingId,
        }
      });
    });

    revalidatePath("/dashboard/savings");
    revalidatePath(`/dashboard/savings/${savingId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to withdraw" };
  }
}

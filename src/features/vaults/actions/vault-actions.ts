"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createVault(data: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const name = data.get("name") as string;
    const description = data.get("description") as string;
    const target = data.get("target") ? parseFloat(data.get("target") as string) : null;

    if (!name) throw new Error("Name is required");

    const userId = session.user.id as string;

    await prisma.$transaction(async (tx) => {
      const vault = await tx.vault.create({
        data: {
          name,
          description,
          target,
          balance: 0,
        }
      });

      // Add creator as OWNER
      await tx.vaultMember.create({
        data: {
          vaultId: vault.id,
          userId: userId,
          role: "OWNER"
        }
      });
    });

    revalidatePath("/dashboard/vaults");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create vault" };
  }
}

export async function addVaultMember(vaultId: string, friendId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Check if user is owner of the vault
    const isOwner = await prisma.vaultMember.findFirst({
      where: { vaultId, userId: session.user.id, role: "OWNER" }
    });
    if (!isOwner) throw new Error("Only owners can add members");

    // Check if friendship exists
    const friendship = await prisma.friendship.findFirst({
      where: {
        status: "ACCEPTED",
        OR: [
          { userId: session.user.id, friendId },
          { userId: friendId, friendId: session.user.id }
        ]
      }
    });
    if (!friendship) throw new Error("Can only add friends to vault");

    // Add member
    await prisma.vaultMember.create({
      data: {
        vaultId,
        userId: friendId,
        role: "MEMBER"
      }
    });

    revalidatePath(`/dashboard/vaults/${vaultId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to add member" };
  }
}

export async function contributeToVault(vaultId: string, walletId: string, amount: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const userId = session.user.id as string;

    await prisma.$transaction(async (tx) => {
      // Check membership
      const isMember = await tx.vaultMember.findUnique({
        where: { vaultId_userId: { vaultId, userId: userId } }
      });
      if (!isMember) throw new Error("You are not a member of this vault");

      // Check wallet
      const wallet = await tx.wallet.findUnique({ where: { id: walletId } });
      if (!wallet || wallet.userId !== userId) throw new Error("Wallet not found");
      if (Number(wallet.balance) < amount) throw new Error("Insufficient balance");

      // Deduct from wallet
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amount } }
      });

      // Add to vault
      const vault = await tx.vault.update({
        where: { id: vaultId },
        data: { balance: { increment: amount } }
      });

      // Record transaction (Expense for the user, linked to Vault)
      await tx.transaction.create({
        data: {
          amount,
          type: "EXPENSE", // Conceptually it's an expense out of the personal wallet into the shared vault
          category: "Vault Contribution",
          description: `Contribution to ${vault.name}`,
          walletId: wallet.id,
          vaultId: vault.id,
          senderId: userId, // Who contributed it
        }
      });
    });

    revalidatePath("/dashboard/vaults");
    revalidatePath(`/dashboard/vaults/${vaultId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to contribute" };
  }
}

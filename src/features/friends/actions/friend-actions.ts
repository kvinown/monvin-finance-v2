"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function sendFriendRequest(username: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const targetUser = await prisma.user.findUnique({
      where: { username }
    });

    if (!targetUser) throw new Error("User not found");
    if (targetUser.id === session.user.id) throw new Error("You cannot add yourself");

    // Check if friendship already exists
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId: session.user.id, friendId: targetUser.id },
          { userId: targetUser.id, friendId: session.user.id }
        ]
      }
    });

    if (existing) {
      if (existing.status === "PENDING") throw new Error("Friend request already pending");
      if (existing.status === "ACCEPTED") throw new Error("You are already friends");
      throw new Error("Unable to send request");
    }

    await prisma.friendship.create({
      data: {
        userId: session.user.id,
        friendId: targetUser.id,
        status: "PENDING"
      }
    });

    revalidatePath("/dashboard/friends");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to send request" };
  }
}

export async function respondToFriendRequest(friendshipId: string, accept: boolean) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId }
    });

    if (!friendship) throw new Error("Request not found");
    // Ensure the current user is the one receiving the request (they are the "friendId")
    if (friendship.friendId !== session.user.id) throw new Error("Unauthorized to respond");

    if (accept) {
      await prisma.friendship.update({
        where: { id: friendshipId },
        data: { status: "ACCEPTED" }
      });
    } else {
      await prisma.friendship.delete({
        where: { id: friendshipId }
      });
    }

    revalidatePath("/dashboard/friends");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to respond" };
  }
}

export async function sendP2PTransfer(friendId: string, amount: number, walletId: string, description: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const userId = session.user.id;

    await prisma.$transaction(async (tx) => {
      // Validate sender wallet
      const senderWallet = await tx.wallet.findUnique({ where: { id: walletId } });
      if (!senderWallet || senderWallet.userId !== userId) throw new Error("Wallet not found");
      if (Number(senderWallet.balance) < amount) throw new Error("Insufficient balance");

      // Validate friendship
      const friendship = await tx.friendship.findFirst({
        where: {
          status: "ACCEPTED",
          OR: [
            { userId: userId, friendId: friendId },
            { userId: friendId, friendId: userId }
          ]
        }
      });
      if (!friendship) throw new Error("Not friends with this user");

      // Find receiver's default wallet (just pick their first BANK or E_WALLET)
      const receiverWallet = await tx.wallet.findFirst({
        where: { userId: friendId },
        orderBy: { createdAt: 'asc' }
      });
      if (!receiverWallet) throw new Error("Receiver has no wallet setup");

      // Deduct from sender
      await tx.wallet.update({
        where: { id: senderWallet.id },
        data: { balance: { decrement: amount } }
      });

      // Add to receiver
      await tx.wallet.update({
        where: { id: receiverWallet.id },
        data: { balance: { increment: amount } }
      });

      // Create transaction for sender (P2P_SENT)
      await tx.transaction.create({
        data: {
          amount,
          type: "P2P_SENT",
          category: "Transfer",
          description: description || "P2P Transfer Sent",
          walletId: senderWallet.id,
          senderId: userId,
          receiverId: friendId,
        }
      });

      // Create transaction for receiver (P2P_RECEIVED)
      await tx.transaction.create({
        data: {
          amount,
          type: "P2P_RECEIVED",
          category: "Transfer",
          description: description || "P2P Transfer Received",
          walletId: receiverWallet.id,
          senderId: userId,
          receiverId: friendId,
        }
      });
    });

    revalidatePath("/dashboard/friends");
    revalidatePath("/dashboard/transactions");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to process transfer" };
  }
}

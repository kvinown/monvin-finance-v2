"use server";

import { GoogleGenAI, Type } from "@google/genai";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { depositToSaving, withdrawFromSaving } from "@/features/savings/actions/saving-actions";
import { contributeToVault } from "@/features/vaults/actions/vault-actions";
import { sendP2PTransfer } from "@/features/friends/actions/friend-actions";

export async function getUserContext() {
  const session = await auth();
  if (!session?.user?.id) return { wallets: [], savings: [], vaults: [], friends: [] };
  const userId = session.user.id;
  
  const wallets = await prisma.wallet.findMany({ where: { userId }, select: { id: true, name: true, balance: true } });
  const savings = await prisma.saving.findMany({ where: { userId }, select: { id: true, name: true, current: true, target: true } });
  const vaultMembers = await prisma.vaultMember.findMany({ where: { userId }, include: { vault: true } });
  const vaults = vaultMembers.map(v => ({ id: v.vault.id, name: v.vault.name }));
  
  const friendships = await prisma.friendship.findMany({
    where: { status: "ACCEPTED", OR: [{ userId }, { friendId: userId }] },
    include: { user: true, friend: true }
  });
  const friends = friendships.map(f => {
    const friend = f.userId === userId ? f.friend : f.user;
    return { id: friend.id, username: friend.username };
  });

  return { wallets, savings, vaults, friends };
}

export async function parseAiAction(prompt: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured on the server.");

    // Initialize Gemini API
    const ai = new GoogleGenAI({ apiKey });

    // 1. Fetch User Context
    const wallets = await prisma.wallet.findMany({ where: { userId } });
    const savings = await prisma.saving.findMany({ where: { userId } });
    const vaults = await prisma.vaultMember.findMany({ where: { userId }, include: { vault: true } });
    const friendships = await prisma.friendship.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ userId }, { friendId: userId }]
      },
      include: { user: true, friend: true }
    });

    const walletList = wallets.map(w => ({ id: w.id, name: w.name }));
    const savingList = savings.map(s => ({ id: s.id, name: s.name }));
    const vaultList = vaults.map(v => ({ id: v.vault.id, name: v.vault.name }));
    const friendList = friendships.map(f => ({ id: f.userId === userId ? f.friend.id : f.user.id, username: f.userId === userId ? f.friend.username : f.user.username }));

    // 2. Construct System Instruction
    const systemInstruction = `You are a financial AI assistant for Monvin Finance.
Your job is to parse the user's natural language input into a structured JSON action.

User's current state:
- Wallets: ${JSON.stringify(walletList)}
- Savings goals: ${JSON.stringify(savingList)}
- Shared Vaults: ${JSON.stringify(vaultList)}
- Friends: ${JSON.stringify(friendList)}

Intents:
- INCOME: Adding money to a Wallet from an external source (like Salary).
- EXPENSE: Paying for something from a Wallet.
- INTERNAL_TRANSFER: Moving money between two Wallets.
- P2P_TRANSFER: Sending money from a Wallet to a Friend.
- SAVING_DEPOSIT: Moving money from a Wallet to a Saving Goal.
- SAVING_WITHDRAWAL: Moving money from a Saving Goal to a Wallet.
- VAULT_CONTRIBUTION: Moving money from a Wallet to a Shared Vault.
- UNKNOWN: The user's prompt is unclear or doesn't match any intent.

If the user mentions an intent but the specific wallet/friend/vault doesn't exactly match the lists above, pick the closest match or leave the ID blank ("").
Return the structured output matching the schema strictly.`;

    // 3. Define Response Schema
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        intent: {
          type: Type.STRING,
          description: "The action to perform.",
          enum: ["INCOME", "EXPENSE", "INTERNAL_TRANSFER", "P2P_TRANSFER", "SAVING_DEPOSIT", "SAVING_WITHDRAWAL", "VAULT_CONTRIBUTION", "UNKNOWN"]
        },
        amount: {
          type: Type.NUMBER,
          description: "The monetary amount mentioned. If not mentioned, set to 0."
        },
        sourceId: {
          type: Type.STRING,
          description: "The ID of the source Wallet (or Saving Goal if withdrawing). Return empty string if unknown."
        },
        targetId: {
          type: Type.STRING,
          description: "The ID of the target Wallet, Friend, Saving Goal, or Vault. Return empty string if unknown."
        },
        category: {
          type: Type.STRING,
          description: "The category of the transaction (e.g. 'Food', 'Salary', 'Transfer')."
        },
        description: {
          type: Type.STRING,
          description: "A short description or note for the transaction."
        }
      },
      required: ["intent", "amount"]
    };

    // 4. Call Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const outputText = response.text;
    if (!outputText) throw new Error("Empty response from AI");

    const parsed = JSON.parse(outputText);
    const { intent, amount, sourceId: aiSourceId, targetId: aiTargetId, category, description } = parsed;

    if (intent === "UNKNOWN") {
      return { success: false, message: "Sorry, I couldn't understand what transaction you want to perform." };
    }

    let sourceId: string = aiSourceId || "";
    let targetId: string = aiTargetId || "";

    // Fallbacks if IDs were empty but we have a default wallet
    if (intent === "INCOME") {
      sourceId = "";
      if (!targetId) targetId = wallets[0]?.id || "";
    } else if (intent === "EXPENSE") {
      if (!sourceId) sourceId = wallets[0]?.id || "";
      targetId = "";
    } else if (intent === "INTERNAL_TRANSFER") {
      // Nothing special, AI should provide both
    } else if (intent === "P2P_TRANSFER") {
      if (!sourceId) sourceId = wallets[0]?.id || "";
    } else if (intent === "SAVING_DEPOSIT") {
      if (!sourceId) sourceId = wallets[0]?.id || "";
    } else if (intent === "SAVING_WITHDRAWAL") {
      if (!targetId) targetId = wallets[0]?.id || "";
    } else if (intent === "VAULT_CONTRIBUTION") {
      if (!sourceId) sourceId = wallets[0]?.id || "";
    }

    return { 
      success: true, 
      action: {
        intent,
        amount: amount || 0,
        sourceId,
        targetId,
        category: category || "",
        description: description || ""
      }
    };
  } catch (error: any) {
    console.error("AI Action Error:", error);
    return { success: false, message: error.message || "An error occurred while processing the AI action." };
  }
}

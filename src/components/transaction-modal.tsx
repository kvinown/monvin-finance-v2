"use client";

import { useState, useEffect } from "react";
import { getUserContext } from "@/features/ai/actions/ai-actions";
import { createIncome, createExpense, createInternalTransfer } from "@/features/transactions/actions/transaction-actions";
import { sendP2PTransfer } from "@/features/friends/actions/friend-actions";
import { depositToSaving } from "@/features/savings/actions/saving-actions";
import { contributeToVault } from "@/features/vaults/actions/vault-actions";

type TransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
};

export function TransactionModal({ isOpen, onClose, initialData }: TransactionModalProps) {
  const [intent, setIntent] = useState("EXPENSE");
  const [amount, setAmount] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [context, setContext] = useState<any>({ wallets: [], savings: [], vaults: [], friends: [] });

  useEffect(() => {
    if (isOpen) {
      getUserContext().then(setContext);
      if (initialData) {
        setIntent(initialData.intent || "EXPENSE");
        setAmount(initialData.amount ? initialData.amount.toString() : "");
        setSourceId(initialData.sourceId || "");
        setTargetId(initialData.targetId || "");
        setCategory(initialData.category || "");
        setDescription(initialData.description || "");
      } else {
        // Reset
        setIntent("EXPENSE");
        setAmount("");
        setSourceId("");
        setTargetId("");
        setCategory("");
        setDescription("");
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const amt = Number(amount);
    if (!amt || amt <= 0) {
      setError("Please enter a valid amount");
      setLoading(false);
      return;
    }

    try {
      let res: any = { success: false, error: "Unknown intent" };
      if (intent === "INCOME") {
        res = await createIncome(targetId || sourceId, amt, category, description);
      } else if (intent === "EXPENSE") {
        res = await createExpense(sourceId || targetId, amt, category, description);
      } else if (intent === "INTERNAL_TRANSFER") {
        res = await createInternalTransfer(sourceId, targetId, amt, category, description);
      } else if (intent === "P2P_TRANSFER") {
        res = await sendP2PTransfer(targetId, amt, sourceId, description);
      } else if (intent === "SAVING_DEPOSIT") {
        res = await depositToSaving(targetId, sourceId, amt);
      } else if (intent === "VAULT_CONTRIBUTION") {
        res = await contributeToVault(targetId, sourceId, amt);
      }

      if (res.success) {
        onClose();
      } else {
        setError(res.error || "Transaction failed");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatDisplay = (numStr: string) => {
    if (!numStr) return "";
    return Number(numStr).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setAmount(rawValue);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-container-lowest/80 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-border-subtle bg-surface-bright">
          <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
            {initialData ? <span className="material-symbols-outlined text-secondary">magic_button</span> : null}
            {initialData ? "Confirm AI Suggestion" : "New Transaction"}
          </h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-error/10 text-error rounded-lg text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Type</label>
            <select
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              className="w-full h-11 px-3 bg-surface-container border border-border-subtle rounded-lg text-on-surface focus:outline-none focus:border-secondary"
            >
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
              <option value="INTERNAL_TRANSFER">Transfer to Own Wallet</option>
              <option value="P2P_TRANSFER">Send to Friend</option>
              <option value="SAVING_DEPOSIT">Deposit to Savings</option>
              <option value="VAULT_CONTRIBUTION">Contribute to Vault</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Amount (Rp)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <span className="text-on-surface-variant font-semibold text-sm">Rp</span>
              </div>
              <input
                type="text"
                value={formatDisplay(amount)}
                onChange={handleAmountChange}
                className="w-full h-11 pl-10 pr-3 bg-surface-container border border-border-subtle rounded-lg text-on-surface focus:outline-none focus:border-secondary text-lg font-bold"
                placeholder="e.g. 50.000"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {(intent === "EXPENSE" || intent === "INTERNAL_TRANSFER" || intent === "P2P_TRANSFER" || intent === "SAVING_DEPOSIT" || intent === "VAULT_CONTRIBUTION") && (
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">From Wallet</label>
                <select
                  value={sourceId}
                  onChange={(e) => setSourceId(e.target.value)}
                  className="w-full h-11 px-3 bg-surface-container border border-border-subtle rounded-lg text-on-surface focus:outline-none focus:border-secondary"
                  required
                >
                  <option value="">Select...</option>
                  {context.wallets.map((w: any) => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
            )}
            
            {(intent === "INCOME" || intent === "INTERNAL_TRANSFER") && (
              <div className={intent === "INCOME" ? "col-span-2" : ""}>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">To Wallet</label>
                <select
                  value={targetId || sourceId}
                  onChange={(e) => intent === "INCOME" ? setSourceId(e.target.value) : setTargetId(e.target.value)}
                  className="w-full h-11 px-3 bg-surface-container border border-border-subtle rounded-lg text-on-surface focus:outline-none focus:border-secondary"
                  required
                >
                  <option value="">Select...</option>
                  {context.wallets.map((w: any) => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
            )}

            {intent === "P2P_TRANSFER" && (
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">To Friend</label>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full h-11 px-3 bg-surface-container border border-border-subtle rounded-lg text-on-surface focus:outline-none focus:border-secondary"
                  required
                >
                  <option value="">Select...</option>
                  {context.friends.map((f: any) => <option key={f.id} value={f.id}>@{f.username}</option>)}
                </select>
              </div>
            )}

            {intent === "SAVING_DEPOSIT" && (
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">To Saving Goal</label>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full h-11 px-3 bg-surface-container border border-border-subtle rounded-lg text-on-surface focus:outline-none focus:border-secondary"
                  required
                >
                  <option value="">Select...</option>
                  {context.savings.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            )}

            {intent === "VAULT_CONTRIBUTION" && (
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">To Vault</label>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full h-11 px-3 bg-surface-container border border-border-subtle rounded-lg text-on-surface focus:outline-none focus:border-secondary"
                  required
                >
                  <option value="">Select...</option>
                  {context.vaults.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Category / Note</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-1/3 h-11 px-3 bg-surface-container border border-border-subtle rounded-lg text-on-surface focus:outline-none focus:border-secondary"
                placeholder="Category"
              />
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-2/3 h-11 px-3 bg-surface-container border border-border-subtle rounded-lg text-on-surface focus:outline-none focus:border-secondary"
                placeholder="Description"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-4 bg-secondary text-on-secondary rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 transition-colors disabled:opacity-50"
          >
            {loading ? <span className="material-symbols-outlined animate-spin">refresh</span> : null}
            {initialData ? "Confirm & Execute" : "Create Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
}

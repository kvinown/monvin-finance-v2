"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { depositToSaving, withdrawFromSaving } from "@/features/savings/actions/saving-actions";

export function SavingDetailClient({ savingId, wallets, currentBalance }: { savingId: string, wallets: any[], currentBalance: number }) {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const amount = parseFloat(formData.get("amount") as string);
    const walletId = formData.get("walletId") as string;

    if (!amount || amount <= 0) {
      setError("Please enter a valid amount");
      setLoading(false);
      return;
    }

    if (!walletId) {
      setError("Please select a wallet");
      setLoading(false);
      return;
    }

    let result;
    if (activeTab === "deposit") {
      result = await depositToSaving(savingId, walletId, amount);
    } else {
      if (amount > currentBalance) {
        setError("Withdrawal amount cannot exceed current saving balance");
        setLoading(false);
        return;
      }
      result = await withdrawFromSaving(savingId, walletId, amount);
    }

    if (result.success) {
      (e.target as HTMLFormElement).reset();
    } else {
      setError(result.error || "Failed to process transaction");
    }
    
    setLoading(false);
  }

  return (
    <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 shadow-sm sticky top-24">
      <div className="flex bg-surface-variant p-1 rounded-lg mb-6">
        <button
          onClick={() => { setActiveTab("deposit"); setError(""); }}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "deposit" ? "bg-surface text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
        >
          Add Funds
        </button>
        <button
          onClick={() => { setActiveTab("withdraw"); setError(""); }}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "withdraw" ? "bg-surface text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
        >
          Withdraw
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg text-sm font-medium bg-error-container text-on-error-container border border-error/20">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Amount (IDR)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-medium">Rp</span>
            <input 
              type="number" 
              name="amount" 
              required
              min="1"
              placeholder="0"
              className="w-full h-10 pl-10 pr-3 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">
            {activeTab === "deposit" ? "From Wallet" : "To Wallet"}
          </label>
          <select 
            name="walletId" 
            required
            className="w-full h-10 px-3 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary transition-colors"
          >
            <option value="">Select a wallet</option>
            {wallets.map(w => (
              <option key={w.id} value={w.id}>
                {w.name} (Rp {Number(w.balance).toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full h-10 mt-4 font-table-data text-table-data font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            activeTab === "deposit" 
              ? "bg-secondary text-on-secondary hover:bg-secondary-container" 
              : "bg-surface-variant text-on-surface hover:bg-border-subtle border border-border-subtle"
          }`}
        >
          {loading ? "Processing..." : activeTab === "deposit" ? "Deposit Funds" : "Withdraw Funds"}
        </button>
      </form>
    </div>
  );
}

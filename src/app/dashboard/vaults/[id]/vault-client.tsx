"use client";

import { useState } from "react";
import { addVaultMember, contributeToVault } from "@/features/vaults/actions/vault-actions";

export function VaultClient({ 
  action, 
  vaultId, 
  wallets,
  friends
}: { 
  action: "contribute" | "add_member", 
  vaultId: string,
  wallets?: any[],
  friends?: any[]
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  async function handleContribute(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData(e.currentTarget);
    const amount = parseFloat(formData.get("amount") as string);
    const walletId = formData.get("walletId") as string;

    if (!amount || amount <= 0) {
      setMessage({ type: "error", text: "Please enter a valid amount" });
      setLoading(false);
      return;
    }

    const result = await contributeToVault(vaultId, walletId, amount);

    if (result.success) {
      (e.target as HTMLFormElement).reset();
      setMessage({ type: "success", text: "Contribution successful!" });
    } else {
      setMessage({ type: "error", text: result.error || "Failed to process contribution" });
    }
    
    setLoading(false);
  }

  async function handleAddMember(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData(e.currentTarget);
    const friendId = formData.get("friendId") as string;

    const result = await addVaultMember(vaultId, friendId);

    if (result.success) {
      setMessage({ type: "success", text: "Member added!" });
      (e.target as HTMLFormElement).reset();
    } else {
      setMessage({ type: "error", text: result.error || "Failed to add member" });
    }
    
    setLoading(false);
  }

  if (action === "contribute") {
    return (
      <div className="bg-primary border border-border-subtle rounded-xl p-6 shadow-sm">
        <h3 className="font-headline-md text-headline-md text-on-primary mb-4">Contribute</h3>
        <form onSubmit={handleContribute} className="space-y-4">
          {message.text && (
            <div className={`p-3 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-success/20 text-success-light' : 'bg-error/20 text-error-light'}`}>
              {message.text}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-on-primary/70 uppercase">Amount (IDR)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-medium">Rp</span>
              <input 
                type="number" 
                name="amount" 
                required
                min="1"
                placeholder="0"
                className="w-full h-10 pl-10 pr-3 bg-on-primary border border-transparent rounded-lg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-on-primary/70 uppercase">From Wallet</label>
            <select 
              name="walletId" 
              required
              className="w-full h-10 px-3 bg-on-primary border border-transparent rounded-lg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
            >
              <option value="">Select a wallet</option>
              {wallets?.map(w => (
                <option key={w.id} value={w.id}>
                  {w.name} (Rp {Number(w.balance).toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-10 mt-2 bg-on-primary text-primary font-table-data text-table-data font-medium rounded-lg hover:bg-on-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Processing..." : "Add to Vault"}
          </button>
        </form>
      </div>
    );
  }

  if (action === "add_member") {
    return (
      <form onSubmit={handleAddMember} className="space-y-3">
        {message.text && (
          <div className={`p-2 rounded-lg text-xs font-medium ${message.type === 'success' ? 'bg-success/10 text-success-dark' : 'bg-error-container text-on-error-container'}`}>
            {message.text}
          </div>
        )}
        <label className="text-xs font-bold text-on-surface-variant uppercase">Invite a Friend</label>
        <div className="flex gap-2">
          <select 
            name="friendId" 
            required
            className="flex-1 h-9 px-3 bg-surface border border-border-subtle rounded-lg text-xs focus:outline-none focus:border-secondary transition-colors"
          >
            <option value="">Select friend</option>
            {friends?.map(f => (
              <option key={f.id} value={f.id}>@{f.username}</option>
            ))}
          </select>
          <button 
            type="submit" 
            disabled={loading || friends?.length === 0}
            className="h-9 px-4 bg-secondary text-on-secondary text-xs font-medium rounded-lg hover:bg-secondary-container transition-colors disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </form>
    );
  }

  return null;
}

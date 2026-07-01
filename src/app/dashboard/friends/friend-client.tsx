"use client";

import { useState } from "react";
import { sendFriendRequest, respondToFriendRequest, sendP2PTransfer } from "@/features/friends/actions/friend-actions";

export function FriendClient({ 
  action, 
  requestId, 
  targetId, 
  targetName, 
  wallets 
}: { 
  action: "search" | "respond" | "transfer", 
  requestId?: string,
  targetId?: string,
  targetName?: string,
  wallets?: any[]
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const username = new FormData(e.currentTarget).get("username") as string;
    const result = await sendFriendRequest(username);

    if (result.success) {
      setMessage({ type: "success", text: "Friend request sent!" });
      (e.target as HTMLFormElement).reset();
    } else {
      setMessage({ type: "error", text: result.error || "Failed to send request" });
    }
    setLoading(false);
  }

  async function handleRespond(accept: boolean) {
    if (!requestId) return;
    setLoading(true);
    await respondToFriendRequest(requestId, accept);
    setLoading(false);
  }

  async function handleTransfer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!targetId) return;
    
    setLoading(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData(e.currentTarget);
    const amount = parseFloat(formData.get("amount") as string);
    const walletId = formData.get("walletId") as string;
    const description = formData.get("description") as string;

    const result = await sendP2PTransfer(targetId, amount, walletId, description);

    if (result.success) {
      setIsTransferModalOpen(false);
      alert("Transfer successful!");
    } else {
      setMessage({ type: "error", text: result.error || "Transfer failed" });
    }
    setLoading(false);
  }

  if (action === "search") {
    return (
      <form onSubmit={handleSearch} className="space-y-4">
        {message.text && (
          <div className={`p-3 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-success/20 text-success-light' : 'bg-error/20 text-error-light'}`}>
            {message.text}
          </div>
        )}
        <div className="space-y-2">
          <input 
            type="text" 
            name="username" 
            required
            placeholder="Enter username"
            className="w-full h-10 px-3 bg-surface/10 border border-border-subtle/30 rounded-lg text-sm focus:outline-none focus:border-on-primary text-on-primary placeholder-on-primary/50 transition-colors"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full h-10 bg-on-primary text-primary font-table-data text-table-data font-medium rounded-lg hover:bg-on-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Request"}
        </button>
      </form>
    );
  }

  if (action === "respond") {
    return (
      <div className="flex gap-2">
        <button 
          onClick={() => handleRespond(false)}
          disabled={loading}
          className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant hover:bg-error/10 hover:text-error transition-colors"
          title="Decline"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
        <button 
          onClick={() => handleRespond(true)}
          disabled={loading}
          className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary hover:bg-secondary hover:text-on-secondary transition-colors"
          title="Accept"
        >
          <span className="material-symbols-outlined text-[18px]">check</span>
        </button>
      </div>
    );
  }

  if (action === "transfer") {
    return (
      <>
        <button 
          onClick={() => setIsTransferModalOpen(true)}
          className="px-4 py-2 bg-surface-variant text-on-surface font-medium text-sm rounded-lg hover:bg-border-subtle transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">send_money</span>
          Transfer
        </button>

        {isTransferModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest w-full max-w-md rounded-xl p-6 shadow-xl border border-border-subtle relative">
              <button 
                onClick={() => setIsTransferModalOpen(false)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Send Money</h3>
              <p className="text-sm text-on-surface-variant mb-6">Transfer instantly to {targetName}</p>

              <form onSubmit={handleTransfer} className="space-y-4">
                {message.text && (
                  <div className="p-3 rounded-lg text-sm font-medium bg-error-container text-on-error-container border border-error/20">
                    {message.text}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase">Amount (IDR)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-medium">Rp</span>
                    <input 
                      type="number" 
                      name="amount" 
                      required
                      min="1"
                      className="w-full h-12 pl-10 pr-3 bg-surface border border-border-subtle rounded-lg focus:outline-none focus:border-secondary transition-colors text-lg font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase">From Wallet</label>
                  <select 
                    name="walletId" 
                    required
                    className="w-full h-10 px-3 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary transition-colors"
                  >
                    <option value="">Select a wallet</option>
                    {wallets?.map(w => (
                      <option key={w.id} value={w.id}>
                        {w.name} (Rp {Number(w.balance).toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase">Message (Optional)</label>
                  <input 
                    type="text" 
                    name="description" 
                    placeholder="What's this for?"
                    className="w-full h-10 px-3 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-12 mt-4 bg-secondary text-on-secondary font-medium rounded-lg hover:bg-secondary-container transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? "Processing..." : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">send</span>
                      Send Now
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}

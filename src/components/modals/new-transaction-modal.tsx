"use client";

import { useState, useEffect, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getUserWallets } from "@/features/wallets/actions/wallet-actions";
import { createIncome, createExpense, createInternalTransfer } from "@/features/transactions/actions/transaction-actions";

export function NewTransactionModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [wallets, setWallets] = useState<any[]>([]);
  const [type, setType] = useState("EXPENSE");

  useEffect(() => {
    if (open) {
      getUserWallets().then(setWallets);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const amount = parseFloat(formData.get("amount") as string);
      const category = formData.get("category") as string;
      const description = formData.get("description") as string;
      const walletId = formData.get("walletId") as string;
      
      let res;
      if (type === "INCOME") {
        res = await createIncome(walletId, amount, category, description);
      } else if (type === "EXPENSE") {
        res = await createExpense(walletId, amount, category, description);
      } else {
        const targetId = formData.get("targetId") as string;
        res = await createInternalTransfer(walletId, targetId, amount, category, description);
      }

      if (res.success) {
        setOpen(false);
      } else {
        alert(res.error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="sm:max-w-[425px] bg-surface-container-lowest border-border-subtle text-on-surface">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">New Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div className="flex gap-2 mb-2">
            <button type="button" onClick={() => setType("EXPENSE")} className={`flex-1 py-1 rounded-md text-sm font-medium ${type === "EXPENSE" ? "bg-error text-white" : "bg-surface-variant text-on-surface"}`}>Expense</button>
            <button type="button" onClick={() => setType("INCOME")} className={`flex-1 py-1 rounded-md text-sm font-medium ${type === "INCOME" ? "bg-success text-white" : "bg-surface-variant text-on-surface"}`}>Income</button>
            <button type="button" onClick={() => setType("TRANSFER")} className={`flex-1 py-1 rounded-md text-sm font-medium ${type === "TRANSFER" ? "bg-primary text-white" : "bg-surface-variant text-on-surface"}`}>Transfer</button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{type === "TRANSFER" ? "From Wallet" : "Wallet"}</label>
            <select name="walletId" required className="w-full h-10 px-3 bg-surface-container border border-border-subtle rounded-md focus:outline-none focus:ring-1 focus:ring-primary">
              {wallets.map(w => <option key={w.id} value={w.id}>{w.name} (Rp {Number(w.balance).toLocaleString()})</option>)}
            </select>
          </div>

          {type === "TRANSFER" && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">To Wallet</label>
              <select name="targetId" required className="w-full h-10 px-3 bg-surface-container border border-border-subtle rounded-md focus:outline-none focus:ring-1 focus:ring-primary">
                {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Amount (IDR)</label>
            <input name="amount" type="number" required min="1" className="w-full h-10 px-3 bg-surface-container border border-border-subtle rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Category</label>
            <input name="category" required className="w-full h-10 px-3 bg-surface-container border border-border-subtle rounded-md focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g., Food, Salary" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Description</label>
            <input name="description" className="w-full h-10 px-3 bg-surface-container border border-border-subtle rounded-md focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Optional notes" />
          </div>

          <button type="submit" disabled={isPending || wallets.length === 0} className="mt-4 h-10 w-full bg-primary text-on-primary rounded-md font-medium hover:opacity-90 disabled:opacity-50">
            {isPending ? "Processing..." : "Save Transaction"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

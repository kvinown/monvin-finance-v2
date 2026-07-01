"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createWallet } from "@/features/wallets/actions/wallet-actions";

export function NewWalletModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createWallet(formData);
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
          <DialogTitle className="text-xl font-bold">Create New Wallet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium">Wallet Name</label>
            <input id="name" name="name" required className="w-full h-10 px-3 bg-surface-container border border-border-subtle rounded-md focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g., BCA, GoPay" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="type" className="text-sm font-medium">Wallet Type</label>
            <select id="type" name="type" required className="w-full h-10 px-3 bg-surface-container border border-border-subtle rounded-md focus:outline-none focus:ring-1 focus:ring-primary">
              <option value="BANK">Bank Account</option>
              <option value="E_WALLET">E-Wallet</option>
              <option value="CASH">Cash</option>
              <option value="CREDIT_PAYLATER">Credit / PayLater</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="balance" className="text-sm font-medium">Initial Balance (IDR)</label>
            <input id="balance" name="balance" type="number" required defaultValue="0" className="w-full h-10 px-3 bg-surface-container border border-border-subtle rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <button type="submit" disabled={isPending} className="mt-4 h-10 w-full bg-primary text-on-primary rounded-md font-medium hover:opacity-90 disabled:opacity-50">
            {isPending ? "Creating..." : "Create Wallet"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { updateWallet, deleteWallet } from "@/features/wallets/actions/wallet-actions";
import { WalletType } from "@prisma/client";

export function ManageWalletModal({ children, wallet }: { children: React.ReactNode, wallet: any }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("id", wallet.id);
    startTransition(async () => {
      const res = await updateWallet(formData);
      if (res.success) {
        setOpen(false);
      } else {
        alert(res.error);
      }
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this wallet?")) {
      startTransition(async () => {
        const res = await deleteWallet(wallet.id);
        if (res.success) {
          setOpen(false);
        } else {
          alert(res.error);
        }
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="sm:max-w-[425px] bg-surface-container-lowest border-border-subtle text-on-surface">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Manage Wallet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpdate} className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium">Wallet Name</label>
            <input id="name" name="name" defaultValue={wallet.name} required className="w-full h-10 px-3 bg-surface-container border border-border-subtle rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="type" className="text-sm font-medium">Wallet Type</label>
            <select id="type" name="type" defaultValue={wallet.type} required className="w-full h-10 px-3 bg-surface-container border border-border-subtle rounded-md focus:outline-none focus:ring-1 focus:ring-primary">
              <option value="BANK">Bank Account</option>
              <option value="E_WALLET">E-Wallet</option>
              <option value="CASH">Cash</option>
              <option value="CREDIT_PAYLATER">Credit / PayLater</option>
            </select>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="button" onClick={handleDelete} disabled={isPending} className="h-10 px-4 bg-error text-white rounded-md font-medium hover:opacity-90 disabled:opacity-50">
              {isPending ? "..." : "Delete"}
            </button>
            <button type="submit" disabled={isPending} className="h-10 flex-1 bg-primary text-on-primary rounded-md font-medium hover:opacity-90 disabled:opacity-50">
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

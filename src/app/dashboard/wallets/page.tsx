import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NewWalletModal } from "@/components/modals/new-wallet-modal";
import { ManageWalletModal } from "@/components/modals/manage-wallet-modal";

export default async function WalletsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const wallets = await prisma.wallet.findMany({
    where: { userId: session.user.id },
  });

  const totalBalance = wallets.reduce((acc, wallet) => acc + Number(wallet.balance), 0);
  const fiatAccounts = wallets
    .filter((w) => w.type === "BANK" || w.type === "CASH")
    .reduce((acc, wallet) => acc + Number(wallet.balance), 0);
  const eWallets = wallets
    .filter((w) => w.type === "E_WALLET")
    .reduce((acc, wallet) => acc + Number(wallet.balance), 0);

  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-end mb-stack-lg mt-4">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface mb-2">Wallet Management</h2>
          <p className="font-body-base text-body-base text-on-surface-variant">
            Oversee and manage your institutional accounts and e-wallets.
          </p>
        </div>
        <NewWalletModal>
          <button className="h-[40px] px-6 bg-primary text-on-primary rounded-lg font-table-data text-table-data flex items-center gap-2 transition-colors hover:bg-on-surface shadow-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create New Wallet
          </button>
        </NewWalletModal>
      </div>

      {/* Total Overview Card */}
      <div className="bg-surface-container-lowest rounded-[16px] border border-border-subtle p-[24px] mb-stack-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
            Total Consolidated Balance
          </span>
          <span className="font-display-lg text-3xl md:text-display-lg text-on-surface tracking-tight">
            Rp {totalBalance.toLocaleString()}
          </span>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-end gap-1 border-r border-border-subtle pr-4">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              Fiat Accounts
            </span>
            <span className="font-headline-md text-headline-md text-on-surface">
              Rp {fiatAccounts.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              E-Wallets
            </span>
            <span className="font-headline-md text-headline-md text-on-surface">
              Rp {eWallets.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {wallets.length === 0 ? (
          <p className="text-on-surface-variant">No wallets found.</p>
        ) : (
          wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="bg-surface-container-lowest rounded-[16px] border border-border-subtle p-[24px] shadow-sm flex flex-col justify-between h-[220px]"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center border border-border-subtle">
                    <span
                      className={`font-headline-md text-headline-md ${
                        wallet.type === "BANK"
                          ? "text-secondary"
                          : wallet.type === "E_WALLET"
                          ? "text-success"
                          : "text-tertiary-fixed-dim"
                      }`}
                    >
                      {wallet.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      {wallet.name}
                    </h3>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                      {wallet.type.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <span className="bg-[#eff4ff] text-secondary font-label-caps text-label-caps px-2 py-1 rounded-full border border-secondary-fixed">
                  Active
                </span>
              </div>
              <div className="flex flex-col gap-1 mt-4">
                <span className="font-headline-md text-headline-md text-on-surface">
                  Rp {Number(wallet.balance).toLocaleString()}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-border-subtle flex justify-end gap-2">
                <ManageWalletModal wallet={wallet}>
                  <button className="h-[32px] px-4 bg-transparent border border-outline text-on-surface rounded-lg font-table-data text-table-data hover:bg-surface-container transition-colors">
                    Manage
                  </button>
                </ManageWalletModal>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

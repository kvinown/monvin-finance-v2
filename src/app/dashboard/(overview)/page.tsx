import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OmniAiBar } from "@/components/omni-ai-bar";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  // Fetch wallets and transactions for the overview
  const wallets = await prisma.wallet.findMany({
    where: { userId: session.user.id },
  });

  const recentTransactions = await prisma.transaction.findMany({
    where: {
      wallet: {
        userId: session.user.id,
      },
    },
    orderBy: { date: "desc" },
    take: 5,
  });

  const latestSaving = await prisma.saving.findFirst({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" }
  });

  const totalBalance = wallets.reduce((acc, wallet) => acc + Number(wallet.balance), 0);

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
        <div>
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-1">
            Overview
          </h2>
          <p className="text-on-surface-variant text-sm">
            Welcome back, {session.user.name}. Here is your portfolio summary.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="h-[40px] px-4 bg-surface-container-lowest border border-border-subtle text-on-surface rounded-lg text-sm font-medium hover:bg-surface-variant transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">download</span> Export
          </button>
        </div>
      </div>

      {/* Omni AI Action Bar */}
      <OmniAiBar />

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Total Balance Card (Spans 8 cols) */}
        <div className="md:col-span-8 bg-surface-container-lowest rounded-xl border border-border-subtle p-6 shadow-sm flex flex-col justify-between min-h-[240px]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2 block">
                Total Balance
              </span>
              <div className="flex items-baseline gap-2">
                <h3 className="font-display-lg text-3xl md:text-4xl text-on-surface">
                  Rp {totalBalance.toLocaleString()}
                </h3>
                <span className="text-success text-sm font-medium flex items-center bg-success/10 px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-[14px]">arrow_upward</span> 4.2%
                </span>
              </div>
            </div>
            <button className="text-on-surface-variant hover:text-on-surface p-1">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>
          {/* Abstract Chart Representation */}
          <div className="mt-auto h-24 w-full flex items-end gap-2 px-1">
            <div className="w-full bg-surface-container-high rounded-t-sm h-[30%] hover:bg-secondary/20 transition-all"></div>
            <div className="w-full bg-surface-container-high rounded-t-sm h-[45%] hover:bg-secondary/20 transition-all"></div>
            <div className="w-full bg-surface-container-high rounded-t-sm h-[20%] hover:bg-secondary/20 transition-all"></div>
            <div className="w-full bg-surface-container-high rounded-t-sm h-[60%] hover:bg-secondary/20 transition-all"></div>
            <div className="w-full bg-surface-container-high rounded-t-sm h-[80%] hover:bg-secondary/20 transition-all"></div>
            <div className="w-full bg-secondary rounded-t-sm h-[100%] shadow-[0_-4px_10px_rgba(0,81,213,0.2)]"></div>
          </div>
        </div>

        {/* Personal Savings Progress (Spans 4 cols) */}
        <div className="md:col-span-4 bg-primary text-on-primary rounded-xl border border-border-dark p-6 shadow-sm flex flex-col">
          <span className="font-label-caps text-label-caps text-on-primary-container uppercase mb-4 block">
            Savings Goal
          </span>
          {latestSaving ? (
            <>
              <h4 className="font-headline-md text-headline-md mb-1">{latestSaving.name}</h4>
              <p className="text-on-primary-container text-sm mb-6">
                Target: {latestSaving.target ? `Rp ${Number(latestSaving.target).toLocaleString()}` : 'No target set'}
              </p>
              <div className="mt-auto">
                <div className="flex justify-between text-sm mb-2 font-medium">
                  <span>Rp {Number(latestSaving.current).toLocaleString()}</span>
                  {latestSaving.target && (
                    <span>{Math.min(100, Math.round((Number(latestSaving.current) / Number(latestSaving.target)) * 100))}%</span>
                  )}
                </div>
                {latestSaving.target && (
                  <div className="w-full bg-primary-container h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-secondary h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${Math.min(100, Math.round((Number(latestSaving.current) / Number(latestSaving.target)) * 100))}%` }}
                    ></div>
                  </div>
                )}
                <p className="text-xs text-on-primary-container mt-4 pt-4 border-t border-border-dark border-opacity-30">
                  Last updated on {new Date(latestSaving.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-80">savings</span>
              <p className="text-sm opacity-80 mb-4">No savings goal set yet.</p>
              <a href="/dashboard/savings" className="bg-secondary text-on-secondary px-4 py-2 rounded-lg text-sm font-medium">
                Create Goal
              </a>
            </div>
          )}
        </div>

        {/* Wallets Grid (Spans 12 cols, grid inside) */}
        <div className="md:col-span-12">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-stack-md">
            Your Wallets
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {wallets.length === 0 ? (
              <p className="text-sm text-on-surface-variant">No wallets found. Create one to get started.</p>
            ) : (
              wallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className="bg-surface-container-lowest border border-border-subtle rounded-xl p-5 shadow-sm hover:border-outline-variant transition-colors group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                      <span className="material-symbols-outlined">
                        {wallet.type === "BANK" ? "account_balance" : wallet.type === "CASH" ? "payments" : wallet.type === "CREDIT_PAYLATER" ? "credit_score" : "account_balance_wallet"}
                      </span>
                    </div>
                  </div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-1">
                    {wallet.name}
                  </span>
                  <span className="font-headline-md text-lg font-semibold text-on-surface block">
                    Rp {Number(wallet.balance).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Transactions (Spans 12 cols) */}
        <div className="md:col-span-12 bg-surface-container-lowest border border-border-subtle rounded-xl shadow-sm overflow-hidden mt-4">
          <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-surface-bright">
            <h3 className="font-headline-md text-headline-md text-on-surface">
              Recent Transactions
            </h3>
            <button className="text-sm font-medium text-secondary hover:text-on-secondary-fixed-variant transition-colors">
              View All
            </button>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left font-table-data text-table-data">
              <thead className="bg-surface-container-lowest border-b border-border-subtle">
                <tr>
                  <th className="py-3 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Transaction
                  </th>
                  <th className="py-3 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase hidden md:table-cell">
                    Category
                  </th>
                  <th className="py-3 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase hidden md:table-cell">
                    Date
                  </th>
                  <th className="py-3 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-on-surface-variant">
                      No recent transactions.
                    </td>
                  </tr>
                ) : (
                  recentTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-surface-container-low transition-colors group"
                    >
                      <td className="py-4 px-6 flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            tx.type === "INCOME" || tx.type === "P2P_RECEIVED"
                              ? "bg-success/10 text-success"
                              : "bg-surface-variant text-on-surface-variant"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {tx.type === "INCOME" || tx.type === "P2P_RECEIVED"
                              ? "arrow_downward"
                              : "storefront"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-on-surface">{tx.description || tx.category}</p>
                          <p className="text-xs text-on-surface-variant md:hidden">
                            {tx.category} • {new Date(tx.date).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-on-surface-variant hidden md:table-cell">
                        {tx.category}
                      </td>
                      <td className="py-4 px-6 text-on-surface-variant hidden md:table-cell">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                      <td
                        className={`py-4 px-6 text-right font-medium ${
                          tx.type === "INCOME" || tx.type === "P2P_RECEIVED"
                            ? "text-success"
                            : "text-on-surface"
                        }`}
                      >
                        {tx.type === "INCOME" || tx.type === "P2P_RECEIVED" ? "+" : "-"}Rp{" "}
                        {Number(tx.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

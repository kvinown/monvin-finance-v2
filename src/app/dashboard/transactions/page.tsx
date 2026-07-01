import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function TransactionsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      wallet: {
        userId: session.user.id,
      },
    },
    include: {
      wallet: true,
    },
    orderBy: { date: "desc" },
  });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentTransactions = transactions.filter((tx) => new Date(tx.date) >= thirtyDaysAgo);

  const totalInflow = recentTransactions
    .filter((tx) => tx.type === "INCOME" || tx.type === "P2P_RECEIVED")
    .reduce((acc, tx) => acc + Number(tx.amount), 0);

  const totalOutflow = recentTransactions
    .filter((tx) => tx.type === "EXPENSE" || tx.type === "P2P_SENT")
    .reduce((acc, tx) => acc + Number(tx.amount), 0);

  const netPosition = totalInflow - totalOutflow;

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-subtle pb-4 mt-4">
        <div>
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary">Transaction History</h2>
          <p className="font-body-base text-body-base text-on-surface-variant mt-1">Review and reconcile your institutional accounts.</p>
        </div>
        <div className="flex gap-2">
          <button className="h-10 px-4 border border-border-subtle rounded-lg bg-surface font-table-data text-table-data font-medium text-primary hover:bg-surface-container-low transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export
          </button>
          <button className="h-10 px-4 border border-border-subtle rounded-lg bg-surface font-table-data text-table-data font-medium text-primary hover:bg-surface-container-low transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Filters
          </button>
        </div>
      </div>

      {/* Bento / Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {/* Metric Card 1 */}
        <div className="bg-surface-container-lowest rounded-[16px] border border-border-subtle p-6 shadow-sm flex flex-col justify-between h-32">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Total Inflow (30d)</span>
            <span className="material-symbols-outlined text-success text-[20px]">trending_up</span>
          </div>
          <div className="font-headline-md text-[28px] leading-tight text-primary font-bold">
            Rp {totalInflow.toLocaleString()}
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-surface-container-lowest rounded-[16px] border border-border-subtle p-6 shadow-sm flex flex-col justify-between h-32">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Total Outflow (30d)</span>
            <span className="material-symbols-outlined text-error text-[20px]">trending_down</span>
          </div>
          <div className="font-headline-md text-[28px] leading-tight text-primary font-bold">
            Rp {totalOutflow.toLocaleString()}
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-surface-container-lowest rounded-[16px] border border-border-subtle p-6 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed to-primary-fixed-dim opacity-10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Net Position</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">account_balance</span>
          </div>
          <div className="relative z-10 font-headline-md text-[28px] leading-tight text-primary font-bold">
            {netPosition > 0 ? "+" : ""}Rp {netPosition.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Transaction Table Card */}
      <div className="bg-surface-container-lowest rounded-[16px] border border-border-subtle shadow-sm overflow-hidden">
        {/* Table Actions/Filters Bar */}
        <div className="p-4 border-b border-border-subtle bg-background flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
            <button className="h-8 px-3 rounded-full bg-primary-container text-on-primary font-label-caps text-[11px] whitespace-nowrap">All</button>
            <button className="h-8 px-3 rounded-full border border-border-subtle bg-surface text-on-surface hover:bg-surface-container-low font-label-caps text-[11px] whitespace-nowrap">Income</button>
            <button className="h-8 px-3 rounded-full border border-border-subtle bg-surface text-on-surface hover:bg-surface-container-low font-label-caps text-[11px] whitespace-nowrap">Expense</button>
            <button className="h-8 px-3 rounded-full border border-border-subtle bg-surface text-on-surface hover:bg-surface-container-low font-label-caps text-[11px] whitespace-nowrap">Transfer</button>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="font-label-caps text-label-caps text-on-surface-variant">Sort by:</span>
            <select className="h-8 border border-border-subtle rounded-md bg-surface text-table-data font-table-data text-primary focus:ring-0 focus:border-slate-400 pl-2 pr-8 py-0">
              <option>Date (Newest)</option>
              <option>Date (Oldest)</option>
              <option>Amount (High)</option>
              <option>Amount (Low)</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border-subtle bg-background">
                <th className="py-3 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase w-32">Date</th>
                <th className="py-3 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase">Description</th>
                <th className="py-3 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase w-40">Wallet/Account</th>
                <th className="py-3 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase w-32">Category</th>
                <th className="py-3 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase w-32 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="font-table-data text-table-data">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 px-6 text-center text-on-surface-variant">No transactions found.</td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border-subtle hover:bg-surface-container-low transition-colors group">
                    <td className="py-4 px-6 text-on-surface-variant">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${tx.type === "INCOME" || tx.type === "P2P_RECEIVED" ? "bg-success/10 text-success" : tx.type === "TRANSFER" ? "bg-secondary/10 text-secondary" : "bg-error/10 text-error"}`}>
                          <span className="material-symbols-outlined text-[16px]">
                            {tx.type === "INCOME" || tx.type === "P2P_RECEIVED" ? "south_west" : tx.type === "TRANSFER" ? "swap_horiz" : "north_east"}
                          </span>
                        </div>
                        <div>
                          <div className="text-primary font-medium">{tx.description || tx.category}</div>
                          <div className="text-on-surface-variant text-[12px]">{tx.id.slice(-8).toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-on-surface">{tx.wallet.name}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-surface-container text-on-surface text-[11px] font-medium">{tx.category}</span>
                    </td>
                    <td className={`py-4 px-6 text-right font-medium ${tx.type === "INCOME" || tx.type === "P2P_RECEIVED" ? "text-success" : tx.type === "TRANSFER" ? "text-primary" : "text-error"}`}>
                      {tx.type === "INCOME" || tx.type === "P2P_RECEIVED" ? "+" : "-"}Rp {Number(tx.amount).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border-subtle flex items-center justify-between">
          <span className="text-[13px] text-on-surface-variant font-table-data">Showing 1-{transactions.length} of {transactions.length} transactions</span>
          <div className="flex gap-1">
            <button className="w-8 h-8 rounded border border-border-subtle flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded bg-primary-container text-on-primary flex items-center justify-center font-table-data text-[13px]">1</button>
            <button className="w-8 h-8 rounded border border-border-subtle flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

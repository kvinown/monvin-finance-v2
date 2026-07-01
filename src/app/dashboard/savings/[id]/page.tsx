import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { SavingDetailClient } from "./saving-detail-client";

export default async function SavingDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const saving = await prisma.saving.findUnique({
    where: { id: params.id, userId: session.user.id },
  });

  if (!saving) notFound();

  const wallets = await prisma.wallet.findMany({
    where: { userId: session.user.id },
  });

  const transactions = await prisma.transaction.findMany({
    where: { savingId: saving.id },
    orderBy: { createdAt: "desc" },
    include: { wallet: true },
    take: 10,
  });

  const current = Number(saving.current);
  const target = saving.target ? Number(saving.target) : 0;
  const progress = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/savings" className="p-2 bg-surface-variant text-on-surface rounded-full hover:bg-border-subtle transition-colors">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-1">{saving.name}</h2>
          <p className="text-on-surface-variant text-sm">Manage your goal and view history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-primary border border-border-subtle rounded-xl p-6 md:p-8 shadow-sm">
            <h3 className="font-headline-md text-headline-md text-on-primary mb-4">Goal Progress</h3>
            
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-sm text-on-primary opacity-80 mb-1">Current Balance</p>
                <p className="font-display-lg text-display-lg-mobile md:text-display-lg font-bold text-on-primary">
                  {formatCurrency(current)}
                </p>
              </div>
              {target > 0 && (
                <div className="text-right">
                  <p className="text-sm text-on-primary opacity-80 mb-1">Target</p>
                  <p className="font-body-lg text-body-lg font-bold text-on-primary">
                    {formatCurrency(target)}
                  </p>
                </div>
              )}
            </div>

            {target > 0 && (
              <div className="mb-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-on-primary">{progress}% Completed</span>
                </div>
                <div className="w-full h-3 bg-on-primary/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-on-primary rounded-full" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 shadow-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-6">Recent Activity</h3>
            {transactions.length === 0 ? (
              <p className="text-center text-on-surface-variant text-sm py-8">No recent transactions for this goal.</p>
            ) : (
              <div className="space-y-4">
                {transactions.map(tx => (
                  <div key={tx.id} className="flex justify-between items-center p-4 border border-border-subtle rounded-lg bg-surface">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "SAVING_DEPOSIT" ? "bg-success/10 text-success-dark" : "bg-error/10 text-error"}`}>
                        <span className="material-symbols-outlined text-[20px]">
                          {tx.type === "SAVING_DEPOSIT" ? "arrow_downward" : "arrow_upward"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-on-surface text-sm">{tx.description}</p>
                        <p className="text-xs text-on-surface-variant mt-1">From/To: {tx.wallet.name} • {new Date(tx.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`font-medium ${tx.type === "SAVING_DEPOSIT" ? "text-success-dark" : "text-error"}`}>
                      {tx.type === "SAVING_DEPOSIT" ? "+" : "-"}{formatCurrency(Number(tx.amount))}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <SavingDetailClient savingId={saving.id} wallets={wallets} currentBalance={current} />
        </div>
      </div>
    </div>
  );
}

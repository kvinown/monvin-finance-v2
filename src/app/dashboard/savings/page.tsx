import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default async function SavingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const savings = await prisma.saving.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-1">Savings Goals</h2>
          <p className="text-on-surface-variant text-sm">Track your progress toward your financial targets.</p>
        </div>
        <Link 
          href="/dashboard/savings/create"
          className="h-10 px-6 bg-secondary text-on-secondary font-table-data text-table-data font-medium rounded-lg hover:bg-secondary-container transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Goal
        </Link>
      </div>

      {savings.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-lowest border border-border-subtle rounded-xl">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">savings</span>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-2">No Savings Goals Yet</h3>
          <p className="text-on-surface-variant text-sm max-w-md mx-auto mb-6">Create your first savings goal to start tracking your progress.</p>
          <Link 
            href="/dashboard/savings/create"
            className="inline-flex h-10 px-6 bg-secondary text-on-secondary font-table-data text-table-data font-medium rounded-lg hover:bg-secondary-container transition-colors items-center justify-center gap-2"
          >
            Create Goal
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {savings.map((saving) => {
            const current = Number(saving.current);
            const target = saving.target ? Number(saving.target) : 0;
            const progress = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

            return (
              <Link 
                href={`/dashboard/savings/${saving.id}`} 
                key={saving.id}
                className="block bg-primary border border-border-subtle rounded-xl p-6 transition-transform hover:-translate-y-1 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-headline-md text-headline-md text-on-primary font-bold">{saving.name}</h3>
                  <span className="material-symbols-outlined text-on-primary opacity-80">trending_up</span>
                </div>
                
                {target > 0 && (
                  <p className="text-sm text-on-primary opacity-80 mb-6">
                    Target: {formatCurrency(target)}
                  </p>
                )}

                <div className="flex justify-between items-end mb-2">
                  <p className="font-body-lg text-body-lg font-bold text-on-primary">
                    {formatCurrency(current)}
                  </p>
                  {target > 0 && (
                    <span className="text-sm font-bold text-on-primary">{progress}%</span>
                  )}
                </div>

                {target > 0 && (
                  <div className="w-full h-2 bg-on-primary/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-on-primary rounded-full" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default async function VaultsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const vaults = await prisma.vaultMember.findMany({
    where: { userId: session.user.id },
    include: {
      vault: {
        include: {
          members: {
            include: { user: true }
          }
        }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-1">Shared Vaults</h2>
          <p className="text-on-surface-variant text-sm">Manage joint savings and collective funds with friends.</p>
        </div>
        <Link 
          href="/dashboard/vaults/create"
          className="h-10 px-6 bg-secondary text-on-secondary font-table-data text-table-data font-medium rounded-lg hover:bg-secondary-container transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Vault
        </Link>
      </div>

      {vaults.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-lowest border border-border-subtle rounded-xl">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">account_balance</span>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-2">No Shared Vaults Yet</h3>
          <p className="text-on-surface-variant text-sm max-w-md mx-auto mb-6">Create a vault to start saving together with your friends or partner.</p>
          <Link 
            href="/dashboard/vaults/create"
            className="inline-flex h-10 px-6 bg-secondary text-on-secondary font-table-data text-table-data font-medium rounded-lg hover:bg-secondary-container transition-colors items-center justify-center gap-2"
          >
            Create Vault
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {vaults.map(({ vault, role }) => {
            const current = Number(vault.balance);
            const target = vault.target ? Number(vault.target) : 0;
            const progress = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

            return (
              <Link 
                href={`/dashboard/vaults/${vault.id}`} 
                key={vault.id}
                className="block bg-surface-container-lowest border border-border-subtle rounded-xl p-6 transition-transform hover:-translate-y-1 shadow-sm relative overflow-hidden"
              >
                {role === "OWNER" && (
                  <div className="absolute top-0 right-0 bg-secondary text-on-secondary text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                    Owner
                  </div>
                )}
                <div className="flex justify-between items-start mb-2 mt-2">
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">{vault.name}</h3>
                </div>
                <p className="text-sm text-on-surface-variant mb-4 line-clamp-1">{vault.description || "Shared savings vault"}</p>
                
                <div className="flex justify-between items-end mb-2">
                  <p className="font-body-lg text-body-lg font-bold text-on-surface">
                    {formatCurrency(current)}
                  </p>
                  {target > 0 && (
                    <span className="text-sm font-bold text-on-surface-variant">{progress}%</span>
                  )}
                </div>

                {target > 0 && (
                  <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden mb-4">
                    <div 
                      className="h-full bg-secondary rounded-full" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border-subtle">
                  <div className="flex -space-x-2">
                    {vault.members.slice(0, 3).map(m => (
                      <div key={m.id} className="w-6 h-6 rounded-full bg-primary flex items-center justify-center border border-surface-container-lowest text-[10px] text-on-primary font-bold">
                        {m.user.name ? m.user.name.charAt(0) : m.user.username?.charAt(0)}
                      </div>
                    ))}
                    {vault.members.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center border border-surface-container-lowest text-[10px] text-on-surface-variant font-bold">
                        +{vault.members.length - 3}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-on-surface-variant">{vault.members.length} member{vault.members.length !== 1 ? 's' : ''}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

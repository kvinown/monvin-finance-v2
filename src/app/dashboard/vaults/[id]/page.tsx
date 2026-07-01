import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { VaultClient } from "./vault-client";

export default async function VaultDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Verify membership and fetch vault details
  const vaultMember = await prisma.vaultMember.findUnique({
    where: { vaultId_userId: { vaultId: params.id, userId: session.user.id } },
    include: {
      vault: {
        include: {
          members: {
            include: { user: true }
          },
          transactions: {
            orderBy: { createdAt: "desc" },
            take: 15,
            include: { sender: true }
          }
        }
      }
    }
  });

  if (!vaultMember) notFound();

  const { vault, role } = vaultMember;
  
  // Get friends list for inviting to vault (only those not already in the vault)
  let friendsToInvite: any[] = [];
  if (role === "OWNER") {
    const friendships = await prisma.friendship.findMany({
      where: {
        status: "ACCEPTED",
        OR: [
          { userId: session.user.id },
          { friendId: session.user.id }
        ]
      },
      include: { user: true, friend: true }
    });

    const currentMemberIds = vault.members.map(m => m.userId);
    const friends = friendships.map(f => f.userId === session.user?.id ? f.friend : f.user);
    friendsToInvite = friends.filter(f => !currentMemberIds.includes(f.id));
  }

  // Get user wallets for contributions
  const wallets = await prisma.wallet.findMany({
    where: { userId: session.user.id }
  });

  const current = Number(vault.balance);
  const target = vault.target ? Number(vault.target) : 0;
  const progress = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/vaults" className="p-2 bg-surface-variant text-on-surface rounded-full hover:bg-border-subtle transition-colors">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-1 flex items-center gap-2">
            {vault.name}
            {role === "OWNER" && <span className="bg-secondary text-on-secondary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider align-middle">Owner</span>}
          </h2>
          <p className="text-on-surface-variant text-sm">{vault.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 md:p-8 shadow-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Vault Balance</h3>
            
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="font-display-lg text-display-lg-mobile md:text-display-lg font-bold text-on-surface">
                  {formatCurrency(current)}
                </p>
              </div>
              {target > 0 && (
                <div className="text-right">
                  <p className="text-sm text-on-surface-variant mb-1">Target</p>
                  <p className="font-body-lg text-body-lg font-bold text-on-surface">
                    {formatCurrency(target)}
                  </p>
                </div>
              )}
            </div>

            {target > 0 && (
              <div className="mb-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-on-surface-variant">{progress}% Reached</span>
                </div>
                <div className="w-full h-3 bg-surface-variant rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-secondary rounded-full" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 shadow-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-6">Recent Activity</h3>
            {vault.transactions.length === 0 ? (
              <p className="text-center text-on-surface-variant text-sm py-8">No contributions yet.</p>
            ) : (
              <div className="space-y-4">
                {vault.transactions.map(tx => (
                  <div key={tx.id} className="flex justify-between items-center p-4 border border-border-subtle rounded-lg bg-surface">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                        {tx.sender?.name ? tx.sender.name.charAt(0) : tx.sender?.username?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-on-surface text-sm">{tx.sender?.name || tx.sender?.username} contributed</p>
                        <p className="text-xs text-on-surface-variant mt-1">{new Date(tx.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="font-medium text-on-surface font-bold">
                      +{formatCurrency(Number(tx.amount))}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <VaultClient action="contribute" vaultId={vault.id} wallets={wallets} />

          <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 shadow-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Members ({vault.members.length})</h3>
            <div className="space-y-3 mb-6">
              {vault.members.map(m => (
                <div key={m.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-on-primary text-xs font-bold">
                    {m.user.name ? m.user.name.charAt(0) : m.user.username?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-on-surface">{m.user.name || m.user.username} {m.userId === session.user?.id ? "(You)" : ""}</p>
                    <p className="text-xs text-on-surface-variant">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>

            {role === "OWNER" && friendsToInvite.length > 0 && (
              <div className="pt-4 border-t border-border-subtle">
                <VaultClient action="add_member" vaultId={vault.id} friends={friendsToInvite} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

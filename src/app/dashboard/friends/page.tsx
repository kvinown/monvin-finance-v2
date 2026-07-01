import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FriendClient } from "./friend-client";

export default async function FriendsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Get friends where status is ACCEPTED
  const friendships = await prisma.friendship.findMany({
    where: {
      status: "ACCEPTED",
      OR: [
        { userId: session.user.id },
        { friendId: session.user.id }
      ]
    },
    include: {
      user: true,
      friend: true
    }
  });

  // Extract the actual friend user object from the relation
  const friendsList = friendships.map(f => {
    return f.userId === session.user?.id ? f.friend : f.user;
  });

  // Get pending incoming requests
  const pendingRequests = await prisma.friendship.findMany({
    where: {
      status: "PENDING",
      friendId: session.user.id
    },
    include: {
      user: true
    }
  });

  // Get pending outgoing requests
  const outgoingRequests = await prisma.friendship.findMany({
    where: {
      status: "PENDING",
      userId: session.user.id
    },
    include: {
      friend: true
    }
  });

  // Get user's wallets for P2P transfer
  const wallets = await prisma.wallet.findMany({
    where: { userId: session.user.id }
  });

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-1">Friends & Network</h2>
        <p className="text-on-surface-variant text-sm">Connect with others and send money instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 shadow-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Your Friends</h3>
            
            {friendsList.length === 0 ? (
              <p className="text-center text-on-surface-variant text-sm py-8">You haven't added any friends yet.</p>
            ) : (
              <div className="space-y-3">
                {friendsList.map(friend => (
                  <div key={friend.id} className="flex items-center justify-between p-4 border border-border-subtle rounded-lg bg-surface">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {friend.name ? friend.name.charAt(0).toUpperCase() : friend.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-on-surface">{friend.name || friend.username}</p>
                        <p className="text-xs text-on-surface-variant">@{friend.username}</p>
                      </div>
                    </div>
                    <FriendClient action="transfer" targetId={friend.id} targetName={friend.name || friend.username || ""} wallets={wallets} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {(pendingRequests.length > 0 || outgoingRequests.length > 0) && (
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 shadow-sm">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Friend Requests</h3>
              
              {pendingRequests.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-on-surface-variant uppercase mb-3">Incoming</h4>
                  <div className="space-y-3">
                    {pendingRequests.map(req => (
                      <div key={req.id} className="flex items-center justify-between p-3 border border-border-subtle rounded-lg bg-surface">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center">
                            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">person</span>
                          </div>
                          <p className="font-medium text-sm text-on-surface">@{req.user.username}</p>
                        </div>
                        <FriendClient action="respond" requestId={req.id} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {outgoingRequests.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-on-surface-variant uppercase mb-3">Outgoing</h4>
                  <div className="space-y-3">
                    {outgoingRequests.map(req => (
                      <div key={req.id} className="flex items-center justify-between p-3 border border-border-subtle rounded-lg bg-surface opacity-70">
                        <p className="font-medium text-sm text-on-surface">@{req.friend.username}</p>
                        <span className="text-xs bg-surface-variant px-2 py-1 rounded">Pending</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-primary border border-border-subtle rounded-xl p-6 shadow-sm text-on-primary">
            <h3 className="font-headline-md text-headline-md mb-2">Add New Friend</h3>
            <p className="text-sm opacity-80 mb-6">Search for users by their username to connect.</p>
            <FriendClient action="search" />
          </div>
        </div>
      </div>
    </div>
  );
}

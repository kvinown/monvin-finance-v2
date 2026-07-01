import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReportsClient } from "./reports-client";

export default async function ReportsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Fetch all transactions for the current user
  const transactions = await prisma.transaction.findMany({
    where: {
      wallet: {
        userId: session.user.id
      }
    },
    orderBy: { createdAt: "asc" }
  });

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-1">Analytics & Reports</h2>
        <p className="text-on-surface-variant text-sm">Visualize your cash flow and spending patterns.</p>
      </div>
      
      <ReportsClient transactions={transactions} />
    </div>
  );
}

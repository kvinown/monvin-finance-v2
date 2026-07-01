import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-1">Profile Settings</h2>
          <p className="text-on-surface-variant text-sm">Update your information for personalized AI Insights.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 md:p-8 shadow-sm">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}

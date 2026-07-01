import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CreateVaultForm } from "./create-vault-form";

export default async function CreateVaultPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-1">Create Shared Vault</h2>
        <p className="text-on-surface-variant text-sm">Start a collective savings pool with friends.</p>
      </div>

      <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 md:p-8 shadow-sm">
        <CreateVaultForm />
      </div>
    </div>
  );
}

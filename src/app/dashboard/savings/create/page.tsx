import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CreateSavingForm } from "./create-saving-form";

export default async function CreateSavingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-1">Create Savings Goal</h2>
        <p className="text-on-surface-variant text-sm">Set a new financial target for your future.</p>
      </div>

      <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 md:p-8 shadow-sm">
        <CreateSavingForm />
      </div>
    </div>
  );
}

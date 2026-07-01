import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-1">Preferences</h2>
          <p className="text-on-surface-variant text-sm">Manage your application preferences and settings.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 md:p-8 shadow-sm">
        <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Application Settings</h3>
        <div className="space-y-4">
          <div className="p-4 bg-surface-variant/30 border border-border-subtle rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium text-on-surface">Base Currency</p>
              <p className="text-sm text-on-surface-variant mt-1">Select your primary currency for reporting.</p>
            </div>
            <select className="h-10 px-3 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary transition-colors" defaultValue="IDR">
              <option value="IDR">IDR - Indonesian Rupiah</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
            </select>
          </div>
          
          <div className="p-4 bg-surface-variant/30 border border-border-subtle rounded-lg flex items-center justify-between opacity-50 cursor-not-allowed">
            <div>
              <p className="font-medium text-on-surface">Push Notifications</p>
              <p className="text-sm text-on-surface-variant mt-1">Receive alerts for important transactions.</p>
            </div>
            <div className="w-10 h-5 bg-border-dark rounded-full relative">
              <div className="w-4 h-4 bg-surface rounded-full absolute left-0.5 top-0.5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

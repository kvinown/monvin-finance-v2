"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSavingGoal } from "@/features/savings/actions/saving-actions";

export function CreateSavingForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createSavingGoal(formData);

    if (result.success) {
      router.push("/dashboard/savings");
    } else {
      setError(result.error || "Failed to create savings goal");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg text-sm font-medium bg-error-container text-on-error-container border border-error/20">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Goal Name</label>
        <input 
          type="text" 
          name="name" 
          required
          placeholder="e.g. Emergency Fund, New Car, Holiday"
          className="w-full h-10 px-3 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Target Amount (Optional)</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-medium">Rp</span>
          <input 
            type="number" 
            name="target" 
            placeholder="50000000"
            className="w-full h-10 pl-10 pr-3 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary transition-colors"
          />
        </div>
        <p className="text-xs text-on-surface-variant">Leave blank if you just want to save without a specific target.</p>
      </div>

      <div className="pt-4 border-t border-border-subtle flex justify-end gap-3">
        <button 
          type="button" 
          onClick={() => router.back()}
          className="h-10 px-6 bg-surface-variant text-on-surface-variant font-table-data text-table-data font-medium rounded-lg hover:bg-surface-variant/80 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="h-10 px-6 bg-secondary text-on-secondary font-table-data text-table-data font-medium rounded-lg hover:bg-secondary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create Goal"}
        </button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createVault } from "@/features/vaults/actions/vault-actions";
import { CurrencyInput } from "@/components/ui/currency-input";

export function CreateVaultForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createVault(formData);

    if (result.success) {
      router.push("/dashboard/vaults");
    } else {
      setError(result.error || "Failed to create vault");
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
        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Vault Name</label>
        <input 
          type="text" 
          name="name" 
          required
          placeholder="e.g. Bali Trip 2027"
          className="w-full h-10 px-3 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Description (Optional)</label>
        <input 
          type="text" 
          name="description" 
          placeholder="What is this vault for?"
          className="w-full h-10 px-3 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary transition-colors"
        />
      </div>

      <div className="space-y-2">
        <CurrencyInput name="target" label="Target Amount (Optional)" placeholder="50.000.000" />
        <p className="text-xs text-on-surface-variant">Leave blank for an open-ended vault.</p>
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
          {loading ? "Creating..." : "Create Vault"}
        </button>
      </div>
    </form>
  );
}

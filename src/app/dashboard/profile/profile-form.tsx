"use client";

import { useState } from "react";
import { updateProfile } from "@/features/profile/actions/update-profile";

export function ProfileForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const formatDate = (date: any) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      occupation: formData.get("occupation"),
      monthlyIncome: formData.get("monthlyIncome"),
      dateOfBirth: formData.get("dateOfBirth"),
      financialGoal: formData.get("financialGoal"),
      riskTolerance: formData.get("riskTolerance"),
    };

    const result = await updateProfile(data);

    if (result.success) {
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } else {
      setMessage({ type: "error", text: result.error || "Failed to update profile." });
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message.text && (
        <div className={`p-4 rounded-lg text-sm font-medium ${
          message.type === 'success' 
            ? 'bg-success/10 text-success-dark border border-success/20' 
            : 'bg-error-container text-on-error-container border border-error/20'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Full Name</label>
          <input 
            type="text" 
            name="name" 
            defaultValue={user.name || ""} 
            className="w-full h-10 px-3 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Email</label>
          <input 
            type="email" 
            defaultValue={user.email || ""} 
            disabled
            className="w-full h-10 px-3 bg-surface-variant/50 border border-border-subtle rounded-lg text-sm text-on-surface-variant cursor-not-allowed opacity-70"
          />
        </div>

        <div className="space-y-2">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Occupation</label>
          <input 
            type="text" 
            name="occupation" 
            defaultValue={user.occupation || ""} 
            placeholder="e.g. Software Engineer"
            className="w-full h-10 px-3 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Date of Birth</label>
          <input 
            type="date" 
            name="dateOfBirth" 
            defaultValue={formatDate(user.dateOfBirth)} 
            className="w-full h-10 px-3 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Monthly Income (IDR)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-medium">Rp</span>
            <input 
              type="number" 
              name="monthlyIncome" 
              defaultValue={user.monthlyIncome ? Number(user.monthlyIncome) : ""} 
              placeholder="10000000"
              className="w-full h-10 pl-10 pr-3 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Risk Tolerance</label>
          <select 
            name="riskTolerance" 
            defaultValue={user.riskTolerance || ""} 
            className="w-full h-10 px-3 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary transition-colors"
          >
            <option value="">Select an option</option>
            <option value="LOW">Low (Conservative)</option>
            <option value="MEDIUM">Medium (Balanced)</option>
            <option value="HIGH">High (Aggressive)</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Primary Financial Goal</label>
        <textarea 
          name="financialGoal" 
          defaultValue={user.financialGoal || ""} 
          placeholder="What is your main financial objective for this year?"
          className="w-full h-24 p-3 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary transition-colors resize-none"
        />
      </div>

      <div className="pt-4 border-t border-border-subtle flex justify-end">
        <button 
          type="submit" 
          disabled={loading}
          className="h-10 px-6 bg-secondary text-on-secondary font-table-data text-table-data font-medium rounded-lg hover:bg-secondary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

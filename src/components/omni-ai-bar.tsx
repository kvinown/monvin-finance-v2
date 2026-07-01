"use client";

import { useState } from "react";
import { parseAiAction } from "@/features/ai/actions/ai-actions";
import { TransactionModal } from "./transaction-modal";

export function OmniAiBar() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiData, setAiData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResponseMsg(null);

    try {
      const res = await parseAiAction(prompt);
      if (res.success) {
        setAiData(res.action);
        setIsModalOpen(true);
        setPrompt(""); // Clear input on success
      } else {
        setResponseMsg({ type: "error", text: res.message });
      }
    } catch (error: any) {
      setResponseMsg({ type: "error", text: "Something went wrong while executing the AI action." });
    } finally {
      setIsLoading(false);
      // Auto clear message after 5 seconds
      setTimeout(() => {
        setResponseMsg(null);
      }, 5000);
    }
  };

  return (
    <div className="w-full mb-6">
      <div className="flex gap-4 items-center">
        <form onSubmit={handleSubmit} className="relative group flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-secondary">
            <span className="material-symbols-outlined text-[20px] animate-pulse">magic_button</span>
          </div>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            className="w-full py-4 pl-12 pr-24 bg-surface-container-lowest border border-border-subtle rounded-xl text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all shadow-sm placeholder-on-surface-variant/50"
            placeholder="Ask AI: 'Gajian 5 juta ke BCA' or 'Kirim 50rb ke @budigaming'..."
          />
          <div className="absolute inset-y-0 right-2 flex items-center">
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="h-10 px-4 bg-secondary text-on-secondary rounded-lg font-medium text-sm disabled:opacity-50 flex items-center gap-2 hover:bg-secondary/90 transition-colors"
            >
              {isLoading ? (
                <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">send</span>
              )}
              <span className="hidden sm:inline">{isLoading ? "Thinking..." : "Action"}</span>
            </button>
          </div>
        </form>

        <button 
          onClick={() => { setAiData(null); setIsModalOpen(true); }}
          className="h-[56px] px-6 bg-primary text-on-primary rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shrink-0 shadow-sm"
        >
          <span className="material-symbols-outlined">add</span>
          <span className="hidden md:inline">New Transaction</span>
        </button>
      </div>

      {responseMsg && (
        <div className={`mt-3 p-3 rounded-lg text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top-2 fade-in duration-300 ${
          responseMsg.type === "success" 
            ? "bg-success/10 text-success border border-success/20" 
            : "bg-error/10 text-error border border-error/20"
        }`}>
          <span className="material-symbols-outlined text-[18px]">
            {responseMsg.type === "success" ? "check_circle" : "error"}
          </span>
          {responseMsg.text}
        </div>
      )}

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={aiData} 
      />
    </div>
  );
}

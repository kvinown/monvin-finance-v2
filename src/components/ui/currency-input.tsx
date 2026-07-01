"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface CurrencyInputProps {
  name: string;
  defaultValue?: number | string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({ 
  name, 
  defaultValue = "", 
  label, 
  disabled = false, 
  placeholder = "0", 
  required = false,
  className
}) => {
  const [value, setValue] = useState<string>(defaultValue.toString());

  // Format angka murni menjadi string dengan pemisah titik
  const formatDisplay = (val: string) => {
    if (!val) return "";
    return val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Bersihkan input dari karakter non-angka sebelum melempar value ke parent state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setValue(rawValue);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="text-xs font-bold text-on-surface-variant uppercase">{label}</label>}
      <div className="relative">
        {/* Ornamen Rp Statis */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-on-surface-variant text-sm font-medium">Rp</span>
        </div>
        <input
          type="hidden"
          name={name}
          value={value}
        />
        <input
          type="text"
          required={required}
          placeholder={placeholder}
          className={cn("w-full h-10 pl-10 pr-3 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary transition-colors", className)}
          value={formatDisplay(value)}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

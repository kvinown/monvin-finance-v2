"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="text-on-surface-variant hover:text-secondary transition-colors cursor-pointer active:opacity-80 p-2 rounded-full hover:bg-surface-variant">
        <span className="material-symbols-outlined opacity-0">light_mode</span>
      </button>
    );
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="text-on-surface-variant hover:text-secondary transition-colors cursor-pointer active:opacity-80 p-2 rounded-full hover:bg-surface-variant"
      title="Toggle Dark Mode"
    >
      <span className="material-symbols-outlined">
        {currentTheme === "dark" ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}

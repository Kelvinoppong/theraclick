"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Cycles through: light → dark → system.
 * Mounted guard prevents hydration mismatch since theme is unknown on the server.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className={cn("h-9 w-9 rounded-lg", className)} />
    );
  }

  const cycle = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;
  const label =
    theme === "dark" ? "Dark" : theme === "light" ? "Light" : "System";

  return (
    <button
      onClick={cycle}
      className={cn(
        "flex items-center gap-2.5 rounded-lg transition-colors",
        className
      )}
      title={`Theme: ${label}`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

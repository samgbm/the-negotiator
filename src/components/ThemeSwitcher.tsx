"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Palette } from "lucide-react";
import { THEMES } from "./ThemeProvider";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="flex h-10 w-52 items-center gap-2 rounded-lg border border-border bg-secondary px-3"
        aria-hidden="true"
      />
    );
  }

  return (
    <label className="relative flex items-center gap-2">
      <span className="sr-only">Select theme</span>
      <Palette
        className="pointer-events-none absolute left-3 size-4 text-accent"
        aria-hidden="true"
      />
      <select
        value={theme ?? "Quantum Obsidian"}
        onChange={(event) => setTheme(event.target.value)}
        aria-label="Select theme"
        className="h-10 w-52 appearance-none rounded-lg border border-border bg-secondary py-2 pr-8 pl-9 text-sm text-foreground transition-colors hover:border-accent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        {THEMES.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}

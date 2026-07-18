"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export const THEMES = [
  "Light Mode",
  "Dark Mode",
  "Aethelgard Emerald",
  "Valerius Crimson",
  "Lumina Noir",
  "Oceanic Celestia",
  "Quantum Obsidian",
  "Matrix Onyx",
  "Ivory Classic",
  "Sienna Elegance",
] as const;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="Quantum Obsidian"
      themes={[...THEMES]}
      enableSystem={false}
    >
      {children}
    </NextThemesProvider>
  );
}

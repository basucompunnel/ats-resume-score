"use client";

import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";

export function Header() {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-foreground">
            ATS Resume Score
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}

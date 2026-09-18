"use client";

import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="group flex h-10 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 text-[var(--muted)] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--card)] shadow-sm">
        {isDark ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-3.5 w-3.5"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-3.5 w-3.5"
          >
            <path d="M21 12.8A8.5 8.5 0 0 1 11.2 3a6.8 6.8 0 1 0 9.8 9.8Z" />
          </svg>
        )}
      </span>

      <span className="hidden text-xs font-semibold sm:inline">
        {isDark ? "Light" : "Night"}
      </span>
    </button>
  );
}
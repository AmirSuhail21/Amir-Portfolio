"use client";

import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        {/* Logo */}
        <a
          href="#home"
          className="group flex items-center gap-3"
          aria-label="Amir Suhail Home"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] font-bold text-[var(--foreground)] transition group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
            AS
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold tracking-tight">
              Amir Suhail
            </p>
            <p className="text-xs text-[var(--muted)]">Web Developer</p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />

          <a
            href="#contact"
            className="rounded-full bg-[var(--foreground)] px-5 py-2.5 text-sm font-semibold text-[var(--background)] transition hover:scale-105"
          >
            Let&apos;s Talk
          </a>
        </div>

        {/* Mobile Action */}
        <div className="flex items-center lg:hidden">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
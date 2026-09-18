"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { portfolioData } from "@/data/portfolio";
import Image from "next/image";

const ThemeToggle = dynamic(() => import("./ThemeToggle"), {
  ssr: false,
});

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.01c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.73-1.53-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18A10.9 10.9 0 0 1 12 6.2c.97 0 1.95.13 2.86.36 2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.07.78 2.16v3.2c0 .31.21.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M5.04 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 5.04 0ZM.5 8.1h4.91V23H.5V8.1Zm7.99 0h4.71v2.03h.07c.66-1.17 2.26-2.4 4.65-2.4 4.98 0 5.9 3.28 5.9 7.55V23h-4.91v-6.86c0-1.64-.03-3.75-2.29-3.75-2.29 0-2.64 1.79-2.64 3.63V23H8.49V8.1Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.45L4 20l.9-3.75A8.5 8.5 0 1 1 20.5 11.7Z" />
      <path d="M8.5 8.3c.2-.45.4-.46.75-.47h.5c.2 0 .4.08.52.38l.72 1.7c.1.23.08.42-.08.62l-.48.6c-.1.13-.2.27-.08.5.13.25.58.96 1.25 1.55.84.75 1.55.98 1.8 1.1.25.12.4.1.55-.08l.7-.82c.16-.2.34-.17.57-.08l1.55.74c.24.12.4.18.46.29.06.1.06.62-.15 1.2-.2.57-1.04 1.05-1.43 1.1-.37.05-.84.07-1.35-.1-.31-.1-.7-.23-1.2-.45-2.1-.9-3.47-3.1-3.9-3.66-.43-.56-1.03-1.37-1.03-2.62 0-1.24.64-1.85.87-2.1Z" />
    </svg>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--muted)] transition-all duration-200 hover:bg-[var(--surface)] hover:text-[var(--accent)]"
    >
      {children}
    </a>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { socialLinks } = portfolioData.profile;

  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-5 sm:px-6">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center rounded-[22px] border border-[var(--border)] bg-[var(--card)]/80 px-3 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-2xl dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)] sm:px-5">

        <div className="flex items-center gap-3">
          <Image
            src="/as-logo.png"
            alt="Amir Suhail"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />

          <span className="hidden text-sm font-bold text-[var(--foreground)] sm:block">
            Amir Suhail
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="mx-auto hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={isAdminRoute ? `/${item.href}` : item.href}
              className="rounded-full px-3.5 py-2 text-[13px] font-medium text-[var(--muted)] transition-all duration-200 hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop Social + Theme */}
        <div className="hidden items-center gap-1 lg:flex">
          <SocialLink href={socialLinks.github} label="GitHub">
            <GithubIcon />
          </SocialLink>

          <SocialLink href={socialLinks.linkedin} label="LinkedIn">
            <LinkedinIcon />
          </SocialLink>

          <SocialLink href={socialLinks.instagram} label="Instagram">
            <InstagramIcon />
          </SocialLink>

          <SocialLink href={socialLinks.whatsapp} label="WhatsApp">
            <WhatsappIcon />
          </SocialLink>

          <div className="ml-1 border-l border-[var(--border)] pl-2">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile */}
        <div className="ml-auto flex items-center lg:hidden">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
import { portfolioData } from "@/data/portfolio";
import Image from "next/image";

export default function Footer() {
  const { profile } = portfolioData;

  return (
    <footer className="relative overflow-hidden border-t border-[var(--border)] py-10 sm:py-12">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-64 w-64 rounded-full bg-[var(--accent)]/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Brand / Copyright */}
          <div>
            <a
              href="#home"
              className="inline-flex items-center gap-3"
              aria-label="Amir Suhail Home"
            >
              <Image
                src="/as-logo.png"
                alt="Amir Suhail"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />

              <span className="text-sm font-black tracking-tight">
                {profile.name}
              </span>
            </a>

            <p className="mt-4 text-sm font-medium text-[var(--foreground)]">
              © {new Date().getFullYear()} {profile.name}
            </p>

            <p className="mt-1 text-xs text-[var(--muted)]">
              Built with Next.js, TypeScript & Tailwind CSS.
            </p>
          </div>

          {/* Back To Top */}
          <a
            href="#home"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs font-bold text-[var(--muted)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
          >
            Back to top

            <span className="transition-transform duration-200 group-hover:-translate-y-0.5">
              ↑
            </span>
          </a>
        </div>

        {/* Developer Credit */}
        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--muted)]">
            Designed & Developed by{" "}
            <span className="font-semibold text-[var(--foreground)]">
              Amir Suhail
            </span>
          </p>

          <p className="text-xs text-[var(--muted)]">
            Full-Stack Web Developer
          </p>
        </div>
      </div>
    </footer>
  );
}
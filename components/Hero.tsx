
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function Hero() {
  const supabase = await createSupabaseServerClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (!profile) {
    return null;
  }

  return (
    <section
      id="home"
      className="relative scroll-mt-24 overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--accent)]/8 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-72 h-64 w-64 rounded-full bg-[var(--accent)]/5 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:px-8">

        {/* Left Content */}
        <div>
          {/* Availability */}
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--card)]/80 px-4 py-2.5 shadow-sm backdrop-blur-xl">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>

            <span className="text-xs font-semibold tracking-wide text-[var(--muted)]">
              Available for opportunities
            </span>
          </div>

          {/* Intro */}
          <p className="text-base font-medium text-[var(--muted)] sm:text-lg">
            Hello, I&apos;m
          </p>

          <h1 className="mt-2 max-w-4xl text-5xl font-black tracking-[-0.055em] text-[var(--foreground)] sm:text-6xl lg:text-7xl">
            {profile.name}
          </h1>

          {/* Role */}
          <h2 className="mt-5 max-w-3xl text-xl font-bold leading-8 text-[var(--accent)] sm:text-2xl">
            {profile.role}
          </h2>

          {/* Hero Bio */}
          <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            {profile.hero_bio || profile.bio}
          </p>

          {/* CTA */}
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="group rounded-full bg-[var(--foreground)] px-6 py-3.5 text-sm font-bold text-[var(--background)] shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:shadow-black/25"
            >
              View Projects
              <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                ↗
              </span>
            </a>

            <a
              href="#contact"
              className="rounded-full border border-[var(--border)] bg-[var(--card)]/70 px-6 py-3.5 text-sm font-bold text-[var(--foreground)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Let&apos;s Talk
            </a>

            {profile.resume_url && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[var(--border)] bg-[var(--card)]/70 px-6 py-3.5 text-sm font-bold text-[var(--foreground)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Download Resume ↗
              </a>
            )}
          </div>

          {/* Social Icons and Location */}
          <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-3">

            {/* GitHub */}
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="GitHub"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)]/80 text-[var(--muted)] shadow-sm backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]"
              >
                <svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor" aria-hidden="true">
                  <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.67-3.76-1.31-3.76-1.31-.5-1.29-1.23-1.63-1.23-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.68 2.04 3.36 2.7.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.54.23 2.68.11 2.96.72.78 1.15 1.77 1.15 2.99 0 4.29-2.61 5.24-5.1 5.52.4.35.75 1.03.75 2.08V22c0 .29.2.63.76.52A11.1 11.1 0 0 0 12 .9Z" />
                </svg>
              </a>
            )}

            {/* LinkedIn */}
            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)]/80 text-[var(--muted)] shadow-sm backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM3.555 9h3.564v11.452H3.555zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            )}

            {/* Instagram */}
            {profile.instagram && (
              <a
                href={profile.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)]/80 text-[var(--muted)] shadow-sm backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="21"
                  height="21"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            )}

            {/* Gmail */}
            <a
              href="mailto:mannuraien3@gmail.com"
              aria-label="Send Email"
              title="Email"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)]/80 text-[var(--muted)] shadow-sm backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]"
            >
              <svg
                viewBox="0 0 24 24"
                width="21"
                height="21"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/918445939397"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              title="WhatsApp"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)]/80 text-[var(--muted)] shadow-sm backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]"
            >
              <svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor" aria-hidden="true">
                <path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.5 0 .14 5.35.14 11.93c0 2.1.55 4.15 1.6 5.96L0 24l6.27-1.64a11.9 11.9 0 0 0 5.8 1.48h.01c6.58 0 11.93-5.35 11.93-11.93 0-3.19-1.24-6.18-3.49-8.43ZM12.08 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.72.97.99-3.63-.24-.37a9.86 9.86 0 0 1-1.51-5.25c0-5.45 4.44-9.89 9.89-9.89a9.82 9.82 0 0 1 7 2.9 9.82 9.82 0 0 1 2.9 7c0 5.45-4.45 9.86-9.91 9.86Zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.8-1.49-1.78-1.66-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.09 4.5.71.3 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.18-1.42-.07-.12-.27-.2-.57-.35Z" />
              </svg>
            </a>

            {/* Location */}
            {profile.location && (
              <span className="inline-flex items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--card)]/80 px-4 py-2.5 text-sm font-medium text-[var(--muted)] shadow-sm backdrop-blur-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                <span>{profile.location}</span>
              </span>
            )}
          </div>
        </div>

        {/* Profile Image */}
        <div className="relative mx-auto w-full max-w-md lg:ml-auto">
          {/* Decorative shapes */}
          <div
            aria-hidden="true"
            className="absolute -right-5 -top-5 h-24 w-24 rounded-full border border-[var(--accent)]/20"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-6 -left-6 h-24 w-24 rounded-3xl border border-[var(--border)]"
          />

          {/* Glow */}
          <div
            aria-hidden="true"
            className="absolute inset-8 rounded-[2.5rem] bg-[var(--accent)]/10 blur-3xl"
          />

          {/* Image Card */}
          <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] shadow-2xl shadow-black/10 dark:shadow-black/30">
            {profile.profile_image ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.profile_image}
                  alt={`${profile.name} profile`}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-7xl font-black tracking-[-0.06em] text-[var(--accent)]">
                  {profile.name
                    .split(" ")
                    .map((part: string) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Role Badge */}
          {profile.short_role && (
            <div className="relative mt-5 inline-flex rounded-full border border-[var(--border)] bg-[var(--card)]/85 px-4 py-2.5 shadow-lg shadow-black/5 backdrop-blur-xl dark:shadow-black/20">
              <span className="text-sm font-semibold text-[var(--muted)]">
                {profile.short_role}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
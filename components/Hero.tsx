
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { Github, Instagram, MapPin } from "lucide-react";

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

          {/* Social / Location */}
          <div className="mt-9 flex flex-wrap items-center gap-3">

            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="GitHub"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
              >
                <Github size={20} />
              </a>
            )}

            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
              >
                <svg
  xmlns="http://www.w3.org/2000/svg"
  width="20"
  height="20"
  viewBox="0 0 24 24"
  fill="currentColor"
  aria-hidden="true"
>
  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM3.555 9h3.564v11.452H3.555zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
</svg>
              </a>
            )}

            {profile.instagram && (
              <a
                href={profile.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
              >
                <Instagram size={20} />
              </a>
            )}

            {profile.location && (
              <span className="ml-2 flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
                <MapPin size={17} />
                {profile.location}
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

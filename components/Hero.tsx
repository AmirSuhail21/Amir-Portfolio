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
      className="scroll-mt-24 pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        {/* Left Content */}
        <div>
          {/* Availability */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3.5 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            <span className="text-xs font-medium text-[var(--muted)]">
              Available for opportunities
            </span>
          </div>

          {/* Greeting */}
          <p className="text-base font-medium text-[var(--muted)] sm:text-lg">
            Hello, I&apos;m
          </p>

          {/* Name */}
          <h1 className="mt-2 text-5xl font-bold tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            {profile.name}
          </h1>

          {/* Role */}
          <h2 className="mt-5 max-w-3xl text-xl font-semibold leading-8 text-[var(--accent)] sm:text-2xl">
            {profile.role}
          </h2>

          {/* Bio */}
          <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            {profile.bio}
          </p>

          {/* Actions */}
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-[var(--background)] transition hover:-translate-y-0.5"
            >
              View Projects ↗
            </a>

            <a
              href="#contact"
              className="rounded-full border border-[var(--border)] px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Let&apos;s Talk
            </a>
          </div>

          {/* Social Links */}
          <div className="mt-9 flex flex-wrap items-center gap-5">
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]"
              >
                GitHub ↗
              </a>
            )}

            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]"
              >
                LinkedIn ↗
              </a>
            )}

            {profile.instagram && (
              <a
                href={profile.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]"
              >
                Instagram ↗
              </a>
            )}

            {profile.location && (
              <span className="text-sm text-[var(--muted)]">
                📍 {profile.location}
              </span>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="relative mx-auto w-full max-w-md lg:ml-auto">
          {/* Decorative Elements */}
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full border border-[var(--border)]" />

          <div className="absolute -bottom-5 -left-5 h-20 w-20 rounded-2xl border border-[var(--border)]" />

          {/* Main Card */}
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)]">
            {profile.profile_image ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.profile_image}
                  alt={`${profile.name} profile`}
                  className="h-full w-full object-cover"
                />
              </>

            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--background)] text-4xl font-bold">
                    AS
                  </div>

                  <p className="mt-5 text-sm font-medium text-[var(--muted)]">
                    {profile.short_role}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div >
      </div >
    </section >
  );
}
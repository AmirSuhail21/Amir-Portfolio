import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function About() {
  const supabase = await createSupabaseServerClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("name, role, short_role, bio, location")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("About profile fetch error:", error.message);
    return null;
  }

  if (!profile) {
    return null;
  }

  return (
    <section
      id="about"
      className="relative scroll-mt-24 overflow-hidden border-t border-[var(--border)] py-24 sm:py-32"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-[var(--accent)]/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[var(--accent)]" />

            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
              About Me
            </p>
          </div>

          <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Turning ideas into{" "}
            <span className="text-[var(--accent)]">useful experiences.</span>
          </h2>
        </div>

        {/* Main content */}
        <div className="mt-14 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          {/* Intro card */}
          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-7 shadow-sm sm:p-9">
            <div
              aria-hidden="true"
              className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[var(--accent)]/8 blur-2xl"
            />

            <p className="relative text-lg font-semibold leading-8 text-[var(--foreground)]">
              I&apos;m {profile.name}, a developer who enjoys building modern
              web applications that are practical, responsive and easy to use.
            </p>

            <p className="mt-6 text-base leading-8 text-[var(--muted)]">
              {profile.bio}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-xs font-semibold text-[var(--muted)]">
                Problem Solving
              </span>

              <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-xs font-semibold text-[var(--muted)]">
                Responsive Design
              </span>

              <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-xs font-semibold text-[var(--muted)]">
                Clean Code
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4">
            {/* Current Role */}
            <div className="group rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent)]/40 sm:p-7">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                    Current Role
                  </p>

                  <p className="mt-3 max-w-xl text-base font-semibold leading-7 text-[var(--foreground)]">
                    {profile.role}
                  </p>
                </div>

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] text-lg text-[var(--accent)] transition-transform duration-200 group-hover:rotate-6">
                  ↗
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="group rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent)]/40 sm:p-7">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                    Based In
                  </p>

                  <p className="mt-3 text-base font-semibold text-[var(--foreground)]">
                    {profile.location || "India"}
                  </p>
                </div>

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] text-base text-[var(--accent)]">
                  ◉
                </span>
              </div>
            </div>

            {/* Philosophy */}
            <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
                My Approach
              </p>

              <p className="mt-4 text-base leading-8 text-[var(--muted)]">
                I focus on turning ideas into responsive, practical and
                maintainable web experiences. I continuously learn new
                technologies and improve my work through real-world projects.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
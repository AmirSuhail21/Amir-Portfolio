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
      className="scroll-mt-24 border-t border-[var(--border)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              About Me
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Building useful things with code.
            </h2>
          </div>

          <div>
            <p className="text-lg leading-8 text-[var(--muted)]">
              {profile.bio}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">
                  Current Role
                </p>

                <p className="mt-3 text-sm font-semibold leading-6">
                  {profile.role}
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">
                  Location
                </p>

                <p className="mt-3 text-sm font-semibold leading-6">
                  {profile.location || "India"}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
              <p className="text-sm font-semibold">
                {profile.short_role || profile.role}
              </p>

              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                I enjoy turning ideas into responsive, practical and
                maintainable web experiences. My portfolio is continuously
                updated as I learn new technologies and build new projects.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
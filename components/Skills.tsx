import { createSupabaseServerClient } from "@/lib/supabase-server";

type Skill = {
  id: string;
  name: string;
  category: string;
  description: string | null;
};

export default async function Skills() {
  const supabase = await createSupabaseServerClient();

  const { data: skills, error } = await supabase
    .from("skills")
    .select("id, name, category, description")
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Skills fetch error:", error.message);
    return null;
  }

  const groupedSkills = (skills as Skill[]).reduce(
    (groups, skill) => {
      if (!groups[skill.category]) {
        groups[skill.category] = [];
      }

      groups[skill.category].push(skill);

      return groups;
    },
    {} as Record<string, Skill[]>
  );

  const categories = Object.entries(groupedSkills);

  return (
    <section
      id="skills"
      className="relative scroll-mt-24 overflow-hidden border-t border-[var(--border)] py-24 sm:py-32"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[var(--accent)]" />

            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
              Skills
            </p>
          </div>

          <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Tools I use to{" "}
            <span className="text-[var(--accent)]">build things.</span>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            A growing collection of technologies and tools I use while
            building modern web applications and real-world projects.
          </p>
        </div>

        {/* Skills */}
        {categories.length > 0 ? (
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {categories.map(([category, categorySkills]) => (
              <div
                key={category}
                className="group relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/30 hover:shadow-lg sm:p-8"
              >
                {/* Card accent */}
                <div
                  aria-hidden="true"
                  className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[var(--accent)]/5 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                />

                {/* Category header */}
                <div className="relative flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)] text-sm font-black text-[var(--accent)]">
                      {category.charAt(0).toUpperCase()}
                    </span>

                    <h3 className="text-lg font-bold tracking-tight">
                      {category}
                    </h3>
                  </div>

                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-[var(--muted)]">
                    {categorySkills.length}{" "}
                    {categorySkills.length === 1 ? "skill" : "skills"}
                  </span>
                </div>

                {/* Skill list */}
                <div className="relative mt-7 grid gap-3 sm:grid-cols-2">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="group/skill rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:bg-[var(--card)]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-bold text-[var(--foreground)]">
                          {skill.name}
                        </p>

                        <span className="text-sm text-[var(--accent)] opacity-0 transition-opacity duration-200 group-hover/skill:opacity-100">
                          ↗
                        </span>
                      </div>

                      {skill.description && (
                        <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                          {skill.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-14 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-10 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--accent)]">
              +
            </div>

            <p className="mt-4 text-sm font-semibold text-[var(--muted)]">
              No skills have been added yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
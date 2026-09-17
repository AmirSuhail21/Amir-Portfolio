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
      className="scroll-mt-24 border-t border-[var(--border)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Skills
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Technologies I work with.
          </h2>

          <p className="mt-4 text-base leading-8 text-[var(--muted)]">
            My current technical skills and technologies are managed
            directly from the admin dashboard.
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {categories.map(([category, categorySkills]) => (
              <div
                key={category}
                className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold">
                    {category}
                  </h3>

                  <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
                    {categorySkills.length}
                  </span>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--accent)]/50"
                    >
                      <p className="text-sm font-semibold">
                        {skill.name}
                      </p>

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
          <div className="mt-12 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
            <p className="text-sm text-[var(--muted)]">
              No skills have been added yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
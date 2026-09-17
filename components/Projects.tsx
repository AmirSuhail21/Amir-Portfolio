import { createSupabaseServerClient } from "@/lib/supabase-server";


type ProjectSkill = {
  project_id: string;
  skills: {
    name: string;
  } | null;
};

export default async function Projects() {
  const supabase = await createSupabaseServerClient();

  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select(`
      id,
      title,
      description,
      image,
      live_url,
      github_url,
      featured,
      project_types (
        name
      )
    `)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (projectsError) {
    console.error("Projects fetch error:", projectsError.message);

    return null;
  }

  const { data: projectSkills, error: skillsError } = await supabase
    .from("project_skills")
    .select(`
      project_id,
      skills (
        name
      )
    `);

  if (skillsError) {
    console.error("Project skills fetch error:", skillsError.message);
  }

  const skillsByProject = new Map<string, string[]>();

  (projectSkills as ProjectSkill[] | null)?.forEach((item) => {
    if (!item.skills?.name) {
      return;
    }

    const current = skillsByProject.get(item.project_id) ?? [];

    current.push(item.skills.name);

    skillsByProject.set(item.project_id, current);
  });

  return (
    <section
      id="projects"
      className="scroll-mt-24 border-t border-[var(--border)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Projects
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Things I&apos;ve built.
          </h2>

          <p className="mt-4 text-base leading-8 text-[var(--muted)]">
            A collection of web applications, client projects and
            JavaScript experiments.
          </p>
        </div>

        {projects && projects.length > 0 ? (
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {projects.map((project) => {
              const skills =
                skillsByProject.get(project.id) ?? [];

              return (
                <article
                  key={project.id}
                  className="group overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] transition duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/50"
                >
                  {project.image ? (
                    <div className="aspect-[16/9] overflow-hidden border-b border-[var(--border)] bg-[var(--background)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.image}
                        alt={`${project.title} project screenshot`}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[16/9] items-center justify-center border-b border-[var(--border)] bg-[var(--background)]">
                      <div className="text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border)] text-xl font-bold">
                          {project.title
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>

                        <p className="mt-3 text-xs text-[var(--muted)]">
                          Project Preview
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-2">
                      {project.project_types?.[0]?.name && (
                        <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
                          {project.project_types[0].name}
                        </span>
                      )}

                      {project.featured && (
                        <span className="rounded-full bg-[var(--foreground)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--background)]">
                          Featured
                        </span>
                      )}
                    </div>

                    <h3 className="mt-5 text-2xl font-bold tracking-tight">
                      {project.title}
                    </h3>

                    {project.description && (
                      <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                        {project.description}
                      </p>
                    )}

                    {skills.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <span
                            key={`${project.id}-${skill}`}
                            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-medium text-[var(--muted)]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-7 flex flex-wrap items-center gap-4">
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-[var(--foreground)] px-5 py-2.5 text-xs font-semibold text-[var(--background)] transition hover:-translate-y-0.5"
                        >
                          VIEW PROJECT ↗
                        </a>
                      )}

                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-[var(--border)] px-5 py-2.5 text-xs font-semibold transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                        >
                          GITHUB ↗
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-12 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
            <p className="text-sm text-[var(--muted)]">
              No projects have been added yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
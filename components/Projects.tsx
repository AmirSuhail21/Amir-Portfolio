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
      className="relative scroll-mt-24 overflow-hidden border-t border-[var(--border)] py-24 sm:py-32"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-24 h-96 w-96 rounded-full bg-[var(--accent)]/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[var(--accent)]" />

              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
                Projects
              </p>
            </div>

            <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Things I&apos;ve{" "}
              <span className="text-[var(--accent)]">built.</span>
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              A collection of web applications, client work and experiments
              built while learning, solving problems and exploring new ideas.
            </p>
          </div>

          <a
            href="#contact"
            className="w-fit rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-3 text-xs font-bold text-[var(--foreground)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Have a project? ↗
          </a>
        </div>

        {/* Projects */}
        {projects && projects.length > 0 ? (
          <div className="mt-14 grid gap-7 lg:grid-cols-2">
            {projects.map((project) => {
              const skills = skillsByProject.get(project.id) ?? [];
              const isFeatured = project.featured;

              return (
                <article
                  key={project.id}
                  className={`group relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--accent)]/40 hover:shadow-xl dark:shadow-black/20 ${
                    isFeatured ? "lg:col-span-2" : ""
                  }`}
                >
                  {/* Project image */}
                  {project.image ? (
                    <div
                      className={`relative overflow-hidden border-b border-[var(--border)] bg-[var(--surface)] ${
                        isFeatured
                          ? "aspect-[16/8] sm:aspect-[16/7]"
                          : "aspect-[16/9]"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.image}
                        alt={`${project.title} project screenshot`}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                      />

                      {/* Image overlay */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />

                      {/* Featured badge */}
                      {isFeatured && (
                        <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/50 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-xl">
                          Featured Project
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`relative flex items-center justify-center overflow-hidden border-b border-[var(--border)] bg-[var(--surface)] ${
                        isFeatured
                          ? "aspect-[16/8] sm:aspect-[16/7]"
                          : "aspect-[16/9]"
                      }`}
                    >
                      <div className="absolute h-40 w-40 rounded-full bg-[var(--accent)]/10 blur-3xl" />

                      <div className="relative text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] text-xl font-black text-[var(--accent)]">
                          {project.title.slice(0, 2).toUpperCase()}
                        </div>

                        <p className="mt-3 text-xs font-medium text-[var(--muted)]">
                          Project Preview
                        </p>
                      </div>

                      {isFeatured && (
                        <div className="absolute left-5 top-5 rounded-full border border-[var(--border)] bg-[var(--card)]/80 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--accent)] backdrop-blur-xl">
                          Featured Project
                        </div>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div
                    className={`p-6 sm:p-8 ${
                      isFeatured ? "lg:p-10" : ""
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      {project.project_types?.[0]?.name && (
                        <span className="rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/8 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-[var(--accent)]">
                          {project.project_types[0].name}
                        </span>
                      )}

                      {isFeatured && (
                        <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-[var(--muted)]">
                          Highlight
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex items-start justify-between gap-6">
                      <h3
                        className={`font-black tracking-[-0.03em] ${
                          isFeatured
                            ? "text-3xl sm:text-4xl"
                            : "text-2xl"
                        }`}
                      >
                        {project.title}
                      </h3>

                      <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition-all duration-200 group-hover:border-[var(--accent)]/40 group-hover:text-[var(--accent)] sm:flex">
                        ↗
                      </span>
                    </div>

                    {project.description && (
                      <p
                        className={`mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] ${
                          isFeatured ? "sm:text-base sm:leading-8" : ""
                        }`}
                      >
                        {project.description}
                      </p>
                    )}

                    {skills.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <span
                            key={`${project.id}-${skill}`}
                            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)] transition-colors hover:border-[var(--accent)]/30 hover:text-[var(--accent)]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-[var(--foreground)] px-5 py-3 text-xs font-bold text-[var(--background)] shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                        >
                          VIEW PROJECT ↗
                        </a>
                      )}

                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-3 text-xs font-bold text-[var(--foreground)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]"
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
          <div className="mt-14 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-10 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--accent)]">
              +
            </div>

            <p className="mt-4 text-sm font-semibold text-[var(--muted)]">
              No projects have been added yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
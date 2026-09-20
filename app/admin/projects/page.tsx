import Link from "next/link";
import DeleteProjectButton from "@/components/admin/DeleteProjectButton";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";


export default async function AdminProjectsPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc(
    "is_admin"
  );

  if (adminError || !isAdmin) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

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
      created_at,
      project_types (
        id,
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (projectsError) {
    throw new Error(projectsError.message);
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-5 py-8 text-[var(--foreground)] transition-colors duration-300 sm:px-8 sm:py-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Back */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
          >
            <span className="text-base">←</span>
            Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <header className="mb-10 border-b border-[var(--border)] pb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-black text-[var(--foreground)]">
              AS
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                Portfolio CMS
              </p>

              <p className="text-xs text-[var(--muted)]">
                Projects Management
              </p>
            </div>
          </div>

          <h1 className="mt-8 text-3xl font-black tracking-tight text-[var(--foreground)] sm:text-4xl">
            Projects Management
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Add, edit and manage the projects displayed on your public
            portfolio.
          </p>
        </header>

        {/* Projects Summary */}
        <section className="mb-8 flex flex-col gap-6 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl shadow-black/5 dark:shadow-black/20 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
              Portfolio Projects
            </p>

            <h2 className="mt-2 text-xl font-black tracking-tight text-[var(--foreground)]">
              Manage Your Work
            </h2>

            <p className="mt-2 text-sm text-[var(--muted)]">
              {projects?.length ?? 0} project
              {(projects?.length ?? 0) === 1 ? "" : "s"} currently in your
              portfolio.
            </p>
          </div>

          <Link
            href="/admin/projects/new"
            className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-[var(--foreground)] px-5 py-3.5 text-sm font-bold text-[var(--background)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg hover:shadow-black/10"
          >
            + Add Project
          </Link>
        </section>

        {/* Project List */}
        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-2xl shadow-black/5 dark:shadow-black/20 sm:p-7">
          <div className="mb-6 border-b border-[var(--border)] pb-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
              Your Projects
            </p>

            <h2 className="mt-2 text-lg font-black tracking-tight text-[var(--foreground)]">
              Project Library
            </h2>
          </div>

          {projects && projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project) => {
                const projectType = Array.isArray(project.project_types)
                  ? project.project_types[0]
                  : project.project_types;

                return (
                  <article
                    key={project.id}
                    className="group rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)] p-5 transition-all duration-200 hover:border-[var(--accent)]/30 hover:bg-[var(--surface)] sm:p-6"
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        {/* Title */}
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-lg font-black tracking-tight text-[var(--foreground)]">
                            {project.title}
                          </h3>

                          {project.featured && (
                            <span className="rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--accent)]">
                              Featured
                            </span>
                          )}
                        </div>

                        {/* Type */}
                        {projectType?.name && (
                          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                            {projectType.name}
                          </p>
                        )}

                        {/* Description */}
                        {project.description && (
                          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">
                            {project.description}
                          </p>
                        )}

                        {/* Project Assets */}
                        <div className="mt-5 flex flex-wrap gap-2">
                          {project.live_url && (
                            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-emerald-600 dark:text-emerald-400">
                              Live URL ✓
                            </span>
                          )}

                          {project.github_url && (
                            <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)]">
                              GitHub URL ✓
                            </span>
                          )}

                          {project.image && (
                            <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)]">
                              Project Image ✓
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 gap-2">
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-xs font-bold text-[var(--foreground)] transition-all duration-200 hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
                        >
                          Edit
                        </Link>

                        <DeleteProjectButton projectId={project.id} />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-[var(--border)] px-6 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-xl text-[var(--accent)]">
                +
              </div>

              <h3 className="mt-5 text-lg font-black text-[var(--foreground)]">
                No projects found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
                Add your first project to start building your portfolio.
              </p>

              <Link
                href="/admin/projects/new"
                className="mt-6 inline-flex rounded-xl bg-[var(--foreground)] px-5 py-3 text-xs font-bold text-[var(--background)] transition hover:opacity-90"
              >
                + Add First Project
              </Link>
            </div>
          )}
        </section>

        {/* Info */}
        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4">
          <p className="text-xs leading-6 text-[var(--muted)]">
            Featured projects receive larger visual treatment on the public
            portfolio.
          </p>
        </div>
      </div>
    </main>
  );
}
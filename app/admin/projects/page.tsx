import Link from "next/link";
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
    <main className="min-h-screen bg-[var(--background)] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <header className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Admin Panel
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Projects Management
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Add, edit and manage the projects displayed on your portfolio.
          </p>
        </header>

        <section className="mb-8 flex flex-col gap-5 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">
              Portfolio Projects
            </p>

            <h2 className="mt-2 text-xl font-semibold">
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
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition hover:-translate-y-0.5"
          >
            + Add Project
          </Link>
        </section>

        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
          {projects && projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project) => {
                const projectType = Array.isArray(project.project_types)
                  ? project.project_types[0]
                  : project.project_types;

                return (
                  <div
                    key={project.id}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold">
                            {project.title}
                          </h3>

                          {project.featured && (
                            <span className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-2.5 py-1 text-xs font-medium text-[var(--accent)]">
                              Featured
                            </span>
                          )}
                        </div>

                        {projectType?.name && (
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                            {projectType.name}
                          </p>
                        )}

                        {project.description && (
                          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                            {project.description}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-4 text-xs text-[var(--muted)]">
                          {project.live_url && (
                            <span>Live URL ✓</span>
                          )}

                          {project.github_url && (
                            <span>GitHub URL ✓</span>
                          )}

                          {project.image && (
                            <span>Project Image ✓</span>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-xs font-semibold transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          disabled
                          className="rounded-lg border border-red-500/30 px-4 py-2.5 text-xs font-semibold text-red-500 opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--border)] p-8 text-center">
              <h3 className="text-lg font-semibold">
                No projects found
              </h3>

              <p className="mt-2 text-sm text-[var(--muted)]">
                Add your first project to start building your portfolio.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
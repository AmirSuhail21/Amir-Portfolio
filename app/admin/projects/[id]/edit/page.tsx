import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import ProjectEditForm from "@/components/admin/ProjectEditForm";

type EditProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: isAdmin, error: adminError } =
    await supabase.rpc("is_admin");

  if (adminError || !isAdmin) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  const { data: project, error: projectError } =
    await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();

  if (projectError) {
    throw new Error(projectError.message);
  }

  if (!project) {
    notFound();
  }

  const { data: projectTypes, error: typesError } =
    await supabase
      .from("project_types")
      .select("id, name")
      .order("name", { ascending: true });

  if (typesError) {
    throw new Error(typesError.message);
  }

  const { data: skills, error: skillsError } =
    await supabase
      .from("skills")
      .select("id, name, category")
      .order("category", { ascending: true })
      .order("name", { ascending: true });

  if (skillsError) {
    throw new Error(skillsError.message);
  }

  const {
    data: projectSkillRows,
    error: projectSkillsError,
  } = await supabase
    .from("project_skills")
    .select("skill_id")
    .eq("project_id", id);

  if (projectSkillsError) {
    throw new Error(projectSkillsError.message);
  }

  const selectedSkillIds =
    projectSkillRows?.map((row) => row.skill_id) ?? [];

  return (
    <main className="min-h-screen bg-[var(--background)] px-5 py-8 text-[var(--foreground)] transition-colors duration-300 sm:px-8 sm:py-10 lg:px-12">
      <div className="mx-auto max-w-5xl">
        {/* Back */}
        <div className="mb-8">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
          >
            <span className="text-base">←</span>
            Back to Projects
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
                Project Management
              </p>
            </div>
          </div>

          <h1 className="mt-8 text-3xl font-black tracking-tight text-[var(--foreground)] sm:text-4xl">
            Edit Project
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Update project information, image, links, category and
            technologies used.
          </p>
        </header>

        {/* Form Card */}
        <section className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-2xl shadow-black/5 dark:shadow-black/20">
          <div className="border-b border-[var(--border)] px-6 py-6 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
              Project Editor
            </p>

            <h2 className="mt-2 text-xl font-black tracking-tight text-[var(--foreground)]">
              Project Details
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Modify the project details and keep its selected global
              skills synchronized.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <ProjectEditForm
              project={project}
              projectTypes={projectTypes ?? []}
              skills={skills ?? []}
              selectedSkillIds={selectedSkillIds}
            />
          </div>
        </section>

        {/* Info */}
        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4">
          <p className="text-xs leading-6 text-[var(--muted)]">
            Project technologies are linked to your global Skills
            section. Changes here affect only this project&apos;s
            selected skills.
          </p>
        </div>
      </div>
    </main>
  );
}
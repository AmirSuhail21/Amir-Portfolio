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

  const { data: isAdmin, error: adminError } = await supabase.rpc(
    "is_admin"
  );

  if (adminError || !isAdmin) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  const { data: project, error: projectError } = await supabase
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

  const { data: projectTypes, error: typesError } = await supabase
    .from("project_types")
    .select("id, name")
    .order("name", { ascending: true });

  if (typesError) {
    throw new Error(typesError.message);
  }

  const { data: skills, error: skillsError } = await supabase
    .from("skills")
    .select("id, name, category")
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  if (skillsError) {
    throw new Error(skillsError.message);
  }

  const { data: projectSkillRows, error: projectSkillsError } =
    await supabase
      .from("project_skills")
      .select("skill_id")
      .eq("project_id", id);

  if (projectSkillsError) {
    throw new Error(projectSkillsError.message);
  }

  const selectedSkillIds =
    projectSkillRows?.map((row) => row.skill_id) ?? [];

  return (
    <main className="min-h-screen bg-[var(--background)] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <Link
            href="/admin/projects"
            className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]"
          >
            ← Back to Projects
          </Link>
        </div>

        <header className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Admin Panel
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Edit Project
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Update project information, links, image and technologies.
          </p>
        </header>

        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
          <ProjectEditForm
            project={project}
            projectTypes={projectTypes ?? []}
            skills={skills ?? []}
            selectedSkillIds={selectedSkillIds}
          />
        </section>
      </div>
    </main>
  );
}
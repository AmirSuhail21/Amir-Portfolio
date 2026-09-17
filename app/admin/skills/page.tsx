import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import SkillsManager from "@/components/admin/SkillsManager";

export default async function AdminSkillsPage() {
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

  const { data: skills, error: skillsError } = await supabase
    .from("skills")
    .select("*")
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  if (skillsError) {
    throw new Error(skillsError.message);
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
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
            Skills Management
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Add, edit and manage the technologies used across your portfolio.
          </p>
        </header>

        <SkillsManager skills={skills ?? []} />
      </div>
    </main>
  );
}
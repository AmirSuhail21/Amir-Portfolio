import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import ExperienceManager from "@/components/admin/ExperienceManager";

export default async function AdminExperiencePage() {
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

  const { data: experience, error: experienceError } = await supabase
    .from("experience")
    .select("*")
    .order("period", { ascending: false });

  console.log("EXPERIENCE DATA:", experience);
  console.log("EXPERIENCE ERROR:", experienceError);

  if (experienceError) {
    throw new Error(experienceError.message);
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
            Experience Management
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Add, edit and manage your professional experience.
          </p>
        </header>

        <ExperienceManager experience={experience ?? []} />
      </div>
    </main>
  );
}
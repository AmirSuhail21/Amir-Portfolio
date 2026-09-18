import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import EducationManager from "@/components/admin/EducationManager";

export default async function AdminEducationPage() {
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

  const { data: education, error: educationError } = await supabase
    .from("education")
    .select("*")
    .order("period", { ascending: false });

  if (educationError) {
    throw new Error(educationError.message);
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-5 py-8 text-[var(--foreground)] transition-colors duration-300 sm:px-8 sm:py-10 lg:px-12">
      <div className="mx-auto max-w-6xl">
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
                Academic Management
              </p>
            </div>
          </div>

          <h1 className="mt-8 text-3xl font-black tracking-tight text-[var(--foreground)] sm:text-4xl">
            Education Management
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Add, edit and manage your academic background displayed on
            your public portfolio.
          </p>
        </header>

        {/* Education Manager */}
        <section className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-2xl shadow-black/5 dark:shadow-black/20">
          <div className="border-b border-[var(--border)] px-6 py-6 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
              Academic History
            </p>

            <h2 className="mt-2 text-xl font-black tracking-tight text-[var(--foreground)]">
              Education Records
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Manage the education entries shown in your portfolio.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <EducationManager education={education ?? []} />
          </div>
        </section>

        {/* Info */}
        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4">
          <p className="text-xs leading-6 text-[var(--muted)]">
            Changes made here are reflected in the public Education
            section of your portfolio.
          </p>
        </div>
      </div>
    </main>
  );
}
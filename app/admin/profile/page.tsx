import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import ProfileForm from "@/components/admin/ProfileForm";

export default async function AdminProfilePage() {
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

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
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
            Profile Management
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Manage the information displayed on your public portfolio.
          </p>
        </header>

        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold">
              Profile Information
            </h2>

            <p className="mt-2 text-sm text-[var(--muted)]">
              Your profile information can be changed anytime from the admin
              dashboard.
            </p>
          </div>

          <ProfileForm profile={profile} />
        </section>
      </div>
    </main>
  );
}
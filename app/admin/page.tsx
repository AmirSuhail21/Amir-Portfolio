import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import LogoutButton from "@/components/admin/LogoutButton";
import Link from "next/link";

export default async function AdminDashboardPage() {
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

  return (
    <main className="min-h-screen bg-[var(--background)] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-10 flex flex-col gap-5 border-b border-[var(--border)] pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Admin Panel
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Portfolio Dashboard
            </h1>

            <p className="mt-2 text-sm text-[var(--muted)]">
              Manage your portfolio content from one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 sm:block">
              <p className="text-xs text-[var(--muted)]">
                Signed in as
              </p>

              <p className="mt-1 max-w-xs break-all text-sm font-medium">
                {user.email}
              </p>
            </div>

            <LogoutButton />
          </div>
        </header>

        {/* Dashboard Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/profile">
            <DashboardCard
              title="Profile"
              description="Update your name, role, bio, social links and profile photo."
            />
          </Link>

          <Link href="/admin/skills">
            <DashboardCard
              title="Skills"
              description="Add, edit or remove technologies from your global skills."
            />
          </Link>

          <Link href="/admin/projects">
            <DashboardCard
              title="Projects"
              description="Manage projects, images, URLs, categories and project skills."
            />
          </Link>

          <Link href="/admin/education">
            <DashboardCard
              title="Education"
              description="Add, edit or remove your academic background and education history."
            />
          </Link>

          <Link href="/admin/experience">
            <DashboardCard
              title="Experience"
              description="Add, edit or remove your professional experience and work history."
            />
          </Link>

          <DashboardCard
            title="Settings"
            description="Manage portfolio administration settings."
          />
        </div>

        {/* Authentication */}
        <div className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">
            Authentication
          </p>

          <h2 className="mt-3 text-xl font-semibold">
            Admin authentication is active.
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            You are authenticated and authorized as an
            administrator. Use the dashboard sections above to
            manage your portfolio content.
          </p>
        </div>
      </div>
    </main>
  );
}

function DashboardCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition hover:-translate-y-1 hover:border-[var(--accent)]/40">
      <h2 className="text-lg font-semibold">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
        {description}
      </p>
    </div>
  );
}
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import LogoutButton from "@/components/admin/LogoutButton";

const dashboardItems = [
  {
    title: "Profile",
    description:
      "Update your name, role, bio, social links and profile photo.",
    href: "/admin/profile",
    label: "Personal",
  },
  {
    title: "Skills",
    description:
      "Add, edit or remove technologies from your global skills.",
    href: "/admin/skills",
    label: "Technologies",
  },
  {
    title: "Projects",
    description:
      "Manage projects, images, URLs, categories and project skills.",
    href: "/admin/projects",
    label: "Portfolio",
  },
  {
    title: "Education",
    description:
      "Add, edit or remove your academic background and education history.",
    href: "/admin/education",
    label: "Academic",
  },
  {
    title: "Experience",
    description:
      "Add, edit or remove your professional experience and work history.",
    href: "/admin/experience",
    label: "Career",
  },
];

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
    <main className="relative min-h-screen overflow-hidden bg-[var(--background)] px-5 py-8 text-[var(--foreground)] transition-colors duration-300 sm:px-8 sm:py-10 lg:px-12">
      {/* Background Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[var(--accent)]/8 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-60 -left-40 h-[500px] w-[500px] rounded-full bg-[var(--accent)]/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-10 flex flex-col gap-7 border-b border-[var(--border)] pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-black text-[var(--foreground)] shadow-lg shadow-black/5">
                AS
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                  Portfolio CMS
                </p>

                <p className="mt-0.5 text-xs text-[var(--muted)]">
                  Admin Dashboard
                </p>
              </div>
            </div>

            <h1 className="mt-8 text-3xl font-black tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">
              Portfolio Dashboard
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--muted)]">
              Manage your portfolio content, projects and professional
              information from one secure place.
            </p>
          </div>

          {/* Account */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                Signed in as
              </p>

              <p className="mt-1 max-w-xs break-all text-sm font-medium text-[var(--foreground)]">
                {user.email}
              </p>
            </div>

            <LogoutButton />
          </div>
        </header>

        {/* Section Heading */}
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
            Manage Content
          </p>

          <h2 className="mt-2 text-xl font-black tracking-tight text-[var(--foreground)]">
            Portfolio Sections
          </h2>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Choose a section to manage your portfolio content.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {dashboardItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="block h-full"
            >
              <DashboardCard
                number={String(index + 1).padStart(2, "0")}
                title={item.title}
                description={item.description}
                label={item.label}
              />
            </Link>
          ))}

          {/* Settings */}
          <DashboardCard
            number="06"
            title="Settings"
            description="Additional portfolio administration settings."
            label="System"
            disabled
          />
        </div>

        {/* Authentication Status */}
        <section className="mt-8 overflow-hidden rounded-[2rem] border border-emerald-500/20 bg-emerald-500/5 p-6 shadow-xl shadow-black/5 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>

                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">
                  Authentication
                </p>
              </div>

              <h2 className="mt-4 text-lg font-black tracking-tight text-[var(--foreground)]">
                Admin authentication is active.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                You are authenticated and authorized as an administrator.
                Your portfolio management tools are available above.
              </p>
            </div>

            <div className="shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-600 dark:text-emerald-300">
              Secure Session
            </div>
          </div>
        </section>

        {/* Admin Footer */}
        <div className="mt-10 border-t border-[var(--border)] pt-6">
          <p className="text-xs text-[var(--muted)]">
            Amir Suhail Portfolio · Admin Panel
          </p>
        </div>
      </div>
    </main>
  );
}

function DashboardCard({
  number,
  title,
  description,
  label,
  disabled = false,
}: {
  number: string;
  title: string;
  description: string;
  label: string;
  disabled?: boolean;
}) {
  return (
    <div
      className={`group relative h-full overflow-hidden rounded-[2rem] border p-6 transition-all duration-300 sm:p-7 ${
        disabled
          ? "cursor-default border-[var(--border)] bg-[var(--surface)] opacity-50"
          : "border-[var(--border)] bg-[var(--card)] hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:bg-[var(--card)] hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/30"
      }`}
    >
      {!disabled && (
        <div
          aria-hidden="true"
          className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[var(--accent)]/7 blur-2xl transition-all duration-300 group-hover:bg-[var(--accent)]/12"
        />
      )}

      <div className="relative flex items-start justify-between gap-5">
        <span className="text-xs font-black tracking-[0.12em] text-[var(--accent)]">
          {number}
        </span>

        <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
          {label}
        </span>
      </div>

      <div className="relative mt-10">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-black tracking-tight text-[var(--foreground)]">
            {title}
          </h3>

          {!disabled && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition-all duration-200 group-hover:border-[var(--accent)]/40 group-hover:text-[var(--accent)]">
              ↗
            </span>
          )}
        </div>

        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
          {description}
        </p>
      </div>
    </div>
  );
}
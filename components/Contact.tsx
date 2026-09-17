import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function Contact() {
  const supabase = await createSupabaseServerClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("name, email, github, linkedin, instagram, location")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Contact profile fetch error:", error.message);
    return null;
  }

  if (!profile) {
    return null;
  }

  const contactLinks = [
    {
      label: "Email",
      value: profile.email,
      href: profile.email ? `mailto:${profile.email}` : null,
    },
    {
      label: "GitHub",
      value: profile.github,
      href: profile.github,
    },
    {
      label: "LinkedIn",
      value: profile.linkedin,
      href: profile.linkedin,
    },
    {
      label: "Instagram",
      value: profile.instagram,
      href: profile.instagram,
    },
  ].filter(
    (item): item is {
      label: string;
      value: string;
      href: string;
    } => Boolean(item.value && item.href)
  );

  return (
    <section
      id="contact"
      className="scroll-mt-24 border-t border-[var(--border)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Contact
            </p>

            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
              Let&apos;s build something useful.
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)]">
              Have a project idea, freelance opportunity or collaboration in
              mind? Feel free to get in touch.
            </p>

            {profile.location && (
              <p className="mt-6 text-sm font-medium text-[var(--muted)]">
                📍 {profile.location}
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
            <p className="text-sm font-semibold">
              Get in touch with {profile.name}
            </p>

            <div className="mt-6 space-y-3">
              {contactLinks.length > 0 ? (
                contactLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={
                      item.label === "Email"
                        ? undefined
                        : "_blank"
                    }
                    rel={
                      item.label === "Email"
                        ? undefined
                        : "noopener noreferrer"
                    }
                    className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 transition hover:-translate-y-0.5 hover:border-[var(--accent)]"
                  >
                    <span className="text-sm font-medium">
                      {item.label}
                    </span>

                    <span className="max-w-[65%] truncate text-right text-xs text-[var(--muted)]">
                      {item.value}
                    </span>
                  </a>
                ))
              ) : (
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                  <p className="text-sm text-[var(--muted)]">
                    Contact details will be available soon.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
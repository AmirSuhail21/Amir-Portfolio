import { createSupabaseServerClient } from "@/lib/supabase-server";
import { portfolioData } from "@/data/portfolio";

function EmailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.01c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.73-1.53-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18A10.9 10.9 0 0 1 12 6.2c.97 0 1.95.13 2.86.36 2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.07.78 2.16v3.2c0 .31.21.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M5.04 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 5.04 0ZM.5 8.1h4.91V23H.5V8.1Zm7.99 0h4.71v2.03h.07c.66-1.17 2.26-2.4 4.65-2.4 4.98 0 5.9 3.28 5.9 7.55V23h-4.91v-6.86c0-1.64-.03-3.75-2.29-3.75-2.29 0-2.64 1.79-2.64 3.63V23H8.49V8.1Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle
        cx="17.4"
        cy="6.7"
        r="1"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.45L4 20l.9-3.75A8.5 8.5 0 1 1 20.5 11.7Z" />
      <path d="M8.5 8.3c.2-.45.4-.46.75-.47h.5c.2 0 .4.08.52.38l.72 1.7c.1.23.08.42-.08.62l-.48.6c-.1.13-.2.27-.08.5.13.25.58.96 1.25 1.55.84.75 1.55.98 1.8 1.1.25.12.4.1.55-.08l.7-.82c.16-.2.34-.17.57-.08l1.55.74c.24.12.4.18.46.29.06.1.06.62-.15 1.2-.2.57-1.04 1.05-1.43 1.1-.37.05-.84.07-1.35-.1-.31-.1-.7-.23-1.2-.45-2.1-.9-3.47-3.1-3.9-3.66-.43-.56-1.03-1.37-1.03-2.62 0-1.24.64-1.85.87-2.1Z" />
    </svg>
  );
}

const iconMap: Record<string, React.ReactNode> = {
  Email: <EmailIcon />,
  GitHub: <GithubIcon />,
  LinkedIn: <LinkedinIcon />,
  Instagram: <InstagramIcon />,
  WhatsApp: <WhatsappIcon />,
};

export default async function Contact() {
  const supabase = await createSupabaseServerClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("name, location")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Contact profile fetch error:", error.message);
    return null;
  }

  if (!profile) {
    return null;
  }

  const { socialLinks } = portfolioData.profile;

  const contactLinks = [
    {
      label: "Email",
      value: socialLinks.email,
      href: `mailto:${socialLinks.email}`,
    },
    {
      label: "GitHub",
      value: "github.com/AmirSuhail21",
      href: socialLinks.github,
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/amir-suhail-13a776338",
      href: socialLinks.linkedin,
    },
    {
      label: "Instagram",
      value: "instagram.com/amir_suhail_2.1_",
      href: socialLinks.instagram,
    },
    {
      label: "WhatsApp",
      value: "Chat on WhatsApp",
      href: socialLinks.whatsapp,
    },
  ];

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden border-t border-[var(--border)] py-24 sm:py-32"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Left */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[var(--accent)]" />

              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
                Contact
              </p>
            </div>

            <h2 className="mt-5 max-w-2xl text-4xl font-black tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Let&apos;s build something{" "}
              <span className="text-[var(--accent)]">useful.</span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              Have a project idea, freelance opportunity or collaboration in
              mind? Feel free to get in touch and let&apos;s discuss it.
            </p>

            {profile.location && (
              <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-[var(--muted)]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)]">
                  ◉
                </span>

                {profile.location}
              </div>
            )}
          </div>

          {/* Right */}
          <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
            <div className="border-b border-[var(--border)] pb-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
                Get in touch
              </p>

              <h3 className="mt-2 text-xl font-black tracking-tight">
                Connect with {profile.name}
              </h3>
            </div>

            <div className="mt-5 space-y-3">
              {contactLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.label === "Email" ? undefined : "_blank"}
                  rel={
                    item.label === "Email"
                      ? undefined
                      : "noopener noreferrer"
                  }
                  className="group flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:bg-[var(--card)]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--card)] text-[var(--muted)] transition-colors duration-200 group-hover:text-[var(--accent)]">
                    {iconMap[item.label]}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-[var(--foreground)]">
                      {item.label}
                    </span>

                    <span className="mt-1 block truncate text-xs text-[var(--muted)]">
                      {item.value}
                    </span>
                  </span>

                  <span className="text-lg text-[var(--muted)] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold">
                Have an idea worth building?
              </p>

              <p className="mt-1 text-sm text-[var(--muted)]">
                I&apos;m open to freelance projects and meaningful
                collaborations.
              </p>
            </div>

            <a
              href={`mailto:${socialLinks.email}`}
              className="w-fit rounded-full bg-[var(--foreground)] px-5 py-3 text-xs font-bold text-[var(--background)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              SEND AN EMAIL ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
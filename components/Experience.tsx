import { createSupabaseServerClient } from "@/lib/supabase-server";

type ExperienceItem = {
  id: string;
  period: string;
  title: string;
  company: string | null;
  description: string | null;
};

export default async function Experience() {
  const supabase = await createSupabaseServerClient();

  const { data: experience, error } = await supabase
    .from("experience")
    .select("id, period, title, company, description, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Experience fetch error:", error.message);
    return null;
  }

  const items = (experience ?? []) as ExperienceItem[];

  return (
    <section
      id="experience"
      className="relative scroll-mt-24 overflow-hidden border-t border-[var(--border)] py-24 sm:py-32"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-20 h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[var(--accent)]" />

            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
              Experience
            </p>
          </div>

          <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            My professional{" "}
            <span className="text-[var(--accent)]">journey.</span>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            A timeline of the work, projects and experiences that continue to
            shape my development as a web developer.
          </p>
        </div>

        {/* Timeline */}
        {items.length > 0 ? (
          <div className="relative mt-14">
            {/* Timeline line */}
            <div
              aria-hidden="true"
              className="absolute bottom-5 left-[19px] top-5 hidden w-px bg-[var(--border)] sm:block"
            />

            <div className="space-y-6">
              {items.map((item, index) => (
                <article
                  key={item.id}
                  className="group relative sm:pl-14"
                >
                  {/* Timeline dot */}
                  <span className="absolute left-2.5 top-8 hidden h-4 w-4 rounded-full border-2 border-[var(--accent)] bg-[var(--background)] shadow-[0_0_0_5px_var(--background)] sm:block" />

                  <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/35 hover:shadow-lg sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="max-w-3xl">
                        <div className="mb-3 flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <span className="h-px w-5 bg-[var(--border)]" />
                        </div>

                        <h3 className="text-xl font-black tracking-tight sm:text-2xl">
                          {item.title}
                        </h3>

                        {item.company && (
                          <p className="mt-2 text-sm font-semibold text-[var(--accent)]">
                            {item.company}
                          </p>
                        )}
                      </div>

                      <span className="w-fit shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-xs font-bold text-[var(--muted)]">
                        {item.period}
                      </span>
                    </div>

                    {item.description && (
                      <p className="mt-6 max-w-3xl text-sm leading-7 text-[var(--muted)]">
                        {item.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-14 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-10 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--accent)]">
              +
            </div>

            <p className="mt-4 text-sm font-semibold text-[var(--muted)]">
              Experience details will be added soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
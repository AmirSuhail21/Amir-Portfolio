import { createSupabaseServerClient } from "@/lib/supabase-server";

type EducationItem = {
  id: string;
  period: string;
  title: string;
  institution: string | null;
  description: string | null;
};

export default async function Education() {
  const supabase = await createSupabaseServerClient();

  const { data: education, error } = await supabase
    .from("education")
    .select("id, period, title, institution, description")
    .order("period", { ascending: false });

  if (error) {
    console.error("Education fetch error:", error.message);
    return null;
  }

  const items = (education ?? []) as EducationItem[];

  return (
    <section
      id="education"
      className="scroll-mt-24 border-t border-[var(--border)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Education
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            My learning journey.
          </h2>

          <p className="mt-4 text-base leading-8 text-[var(--muted)]">
            My academic background and learning milestones.
          </p>
        </div>

        {items.length > 0 ? (
          <div className="relative mt-12">
            <div className="absolute bottom-0 left-[7px] top-0 hidden w-px bg-[var(--border)] sm:block" />

            <div className="space-y-8">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="relative sm:pl-10"
                >
                  <span className="absolute left-0 top-2 hidden h-4 w-4 rounded-full border-2 border-[var(--accent)] bg-[var(--background)] sm:block" />

                  <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {item.title}
                        </h3>

                        {item.institution && (
                          <p className="mt-2 text-sm font-medium text-[var(--accent)]">
                            {item.institution}
                          </p>
                        )}
                      </div>

                      <span className="w-fit rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
                        {item.period}
                      </span>
                    </div>

                    {item.description && (
                      <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
                        {item.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-12 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
            <p className="text-sm text-[var(--muted)]">
              Education details will be added soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
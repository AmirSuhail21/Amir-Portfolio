"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type ExperienceItem = {
  id: string;
  period: string;
  title: string;
  company: string | null;
  description: string | null;
};

type Props = {
  experience: ExperienceItem[];
};

export default function ExperienceManager({ experience }: Props) {
  const router = useRouter();

  const [period, setPeriod] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setPeriod("");
    setTitle("");
    setCompany("");
    setDescription("");
    setEditingId(null);
  }

  function startEdit(item: ExperienceItem) {
    setEditingId(item.id);
    setPeriod(item.period);
    setTitle(item.title);
    setCompany(item.company ?? "");
    setDescription(item.description ?? "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!period.trim() || !title.trim()) {
      alert("Period and title are required.");
      return;
    }

    setLoading(true);

    const payload = {
      period: period.trim(),
      title: title.trim(),
      company: company.trim() || null,
      description: description.trim() || null,
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      const { error } = await supabase
        .from("experience")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      alert("Experience updated successfully.");
    } else {
      const { error } = await supabase.from("experience").insert(payload);

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      alert("Experience added successfully.");
    }

    resetForm();
    setLoading(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this experience?"
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("experience")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    alert("Experience deleted successfully.");

    setLoading(false);
    router.refresh();
  }

  return (
    <div className="space-y-10">
      {/* Form */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
        <div className="mb-7">
          <h2 className="text-xl font-semibold">
            {editingId ? "Edit Experience" : "Add Experience"}
          </h2>

          <p className="mt-2 text-sm text-[var(--muted)]">
            {editingId
              ? "Update the selected experience."
              : "Add a new professional experience to your portfolio."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Period */}
            <div>
              <label
                htmlFor="period"
                className="mb-2 block text-sm font-medium"
              >
                Period
              </label>

              <input
                id="period"
                type="text"
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
                placeholder="2025 - Present"
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
              />
            </div>

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium"
              >
                Role / Title
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Full-Stack Web Developer"
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <label
              htmlFor="company"
              className="mb-2 block text-sm font-medium"
            >
              Company / Organization
            </label>

            <input
              id="company"
              type="text"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder="Company name"
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium"
            >
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe your responsibilities, work and achievements..."
              rows={5}
              className="w-full resize-y rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm leading-6 outline-none transition focus:border-[var(--accent)]"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-[var(--background)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : editingId
                  ? "Update Experience"
                  : "Add Experience"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="rounded-full border border-[var(--border)] px-6 py-3 text-sm font-semibold transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Existing Experience */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Saved Experience</h2>

          <p className="mt-2 text-sm text-[var(--muted)]">
            {experience.length}{" "}
            {experience.length === 1 ? "experience" : "experiences"} saved.
          </p>
        </div>

        {experience.length > 0 ? (
          <div className="space-y-5">
            {experience.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <span className="inline-flex rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
                      {item.period}
                    </span>

                    <h3 className="mt-4 text-xl font-semibold">
                      {item.title}
                    </h3>

                    {item.company && (
                      <p className="mt-2 text-sm font-medium text-[var(--accent)]">
                        {item.company}
                      </p>
                    )}

                    {item.description && (
                      <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)]">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      disabled={loading}
                      className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={loading}
                      className="rounded-full border border-red-500/30 px-4 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-500/10 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
            <p className="text-sm text-[var(--muted)]">
              No experience has been added yet.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
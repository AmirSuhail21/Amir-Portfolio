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
      const { error } = await supabase
        .from("experience")
        .insert(payload);

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
      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl shadow-black/5 dark:shadow-black/20 sm:p-8">
        <div className="mb-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
            {editingId ? "Edit Experience" : "Add Experience"}
          </p>

          <h2 className="mt-2 text-xl font-black tracking-tight text-[var(--foreground)]">
            {editingId
              ? "Update professional information"
              : "Add professional information"}
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Keep your professional experience updated for the public
            portfolio.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Period */}
            <FormField
              id="experience-period"
              label="Period"
              value={period}
              onChange={setPeriod}
              placeholder="2025 - Present"
              required
            />

            {/* Title */}
            <FormField
              id="experience-title"
              label="Role / Title"
              value={title}
              onChange={setTitle}
              placeholder="Full-Stack Web Developer"
              required
            />
          </div>

          {/* Company */}
          <FormField
            id="experience-company"
            label="Company / Organization"
            value={company}
            onChange={setCompany}
            placeholder="Company name"
          />

          {/* Description */}
          <div>
            <label
              htmlFor="experience-description"
              className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]"
            >
              Description
            </label>

            <textarea
              id="experience-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe your responsibilities, work and achievements..."
              rows={5}
              className="w-full resize-y rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-[var(--foreground)] px-6 py-3 text-sm font-bold text-[var(--background)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg hover:shadow-black/10 disabled:cursor-not-allowed disabled:opacity-50"
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
                className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-6 py-3 text-sm font-semibold text-[var(--muted)] transition-all duration-200 hover:border-[var(--accent)]/40 hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
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
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
            Saved Entries
          </p>

          <h2 className="mt-2 text-xl font-black tracking-tight text-[var(--foreground)]">
            Saved Experience
          </h2>

          <p className="mt-2 text-sm text-[var(--muted)]">
            {experience.length}{" "}
            {experience.length === 1 ? "experience" : "experiences"}{" "}
            saved.
          </p>
        </div>

        {experience.length > 0 ? (
          <div className="space-y-5">
            {experience.map((item) => (
              <article
                key={item.id}
                className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-200 hover:border-[var(--accent)]/30 hover:bg-[var(--background)] sm:p-8"
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <span className="inline-flex rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
                      {item.period}
                    </span>

                    <h3 className="mt-4 text-xl font-black tracking-tight text-[var(--foreground)]">
                      {item.title}
                    </h3>

                    {item.company && (
                      <p className="mt-2 text-sm font-semibold text-[var(--accent)]">
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
                      className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-xs font-bold text-[var(--foreground)] transition-all duration-200 hover:border-[var(--accent)]/40 hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={loading}
                      className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-xs font-bold text-red-600 transition-all duration-200 hover:bg-red-500/10 dark:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--background)] text-lg text-[var(--accent)]">
              +
            </div>

            <p className="mt-4 text-sm text-[var(--muted)]">
              No experience has been added yet.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function FormField({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]"
      >
        {label}
      </label>

      <input
        id={id}
        type="text"
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
      />
    </div>
  );
}
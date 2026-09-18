"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Education = {
  id: string;
  period: string;
  title: string;
  institution: string | null;
  description: string | null;
};

type EducationManagerProps = {
  education: Education[];
};

export default function EducationManager({
  education,
}: EducationManagerProps) {
  const router = useRouter();

  const [period, setPeriod] = useState("");
  const [title, setTitle] = useState("");
  const [institution, setInstitution] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function resetForm() {
    setPeriod("");
    setTitle("");
    setInstitution("");
    setDescription("");
    setEditingId(null);
  }

  function startEdit(item: Education) {
    setEditingId(item.id);
    setPeriod(item.period);
    setTitle(item.title);
    setInstitution(item.institution ?? "");
    setDescription(item.description ?? "");

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const cleanPeriod = period.trim();
    const cleanTitle = title.trim();
    const cleanInstitution = institution.trim();
    const cleanDescription = description.trim();

    if (!cleanPeriod) {
      setError("Period is required.");
      setLoading(false);
      return;
    }

    if (!cleanTitle) {
      setError("Education title is required.");
      setLoading(false);
      return;
    }

    try {
      if (editingId) {
        const { error: updateError } = await supabase
          .from("education")
          .update({
            period: cleanPeriod,
            title: cleanTitle,
            institution: cleanInstitution || null,
            description: cleanDescription || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId);

        if (updateError) {
          setError(updateError.message);
          setLoading(false);
          return;
        }

        setMessage("Education updated successfully.");
      } else {
        const { error: insertError } = await supabase
          .from("education")
          .insert({
            period: cleanPeriod,
            title: cleanTitle,
            institution: cleanInstitution || null,
            description: cleanDescription || null,
            updated_at: new Date().toISOString(),
          });

        if (insertError) {
          setError(insertError.message);
          setLoading(false);
          return;
        }

        setMessage("Education added successfully.");
      }

      resetForm();
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this education entry?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setMessage("");
    setError("");

    try {
      const { error: deleteError } = await supabase
        .from("education")
        .delete()
        .eq("id", id);

      if (deleteError) {
        setError(deleteError.message);
        setDeletingId(null);
        return;
      }

      if (editingId === id) {
        resetForm();
      }

      setMessage("Education deleted successfully.");
      router.refresh();
    } catch {
      setError("Could not delete education.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      {/* Success Message */}
      {message && (
        <div className="mb-6 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
          {message}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Education Form */}
      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl shadow-black/5 dark:shadow-black/20 sm:p-8">
        <div className="mb-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
            {editingId ? "Edit Education" : "Add Education"}
          </p>

          <h2 className="mt-2 text-xl font-black tracking-tight text-[var(--foreground)]">
            {editingId
              ? "Update academic information"
              : "Add academic information"}
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Keep your academic background updated for the public
            portfolio.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              label="Period"
              value={period}
              onChange={setPeriod}
              placeholder="2023 - 2026"
              required
            />

            <FormField
              label="Degree / Title"
              value={title}
              onChange={setTitle}
              placeholder="Bachelor of Computer Applications"
              required
            />

            <FormField
              label="Institution"
              value={institution}
              onChange={setInstitution}
              placeholder="University / College name"
            />

            <div className="sm:col-span-2">
              <label
                htmlFor="education-description"
                className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]"
              >
                Description
              </label>

              <textarea
                id="education-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Add a short description about this education..."
                rows={5}
                className="w-full resize-y rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-end gap-3">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-6 py-3 text-sm font-semibold text-[var(--muted)] transition-all duration-200 hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
              >
                Cancel Edit
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-[var(--foreground)] px-6 py-3 text-sm font-bold text-[var(--background)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg hover:shadow-black/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingId
                  ? "Update Education"
                  : "Add Education"}
            </button>
          </div>
        </form>
      </section>

      {/* Saved Entries */}
      <section className="mt-10">
        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
            Saved Entries
          </p>

          <h2 className="mt-2 text-xl font-black tracking-tight text-[var(--foreground)]">
            Education History
          </h2>
        </div>

        {education.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--background)] text-lg text-[var(--accent)]">
              +
            </div>

            <p className="mt-4 text-sm text-[var(--muted)]">
              No education entries have been added yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {education.map((item) => (
              <article
                key={item.id}
                className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-200 hover:border-[var(--accent)]/30 hover:bg-[var(--background)] sm:p-7"
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <span className="inline-flex rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
                      {item.period}
                    </span>

                    <h3 className="mt-4 text-xl font-black tracking-tight text-[var(--foreground)]">
                      {item.title}
                    </h3>

                    {item.institution && (
                      <p className="mt-2 text-sm font-medium text-[var(--muted)]">
                        {item.institution}
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
                      className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-xs font-bold text-[var(--foreground)] transition-all duration-200 hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-xs font-bold text-red-600 transition-all duration-200 hover:bg-red-500/10 dark:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === item.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  const inputId = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]"
      >
        {label}
      </label>

      <input
        id={inputId}
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
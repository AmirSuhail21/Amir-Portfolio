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
      {message && (
        <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">
            {editingId ? "Edit Education" : "Add Education"}
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            {editingId
              ? "Update academic information"
              : "Add academic information"}
          </h2>
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
                className="mb-2 block text-sm font-medium"
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
                className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-end gap-3">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-[var(--border)] px-6 py-3 text-sm font-semibold transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Cancel Edit
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-[var(--background)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
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

      <section className="mt-8">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">
            Saved Entries
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Education History
          </h2>
        </div>

        {education.length === 0 ? (
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
            <p className="text-sm text-[var(--muted)]">
              No education entries have been added yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {education.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-7"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <span className="inline-flex rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
                      {item.period}
                    </span>

                    <h3 className="mt-4 text-xl font-semibold">
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
                      className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-xs font-semibold transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="rounded-xl border border-red-500/30 px-4 py-2.5 text-xs font-semibold text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
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
  return (
    <div>
      <label
        htmlFor={label}
        className="mb-2 block text-sm font-medium"
      >
        {label}
      </label>

      <input
        id={label}
        type="text"
        value={value}
        required={required}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
      />
    </div>
  );
}
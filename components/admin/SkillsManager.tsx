"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Skill = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

type SkillsManagerProps = {
  skills: Skill[];
};

export default function SkillsManager({
  skills,
}: SkillsManagerProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function resetForm() {
    setName("");
    setCategory("");
    setDescription("");
    setEditingId(null);
  }

  function startEdit(skill: Skill) {
    setEditingId(skill.id);
    setName(skill.name);
    setCategory(skill.category);
    setDescription(skill.description ?? "");

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

    const cleanName = name.trim();
    const cleanCategory = category.trim();
    const cleanDescription = description.trim();

    if (!cleanName || !cleanCategory) {
      setError("Skill name and category are required.");
      setLoading(false);
      return;
    }

    if (editingId) {
      const { error: updateError } = await supabase
        .from("skills")
        .update({
          name: cleanName,
          category: cleanCategory,
          description: cleanDescription || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingId);

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      setMessage("Skill updated successfully.");
    } else {
      const { error: insertError } = await supabase
        .from("skills")
        .insert({
          name: cleanName,
          category: cleanCategory,
          description: cleanDescription || null,
        });

      if (insertError) {
        if (insertError.code === "23505") {
          setError("This skill already exists.");
        } else {
          setError(insertError.message);
        }

        setLoading(false);
        return;
      }

      setMessage("Skill added successfully.");
    }

    resetForm();
    setLoading(false);

    router.refresh();
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setMessage("");
    setError("");

    const { error: deleteError } = await supabase
      .from("skills")
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

    setMessage("Skill deleted successfully.");
    setDeletingId(null);

    router.refresh();
  }

  return (
    <div>
      {/* Form */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">
            {editingId ? "Edit Skill" : "Add Skill"}
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            {editingId
              ? "Update Technology"
              : "Add a New Technology"}
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Add technologies here once. They can then be assigned to
            multiple projects.
          </p>
        </div>

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

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="skill-name"
                className="mb-2 block text-sm font-medium"
              >
                Skill Name
              </label>

              <input
                id="skill-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Angular"
                required
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label
                htmlFor="skill-category"
                className="mb-2 block text-sm font-medium"
              >
                Category
              </label>

              <input
                id="skill-category"
                type="text"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                placeholder="Frontend"
                required
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="skill-description"
                className="mb-2 block text-sm font-medium"
              >
                Description
              </label>

              <textarea
                id="skill-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Short description about this technology..."
                rows={4}
                className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-[var(--background)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : editingId
                  ? "Update Skill"
                  : "Add Skill"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-[var(--border)] px-6 py-3 text-sm font-semibold transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Existing Skills */}
      <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">
            Global Skills
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Existing Skills
          </h2>

          <p className="mt-2 text-sm text-[var(--muted)]">
            {skills.length} skill{skills.length === 1 ? "" : "s"} in
            your portfolio.
          </p>
        </div>

        {skills.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] p-6 text-center text-sm text-[var(--muted)]">
            No skills added yet.
          </div>
        ) : (
          <div className="space-y-3">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">
                      {skill.name}
                    </h3>

                    <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--muted)]">
                      {skill.category}
                    </span>
                  </div>

                  {skill.description && (
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      {skill.description}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(skill)}
                    className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(skill.id)}
                    disabled={deletingId === skill.id}
                    className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === skill.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
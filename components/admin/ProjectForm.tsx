"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type ProjectType = {
  id: string;
  name: string;
};

type Skill = {
  id: string;
  name: string;
  category: string;
};

type ProjectFormProps = {
  projectTypes: ProjectType[];
  skills: Skill[];
};

export default function ProjectForm({
  projectTypes,
  skills,
}: ProjectFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [typeId, setTypeId] = useState("");
  const [description, setDescription] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [showNewType, setShowNewType] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [creatingType, setCreatingType] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function toggleSkill(skillId: string) {
    setSelectedSkills((current) =>
      current.includes(skillId)
        ? current.filter((id) => id !== skillId)
        : [...current, skillId]
    );
  }

  async function handleCreateType() {
    setMessage("");
    setError("");

    const cleanTypeName = newTypeName.trim();

    if (!cleanTypeName) {
      setError("Project type name is required.");
      return;
    }

    setCreatingType(true);

    try {
      /*
       * Check whether this project type already exists.
       */
      const { data: existingType, error: searchError } =
        await supabase
          .from("project_types")
          .select("id, name")
          .ilike("name", cleanTypeName)
          .maybeSingle();

      if (searchError) {
        setError(searchError.message);
        setCreatingType(false);
        return;
      }

      /*
       * If the type already exists, simply select it.
       */
      if (existingType) {
        setTypeId(existingType.id);
        setNewTypeName("");
        setShowNewType(false);
        setMessage(
          `"${existingType.name}" already exists and has been selected.`
        );
        setCreatingType(false);
        return;
      }

      /*
       * Create new project type.
       */
      const { data: newType, error: createError } =
        await supabase
          .from("project_types")
          .insert({
            name: cleanTypeName,
            updated_at: new Date().toISOString(),
          })
          .select("id, name")
          .single();

      if (createError) {
        setError(createError.message);
        setCreatingType(false);
        return;
      }

      /*
       * Automatically select the newly created type.
       */
      setTypeId(newType.id);
      setNewTypeName("");
      setShowNewType(false);

      setMessage(
        `"${newType.name}" created and selected successfully.`
      );

      setCreatingType(false);

      router.refresh();
    } catch {
      setError("Could not create project type.");
      setCreatingType(false);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    const cleanLiveUrl = liveUrl.trim();
    const cleanGithubUrl = githubUrl.trim();

    if (!cleanTitle) {
      setError("Project title is required.");
      setLoading(false);
      return;
    }

    if (!typeId) {
      setError("Please select a project type.");
      setLoading(false);
      return;
    }

    try {
      let imageUrl: string | null = null;

      /*
       * Upload project image first, if selected.
       */
      if (imageFile) {
        const fileExtension =
          imageFile.name.split(".").pop()?.toLowerCase() || "jpg";

        const filePath = `projects/project-${Date.now()}.${fileExtension}`;

        const { error: uploadError } = await supabase.storage
          .from("portfolio")
          .upload(filePath, imageFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: imageFile.type,
          });

        if (uploadError) {
          setError(uploadError.message);
          setLoading(false);
          return;
        }

        const {
          data: { publicUrl },
        } = supabase.storage
          .from("portfolio")
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      /*
       * Create project.
       */
      const { data: project, error: projectError } =
        await supabase
          .from("projects")
          .insert({
            title: cleanTitle,
            type_id: typeId,
            description: cleanDescription || null,
            image: imageUrl,
            live_url: cleanLiveUrl || null,
            github_url: cleanGithubUrl || null,
            featured,
          })
          .select("id")
          .single();

      if (projectError) {
        setError(projectError.message);
        setLoading(false);
        return;
      }

      /*
       * Save project ↔ skill relationships.
       */
      if (selectedSkills.length > 0) {
        const projectSkills = selectedSkills.map(
          (skillId) => ({
            project_id: project.id,
            skill_id: skillId,
          })
        );

        const { error: skillsError } = await supabase
          .from("project_skills")
          .insert(projectSkills);

        if (skillsError) {
          /*
           * Remove the project if skill relationship
           * creation fails.
           */
          await supabase
            .from("projects")
            .delete()
            .eq("id", project.id);

          setError(skillsError.message);
          setLoading(false);
          return;
        }
      }

      setMessage("Project added successfully.");

      setTitle("");
      setTypeId("");
      setDescription("");
      setLiveUrl("");
      setGithubUrl("");
      setFeatured(false);
      setSelectedSkills([]);
      setImageFile(null);

      router.refresh();

      setTimeout(() => {
        router.push("/admin/projects");
      }, 700);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Messages */}
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

      {/* Basic Information */}
      <div>
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">
            Project Information
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Basic Details
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Project Title */}
          <FormField
            label="Project Title"
            value={title}
            onChange={setTitle}
            placeholder="American Institute of English Language"
            required
          />

          {/* Project Type */}
          <div>
            <label
              htmlFor="project-type"
              className="mb-2 block text-sm font-medium"
            >
              Project Type
            </label>

            <select
              id="project-type"
              value={typeId}
              onChange={(event) =>
                setTypeId(event.target.value)
              }
              required
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
            >
              <option value="">
                Select project type
              </option>

              {projectTypes.map((type) => (
                <option
                  key={type.id}
                  value={type.id}
                >
                  {type.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                setShowNewType((current) => !current);
                setError("");
                setMessage("");
              }}
              className="mt-3 text-sm font-semibold text-[var(--accent)] transition hover:opacity-80"
            >
              {showNewType
                ? "− Cancel new type"
                : "+ Create new project type"}
            </button>

            {showNewType && (
              <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                  New Project Type
                </p>

                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    value={newTypeName}
                    onChange={(event) =>
                      setNewTypeName(event.target.value)
                    }
                    placeholder="e.g. REACT WEB APP"
                    className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
                  />

                  <button
                    type="button"
                    onClick={handleCreateType}
                    disabled={creatingType}
                    className="rounded-xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {creatingType
                      ? "Creating..."
                      : "Create & Select"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label
              htmlFor="project-description"
              className="mb-2 block text-sm font-medium"
            >
              Description
            </label>

            <textarea
              id="project-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Describe what you built, the purpose of the project and its main features..."
              rows={6}
              className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
            />
          </div>
        </div>
      </div>

      {/* Project Image */}
      <div className="mt-10 border-t border-[var(--border)] pt-10">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">
            Project Image
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Upload Project Screenshot
          </h2>

          <p className="mt-2 text-sm text-[var(--muted)]">
            JPG, PNG or WebP. Maximum size: 5 MB.
          </p>
        </div>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => {
            setImageFile(
              event.target.files?.[0] ?? null
            );
          }}
          className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--foreground)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--background)]"
        />

        {imageFile && (
          <p className="mt-3 text-xs text-[var(--muted)]">
            Selected: {imageFile.name}
          </p>
        )}
      </div>

      {/* URLs */}
      <div className="mt-10 border-t border-[var(--border)] pt-10">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">
            Project Links
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Live & Repository URLs
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Live Project URL"
            value={liveUrl}
            onChange={setLiveUrl}
            placeholder="https://example.com"
          />

          <FormField
            label="GitHub Repository URL"
            value={githubUrl}
            onChange={setGithubUrl}
            placeholder="https://github.com/username/project"
          />
        </div>
      </div>

      {/* Global Skills */}
      <div className="mt-10 border-t border-[var(--border)] pt-10">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">
            Technologies
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Select Global Skills
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Select the technologies used in this project.
            These come from your global Skills list.
          </p>
        </div>

        {skills.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] p-5 text-sm text-[var(--muted)]">
            No global skills available. Add skills from
            the Skills management page first.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => {
              const selected =
                selectedSkills.includes(skill.id);

              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() =>
                    toggleSkill(skill.id)
                  }
                  className={`rounded-xl border p-4 text-left transition ${
                    selected
                      ? "border-[var(--accent)] bg-[var(--accent)]/10"
                      : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--accent)]/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">
                        {skill.name}
                      </p>

                      <p className="mt-1 text-xs text-[var(--muted)]">
                        {skill.category}
                      </p>
                    </div>

                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs ${
                        selected
                          ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--background)]"
                          : "border-[var(--border)]"
                      }`}
                    >
                      {selected ? "✓" : ""}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Featured */}
      <div className="mt-10 border-t border-[var(--border)] pt-10">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={featured}
            onChange={(event) =>
              setFeatured(event.target.checked)
            }
            className="mt-1 h-4 w-4 accent-[var(--accent)]"
          />

          <span>
            <span className="block text-sm font-semibold">
              Featured Project
            </span>

            <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">
              Mark this project as featured on the
              portfolio.
            </span>
          </span>
        </label>
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-wrap justify-end gap-3 border-t border-[var(--border)] pt-8">
        <button
          type="button"
          onClick={() =>
            router.push("/admin/projects")
          }
          className="rounded-xl border border-[var(--border)] px-6 py-3 text-sm font-semibold transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-[var(--background)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Saving Project..."
            : "Save Project"}
        </button>
      </div>
    </form>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
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
        type={type}
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
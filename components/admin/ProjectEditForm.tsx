"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Project = {
  id: string;
  title: string;
  type_id: string | null;
  description: string | null;
  image: string | null;
  live_url: string | null;
  github_url: string | null;
  featured: boolean;
};

type ProjectType = {
  id: string;
  name: string;
};

type Skill = {
  id: string;
  name: string;
  category: string;
};

type ProjectEditFormProps = {
  project: Project;
  projectTypes: ProjectType[];
  skills: Skill[];
  selectedSkillIds: string[];
};

export default function ProjectEditForm({
  project,
  projectTypes,
  skills,
  selectedSkillIds,
}: ProjectEditFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(project.title);
  const [typeId, setTypeId] = useState(project.type_id ?? "");
  const [description, setDescription] = useState(
    project.description ?? ""
  );
  const [liveUrl, setLiveUrl] = useState(project.live_url ?? "");
  const [githubUrl, setGithubUrl] = useState(
    project.github_url ?? ""
  );
  const [featured, setFeatured] = useState(project.featured);

  const [selectedSkills, setSelectedSkills] =
    useState<string[]>(selectedSkillIds);

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [currentImage, setCurrentImage] = useState(
    project.image ?? ""
  );

  const [removeImage, setRemoveImage] = useState(false);

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

  function handleImageSelection(file: File | null) {
    setImageFile(file);

    if (file) {
      setRemoveImage(false);
    }
  }

  async function deleteStorageImage(imageUrl: string) {
    try {
      const marker = "/storage/v1/object/public/portfolio/";

      if (!imageUrl.includes(marker)) {
        return;
      }

      const filePath = decodeURIComponent(
        imageUrl.split(marker)[1]
      );

      if (!filePath) {
        return;
      }

      const { error: deleteError } = await supabase.storage
        .from("portfolio")
        .remove([filePath]);

      if (deleteError) {
        console.error(
          "Old project image delete failed:",
          deleteError.message
        );
      }
    } catch (storageError) {
      console.error(
        "Could not delete old project image:",
        storageError
      );
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
      const oldImageUrl = currentImage || null;

      let imageUrl = currentImage || null;

      if (removeImage && !imageFile) {
        imageUrl = null;
      }

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
          setError(`Image upload failed: ${uploadError.message}`);
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

      const { data: updatedProject, error: projectError } =
        await supabase
          .from("projects")
          .update({
            title: cleanTitle,
            type_id: typeId,
            description: cleanDescription || null,
            image: imageUrl,
            live_url: cleanLiveUrl || null,
            github_url: cleanGithubUrl || null,
            featured,
            updated_at: new Date().toISOString(),
          })
          .eq("id", project.id)
          .select()
          .single();

      if (projectError) {
        setError(
          `Project update failed: ${projectError.message}`
        );
        setLoading(false);
        return;
      }

      if (!updatedProject) {
        setError(
          "Project was not updated. No matching project was found."
        );
        setLoading(false);
        return;
      }

      const { error: deleteSkillsError } = await supabase
        .from("project_skills")
        .delete()
        .eq("project_id", project.id);

      if (deleteSkillsError) {
        setError(
          `Could not update project skills: ${deleteSkillsError.message}`
        );
        setLoading(false);
        return;
      }

      if (selectedSkills.length > 0) {
        const projectSkills = selectedSkills.map((skillId) => ({
          project_id: project.id,
          skill_id: skillId,
        }));

        const { error: insertSkillsError } = await supabase
          .from("project_skills")
          .insert(projectSkills);

        if (insertSkillsError) {
          setError(
            `Could not save project skills: ${insertSkillsError.message}`
          );
          setLoading(false);
          return;
        }
      }

      if (oldImageUrl && imageUrl !== oldImageUrl) {
        await deleteStorageImage(oldImageUrl);
      }

      setCurrentImage(imageUrl ?? "");
      setImageFile(null);
      setRemoveImage(false);

      setMessage("Project updated successfully.");

      setLoading(false);

      router.refresh();
    } catch (submitError) {
      console.error("Project update error:", submitError);

      setError(
        "Something went wrong while updating the project."
      );

      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Success Message */}
      {message && (
        <div className="mb-6 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-5 py-4 text-sm leading-6 text-emerald-700 dark:text-emerald-300">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold">
              ✓
            </span>

            <span>{message}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/25 bg-red-500/10 px-5 py-4 text-sm leading-6 text-red-600 dark:text-red-300">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-xs font-bold">
              !
            </span>

            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Basic Information */}
      <div>
        <SectionHeading
          eyebrow="Project Information"
          title="Basic Details"
          description="Update the project's name, category and description."
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Project Title"
            value={title}
            onChange={setTitle}
            placeholder="Project title"
            required
          />

          <div>
            <label
              htmlFor="edit-project-type"
              className="mb-2.5 block text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]"
            >
              Project Type
            </label>

            <select
              id="edit-project-type"
              value={typeId}
              onChange={(event) =>
                setTypeId(event.target.value)
              }
              required
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
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
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="edit-project-description"
              className="mb-2.5 block text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]"
            >
              Description
            </label>

            <textarea
              id="edit-project-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Describe the project..."
              rows={6}
              className="w-full resize-y rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm leading-7 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
            />
          </div>
        </div>
      </div>

      {/* Project Image */}
      <div className="mt-12 border-t border-[var(--border)] pt-10">
        <SectionHeading
          eyebrow="Project Image"
          title="Project Screenshot"
          description="Keep the existing image, replace it with a new one, or remove it completely."
        />

        {/* Current Image */}
        {currentImage && !removeImage && (
          <div className="mb-6 overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)]">
            <div className="border-b border-[var(--border)] px-5 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                Current Image
              </p>
            </div>

            <div className="bg-[var(--background)] p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImage}
                alt={project.title}
                className="h-64 w-full rounded-[1rem] object-cover sm:h-80"
              />
            </div>
          </div>
        )}

        {/* Image Removed Preview */}
        {removeImage && !imageFile && (
          <div className="mb-6 rounded-[1.5rem] border border-dashed border-red-500/30 bg-red-500/5 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-300">
              ×
            </div>

            <p className="mt-4 text-sm font-semibold text-red-600 dark:text-red-300">
              Project image will be removed.
            </p>

            <p className="mt-2 text-xs leading-6 text-[var(--muted)]">
              Click Save Changes to permanently remove it from
              this project and storage.
            </p>
          </div>
        )}

        {/* Upload New Image */}
        <div>
          <label
            htmlFor="edit-project-image"
            className="mb-2.5 block text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]"
          >
            {currentImage && !removeImage
              ? "Replace Project Image"
              : "Upload Project Image"}
          </label>

          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--accent)]/40">
            <input
              id="edit-project-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                handleImageSelection(
                  event.target.files?.[0] ?? null
                );
              }}
              className="block w-full cursor-pointer text-sm text-[var(--muted)] file:mr-4 file:cursor-pointer file:rounded-xl file:border-0 file:bg-[var(--foreground)] file:px-4 file:py-2.5 file:text-xs file:font-bold file:text-[var(--background)] file:transition hover:file:opacity-90"
            />

            <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
              Supported formats: JPG, PNG and WebP.
            </p>
          </div>
        </div>

        {imageFile && (
          <div className="mt-4 rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-4 py-3">
            <p className="text-xs font-medium text-[var(--accent)]">
              New image selected
            </p>

            <p className="mt-1 truncate text-xs text-[var(--muted)]">
              {imageFile.name}
            </p>
          </div>
        )}

        {/* Remove Image */}
        {currentImage && (
          <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={removeImage}
                onChange={(event) => {
                  const checked = event.target.checked;

                  setRemoveImage(checked);

                  if (checked) {
                    setImageFile(null);

                    const fileInput =
                      document.getElementById(
                        "edit-project-image"
                      ) as HTMLInputElement | null;

                    if (fileInput) {
                      fileInput.value = "";
                    }
                  }
                }}
                className="mt-1 h-4 w-4 accent-red-500"
              />

              <span>
                <span className="block text-sm font-semibold text-red-600 dark:text-red-300">
                  Remove current image
                </span>

                <span className="mt-1 block text-xs leading-6 text-[var(--muted)]">
                  The image will be removed from this project and
                  deleted from storage when you save.
                </span>
              </span>
            </label>
          </div>
        )}
      </div>

      {/* URLs */}
      <div className="mt-12 border-t border-[var(--border)] pt-10">
        <SectionHeading
          eyebrow="Project Links"
          title="Live & Repository URLs"
          description="Add the public project URL and optional GitHub repository."
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Live Project URL"
            value={liveUrl}
            onChange={setLiveUrl}
            placeholder="https://example.com"
            type="url"
          />

          <FormField
            label="GitHub Repository URL"
            value={githubUrl}
            onChange={setGithubUrl}
            placeholder="https://github.com/username/project"
            type="url"
          />
        </div>
      </div>

      {/* Skills */}
      <div className="mt-12 border-t border-[var(--border)] pt-10">
        <SectionHeading
          eyebrow="Technologies"
          title="Project Skills"
          description="Select the global skills used to build this project."
        />

        {skills.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-sm text-[var(--muted)]">
            No global skills available.
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
                  className={`group rounded-2xl border p-4 text-left transition-all duration-200 ${
                    selected
                      ? "border-[var(--accent)]/40 bg-[var(--accent)]/10 shadow-lg shadow-black/5"
                      : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/30 hover:bg-[var(--background)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          selected
                            ? "text-[var(--accent)]"
                            : "text-[var(--foreground)]"
                        }`}
                      >
                        {skill.name}
                      </p>

                      <p className="mt-1 text-xs text-[var(--muted)]">
                        {skill.category}
                      </p>
                    </div>

                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs font-bold transition ${
                        selected
                          ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]"
                          : "border-[var(--border)] bg-[var(--background)] text-transparent group-hover:border-[var(--accent)]/30"
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

        {selectedSkills.length > 0 && (
          <p className="mt-4 text-xs text-[var(--muted)]">
            {selectedSkills.length} skill
            {selectedSkills.length === 1 ? "" : "s"} selected.
          </p>
        )}
      </div>

      {/* Featured */}
      <div className="mt-12 border-t border-[var(--border)] pt-10">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
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
              <span className="block text-sm font-semibold text-[var(--foreground)]">
                Featured Project
              </span>

              <span className="mt-1 block text-xs leading-6 text-[var(--muted)]">
                Mark this project as featured on the public
                portfolio. Featured projects receive larger
                presentation on the Projects section.
              </span>
            </span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-12 flex flex-wrap justify-end gap-3 border-t border-[var(--border)] pt-8">
        <button
          type="button"
          onClick={() =>
            router.push("/admin/projects")
          }
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3.5 text-sm font-semibold text-[var(--muted)] transition-all duration-200 hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-[var(--foreground)] px-6 py-3.5 text-sm font-bold text-[var(--background)] shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-xl font-black tracking-tight text-[var(--foreground)]">
        {title}
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
        {description}
      </p>
    </div>
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
        className="mb-2.5 block text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]"
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
        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
      />
    </div>
  );
}
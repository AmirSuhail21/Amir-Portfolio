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

      /*
       * If user selected Remove Image,
       * remove the image from the project.
       */
      if (removeImage && !imageFile) {
        imageUrl = null;
      }

      /*
       * Upload new image if selected.
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

      /*
       * Update project.
       */
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

      /*
       * Replace project skills.
       */
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

      /*
       * Delete old storage image if:
       *
       * 1. User removed the image, OR
       * 2. User uploaded a replacement image.
       *
       * We only delete the old file after the database
       * update has succeeded.
       */
      if (
        oldImageUrl &&
        imageUrl !== oldImageUrl
      ) {
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
        <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
          {message}
        </div>
      )}

      {/* Error Message */}
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
              className="mb-2 block text-sm font-medium"
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
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="edit-project-description"
              className="mb-2 block text-sm font-medium"
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
            Project Screenshot
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Keep the existing image, replace it with a new one,
            or remove it completely.
          </p>
        </div>

        {/* Current Image */}
        {currentImage && !removeImage && (
          <div className="mb-5 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImage}
              alt={project.title}
              className="h-56 w-full object-cover"
            />
          </div>
        )}

        {/* Image Removed Preview */}
        {removeImage && !imageFile && (
          <div className="mb-5 rounded-2xl border border-dashed border-red-500/40 bg-red-500/5 p-8 text-center">
            <p className="text-sm font-medium text-red-500">
              Project image will be removed.
            </p>

            <p className="mt-2 text-xs text-[var(--muted)]">
              Click Save Changes to permanently remove it.
            </p>
          </div>
        )}

        {/* Upload New Image */}
        <div>
          <label
            htmlFor="edit-project-image"
            className="mb-2 block text-sm font-medium"
          >
            {currentImage && !removeImage
              ? "Replace Project Image"
              : "Upload Project Image"}
          </label>

          <input
            id="edit-project-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => {
              handleImageSelection(
                event.target.files?.[0] ?? null
              );
            }}
            className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--foreground)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--background)]"
          />
        </div>

        {imageFile && (
          <p className="mt-3 text-xs text-[var(--muted)]">
            New image selected: {imageFile.name}
          </p>
        )}

        {/* Remove Image */}
        {currentImage && (
          <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={removeImage}
                onChange={(event) => {
                  const checked =
                    event.target.checked;

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
                <span className="block text-sm font-semibold text-red-500">
                  Remove current image
                </span>

                <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">
                  The image will be removed from this project
                  and deleted from storage when you save.
                </span>
              </span>
            </label>
          </div>
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

      {/* Skills */}
      <div className="mt-10 border-t border-[var(--border)] pt-10">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">
            Technologies
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Project Skills
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Select the global skills used for this project.
          </p>
        </div>

        {skills.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] p-5 text-sm text-[var(--muted)]">
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
              Mark this project as featured on the portfolio.
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
            ? "Saving Changes..."
            : "Save Changes"}
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
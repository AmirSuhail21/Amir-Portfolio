"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  name: string;
  role: string;
  short_role: string | null;
  bio: string | null;
  location: string | null;
  profile_image: string | null;
  resume_url: string | null;
  github: string | null;
  linkedin: string | null;
  instagram: string | null;
  email: string | null;
};

type ProfileFormProps = {
  profile: Profile | null;
};

export default function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();

  const [name, setName] = useState(profile?.name ?? "");
  const [role, setRole] = useState(profile?.role ?? "");
  const [shortRole, setShortRole] = useState(profile?.short_role ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [location, setLocation] = useState(profile?.location ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [github, setGithub] = useState(profile?.github ?? "");
  const [linkedin, setLinkedin] = useState(profile?.linkedin ?? "");
  const [instagram, setInstagram] = useState(profile?.instagram ?? "");
  const [resumeUrl, setResumeUrl] = useState(profile?.resume_url ?? "");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [uploadingResume, setUploadingResume] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleImageUpload() {
    if (!profile || !imageFile) {
      return;
    }

    setUploadingImage(true);
    setMessage("");
    setError("");

    const fileExtension =
      imageFile.name.split(".").pop()?.toLowerCase() || "jpg";

    const filePath = `profile/profile-${Date.now()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio")
      .upload(filePath, imageFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: imageFile.type,
      });

    if (uploadError) {
      setError(uploadError.message);
      setUploadingImage(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("portfolio").getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        profile_image: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (updateError) {
      setError(updateError.message);
      setUploadingImage(false);
      return;
    }

    setImageFile(null);
    setMessage("Profile photo updated successfully.");
    setUploadingImage(false);

    router.refresh();
  }


  async function handleResumeUpload() {
    if (!profile || !resumeFile) {
      return;
    }

    setUploadingResume(true);
    setMessage("");
    setError("");

    if (resumeFile.type !== "application/pdf") {
      setError("Please select a PDF file.");
      setUploadingResume(false);
      return;
    }

    if (resumeFile.size > 5 * 1024 * 1024) {
      setError("Resume PDF must be smaller than 5 MB.");
      setUploadingResume(false);
      return;
    }

    const filePath = `resume/resume-${Date.now()}.pdf`;

    // Upload new resume
    const { error: uploadError } = await supabase.storage
      .from("portfolio")
      .upload(filePath, resumeFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: "application/pdf",
      });

    if (uploadError) {
      setError(uploadError.message);
      setUploadingResume(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("portfolio")
      .getPublicUrl(filePath);

    // Save new resume URL
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        resume_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (updateError) {
      // If database update fails, remove the newly uploaded file
      await supabase.storage
        .from("portfolio")
        .remove([filePath]);

      setError(updateError.message);
      setUploadingResume(false);
      return;
    }

    // Delete previous resume from Storage
    if (resumeUrl) {
      try {
        const oldPath = new URL(resumeUrl).pathname.split(
          "/storage/v1/object/public/portfolio/"
        )[1];

        if (oldPath && oldPath !== filePath) {
          await supabase.storage
            .from("portfolio")
            .remove([oldPath]);
        }
      } catch {
        // New resume is already active, so don't block the update
      }
    }

    setResumeUrl(publicUrl);
    setResumeFile(null);
    setMessage("Resume replaced successfully.");
    setUploadingResume(false);

    router.refresh();
  }

  async function handleRemoveResume() {
    if (!profile || !resumeUrl) {
      return;
    }

    setMessage("");
    setError("");

    const confirmed = window.confirm(
      "Are you sure you want to remove your resume?"
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const resumePath = new URL(resumeUrl).pathname.split(
        "/storage/v1/object/public/portfolio/"
      )[1];

      if (resumePath) {
        const { error: deleteError } = await supabase.storage
          .from("portfolio")
          .remove([resumePath]);

        if (deleteError) {
          setError(deleteError.message);
          setLoading(false);
          return;
        }
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          resume_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      setResumeUrl("");
      setMessage("Resume removed successfully.");
    } catch {
      setError("Unable to remove the resume.");
    }

    setLoading(false);
    router.refresh();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!profile) {
      setError("Profile record not found.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        name,
        role,
        short_role: shortRole || null,
        bio: bio || null,
        location: location || null,
        email: email || null,
        github: github || null,
        linkedin: linkedin || null,
        instagram: instagram || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setMessage("Profile updated successfully.");
    setLoading(false);

    router.refresh();
  }

  if (!profile) {
    return (
      <div className="rounded-2xl border border-[var(--border)] p-5 text-sm text-[var(--muted)]">
        No profile data found.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
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

      {/* Profile Photo */}
      <div className="mb-10 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 sm:p-6">
        <div>
          <p className="text-sm font-semibold">Profile Photo</p>

          <p className="mt-1 text-xs text-[var(--muted)]">
            Upload JPG, PNG or WebP image. Maximum size: 5 MB.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--card)]">
            {profile.profile_image ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.profile_image}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </>
            ) : (
              <span className="text-2xl font-bold">AS</span>
            )}
          </div>

          <div className="flex-1">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                setImageFile(event.target.files?.[0] ?? null);
              }}
              className="block w-full text-sm text-[var(--muted)] file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[var(--foreground)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--background)]"
            />

            {imageFile && (
              <p className="mt-2 text-xs text-[var(--muted)]">
                Selected: {imageFile.name}
              </p>
            )}

            <button
              type="button"
              onClick={handleImageUpload}
              disabled={!imageFile || uploadingImage}
              className="mt-4 rounded-xl bg-[var(--foreground)] px-5 py-2.5 text-sm font-semibold text-[var(--background)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploadingImage ? "Uploading..." : "Upload Photo"}
            </button>
          </div>
        </div>
      </div>

      {/* Resume */}
      <div className="mb-10 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 sm:p-6">
        <div>
          <p className="text-sm font-semibold">Resume</p>

          <p className="mt-1 text-xs text-[var(--muted)]">
            Upload your resume as a PDF. Maximum size: 5 MB.
          </p>
        </div>

        <div className="mt-5">
          {resumeUrl && (
            <>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-4 inline-flex rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                View Current Resume ↗
              </a>

              <button
                type="button"
                onClick={handleRemoveResume}
                disabled={loading}
                className="ml-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:-translate-y-0.5 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Removing..." : "Remove Resume"}
              </button>
            </>
          )}

          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => {
              setResumeFile(event.target.files?.[0] ?? null);
            }}
            className="block w-full text-sm text-[var(--muted)] file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[var(--foreground)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--background)]"
          />

          {resumeFile && (
            <p className="mt-2 text-xs text-[var(--muted)]">
              Selected: {resumeFile.name}
            </p>
          )}

          <button
            type="button"
            onClick={handleResumeUpload}
            disabled={!resumeFile || uploadingResume}
            className="mt-4 rounded-xl bg-[var(--foreground)] px-5 py-2.5 text-sm font-semibold text-[var(--background)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploadingResume ? "Uploading..." : "Upload Resume"}
          </button>
        </div>
      </div>

      {/* Profile Information */}
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          label="Name"
          value={name}
          onChange={setName}
          placeholder="Your name"
          required
        />

        <FormField
          label="Role"
          value={role}
          onChange={setRole}
          placeholder="Full-Stack Web Developer"
          required
        />

        <FormField
          label="Short Role"
          value={shortRole}
          onChange={setShortRole}
          placeholder="Full-Stack Developer"
        />

        <FormField
          label="Location"
          value={location}
          onChange={setLocation}
          placeholder="India"
        />

        <FormField
          label="Email"
          value={email}
          onChange={setEmail}
          placeholder="hello@example.com"
          type="email"
        />

        <FormField
          label="GitHub URL"
          value={github}
          onChange={setGithub}
          placeholder="https://github.com/username"
        />

        <FormField
          label="LinkedIn URL"
          value={linkedin}
          onChange={setLinkedin}
          placeholder="https://linkedin.com/in/username"
        />

        <FormField
          label="Instagram URL"
          value={instagram}
          onChange={setInstagram}
          placeholder="https://instagram.com/username"
        />


        <div className="sm:col-span-2">
          <label
            htmlFor="bio"
            className="mb-2 block text-sm font-medium"
          >
            Bio
          </label>

          <textarea
            id="bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            placeholder="Write a short professional introduction..."
            rows={6}
            className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-[var(--background)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Profile"}
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
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
      />
    </div>
  );
}
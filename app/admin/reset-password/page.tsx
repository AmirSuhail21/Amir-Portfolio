"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function prepareResetSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError(
          "This password reset link is invalid or has expired. Please request a new one."
        );
      }

      setCheckingSession(false);
    }

    prepareResetSession();
  }, []);

  async function handleUpdatePassword(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "Your password has been updated successfully. Redirecting to login..."
    );

    await supabase.auth.signOut();

    setTimeout(() => {
      router.push("/admin/login");
    }, 1500);
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)] px-5 py-10 text-[var(--foreground)] transition-colors duration-300">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]/5 blur-3xl"
      />

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-lg font-black tracking-tight text-[var(--foreground)] shadow-2xl shadow-black/5 dark:shadow-black/20">
            AS
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
            Portfolio CMS
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-[var(--foreground)]">
            Reset Password
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Create a new password for your admin account.
          </p>
        </div>

        {/* Reset Card */}
        <form
          onSubmit={handleUpdatePassword}
          className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl shadow-black/5 backdrop-blur-xl dark:shadow-black/20 sm:p-8"
        >
          {/* Error */}
          {error && (
            <div className="mb-5 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-600 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Success */}
          {message && (
            <div className="mb-5 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm leading-6 text-emerald-600 dark:text-emerald-300">
              {message}
            </div>
          )}

          {/* New Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2.5 block text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]"
            >
              New Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter new password"
              disabled={
                checkingSession ||
                loading ||
                Boolean(error)
              }
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Confirm Password */}
          <div className="mt-5">
            <label
              htmlFor="confirmPassword"
              className="mb-2.5 block text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="Confirm new password"
              disabled={
                checkingSession ||
                loading ||
                Boolean(error)
              }
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={
              checkingSession ||
              loading ||
              Boolean(error)
            }
            className="mt-6 w-full rounded-2xl bg-[var(--foreground)] px-5 py-3.5 text-sm font-bold text-[var(--background)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg hover:shadow-black/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {checkingSession
              ? "Checking..."
              : loading
                ? "Updating..."
                : "Update Password"}
          </button>

          {/* Back */}
          <div className="mt-5 text-center">
            <Link
              href="/admin/login"
              className="text-sm font-semibold text-[var(--accent)] transition-colors hover:underline"
            >
              ← Back to Login
            </Link>
          </div>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[var(--muted)]">
          Secure admin access · Amir Suhail Portfolio
        </p>
      </div>
    </main>
  );
}
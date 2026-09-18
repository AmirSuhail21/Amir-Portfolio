"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "If an account exists with this email, a password reset link has been sent."
    );

    setLoading(false);
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
            Forgot Password
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Enter your admin email to receive a password reset link.
          </p>
        </div>

        {/* Reset Card */}
        <form
          onSubmit={handleReset}
          className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl shadow-black/5 backdrop-blur-xl dark:shadow-black/20 sm:p-8"
        >
          {error && (
            <div className="mb-5 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-600 dark:text-red-300">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-5 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm leading-6 text-emerald-600 dark:text-emerald-300">
              {message}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-2.5 block text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]"
            >
              Admin Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-[var(--foreground)] px-5 py-3.5 text-sm font-bold text-[var(--background)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg hover:shadow-black/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

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
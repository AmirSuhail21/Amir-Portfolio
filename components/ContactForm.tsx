"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("sending");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xyegegvn", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        form.reset();
        setStatus("success");
        return;
      }

      const data = await response.json().catch(() => null);

      setErrorMessage(
        data?.errors?.[0]?.message ||
          "Something went wrong. Please try again."
      );

      setStatus("error");
    } catch {
      setErrorMessage(
        "Unable to send your message. Please try again."
      );

      setStatus("error");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="hidden"
          name="_subject"
          value="New Portfolio Contact Message"
        />

        <div>
          <label
            htmlFor="contact-name"
            className="mb-2 block text-sm font-semibold"
          >
            Your Name
          </label>

          <input
            id="contact-name"
            name="name"
            type="text"
            placeholder="Your Name"
            required
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
          />
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="mb-2 block text-sm font-semibold"
          >
            Your Email
          </label>

          <input
            id="contact-email"
            name="email"
            type="email"
            placeholder="Your Email"
            required
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
          />
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="mb-2 block text-sm font-semibold"
          >
            Your Message
          </label>

          <textarea
            id="contact-message"
            name="message"
            rows={6}
            placeholder="Your Message"
            required
            className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5 text-sm leading-6 outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
          />
        </div>

        {status === "success" && (
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-600 dark:text-green-400">
            Message sent successfully! I&apos;ll get back to you soon.
          </div>
        )}

        {status === "error" && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-xl bg-[var(--accent)] px-5 py-3.5 text-sm font-bold text-[var(--accent-foreground)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
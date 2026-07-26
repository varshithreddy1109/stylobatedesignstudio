"use client";

import { FormEvent, useState } from "react";
import Button from "@/components/ui/Button";

const projectTypes = [
  "Residential",
  "Commercial",
  "Institutional",
  "Interior",
  "Urban Planning",
  "Other",
];

function encodeFormData(data: Record<string, string>): string {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join("&");
}

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Honeypot: real visitors never fill this hidden field. If it has a
    // value, silently drop the submission instead of sending it on.
    if (String(formData.get("bot-field") || "").trim().length > 0) {
      setSubmitted(true);
      return;
    }

    const payload: Record<string, string> = { "form-name": "contact" };
    formData.forEach((value, key) => {
      if (key === "bot-field") return;
      payload[key] = String(value);
    });

    setSubmitting(true);
    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeFormData(payload),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setSubmitted(true);
    } catch {
      setError(
        "Something went wrong sending your message. Please try again, or reach us directly using the details on this page."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col gap-4 border border-hairline p-10 text-center">
        <span className="label-tag mx-auto">Message Received</span>
        <h3 className="font-display text-2xl font-medium text-ink">
          Thank you — we&apos;ll be in touch shortly.
        </h3>
      </div>
    );
  }

  return (
    <form
      name="contact"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
    >
      {/* Required so Netlify's edge layer matches this submission to the
          "contact" form definition registered via public/__forms.html. */}
      <input type="hidden" name="form-name" value="contact" />

      {/* Honeypot field — hidden from real visitors via CSS, not markup, so
          automated bots that fill every field still populate it. */}
      <p className="hidden">
        <label>
          Don&apos;t fill this out: <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      {error && (
        <div className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Full Name" name="name" type="text" required />
        <Field label="Email" name="email" type="email" required />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Phone" name="phone" type="tel" />
        <div className="flex flex-col gap-2">
          <label htmlFor="projectType" className="font-mono text-[11px] uppercase tracking-widest2 text-stone">
            Project Type
          </label>
          <select
            id="projectType"
            name="projectType"
            className="border-b border-hairline bg-transparent py-3 text-sm text-ink outline-none transition-colors duration-300 focus:border-ink"
            defaultValue=""
          >
            <option value="" disabled>
              Select a category
            </option>
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="font-mono text-[11px] uppercase tracking-widest2 text-stone">
          Tell us about your project
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="resize-none border-b border-hairline bg-transparent py-3 text-sm text-ink outline-none transition-colors duration-300 focus:border-ink"
          placeholder="Location, scale, timeline, and anything else that helps us understand the brief."
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={submitting}
        className="mt-2 self-start disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  required,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="font-mono text-[11px] uppercase tracking-widest2 text-stone">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="border-b border-hairline bg-transparent py-3 text-sm text-ink outline-none transition-colors duration-300 focus:border-ink"
      />
    </div>
  );
}

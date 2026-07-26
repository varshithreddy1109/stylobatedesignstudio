"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Testimonial } from "@/types";
import {
  TextField,
  TextAreaField,
  ToggleField,
  FileUploadField,
  RatingField,
  FormActions,
} from "@/components/admin/FormControls";
import Toast, { useToast } from "@/components/admin/Toast";
import { supabase } from "@/lib/supabase/client";
import {
  createTestimonial,
  updateTestimonial,
  uploadTestimonialImage,
  type TestimonialFormValues,
} from "@/lib/supabase/testimonials";

interface TestimonialFormProps {
  mode: "add" | "edit";
  testimonial?: Testimonial;
}

export default function TestimonialForm({ mode, testimonial }: TestimonialFormProps) {
  const router = useRouter();
  const { message, showToast } = useToast();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const role = String(formData.get("role") || "").trim();
    const company = String(formData.get("company") || "").trim();
    const quote = String(formData.get("quote") || "").trim();
    const ratingRaw = String(formData.get("rating") || "5");
    const displayOrderRaw = String(formData.get("displayOrder") || "1");
    const featuredRaw = String(formData.get("featured") || "false");

    const missing: string[] = [];
    if (!name) missing.push("Client Name");
    if (!quote) missing.push("Testimonial Message");

    if (missing.length > 0) {
      setFormError(`Please complete the following: ${missing.join(", ")}.`);
      return;
    }

    setSubmitting(true);

    try {
      // Client Image is always optional — only upload if a new file was
      // actually chosen; otherwise keep whatever avatar URL already exists
      // (empty string is fine too — the public site shows initials instead).
      let avatarUrl = testimonial?.avatar ?? "";
      if (photoFile) {
        avatarUrl = await uploadTestimonialImage(supabase, photoFile, name);
      }

      const values: TestimonialFormValues = {
        name,
        role,
        company,
        quote,
        rating: Number(ratingRaw) || 5,
        avatar: avatarUrl,
        displayOrder: Number(displayOrderRaw) || 0,
        featured: featuredRaw === "true",
      };

      if (mode === "add") {
        await createTestimonial(supabase, values);
      } else if (testimonial) {
        await updateTestimonial(supabase, testimonial.id, values);
      }

      showToast(mode === "add" ? "Testimonial created successfully." : "Testimonial updated successfully.");
      setTimeout(() => {
        router.push("/admin/testimonials");
        router.refresh();
      }, 700);
    } catch (error) {
      setSubmitting(false);
      const rawMessage = error instanceof Error ? error.message : "Something went wrong.";
      if (/row-level security|permission denied/i.test(rawMessage)) {
        setFormError("You don't have permission to save this testimonial. Please sign in again.");
      } else if (/failed to fetch|network/i.test(rawMessage)) {
        setFormError("Network error — please check your connection and try again.");
      } else {
        setFormError(`Couldn't save the testimonial — ${rawMessage}`);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-14">
      {formError && (
        <div className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      )}

      <fieldset className="flex flex-col gap-6">
        <legend className="label-tag mb-2 text-brass">Client Details</legend>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextField
            label="Client Name"
            name="name"
            defaultValue={testimonial?.name}
            placeholder="e.g. Ritika Sharma"
            required
          />
          <TextField
            label="Designation"
            name="role"
            defaultValue={testimonial?.role}
            placeholder="e.g. Homeowner (optional)"
          />
          <TextField
            label="Company Name"
            name="company"
            defaultValue={testimonial?.company}
            placeholder="e.g. Meridian House (optional)"
          />
        </div>
        <FileUploadField
          label="Client Image"
          hint="Optional — a square headshot works best. If left empty, a professional initials avatar is shown instead."
          initialPreviewUrl={testimonial?.avatar}
          onFileChange={setPhotoFile}
        />
      </fieldset>

      <fieldset className="flex flex-col gap-6">
        <legend className="label-tag mb-2 text-brass">Testimonial</legend>
        <RatingField label="Rating" name="rating" defaultValue={testimonial?.rating ?? 5} />
        <TextAreaField
          label="Testimonial Message"
          name="quote"
          rows={5}
          defaultValue={testimonial?.quote}
          placeholder="What did the client say about working with the studio?"
          required
        />
      </fieldset>

      <fieldset className="flex flex-col gap-6">
        <legend className="label-tag mb-2 text-brass">Display</legend>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextField
            label="Display Order"
            name="displayOrder"
            type="number"
            defaultValue={testimonial?.displayOrder ? String(testimonial.displayOrder) : "1"}
            hint="Lower numbers appear first."
          />
          <ToggleField
            label="Featured"
            name="featured"
            hint="Show this testimonial in the Home page preview."
            defaultChecked={testimonial?.featured}
          />
        </div>
      </fieldset>

      <FormActions
        cancelHref="/admin/testimonials"
        saveLabel={mode === "add" ? "Save Testimonial" : "Save Changes"}
        submitting={submitting}
      />

      <Toast message={message} />
    </form>
  );
}

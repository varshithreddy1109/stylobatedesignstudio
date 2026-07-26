"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Service } from "@/types";
import {
  TextField,
  TextAreaField,
  ToggleField,
  FileUploadField,
  FormActions,
} from "@/components/admin/FormControls";
import Toast, { useToast } from "@/components/admin/Toast";
import { supabase } from "@/lib/supabase/client";
import {
  createService,
  updateService,
  uploadServiceIcon,
  type ServiceFormValues,
} from "@/lib/supabase/services";

interface ServiceFormProps {
  mode: "add" | "edit";
  service?: Service;
}

export default function ServiceForm({ mode, service }: ServiceFormProps) {
  const router = useRouter();
  const { message, showToast } = useToast();
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const detailedDescription = String(formData.get("detailedDescription") || "").trim();
    const displayOrderRaw = String(formData.get("displayOrder") || "1");
    const featuredRaw = String(formData.get("featured") || "false");

    const missing: string[] = [];
    if (!title) missing.push("Service Name");
    if (!description) missing.push("Short Description");

    if (missing.length > 0) {
      setFormError(`Please complete the following: ${missing.join(", ")}.`);
      return;
    }

    setSubmitting(true);

    try {
      // Service Icon is always optional — only upload if a new file was
      // actually chosen; otherwise keep whatever icon URL already exists.
      let iconUrl = service?.icon ?? "";
      if (iconFile) {
        iconUrl = await uploadServiceIcon(supabase, iconFile, title);
      }

      const values: ServiceFormValues = {
        title,
        description,
        detailedDescription,
        icon: iconUrl,
        displayOrder: Number(displayOrderRaw) || 0,
        featured: featuredRaw === "true",
      };

      if (mode === "add") {
        await createService(supabase, values);
      } else if (service) {
        await updateService(supabase, service.id, values);
      }

      showToast(mode === "add" ? "Service created successfully." : "Service updated successfully.");
      setTimeout(() => {
        router.push("/admin/services");
        router.refresh();
      }, 700);
    } catch (error) {
      setSubmitting(false);
      const rawMessage = error instanceof Error ? error.message : "Something went wrong.";
      if (/row-level security|permission denied/i.test(rawMessage)) {
        setFormError("You don't have permission to save this service. Please sign in again.");
      } else if (/failed to fetch|network/i.test(rawMessage)) {
        setFormError("Network error — please check your connection and try again.");
      } else {
        setFormError(`Couldn't save the service — ${rawMessage}`);
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
        <legend className="label-tag mb-2 text-brass">Service Details</legend>
        <TextField
          label="Service Name"
          name="title"
          defaultValue={service?.title}
          placeholder="e.g. Architectural Design"
          required
        />
        <TextAreaField
          label="Short Description"
          name="description"
          rows={3}
          defaultValue={service?.description}
          placeholder="Shown on the Home page services grid."
          required
        />
        <TextAreaField
          label="Detailed Description"
          name="detailedDescription"
          rows={5}
          defaultValue={service?.detailedDescription}
          placeholder="A longer explanation for a future services detail page (optional)."
        />
      </fieldset>

      <fieldset className="flex flex-col gap-6">
        <legend className="label-tag mb-2 text-brass">Service Icon</legend>
        <FileUploadField
          label="Service Icon"
          hint="Optional — a square icon or representative photo. If left empty, a default icon is shown instead."
          initialPreviewUrl={service?.icon}
          onFileChange={setIconFile}
        />
      </fieldset>

      <fieldset className="flex flex-col gap-6">
        <legend className="label-tag mb-2 text-brass">Display</legend>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextField
            label="Display Order"
            name="displayOrder"
            type="number"
            defaultValue={service?.displayOrder ? String(service.displayOrder) : "1"}
            hint="Lower numbers appear first."
          />
          <ToggleField
            label="Featured"
            name="featured"
            hint="Highlight this service on the Home page."
            defaultChecked={service?.featured}
          />
        </div>
      </fieldset>

      <FormActions
        cancelHref="/admin/services"
        saveLabel={mode === "add" ? "Save Service" : "Save Changes"}
        submitting={submitting}
      />

      <Toast message={message} />
    </form>
  );
}

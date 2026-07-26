"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteSettings } from "@/types";
import {
  TextField,
  TextAreaField,
  ColorField,
  FormActions,
} from "@/components/admin/FormControls";
import Toast, { useToast } from "@/components/admin/Toast";
import { supabase } from "@/lib/supabase/client";
import { saveSiteSettings } from "@/lib/supabase/siteSettings";

// Fallback swatches match the live design tokens in tailwind.config.ts, so
// the color pickers start somewhere sensible before the first save.
const DEFAULT_PRIMARY = "#0A0A0A";
const DEFAULT_ACCENT = "#A98554";
const DEFAULT_BACKGROUND = "#F7F6F3";

export default function SiteSettingsForm({ initialData }: { initialData: SiteSettings }) {
  const router = useRouter();
  const { message, showToast } = useToast();
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const values: SiteSettings = {
      primaryColor: String(formData.get("primaryColor") || "").trim(),
      accentColor: String(formData.get("accentColor") || "").trim(),
      backgroundColor: String(formData.get("backgroundColor") || "").trim(),
      footerText: String(formData.get("footerText") || "").trim(),
      seoTitle: String(formData.get("seoTitle") || "").trim(),
      seoDescription: String(formData.get("seoDescription") || "").trim(),
      contactEmail: String(formData.get("contactEmail") || "").trim(),
      contactPhone: String(formData.get("contactPhone") || "").trim(),
    };

    try {
      await saveSiteSettings(supabase, values);
      showToast("Settings saved.");
      router.refresh();
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      const rawMessage = error instanceof Error ? error.message : "Something went wrong.";
      if (/row-level security|permission denied/i.test(rawMessage)) {
        setFormError("You don't have permission to save these settings. Please sign in again.");
      } else if (/failed to fetch|network/i.test(rawMessage)) {
        setFormError("Network error — please check your connection and try again.");
      } else {
        setFormError(`Couldn't save settings — ${rawMessage}`);
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
        <legend className="label-tag mb-2 text-brass">Theme Colors</legend>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <ColorField
            label="Primary (Ink)"
            name="primaryColor"
            defaultValue={initialData.primaryColor || DEFAULT_PRIMARY}
          />
          <ColorField
            label="Accent (Brass)"
            name="accentColor"
            defaultValue={initialData.accentColor || DEFAULT_ACCENT}
          />
          <ColorField
            label="Background (Paper)"
            name="backgroundColor"
            defaultValue={initialData.backgroundColor || DEFAULT_BACKGROUND}
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-6">
        <legend className="label-tag mb-2 text-brass">Footer</legend>
        <TextAreaField label="Footer Text" name="footerText" rows={2} defaultValue={initialData.footerText} />
      </fieldset>

      <fieldset className="flex flex-col gap-6">
        <legend className="label-tag mb-2 text-brass">SEO Defaults</legend>
        <TextField label="SEO Title" name="seoTitle" defaultValue={initialData.seoTitle} />
        <TextAreaField
          label="SEO Description"
          name="seoDescription"
          rows={3}
          defaultValue={initialData.seoDescription}
        />
      </fieldset>

      <fieldset className="flex flex-col gap-6">
        <legend className="label-tag mb-2 text-brass">Contact</legend>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextField label="Contact Email" name="contactEmail" type="email" defaultValue={initialData.contactEmail} />
          <TextField label="Contact Phone" name="contactPhone" type="tel" defaultValue={initialData.contactPhone} />
        </div>
      </fieldset>

      <FormActions cancelHref="/admin" saveLabel="Save Settings" submitting={submitting} />

      <Toast message={message} />
    </form>
  );
}

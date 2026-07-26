"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CompanyDetails } from "@/types";
import {
  TextField,
  TextAreaField,
  FileUploadField,
  FormActions,
} from "@/components/admin/FormControls";
import Toast, { useToast } from "@/components/admin/Toast";
import { supabase } from "@/lib/supabase/client";
import { saveCompanyDetails, uploadCompanyImage } from "@/lib/supabase/companyDetails";

const COMPANY_NAME = "STYLOBATE DESIGN STUDIO";

export default function CompanyDetailsForm({ initialData }: { initialData: CompanyDetails }) {
  const router = useRouter();
  const { message, showToast } = useToast();
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const yearsExperienceRaw = String(formData.get("yearsExperience") || "").trim();
    const awardsRaw = String(formData.get("awards") || "").trim();
    const about = String(formData.get("about") || "").trim();
    const ourStory = String(formData.get("ourStory") || "").trim();
    const vision = String(formData.get("vision") || "").trim();
    const mission = String(formData.get("mission") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const whatsapp = String(formData.get("whatsapp") || "").trim();
    const workingHours = String(formData.get("workingHours") || "").trim();
    const address = String(formData.get("address") || "").trim();
    const googleMapsLink = String(formData.get("googleMapsLink") || "").trim();
    const appleMapsLink = String(formData.get("appleMapsLink") || "").trim();
    const instagram = String(formData.get("instagram") || "").trim();
    const facebook = String(formData.get("facebook") || "").trim();
    const linkedin = String(formData.get("linkedin") || "").trim();
    const youtube = String(formData.get("youtube") || "").trim();

    try {
      // Favicon is only uploaded if a new file was chosen — otherwise
      // whatever is already saved stays as-is.
      let faviconUrl = initialData.favicon ?? "";
      if (faviconFile) {
        faviconUrl = await uploadCompanyImage(supabase, faviconFile);
      }

      const values: CompanyDetails = {
        favicon: faviconUrl,
        yearsExperience: yearsExperienceRaw ? Number(yearsExperienceRaw) : undefined,
        awards: awardsRaw ? Number(awardsRaw) : undefined,
        about,
        ourStory,
        vision,
        mission,
        email,
        phone,
        whatsapp,
        workingHours,
        address,
        googleMapsLink,
        appleMapsLink,
        instagram,
        facebook,
        linkedin,
        youtube,
      };

      await saveCompanyDetails(supabase, values);

      showToast("Company details saved.");
      router.refresh();
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      const rawMessage = error instanceof Error ? error.message : "Something went wrong.";
      if (/row-level security|permission denied/i.test(rawMessage)) {
        setFormError("You don't have permission to save these details. Please sign in again.");
      } else if (/failed to fetch|network/i.test(rawMessage)) {
        setFormError("Network error — please check your connection and try again.");
      } else {
        setFormError(`Couldn't save company details — ${rawMessage}`);
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
        <legend className="label-tag mb-2 text-brass">Identity</legend>

        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-widest2 text-stone">
            Company Name
          </span>
          <div className="border-b border-hairline bg-charcoal/[0.02] py-3 text-sm text-charcoal/70">
            {COMPANY_NAME}
          </div>
          <span className="text-xs text-charcoal/50">
            The company name is fixed and cannot be changed here.
          </span>
        </div>

        <FileUploadField
          label="Favicon"
          hint="Square image, minimum 64×64px. Leave empty to keep the current favicon."
          initialPreviewUrl={initialData.favicon}
          onFileChange={setFaviconFile}
        />
      </fieldset>

      <fieldset className="flex flex-col gap-6">
        <legend className="label-tag mb-2 text-brass">Studio Stats</legend>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextField
            label="Years of Experience"
            name="yearsExperience"
            type="number"
            defaultValue={initialData.yearsExperience ? String(initialData.yearsExperience) : ""}
            hint="Shown on the Home page stats."
          />
          <TextField
            label="Awards"
            name="awards"
            type="number"
            defaultValue={initialData.awards ? String(initialData.awards) : ""}
            hint="Left empty or 0 hides this stat entirely."
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-6">
        <legend className="label-tag mb-2 text-brass">About</legend>
        <TextAreaField
          label="About the Studio"
          name="about"
          rows={4}
          defaultValue={initialData.about}
          hint="Shown on the Home page and the About page."
        />
        <TextAreaField label="Our Story" name="ourStory" rows={5} defaultValue={initialData.ourStory} />
        <TextAreaField label="Vision" name="vision" rows={2} defaultValue={initialData.vision} />
        <TextAreaField label="Mission" name="mission" rows={2} defaultValue={initialData.mission} />
      </fieldset>

      <fieldset className="flex flex-col gap-6">
        <legend className="label-tag mb-2 text-brass">Contact</legend>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextField label="Email" name="email" type="email" defaultValue={initialData.email} />
          <TextField label="Phone" name="phone" type="tel" defaultValue={initialData.phone} />
          <TextField label="WhatsApp" name="whatsapp" type="tel" defaultValue={initialData.whatsapp} />
          <TextField label="Working Hours" name="workingHours" defaultValue={initialData.workingHours} />
        </div>
        <TextAreaField label="Address" name="address" rows={2} defaultValue={initialData.address} />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextField label="Google Maps Link" name="googleMapsLink" defaultValue={initialData.googleMapsLink} />
          <TextField label="Apple Maps Link" name="appleMapsLink" defaultValue={initialData.appleMapsLink} />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-6">
        <legend className="label-tag mb-2 text-brass">Social Links</legend>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextField label="Instagram" name="instagram" defaultValue={initialData.instagram} />
          <TextField label="Facebook" name="facebook" defaultValue={initialData.facebook} />
          <TextField label="LinkedIn" name="linkedin" defaultValue={initialData.linkedin} />
          <TextField label="YouTube" name="youtube" defaultValue={initialData.youtube} />
        </div>
      </fieldset>

      <FormActions cancelHref="/admin" saveLabel="Save Company Details" submitting={submitting} />

      <Toast message={message} />
    </form>
  );
}

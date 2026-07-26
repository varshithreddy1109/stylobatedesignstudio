"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/types";
import { projectCategories, projectTypes, projectStatuses } from "@/data/projects";
import {
  TextField,
  TextAreaField,
  SelectField,
  ToggleField,
  FileUploadField,
  FormActions,
  type GalleryItem,
} from "@/components/admin/FormControls";
import Toast, { useToast } from "@/components/admin/Toast";
import { supabase } from "@/lib/supabase/client";
import { createProject, updateProject, uploadProjectImage, type ProjectFormValues } from "@/lib/supabase/projects";
import { slugify } from "@/lib/slugify";

interface ProjectFormProps {
  mode: "add" | "edit";
  project?: Project;
}

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export default function ProjectForm({ mode, project }: ProjectFormProps) {
  const router = useRouter();
  const { message, showToast } = useToast();

  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(project));
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(
    (project?.gallery ?? []).map((url) => ({ url }))
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleTitleChange(next: string) {
    setTitle(next);
    if (!slugTouched) {
      setSlug(slugify(next));
    }
  }

  function handleSlugChange(next: string) {
    setSlug(next);
    setSlugTouched(true);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const description = String(formData.get("description") || "").trim();
    const detailedDescription = String(formData.get("detailedDescription") || "").trim();
    const clientName = String(formData.get("clientName") || "").trim();
    const architectName = String(formData.get("architectName") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const area = String(formData.get("area") || "").trim();
    const completionDate = String(formData.get("completionDate") || "").trim();
    const category = String(formData.get("category") || "Residential");
    const projectType = String(formData.get("projectType") || "");
    const status = String(formData.get("status") || "");
    const youtubeUrl = String(formData.get("youtubeUrl") || "").trim();
    const displayOrderRaw = String(formData.get("displayOrder") || "1");
    const featuredRaw = String(formData.get("featured") || "false");
    const metaTitle = String(formData.get("metaTitle") || "").trim();
    const metaDescription = String(formData.get("metaDescription") || "").trim();

    const trimmedTitle = title.trim();
    const trimmedSlug = slug.trim().toLowerCase();

    const missing: string[] = [];
    if (!trimmedTitle) missing.push("Project Name");
    if (!trimmedSlug) {
      missing.push("Slug");
    } else if (!SLUG_PATTERN.test(trimmedSlug)) {
      missing.push("Slug (use lowercase letters, numbers, and hyphens only)");
    }
    if (!description) missing.push("Short Description");
    if (!location) missing.push("Location");
    if (!area) missing.push("Area");
    if (mode === "add" && !coverFile) missing.push("Cover Image");

    if (missing.length > 0) {
      setFormError(`Please complete the following: ${missing.join(", ")}.`);
      return;
    }

    setSubmitting(true);

    try {
      let imageUrl = project?.image ?? "";
      if (coverFile) {
        imageUrl = await uploadProjectImage(supabase, coverFile, "covers", trimmedSlug);
      }

      const galleryUrls: string[] = [];
      for (const item of galleryItems) {
        if (item.file) {
          // eslint-disable-next-line no-await-in-loop -- uploads must stay in gallery order
          const uploadedUrl = await uploadProjectImage(supabase, item.file, "gallery", trimmedSlug);
          galleryUrls.push(uploadedUrl);
        } else {
          galleryUrls.push(item.url);
        }
      }

      const values: ProjectFormValues = {
        title: trimmedTitle,
        slug: trimmedSlug,
        category,
        projectType,
        status,
        description,
        detailedDescription,
        clientName,
        architectName,
        location,
        area,
        completionDate,
        image: imageUrl,
        gallery: galleryUrls,
        youtubeUrl,
        featured: featuredRaw === "true",
        displayOrder: Number(displayOrderRaw) || 0,
        metaTitle,
        metaDescription,
      };

      if (mode === "add") {
        await createProject(supabase, values);
      } else if (project) {
        await updateProject(supabase, project.id, values);
      }

      showToast(mode === "add" ? "Project created successfully." : "Project updated successfully.");
      setTimeout(() => {
        router.push("/admin/projects");
        router.refresh();
      }, 700);
    } catch (error) {
      setSubmitting(false);
      const rawMessage = error instanceof Error ? error.message : "Something went wrong.";
      if (/duplicate key|unique constraint/i.test(rawMessage)) {
        setFormError("This slug is already in use by another project — please choose a different one.");
      } else if (/row-level security|permission denied/i.test(rawMessage)) {
        setFormError("You don't have permission to save this project. Please sign in again.");
      } else if (/failed to fetch|network/i.test(rawMessage)) {
        setFormError("Network error — please check your connection and try again.");
      } else {
        setFormError(`Couldn't save the project — ${rawMessage}`);
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

      {/* General Information */}
      <fieldset className="flex flex-col gap-6">
        <legend className="label-tag mb-2 text-brass">General Information</legend>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextField
            label="Project Name"
            name="title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. Meridian House"
            required
          />
          <TextField
            label="Slug"
            name="slug"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="e.g. meridian-house"
            hint="Auto-generated from the project name — edit if you'd like a different URL."
            required
          />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <SelectField
            label="Category"
            name="category"
            options={projectCategories.filter((c): c is Project["category"] => c !== "All")}
            defaultValue={project?.category ?? "Residential"}
          />
          <SelectField
            label="Project Type"
            name="projectType"
            options={projectTypes.filter((t): t is NonNullable<Project["projectType"]> => Boolean(t))}
            defaultValue={project?.projectType ?? "New Construction"}
          />
          <SelectField
            label="Status"
            name="status"
            options={projectStatuses.filter((s): s is NonNullable<Project["status"]> => Boolean(s))}
            defaultValue={project?.status ?? "Ongoing"}
          />
        </div>
      </fieldset>

      {/* Project Details */}
      <fieldset className="flex flex-col gap-6">
        <legend className="label-tag mb-2 text-brass">Project Details</legend>
        <TextAreaField
          label="Short Description"
          name="description"
          rows={3}
          defaultValue={project?.description}
          placeholder="One or two sentences shown on project cards and listings."
          required
        />
        <TextAreaField
          label="Detailed Description"
          name="detailedDescription"
          rows={6}
          defaultValue={project?.detailedDescription}
          placeholder="The full write-up shown on the project detail page."
        />
      </fieldset>

      {/* Project Information */}
      <fieldset className="flex flex-col gap-6">
        <legend className="label-tag mb-2 text-brass">Project Information</legend>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextField
            label="Client Name"
            name="clientName"
            defaultValue={project?.clientName}
            placeholder="e.g. Private Client"
          />
          <TextField
            label="Architect Name"
            name="architectName"
            defaultValue={project?.architectName}
            placeholder="e.g. Aravind Rao"
          />
          <TextField
            label="Location"
            name="location"
            defaultValue={project?.location}
            placeholder="e.g. Alibaug, Maharashtra"
            required
          />
          <TextField
            label="Area"
            name="area"
            defaultValue={project?.area}
            placeholder="e.g. 6,200 sq.ft"
            required
          />
          <TextField
            label="Completion Date"
            name="completionDate"
            type="date"
            defaultValue={project?.completionDate}
          />
        </div>
      </fieldset>

      {/* Media */}
      <fieldset className="flex flex-col gap-6">
        <legend className="label-tag mb-2 text-brass">Media</legend>
        <FileUploadField
          label="Cover Image"
          hint="Recommended size 1600×1200px. JPG or PNG."
          initialPreviewUrl={project?.image}
          onFileChange={setCoverFile}
        />
        <FileUploadField
          label="Gallery Images"
          hint="Upload multiple images for the project detail gallery. Click × to remove one."
          multiple
          initialPreviewUrls={project?.gallery}
          onItemsChange={setGalleryItems}
        />
        <TextField
          label="YouTube Video URL"
          name="youtubeUrl"
          defaultValue={project?.youtubeUrl}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </fieldset>

      {/* Homepage */}
      <fieldset className="flex flex-col gap-6">
        <legend className="label-tag mb-2 text-brass">Homepage</legend>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <ToggleField
            label="Featured Project"
            name="featured"
            hint="Show this project in the Home page Featured Work section."
            defaultChecked={project?.featured}
          />
          <TextField
            label="Display Order"
            name="displayOrder"
            type="number"
            defaultValue={project?.displayOrder ? String(project.displayOrder) : "1"}
            hint="Lower numbers appear first."
          />
        </div>
      </fieldset>

      {/* SEO */}
      <fieldset className="flex flex-col gap-6">
        <legend className="label-tag mb-2 text-brass">SEO</legend>
        <TextField
          label="Meta Title"
          name="metaTitle"
          defaultValue={project?.metaTitle}
          placeholder="e.g. Meridian House | STYLOBATE DESIGN STUDIO"
        />
        <TextAreaField
          label="Meta Description"
          name="metaDescription"
          rows={3}
          defaultValue={project?.metaDescription}
          placeholder="A one-sentence summary shown in search results."
        />
      </fieldset>

      <FormActions
        cancelHref="/admin/projects"
        saveLabel={mode === "add" ? "Save Project" : "Save Changes"}
        submitting={submitting}
      />

      <Toast message={message} />
    </form>
  );
}

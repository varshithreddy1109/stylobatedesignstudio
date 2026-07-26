import type { SupabaseClient } from "@supabase/supabase-js";
import type { Project, ProjectCategory, ProjectType, ProjectStatus } from "@/types";
import { optimizeImage } from "@/lib/imageOptimization";

export const PROJECTS_TABLE = "projects";
export const PROJECT_MEDIA_BUCKET = "project-media";

/** Shape of a row exactly as stored in the `projects` Postgres table. */
interface ProjectRow {
  id: string;
  title: string;
  slug: string;
  category: string;
  project_type: string | null;
  status: string | null;
  description: string;
  detailed_description: string | null;
  client_name: string | null;
  architect_name: string | null;
  location: string;
  area: string;
  completion_date: string | null;
  image: string;
  gallery: string[] | null;
  youtube_url: string | null;
  featured: boolean;
  display_order: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

function deriveYear(completionDate: string | null): string {
  if (!completionDate) return "";
  const date = new Date(completionDate);
  return Number.isNaN(date.getTime()) ? "" : String(date.getFullYear());
}

/** Maps a raw `projects` row (snake_case) to the app's `Project` type. */
export function mapRowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    location: row.location,
    category: row.category as ProjectCategory,
    year: deriveYear(row.completion_date),
    area: row.area,
    description: row.description,
    image: row.image,
    featured: row.featured,
    projectType: (row.project_type as ProjectType | null) ?? undefined,
    status: (row.status as ProjectStatus | null) ?? undefined,
    clientName: row.client_name ?? undefined,
    architectName: row.architect_name ?? undefined,
    completionDate: row.completion_date ?? undefined,
    displayOrder: row.display_order,
    detailedDescription: row.detailed_description ?? undefined,
    gallery: row.gallery ?? undefined,
    youtubeUrl: row.youtube_url ?? undefined,
    metaTitle: row.meta_title ?? undefined,
    metaDescription: row.meta_description ?? undefined,
  };
}

/** Values collected from the Add/Edit Project form, ready to write to Supabase. */
export interface ProjectFormValues {
  title: string;
  slug: string;
  category: string;
  projectType: string;
  status: string;
  description: string;
  detailedDescription: string;
  clientName: string;
  architectName: string;
  location: string;
  area: string;
  completionDate: string;
  image: string;
  gallery: string[];
  youtubeUrl: string;
  featured: boolean;
  displayOrder: number;
  metaTitle: string;
  metaDescription: string;
}

function toRowPayload(values: ProjectFormValues) {
  return {
    title: values.title,
    slug: values.slug,
    category: values.category,
    project_type: values.projectType || null,
    status: values.status || null,
    description: values.description,
    detailed_description: values.detailedDescription || null,
    client_name: values.clientName || null,
    architect_name: values.architectName || null,
    location: values.location,
    area: values.area,
    completion_date: values.completionDate || null,
    image: values.image,
    gallery: values.gallery,
    youtube_url: values.youtubeUrl || null,
    featured: values.featured,
    display_order: values.displayOrder,
    meta_title: values.metaTitle || null,
    meta_description: values.metaDescription || null,
  };
}

/** All projects, ordered for display (Display Order, then newest first). */
export async function fetchAllProjects(client: SupabaseClient): Promise<Project[]> {
  const { data, error } = await client
    .from(PROJECTS_TABLE)
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[projects] fetchAllProjects error:", error.message);
    return [];
  }
  return (data ?? []).map(mapRowToProject);
}

/** Projects flagged Featured, for the Home page. */
export async function fetchFeaturedProjects(client: SupabaseClient, limit = 3): Promise<Project[]> {
  const { data, error } = await client
    .from(PROJECTS_TABLE)
    .select("*")
    .eq("featured", true)
    .order("display_order", { ascending: true })
    .limit(limit);

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[projects] fetchFeaturedProjects error:", error.message);
    return [];
  }
  return (data ?? []).map(mapRowToProject);
}

/** A single project by slug, for the Edit Project page. */
export async function fetchProjectBySlug(client: SupabaseClient, slug: string): Promise<Project | null> {
  const { data, error } = await client
    .from(PROJECTS_TABLE)
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[projects] fetchProjectBySlug error:", error.message);
    return null;
  }
  return data ? mapRowToProject(data) : null;
}

/** Total number of projects, for the Admin Dashboard "Total Projects" stat. */
export async function countProjects(client: SupabaseClient): Promise<number> {
  const { count, error } = await client
    .from(PROJECTS_TABLE)
    .select("id", { count: "exact", head: true });

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[projects] countProjects error:", error.message);
    return 0;
  }
  return count ?? 0;
}

export async function createProject(client: SupabaseClient, values: ProjectFormValues): Promise<Project> {
  const { data, error } = await client
    .from(PROJECTS_TABLE)
    .insert(toRowPayload(values))
    .select("*")
    .single();

  if (error) throw error;
  return mapRowToProject(data);
}

export async function updateProject(
  client: SupabaseClient,
  id: string,
  values: ProjectFormValues
): Promise<Project> {
  const { data, error } = await client
    .from(PROJECTS_TABLE)
    .update(toRowPayload(values))
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return mapRowToProject(data);
}

export async function deleteProject(client: SupabaseClient, id: string): Promise<void> {
  const { error } = await client.from(PROJECTS_TABLE).delete().eq("id", id);
  if (error) throw error;
}

/**
 * Uploads a single image to the `project-media` Storage bucket and returns
 * its public URL. Used for both the cover image and each gallery image.
 */
export async function uploadProjectImage(
  client: SupabaseClient,
  file: File,
  folder: "covers" | "gallery",
  slug: string
): Promise<string> {
  const optimized = await optimizeImage(file, folder === "covers" ? "project-cover" : "project-gallery");
  const fileExt = optimized.name.split(".").pop()?.toLowerCase() || "webp";
  const uniqueId =
    typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`;
  const safeSlug = slug || "project";
  const path = `${folder}/${safeSlug}-${uniqueId}.${fileExt}`;

  const { error } = await client.storage.from(PROJECT_MEDIA_BUCKET).upload(path, optimized, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  const { data } = client.storage.from(PROJECT_MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

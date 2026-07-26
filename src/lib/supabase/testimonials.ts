import type { SupabaseClient } from "@supabase/supabase-js";
import type { Testimonial } from "@/types";
import { optimizeImage } from "@/lib/imageOptimization";

export const TESTIMONIALS_TABLE = "testimonials";
export const TESTIMONIAL_MEDIA_BUCKET = "testimonial-media";

/** Shape of a row exactly as stored in the `testimonials` Postgres table. */
interface TestimonialRow {
  id: string;
  client_name: string;
  company_name: string | null;
  designation: string | null;
  message: string;
  rating: number;
  image: string | null;
  display_order: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

/** Maps a raw `testimonials` row (snake_case) to the app's `Testimonial` type. */
export function mapRowToTestimonial(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    name: row.client_name,
    quote: row.message,
    rating: row.rating,
    displayOrder: row.display_order,
    featured: row.featured,
    role: row.designation ?? undefined,
    company: row.company_name ?? undefined,
    avatar: row.image ?? undefined,
  };
}

/** Values collected from the Add/Edit Testimonial form, ready to write to Supabase. */
export interface TestimonialFormValues {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  avatar: string; // empty string means "no image"
  displayOrder: number;
  featured: boolean;
}

function toRowPayload(values: TestimonialFormValues) {
  return {
    client_name: values.name,
    company_name: values.company || null,
    designation: values.role || null,
    message: values.quote,
    rating: values.rating,
    image: values.avatar || null,
    display_order: values.displayOrder,
    featured: values.featured,
  };
}

/** All testimonials, ordered for display (Display Order, then newest first). */
export async function fetchAllTestimonials(client: SupabaseClient): Promise<Testimonial[]> {
  const { data, error } = await client
    .from(TESTIMONIALS_TABLE)
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[testimonials] fetchAllTestimonials error:", error.message);
    return [];
  }
  return (data ?? []).map(mapRowToTestimonial);
}

/** Testimonials flagged Featured, for the Home page preview. */
export async function fetchFeaturedTestimonials(client: SupabaseClient, limit = 2): Promise<Testimonial[]> {
  const { data, error } = await client
    .from(TESTIMONIALS_TABLE)
    .select("*")
    .eq("featured", true)
    .order("display_order", { ascending: true })
    .limit(limit);

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[testimonials] fetchFeaturedTestimonials error:", error.message);
    return [];
  }
  return (data ?? []).map(mapRowToTestimonial);
}

/** A single testimonial by id, for the Edit Testimonial page. */
export async function fetchTestimonialById(client: SupabaseClient, id: string): Promise<Testimonial | null> {
  const { data, error } = await client
    .from(TESTIMONIALS_TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[testimonials] fetchTestimonialById error:", error.message);
    return null;
  }
  return data ? mapRowToTestimonial(data) : null;
}

/** Total number of testimonials, for the Admin Dashboard "Total Testimonials" stat. */
export async function countTestimonials(client: SupabaseClient): Promise<number> {
  const { count, error } = await client
    .from(TESTIMONIALS_TABLE)
    .select("id", { count: "exact", head: true });

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[testimonials] countTestimonials error:", error.message);
    return 0;
  }
  return count ?? 0;
}

export async function createTestimonial(
  client: SupabaseClient,
  values: TestimonialFormValues
): Promise<Testimonial> {
  const { data, error } = await client
    .from(TESTIMONIALS_TABLE)
    .insert(toRowPayload(values))
    .select("*")
    .single();

  if (error) throw error;
  return mapRowToTestimonial(data);
}

export async function updateTestimonial(
  client: SupabaseClient,
  id: string,
  values: TestimonialFormValues
): Promise<Testimonial> {
  const { data, error } = await client
    .from(TESTIMONIALS_TABLE)
    .update(toRowPayload(values))
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return mapRowToTestimonial(data);
}

export async function deleteTestimonial(client: SupabaseClient, id: string): Promise<void> {
  const { error } = await client.from(TESTIMONIALS_TABLE).delete().eq("id", id);
  if (error) throw error;
}

/**
 * Uploads a client photo to the `testimonial-media` Storage bucket and
 * returns its public URL. Only called when the admin actually selects a
 * file — Client Image is always optional.
 */
export async function uploadTestimonialImage(
  client: SupabaseClient,
  file: File,
  name: string
): Promise<string> {
  const optimized = await optimizeImage(file, "testimonial");
  const fileExt = optimized.name.split(".").pop()?.toLowerCase() || "webp";
  const uniqueId =
    typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`;
  const safeName =
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "client";
  const path = `avatars/${safeName}-${uniqueId}.${fileExt}`;

  const { error } = await client.storage.from(TESTIMONIAL_MEDIA_BUCKET).upload(path, optimized, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  const { data } = client.storage.from(TESTIMONIAL_MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

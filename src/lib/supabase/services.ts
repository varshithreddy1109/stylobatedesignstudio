import type { SupabaseClient } from "@supabase/supabase-js";
import type { Service } from "@/types";
import { optimizeImage } from "@/lib/imageOptimization";

export const SERVICES_TABLE = "services";
export const SERVICE_MEDIA_BUCKET = "service-media";

/** Shape of a row exactly as stored in the `services` Postgres table. */
interface ServiceRow {
  id: string;
  title: string;
  description: string;
  detailed_description: string | null;
  icon: string | null;
  display_order: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

/** Maps a raw `services` row (snake_case) to the app's `Service` type. */
export function mapRowToService(row: ServiceRow): Service {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    displayOrder: row.display_order,
    featured: row.featured,
    detailedDescription: row.detailed_description ?? undefined,
    icon: row.icon ?? undefined,
  };
}

/** Values collected from the Add/Edit Service form, ready to write to Supabase. */
export interface ServiceFormValues {
  title: string;
  description: string;
  detailedDescription: string;
  icon: string; // empty string means "no icon"
  displayOrder: number;
  featured: boolean;
}

function toRowPayload(values: ServiceFormValues) {
  return {
    title: values.title,
    description: values.description,
    detailed_description: values.detailedDescription || null,
    icon: values.icon || null,
    display_order: values.displayOrder,
    featured: values.featured,
  };
}

/** All services, ordered for display (Display Order, then newest first). */
export async function fetchAllServices(client: SupabaseClient): Promise<Service[]> {
  const { data, error } = await client
    .from(SERVICES_TABLE)
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[services] fetchAllServices error:", error.message);
    return [];
  }
  return (data ?? []).map(mapRowToService);
}

/** A single service by id, for the Edit Service page. */
export async function fetchServiceById(client: SupabaseClient, id: string): Promise<Service | null> {
  const { data, error } = await client
    .from(SERVICES_TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[services] fetchServiceById error:", error.message);
    return null;
  }
  return data ? mapRowToService(data) : null;
}

/** Total number of services, for the Admin Dashboard "Total Services" stat. */
export async function countServices(client: SupabaseClient): Promise<number> {
  const { count, error } = await client
    .from(SERVICES_TABLE)
    .select("id", { count: "exact", head: true });

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[services] countServices error:", error.message);
    return 0;
  }
  return count ?? 0;
}

export async function createService(client: SupabaseClient, values: ServiceFormValues): Promise<Service> {
  const { data, error } = await client
    .from(SERVICES_TABLE)
    .insert(toRowPayload(values))
    .select("*")
    .single();

  if (error) throw error;
  return mapRowToService(data);
}

export async function updateService(
  client: SupabaseClient,
  id: string,
  values: ServiceFormValues
): Promise<Service> {
  const { data, error } = await client
    .from(SERVICES_TABLE)
    .update(toRowPayload(values))
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return mapRowToService(data);
}

export async function deleteService(client: SupabaseClient, id: string): Promise<void> {
  const { error } = await client.from(SERVICES_TABLE).delete().eq("id", id);
  if (error) throw error;
}

/**
 * Uploads a service icon/image to the `service-media` Storage bucket and
 * returns its public URL. Only called when the admin actually selects a
 * file — Service Icon is always optional.
 */
export async function uploadServiceIcon(client: SupabaseClient, file: File, title: string): Promise<string> {
  const optimized = await optimizeImage(file, "service-icon");
  const fileExt = optimized.name.split(".").pop()?.toLowerCase() || "webp";
  const uniqueId =
    typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`;
  const safeTitle =
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "service";
  const path = `icons/${safeTitle}-${uniqueId}.${fileExt}`;

  const { error } = await client.storage.from(SERVICE_MEDIA_BUCKET).upload(path, optimized, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  const { data } = client.storage.from(SERVICE_MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

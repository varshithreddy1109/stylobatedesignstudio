import type { SupabaseClient } from "@supabase/supabase-js";
import type { CompanyDetails } from "@/types";
import { optimizeImage } from "@/lib/imageOptimization";

export const COMPANY_DETAILS_TABLE = "company_details";
export const COMPANY_MEDIA_BUCKET = "company-media";

const SINGLETON_ID = 1;

/** Shape of the single row exactly as stored in `company_details`. */
interface CompanyDetailsRow {
  id: number;
  favicon: string | null;
  years_experience: number | null;
  awards: number | null;
  about: string | null;
  our_story: string | null;
  vision: string | null;
  mission: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  working_hours: string | null;
  address: string | null;
  google_maps_link: string | null;
  apple_maps_link: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  youtube: string | null;
  updated_at: string;
}

function mapRowToCompanyDetails(row: CompanyDetailsRow): CompanyDetails {
  return {
    favicon: row.favicon ?? undefined,
    yearsExperience: row.years_experience ?? undefined,
    awards: row.awards ?? undefined,
    about: row.about ?? undefined,
    ourStory: row.our_story ?? undefined,
    vision: row.vision ?? undefined,
    mission: row.mission ?? undefined,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    whatsapp: row.whatsapp ?? undefined,
    workingHours: row.working_hours ?? undefined,
    address: row.address ?? undefined,
    googleMapsLink: row.google_maps_link ?? undefined,
    appleMapsLink: row.apple_maps_link ?? undefined,
    instagram: row.instagram ?? undefined,
    facebook: row.facebook ?? undefined,
    linkedin: row.linkedin ?? undefined,
    youtube: row.youtube ?? undefined,
  };
}

function toRowPayload(values: CompanyDetails) {
  return {
    id: SINGLETON_ID,
    favicon: values.favicon || null,
    years_experience: values.yearsExperience ?? null,
    awards: values.awards ?? null,
    about: values.about || null,
    our_story: values.ourStory || null,
    vision: values.vision || null,
    mission: values.mission || null,
    email: values.email || null,
    phone: values.phone || null,
    whatsapp: values.whatsapp || null,
    working_hours: values.workingHours || null,
    address: values.address || null,
    google_maps_link: values.googleMapsLink || null,
    apple_maps_link: values.appleMapsLink || null,
    instagram: values.instagram || null,
    facebook: values.facebook || null,
    linkedin: values.linkedin || null,
    youtube: values.youtube || null,
  };
}

/**
 * Fetches the singleton company details row. Returns an empty object (all
 * fields undefined) if no row has been saved yet — this is expected on a
 * fresh project, since no sample data is ever seeded.
 */
export async function fetchCompanyDetails(client: SupabaseClient): Promise<CompanyDetails> {
  const { data, error } = await client
    .from(COMPANY_DETAILS_TABLE)
    .select("*")
    .eq("id", SINGLETON_ID)
    .maybeSingle();

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[companyDetails] fetchCompanyDetails error:", error.message);
    return {};
  }
  return data ? mapRowToCompanyDetails(data) : {};
}

/**
 * Saves the singleton company details row (insert on first save, update on
 * every save after that).
 */
export async function saveCompanyDetails(
  client: SupabaseClient,
  values: CompanyDetails
): Promise<CompanyDetails> {
  const { data, error } = await client
    .from(COMPANY_DETAILS_TABLE)
    .upsert(toRowPayload(values), { onConflict: "id" })
    .select("*")
    .single();

  if (error) throw error;
  return mapRowToCompanyDetails(data);
}

/**
 * Uploads a Favicon to the `company-media` Storage bucket and returns its
 * public URL. Only called when the admin actually selects a new file — if
 * not replaced, the existing URL is kept as-is. (Logo is no longer
 * uploadable here — it's a fixed bundled asset, see public/images/logo.jpg.)
 */
export async function uploadCompanyImage(client: SupabaseClient, file: File): Promise<string> {
  const optimized = await optimizeImage(file, "favicon");
  const fileExt = optimized.name.split(".").pop()?.toLowerCase() || "webp";
  const uniqueId =
    typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`;
  const path = `favicon/favicon-${uniqueId}.${fileExt}`;

  const { error } = await client.storage.from(COMPANY_MEDIA_BUCKET).upload(path, optimized, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  const { data } = client.storage.from(COMPANY_MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

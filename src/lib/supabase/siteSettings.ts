import type { SupabaseClient } from "@supabase/supabase-js";
import type { SiteSettings } from "@/types";

export const WEBSITE_SETTINGS_TABLE = "website_settings";

const SINGLETON_ID = 1;

/** Shape of the single row exactly as stored in `website_settings`. */
interface WebsiteSettingsRow {
  id: number;
  primary_color: string | null;
  accent_color: string | null;
  background_color: string | null;
  footer_text: string | null;
  seo_title: string | null;
  seo_description: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  updated_at: string;
}

function mapRowToSiteSettings(row: WebsiteSettingsRow): SiteSettings {
  return {
    primaryColor: row.primary_color ?? undefined,
    accentColor: row.accent_color ?? undefined,
    backgroundColor: row.background_color ?? undefined,
    footerText: row.footer_text ?? undefined,
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    contactEmail: row.contact_email ?? undefined,
    contactPhone: row.contact_phone ?? undefined,
  };
}

function toRowPayload(values: SiteSettings) {
  return {
    id: SINGLETON_ID,
    primary_color: values.primaryColor || null,
    accent_color: values.accentColor || null,
    background_color: values.backgroundColor || null,
    footer_text: values.footerText || null,
    seo_title: values.seoTitle || null,
    seo_description: values.seoDescription || null,
    contact_email: values.contactEmail || null,
    contact_phone: values.contactPhone || null,
  };
}

/**
 * Fetches the singleton site settings row. Returns an empty object (all
 * fields undefined) if no row has been saved yet — this is expected on a
 * fresh project, since no sample data is ever seeded.
 */
export async function fetchSiteSettings(client: SupabaseClient): Promise<SiteSettings> {
  const { data, error } = await client
    .from(WEBSITE_SETTINGS_TABLE)
    .select("*")
    .eq("id", SINGLETON_ID)
    .maybeSingle();

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[siteSettings] fetchSiteSettings error:", error.message);
    return {};
  }
  return data ? mapRowToSiteSettings(data) : {};
}

/**
 * Saves the singleton site settings row (insert on first save, update on
 * every save after that).
 */
export async function saveSiteSettings(client: SupabaseClient, values: SiteSettings): Promise<SiteSettings> {
  const { data, error } = await client
    .from(WEBSITE_SETTINGS_TABLE)
    .upsert(toRowPayload(values), { onConflict: "id" })
    .select("*")
    .single();

  if (error) throw error;
  return mapRowToSiteSettings(data);
}

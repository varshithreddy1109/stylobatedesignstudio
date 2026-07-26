import type { Metadata } from "next";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";
import { createClient } from "@/lib/supabase/server";
import { fetchSiteSettings } from "@/lib/supabase/siteSettings";

export const metadata: Metadata = {
  title: "Settings | Admin",
};

// Always fetch fresh data so this form reflects the latest save the moment
// the admin returns to it.
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const supabase = createClient();
  const siteSettings = await fetchSiteSettings(supabase);

  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <AdminPageHeader
        eyebrow="Settings"
        title="Website Settings"
        description="Manage site-wide theme colors, footer text, and SEO defaults."
      />
      <SiteSettingsForm initialData={siteSettings} />
    </div>
  );
}

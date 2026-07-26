import type { Metadata } from "next";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ServicesTable from "@/components/admin/ServicesTable";
import { createClient } from "@/lib/supabase/server";
import { fetchAllServices } from "@/lib/supabase/services";

export const metadata: Metadata = {
  title: "Services Management | Admin",
};

// Always fetch fresh data so this list reflects the latest add/edit/delete
// the moment the admin returns to it.
export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const supabase = createClient();
  const services = await fetchAllServices(supabase);

  return (
    <div className="flex flex-col gap-10">
      <AdminPageHeader
        eyebrow="Services"
        title="Services Management"
        description="Add, edit, and reorder the services listed on the Home page."
        actionLabel="Add Service"
        actionHref="/admin/services/new"
      />
      <ServicesTable initial={services} />
    </div>
  );
}

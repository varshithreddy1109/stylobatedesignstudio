import type { Metadata } from "next";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ServiceForm from "@/components/admin/ServiceForm";
import { createClient } from "@/lib/supabase/server";
import { fetchServiceById } from "@/lib/supabase/services";

export const metadata: Metadata = {
  title: "Edit Service | Admin",
};

// Services are created dynamically through the Admin Panel, so this route
// can't be statically pre-rendered — always fetch the current row.
export const dynamic = "force-dynamic";

export default async function EditServicePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const service = await fetchServiceById(supabase, params.id);

  if (!service) {
    return (
      <div className="flex flex-col gap-4">
        <AdminPageHeader eyebrow="Services" title="Service Not Found" />
        <p className="text-sm text-charcoal/70">
          No service matches this ID. It may have been deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="flex max-w-2xl flex-col gap-10">
      <AdminPageHeader
        eyebrow="Services"
        title={`Edit — ${service.title}`}
        description="Changes are saved directly to the live database."
      />
      <ServiceForm mode="edit" service={service} />
    </div>
  );
}

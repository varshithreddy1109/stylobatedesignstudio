import type { Metadata } from "next";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ServiceForm from "@/components/admin/ServiceForm";

export const metadata: Metadata = {
  title: "Add Service | Admin",
};

export default function AddServicePage() {
  return (
    <div className="flex max-w-2xl flex-col gap-10">
      <AdminPageHeader
        eyebrow="Services"
        title="Add Service"
        description="Create a new service entry. Service Icon is optional — a default icon is shown automatically if none is uploaded."
      />
      <ServiceForm mode="add" />
    </div>
  );
}

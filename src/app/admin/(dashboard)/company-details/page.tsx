import type { Metadata } from "next";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import CompanyDetailsForm from "@/components/admin/CompanyDetailsForm";
import { createClient } from "@/lib/supabase/server";
import { fetchCompanyDetails } from "@/lib/supabase/companyDetails";

export const metadata: Metadata = {
  title: "Company Details | Admin",
};

// Always fetch fresh data so this form reflects the latest save the moment
// the admin returns to it.
export const dynamic = "force-dynamic";

export default async function AdminCompanyDetailsPage() {
  const supabase = createClient();
  const companyDetails = await fetchCompanyDetails(supabase);

  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <AdminPageHeader
        eyebrow="Company Details"
        title="Company Details"
        description="Edit the studio's identity, contact information, and social links shown across the site."
      />
      <CompanyDetailsForm initialData={companyDetails} />
    </div>
  );
}

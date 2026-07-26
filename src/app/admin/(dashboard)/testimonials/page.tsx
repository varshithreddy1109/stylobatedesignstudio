import type { Metadata } from "next";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import TestimonialsTable from "@/components/admin/TestimonialsTable";
import { createClient } from "@/lib/supabase/server";
import { fetchAllTestimonials } from "@/lib/supabase/testimonials";

export const metadata: Metadata = {
  title: "Testimonials Management | Admin",
};

// Always fetch fresh data so this list reflects the latest add/edit/delete
// the moment the admin returns to it.
export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const supabase = createClient();
  const testimonials = await fetchAllTestimonials(supabase);

  return (
    <div className="flex flex-col gap-10">
      <AdminPageHeader
        eyebrow="Testimonials"
        title="Testimonials Management"
        description="Add, edit, and manage the client quotes shown on the Home and Testimonials pages."
        actionLabel="Add Testimonial"
        actionHref="/admin/testimonials/new"
      />
      <TestimonialsTable initial={testimonials} />
    </div>
  );
}

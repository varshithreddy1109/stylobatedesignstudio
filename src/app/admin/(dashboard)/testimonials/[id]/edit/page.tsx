import type { Metadata } from "next";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import TestimonialForm from "@/components/admin/TestimonialForm";
import { createClient } from "@/lib/supabase/server";
import { fetchTestimonialById } from "@/lib/supabase/testimonials";

export const metadata: Metadata = {
  title: "Edit Testimonial | Admin",
};

// Testimonials are created dynamically through the Admin Panel, so this
// route can't be statically pre-rendered — always fetch the current row.
export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const testimonial = await fetchTestimonialById(supabase, params.id);

  if (!testimonial) {
    return (
      <div className="flex flex-col gap-4">
        <AdminPageHeader eyebrow="Testimonials" title="Testimonial Not Found" />
        <p className="text-sm text-charcoal/70">
          No testimonial matches this ID. It may have been deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="flex max-w-2xl flex-col gap-10">
      <AdminPageHeader
        eyebrow="Testimonials"
        title={`Edit — ${testimonial.name}`}
        description="Changes are saved directly to the live database."
      />
      <TestimonialForm mode="edit" testimonial={testimonial} />
    </div>
  );
}

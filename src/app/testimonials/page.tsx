import type { Metadata } from "next";
import Avatar from "@/components/ui/Avatar";
import ContactCTA from "@/components/sections/home/ContactCTA";
import { createClient } from "@/lib/supabase/server";
import { fetchAllTestimonials } from "@/lib/supabase/testimonials";

export const metadata: Metadata = {
  title: "Testimonials | STYLOBATE DESIGN STUDIO",
  description: "What clients say about working with STYLOBATE DESIGN STUDIO.",
};

// Always fetch fresh data so admin add/edit/delete actions are reflected
// immediately, with no stale cache.
export const dynamic = "force-dynamic";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-brass" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      <span className="text-hairline">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default async function TestimonialsPage() {
  const supabase = createClient();
  const testimonials = await fetchAllTestimonials(supabase);

  return (
    <>
      <section className="container-studio pb-16 pt-32 md:pb-20 md:pt-40">
        <span className="label-tag">Client Notes</span>
        <h1 className="mt-5 max-w-3xl font-display text-4xl font-medium leading-[1.1] text-ink md:text-6xl">
          Told in the words of the people we&apos;ve built with.
        </h1>
      </section>

      <section className="container-studio pb-24 md:pb-32">
        {testimonials.length === 0 ? (
          <div className="flex flex-col items-center gap-3 border border-dashed border-hairline py-24 text-center">
            <span className="label-tag">Testimonials</span>
            <p className="text-base text-charcoal/70 md:text-lg">
              No testimonials have been added yet.
            </p>
            <p className="max-w-sm text-sm text-charcoal/50">
              Check back soon — client stories are added regularly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8">
            {testimonials.map((t) => (
              <figure
                key={t.id}
                className="flex flex-col gap-6 border border-hairline p-8 md:p-10"
              >
                <Stars rating={t.rating} />
                <blockquote className="font-display text-xl font-medium leading-snug text-ink md:text-2xl">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-4 border-t border-hairline pt-6">
                  <Avatar name={t.name} src={t.avatar} size={48} />
                  <div>
                    <p className="text-sm font-medium text-ink">{t.name}</p>
                    <p className="font-mono text-[11px] uppercase tracking-widest2 text-stone">
                      {t.role}
                      {t.role && t.company ? " — " : ""}
                      {t.company}
                    </p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>

      <ContactCTA />
    </>
  );
}

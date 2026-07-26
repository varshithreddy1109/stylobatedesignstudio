import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import type { Testimonial } from "@/types";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-brass" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      <span className="text-hairline">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default function TestimonialsPreview({ testimonials }: { testimonials: Testimonial[] }) {
  // No featured testimonials yet (fresh Supabase project, nothing added
  // through the Admin Panel) — skip the section rather than showing an
  // empty grid.
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="container-studio py-24 md:py-32">
      <SectionTitle
        eyebrow="Client Notes"
        title="What it's like to build with us."
        align="center"
      />

      <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
        {testimonials.map((t) => (
          <figure
            key={t.id}
            className="flex flex-col gap-6 border border-hairline p-8 md:p-10"
          >
            <Stars rating={t.rating} />
            <blockquote className="font-display text-xl font-medium leading-snug text-ink md:text-2xl">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-4">
              <Avatar name={t.name} src={t.avatar} size={44} />
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

      <div className="mt-12 flex justify-center">
        <Button href="/testimonials" variant="secondary">
          Read All Testimonials
        </Button>
      </div>
    </section>
  );
}

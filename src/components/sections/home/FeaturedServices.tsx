import SectionTitle from "@/components/ui/SectionTitle";
import ServiceIcon from "@/components/ui/ServiceIcon";
import type { Service } from "@/types";

export default function FeaturedServices({ services }: { services: Service[] }) {
  // No services added yet (fresh Supabase project, nothing added through
  // the Admin Panel) — skip the section rather than showing an empty grid.
  if (services.length === 0) {
    return null;
  }

  return (
    <section className="bg-charcoal/[0.03] py-24 md:py-32">
      <div className="container-studio">
        <SectionTitle
          eyebrow="What We Do"
          title="Services shaped around one continuous process."
          align="left"
        />

        <div className="mt-16 grid grid-cols-1 divide-y divide-hairline border-t border-hairline md:grid-cols-2 md:divide-x md:divide-y-0">
          {services.map((service, idx) => (
            <div
              key={service.id}
              className="group flex flex-col gap-4 py-10 transition-colors duration-300 md:px-10 md:py-14 md:first:pl-0 hover:bg-paper"
            >
              <div className="flex items-center justify-between">
                <span className="label-tag">{`S-${String(idx + 1).padStart(2, "0")}`}</span>
                <span className="h-px w-10 bg-hairline transition-all duration-300 group-hover:w-16 group-hover:bg-brass" />
              </div>
              <ServiceIcon icon={service.icon} label={service.title} size={44} />
              <h3 className="font-display text-2xl font-medium text-ink md:text-[1.7rem]">
                {service.title}
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-charcoal/70 md:text-base">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

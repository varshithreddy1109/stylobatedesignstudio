import SectionTitle from "@/components/ui/SectionTitle";

const DEFAULT_ABOUT =
  "STYLOBATE DESIGN STUDIO is an architecture practice working across residential, commercial, and institutional projects. We believe good buildings are drawn from their site — its climate, material history, and the people who will use it.";

interface IntroProps {
  about?: string;
  yearsExperience?: number;
  awards?: number;
  totalProjects: number;
}

export default function Intro({ about, yearsExperience, awards, totalProjects }: IntroProps) {
  const stats = [
    { value: totalProjects > 0 ? `${totalProjects}+` : String(totalProjects), label: "Projects" },
    ...(yearsExperience ? [{ value: String(yearsExperience), label: "Years" }] : []),
    ...(awards ? [{ value: String(awards), label: "Awards" }] : []),
  ];

  const gridColsClass =
    stats.length === 3 ? "grid-cols-3" : stats.length === 2 ? "grid-cols-2" : "grid-cols-1";

  return (
    <section className="container-studio py-24 md:py-32">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <SectionTitle eyebrow="The Studio" title="Considered, site-specific design." />
        </div>
        <div className="md:col-span-6 md:col-start-7 flex flex-col gap-6">
          <p className="text-lg leading-relaxed text-charcoal/80 md:text-xl">
            {about || DEFAULT_ABOUT}
          </p>
          <p className="text-base leading-relaxed text-charcoal/70">
            Every project moves through the same disciplined process, from
            first site visit to final handover, with direct principal
            oversight throughout.
          </p>
          <div className={`mt-4 grid ${gridColsClass} gap-6 border-t border-hairline pt-6`}>
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl font-medium text-ink">{stat.value}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-widest2 text-stone">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

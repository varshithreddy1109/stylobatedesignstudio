import SectionTitle from "@/components/ui/SectionTitle";
import { processSteps } from "@/data/about";

export default function Process() {
  return (
    <section className="container-studio py-20 md:py-28">
      <SectionTitle
        eyebrow="Our Process"
        title="Five stages, one team, start to finish."
        description="Because this is a real sequence — each stage depends on the one before it — we mark it the way our drawing sets do."
      />

      <div className="mt-14 flex flex-col divide-y divide-hairline border-t border-hairline">
        {processSteps.map((step) => (
          <div
            key={step.id}
            className="flex flex-col gap-3 py-8 md:flex-row md:items-baseline md:gap-10 md:py-10"
          >
            <span className="font-mono text-sm text-brass md:w-16 md:shrink-0">
              {step.code}
            </span>
            <h3 className="font-display text-xl font-medium text-ink md:w-64 md:shrink-0 md:text-2xl">
              {step.title}
            </h3>
            <p className="max-w-xl text-sm leading-relaxed text-charcoal/70 md:text-base">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

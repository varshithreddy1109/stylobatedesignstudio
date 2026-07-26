import SectionTitle from "@/components/ui/SectionTitle";

const reasons = [
  {
    code: "01",
    title: "Principal-led, start to finish",
    description:
      "A founding principal stays on your project from first sketch to final handover — no hand-offs.",
  },
  {
    code: "02",
    title: "Material and climate first",
    description:
      "Every design decision is tested against site orientation, local material, and long-term maintenance.",
  },
  {
    code: "03",
    title: "Transparent, fixed-stage pricing",
    description:
      "Fees are agreed by design stage upfront, with no ambiguity between concept and construction drawings.",
  },
  {
    code: "04",
    title: "On-site through construction",
    description:
      "We supervise construction directly, so the built work matches the drawings we hand you.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-ink py-24 text-paper md:py-32">
      <div className="container-studio">
        <SectionTitle
          eyebrow="Why Choose Us"
          title="A practice built around accountability."
          light
        />

        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <div key={reason.code} className="flex flex-col gap-4 border-t border-white/15 pt-6">
              <span className="font-mono text-xs text-brass-light">{reason.code}</span>
              <h3 className="font-display text-xl font-medium">{reason.title}</h3>
              <p className="text-sm leading-relaxed text-stone">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

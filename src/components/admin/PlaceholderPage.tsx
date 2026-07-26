import Link from "next/link";
import SectionTitle from "@/components/ui/SectionTitle";

interface PlaceholderPageProps {
  eyebrow: string;
  title: string;
  description: string;
  plannedFeatures: string[];
}

export default function PlaceholderPage({
  eyebrow,
  title,
  description,
  plannedFeatures,
}: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-10">
      <SectionTitle eyebrow={eyebrow} title={title} description={description} />

      <div className="flex flex-col gap-6 border border-dashed border-hairline p-8 md:p-10">
        <span className="label-tag">Coming in the Next Phase</span>
        <p className="max-w-xl text-sm leading-relaxed text-charcoal/70">
          This section is UI scaffolding only. Full functionality — including
          Supabase-backed data, forms, and image uploads — will be
          implemented once the production backend is connected.
        </p>
        <ul className="flex flex-col gap-3">
          {plannedFeatures.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm text-charcoal/75">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <Link
        href="/admin"
        className="inline-flex w-fit items-center gap-2 text-sm text-charcoal/70 underline decoration-hairline decoration-1 underline-offset-4 transition-colors duration-300 hover:text-ink hover:decoration-brass"
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
}

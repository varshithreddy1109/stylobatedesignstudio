const DEFAULT_STORY =
  "Our story began with a shared belief that architecture should respond directly to its site — its climate, material history, and the people who will use it. That principle has guided every project since, from first sketch to final handover.";

export default function Story({ story }: { story?: string }) {
  return (
    <section className="container-studio py-20 md:py-28">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 text-center">
        <span className="label-tag mx-auto">Our Story</span>
        <h2 className="font-display text-3xl font-medium text-ink md:text-4xl">
          Started with one guiding principle, still working the same way.
        </h2>
        <p className="text-base leading-relaxed text-charcoal/75 md:text-lg">
          {story || DEFAULT_STORY}
        </p>
      </div>
    </section>
  );
}

const DEFAULT_ABOUT =
  "STYLOBATE DESIGN STUDIO is an architecture practice working across residential, commercial, and institutional projects, grounded in site, material, and climate.";

export default function AboutHeader({ about }: { about?: string }) {
  return (
    <section className="container-studio pb-16 pt-32 md:pb-20 md:pt-40">
      <span className="label-tag">About the Studio</span>
      <h1 className="mt-5 max-w-3xl font-display text-4xl font-medium leading-[1.1] text-ink md:text-6xl">
        Considered architecture, one project at a time.
      </h1>
      <p className="mt-8 max-w-2xl text-base leading-relaxed text-charcoal/75 md:text-lg">
        {about || DEFAULT_ABOUT}
      </p>
    </section>
  );
}

import Button from "@/components/ui/Button";

export default function ContactCTA() {
  return (
    <section className="relative overflow-hidden bg-brass py-24 text-ink md:py-28">
      <span className="blueprint-corner left-6 top-6 hidden text-ink/50 md:block">C1</span>
      <span className="blueprint-corner right-6 bottom-6 hidden text-ink/50 md:block">C2</span>

      <div className="container-studio flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <span className="label-tag text-ink/70">Start a Project</span>
          <h2 className="mt-4 font-display text-3xl font-medium leading-tight md:text-4xl">
            Have a site in mind? Let&apos;s talk about what it could become.
          </h2>
        </div>
        <Button
          href="/contact"
          variant="primary"
          className="!bg-ink !text-paper !border-ink hover:!bg-paper hover:!text-ink"
        >
          Get in Touch
        </Button>
      </div>
    </section>
  );
}

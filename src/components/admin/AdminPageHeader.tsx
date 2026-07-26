import Button from "@/components/ui/Button";

interface AdminPageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function AdminPageHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
      <div>
        <span className="label-tag">{eyebrow}</span>
        <h1 className="mt-4 font-display text-3xl font-medium text-ink md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-charcoal/70 md:text-base">
            {description}
          </p>
        )}
      </div>
      {actionLabel && actionHref && (
        <Button href={actionHref} variant="primary" className="shrink-0">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

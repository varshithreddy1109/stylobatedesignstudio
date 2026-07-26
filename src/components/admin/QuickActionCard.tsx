import { QuickAction } from "@/data/admin";
import Button from "@/components/ui/Button";

export default function QuickActionCard({ action }: { action: QuickAction }) {
  return (
    <div className="group flex flex-col gap-4 border border-hairline p-6 transition-colors duration-300 hover:border-brass md:p-7">
      <div className="flex items-center justify-between">
        <span className="label-tag">{action.index}</span>
        <span className="h-px w-8 bg-hairline transition-all duration-300 group-hover:w-14 group-hover:bg-brass" />
      </div>
      <h3 className="font-display text-lg font-medium text-ink md:text-xl">
        {action.title}
      </h3>
      <p className="text-sm leading-relaxed text-charcoal/70">
        {action.description}
      </p>
      <Button href={action.href} variant="secondary" className="mt-2 self-start !px-5 !py-2.5 text-xs">
        {action.cta}
      </Button>
    </div>
  );
}

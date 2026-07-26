interface ServiceIconProps {
  icon?: string;
  label: string;
  size?: number;
  className?: string;
}

export default function ServiceIcon({ icon, label, size = 44, className = "" }: ServiceIconProps) {
  if (icon) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden border border-hairline bg-charcoal/5 ${className}`}
        style={{ width: size, height: size }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- icon sources vary (Supabase Storage, external URLs); a plain img keeps this component simple and safe everywhere */}
        <img src={icon} alt={label} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center border border-hairline bg-charcoal/5 text-stone ${className}`}
      style={{ width: size, height: size }}
      aria-label={label}
    >
      <svg viewBox="0 0 24 24" fill="none" style={{ width: size * 0.5, height: size * 0.5 }}>
        <path
          d="M12 2 3 7.5v9L12 22l9-5.5v-9L12 2Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M12 2v20M3 7.5 12 12l9-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

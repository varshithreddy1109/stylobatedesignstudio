function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
  className?: string;
}

export default function Avatar({ name, src, size = 44, className = "" }: AvatarProps) {
  if (src) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-full bg-charcoal/10 ${className}`}
        style={{ width: size, height: size }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- avatar sources vary (Supabase Storage, external URLs); a plain img keeps this component simple and safe everywhere */}
        <img src={src} alt={name} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-brass/15 font-display font-medium text-brass-dark ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
}

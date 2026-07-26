import Image from "next/image";

// Source image is 1206×741px.
const LOGO_ASPECT_RATIO = 1206 / 741;

interface LogoProps {
  height?: number;
  className?: string;
  priority?: boolean;
}

/**
 * Renders the logo at a given intrinsic size (for image quality), while
 * `className` (typically responsive Tailwind h-* + w-auto utilities)
 * controls the actual on-page display size per breakpoint.
 */
export default function Logo({ height = 80, className = "h-12 w-auto", priority = false }: LogoProps) {
  const width = Math.round(height * LOGO_ASPECT_RATIO);

  return (
    <Image
      src="/images/logo.jpg"
      alt="Stylobate Design Studio"
      width={width}
      height={height}
      priority={priority}
      className={`object-contain ${className}`}
    />
  );
}


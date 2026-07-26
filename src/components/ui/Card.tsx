import Image from "next/image";
import { ReactNode } from "react";

interface CardProps {
  image?: string;
  imageAlt?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  footer?: ReactNode;
  aspect?: "square" | "portrait" | "landscape";
  className?: string;
}

const aspectStyles: Record<NonNullable<CardProps["aspect"]>, string> = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
};

export default function Card({
  image,
  imageAlt = "",
  eyebrow,
  title,
  description,
  footer,
  aspect = "landscape",
  className = "",
}: CardProps) {
  return (
    <div className={`group flex flex-col ${className}`}>
      {image && (
        <div
          className={`relative w-full overflow-hidden bg-charcoal/5 ${aspectStyles[aspect]}`}
        >
          <Image
            src={image}
            alt={imageAlt || title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-studio group-hover:scale-105"
          />
          <div className="absolute inset-0 border border-ink/0 transition-colors duration-500 group-hover:border-ink/10" />
        </div>
      )}
      <div className="flex flex-col gap-2 pt-5">
        {eyebrow && <span className="label-tag">{eyebrow}</span>}
        <h3 className="font-display text-xl md:text-[1.35rem] font-medium text-ink">
          {title}
        </h3>
        {description && (
          <p className="text-sm md:text-base text-charcoal/75 leading-relaxed">
            {description}
          </p>
        )}
        {footer && <div className="pt-2">{footer}</div>}
      </div>
    </div>
  );
}

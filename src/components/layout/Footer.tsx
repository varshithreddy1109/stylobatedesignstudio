import Link from "next/link";
import { navLinks } from "@/data/navLinks";
import Logo from "@/components/ui/Logo";
import type { CompanyDetails, SiteSettings } from "@/types";

interface SocialLink {
  label: string;
  href: string;
  icon: JSX.Element;
}

function buildSocialLinks(companyDetails: CompanyDetails): SocialLink[] {
  const links: SocialLink[] = [];

  if (companyDetails.instagram) {
    links.push({
      label: "Instagram",
      href: companyDetails.instagram,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
        </svg>
      ),
    });
  }

  if (companyDetails.facebook) {
    links.push({
      label: "Facebook",
      href: companyDetails.facebook,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
          <path d="M13.5 8.5h1.5V6h-1.7c-1.6 0-2.8 1.2-2.8 2.8V11H9v2.5h1.5V18h2.5v-4.5h1.7l.3-2.5h-2V9c0-.3.2-.5.5-.5Z" fill="currentColor" />
        </svg>
      ),
    });
  }

  if (companyDetails.linkedin) {
    links.push({
      label: "LinkedIn",
      href: companyDetails.linkedin,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.4" />
          <path d="M7.5 10v6.5M7.5 7.5v.01M11.5 16.5V10M11.5 12.8c0-1.5 1-2.8 2.7-2.8 1.6 0 2.3 1.1 2.3 2.8v3.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ),
    });
  }

  if (companyDetails.youtube) {
    links.push({
      label: "YouTube",
      href: companyDetails.youtube,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <rect x="3" y="6" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="1.4" />
          <path d="M10.5 9.8v4.4l4-2.2-4-2.2Z" fill="currentColor" />
        </svg>
      ),
    });
  }

  if (companyDetails.googleMapsLink) {
    links.push({
      label: "Google Maps",
      href: companyDetails.googleMapsLink,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path
            d="M12 21s-7-6.2-7-11.2A7 7 0 0 1 19 9.8C19 14.8 12 21 12 21Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="9.6" r="2.2" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      ),
    });
  }

  return links;
}

interface FooterProps {
  companyDetails: CompanyDetails;
  siteSettings: SiteSettings;
}

export default function Footer({ companyDetails, siteSettings }: FooterProps) {
  const year = new Date().getFullYear();
  const socialLinks = buildSocialLinks(companyDetails);
  const hasContact = Boolean(companyDetails.email || companyDetails.phone);

  return (
    <footer className="bg-ink text-paper">
      <div className="container-studio py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
          {/* Brand + address */}
          <div className="md:col-span-2 flex flex-col gap-5">
            <Logo height={120} className="h-14 w-auto md:h-20" />
            <p className="max-w-sm text-sm leading-relaxed text-stone">
              A studio practising architecture, interiors, and masterplanning
              across India — grounded in place, material, and climate.
            </p>
            {companyDetails.address && (
              <address className="not-italic text-sm leading-relaxed text-stone">
                {companyDetails.address.split("\n").map((line, idx) => (
                  <span key={idx}>
                    {line}
                    <br />
                  </span>
                ))}
              </address>
            )}
          </div>

          {/* Sitemap */}
          <div className="flex flex-col gap-4">
            <span className="label-tag text-brass-light">Sitemap</span>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone transition-colors duration-300 hover:text-paper"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + social */}
          <div className="flex flex-col gap-4">
            <span className="label-tag text-brass-light">Contact</span>
            {hasContact && (
              <ul className="flex flex-col gap-3 text-sm text-stone">
                {companyDetails.email && (
                  <li>
                    <a href={`mailto:${companyDetails.email}`} className="transition-colors duration-300 hover:text-paper">
                      {companyDetails.email}
                    </a>
                  </li>
                )}
                {companyDetails.phone && (
                  <li>
                    <a href={`tel:${companyDetails.phone.replace(/\s+/g, "")}`} className="transition-colors duration-300 hover:text-paper">
                      {companyDetails.phone}
                    </a>
                  </li>
                )}
              </ul>
            )}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-4 pt-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center border border-white/15 text-stone transition-colors duration-300 hover:border-brass hover:text-brass-light"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse items-start gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[11px] tracking-wide text-stone/70">
            {siteSettings.footerText || `© ${year} STYLOBATE DESIGN STUDIO. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}

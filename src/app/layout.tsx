import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import { createClient } from "@/lib/supabase/server";
import { fetchCompanyDetails } from "@/lib/supabase/companyDetails";
import { fetchSiteSettings } from "@/lib/supabase/siteSettings";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const DEFAULT_TITLE = "STYLOBATE DESIGN STUDIO";
const DEFAULT_DESCRIPTION =
  "A premium architecture practice designing considered, enduring spaces — residential, commercial, and institutional work grounded in place and material.";

// SEO title/description come from Website Settings, and the favicon from
// Company Details — both live in Supabase. Falls back to the defaults above
// until the admin saves each page for the first time.
export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient();
  const [siteSettings, companyDetails] = await Promise.all([
    fetchSiteSettings(supabase),
    fetchCompanyDetails(supabase),
  ]);

  return {
    title: siteSettings.seoTitle || DEFAULT_TITLE,
    description: siteSettings.seoDescription || DEFAULT_DESCRIPTION,
    keywords: [
      "architecture studio",
      "premium architecture firm",
      "residential architecture",
      "commercial architecture",
      "interior architecture",
    ],
    icons: companyDetails.favicon ? { icon: companyDetails.favicon } : undefined,
  };
}

// Always fetch fresh Company Details / Website Settings so the Footer and
// metadata reflect the latest admin save immediately, with no stale cache.
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const [companyDetails, siteSettings] = await Promise.all([
    fetchCompanyDetails(supabase),
    fetchSiteSettings(supabase),
  ]);

  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable} font-body antialiased bg-paper text-ink`}
      >
        <SiteChrome companyDetails={companyDetails} siteSettings={siteSettings}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}

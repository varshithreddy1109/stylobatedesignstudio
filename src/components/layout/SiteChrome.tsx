"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { CompanyDetails, SiteSettings } from "@/types";

interface SiteChromeProps {
  children: React.ReactNode;
  companyDetails: CompanyDetails;
  siteSettings: SiteSettings;
}

/**
 * Renders the public site chrome (Navbar + Footer) everywhere except the
 * /admin section, which uses its own Sidebar-based shell
 * (see src/app/admin/(dashboard)/layout.tsx and src/app/admin/login).
 */
export default function SiteChrome({ children, companyDetails, siteSettings }: SiteChromeProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer companyDetails={companyDetails} siteSettings={siteSettings} />
    </>
  );
}

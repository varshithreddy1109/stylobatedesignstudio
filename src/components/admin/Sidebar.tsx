"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavLinks, adminLogoutLink, AdminNavLink } from "@/data/admin";
import { useAuth } from "@/lib/auth/AuthProvider";
import Logo from "@/components/ui/Logo";

const icons: Record<AdminNavLink["icon"], JSX.Element> = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px] shrink-0">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  projects: (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px] shrink-0">
      <path d="M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M4 12l8 4.5 8-4.5M4 16.5 12 21l8-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  testimonials: (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px] shrink-0">
      <path
        d="M7 15h1.6L10 12.4V8H4v4.4h2.4L7 15Zm8 0h1.6L18 12.4V8h-6v4.4h2.4L15 15Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  ),
  services: (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px] shrink-0">
      <path
        d="M12 3.5 4 7v6c0 4.2 3.4 7 8 8.5 4.6-1.5 8-4.3 8-8.5V7l-8-3.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M9 12.2l2 2 4-4.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  company: (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px] shrink-0">
      <rect x="5" y="3.5" width="10" height="17" stroke="currentColor" strokeWidth="1.4" />
      <path d="M15 9.5h4v11h-4M8 7.5h1M11 7.5h1M8 10.5h1M11 10.5h1M8 13.5h1M11 13.5h1M8 16.5h1M11 16.5h1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px] shrink-0">
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M12 3.5v2M12 18.5v2M20.5 12h-2M5.5 12h-2M17.7 6.3l-1.4 1.4M7.7 16.3l-1.4 1.4M17.7 17.7l-1.4-1.4M7.7 7.7 6.3 6.3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px] shrink-0">
      <path d="M9 4H5.5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M14.5 8 19 12l-4.5 4M19 12H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href);

  const content = (
    <div className="flex h-full flex-col bg-ink text-paper">
      {/* Brand + collapse toggle */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-6">
        <Link href="/admin" className="shrink-0">
          <Logo height={80} className={collapsed ? "h-8 w-auto" : "h-10 w-auto md:h-12"} />
        </Link>
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden h-8 w-8 items-center justify-center border border-white/15 text-stone transition-colors duration-300 hover:border-brass hover:text-brass-light md:flex"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={`h-4 w-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          >
            <path d="M14 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {/* Mobile close */}
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close menu"
          className="flex h-8 w-8 items-center justify-center text-stone md:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-6">
        <ul className="flex flex-col gap-1">
          {adminNavLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`group flex items-center gap-3 px-3 py-3 text-sm tracking-wide transition-colors duration-300 ${
                    active
                      ? "bg-paper/[0.08] text-paper"
                      : "text-stone hover:bg-paper/[0.04] hover:text-paper"
                  } ${collapsed ? "justify-center" : ""}`}
                  title={collapsed ? link.label : undefined}
                >
                  <span className={active ? "text-brass-light" : "text-stone group-hover:text-brass-light"}>
                    {icons[link.icon]}
                  </span>
                  {!collapsed && <span>{link.label}</span>}
                  {!collapsed && active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brass" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-white/10 px-3 py-5">
        <button
          type="button"
          onClick={() => signOut()}
          className={`flex w-full items-center gap-3 px-3 py-3 text-sm tracking-wide text-stone transition-colors duration-300 hover:bg-paper/[0.04] hover:text-paper ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? adminLogoutLink.label : undefined}
        >
          <span className="text-stone">{icons.logout}</span>
          {!collapsed && <span>{adminLogoutLink.label}</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 border-r border-white/10 transition-all duration-300 ease-studio md:block ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {content}
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!mobileOpen}
      >
        <div
          className={`absolute inset-0 bg-ink/60 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={onCloseMobile}
        />
        <div
          className={`absolute left-0 top-0 h-full w-72 max-w-[80vw] transition-transform duration-300 ease-studio ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {content}
        </div>
      </div>
    </>
  );
}

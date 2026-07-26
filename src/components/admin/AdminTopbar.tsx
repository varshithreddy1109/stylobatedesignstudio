"use client";

import { usePathname } from "next/navigation";
import { adminNavLinks } from "@/data/admin";

interface AdminTopbarProps {
  onOpenMobile: () => void;
}

function currentTitle(pathname: string | null): string {
  if (!pathname) return "Dashboard";
  const match = adminNavLinks.find((link) =>
    link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href)
  );
  return match?.label ?? "Dashboard";
}

export default function AdminTopbar({ onOpenMobile }: AdminTopbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-hairline bg-paper/95 px-5 py-4 backdrop-blur-sm md:hidden">
      <button
        type="button"
        onClick={onOpenMobile}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center border border-hairline text-ink"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      <span className="label-tag">{currentTitle(pathname)}</span>
      <span className="w-9" />
    </header>
  );
}

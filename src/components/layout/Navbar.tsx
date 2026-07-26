"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks } from "@/data/navLinks";
import Logo from "@/components/ui/Logo";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-studio ${
        scrolled
          ? "bg-paper/90 backdrop-blur-md border-b border-hairline"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="container-studio flex items-center justify-between h-20 md:h-24">
        <Link href="/" className="shrink-0">
          <Logo height={96} priority className="h-12 w-auto md:h-16" />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative text-sm tracking-wide transition-colors duration-300 ${
                    active ? "text-ink" : "text-charcoal/70 hover:text-ink"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px bg-brass transition-all duration-300 ease-studio ${
                      active ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="/contact"
          className="hidden md:inline-flex items-center border border-ink px-6 py-2.5 text-sm tracking-wide text-ink transition-colors duration-300 hover:bg-ink hover:text-paper"
        >
          Start a Project
        </Link>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className="md:hidden relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5"
        >
          <span
            className={`block h-px w-6 bg-ink transition-transform duration-300 ease-studio ${
              isOpen ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-6 bg-ink transition-transform duration-300 ease-studio ${
              isOpen ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden fixed inset-0 top-20 bg-paper transition-transform duration-500 ease-studio ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className="container-studio flex flex-col gap-1 pt-8">
          {navLinks.map((link, idx) => (
            <li
              key={link.href}
              className="border-b border-hairline py-5 flex items-center justify-between"
            >
              <Link
                href={link.href}
                className="font-display text-2xl text-ink"
              >
                {link.label}
              </Link>
              <span className="label-tag">{String(idx + 1).padStart(2, "0")}</span>
            </li>
          ))}
        </ul>
        <div className="container-studio pt-8">
          <Link
            href="/contact"
            className="inline-flex w-full items-center justify-center border border-ink px-6 py-4 text-sm tracking-wide text-ink"
          >
            Start a Project
          </Link>
        </div>
      </div>
    </header>
  );
}

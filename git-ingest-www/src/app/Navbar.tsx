"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#get-started", label: "Get Started" },
  { href: "#demo", label: "Demo" },
  { href: "#docs", label: "Docs" },
  {
    href: "https://github.com/AungMyoKyaw/git-ingest",
    label: "GitHub",
    external: true
  }
];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  // Determine current page for aria-current
  const isCurrent = (href: string) => {
    if (!hydrated) return false;
    if (href === "/" && window.location.pathname === "/") return true;
    if (href.startsWith("#")) return window.location.hash === href;
    return false;
  };

  return (
    <nav
      className="sticky top-0 z-50 w-full shadow-md"
      style={{
        background:
          "linear-gradient(to bottom, var(--background), var(--background)cc)",
        backdropFilter: "blur(8px)"
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-[var(--accent-primary)] font-mono text-2xl font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
        >
          Git-Ingest
        </Link>
        <button
          type="button"
          className="md:hidden text-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          aria-label="Toggle navigation menu"
          onClick={() => setOpen(!open)}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Open navigation menu</title>
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <ul className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="relative px-2 py-2 text-[var(--text-primary)] font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] rounded hover:scale-105 hover:text-[var(--accent-primary)]"
                aria-current={isCurrent(link.href) ? "page" : undefined}
                tabIndex={0}
              >
                <span className="transition-all duration-200 border-b-2 border-transparent hover:border-[var(--accent-primary)] focus:border-[var(--accent-primary)]">
                  {link.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* Mobile menu with framer-motion animation */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="md:hidden flex flex-col bg-[var(--background)] px-4 pb-4 shadow-lg"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "100%"
            }}
          >
            {navLinks.map((link) => (
              <li key={link.href} className="py-4">
                <Link
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="block w-full text-[var(--text-primary)] font-medium text-lg px-2 py-4 rounded transition-all duration-150 hover:bg-[var(--background-secondary)] hover:text-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                  aria-current={isCurrent(link.href) ? "page" : undefined}
                  tabIndex={0}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
}

"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Installation", href: "#installation" },
  { name: "Performance", href: "#performance" },
  { name: "Security", href: "#security" }
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-background/80 backdrop-blur border-b border-border/50 sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo/Brand */}
        <Link
          href="/"
          className="flex items-center space-x-2 font-bold text-xl"
        >
          <span className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center text-white">
            GI
          </span>
          <span className="text-foreground">Git-Ingest</span>
        </Link>
        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
        {/* Hamburger Button */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>
      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden bg-background border-t border-border/50 transition-all duration-300 ${menuOpen ? "max-h-60 py-2" : "max-h-0 overflow-hidden py-0"}`}
        role="menu"
        aria-hidden={!menuOpen}
      >
        <ul className="flex flex-col items-center space-y-2">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className="block px-4 py-2 text-muted-foreground hover:text-primary transition-colors text-base font-medium"
                role="menuitem"
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

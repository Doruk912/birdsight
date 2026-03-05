"use client";

import { useState } from "react";
import Link from "next/link";
import { Bird, Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/app/constants/navigation";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-stone-800">
          <Bird className="text-emerald-600" size={26} strokeWidth={1.8} />
          <span className="text-xl tracking-tight">BirdSight</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="hover:text-emerald-600 transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#"
            className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Sign in
          </a>
          <a
            href="#"
            className="text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full transition-colors duration-200"
          >
            Join free
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-stone-700"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-stone-700 hover:text-emerald-600 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <hr className="border-stone-100" />
          <a href="#" className="text-sm font-medium text-stone-700">Sign in</a>
          <a
            href="#"
            className="text-sm font-medium bg-emerald-600 text-white text-center px-4 py-2 rounded-full"
          >
            Join free
          </a>
        </div>
      )}
    </nav>
  );
}





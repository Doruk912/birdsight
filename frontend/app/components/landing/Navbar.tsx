"use client";

import { useState } from "react";
import Link from "next/link";
import { Bird, Menu, X, User, Binoculars, Settings, LogOut } from "lucide-react";
import { NAV_LINKS } from "@/app/constants/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import UserDropdown from "@/app/components/shared/UserDropdown";
import UserAvatar from "@/app/components/shared/UserAvatar";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();

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
              <a href={link.href} className="hover:text-emerald-600 transition-colors duration-200">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoading && (
            user ? (
              <UserDropdown user={user} logout={logout} />
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full transition-colors duration-200"
                >
                  Join free
                </Link>
              </>
            )
          )}
        </div>

        {/* Mobile toggle */}
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
          {!isLoading && (
            user ? (
              <>
                {/* Mobile user info */}
                <div className="flex items-center gap-3 py-1">
                  <UserAvatar
                    avatarUrl={user.avatarUrl}
                    displayName={user.displayName}
                    username={user.username}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-stone-800 truncate">
                      {user.displayName || user.username}
                    </p>
                    <p className="text-xs text-stone-500 truncate">{user.email}</p>
                  </div>
                </div>

                <hr className="border-stone-100" />

                {/* Mobile menu items */}
                <Link
                  href="/profile"
                  className="flex items-center gap-3 text-sm font-medium text-stone-700 hover:text-emerald-600 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <User size={16} strokeWidth={1.8} /> Profile
                </Link>
                <Link
                  href="/observations"
                  className="flex items-center gap-3 text-sm font-medium text-stone-700 hover:text-emerald-600 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <Binoculars size={16} strokeWidth={1.8} /> My Observations
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 text-sm font-medium text-stone-700 hover:text-emerald-600 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <Settings size={16} strokeWidth={1.8} /> Settings
                </Link>

                <hr className="border-stone-100" />

                <button
                  onClick={() => { setMobileOpen(false); logout(); }}
                  className="flex items-center gap-3 text-sm font-medium text-stone-700 hover:text-red-600 transition-colors text-left"
                >
                  <LogOut size={16} strokeWidth={1.8} /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-stone-700" onClick={() => setMobileOpen(false)}>
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-emerald-600 text-white text-center px-4 py-2 rounded-full"
                  onClick={() => setMobileOpen(false)}
                >
                  Join free
                </Link>
              </>
            )
          )}
        </div>
      )}
    </nav>
  );
}

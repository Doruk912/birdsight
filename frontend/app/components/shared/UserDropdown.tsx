"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { User, Binoculars, Settings, LogOut, ChevronDown } from "lucide-react";
import UserAvatar from "@/app/components/shared/UserAvatar";
import { AuthUser } from "@/app/types/auth";

interface UserDropdownProps {
  user: AuthUser;
  logout: () => void;
}

const menuItems = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "My Observations", href: "/observations", icon: Binoculars },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function UserDropdown({ user, logout }: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const displayLabel = user.displayName || user.username;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full px-1 py-1 hover:bg-stone-100 transition-colors duration-150"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <UserAvatar
          avatarUrl={user.avatarUrl}
          displayName={user.displayName}
          username={user.username}
          size="sm"
        />
        <span className="text-sm font-medium text-stone-700 max-w-[120px] truncate">
          {displayLabel}
        </span>
        <ChevronDown
          size={14}
          className={`text-stone-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-stone-200/60 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
          {/* User info header */}
          <div className="px-4 py-3 border-b border-stone-100">
            <p className="text-sm font-semibold text-stone-800 truncate">{displayLabel}</p>
            <p className="text-xs text-stone-500 truncate">{user.email}</p>
          </div>

          {/* Menu links */}
          <div className="py-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-emerald-600 transition-colors"
              >
                <item.icon size={16} strokeWidth={1.8} />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Sign out */}
          <div className="border-t border-stone-100 py-1">
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-red-600 transition-colors"
            >
              <LogOut size={16} strokeWidth={1.8} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


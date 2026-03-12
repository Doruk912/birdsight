"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

// /profile redirects to the logged-in user's own profile page,
// or to /login if not authenticated.
export default function ProfileRedirectPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      router.replace(`/profile/${user.username}`);
    } else {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  return null;
}

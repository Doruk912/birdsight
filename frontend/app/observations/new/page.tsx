"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import AddObservationForm from "@/app/components/observations/AddObservationForm";
import Navbar from "@/app/components/landing/Navbar";

export default function NewObservationPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/observations/new");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-stone-50/50">
        <Navbar />
        <div className="flex items-center justify-center pt-32 pb-20">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50/50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-20 mt-8">
        <AddObservationForm />
      </main>
    </div>
  );
}

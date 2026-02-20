"use client";

import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { useAuth } from "@/context/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { loading, profile } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const role = profile?.role ?? null;
    if (!role) {
      router.replace("/login");
      return;
    }

    if (profile?.status === "pending") {
      router.replace("/pending-approval");
      return;
    }

    if (profile?.status === "disabled") {
      router.replace("/login");
      return;
    }

    if (pathname.startsWith("/student")) {
      if (role === "student") {
        // Allow access
      } else if (role === "peer-mentor" && pathname === "/student/forums") {
        // Allow peer mentors to access forums
      } else {
        router.replace(`/${role}/dashboard`);
        return;
      }
    }
  }, [loading, profile?.role, profile?.status, pathname, router]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-0 md:overflow-auto">
        <div className="min-h-screen w-full">
          {loading ? (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
              <div className="text-center">
                {/* Loading spinner with brand colors */}
                <div className="relative mx-auto mb-6 h-16 w-16">
                  <div className="absolute inset-0 rounded-full border-4 border-brand-teal/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-teal animate-spin" />
                  <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-sun-400 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
                </div>
                <p className="font-display text-lg font-semibold text-white">Preparing your space…</p>
                <p className="mt-2 text-sm text-gray-500">
                  Getting everything ready for you
                </p>
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

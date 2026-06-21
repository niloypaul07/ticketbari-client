"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function DashboardLayout({ children }) {
  const { user, loading, syncing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect when fully loaded and not syncing
    if (!loading && !syncing && !user) {
      router.replace("/login");
    }
  }, [user, loading, syncing, router]);

  // Show spinner while auth is loading or syncing
  if (loading || syncing) return <LoadingSpinner label="Authenticating..." />;
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-default-50 dark:bg-background">
      <DashboardSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function DashboardRedirect() {
  const { user, loading, syncing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || syncing) return;
    if (!user) { router.replace("/login"); return; }
    if (user.role === "admin") router.replace("/dashboard/admin/profile");
    else if (user.role === "vendor") router.replace("/dashboard/vendor/profile");
    else router.replace("/dashboard/user/profile");
  }, [user, loading, syncing, router]);

  return <LoadingSpinner label="Redirecting to dashboard..." />;
}

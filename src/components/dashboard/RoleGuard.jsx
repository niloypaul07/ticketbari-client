"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function RoleGuard({ allowedRoles, children }) {
  const { user, loading, syncing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !syncing && user && !allowedRoles.includes(user.role)) {
      router.replace("/dashboard");
    }
  }, [user, loading, syncing, allowedRoles, router]);

  if (loading || syncing) return <LoadingSpinner label="Checking access..." />;
  if (!user || !allowedRoles.includes(user.role)) return null;

  return children;
}

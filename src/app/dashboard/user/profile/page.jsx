"use client";
import { useAuth } from "@/context/AuthContext";
import ProfileCard from "@/components/dashboard/ProfileCard";

export default function UserProfilePage() {
  const { user } = useAuth();
  return <ProfileCard user={user} title="My Profile" />;
}

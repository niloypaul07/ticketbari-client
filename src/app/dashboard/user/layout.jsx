import RoleGuard from "@/components/dashboard/RoleGuard";

export default function UserDashboardLayout({ children }) {
  return <RoleGuard allowedRoles={["user"]}>{children}</RoleGuard>;
}

import RoleGuard from "@/components/dashboard/RoleGuard";

export default function AdminDashboardLayout({ children }) {
  return <RoleGuard allowedRoles={["admin"]}>{children}</RoleGuard>;
}

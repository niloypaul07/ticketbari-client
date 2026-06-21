import RoleGuard from "@/components/dashboard/RoleGuard";

export default function VendorDashboardLayout({ children }) {
  return <RoleGuard allowedRoles={["vendor"]}>{children}</RoleGuard>;
}

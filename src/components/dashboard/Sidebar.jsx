"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";
import { MdOutlineTrain, MdMenu, MdClose } from "react-icons/md";
import { FiUser, FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";

// User sidebar items
const userSidebar = [
  { href: "/dashboard/user/profile", label: "My Profile", icon: "👤" },
  { href: "/dashboard/user/my-bookings", label: "My Booked Tickets", icon: "🎫" },
  { href: "/dashboard/user/transactions", label: "Transaction History", icon: "💳" },
];

// Vendor sidebar items
const vendorSidebar = [
  { href: "/dashboard/vendor/profile", label: "Vendor Profile", icon: "👤" },
  { href: "/dashboard/vendor/add-ticket", label: "Add Ticket", icon: "➕" },
  { href: "/dashboard/vendor/my-tickets", label: "My Added Tickets", icon: "🎟️" },
  { href: "/dashboard/vendor/requested-bookings", label: "Requested Bookings", icon: "📋" },
  { href: "/dashboard/vendor/revenue", label: "Revenue Overview", icon: "📊" },
];

// Admin sidebar items
const adminSidebar = [
  { href: "/dashboard/admin/profile", label: "Admin Profile", icon: "👤" },
  { href: "/dashboard/admin/manage-tickets", label: "Manage Tickets", icon: "🎟️" },
  { href: "/dashboard/admin/manage-users", label: "Manage Users", icon: "👥" },
  { href: "/dashboard/admin/advertise", label: "Advertise Tickets", icon: "📢" },
];

export default function DashboardSidebar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const sidebarItems =
    user?.role === "admin" ? adminSidebar :
    user?.role === "vendor" ? vendorSidebar :
    userSidebar;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-6 border-b border-default-100 dark:border-default-50">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="bg-gradient-to-r from-brand-500 to-purple-500 p-1.5 rounded-lg text-white">
            <MdOutlineTrain size={18} />
          </span>
          <span className="gradient-text">TicketBari</span>
        </Link>
        {user && (
          <div className="mt-4">
            <p className="font-semibold text-sm truncate">{user.name}</p>
            <p className="text-xs text-default-400 truncate">{user.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 text-xs font-semibold rounded-full capitalize">
              {user.role}
            </span>
          </div>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-brand-500 to-purple-600 text-white shadow-md"
                  : "text-default-600 hover:bg-default-100 dark:hover:bg-default-50/10 hover:text-foreground"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-default-100 dark:border-default-50">
        <Button
          fullWidth
          variant="light"
          color="danger"
          startContent={<FiLogOut />}
          onPress={handleLogout}
          className="justify-start font-medium"
        >
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-default-100 dark:border-default-50 bg-background min-h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Hamburger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button isIconOnly size="sm" variant="flat" onPress={() => setOpen(!open)}>
          {open ? <MdClose size={18} /> : <MdMenu size={18} />}
        </Button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />
          <aside className="fixed left-0 top-0 h-full w-72 bg-background z-50 shadow-2xl">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}

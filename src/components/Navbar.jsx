"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Switch,
} from "@heroui/react";
import { useTheme } from "next-themes";
import { MdOutlineTrain } from "react-icons/md";
import {
  FiSun,
  FiMoon,
  FiChevronDown,
  FiHome,
  FiMap,
  FiLayout,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

const NAV_HEIGHT = "4.5rem";

const navLinks = [
  { href: "/", label: "Home", icon: FiHome },
  { href: "/tickets", label: "All Tickets", icon: FiMap },
  { href: "/dashboard", label: "Dashboard", protected: true, icon: FiLayout },
];

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, logout, loading, syncing } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const getDashboardPath = () => {
    if (!user) return "/dashboard";
    if (user.role === "admin") return "/dashboard/admin/profile";
    if (user.role === "vendor") return "/dashboard/vendor/profile";
    return "/dashboard/user/profile";
  };

  const isLinkActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const desktopLinkClass = (isActive) =>
    `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-white dark:bg-zinc-800 text-brand-600 dark:text-brand-400 shadow-sm"
        : "text-default-600 dark:text-default-400 hover:text-foreground hover:bg-white/60 dark:hover:bg-zinc-800/60"
    }`;

  const mobileLinkClass = (isActive) =>
    `flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-[15px] font-medium transition-colors ${
      isActive
        ? "text-brand-600 bg-brand-50 dark:bg-brand-950/40 dark:text-brand-400"
        : "text-default-700 dark:text-default-300 hover:bg-default-100 dark:hover:bg-default-50/10"
    }`;

  const visibleLinks = navLinks.filter((link) => !(link.protected && !user));

  return (
    <>
      <header
        className="sticky top-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-default-200/80 dark:border-default-100/20 shadow-sm"
        style={{ height: NAV_HEIGHT }}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-full gap-3 sm:gap-6">

            {/* Left — mobile toggle + logo */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
              <button
                type="button"
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-foreground hover:bg-default-100 dark:hover:bg-default-50/10 transition-colors shrink-0"
                onClick={() => setIsMenuOpen((open) => !open)}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>

              <Link
                href="/"
                className="flex items-center gap-2.5 font-bold text-lg sm:text-xl shrink-0 py-1"
              >
                <span className="bg-gradient-to-r from-brand-500 to-purple-500 p-1.5 rounded-xl text-white shadow-sm">
                  <MdOutlineTrain size={20} />
                </span>
                <span className="gradient-text">TicketBari</span>
              </Link>
            </div>

            {/* Center — desktop nav pill */}
            <nav
              aria-label="Main navigation"
              className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 p-1 rounded-full bg-default-100/90 dark:bg-zinc-900/90 border border-default-200/60 dark:border-default-100/10"
            >
              {visibleLinks.map((link) => {
                const isActive = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.protected ? getDashboardPath() : link.href}
                    className={desktopLinkClass(isActive)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right — actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Theme toggle — desktop */}
              <div className="hidden md:flex items-center px-2">
                {mounted ? (
                  <Switch
                    size="sm"
                    color="primary"
                    isSelected={theme === "dark"}
                    onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                    thumbIcon={({ isSelected }) =>
                      isSelected ? (
                        <FiMoon className="text-brand-300" size={10} />
                      ) : (
                        <FiSun className="text-yellow-500" size={10} />
                      )
                    }
                  />
                ) : (
                  <div className="w-10 h-6 bg-default-200 rounded-full animate-pulse" />
                )}
              </div>

              {loading || syncing ? (
                <div className="hidden md:block w-9 h-9 rounded-full bg-default-200 animate-pulse" />
              ) : user ? (
                <div className="hidden md:block">
                  <Dropdown
                    placement="bottom-end"
                    shouldBlockScroll={false}
                    classNames={{
                      content:
                        "bg-white dark:bg-zinc-900 border border-default-200 dark:border-default-100 shadow-xl rounded-xl p-0 min-w-[220px] z-[200]",
                    }}
                  >
                    <DropdownTrigger>
                      <Button
                        variant="light"
                        disableRipple
                        className="h-10 min-w-0 px-2.5 gap-2 rounded-xl data-[hover=true]:bg-default-100"
                      >
                        <Avatar
                          src={user.image || user.photo || undefined}
                          name={user.name}
                          size="sm"
                          classNames={{ base: "w-8 h-8 shrink-0" }}
                          showFallback
                        />
                        <span className="hidden lg:inline text-sm font-semibold max-w-[100px] truncate">
                          {user.name}
                        </span>
                        <FiChevronDown className="hidden lg:inline text-default-400 shrink-0" size={14} />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="User menu"
                      classNames={{
                        base: "bg-white dark:bg-zinc-900",
                        list: "p-1.5",
                      }}
                    >
                      <DropdownItem
                        key="info"
                        isReadOnly
                        className="opacity-100 cursor-default h-auto py-3 mb-1 border-b border-default-100 dark:border-default-50/10 rounded-none"
                        textValue={`${user.name} ${user.role}`}
                      >
                        <div className="flex flex-col gap-0.5 pointer-events-none">
                          <span className="font-semibold text-sm text-foreground">{user.name}</span>
                          <span className="text-xs text-default-500 capitalize">
                            {user.role || "user"}
                          </span>
                        </div>
                      </DropdownItem>
                      <DropdownItem
                        key="profile"
                        as={Link}
                        href={getDashboardPath()}
                        className="font-medium text-foreground"
                      >
                        My Profile
                      </DropdownItem>
                      <DropdownItem
                        key="logout"
                        color="danger"
                        className="text-danger font-medium"
                        onPress={handleLogout}
                      >
                        Logout
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  {pathname !== "/login" && (
                    <Button
                      as={Link}
                      href="/login"
                      variant="light"
                      size="sm"
                      className="font-medium px-4 h-10 rounded-xl"
                    >
                      Login
                    </Button>
                  )}
                  {pathname !== "/register" && (
                    <Button
                      as={Link}
                      href="/register"
                      size="sm"
                      className="bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold shadow-md px-5 h-10 rounded-xl"
                    >
                      Register
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {isMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 bg-black/50 z-[60] md:hidden"
            style={{ top: NAV_HEIGHT }}
            onClick={() => setIsMenuOpen(false)}
          />
          <nav
            aria-label="Mobile navigation"
            className="fixed inset-x-0 bottom-0 z-[70] md:hidden bg-white dark:bg-zinc-950 border-t border-default-200 dark:border-default-100 shadow-2xl overflow-y-auto"
            style={{ top: NAV_HEIGHT }}
          >
            <div className="max-w-lg mx-auto px-4 py-5 flex flex-col gap-1.5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-default-400 px-3 pb-2">
                Navigation
              </p>

              {visibleLinks.map((link) => {
                const Icon = link.icon;
                const isActive = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.protected ? getDashboardPath() : link.href}
                    className={mobileLinkClass(isActive)}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span
                      className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${
                        isActive
                          ? "bg-brand-100 dark:bg-brand-900/40 text-brand-600"
                          : "bg-default-100 dark:bg-default-50/10 text-default-500"
                      }`}
                    >
                      <Icon size={18} />
                    </span>
                    {link.label}
                  </Link>
                );
              })}

              <div className="mt-3 pt-4 border-t border-default-100 dark:border-default-50/10">
                <div className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-default-50 dark:bg-zinc-900/50 border border-default-100 dark:border-default-50/10">
                  <div className="flex items-center gap-3">
                    {theme === "dark" ? (
                      <FiMoon size={18} className="text-brand-400" />
                    ) : (
                      <FiSun size={18} className="text-yellow-500" />
                    )}
                    <span className="text-[15px] font-medium text-default-700 dark:text-default-300">
                      Dark Mode
                    </span>
                  </div>
                  {mounted && (
                    <Switch
                      size="sm"
                      color="primary"
                      isSelected={theme === "dark"}
                      onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                    />
                  )}
                </div>
              </div>

              {user && (
                <div className="mt-3 pt-4 border-t border-default-100 dark:border-default-50/10 flex flex-col gap-1.5">
                  <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950/30 dark:to-purple-950/20 border border-brand-100/50 dark:border-brand-900/30">
                    <Avatar
                      src={user.image || user.photo || undefined}
                      name={user.name}
                      size="md"
                      showFallback
                      classNames={{ base: "w-11 h-11 shrink-0 ring-2 ring-white dark:ring-zinc-800" }}
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-default-500 capitalize">{user.role || "user"}</p>
                    </div>
                  </div>
                  <Link
                    href={getDashboardPath()}
                    className={mobileLinkClass(pathname.startsWith("/dashboard"))}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-default-100 dark:bg-default-50/10 text-default-500 shrink-0">
                      <FiUser size={18} />
                    </span>
                    My Profile
                  </Link>
                  <button
                    type="button"
                    className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-[15px] font-medium text-danger hover:bg-danger-50 dark:hover:bg-danger-950/20 transition-colors"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-danger-50 dark:bg-danger-950/30 shrink-0">
                      <FiLogOut size={18} />
                    </span>
                    Logout
                  </button>
                </div>
              )}

              {!user && !loading && !syncing && (
                <div className="mt-3 pt-4 border-t border-default-100 dark:border-default-50/10 flex flex-col gap-2.5 px-1">
                  {pathname !== "/login" && (
                    <Link
                      href="/login"
                      className="flex items-center justify-center w-full h-12 rounded-xl border-2 border-default-200 dark:border-default-100 font-semibold text-foreground hover:bg-default-50 dark:hover:bg-zinc-900 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                  )}
                  {pathname !== "/register" && (
                    <Link
                      href="/register"
                      className="flex items-center justify-center w-full h-12 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold shadow-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  )}
                </div>
              )}
            </div>
          </nav>
        </>
      )}
    </>
  );
}

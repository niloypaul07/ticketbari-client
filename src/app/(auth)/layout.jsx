import AppNavbar from "@/components/Navbar";

export default function AuthLayout({ children }) {
  return (
    <>
      <AppNavbar />
      <main>{children}</main>
    </>
  );
}

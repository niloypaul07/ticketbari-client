import AppNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <AppNavbar />
      <main className="min-h-screen pt-0">{children}</main>
      <Footer />
    </>
  );
}

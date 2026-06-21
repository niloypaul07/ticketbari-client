"use client";
import Link from "next/link";
import { Button } from "@heroui/react";
import AppNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <AppNavbar />
      <main className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-md">
          <p className="text-8xl font-black gradient-text mb-4">404</p>
          <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
          <p className="text-default-500 mb-8">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex gap-4 justify-center">
            <Button as={Link} href="/"
              className="bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold">
              Back to Home
            </Button>
            <Button as={Link} href="/tickets" variant="bordered">Browse Tickets</Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

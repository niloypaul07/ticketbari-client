"use client";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";

export function Providers({ children }) {
  return (
    <AuthProvider>
      <NextThemesProvider attribute="class" defaultTheme="light">
        <HeroUIProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { borderRadius: "12px", fontFamily: "Inter, sans-serif" },
            }}
          />
          {children}
        </HeroUIProvider>
      </NextThemesProvider>
    </AuthProvider>
  );
}

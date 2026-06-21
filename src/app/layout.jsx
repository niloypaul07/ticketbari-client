import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: {
    default: "TicketBari — Book Bus, Train, Launch & Flight Tickets",
    template: "%s | TicketBari",
  },
  description:
    "TicketBari is your one-stop platform to discover and book bus, train, launch and flight tickets across Bangladesh at the best prices.",
  keywords: ["ticket booking", "bus ticket", "train ticket", "flight ticket", "bangladesh"],
  openGraph: {
    title: "TicketBari — Online Ticket Booking Platform",
    description: "Book bus, train, launch & flight tickets easily.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

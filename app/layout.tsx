import type React from "react";
import type { Metadata } from "next";
import { Fredoka as Fredoka_One, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import Navigation from "@/components/navigation";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const fredokaOne = Fredoka_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-fredoka",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "SARATHI - Inclusive Learning Platform",
  description:
    "A vibrant, playful platform for inclusive communication and learning",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Server-side route protection handled by Next middleware
  return (
    <html lang="en">
      <body
        className={`font-sans ${fredokaOne.variable} ${poppins.variable} antialiased`}
      >
        <AuthProvider>
          {/* Navbar (fixed at top) */}
          <Navigation />

          {/* Content with padding to prevent overlap */}
          <main className="pt-16 relative z-0">
            <Suspense fallback={null}>{children}</Suspense>
          </main>
        </AuthProvider>

        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./fixes.css"; // Add our fixes CSS
import AuthProvider from "@/components/providers/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CEP Grouper",
  description: "A platform for creating and joining groups with roll number validation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow bg-gray-50">
              {children}
            </main>
            <footer className="bg-white shadow-inner py-4 border-t">
              <div className="container mx-auto text-center text-gray-600 font-medium">
                Made with <span className="text-red-500">❤️</span> by SC
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

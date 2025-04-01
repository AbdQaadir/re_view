import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Lexend_Mega, Lexend } from "next/font/google";
import "./globals.css";

import Header from "./_components/Header";
import { Toaster } from "sonner";

const lexendSans = Lexend({
  variable: "--font-lexend-sans",
  subsets: ["latin"],
});

const lexendMega = Lexend_Mega({
  variable: "--font-lexend-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "re_view",
  description: "Find the Best Products, Rated by Real Users",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${lexendSans.variable} ${lexendMega.variable} antialiased`}
        >
          <Header />

          {children}

          <Toaster position="top-center" />
        </body>
      </html>
    </ClerkProvider>
  );
}

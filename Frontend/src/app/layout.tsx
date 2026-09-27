import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AuthProvider } from "./providers";

export const metadata: Metadata = {
  title: "AI Resume Analyzer & Job Tracker",
  description: "AI-powered resume analysis, ATS optimization, and job application tracking.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#f8f7f5] text-slate-900 antialiased font-[Inter,sans-serif]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

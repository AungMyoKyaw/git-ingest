import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Git-Ingest | Transform Any Codebase into AI-Ready Format",
  description:
    "A powerful CLI tool for analyzing and ingesting project codebases into structured text files with advanced gitignore support, binary file detection, and cross-platform clipboard integration. Perfect for AI analysis, code reviews, and team collaboration.",
  keywords: [
    "git-ingest",
    "codebase analysis",
    "AI tools",
    "CLI",
    "code review",
    "project analysis",
    "developer tools"
  ],
  authors: [{ name: "Aung Myo Kyaw", url: "https://github.com/AungMyoKyaw" }],
  creator: "Aung Myo Kyaw",
  openGraph: {
    title: "Git-Ingest | Transform Any Codebase into AI-Ready Format",
    description:
      "A powerful CLI tool for analyzing and ingesting project codebases into structured text files. Perfect for AI analysis, code reviews, and team collaboration.",
    url: "https://git-ingest.com",
    siteName: "Git-Ingest",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Git-Ingest | Transform Any Codebase into AI-Ready Format",
    description:
      "A powerful CLI tool for analyzing and ingesting project codebases into structured text files. Perfect for AI analysis, code reviews, and team collaboration."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

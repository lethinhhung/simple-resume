import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const BASE_URL = "https://create-simple-resume.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Simple Resume — ATS-Friendly Resume Builder",
  description:
    "Build a professional Harvard-style resume in your browser. Live preview, one-click PDF export, and fully client-side — no sign-up required.",
  keywords: [
    "resume builder",
    "CV builder",
    "ATS-friendly resume",
    "Harvard resume",
    "PDF resume",
    "free resume builder",
  ],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📄</text></svg>",
  },
  openGraph: {
    title: "Simple Resume — ATS-Friendly Resume Builder",
    description:
      "Build a professional Harvard-style resume in your browser. Live preview, one-click PDF export, and fully client-side — no sign-up required.",
    url: BASE_URL,
    siteName: "Simple Resume",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simple Resume — ATS-Friendly Resume Builder",
    description:
      "Build a professional Harvard-style resume in your browser. Live preview, one-click PDF export, and fully client-side — no sign-up required.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="h-dvh overflow-hidden antialiased">
        {children}
      </body>
    </html>
  );
}

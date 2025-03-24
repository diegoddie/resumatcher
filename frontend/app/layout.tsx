import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat, Montserrat, Lato } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/tanstack/queryClient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Resumatcher - Find Your Perfect Job Match with AI",
  description:
    "Upload your resume and let our AI analyze it to find the most relevant job opportunities with precise match scores.",
  authors: [{ name: "Resumatcher Team" }],
  keywords: ["resume", "job search", "AI matching", "career", "employment", "job opportunities"],
  creator: "Resumatcher",
  publisher: "Resumatcher",
  metadataBase: new URL("https://resumatcher.xyz"),
  openGraph: {
    title: "Resumatcher - Find Your Perfect Job Match with AI",
    description:
      "Upload your resume and let our AI analyze it to find the most relevant job opportunities with precise match scores.",
    url: "https://resumatcher.xyz",
    siteName: "Resumatcher",
    type: "website",
    images: [
      {
        url: "/og-image.png", // Assicurati di avere un'immagine grande in public/
        width: 1200,
        height: 630,
        alt: "Resumatcher AI Job Matching",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@yoimdiego",
    creator: "@yoimdiego",
    title: "Resumatcher - Find Your Perfect Job Match with AI",
    description:
      "Upload your resume and let our AI analyze it to find the most relevant job opportunities with precise match scores.",
    images: ["/og-image.png"],
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://resumatcher.xyz",
  },
  icons: {
    icon: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className="scroll-smooth">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${montserrat.variable} ${lato.variable} antialiased font-montserrat`}
        >
          <QueryClientProvider client={queryClient}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </QueryClientProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}

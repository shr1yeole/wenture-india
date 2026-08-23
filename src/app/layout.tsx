import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: "#0A192A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://wentureindia.com"),
  title: "Wenturex India International | Connect. Build. Scale. Grow Together.",
  description:
    "Wenturex India International connects entrepreneurs, investors and business opportunities — bringing vision, capital and growth together.",
  keywords: [
    "Wenturex",
    "Wenturex India International",
    "entrepreneurs",
    "investors",
    "business opportunities",
    "capital",
    "venture platform",
    "startup growth",
    "India investment platform",
  ],
  authors: [{ name: "Wenturex India International" }],
  creator: "Wenturex India International",
  publisher: "Wenturex India International",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://wentureindia.com/",
  },
  openGraph: {
    title: "Wenturex India International | Connect. Build. Scale. Grow Together.",
    description:
      "A common online platform to connect entrepreneurs with investors, vision with capital, ideas with funds and giving wings to dreams.",
    url: "https://wentureindia.com/",
    siteName: "Wenturex India International",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Wenturex India International - Connect. Build. Scale. Grow Together.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wenturex India International | Connect. Build. Scale. Grow Together.",
    description:
      "A common online platform to connect entrepreneurs with investors, vision with capital, ideas with funds and giving wings to dreams.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Wenturex India International",
    alternateName: "Wenturex",
    url: "https://wentureindia.com/",
    logo: "https://wentureindia.com/favicon.svg",
    description:
      "A common online platform to connect entrepreneurs with investors, vision with capital, ideas with funds and giving wings to dreams.",
    slogan: "Connect. Build. Scale. Grow Together.",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-95407-21008",
        contactType: "customer support",
        email: "wentureindia@gmail.com",
        availableLanguage: ["English", "Hindi"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+91-98418-81008",
        contactType: "WhatsApp inquiries",
        email: "info@wentureindia.com",
        availableLanguage: ["English", "Hindi"],
      },
    ],
  };

  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-wenture-bg text-wenture-dark antialiased font-sans selection:bg-wenture-cyanLight selection:text-wenture-dark">
        {children}
      </body>
    </html>
  );
}

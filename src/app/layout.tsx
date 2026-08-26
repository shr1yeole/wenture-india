import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { COMPANY } from "@/lib/constants/company";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: "#00A6E8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(COMPANY.website),
  title: {
    default: `${COMPANY.name} — ${COMPANY.tagline}`,
    template: `%s | ${COMPANY.name}`,
  },
  description: COMPANY.corePositioning,
  keywords: [
    "Wenturex",
    "Wenture India",
    "Wenturex India International",
    "entrepreneurs",
    "investors",
    "venture capital",
    "business investment",
    "angel investment",
    "franchise opportunities",
    "EXIM opportunities",
    "startups India",
    "Omniverse Technologies",
  ],
  authors: [{ name: COMPANY.name }],
  creator: COMPANY.legalEntity,
  publisher: COMPANY.name,
  alternates: {
    canonical: COMPANY.website,
  },
  openGraph: {
    title: `${COMPANY.name} — ${COMPANY.tagline}`,
    description: COMPANY.corePositioning,
    url: COMPANY.website,
    siteName: COMPANY.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${COMPANY.name} — ${COMPANY.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${COMPANY.name} — ${COMPANY.tagline}`,
    description: COMPANY.corePositioning,
    images: ["/og-image.png"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY.name,
    legalName: COMPANY.legalEntity,
    url: COMPANY.website,
    logo: `${COMPANY.website}/favicon.svg`,
    description: COMPANY.corePositioning,
    slogan: COMPANY.tagline,
    address: {
      "@type": "PostalAddress",
      streetAddress: "53-B, GK-2",
      addressLocality: "New Delhi",
      postalCode: "110017",
      addressCountry: "IN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: COMPANY.contact.phone,
        contactType: "Customer Support",
        email: COMPANY.contact.generalEmail,
        availableLanguage: ["English", "Hindi"],
      },
      {
        "@type": "ContactPoint",
        telephone: COMPANY.contact.whatsapp,
        contactType: "Business Inquiries",
        email: COMPANY.contact.businessEmail,
        availableLanguage: ["English", "Hindi"],
      },
    ],
  };

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-surface text-on-surface antialiased font-sans flex flex-col selection:bg-primary-container selection:text-white">
        {children}
      </body>
    </html>
  );
}

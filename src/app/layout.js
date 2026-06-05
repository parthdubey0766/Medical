import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import FloatingBookButton from "@/components/FloatingBookButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://parth06.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Parth's Medical Clinic | General Medicine & Diabetology — Gurugram",
    template: "%s | Parth's Medical Clinic",
  },
  description:
    "Book appointments with Dr. Parth for general medicine, diabetology, preventive health, and family care in Gurugram. 15+ years experience, 5000+ patients served.",
  keywords: [
    "doctor Gurugram",
    "general physician Gurugram",
    "diabetologist Gurugram",
    "medical clinic Gurugram",
    "book doctor appointment",
    "preventive health check-up",
    "Dr Parth clinic",
  ],
  authors: [{ name: "Dr. Parth", url: siteUrl }],
  creator: "Parth's Medical Clinic",
  publisher: "Parth's Medical Clinic",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Parth's Medical Clinic",
    title: "Parth's Medical Clinic | General Medicine & Diabetology — Gurugram",
    description:
      "Book appointments with Dr. Parth for general medicine, diabetology, preventive health, and family care in Gurugram.",
    images: [
      {
        url: "/clinic-exterior.png",
        width: 1200,
        height: 630,
        alt: "Parth's Medical Clinic — Gurugram",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Parth's Medical Clinic | Gurugram",
    description:
      "General medicine, diabetology, and preventive health care in Gurugram. Book online.",
    images: ["/clinic-exterior.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    // Add your Google Search Console verification code here after setup
    // google: "your-verification-code",
  },
};

// JSON-LD Structured Data for Google Rich Results
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  name: "Parth's Medical Clinic",
  description:
    "General medicine and diabetology clinic in Gurugram offering consultations, preventive health check-ups, and chronic disease management.",
  url: siteUrl,
  telephone: "+91-9876543210",
  email: "clinic@parth06.app",
  address: {
    "@type": "PostalAddress",
    streetAddress: "123, MG Road, Sector 15",
    addressLocality: "Gurugram",
    addressRegion: "Haryana",
    postalCode: "122001",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 28.4595,
    longitude: 77.0266,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "13:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "17:00",
      closes: "21:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "13:00",
    },
  ],
  medicalSpecialty: ["GeneralPractice", "Endocrine"],
  priceRange: "$$",
  image: `${siteUrl}/clinic-exterior.png`,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "5000",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        <FloatingBookButton />
        <CookieConsent />
      </body>
    </html>
  );
}

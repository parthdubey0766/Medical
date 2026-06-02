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

export const metadata = {
  title: "Parth's Medical Clinic | Gurugram",
  description:
    "Book appointments with Dr. Parth for general medicine, diabetology, preventive health, and family care in Gurugram.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
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

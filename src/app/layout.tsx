import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { Toaster } from "sonner";
import { SITE_URL } from "@/constants";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "EduCenter - منصة إدارة مراكز التعليم",
    template: "%s | EduCenter",
  },
  description: "منصة شاملة تساعدك على إدارة طلابك، معلميك، الدروس، الاختبارات، والتقارير في مكان واحد بكل سهولة واحترافية.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "EduCenter - منصة إدارة مراكز التعليم",
    description: "منصة شاملة تساعدك على إدارة طلابك، معلميك، الدروس، الاختبارات، والتقارير في مكان واحد بكل سهولة واحترافية.",
    url: SITE_URL,
    siteName: "EduCenter",
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduCenter - منصة إدارة مراكز التعليم",
    description: "منصة شاملة تساعدك على إدارة طلابك، معلميك، الدروس، الاختبارات، والتقارير في مكان واحد بكل سهولة واحترافية.",
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
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}

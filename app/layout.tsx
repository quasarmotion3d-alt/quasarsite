import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QUASAR MOTION COMPANY — 3D, Websites & AI Video",
  description: "Produtora criativa brasileira especializada em 3D, websites e AI Video.",
  metadataBase: new URL("https://quasarmotion-site-final.vercel.app"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "QUASAR MOTION COMPANY",
    title: "QUASAR MOTION COMPANY — 3D, Websites & AI Video",
    description: "Produtora criativa brasileira especializada em 3D, websites e AI Video.",
    images: [{ url: "/work-3d.webp", width: 1188, height: 742, alt: "QUASAR MOTION COMPANY — produção 3D" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "QUASAR MOTION COMPANY — 3D, Websites & AI Video",
    description: "Produtora criativa brasileira especializada em 3D, websites e AI Video.",
    images: ["/work-3d.webp"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: "QUASAR MOTION COMPANY",
  description: "Produtora criativa brasileira especializada em 3D, websites e AI Video.",
  url: "https://quasarmotion-site-final.vercel.app",
  areaServed: "BR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}} /></body>
    </html>
  );
}

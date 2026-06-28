import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";

export const metadata: Metadata = {
  title: "MyOnlineCV — Votre CV professionnel en ligne, propulsé par l'IA",
  description: "Créez un CV professionnel, moderne et accessible partout grâce à l'IA.",
  keywords: "cv en ligne, création cv, cv IA, curriculum vitae, modèle cv, portfolio",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://mycvonline.web.app/",
    title: "MyOnlineCV — Votre CV professionnel propulsé par l'IA",
    description: "Créez un CV professionnel, moderne et accessible partout grâce à l'IA.",
    siteName: "MyOnlineCV",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyOnlineCV — Votre CV professionnel propulsé par l'IA",
    description: "Créez un CV professionnel, moderne et accessible partout grâce à l'IA.",
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;700;900&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </head>
      <body>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Orelhas do Dragão - Character Builder D&D 5e',
  description:
    'App PWA para criação e gerenciamento de fichas de personagens D&D 5ª Edição em português brasileiro, com geração de background via IA.',
  keywords: [
    'D&D',
    'Dungeons and Dragons',
    'RPG',
    'Character Builder',
    'Ficha de Personagem',
    'D&D 5e',
    'Brasil',
  ],
  authors: [{ name: 'Orelhas do Dragão Team' }],
  creator: 'Orelhas do Dragão Team',
  publisher: 'Orelhas do Dragão',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Orelhas do Dragão - Character Builder D&D 5e',
    description:
      'Crie e gerencie seus personagens de D&D 5e em português com geração de background via IA.',
    url: '/',
    siteName: 'Orelhas do Dragão',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Orelhas do Dragão - Character Builder D&D 5e',
    description:
      'Crie e gerencie seus personagens de D&D 5e em português com geração de background via IA.',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Orelhas do Dragão',
  },
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#7048e8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}

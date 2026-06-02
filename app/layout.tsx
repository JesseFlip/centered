import type { Metadata, Viewport } from 'next';
import { PWALifecycle } from '@/components/pwa-lifecycle';
import { Navigation } from '@/components/navigation';
import './globals.css';

export const metadata: Metadata = {
  title: 'Persona - Personal Brand Sync Platform',
  description: 'Local-first, AI-assisted personal brand management. Update once, sync everywhere.',
  manifest: '/manifest.json',
  keywords: ['personal brand', 'resume', 'linkedin', 'portfolio', 'AI', 'local-first'],
  authors: [{ name: 'Persona' }],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Persona',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Persona - Personal Brand Sync Platform',
    description: 'Local-first, AI-assisted personal brand management. Update once, sync everywhere.',
    url: 'https://persona.app',
    siteName: 'Persona',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Persona - Personal Brand Sync Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Persona - Personal Brand Sync Platform',
    description: 'Local-first, AI-assisted personal brand management. Update once, sync everywhere.',
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <PWALifecycle />
        <Navigation />
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}

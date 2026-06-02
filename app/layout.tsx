import type { Metadata, Viewport } from 'next';
import { PWALifecycle } from '@/components/pwa-lifecycle';
import './globals.css';

export const metadata: Metadata = {
  title: 'Persona - Personal Brand Sync Platform',
  description: 'Local-first, AI-assisted personal brand management',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Persona',
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
        {children}
      </body>
    </html>
  );
}

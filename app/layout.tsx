import type { Metadata } from 'next';
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

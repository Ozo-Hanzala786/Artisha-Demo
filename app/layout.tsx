import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'Artisha | Luxury Pret, Festive Couture & Artisanal Heirlooms | Lahore',
  description:
    'Artisha is a premier Pakistani fashion atelier based at Dolmen Mall Lahore. Discover handcrafted luxury pret, bridal peshwas, pure Himalayan pashmina shawls, and bespoke jewelry.',
  keywords: [
    'Artisha',
    'Artisha Lahore',
    'Dolmen Mall Lahore',
    'Pakistani luxury fashion',
    'handcrafted bridal wear',
    'pure pashmina shawls',
    'velvet kurtas',
    'bespoke jewelry',
  ],
  openGraph: {
    title: 'Artisha | Luxury Pret & Artisanal Couture Lahore',
    description: 'Curated Pakistani couture, artisanal shawls and bespoke heirlooms. Flagship boutique at Dolmen Mall Lahore.',
    url: 'https://artisha.pk',
    siteName: 'Artisha',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAF8F5] text-[#1F1D1D] antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

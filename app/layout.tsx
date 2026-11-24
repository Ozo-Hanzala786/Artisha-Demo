import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'Artisha | Handcrafted Jewellery, Bespoke Accessories & Handmade Gifts | Lahore',
  description:
    'Artisha is an artisanal boutique atelier at Dolmen Mall Lahore. Discover heirloom Polki jewellery, Kundan earrings, handcrafted velvet potlis, zardozi clutches, and bespoke handmade gifts.',
  keywords: [
    'Artisha',
    'Artisha Lahore',
    'Dolmen Mall Lahore',
    'handcrafted jewellery',
    'Polki jewellery',
    'Kundan earrings',
    'velvet potli bags',
    'handmade gifts Pakistan',
    'luxury gift hampers',
    'bespoke accessories',
  ],
  openGraph: {
    title: 'Artisha | Handcrafted Jewellery, Accessories & Handmade Gifts Lahore',
    description: 'Bespoke Polki jewels, embroidered velvet accessories, and handcrafted gift heirlooms. Flagship boutique at Dolmen Mall Lahore.',
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

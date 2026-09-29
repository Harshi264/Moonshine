import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { CustomerAuthProvider } from '@/context/CustomerAuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'The Little Cozy Moonshine | Handcrafted Soy Candles & Resin Crafts',
    template: '%s | The Little Cozy Moonshine',
  },
  description:
    'Artisanal hand-poured soy wax candles, crystal-clear resin coasters, custom bookmarks, and luxury gift hampers made with love in Hyderabad.',
  keywords: [
    'Handmade Candles',
    'Soy Wax Candles',
    'Resin Crafts',
    'Resin Coasters',
    'Custom Bookmarks',
    'Personalized Gift Hampers',
    'Hyderabad Handmade Studio',
    'Cozy Candle Gifts',
  ],
  authors: [{ name: 'The Little Cozy Moonshine' }],
  openGraph: {
    title: 'The Little Cozy Moonshine',
    description: 'Handcrafted Soy Wax Candles & Artistic Resin Creations',
    url: 'https://www.instagram.com/thelittlecozymoonshine',
    siteName: 'The Little Cozy Moonshine',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Handmade Soy Candles',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#faf7f2] text-[#2d241e] font-sans antialiased">
        <CustomerAuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </CustomerAuthProvider>
      </body>
    </html>
  );
}

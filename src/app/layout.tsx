import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import OfflineIndicator from '@/components/OfflineIndicator';
import CompareTray from '@/components/CompareTray';
import ScrollReveal from '@/components/ScrollReveal';
import { CompareProvider } from '@/lib/compare-context';

export const metadata: Metadata = {
  title: 'LapizBlue Catalogue — Construction Chemicals Cross-Reference',
  description:
    'UAE cross-reference catalogue for 183 construction chemical products across 9 leading brands: MAPEI, Weber, Laticrete, Kerakoll, Pidilite/Puma, X-Chem, X-Calibur, Vetonit/Saveto and Colmef.',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192.png',
  },
  openGraph: {
    title: 'LapizBlue Catalogue',
    description: 'Cross-reference UAE construction chemicals across 9 brands.',
    url: 'https://lapizblue-catalogue.vercel.app',
    siteName: 'LapizBlue Catalogue',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-lapiz-ink">
        <CompareProvider>
          <OfflineIndicator />
          <Navbar />
          <main className="pb-24">{children}</main>
          <CompareTray />
          <ScrollReveal />
          <footer className="border-t hairline mt-16">
            <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-6 md:gap-10 justify-between items-start md:items-center text-sm text-lapiz-ink/70">
              <div className="flex items-center gap-2">
                <span className="deco-num">©</span>
                <span>LapizBlue Trading · Dubai, UAE</span>
              </div>
              <div className="flex items-center gap-5">
                <a href="https://lapizblue.com" target="_blank" rel="noreferrer" className="hover:text-lapiz-ink transition-colors">lapizblue.com</a>
                <a href="mailto:sales@lapizblue.com" className="hover:text-lapiz-ink transition-colors">sales@lapizblue.com</a>
              </div>
            </div>
          </footer>
        </CompareProvider>
        {/* PWA service worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && typeof window !== 'undefined') {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

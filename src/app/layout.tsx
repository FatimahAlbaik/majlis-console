import type { Metadata } from 'next';
import { Inter, Noto_Sans_Arabic } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'sonner';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-noto-arabic',
});

export const metadata: Metadata = {
  title: 'Majlis Console - Accenture Academy Cohort 6',
  description: 'Bilingual internal portal for Accenture Academy Cohort 6 with social feed modules',
  keywords: ['Accenture', 'Academy', 'Cohort 6', 'Data & AI', 'Cybersecurity', 'Portal'],
  authors: [{ name: 'Accenture Academy' }],
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${inter.variable} ${notoSansArabic.variable} font-sans`}>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 lg:ml-64">
                <div className="p-6">
                  {children}
                </div>
              </main>
            </div>
            <Footer />
          </div>
          <Toaster 
            position="top-right"
            richColors
            theme="light"
            dir="ltr"
          />
        </Providers>
      </body>
    </html>
  );
}
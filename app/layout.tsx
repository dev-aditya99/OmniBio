import type { Metadata, Viewport } from 'next';
import './globals.css'; // Global styles
import { AuthProvider } from '@/lib/auth-context';
import { PWARegister } from '@/components/PWARegister';
import { Toaster } from 'react-hot-toast';

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'OmniBio - One Link for Everything',
  description: 'Create your personalized bio link page in seconds. Share all your content, social profiles, and links in one place.',
  keywords: ['link in bio', 'bio link', 'social links', 'creator tools', 'omnibio'],
  openGraph: {
    title: 'OmniBio - One Link for Everything',
    description: 'Create your personalized bio link page in seconds.',
    url: 'https://omnibio.com',
    siteName: 'OmniBio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OmniBio - One Link for Everything',
    description: 'Create your personalized bio link page in seconds.',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthProvider>
          <PWARegister />
          <Toaster position="bottom-center" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

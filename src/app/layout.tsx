import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import RegisterSW from '@/components/RegisterSW';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '漫画部屋管理システム',
  description: '漫画部メンバーの座席管理と連絡共有システム',
  themeColor: '#111111',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192.png' },
    ],
  },
  appleWebApp: {
    capable: true,
    title: '漫画部屋管理システム',
    statusBarStyle: 'default',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#111111',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <RegisterSW />
      </body>
    </html>
  );
}

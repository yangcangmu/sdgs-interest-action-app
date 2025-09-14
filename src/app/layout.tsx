import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientAuthProvider from '@/components/Providers/ClientAuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SDGs関心度・行動アプリ',
  description: 'あなたのSDGsへの関心度を測定し、具体的な行動目標を設定しましょう',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className={inter.className}>
        <ClientAuthProvider>
          {children}
        </ClientAuthProvider>
      </body>
    </html>
  );
}

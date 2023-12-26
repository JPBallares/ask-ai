import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ask AI',
  description: 'Chatbot for any assistance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`overflow-hidden ${inter.className}`}>
        <div className="flex flex-1 flex-row h-screen">
          <Sidebar></Sidebar>
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import CustomCursor from '@/components/core/CustomCursor';
import FinancialGridBackground from '@/components/core/FinancialGridBackground';

export const metadata: Metadata = {
  title: 'MARGIN — The Future of Money | Precision Financial Universe',
  description:
    'A futuristic financial studio. Track real-time capital flow, simulate purchases with the Decision Lens, and master your wealth through the 3D Wealth Engine.',
  keywords: [
    'fintech',
    'future of money',
    '3d financial core',
    'wealth engine',
    'decision lens',
    'personal finance',
    'expense tracker',
  ],
  openGraph: {
    title: 'MARGIN — The Future of Money',
    description: 'See every move. Understand every possibility. Own your financial future.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#060807] text-[#F5F7F3] selection:bg-[#C6FF4D] selection:text-[#060807]">
        <CustomCursor />
        <FinancialGridBackground />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '13px',
              background: '#0B1410',
              color: '#F5F7F3',
              border: '1px solid rgba(53, 229, 138, 0.3)',
              borderRadius: '12px',
              boxShadow: '0 0 25px rgba(53, 229, 138, 0.15)',
            },
          }}
        />
      </body>
    </html>
  );
}

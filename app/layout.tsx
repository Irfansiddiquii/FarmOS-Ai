import type {Metadata} from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'FarmOS AI - Smart Farming Powered by AI',
  description: 'FarmOS AI is an industry-grade Agritech SaaS platform designed for crop planning, leaf disease detection, weather forecasting, and farm analytics.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-[#050705] text-[#E0E2E0]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

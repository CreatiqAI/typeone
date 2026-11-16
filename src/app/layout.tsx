import type { Metadata } from 'next';
import { Chakra_Petch, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const headingFont = Chakra_Petch({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-heading',
});

const sansFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'TYPE ONE Malaysia | Multi-Point Strut Bar & Chassis Strengthening Manufacturer',
  description:
    "Malaysia's premier manufacturer of multi-point chassis-strengthening stable bars, anti-roll bars, lower bars & camber kits. Registered industrial design, 100% bolt-on, lifetime warranty.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${sansFont.variable} ${monoFont.variable} dark`}
    >
      <body className="bg-[#090D16] text-slate-100 antialiased selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}

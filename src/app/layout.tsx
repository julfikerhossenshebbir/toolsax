
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AppHeader from '@/components/AppHeader';
import { CustomThemeProvider } from '@/components/ThemeProvider';
import GridBackground from '@/components/GridBackground';
import { AuthProvider } from '@/contexts/AuthContext';
import MobileBottomNav from '@/components/MobileBottomNav';
import { AppStateProvider } from '@/contexts/AppStateContext';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { cn } from '@/lib/utils';


export const metadata: Metadata = {
  metadataBase: new URL('https://toolsax.com'),
  title: 'Toolsax - Free Online Tools for Developers & Designers',
  description: 'An expanding collection of free online tools including case converters, password generators, QR code creators, and more. Fast, secure, and easy to use.',
  keywords: ['online tools', 'developer tools', 'designer tools', 'free tools', 'case converter', 'password generator', 'qr code generator', 'json formatter'],
  openGraph: {
    title: 'Toolsax - Free Online Tools for Developers & Designers',
    description: 'An expanding collection of free online tools for professionals.',
    type: 'website',
    url: 'https://toolsax.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans antialiased min-h-screen flex flex-col bg-background", GeistSans.variable, GeistMono.variable)}>
        <AuthProvider>
          <CustomThemeProvider>
            <AppStateProvider>
              <GridBackground />
              <div className="flex flex-col w-full flex-grow">
                  <AppHeader />
                  <main className="flex-grow pb-16 md:pb-0">
                      {children}
                  </main>
                  <MobileBottomNav />
              </div>
              <Toaster />
            </AppStateProvider>
          </CustomThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

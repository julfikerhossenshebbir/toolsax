
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { CustomThemeProvider } from '@/components/ThemeProvider';
import GridBackground from '@/components/GridBackground';
import { AuthProvider } from '@/contexts/AuthContext';

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={'font-body antialiased min-h-screen flex flex-col bg-background'}>
        <AuthProvider>
          <CustomThemeProvider>
              <GridBackground />
              <div className="flex flex-col w-full">
                  <AppHeader />
                  <main className="flex-grow">
                      {children}
                  </main>
                  <AppFooter />
              </div>
              <Toaster />
          </CustomThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

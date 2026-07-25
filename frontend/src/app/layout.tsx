import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/use-auth';
import { SiteSettingsProvider } from '@/hooks/use-site-settings';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { ToastProvider } from '@/components/ui/toaster';
import { ConfirmProvider } from '@/components/ui/confirm-dialog';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-poppins' });

export const metadata: Metadata = {
  title: 'EarnClicks - Complete Social Media Tasks. Earn USDT.',
  description: 'Complete Social Media Tasks. Earn USDT. Promote Your Content Worldwide.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <ThemeProvider>
          <ToastProvider>
            <ConfirmProvider>
              <SiteSettingsProvider>
                <AuthProvider>{children}</AuthProvider>
              </SiteSettingsProvider>
            </ConfirmProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

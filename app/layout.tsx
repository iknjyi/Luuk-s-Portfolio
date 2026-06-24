import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';
import { NeonStripsBackground } from '@/components/NeonStripsBackground';
import { ThemeProvider } from '@/lib/theme-context';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Luuk — Video Editor & Content Creator',
  description:
    'Cinematic editing for reels, shorts, trailers, storytelling content, product reviews, gaming videos, football edits, creator content, and brand films.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${ibmPlexSansArabic.variable}`}
    >
      <head>
        {/*
          No-flash theme script — runs before React hydrates so the user
          never sees a mismatched flash on refresh. Reads the saved
          preference from localStorage and adds the `dark` class
          immediately. First-time visitors (no saved value yet) default to
          dark mode, matching ThemeProvider's default — once they explicitly
          toggle, their choice is saved and always respected after that.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('Luuk-theme');if(t==='light'){document.documentElement.classList.remove('dark');}else{document.documentElement.classList.add('dark');}}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          {/* Ambient falling light strips — fixed layer behind all content */}
          <NeonStripsBackground />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

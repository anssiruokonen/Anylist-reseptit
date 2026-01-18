import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AnyList Recipes - Vercel Blob Storage',
  description: 'Recipe HTML storage using Vercel Blob',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: '2rem' }}>
        {children}
      </body>
    </html>
  );
}

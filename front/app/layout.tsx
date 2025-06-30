import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF Intelligence - Résumé automatique par IA',
  description: 'Application web pour générer automatiquement des résumés de documents PDF grâce à l\'intelligence artificielle',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="font-system antialiased min-h-screen w-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
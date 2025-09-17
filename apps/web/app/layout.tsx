
import './globals.css';
import type { Metadata } from 'next';
import { UserProvider } from '../components/context/UserContext';

export const metadata: Metadata = {
  title: 'AppliStash',
  description: 'Track your job applications',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}

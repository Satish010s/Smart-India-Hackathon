import './globals.css';
import { ThemeProvider } from '../components/shared/ThemeProvider';

export const metadata = {
  title: 'Quantum Learning Platform',
  description: 'Interactive Quantum Computing Learning Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

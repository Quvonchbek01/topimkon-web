import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

// Asosiy sayt: menyu + footer.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}

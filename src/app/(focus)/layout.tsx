import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

// Kirish va onboarding: faqat logo, menyu va footer yo‘q — foydalanuvchi bitta ishga e'tibor beradi.
export default function FocusLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="mx-auto flex h-16 max-w-xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          Top<span className="text-brand-dark">Imkon</span>
        </Link>
        <ThemeToggle />
      </header>
      <main id="main">{children}</main>
    </>
  );
}

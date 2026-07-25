import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="flex items-center justify-between px-6 py-5 lg:px-12 text-xs text-stone-500 dark:text-zinc-500 z-10 select-none">
      <span>© {currentYear} Skills.dev</span>
      <div className="flex gap-6">
        <Link 
          href="/Contact" 
          className="hover:text-[#ea580c] dark:hover:text-orange-400 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 inline-block"
        >
          Contact
        </Link>
        <Link 
          href="/Docs" 
          className="hover:text-[#ea580c] dark:hover:text-orange-400 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 inline-block"
        >
          Docs
        </Link>
      </div>
    </footer>
  );
}

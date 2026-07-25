import { SidebarProvider } from "../ui/sidebar";
import CustomSidebar from "../custom/sidebar";

export default function WelcomeLayout({
  sidebar,
  children,
  isDarkMode = true,
  bgImageSrc = "/sakura-signin.jpg",
}: {
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  isDarkMode?: boolean;
  bgImageSrc?: string;
}) {
  return (
    <div className={`flex min-h-screen w-full relative transition-colors duration-300 ${
      isDarkMode ? "bg-zinc-950 text-zinc-100" : "bg-[#faf9f6] text-slate-800"
    }`}>
      {/* Fixed Full-Viewport Blurred Background Layer (Never ends on scroll) */}
      <div 
        className={`fixed inset-0 bg-cover bg-[center_30%] filter blur-[30px] scale-105 -z-10 pointer-events-none transition-opacity duration-500 ${
          isDarkMode ? "opacity-30" : "opacity-25"
        }`} 
        style={{ backgroundImage: `url('${bgImageSrc}')` }} 
      />
      <div className={`fixed inset-0 -z-10 pointer-events-none backdrop-blur-xl transition-colors duration-300 ${
        isDarkMode ? "bg-zinc-950/75" : "bg-[#faf9f6]/75"
      }`} />

      <SidebarProvider>
        {sidebar || <CustomSidebar isDarkMode={isDarkMode} />}
        <main className="flex-1 w-full min-h-screen bg-transparent relative">
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
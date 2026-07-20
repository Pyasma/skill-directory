import { SidebarProvider } from "../ui/sidebar";
import CustomSidebar from "../custom/Sidebar";

/**
 * Provides a full-screen layout with a sidebar and scrollable main content area.
 *
 * @param children - The page content rendered in the main content area
 */
export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-screen overflow-hidden bg-[#faf9f6]">
      <SidebarProvider>
        <CustomSidebar />
        <main className="flex-1 overflow-y-auto no-scrollbar bg-[#faf9f6] relative text-[#1c1917]">
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
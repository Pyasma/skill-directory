import React from "react";
import { SidebarFooter } from "@/components/ui/sidebar";
import UserProfile from "@/components/custom/user-profile";

interface CustomSidebarFooterProps {
  isCollapsed: boolean;
  isDarkMode: boolean;
}

export function CustomSidebarFooter({
  isCollapsed,
  isDarkMode,
}: CustomSidebarFooterProps) {
  return (
    <SidebarFooter className="p-3">
      <div className={`flex flex-col select-none border transition-all duration-300 rounded-2xl ${
        isCollapsed ? "p-1.5 gap-2 items-center" : "p-3 gap-3"
      } ${
        isDarkMode 
          ? "bg-zinc-900/40 border-zinc-800/50 backdrop-blur-md" 
          : "bg-white border-slate-200"
      }`}>
        <div className={`flex items-center ${isCollapsed ? "flex-col text-center" : "gap-2.5"}`}>
          <UserProfile isDarkMode={isDarkMode} />
        </div>
      </div>
    </SidebarFooter>
  );
}

import React from "react";
import { SidebarHeader } from "@/components/ui/sidebar";
import { Logo } from "@/components/custom/logo";
import { Layers } from "lucide-react";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { PanelLeftOpen } from "@/components/animate-ui/icons/panel-left-open";
import { PanelLeftClose } from "@/components/animate-ui/icons/panel-left-close";

interface CustomSidebarHeaderProps {
  isCollapsed: boolean;
  isDarkMode: boolean;
  toggleSidebar: () => void;
}

export function CustomSidebarHeader({
  isCollapsed,
  isDarkMode,
  toggleSidebar,
}: CustomSidebarHeaderProps) {
  return (
    <SidebarHeader className="py-4">
      <div className={`flex items-center w-full ${isCollapsed ? "flex-col gap-2.5 justify-center" : "justify-between px-4"}`}>
        {!isCollapsed ? (
          <Logo size="sm" />
        ) : (
          <span className={`font-heading text-xl font-bold select-none ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
            <Layers className="size-5" /> 
          </span>
        )}
        <AnimateIcon animateOnHover>
          <button
            onClick={toggleSidebar}
            className={`p-1.5 rounded-lg border border-transparent transition-all cursor-pointer ${
              isDarkMode 
                ? "hover:bg-zinc-850 text-zinc-400 hover:text-zinc-100 hover:border-zinc-800" 
                : "hover:bg-slate-100 text-slate-500 hover:text-slate-900 hover:border-slate-200"
            }`}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16}/>}
          </button>
        </AnimateIcon>
      </div>
    </SidebarHeader>
  );
}

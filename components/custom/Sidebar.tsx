"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, PanelLeft, Sparkles, Layers, Settings, Puzzle, Terminal, BookOpen } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Sidebar, SidebarMenuItem, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarContent, SidebarFooter, useSidebar} from "../ui/sidebar";
import UserProfile from "./userProfile";
import { User } from '@supabase/supabase-js'

/**
 * Renders a collapsible sidebar for navigating skills, rules, integrations, and settings.
 *
 * @param activeSection - The skill section currently selected.
 * @param onSelectSection - Called with the identifier of a selected skill section.
 * @param onOpenLibrary - Called when the Skills Library tab is selected.
 * @returns The rendered sidebar.
 */
export default function CustomSidebar({
  activeSection = "overview",
  onSelectSection,
  onOpenLibrary,
}: {
  activeSection?: string;
  onSelectSection?: (sectionId: string) => void;
  onOpenLibrary?: () => void;
}) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [user, setUser] = useState<User | null>();
  const [activeTab, setActiveTab] = useState("skills");
  const { state, toggleSidebar } = useSidebar();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
      }
    });
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  const isCollapsed = state === "collapsed";
  const userId = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "pyasma";

  const skillSectionsList = [
    { id: "overview", label: "Overview", color: "bg-slate-700" },
    { id: "persistence", label: "Persistence", color: "bg-slate-500" },
    { id: "rules", label: "Rules", color: "bg-blue-600" },
    { id: "intensity", label: "Intensity Levels", color: "bg-amber-500", badge: 1 },
    { id: "guardrails", label: "Guardrails", color: "bg-rose-500", badge: 1 },
    { id: "integrations", label: "Integrations", color: "bg-emerald-600" },
  ];

  return (
    <Sidebar
      collapsible="icon"
      style={{
        "--sidebar": "#ffffff",
        "--sidebar-border": "#e2e8f0",
        "--sidebar-foreground": "#0f172a",
        "--sidebar-accent": "#f8fafc",
        "--sidebar-accent-foreground": "#0f172a",
      } as React.CSSProperties}
      className="border-r border-[#e2e8f0] bg-white"
    >
      <SidebarHeader className="py-4">
        <div className={`flex items-center w-full ${isCollapsed ? "flex-col gap-2.5 justify-center" : "justify-between px-4"}`}>
          {!isCollapsed ? (
            <span className="font-heading text-xl font-bold text-[#0f172a] flex items-center gap-2 select-none">
              <Sparkles className="size-5 text-[#0f172a]" /> Skills.dev
            </span>
          ) : (
            <span className="font-heading text-xl font-bold text-[#0f172a] select-none">
              S.
            </span>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-[#f1f5f9] text-[#64748b] hover:text-[#0f172a] border border-transparent hover:border-[#e2e8f0] transition-all cursor-pointer"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <PanelLeft className="size-4" />
          </button>
        </div>
      </SidebarHeader>

      <div className="mx-4 border-b border-[#e2e8f0]"></div>

      <SidebarContent className="py-3 px-2 flex flex-col gap-4">
        {/* Top Navigation Links */}
        <SidebarMenu className="flex flex-col gap-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setActiveTab("skills")}
              className={`w-full flex items-center rounded-xl transition-all duration-200 cursor-pointer ${
                isCollapsed ? "px-2 py-2.5 justify-center gap-0" : "px-4 py-2.5 gap-3"
              } ${
                activeTab === "skills"
                  ? "bg-[#0f172a] text-white font-semibold shadow-xs"
                  : "bg-transparent text-slate-600 hover:bg-[#f1f5f9] hover:text-[#0f172a]"
              }`}
            >
              <Terminal className="size-4 shrink-0" />
              {!isCollapsed && <span className="text-xs">Skills & Rules</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                setActiveTab("library");
                onOpenLibrary?.();
              }}
              className={`w-full flex items-center rounded-xl transition-all duration-200 cursor-pointer ${
                isCollapsed ? "px-2 py-2.5 justify-center gap-0" : "px-4 py-2.5 gap-3"
              } ${
                activeTab === "library"
                  ? "bg-[#0f172a] text-white font-semibold shadow-xs"
                  : "bg-transparent text-slate-600 hover:bg-[#f1f5f9] hover:text-[#0f172a]"
              }`}
            >
              <BookOpen className="size-4 shrink-0" />
              {!isCollapsed && <span className="text-xs">Skills Library</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setActiveTab("integrations")}
              className={`w-full flex items-center rounded-xl transition-all duration-200 cursor-pointer ${
                isCollapsed ? "px-2 py-2.5 justify-center gap-0" : "px-4 py-2.5 gap-3"
              } ${
                activeTab === "integrations"
                  ? "bg-[#0f172a] text-white font-semibold shadow-xs"
                  : "bg-transparent text-slate-600 hover:bg-[#f1f5f9] hover:text-[#0f172a]"
              }`}
            >
              <Puzzle className="size-4 shrink-0" />
              {!isCollapsed && <span className="text-xs">Agent Integrations</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center rounded-xl transition-all duration-200 cursor-pointer ${
                isCollapsed ? "px-2 py-2.5 justify-center gap-0" : "px-4 py-2.5 gap-3"
              } ${
                activeTab === "settings"
                  ? "bg-[#0f172a] text-white font-semibold shadow-xs"
                  : "bg-transparent text-slate-600 hover:bg-[#f1f5f9] hover:text-[#0f172a]"
              }`}
            >
              <Settings className="size-4 shrink-0" />
              {!isCollapsed && <span className="text-xs">Settings</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {!isCollapsed && <div className="mx-2 border-b border-[#e2e8f0]" />}

        {/* Skill Rule Sections Tree Navigation */}
        {!isCollapsed && (
          <div className="flex flex-col gap-1.5 px-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
              <Layers className="size-3 text-[#0f172a]" /> Skill Sections
            </span>
            <div className="flex flex-col gap-0.5">
              {skillSectionsList.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => onSelectSection?.(sec.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                    activeSection === sec.id
                      ? "bg-[#f1f5f9] font-semibold text-[#0f172a]"
                      : "text-slate-600 hover:bg-[#f8fafc] hover:text-[#0f172a]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${sec.color}`} />
                    <span>{sec.label}</span>
                  </div>
                  {sec.badge && (
                    <span className="text-[10px] font-bold bg-[#0f172a] text-white px-1.5 py-0.5 rounded-full">
                      {sec.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className={`flex flex-col select-none bg-white border border-[#e2e8f0] rounded-2xl ${
          isCollapsed ? "p-1.5 gap-2 items-center" : "p-3 gap-3"
        }`}>
          <div className={`flex items-center ${isCollapsed ? "flex-col text-center" : "gap-2.5"}`}>
            <UserProfile />
            {!isCollapsed ? (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-900 truncate">
                  {userId}
                </span>
                <span className="text-[10px] text-slate-500 truncate">
                  {user?.email || "piyush@example.com"}
                </span>
              </div>
            ) : (
              <span className="text-[9px] font-mono font-bold text-slate-500 max-w-[40px] truncate">
                {userId}
              </span>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className={`flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
              isCollapsed
                ? "size-8 rounded-full border border-[#e2e8f0] bg-[#f8fafc] text-slate-700 hover:text-rose-600 hover:border-rose-200 mx-auto"
                : "w-full gap-2 py-2 px-3 text-xs font-semibold text-slate-700 hover:text-rose-600 bg-[#f8fafc] border border-[#e2e8f0] hover:border-rose-200 rounded-xl"
            }`}
            title="Sign Out"
          >
            <LogOut className="size-3.5" />
            {!isCollapsed && "Sign Out"}
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
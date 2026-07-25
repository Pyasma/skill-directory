import React, { useRef } from "react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Telescope, Upload, Puzzle, Settings } from "lucide-react";
import { toast } from "sonner";

interface TopNavProps {
  isCollapsed: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  getMenuButtonClass: (tabId: string) => string;
  onOpenLibrary?: () => void;
  onUploadSuccess?: () => void;
  activeProject?: string;
}

export function TopNav({
  isCollapsed,
  activeTab,
  setActiveTab,
  getMenuButtonClass,
  onOpenLibrary,
  onUploadSuccess,
  activeProject,
}: TopNavProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const toastId = toast.loading(`Uploading ${file.name} to database...`);
      try {
        const { uploadSkillsAction } = await import("@/action/skills");
        const res = await uploadSkillsAction(content, file.name, activeProject);
        if (res.success) {
          toast.success(`Successfully uploaded ${file.name} to ${activeProject || "Core Skills"}!`, { id: toastId });
          onUploadSuccess?.();
        } else {
          toast.error(res.error || "Failed to upload skills", { id: toastId });
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to upload skills", { id: toastId });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <SidebarMenu className="flex flex-col gap-1">
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={handleUploadClick}
          className={getMenuButtonClass("upload")}
        >
          <Upload className="size-5 shrink-0" />
          {!isCollapsed && <span className="text-sm font-semibold">Upload Markdown</span>}
        </SidebarMenuButton>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".md"
          className="hidden"
        />
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => {
            setActiveTab("library");
            onOpenLibrary?.();
          }}
          className={getMenuButtonClass("library")}
        >
          <Telescope className="size-4 shrink-0" />
          {!isCollapsed && <span className="text-sm">Explore</span>}
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => setActiveTab("integrations")}
          className={getMenuButtonClass("integrations")}
        >
          <Puzzle className="size-4 shrink-0" />
          {!isCollapsed && <span className="text-sm">Agent Integrations</span>}
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => setActiveTab("settings")}
          className={getMenuButtonClass("settings")}
        >
          <Settings className="size-4 shrink-0" />
          {!isCollapsed && <span className="text-sm">Settings</span>}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

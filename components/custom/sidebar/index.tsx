"use client";

import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, SidebarContent, useSidebar} from "../../ui/sidebar";
import { User } from '@supabase/supabase-js';
import { ProjectSkills } from "../project-skills";
import { TopNav } from "./top-nav";
import { CustomSidebarHeader } from "./header";
import { CustomSidebarFooter } from "./footer";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export interface ProjectItem {
  id: string;
  projectName: string;
  skillsCount?: number;
  skills?: string[];
}

export default function CustomSidebar({
  activeProject = "Core Skills",
  activeSkill = "daytona-v7-plan.md",
  onSelectProject,
  onSelectSkill,
  onCreateProject,
  onAddSkill,
  onDeleteProject,
  onOpenCreateProjectModal,
  onOpenLibrary,
  onUploadSuccess,
  isDarkMode = true,
  projects,
}: {
  activeProject?: string;
  activeSkill?: string;
  onSelectProject?: (projectId: string) => void;
  onSelectSkill?: (projectId: string, skillName: string) => void;
  onCreateProject?: (projectName: string) => void;
  onAddSkill?: (projectName: string, skillName: string) => void;
  onDeleteProject?: (projectId: string) => void;
  onOpenCreateProjectModal?: () => void;
  onOpenLibrary?: () => void;
  onUploadSuccess?: () => void;
  isDarkMode?: boolean;
  projects?: ProjectItem[];
}) {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>();
  const [activeTab, setActiveTab] = useState("skills");
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const [addingSkillForProject, setAddingSkillForProject] = useState<string | null>(null);
  const [newSkillName, setNewSkillName] = useState("");


  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    onCreateProject?.(newProjectName.trim());
    setNewProjectName("");
    setIsCreatingProject(false);
  };

  const handleAddSkillSubmit = (projectName: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    onAddSkill?.(projectName, newSkillName.trim());
    setNewSkillName("");
    setAddingSkillForProject(null);
  };

  const toggleProjectExpanded = (projId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedProjects((prev) => ({
      ...prev,
      [projId]: !prev[projId],
    }));
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
      }
    });
  }, [supabase]);

  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const projectsList = projects || [];

  const getMenuButtonClass = (tabId: string) => {
    const collapsedClass = isCollapsed ? "sidebar-btn--collapsed" : "sidebar-btn--expanded";
    const activeClass = activeTab === tabId ? "menu-nav-btn--active" : "menu-nav-btn--inactive";
    return `sidebar-btn ${collapsedClass} ${activeClass}`;
  };

  const getProjectButtonClass = (projId: string) => {
    const isThisProject = activeProject === projId || activeProject.toLowerCase() === projId.toLowerCase();
    const isActive = activeTab === "skills" && isThisProject && (!activeSkill || activeSkill.trim() === "");
    return `group project-btn ${isActive ? "project-btn--active" : "project-btn--inactive"}`;
  };

  return (
    <Sidebar
      collapsible="icon"
      style={(isDarkMode ? {
        "--sidebar": "rgba(9, 9, 11, 0.4)",
        "--sidebar-border": "rgba(39, 39, 42, 0.4)",
        "--sidebar-foreground": "#f4f4f5",
        "--sidebar-accent": "rgba(39, 39, 42, 0.3)",
        "--sidebar-accent-foreground": "#ffffff",
      } : {
        "--sidebar": "rgba(255, 255, 255, 0.8)",
        "--sidebar-border": "rgba(226, 232, 240, 0.8)",
        "--sidebar-foreground": "#0f172a",
        "--sidebar-accent": "rgba(241, 245, 249, 0.8)",
        "--sidebar-accent-foreground": "#0f172a",
      }) as React.CSSProperties}
      className={`border-r transition-colors duration-300 ${
        isDarkMode 
          ? "border-zinc-800/40 bg-zinc-950/45 backdrop-blur-xl" 
          : "border-slate-200 bg-white/80 backdrop-blur-xl"
      }`}
    >
      <CustomSidebarHeader
        isCollapsed={isCollapsed}
        isDarkMode={isDarkMode}
        toggleSidebar={toggleSidebar}
      />

      <div className={`mx-4 border-b transition-colors duration-300 ${isDarkMode ? "border-zinc-800/40" : "border-slate-200"}`} />

      <SidebarContent className="py-3 px-2 flex flex-col gap-4">
        <TopNav
          isCollapsed={isCollapsed}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          getMenuButtonClass={getMenuButtonClass}
          onOpenLibrary={onOpenLibrary}
          onUploadSuccess={onUploadSuccess}
          activeProject={activeProject}
        />

        <ProjectSkills
          isCollapsed={isCollapsed}
          isDarkMode={isDarkMode}
          isCreatingProject={isCreatingProject}
          setIsCreatingProject={setIsCreatingProject}
          newProjectName={newProjectName}
          setNewProjectName={setNewProjectName}
          handleCreateProjectSubmit={handleCreateProjectSubmit}
          projectsList={projectsList}
          expandedProjects={expandedProjects}
          activeProject={activeProject}
          activeSkill={activeSkill}
          activeTab={activeTab}
          onSelectProject={(id) => {
            setActiveTab("skills");
            onSelectProject?.(id);
          }}
          onSelectSkill={(id, skillName) => {
            setActiveTab("skills");
            onSelectSkill?.(id, skillName);
          }}
          onDeleteProject={onDeleteProject}
          onOpenCreateProjectModal={onOpenCreateProjectModal}
          getProjectButtonClass={getProjectButtonClass}
          toggleProjectExpanded={toggleProjectExpanded}
          addingSkillForProject={addingSkillForProject}
          setAddingSkillForProject={setAddingSkillForProject}
          handleAddSkillSubmit={handleAddSkillSubmit}
          newSkillName={newSkillName}
          setNewSkillName={setNewSkillName}
        />
      </SidebarContent>

      <CustomSidebarFooter
        isCollapsed={isCollapsed}
        isDarkMode={isDarkMode}
      />
    </Sidebar>
  );
}
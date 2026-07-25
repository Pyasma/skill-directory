"use client";

import * as React from "react";
import WelcomeLayout from "@/components/layout/welcome-layout";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { WelcomeHeader } from "@/components/custom/header/welcome-header";
import { MdBody } from "@/components/custom/markdown-viewer";
import CustomSidebar, { ProjectItem } from "@/components/custom/sidebar";
import Footer from "@/components/custom/footer";
import { CreateProjectModal } from "@/components/custom/create-project-modal";
import { useTheme } from "@/components/theme-provider";
import { toast } from "sonner";

export default function WelcomePage() {
  const supabase = createSupabaseBrowserClient();
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";

  const [user, setUser] = React.useState<User | null>();
  const [locked, setLocked] = React.useState(false);
  const [lockedBlocks, setLockedBlocks] = React.useState<string[]>([]);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = React.useState(false);
  const [editorMode, setEditorMode] = React.useState<"visual" | "raw">("visual");
  const [activeTab, setActiveTab] = React.useState<"editor" | "library">("editor");
  const [activeProject, setActiveProject] = React.useState("");
  const [activeSkill, setActiveSkill] = React.useState("");
  const [markdown, setMarkdown] = React.useState<string>("");
  const [projectList, setProjectList] = React.useState<ProjectItem[]>([]);

  const toggleBlockLock = React.useCallback((title: string) => {
    setLockedBlocks((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  }, []);

  const loadProjectSkills = React.useCallback(async (projectName: string, skillName: string) => {
    try {
      const { getSkillsAction } = await import("@/action/skills");
      const res = await getSkillsAction(projectName, skillName);
      if (res.success && res.markdown !== undefined) {
        setMarkdown(res.markdown);
      }
    } catch (err) {
      console.error("Failed to load skills from database:", err);
    }
  }, []);

  const loadProjects = React.useCallback(async () => {
    try {
      const { getProjectsAction } = await import("@/action/skills");
      const res = await getProjectsAction();
      if (res.success && res.projects) {
        setProjectList(res.projects);
      }
    } catch (err) {
      console.error("Failed to load projects from database:", err);
    }
  }, []);

  const handleSelectProject = React.useCallback((projId: string) => {
    // Just select the project, maybe we don't load a skill yet or we load the first one
    setActiveProject(projId);
  }, []);

  const handleSelectSkill = React.useCallback(async (projId: string, skillName: string) => {
    setActiveProject(projId);
    setActiveSkill(skillName);
    await loadProjectSkills(projId, skillName);
  }, [loadProjectSkills]);

  const handleCreateProject = React.useCallback(async (projectName: string, description?: string) => {
    const toastId = toast.loading(`Creating project ${projectName}...`);
    try {
      const { createProjectAction } = await import("@/action/skills");
      const res = await createProjectAction(projectName, description);
      if (res.success && res.project) {
        toast.success(`Project ${res.project.projectName} created in Database!`, { id: toastId });
        await loadProjects();
        setActiveProject(res.project.projectName);
        setActiveSkill("overview.md");
        await loadProjectSkills(res.project.projectName, "overview.md");
      } else {
        toast.error(res.error || "Failed to create project", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create project", { id: toastId });
    }
  }, [loadProjects, loadProjectSkills]);

  const handleAddSkill = React.useCallback(async (projectName: string, skillName: string) => {
    const toastId = toast.loading(`Adding skill ${skillName} to ${projectName}...`);
    try {
      const { addSkillToProjectAction } = await import("@/action/skills");
      const res = await addSkillToProjectAction(projectName, skillName);
      if (res.success) {
        toast.success(`Skill ${skillName} added to ${projectName}!`, { id: toastId });
        await loadProjects();
        setActiveProject(projectName);
        setActiveSkill(skillName);
        await loadProjectSkills(projectName, skillName);
      } else {
        toast.error(res.error || "Failed to add skill", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to add skill", { id: toastId });
    }
  }, [loadProjects, loadProjectSkills]);

  const handleUploadSuccess = React.useCallback(async () => {
    await loadProjects();
    await loadProjectSkills(activeProject, activeSkill);
  }, [loadProjects, loadProjectSkills, activeProject, activeSkill]);

  const handleDeleteProject = React.useCallback(async (projectId: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    const toastId = toast.loading("Deleting project...");
    try {
      const { deleteProjectAction } = await import("@/action/skills");
      const res = await deleteProjectAction(projectId);
      if (res.success) {
        toast.success("Project deleted successfully!", { id: toastId });
        
        // If we deleted the active project, clear it
        if (activeProject === projectId || projectList.find(p => p.id === projectId)?.projectName === activeProject) {
          setActiveProject("");
          setActiveSkill("");
        }
        
        await loadProjects();
      } else {
        toast.error(res.error || "Failed to delete project", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete project", { id: toastId });
    }
  }, [loadProjects, activeProject, projectList]);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        loadProjects();
        loadProjectSkills(activeProject, activeSkill);
      }
    });
  }, [supabase, loadProjects, loadProjectSkills, activeProject, activeSkill]);

  const username = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "pyasma";

  const handleToggleTheme = React.useCallback(() => {
    setTheme(isDarkMode ? "light" : "dark");
  }, [isDarkMode, setTheme]);

  const sidebar = (
    <CustomSidebar 
      onUploadSuccess={handleUploadSuccess}
      isDarkMode={isDarkMode}
      activeProject={activeProject}
      activeSkill={activeSkill}
      onSelectProject={handleSelectProject}
      onSelectSkill={handleSelectSkill}
      onCreateProject={handleCreateProject}
      onAddSkill={handleAddSkill}
      onDeleteProject={handleDeleteProject}
      onOpenCreateProjectModal={() => setIsCreateProjectModalOpen(true)}
      projects={projectList}
    />
  );

  return (
    <WelcomeLayout sidebar={sidebar} isDarkMode={isDarkMode}>
      <div className="relative z-10 flex flex-col px-6 lg:px-12 py-8 gap-6 w-full max-w-7xl mx-auto min-h-screen text-left font-sans bg-transparent">
        <WelcomeHeader
          username={username}
          mdfile={activeSkill}
          activeTab={activeTab}
          locked={locked}
          setLocked={setLocked}
          editorMode={editorMode}
          setEditorMode={setEditorMode}
          onUploadSuccess={handleUploadSuccess}
          isDarkMode={isDarkMode}
          setIsDarkMode={handleToggleTheme}
        />

        <div className="flex-1 w-full flex flex-col gap-6">
          <MdBody 
            markdown={markdown} 
            masterLocked={locked}
            lockedBlocks={lockedBlocks}
            onToggleBlockLock={toggleBlockLock}
            isDarkMode={isDarkMode}
          />
        </div>
        <Footer />
      </div>

      <CreateProjectModal 
        isOpen={isCreateProjectModalOpen} 
        onClose={() => setIsCreateProjectModalOpen(false)} 
        isDarkMode={isDarkMode} 
        onCreateProject={handleCreateProject} 
      />
    </WelcomeLayout>
  );
}

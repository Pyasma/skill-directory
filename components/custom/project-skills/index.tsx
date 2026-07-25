import { Plus, ChevronDown, ChevronRight, FileCode, Zap, FilePlusCorner, Trash2 } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { ProjectItem } from "../sidebar";

interface ProjectProps  {
    isCollapsed: boolean;
    isDarkMode: boolean;
    isCreatingProject: boolean;
    setIsCreatingProject: React.Dispatch<React.SetStateAction<boolean>>;
    newProjectName: string;
    setNewProjectName: React.Dispatch<React.SetStateAction<string>>;
    handleCreateProjectSubmit: (e: React.FormEvent) => void;
    projectsList: ProjectItem[];
    expandedProjects: Record<string, boolean>;
    activeProject: string;
    activeSkill: string;
    activeTab: string;
    onSelectProject?: (projectId: string) => void;
    onSelectSkill?: (projectId: string, skillName: string) => void;
    onDeleteProject?: (projectId: string) => void;
    onOpenCreateProjectModal?: () => void;
    getProjectButtonClass: (projId: string) => string;
    toggleProjectExpanded: (projId: string, e: React.MouseEvent) => void;
    addingSkillForProject: string | null;
    setAddingSkillForProject: React.Dispatch<React.SetStateAction<string | null>>;
    handleAddSkillSubmit: (projectId: string, e: React.FormEvent) => void;
    newSkillName: string;
    setNewSkillName: React.Dispatch<React.SetStateAction<string>>;
}

export function ProjectSkills({
    isCollapsed, 
    isDarkMode, 
    isCreatingProject, 
    setIsCreatingProject,
    newProjectName,
    setNewProjectName,
    handleCreateProjectSubmit,
    projectsList,
    expandedProjects,
    activeProject,
    activeSkill,
    activeTab,
    onSelectProject,
    onSelectSkill,
    onDeleteProject,
    onOpenCreateProjectModal,
    getProjectButtonClass,
    toggleProjectExpanded,
    addingSkillForProject,
    setAddingSkillForProject,
    handleAddSkillSubmit,
    newSkillName,
    setNewSkillName
}: ProjectProps) {
    const router = useRouter();
    
    return (
        <>
        {!isCollapsed && <div className={`mx-2 border-b transition-colors duration-300 ${isDarkMode ? "border-zinc-800/40" : "border-slate-200"}`} />}
{       !isCollapsed && (
          <div className="flex flex-col gap-1.5 px-2">
            <div className="flex items-center justify-between px-2 py-1 group">
              <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${isDarkMode ? "text-zinc-400" : "text-slate-500"}`}>
                Projects & Skills
              </span>
              <button
                onClick={onOpenCreateProjectModal}
                className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-200 dark:hover:bg-zinc-800 ${isDarkMode ? "text-zinc-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}
                title="Add Project"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Inline New Project Form */}
            {isCreatingProject && (
              <form onSubmit={handleCreateProjectSubmit} className="flex items-center gap-1.5 px-1 py-1">
                <input
                  type="text"
                  placeholder="Project name (e.g. My API)"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  autoFocus
                  className={`w-full px-2 py-1 text-xs rounded-lg border outline-none font-sans ${
                    isDarkMode
                      ? "bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-orange-500"
                      : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-orange-500"
                  }`}
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white cursor-pointer shrink-0"
                >
                  Save
                </button>
              </form>
            )}

            <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar pt-0.5 max-h-80">
              {projectsList.map((proj) => {
                const isExpanded = expandedProjects[proj.id] ?? false;
                const isSelected = activeProject === proj.id || activeProject.toLowerCase() === proj.id.toLowerCase();

                return (
                  <div key={proj.id} className="flex flex-col gap-0.5">
                    {/* Project Item */}
                    <div
                      onClick={(e) => {
                        onSelectProject?.(proj.id);
                        toggleProjectExpanded(proj.id, e);
                      }}
                      className={getProjectButtonClass(proj.id)}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <button
                          onClick={(e) => toggleProjectExpanded(proj.id, e)}
                          className="p-0.5 hover:bg-zinc-700/50 rounded transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="size-3 text-zinc-400" />
                          ) : (
                            <ChevronRight className="size-3 text-zinc-400" />
                          )}
                        </button>
                        <FileCode className={`size-3.5 shrink-0 ${isSelected ? "text-orange-500" : (isDarkMode ? "text-zinc-400" : "text-slate-500")}`} />
                        <span className="truncate">{proj.projectName}</span>
                      </div>

                      {/* Actions Container */}
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Delete Project Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteProject?.(proj.id);
                          }}
                          className={`opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-red-500/10 text-red-500/0 hover:text-red-500 transition-all`}
                          title="Delete Project"
                        >
                          <Trash2 className="size-3" />
                        </button>
                        
                        {/* Add Skill Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setAddingSkillForProject(addingSkillForProject === proj.id ? null : proj.id);
                          }}
                          className={`p-1.5 rounded hover:bg-zinc-700/40 text-[10px] font-semibold flex items-center gap-0.5 transition-colors ${
                            isDarkMode ? "text-zinc-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
                          }`}
                          title="Add Skill to Project"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Inline Add Skill Form */}
                    {addingSkillForProject === proj.id && (
                      <form onSubmit={(e) => handleAddSkillSubmit(proj.id, e)} className="flex items-center gap-1.5 pl-6 pr-1 py-1">
                        <input
                          type="text"
                          placeholder="Skill name (e.g. Authentication)"
                          value={newSkillName}
                          onChange={(e) => setNewSkillName(e.target.value)}
                          autoFocus
                          className={`w-full px-2 py-0.5 text-xs rounded border outline-none font-sans ${
                            isDarkMode
                              ? "bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-orange-500"
                              : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-orange-500"
                          }`}
                        />
                        <button
                          type="submit"
                          className="px-2 py-0.5 text-xs font-semibold rounded bg-[#ea580c] text-white cursor-pointer shrink-0"
                        >
                          Add
                        </button>
                      </form>
                    )}

                    {/* Nested Skills List under Project */}
                    {isExpanded && proj.skills && proj.skills.length > 0 && (
                      <div className="flex flex-col gap-0.5 pl-6 pr-1 py-0.5 border-l border-zinc-800 ml-3">
                        {proj.skills.map((skill, sIdx) => {
                          const isSkillSelected = activeTab === "skills" && activeProject === proj.id && activeSkill === skill;
                          return (
                            <div
                              key={sIdx}
                              onClick={() => onSelectSkill?.(proj.id, skill)}
                              className={`flex items-center gap-2 px-2 py-1 rounded-lg text-[11px] cursor-pointer transition-colors ${
                                isSkillSelected
                                  ? (isDarkMode ? "bg-zinc-800 text-white font-semibold" : "bg-slate-200 text-slate-900 font-semibold")
                                  : (isDarkMode ? "text-zinc-400 hover:bg-zinc-900/60 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900")
                              }`}
                            >
                              <Zap className={`size-2.5 shrink-0 ${isSkillSelected ? "text-orange-500" : "text-orange-400"}`} />
                              <span className="truncate">{skill}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        </>
    )
}
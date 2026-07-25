"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FolderPlus, ArrowLeft } from "lucide-react";
import { createProjectAction } from "@/action/skills";
import { useTheme } from "@/components/theme-provider";

export default function CreateProjectPage() {
  const router = useRouter();
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      toast.error("Project name is required");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Creating project...");
    
    try {
      const res = await createProjectAction(projectName, description);
      if (res.success) {
        toast.success(`Project ${projectName} created!`, { id: toastId });
        router.push("/welcome"); // Redirect back to workspace
      } else {
        toast.error(res.error || "Failed to create project", { id: toastId });
        setIsLoading(false);
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong", { id: toastId });
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${isDarkMode ? 'bg-zinc-950' : 'bg-slate-50'}`}>
      <div className={`w-full max-w-md p-8 rounded-2xl shadow-xl border ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800/50 backdrop-blur-xl' : 'bg-white border-slate-200'}`}>
        
        <button 
          onClick={() => router.push("/welcome")}
          className={`flex items-center text-sm mb-8 transition-colors ${isDarkMode ? 'text-zinc-400 hover:text-zinc-200' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Workspace
        </button>

        <div className="flex items-center mb-6">
          <div className={`p-3 rounded-xl mr-4 ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
            <FolderPlus className="size-6" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold font-heading ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Create Project</h1>
            <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>Start organizing your skills.</p>
          </div>
        </div>

        <form onSubmit={handleCreate} className="space-y-5">
          <div className="space-y-2">
            <label className={`text-sm font-medium ${isDarkMode ? 'text-zinc-300' : 'text-slate-700'}`}>
              Project Name
            </label>
            <Input 
              placeholder="e.g. Frontend Architecture" 
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className={isDarkMode ? 'bg-zinc-950/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600' : ''}
              disabled={isLoading}
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <label className={`text-sm font-medium ${isDarkMode ? 'text-zinc-300' : 'text-slate-700'}`}>
              Description <span className="text-zinc-500 font-normal">(Optional)</span>
            </label>
            <Input 
              placeholder="A brief description of this project..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={isDarkMode ? 'bg-zinc-950/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600' : ''}
              disabled={isLoading}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 mt-4"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Project"}
          </Button>
        </form>
      </div>
    </div>
  );
}

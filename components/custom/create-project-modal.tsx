import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FolderPlus, X } from "lucide-react";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onCreateProject: (projectName: string, description?: string) => Promise<void>;
}

export function CreateProjectModal({
  isOpen,
  onClose,
  isDarkMode,
  onCreateProject,
}: CreateProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setProjectName("");
      setDescription("");
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      toast.error("Project name is required");
      return;
    }

    setIsLoading(true);
    try {
      await onCreateProject(projectName.trim(), description.trim());
      onClose();
    } catch (err) {
      // Error handling is mostly done in the action, but just in case
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={!isLoading ? onClose : undefined}
      />
      
      {/* Modal Content */}
      <div 
        className={`relative w-full max-w-md p-8 rounded-2xl shadow-2xl border transition-all duration-300 transform scale-100 ${
          isDarkMode 
            ? 'bg-zinc-900 border-zinc-800' 
            : 'bg-white border-slate-200'
        }`}
      >
        <button 
          onClick={onClose}
          disabled={isLoading}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            isDarkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center mb-6 mt-2">
          <div className={`p-3 rounded-xl mr-4 ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
            <FolderPlus className="size-6" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold font-heading ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Create Project</h2>
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
              className={isDarkMode ? 'bg-zinc-950/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500' : 'focus:border-blue-500'}
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
              className={isDarkMode ? 'bg-zinc-950/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500' : 'focus:border-blue-500'}
              disabled={isLoading}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 mt-4 h-11"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Project"}
          </Button>
        </form>
      </div>
    </div>
  );
}

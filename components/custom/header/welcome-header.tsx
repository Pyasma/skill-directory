"use client";

import { LockIcon } from "@/components/animate-ui/icons/lock";
import { LockOpenIcon } from "@/components/animate-ui/icons/lock-open";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { TerminalIcon } from "@/components/animate-ui/icons/terminal";
import { ClockIcon } from "@/components/animate-ui/icons/clock";
import { ClockRotateIcon } from "@/components/animate-ui/icons/clock-rotate";
import { ExternalLink } from "@/components/animate-ui/icons/external-link";
import Custompopover from "../popovers/custom-popover";
import { FileCode, LayoutGrid, Upload, Sun, Moon } from "lucide-react";
import { Ellipsis } from "../../animate-ui/icons/ellipsis";
import { useRef } from "react";
import { toast } from "sonner";

interface WelcomeHeaderProps {
  username: string;
  mdfile: string;
  activeTab: string;
  locked: boolean;
  setLocked: React.Dispatch<React.SetStateAction<boolean>>;
  editorMode: "visual" | "raw";
  setEditorMode: React.Dispatch<React.SetStateAction<"visual" | "raw">>;
  onUploadSuccess?: () => void;
  isDarkMode?: boolean;
  setIsDarkMode?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function WelcomeHeader({
  username,
  mdfile,
  activeTab,
  locked,
  editorMode,
  setEditorMode,
  setLocked,
  onUploadSuccess,
  isDarkMode = true,
  setIsDarkMode,
}: WelcomeHeaderProps) {
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

      const toastId = toast.loading("Uploading markdown to database...");
      try {
        const { uploadSkillsAction } = await import("@/action/skills");
        const res = await uploadSkillsAction(content, file.name);
        if (res.success) {
          toast.success(`Successfully uploaded ${file.name}!`, { id: toastId });
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
    <>
      {/* Top Header & Navigation Bar */}
      <div className={`flex flex-col gap-4 border-b pb-6 w-full transition-colors duration-300 ${
        isDarkMode ? "border-zinc-800/60" : "border-slate-200"
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Title + Percentage Popover right beside the name */}
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className={`text-2xl lg:text-3xl font-bold tracking-tight font-sans flex items-center gap-2.5 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}>
              <AnimateIcon animateOnHover>
                <TerminalIcon className={`size-6 ${isDarkMode ? "text-orange-400" : "text-[#ea580c]"}`} />
              </AnimateIcon>
              <span>{username}{mdfile ? ` / ${mdfile}` : ""}</span>
            </h1>

            {/* Bloom Target Score Percentage Popover right beside name */}
            {mdfile && (
              <div className="inline-flex items-center">
                <Custompopover />
              </div>
            )}
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-2 flex-wrap">
            <AnimateIcon animateOnHover>
              <button
                onClick={handleUploadClick}
                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#ea580c] hover:bg-[#c2410c] dark:bg-orange-600 dark:hover:bg-orange-500 border border-orange-500 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Upload className="size-3.5" />
                <span>Upload .md</span>
              </button>
            </AnimateIcon>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".md"
              className="hidden"
            />

            <AnimateIcon animateOnHover>
              <button
                className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs border ${
                  isDarkMode
                    ? "text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border-zinc-800"
                    : "text-slate-700 bg-white hover:bg-slate-50 border-slate-200"
                }`}
              >
                <ClockRotateIcon className="size-3.5" />
                <span>Activity</span>
              </button>
            </AnimateIcon>

            <AnimateIcon animateOnHover loop>
              <button
                className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs border ${
                  isDarkMode
                    ? "text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border-zinc-800"
                    : "text-slate-700 bg-white hover:bg-slate-50 border-slate-200"
                }`}
              >
                <ExternalLink className="size-3.5" />
                <span>Share</span>
              </button>
            </AnimateIcon>

            {/* Theme Toggle Button */}
            <AnimateIcon animateOnHover>
              <button
                onClick={() => setIsDarkMode?.(!isDarkMode)}
                className={`flex items-center justify-center size-8.5 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                  isDarkMode
                    ? "text-yellow-400 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-yellow-300"
                    : "text-amber-500 bg-white border-slate-200 hover:bg-slate-50 hover:text-amber-600"
                }`}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
              </button>
            </AnimateIcon>

            {/* Lock Button */}
            <AnimateIcon animateOnHover loop>
              <button
                onClick={() => setLocked(!locked)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs border ${
                  locked
                    ? "bg-amber-500/15 text-amber-400 border-amber-500/40 hover:bg-amber-500/20"
                    : isDarkMode
                    ? "text-zinc-300 bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800"
                    : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50"
                }`}
                title={locked ? "Master Lock is Active. Click to Unlock." : "Master Lock is Disabled. Click to Lock."}
              >
                {locked ? (
                  <LockIcon className="size-3.5 text-amber-400" />
                ) : (
                  <LockOpenIcon className="size-3.5 text-zinc-400" />
                )}
                <span>{locked ? "Locked" : "Unlocked"}</span>
              </button>
            </AnimateIcon>

            <AnimateIcon animateOnHover="jump">
              <button className={`flex items-center justify-center size-8.5 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                isDarkMode
                  ? "text-zinc-200 bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800"
                  : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50"
              }`}>
                <Ellipsis className="size-4" />
              </button>
            </AnimateIcon>
          </div>
        </div>

        {/* Subtitle & Editor Mode Switcher */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className={`flex items-center gap-1.5 text-xs ${
            isDarkMode ? "text-zinc-400" : "text-slate-500"
          }`}>
            <AnimateIcon animateOnHover>
              <ClockIcon className="size-3.5" />
            </AnimateIcon>
            <span>Skill rule auto-saved just now</span>
          </div>

          {/* Mode Switcher: Visual Block vs Whole Raw MD */}
          {activeTab === "editor" && (
            <div className={`flex items-center p-1 border rounded-xl ${
              isDarkMode ? "bg-zinc-900/60 border-zinc-800" : "bg-slate-100 border-slate-200"
            }`}>
              <button
                onClick={() => setEditorMode("visual")}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  editorMode === "visual"
                    ? isDarkMode
                      ? "bg-zinc-800 text-zinc-100 font-semibold shadow-2xs"
                      : "bg-white text-slate-900 font-semibold shadow-2xs border border-slate-200"
                    : isDarkMode
                    ? "text-zinc-400 hover:text-zinc-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LayoutGrid className="size-3.5" />
                <span>Visual Sections</span>
              </button>
              <button
                onClick={() => setEditorMode("raw")}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  editorMode === "raw"
                    ? isDarkMode
                      ? "bg-zinc-800 text-zinc-100 font-semibold shadow-2xs"
                      : "bg-white text-slate-900 font-semibold shadow-2xs border border-slate-200"
                    : isDarkMode
                    ? "text-zinc-400 hover:text-zinc-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FileCode className="size-3.5" />
                <span>Full Raw .md</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
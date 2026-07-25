"use client";

import * as React from "react";
import { LockIcon } from "../../animate-ui/icons/lock";
import { LockOpenIcon } from "../../animate-ui/icons/lock-open";
import { AnimateIcon } from "../../animate-ui/icons/icon";
import Custompopover from "../popovers/custom-popover";
import { getSections } from "@/lib/get-skills";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Clean 3-color professional palette for section borders & indicators
const colors = [
  "border-[#ea580c]",
  "border-emerald-500",
  "border-indigo-500",
];

const dotColors = [
  "bg-[#ea580c]",
  "bg-emerald-500",
  "bg-indigo-500",
];

export function colorFor(title: string) {
  let hash = 0;
  for (const c of title) {
    hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
  }
  return colors[hash % colors.length];
}

export function dotColorFor(title: string) {
  let hash = 0;
  for (const c of title) {
    hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
  }
  return dotColors[hash % dotColors.length];
}

interface MdBodyProps {
  markdown: string;
  masterLocked: boolean;
  lockedBlocks: string[];
  onToggleBlockLock: (title: string) => void;
  isDarkMode?: boolean;
}

export function MdBody({
  markdown,
  masterLocked,
  lockedBlocks,
  onToggleBlockLock,
  isDarkMode = true,
}: MdBodyProps) {
  if (!markdown) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 text-center ${isDarkMode ? "text-zinc-500" : "text-slate-400"}`}>
        <p className="text-sm font-medium">No skills markdown content available.</p>
        <p className="text-xs mt-1">Upload a markdown file to get started.</p>
      </div>
    );
  }

  const sections = getSections(markdown);

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {sections.map((section, idx) => {
        const isBlockLocked = lockedBlocks.includes(section.title);
        const isCurrentlyLocked = masterLocked || isBlockLocked;
        
        let titleSizeClass = "text-2xl lg:text-3xl";
        let badgeScale = "scale-100";
        if (section.level === 2) {
           titleSizeClass = "text-xl lg:text-2xl";
           badgeScale = "scale-90";
        } else if (section.level >= 3) {
           titleSizeClass = "text-lg lg:text-xl";
           badgeScale = "scale-[0.85]";
        }

        return (
          <article key={idx} className={`flex flex-col gap-3 w-full group rounded-2xl border border-l-4 ${colorFor(section.title)} p-5 transition-all duration-300 shadow-sm hover:shadow-md ${
            isDarkMode 
              ? "bg-zinc-950/40 border-y-zinc-800/60 border-r-zinc-800/60" 
              : "bg-white border-y-slate-200 border-r-slate-200"
          }`}>
            {/* Document Heading with Color Accent & Integrated Interactive Tools */}
            <div className="flex items-center justify-between pl-1 py-1 transition-colors duration-200">
              <div className="flex items-center gap-3 flex-wrap text-left">
                <span className={`size-2 rounded-full ${isCurrentlyLocked ? "bg-amber-500 animate-pulse" : dotColorFor(section.title)}`} />
                
                <h2 className={`font-heading font-bold ${titleSizeClass} tracking-tight transition-colors ${
                  isCurrentlyLocked 
                    ? (isDarkMode ? "text-zinc-500" : "text-slate-400") 
                    : (isDarkMode ? "text-white" : "text-slate-900")
                }`}>
                  {section.title}
                </h2>

                {/* Inline Bloom Target Score Popover Badge */}
                <div className={`inline-flex items-center ${badgeScale} origin-left`}>
                  <Custompopover />
                </div>

                {isCurrentlyLocked && (
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full select-none ${
                    isDarkMode 
                      ? "bg-amber-950/40 text-amber-400 border border-amber-800/40" 
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}>
                    <LockIcon className="size-2.5" />
                    <span>{masterLocked ? "Master Locked" : "Locked"}</span>
                  </span>
                )}
              </div>

              {/* Section Control Tools */}
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onToggleBlockLock(section.title)}
                  disabled={masterLocked}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    masterLocked
                      ? (isDarkMode ? "bg-zinc-950/20 text-zinc-600 border-zinc-900/50 cursor-not-allowed" : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed")
                      : isBlockLocked
                      ? (isDarkMode ? "bg-amber-950/30 text-amber-400 border-amber-850/55 hover:bg-amber-900/30" : "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100/70")
                      : (isDarkMode ? "bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700")
                  }`}
                  title={
                    masterLocked
                      ? "Locked by Master Control"
                      : isBlockLocked
                      ? "Block is Locked. Click to Unlock."
                      : "Block is Unlocked. Click to Lock."
                  }
                >
                  <AnimateIcon animateOnHover>
                    {isCurrentlyLocked ? (
                      <LockIcon className="size-3.5" />
                    ) : (
                      <LockOpenIcon className="size-3.5" />
                    )}
                  </AnimateIcon>
                </button>
              </div>
            </div>

            {/* Section Content */}
            <div className={`pl-4 pr-1 transition-opacity duration-200 ${isCurrentlyLocked ? "opacity-75" : "opacity-100"}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ node, ...props }) => (
                <p className={`mb-3.5 last:mb-0 leading-relaxed text-[15px] ${isDarkMode ? "text-zinc-300" : "text-slate-700"}`} {...props} />
              ),
              h1: ({ node, children, ...props }) => (
                <div className="flex items-center gap-3 mt-5 mb-2.5">
                  <h1 className={`text-xl font-bold tracking-tight m-0 ${isDarkMode ? "text-white" : "text-slate-900"}`} {...props}>{children}</h1>
                  <div className="inline-flex items-center scale-90 origin-left"><Custompopover /></div>
                </div>
              ),
              h2: ({ node, children, ...props }) => (
                <div className="flex items-center gap-2.5 mt-4 mb-2">
                  <h2 className={`text-lg font-semibold tracking-tight m-0 ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`} {...props}>{children}</h2>
                  <div className="inline-flex items-center scale-[0.85] origin-left"><Custompopover /></div>
                </div>
              ),
              h3: ({ node, children, ...props }) => (
                <div className="flex items-center gap-2 mt-3 mb-2">
                  <h3 className={`text-base font-semibold m-0 ${isDarkMode ? "text-zinc-200" : "text-slate-800"}`} {...props}>{children}</h3>
                  <div className="inline-flex items-center scale-75 origin-left"><Custompopover /></div>
                </div>
              ),
              ul: ({ node, ...props }) => (
                <ul className={`list-disc pl-5 mb-4 space-y-1.5 text-[15px] ${isDarkMode ? "text-zinc-300" : "text-slate-700"}`} {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className={`list-decimal pl-5 mb-4 space-y-1.5 text-[15px] ${isDarkMode ? "text-zinc-300" : "text-slate-700"}`} {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="pl-1 leading-relaxed" {...props} />
              ),
              code: ({ node, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || "");
                return !match ? (
                  <code className={`px-1.5 py-0.5 rounded text-xs font-mono font-semibold border ${
                    isDarkMode 
                      ? "bg-zinc-800/80 text-orange-400 border-zinc-700/50" 
                      : "bg-orange-50 text-[#ea580c] border-orange-200/60"
                  }`} {...props}>
                    {children}
                  </code>
                ) : (
                  <pre className={`p-4 rounded-xl overflow-x-auto my-3 font-mono text-sm border leading-relaxed shadow-xs ${
                    isDarkMode 
                      ? "bg-zinc-900/90 text-zinc-100 border-zinc-800 backdrop-blur-md" 
                      : "bg-slate-900 text-slate-100 border-slate-800"
                  }`}>
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                );
              },
              pre: ({ node, ...props }) => <>{props.children}</>,
              blockquote: ({ node, ...props }) => (
                <blockquote className={`border-l-3 pl-4 italic my-3 leading-relaxed ${
                  isDarkMode ? "border-orange-500/50 text-zinc-400" : "border-orange-400 text-slate-600"
                }`} {...props} />
              ),
              hr: ({ node, ...props }) => (
                <hr className={`my-5 border-t ${isDarkMode ? "border-zinc-800/60" : "border-slate-200"}`} {...props} />
              ),
              table: ({ node, ...props }) => (
                <div className={`overflow-x-auto my-4 border rounded-xl ${
                  isDarkMode ? "border-zinc-800 bg-zinc-950/20" : "border-slate-200 bg-white"
                }`}>
                  <table className={`min-w-full border-collapse divide-y ${isDarkMode ? "divide-zinc-800" : "divide-slate-200"}`} {...props} />
                </div>
              ),
              thead: ({ node, ...props }) => (
                <thead className={isDarkMode ? "bg-zinc-900/60" : "bg-slate-50"} {...props} />
              ),
              tbody: ({ node, ...props }) => (
                <tbody className={`divide-y ${isDarkMode ? "divide-zinc-800" : "divide-slate-200"}`} {...props} />
              ),
              tr: ({ node, ...props }) => (
                <tr className={`transition-colors ${isDarkMode ? "hover:bg-zinc-800/20" : "hover:bg-slate-50"}`} {...props} />
              ),
              th: ({ node, ...props }) => (
                <th className={`px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? "text-zinc-400" : "text-slate-500"
                }`} {...props} />
              ),
              td: ({ node, ...props }) => (
                <td className={`px-4 py-2.5 text-sm ${isDarkMode ? "text-zinc-300" : "text-slate-700"}`} {...props} />
              ),
            }}
          >
            {section.content}
          </ReactMarkdown>
        </div>
      </article>
      );
    })}
    </div>
  );
}

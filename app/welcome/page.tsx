"use client";

import * as React from "react";
import WelcomeLayout from "@/components/layout/welcome-layout";
import { Button } from "@/components/ui/button";
import { Lock } from "@/components/animate-ui/icons/lock";
import { LockOpen } from "@/components/animate-ui/icons/lock-open";
import { Ellipsis } from "@/components/animate-ui/icons/ellipsis";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { User } from "@supabase/supabase-js";
import { 
  Clock, 
  ChevronDown, 
  ChevronRight, 
  History,
  Bot,
  Plus,
  Trash2,
  Check,
  Sparkles,
  ShieldAlert,
  Terminal,
  Puzzle,
  Share2,
  FileCode,
  LayoutGrid,
  BookOpen,
  Download,
  ExternalLink,
  Layers
} from "lucide-react";
import Custompopover from "@/components/custom/custom-popover";

// Initial raw Markdown string for caveman.md
const INITIAL_RAW_MARKDOWN = `---
name: caveman
description: Ultra-compressed communication mode. Speak like caveman while keeping full technical accuracy.
---

# Overview
Respond terse like smart caveman. All technical substance stay. Only fluff die.

# Persistence
ACTIVE EVERY RESPONSE. No revert after many turns. No filler drift. Off only: stop caveman / normal mode.

# Rules
- Drop: articles (a/an/the), filler (just/really), pleasantries, hedging.
- Short synonyms. No tool-call narration. Quote shortest decisive error line.
- Pattern: [thing] [action] [reason]. [next step].

# Intensity Levels
- lite: Keep normal grammar, cut pleasantries and filler intro.
- full: Smart caveman. Drop articles & fluff while preserving technical terms.
- ultra: Maximum compression. Shortest words only.

# Guardrails
- Irreversible database queries (e.g. DROP TABLE) suspend caveman mode automatically.
- Critical production deployments prompt confirmation in standard English.

# Integrations
- Cursor / VS Code (.cursor/rules/caveman.md)
- Antigravity CLI (.gemini/rules/caveman.md)
- Windsurf / Claude Code (.windsurf/rules/caveman.md)
`;

export default function WelcomePage() {
  const supabase = createSupabaseBrowserClient();
  const [user, setUser] = React.useState<User | null>();
  const [locked, setLocked] = React.useState(false);
  const [proposalPending, setProposalPending] = React.useState(true);
  const [editorMode, setEditorMode] = React.useState<"visual" | "raw">("visual");
  const [activeTab, setActiveTab] = React.useState<"editor" | "library">("editor");

  // Raw whole-file markdown content state
  const [rawMarkdown, setRawMarkdown] = React.useState(INITIAL_RAW_MARKDOWN);

  // Structured states for visual editing
  const [frontmatterName, setFrontmatterName] = React.useState("caveman");
  const [frontmatterDesc, setFrontmatterDesc] = React.useState(
    "Ultra-compressed communication mode. Speak like caveman while keeping full technical accuracy."
  );

  const [overviewPrompt, setOverviewPrompt] = React.useState(
    "Respond terse like smart caveman. All technical substance stay. Only fluff die."
  );

  const [persistenceText, setPersistenceText] = React.useState(
    "ACTIVE EVERY RESPONSE. No revert after many turns. No filler drift. Off only: stop caveman / normal mode."
  );

  const [rules, setRules] = React.useState([
    "Drop: articles (a/an/the), filler (just/really), pleasantries, hedging.",
    "Short synonyms. No tool-call narration. Quote shortest decisive error line.",
    "Pattern: [thing] [action] [reason]. [next step]."
  ]);

  const [intensityLevels, setIntensityLevels] = React.useState([
    "lite: Keep normal grammar, cut pleasantries and filler intro.",
    "full: Smart caveman. Drop articles & fluff while preserving technical terms.",
    "ultra: Maximum compression. Shortest words only."
  ]);

  const [guardrails, setGuardrails] = React.useState([
    "Irreversible database queries (e.g. DROP TABLE) suspend caveman mode automatically.",
    "Critical production deployments prompt confirmation in standard English."
  ]);

  const [integrations, setIntegrations] = React.useState([
    "Cursor / VS Code (.cursor/rules/caveman.md)",
    "Antigravity CLI (.gemini/rules/caveman.md)",
    "Windsurf / Claude Code (.windsurf/rules/caveman.md)"
  ]);

  // Sync visual states into rawMarkdown string whenever visual states change
  React.useEffect(() => {
    if (editorMode === "visual") {
      const generated = `---
name: ${frontmatterName}
description: ${frontmatterDesc}
---

# Overview
${overviewPrompt}

# Persistence
${persistenceText}

# Rules
${rules.map(r => `- ${r}`).join("\n")}

# Intensity Levels
${intensityLevels.map(i => `- ${i}`).join("\n")}

# Guardrails
${guardrails.map(g => `- ${g}`).join("\n")}

# Integrations
${integrations.map(ig => `- ${ig}`).join("\n")}
`;
      setRawMarkdown(generated);
    }
  }, [
    frontmatterName,
    frontmatterDesc,
    overviewPrompt,
    persistenceText,
    rules,
    intensityLevels,
    guardrails,
    integrations,
    editorMode
  ]);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
      }
    });
  }, [supabase]);

  const handleAcceptProposal = () => {
    const updatedGuardrails = [
      ...guardrails,
      "Terminal command outputs over 50 lines will auto-summarize before caveman response."
    ];
    setGuardrails(updatedGuardrails);
    setProposalPending(false);
  };

  const handleRejectProposal = () => {
    setProposalPending(false);
  };

  const username = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "pyasma";

  // Skills & Plugins Library items
  const librarySkills = [
    {
      id: "caveman",
      title: "caveman.md",
      desc: "Ultra-compressed communication mode. Speak like caveman while keeping full technical accuracy.",
      version: "v1.4.0",
      score: 95,
      installed: true,
      category: "Agent Behavior",
      author: "JuliusBrussee"
    },
    {
      id: "nextjs-architect",
      title: "nextjs-architect.md",
      desc: "Strict Next.js App Router rules, React Server Components patterns, and Turbopack conventions.",
      version: "v2.1.0",
      score: 98,
      installed: false,
      category: "Framework Rules",
      author: "Next.js Core"
    },
    {
      id: "python-clean",
      title: "python-clean.md",
      desc: "PEP8, type annotations, async/await guidelines, and pytest conventions for Python agents.",
      version: "v1.2.0",
      score: 92,
      installed: false,
      category: "Coding Standards",
      author: "Python Guild"
    },
    {
      id: "prisma-guardrails",
      title: "prisma-guardrails.md",
      desc: "Safe database migration workflows, transaction rules, and query performance optimizations.",
      version: "v1.0.4",
      score: 94,
      installed: false,
      category: "Security & Safety",
      author: "Prisma Community"
    }
  ];

  return (
    <WelcomeLayout>
      <div className="relative z-10 flex flex-col p-6 lg:p-8 gap-6 w-full min-h-screen text-left font-sans text-slate-900 bg-white">
        
        {/* Top Header & Navigation Bar */}
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 w-full">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Title + Score Popover */}
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 font-sans flex items-center gap-2.5">
                <Terminal className="size-6 text-slate-900" /> {username} / caveman.md
              </h1>
              
              {/* Bloom Target Score Badge */}
              <div className="flex items-center gap-1.5 cursor-pointer bg-white border border-slate-200 px-2.5 py-1 rounded-xl shadow-2xs hover:border-slate-300 transition-all">
                <Custompopover />
                <span className="text-xs font-semibold text-slate-700">Score</span>
              </div>
            </div>

            {/* Header Action Tools */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActiveTab(activeTab === "editor" ? "library" : "editor")}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <BookOpen className="size-3.5" />
                <span>{activeTab === "editor" ? "Skills Library" : "Back to Editor"}</span>
              </button>

              <button 
                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-900 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Share2 className="size-3.5" />
                <span>Sync Skill</span>
              </button>

              <button 
                onClick={() => setLocked(!locked)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                {locked ? <Lock className="size-3.5 text-slate-900" /> : <LockOpen className="size-3.5 text-slate-900" />}
                <span>{locked ? "Locked" : "Unlocked"}</span>
              </button>

              <button className="flex items-center justify-center size-8 text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all cursor-pointer shadow-2xs">
                <Ellipsis className="size-4" />
              </button>
            </div>

          </div>

          {/* Subtitle & Editor Mode Switcher */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="size-3.5" />
              <span>Skill rule auto-saved just now</span>
            </div>

            {/* Mode Switcher: Visual Block vs Whole Raw MD */}
            {activeTab === "editor" && (
              <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-xl">
                <button
                  onClick={() => setEditorMode("visual")}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    editorMode === "visual"
                      ? "bg-white text-slate-900 font-semibold shadow-2xs"
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
                      ? "bg-white text-slate-900 font-semibold shadow-2xs"
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

        {/* VIEW TAB 1: SKILLS & PLUGINS LIBRARY HUB */}
        {activeTab === "library" ? (
          <div className="flex flex-col gap-6 py-2 w-full">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="size-5 text-slate-900" /> Skills & Plugins Directory
              </h2>
              <p className="text-xs text-slate-500">
                Explore pre-built AI Agent rule definitions and plugins for Cursor, Antigravity, Windsurf, and Claude Code.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {librarySkills.map((item) => (
                <div 
                  key={item.id}
                  className="border border-slate-200 bg-white p-5 rounded-2xl shadow-2xs flex flex-col gap-3 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                        {item.title}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {item.version}
                      </span>
                    </div>

                    {item.installed ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        <Check className="size-3" /> Active
                      </span>
                    ) : (
                      <button className="flex items-center gap-1 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1 rounded-xl transition-all cursor-pointer">
                        <Download className="size-3" /> Install
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span>Category: <strong className="text-slate-700 font-medium">{item.category}</strong></span>
                    <span>By: <strong className="text-slate-700 font-medium">{item.author}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* VIEW TAB 2: FULL-SCREEN MD EDITOR WITH RIGHT-SIDE EDITS PANEL */
          <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
            
            {/* LEFT COLUMN: FULL SCREEN MARKDOWN EDITOR */}
            <div className="flex-1 min-w-0 flex flex-col gap-6 w-full">
              
              {/* MODE A: FULL RAW MARKDOWN WHOLE-FILE EDITOR */}
              {editorMode === "raw" ? (
                <div className="flex flex-col gap-3 w-full">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono select-none">
                    <span>caveman.md (Full Raw Source)</span>
                    <span>UTF-8 • {rawMarkdown.length} bytes</span>
                  </div>
                  <textarea
                    value={rawMarkdown}
                    onChange={(e) => setRawMarkdown(e.target.value)}
                    disabled={locked}
                    rows={26}
                    className="w-full font-mono text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl p-5 outline-none focus:border-slate-400 transition-all leading-relaxed resize-y disabled:cursor-not-allowed shadow-inner min-h-[500px]"
                  />
                </div>
              ) : (
                /* MODE B: VISUAL SECTION-BY-SECTION BLOCK EDITOR */
                <div className="flex flex-col gap-8 w-full">
                  
                  {/* Section 1: Overview & Frontmatter */}
                  <div id="overview" className="flex flex-col gap-3 group">
                    <div className="flex items-center justify-between border-l-4 border-slate-700 pl-3">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-900 font-heading tracking-wide">Overview</h2>
                        <Custompopover />
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                        <Ellipsis className="size-4" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-3 pl-4 text-slate-800 text-sm leading-relaxed">
                      {/* YAML Frontmatter Callout Box */}
                      <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl font-mono text-xs text-slate-700 space-y-1.5">
                        <div className="text-slate-400">---</div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-900 font-semibold">name:</span>
                          <input
                            type="text"
                            value={frontmatterName}
                            onChange={(e) => setFrontmatterName(e.target.value)}
                            disabled={locked}
                            className="bg-white border border-slate-200 px-2 py-0.5 rounded outline-none text-slate-800 font-mono text-xs"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-900 font-semibold">description:</span>
                          <input
                            type="text"
                            value={frontmatterDesc}
                            onChange={(e) => setFrontmatterDesc(e.target.value)}
                            disabled={locked}
                            className="w-full bg-white border border-slate-200 px-2 py-0.5 rounded outline-none text-slate-800 font-mono text-xs"
                          />
                        </div>
                        <div className="text-slate-400">---</div>
                      </div>

                      {/* Main Core Prompt */}
                      <textarea
                        value={overviewPrompt}
                        onChange={(e) => setOverviewPrompt(e.target.value)}
                        disabled={locked}
                        rows={2}
                        className="w-full bg-transparent hover:bg-slate-50 focus:bg-white p-2.5 rounded-xl border border-transparent focus:border-slate-200 outline-none transition-all resize-none disabled:cursor-not-allowed font-medium text-slate-900 text-sm leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Section 2: Persistence */}
                  <div id="persistence" className="flex flex-col gap-3 group">
                    <div className="flex items-center justify-between border-l-4 border-slate-500 pl-3">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-900 font-heading tracking-wide">Persistence</h2>
                        <Custompopover />
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                        <Ellipsis className="size-4" />
                      </button>
                    </div>

                    <div className="pl-4 text-slate-800 text-sm">
                      <textarea
                        value={persistenceText}
                        onChange={(e) => setPersistenceText(e.target.value)}
                        disabled={locked}
                        rows={2}
                        className="w-full bg-transparent hover:bg-slate-50 focus:bg-white p-2.5 rounded-xl border border-transparent focus:border-slate-200 outline-none transition-all resize-none disabled:cursor-not-allowed text-slate-800 text-sm leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Section 3: Rules */}
                  <div id="rules" className="flex flex-col gap-3 group">
                    <div className="flex items-center justify-between border-l-4 border-blue-600 pl-3">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-900 font-heading tracking-wide">Rules</h2>
                        <Custompopover />
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                        <Ellipsis className="size-4" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 pl-4 text-slate-800 text-sm">
                      {rules.map((rule, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="size-1.5 rounded-full bg-blue-600 shrink-0" />
                          <input
                            type="text"
                            value={rule}
                            onChange={(e) => {
                              const updated = [...rules];
                              updated[idx] = e.target.value;
                              setRules(updated);
                            }}
                            disabled={locked}
                            className="w-full bg-transparent hover:bg-slate-50 focus:bg-white p-1.5 rounded-xl border border-transparent focus:border-slate-200 outline-none transition-all disabled:cursor-not-allowed text-sm text-slate-800 font-medium"
                          />
                          {!locked && (
                            <button 
                              onClick={() => setRules(rules.filter((_, i) => i !== idx))}
                              className="opacity-0 hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 transition-all cursor-pointer"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                      {!locked && (
                        <button 
                          onClick={() => setRules([...rules, "New skill rule item"])}
                          className="flex items-center gap-1.5 text-xs text-slate-900 font-medium mt-1 pl-4 hover:underline cursor-pointer"
                        >
                          <Plus className="size-3.5" /> Add Rule
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Section 4: Intensity Levels */}
                  <div id="intensity" className="flex flex-col gap-3 group">
                    <div className="flex items-center justify-between border-l-4 border-amber-500 pl-3">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-900 font-heading tracking-wide">Intensity Levels</h2>
                        <Custompopover />
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                        <Ellipsis className="size-4" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 pl-4 text-slate-800 text-sm">
                      {intensityLevels.map((lvl, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="size-1.5 rounded-full bg-amber-500 shrink-0" />
                          <input
                            type="text"
                            value={lvl}
                            onChange={(e) => {
                              const updated = [...intensityLevels];
                              updated[idx] = e.target.value;
                              setIntensityLevels(updated);
                            }}
                            disabled={locked}
                            className="w-full bg-transparent hover:bg-slate-50 focus:bg-white p-1.5 rounded-xl border border-transparent focus:border-slate-200 outline-none transition-all disabled:cursor-not-allowed font-mono text-xs text-slate-800"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 5: Guardrails */}
                  <div id="guardrails" className="flex flex-col gap-3 group">
                    <div className="flex items-center justify-between border-l-4 border-rose-500 pl-3">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-900 font-heading tracking-wide flex items-center gap-2">
                          <ShieldAlert className="size-4 text-rose-600" /> Guardrails
                        </h2>
                        <Custompopover />
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                        <Ellipsis className="size-4" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 pl-4 text-slate-800 text-sm">
                      {guardrails.map((g, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="size-1.5 rounded-full bg-rose-500 shrink-0" />
                          <input
                            type="text"
                            value={g}
                            onChange={(e) => {
                              const updated = [...guardrails];
                              updated[idx] = e.target.value;
                              setGuardrails(updated);
                            }}
                            disabled={locked}
                            className="w-full bg-transparent hover:bg-slate-50 focus:bg-white p-1.5 rounded-xl border border-transparent focus:border-slate-200 outline-none transition-all disabled:cursor-not-allowed text-slate-800 text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 6: Integrations */}
                  <div id="integrations" className="flex flex-col gap-3 group">
                    <div className="flex items-center justify-between border-l-4 border-emerald-600 pl-3">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-900 font-heading tracking-wide flex items-center gap-2">
                          <Puzzle className="size-4 text-emerald-600" /> Integrations & Target Tools
                        </h2>
                        <Custompopover />
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                        <Ellipsis className="size-4" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 pl-4 text-slate-800 text-sm">
                      {integrations.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="size-1.5 rounded-full bg-emerald-600 shrink-0" />
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const updated = [...integrations];
                              updated[idx] = e.target.value;
                              setIntegrations(updated);
                            }}
                            disabled={locked}
                            className="w-full bg-transparent hover:bg-slate-50 focus:bg-white p-1.5 rounded-xl border border-transparent focus:border-slate-200 outline-none transition-all disabled:cursor-not-allowed font-mono text-xs text-slate-800"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* RIGHT COLUMN: EDITS & AI PROPOSALS PANEL */}
            <div className="lg:w-80 shrink-0 flex flex-col gap-4 w-full sticky top-6">
              
              {/* Proposal Card */}
              {proposalPending ? (
                <div className="border border-slate-200 bg-slate-50 p-4 rounded-2xl shadow-2xs flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                      <Bot className="size-4 text-slate-900" /> AI Agent Edit
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                      v1.4.0
                    </span>
                  </div>

                  {/* Diff Stats */}
                  <div className="flex items-center gap-2 py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs">
                    <span className="text-emerald-600 font-bold">+9</span> 
                    <span className="text-rose-600 font-bold">-0</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-700 font-medium">1 proposal</span>
                    <ChevronRight className="size-3.5 text-slate-400 ml-auto" />
                  </div>

                  {/* Highlighted edit snippet */}
                  <div className="bg-white border border-slate-200 p-3 rounded-xl flex flex-col gap-1 text-xs text-slate-700">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Section: Guardrails</span>
                    <div className="bg-emerald-50 border-l-2 border-emerald-600 text-emerald-950 p-2 rounded-r-md font-medium mt-1">
                      + Terminal command outputs over 50 lines will auto-summarize before caveman response.
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 italic">
                    Optimized caveman mode to prevent token overflow on long build output logs.
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 pt-1">
                    <Button 
                      onClick={handleAcceptProposal}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold h-9.5 w-full rounded-xl shadow-2xs transition-all cursor-pointer"
                    >
                      Accept AI Edits
                    </Button>
                    <Button 
                      onClick={handleRejectProposal}
                      variant="ghost" 
                      className="hover:bg-rose-50 hover:text-rose-600 bg-white border border-slate-200 hover:border-rose-200 text-slate-700 text-xs font-semibold h-9.5 w-full rounded-xl transition-all"
                    >
                      Revert
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border border-slate-200 bg-slate-50 p-4 rounded-2xl shadow-2xs flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                    <Check className="size-4" /> All AI Edits Accepted
                  </div>
                  <p className="text-xs text-slate-500">
                    Your <code className="font-mono text-slate-800 font-semibold">caveman.md</code> file is synchronized across all AI agent rules.
                  </p>
                </div>
              )}

              {/* IDE Multi-Agent Sync Status Box */}
              <div className="border border-slate-200 bg-white p-4 rounded-2xl shadow-2xs flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="size-4 text-slate-700" /> Active IDE Rule Paths
                </span>

                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-mono text-slate-700 text-[11px]">.cursor/rules</span>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Synced</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-mono text-slate-700 text-[11px]">.gemini/rules</span>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Synced</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-mono text-slate-700 text-[11px]">.windsurf/rules</span>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Synced</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </WelcomeLayout>
  );
}


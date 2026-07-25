"use client";

import React from "react";
import BloomPercentage from "../percentage-bar";
import { Sparkles, TrendingUp } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

const DEMO_PERCENTAGE = 85;

export default function BloomScorePopover() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [percentage, setPercentage] = React.useState<number | null>(DEMO_PERCENTAGE);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClick = React.useCallback(() => {
    setOpen(true);
    setLoading(true);
    setPercentage(null);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setPercentage(DEMO_PERCENTAGE);
      setLoading(false);
      timeoutRef.current = null;
    }, 1000);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <BloomPercentage
            percentage={percentage}
            loading={loading}
            onClick={handleClick}
          />
        }
      />
      <PopoverContent className="w-80 p-4 rounded-2xl glass-panel border border-orange-500/20 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 shadow-2xl backdrop-blur-xl">
        <PopoverHeader>
          <PopoverTitle>
            <div className="flex items-center justify-between font-heading text-sm font-bold text-slate-900 dark:text-zinc-100">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-orange-500" />
                <span>Bloom Target Score</span>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                {loading || percentage === null ? "..." : `${percentage}/100`}
              </span>
            </div>
          </PopoverTitle>
          <PopoverDescription className="mt-3 flex flex-col gap-2 text-xs">
            {loading || percentage === null ? (
              <>
                <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 p-2.5 text-slate-600 dark:text-zinc-400 animate-pulse">
                  Calculating bloom score & analysis...
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 p-2.5 text-slate-500 dark:text-zinc-500 animate-pulse">
                  Generating skill optimization suggestions.
                </div>
              </>
            ) : (
              <>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/30 p-2.5 text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-2">
                  <TrendingUp className="size-3.5 shrink-0 text-emerald-500" />
                  <span>+ Add terminal auto-summarization rule</span>
                </div>
                <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 dark:bg-zinc-900/60 p-2.5 text-slate-700 dark:text-zinc-300 font-medium">
                  • Enable full caveman compression mode
                </div>
              </>
            )}
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}

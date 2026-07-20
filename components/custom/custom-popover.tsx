import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import BloomPercentage from "./percentage-bar"
import React from "react";

export default function Custompopover() {
    const [open, setOpen] = React.useState(false);
    const percentage = 50
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger render={
                <BloomPercentage percentage={percentage} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} />
            }>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverHeader>
                    <PopoverTitle>
                        <div className="flex justify-between">
                            <span>Score</span>
                            <span>{percentage}/100</span>
                        </div>
                    </PopoverTitle>
                    <PopoverDescription render={<div className="flex flex-col gap-1 text-[#64748b] text-xs mt-1" />}>
                        <div className="border border-slate-200 bg-slate-50 p-1.5 rounded-lg text-emerald-700">
                            + Add terminal output auto-summarization rule
                        </div>
                        <div className="border border-slate-200 bg-slate-50 p-1.5 rounded-lg text-slate-600">
                            • Enable full caveman compression level
                        </div>
                    </PopoverDescription>
                </PopoverHeader>

            </PopoverContent>
        </Popover>
    )
}

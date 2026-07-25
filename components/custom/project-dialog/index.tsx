import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FilePlusCorner } from "lucide-react"

interface ProjectDialogProps {
    isCollapsed: boolean;
}

export function ProjectDialog({isCollapsed}: ProjectDialogProps) {
    return (<>
        <Dialog>
            <DialogTrigger>
                <button>
                    <FilePlusCorner className="size-5" />
                    {!isCollapsed && <span className="text-xs">Add Project</span>}
                </button>
            </DialogTrigger>

        </Dialog>
    </>)
}
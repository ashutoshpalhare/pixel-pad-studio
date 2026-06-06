import { X, Plus } from "lucide-react";
import type { EditorTab } from "@/lib/notepad/types";
import { cn } from "@/lib/utils";

interface Props {
  tabs: EditorTab[];
  activeId: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onNew: () => void;
  onRename: (id: string) => void;
}

export function TabBar({ tabs, activeId, onSelect, onClose, onNew, onRename }: Props) {
  return (
    <div className="flex items-end bg-toolbar border-b border-border overflow-x-auto select-none">
      {tabs.map((t) => {
        const dirty = t.content !== t.savedContent;
        const active = t.id === activeId;
        return (
          <div
            key={t.id}
            onClick={() => onSelect(t.id)}
            onDoubleClick={() => onRename(t.id)}
            className={cn(
              "group flex items-center gap-2 pl-3 pr-1 py-1.5 text-xs cursor-pointer border-r border-border min-w-[120px] max-w-[220px] transition-colors",
              active
                ? "bg-tab-active text-foreground"
                : "bg-tab-inactive text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="truncate flex-1">
              {dirty && <span className="text-primary mr-1">●</span>}
              {t.name}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose(t.id);
              }}
              className="rounded p-0.5 opacity-60 hover:opacity-100 hover:bg-accent"
              aria-label="Close tab"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        );
      })}
      <button
        onClick={onNew}
        className="p-1.5 ml-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded-sm"
        aria-label="New tab"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

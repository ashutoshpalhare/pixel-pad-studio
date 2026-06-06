import { FileText, Files, Clock, Info, Search } from "lucide-react";
import type { NotepadStore } from "@/hooks/useNotepadStore";
import { cn } from "@/lib/utils";

export function Sidebar({ store }: { store: NotepadStore }) {
  const { settings, setSettings, tabs, activeId, setActiveId, recent, openFromRecent, activeTab } = store;
  const tab = settings.sidebarTab;

  const Section = ({ id, icon: Icon, label }: { id: typeof tab; icon: React.ElementType; label: string }) => (
    <button
      onClick={() => setSettings({ ...settings, sidebarTab: id })}
      className={cn(
        "flex flex-col items-center justify-center w-12 h-12 text-muted-foreground hover:text-foreground transition-colors border-l-2",
        settings.sidebarTab === id ? "text-foreground border-primary bg-accent/40" : "border-transparent",
      )}
      title={label}
    >
      <Icon className="h-5 w-5" />
    </button>
  );

  return (
    <div className="flex h-full bg-sidebar text-sidebar-foreground border-r border-border">
      <div className="flex flex-col py-2">
        <Section id="explorer" icon={Files} label="Open Files" />
        <Section id="recent" icon={Clock} label="Recent" />
        <Section id="info" icon={Info} label="File Info" />
      </div>
      <div className="flex-1 w-56 p-3 overflow-y-auto text-sm">
        {tab === "explorer" && (
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
              <Search className="h-3 w-3" /> Open Files
            </div>
            <div className="space-y-0.5">
              {tabs.map((t) => {
                const dirty = t.content !== t.savedContent;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveId(t.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1 rounded text-left hover:bg-accent transition-colors",
                      t.id === activeId && "bg-accent",
                    )}
                  >
                    <FileText className="h-3.5 w-3.5 shrink-0 opacity-70" />
                    <span className="truncate flex-1">{t.name}</span>
                    {dirty && <span className="text-primary text-xs">●</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {tab === "recent" && (
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Recent Files</div>
            {recent.length === 0 && <div className="text-xs text-muted-foreground">No recent files yet.</div>}
            <div className="space-y-0.5">
              {recent.map((r) => (
                <button
                  key={r.name + r.openedAt}
                  onClick={() => openFromRecent(r)}
                  className="w-full flex items-center gap-2 px-2 py-1 rounded hover:bg-accent text-left"
                >
                  <FileText className="h-3.5 w-3.5 opacity-70" />
                  <span className="truncate">{r.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {tab === "info" && activeTab && (
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">File Info</div>
            <dl className="grid grid-cols-3 gap-y-1 text-xs">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="col-span-2 truncate">{activeTab.name}</dd>
              <dt className="text-muted-foreground">Lang</dt>
              <dd className="col-span-2">{activeTab.language}</dd>
              <dt className="text-muted-foreground">Chars</dt>
              <dd className="col-span-2">{activeTab.content.length}</dd>
              <dt className="text-muted-foreground">Lines</dt>
              <dd className="col-span-2">{activeTab.content.split("\n").length}</dd>
              <dt className="text-muted-foreground">Status</dt>
              <dd className="col-span-2">{activeTab.content === activeTab.savedContent ? "Saved" : "Modified"}</dd>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}

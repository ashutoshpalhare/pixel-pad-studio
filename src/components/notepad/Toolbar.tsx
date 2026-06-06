import {
  FilePlus, FolderOpen, Save, Download, Search, Replace, Undo2, Redo2,
  ZoomIn, ZoomOut, Maximize2, Minimize2, Sun, Moon, Sparkles, Map, PanelLeft,
  Eye, SplitSquareHorizontal, Command, Settings as SettingsIcon,
} from "lucide-react";
import type { NotepadStore } from "@/hooks/useNotepadStore";
import { LANGUAGES } from "@/lib/notepad/languages";
import type { LanguageId } from "@/lib/notepad/types";

interface Props {
  store: NotepadStore;
  onOpenFile: () => void;
  onFind: () => void;
  onReplace: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoom: (delta: number) => void;
  onCommandPalette: () => void;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
  showPreview: boolean;
  onTogglePreview: () => void;
  splitView: boolean;
  onToggleSplit: () => void;
  onOpenSettings: () => void;
}

export function Toolbar(p: Props) {
  const { store } = p;
  const { settings, setSettings, activeTab, newTab, saveTab, downloadTab, setLanguage } = store;

  const IconBtn = ({
    onClick, title, children,
  }: { onClick: () => void; title: string; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      title={title}
      className="p-1.5 rounded-md text-foreground/80 hover:bg-accent hover:text-foreground transition-colors"
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-5 bg-border mx-1" />;

  const cycleTheme = () => {
    const order: NotepadStore["settings"]["theme"][] = ["light", "dark", "vscode"];
    const next = order[(order.indexOf(settings.theme) + 1) % order.length];
    setSettings({ ...settings, theme: next });
  };

  return (
    <div className="h-10 px-2 flex items-center gap-0.5 bg-toolbar border-b border-border">
      <IconBtn onClick={() => newTab()} title="New (Ctrl+N)"><FilePlus className="h-4 w-4" /></IconBtn>
      <IconBtn onClick={p.onOpenFile} title="Open (Ctrl+O)"><FolderOpen className="h-4 w-4" /></IconBtn>
      <IconBtn onClick={() => activeTab && saveTab(activeTab.id)} title="Save (Ctrl+S)"><Save className="h-4 w-4" /></IconBtn>
      <IconBtn onClick={() => activeTab && downloadTab(activeTab.id)} title="Download / Save As (Ctrl+Shift+S)"><Download className="h-4 w-4" /></IconBtn>
      <Divider />
      <IconBtn onClick={p.onUndo} title="Undo (Ctrl+Z)"><Undo2 className="h-4 w-4" /></IconBtn>
      <IconBtn onClick={p.onRedo} title="Redo (Ctrl+Y)"><Redo2 className="h-4 w-4" /></IconBtn>
      <Divider />
      <IconBtn onClick={p.onFind} title="Find (Ctrl+F)"><Search className="h-4 w-4" /></IconBtn>
      <IconBtn onClick={p.onReplace} title="Replace (Ctrl+H)"><Replace className="h-4 w-4" /></IconBtn>
      <Divider />
      <IconBtn onClick={() => p.onZoom(1)} title="Zoom In"><ZoomIn className="h-4 w-4" /></IconBtn>
      <IconBtn onClick={() => p.onZoom(-1)} title="Zoom Out"><ZoomOut className="h-4 w-4" /></IconBtn>
      <Divider />
      <IconBtn
        onClick={() => setSettings({ ...settings, showSidebar: !settings.showSidebar })}
        title="Toggle Sidebar"
      ><PanelLeft className="h-4 w-4" /></IconBtn>
      <IconBtn
        onClick={() => setSettings({ ...settings, minimap: !settings.minimap })}
        title="Toggle Minimap"
      ><Map className="h-4 w-4" /></IconBtn>
      <IconBtn onClick={p.onToggleSplit} title="Split Editor"><SplitSquareHorizontal className="h-4 w-4" /></IconBtn>
      <IconBtn onClick={p.onTogglePreview} title="Preview (HTML/Markdown)"><Eye className="h-4 w-4" /></IconBtn>
      <IconBtn onClick={p.onToggleFullscreen} title="Fullscreen">
        {p.fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </IconBtn>
      <Divider />
      <IconBtn onClick={cycleTheme} title={`Theme: ${settings.theme}`}>
        {settings.theme === "light" ? <Sun className="h-4 w-4" /> :
         settings.theme === "dark" ? <Moon className="h-4 w-4" /> :
         <Sparkles className="h-4 w-4" />}
      </IconBtn>
      <IconBtn onClick={p.onCommandPalette} title="Command Palette (Ctrl+Shift+P)"><Command className="h-4 w-4" /></IconBtn>
      <IconBtn onClick={p.onOpenSettings} title="Settings"><SettingsIcon className="h-4 w-4" /></IconBtn>

      <div className="flex-1" />

      {activeTab && (
        <select
          value={activeTab.language}
          onChange={(e) => setLanguage(activeTab.id, e.target.value as LanguageId)}
          className="text-xs bg-background border border-border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-ring"
        >
          {LANGUAGES.map((l) => (
            <option key={l.id} value={l.id}>{l.label}</option>
          ))}
        </select>
      )}
    </div>
  );
}

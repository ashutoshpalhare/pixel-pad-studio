import { useEffect, useRef, useState } from "react";
import type { editor } from "monaco-editor";
import type { Monaco } from "@monaco-editor/react";
import { useNotepadStore } from "@/hooks/useNotepadStore";
import { Toolbar } from "@/components/notepad/Toolbar";
import { TabBar } from "@/components/notepad/TabBar";
import { Sidebar } from "@/components/notepad/Sidebar";
import { MonacoPane } from "@/components/notepad/MonacoPane";
import { StatusBar } from "@/components/notepad/StatusBar";
import { CommandPalette } from "@/components/notepad/CommandPalette";
import { PromptDialog } from "@/components/notepad/PromptDialog";
import { PreviewPane } from "@/components/notepad/PreviewPane";
import { SettingsPanel } from "@/components/notepad/SettingsPanel";
import { FileCode2 } from "lucide-react";

type PromptKind = null | "rename" | "goto" | "saveAs";

export function NotepadApp() {
  const store = useNotepadStore();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [cursor, setCursor] = useState({ line: 1, column: 1, total: 1 });
  const [fullscreen, setFullscreen] = useState(false);
  const [palette, setPalette] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [splitView, setSplitView] = useState(false);
  const [prompt, setPrompt] = useState<{ kind: PromptKind; default?: string }>({ kind: null });

  const { activeTab, settings, setSettings } = store;

  // Theme class on root html
  useEffect(() => {
    const dark = settings.theme !== "light";
    document.documentElement.classList.toggle("dark", dark);
  }, [settings.theme]);

  // File open via input
  const triggerOpen = () => fileInputRef.current?.click();
  const onFilesPicked = async (files: FileList | null) => {
    if (!files) return;
    for (const f of Array.from(files)) await store.openFile(f);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Drag & drop
  useEffect(() => {
    const prevent = (e: DragEvent) => { e.preventDefault(); };
    const onDrop = async (e: DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer?.files;
      if (files?.length) for (const f of Array.from(files)) await store.openFile(f);
    };
    window.addEventListener("dragover", prevent);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragover", prevent);
      window.removeEventListener("drop", onDrop);
    };
  }, [store]);

  const runFind = () => editorRef.current?.getAction("actions.find")?.run();
  const runReplace = () => editorRef.current?.getAction("editor.action.startFindReplaceAction")?.run();
  const runUndo = () => editorRef.current?.trigger("kb", "undo", null);
  const runRedo = () => editorRef.current?.trigger("kb", "redo", null);
  const runGoTo = () => setPrompt({ kind: "goto" });
  const runZoom = (delta: number) => setSettings({ ...settings, fontSize: Math.max(10, Math.min(32, settings.fontSize + delta)) });
  const runSaveAs = () => activeTab && setPrompt({ kind: "saveAs", default: activeTab.name });
  const runRename = (id?: string) => {
    const t = id ? store.tabs.find(x => x.id === id) : activeTab;
    if (t) { store.setActiveId(t.id); setPrompt({ kind: "rename", default: t.name }); }
  };
  const runDuplicateLine = () => editorRef.current?.getAction("editor.action.copyLinesDownAction")?.run();
  const runDeleteLine = () => editorRef.current?.getAction("editor.action.deleteLines")?.run();
  const runMoveLineUp = () => editorRef.current?.getAction("editor.action.moveLinesUpAction")?.run();
  const runMoveLineDown = () => editorRef.current?.getAction("editor.action.moveLinesDownAction")?.run();
  const runComment = () => editorRef.current?.getAction("editor.action.commentLine")?.run();
  const runSelectAll = () => editorRef.current?.trigger("kb", "editor.action.selectAll", null);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen().catch(() => {});
      setFullscreen(true);
    } else {
      await document.exitFullscreen().catch(() => {});
      setFullscreen(false);
    }
  };

  // Global shortcuts (outside editor)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (!ctrl) return;
      const key = e.key.toLowerCase();
      if (e.shiftKey && key === "p") { e.preventDefault(); setPalette(true); return; }
      if (e.shiftKey && key === "s") { e.preventDefault(); runSaveAs(); return; }
      switch (key) {
        case "n": e.preventDefault(); store.newTab(); break;
        case "o": e.preventDefault(); triggerOpen(); break;
        case "s": e.preventDefault(); activeTab && store.saveTab(activeTab.id); break;
        case "g": e.preventDefault(); runGoTo(); break;
        default: break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeTab, store]);

  const handlePromptSubmit = (val: string) => {
    if (!activeTab) return;
    if (prompt.kind === "rename") store.renameTab(activeTab.id, val || activeTab.name);
    if (prompt.kind === "saveAs") store.downloadTab(activeTab.id, val || activeTab.name);
    if (prompt.kind === "goto") {
      const ln = parseInt(val, 10);
      if (!isNaN(ln) && editorRef.current) {
        editorRef.current.revealLineInCenter(ln);
        editorRef.current.setPosition({ lineNumber: ln, column: 1 });
        editorRef.current.focus();
      }
    }
  };

  const commands = [
    { id: "new", label: "New File", shortcut: "Ctrl+N", run: () => store.newTab() },
    { id: "open", label: "Open File…", shortcut: "Ctrl+O", run: triggerOpen },
    { id: "save", label: "Save", shortcut: "Ctrl+S", run: () => activeTab && store.saveTab(activeTab.id) },
    { id: "saveAs", label: "Save As / Download", shortcut: "Ctrl+Shift+S", run: runSaveAs },
    { id: "find", label: "Find", shortcut: "Ctrl+F", run: runFind },
    { id: "replace", label: "Replace", shortcut: "Ctrl+H", run: runReplace },
    { id: "goto", label: "Go to Line", shortcut: "Ctrl+G", run: runGoTo },
    { id: "rename", label: "Rename Tab", run: () => runRename() },
    { id: "dup", label: "Duplicate Line", run: runDuplicateLine },
    { id: "delLine", label: "Delete Line", run: runDeleteLine },
    { id: "moveUp", label: "Move Line Up", run: runMoveLineUp },
    { id: "moveDown", label: "Move Line Down", run: runMoveLineDown },
    { id: "comment", label: "Toggle Comment", run: runComment },
    { id: "selectAll", label: "Select All", shortcut: "Ctrl+A", run: runSelectAll },
    { id: "split", label: `${splitView ? "Disable" : "Enable"} Split Editor`, run: () => setSplitView((v) => !v) },
    { id: "preview", label: `${showPreview ? "Hide" : "Show"} Preview`, run: () => setShowPreview((v) => !v) },
    { id: "theme-light", label: "Theme: Light", run: () => setSettings({ ...settings, theme: "light" }) },
    { id: "theme-dark", label: "Theme: Dark", run: () => setSettings({ ...settings, theme: "dark" }) },
    { id: "theme-vscode", label: "Theme: VS Code", run: () => setSettings({ ...settings, theme: "vscode" }) },
    { id: "wrap", label: "Toggle Word Wrap", run: () => setSettings({ ...settings, wordWrap: !settings.wordWrap }) },
    { id: "mini", label: "Toggle Minimap", run: () => setSettings({ ...settings, minimap: !settings.minimap }) },
    { id: "status", label: "Toggle Status Bar", run: () => setSettings({ ...settings, showStatusBar: !settings.showStatusBar }) },
    { id: "sidebar", label: "Toggle Sidebar", run: () => setSettings({ ...settings, showSidebar: !settings.showSidebar }) },
    { id: "zoomIn", label: "Zoom In", run: () => runZoom(1) },
    { id: "zoomOut", label: "Zoom Out", run: () => runZoom(-1) },
    { id: "fullscreen", label: "Toggle Fullscreen", run: toggleFullscreen },
    { id: "settings", label: "Open Settings", run: () => setSettingsOpen(true) },
  ];

  if (!store.hydrated) {
    return <div className="h-screen w-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background text-foreground">
      {/* Title bar */}
      <div className="h-9 px-3 flex items-center gap-2 bg-titlebar text-titlebar-foreground select-none">
        <FileCode2 className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium tracking-wide">Notepad<span className="text-primary">++</span></span>
        <span className="text-xs opacity-70 ml-2 truncate">
          {activeTab ? `${activeTab.name}${activeTab.content !== activeTab.savedContent ? " •" : ""}` : ""}
        </span>
        <div className="flex-1" />
        <span className="text-[10px] opacity-60">Web Edition</span>
      </div>

      <Toolbar
        store={store}
        onOpenFile={triggerOpen}
        onFind={runFind}
        onReplace={runReplace}
        onUndo={runUndo}
        onRedo={runRedo}
        onZoom={runZoom}
        onCommandPalette={() => setPalette(true)}
        fullscreen={fullscreen}
        onToggleFullscreen={toggleFullscreen}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview((v) => !v)}
        splitView={splitView}
        onToggleSplit={() => setSplitView((v) => !v)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className="flex-1 flex min-h-0">
        {settings.showSidebar && (
          <div className="shrink-0">
            <Sidebar store={store} />
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <TabBar
            tabs={store.tabs}
            activeId={store.activeId}
            onSelect={store.setActiveId}
            onClose={store.closeTab}
            onNew={() => store.newTab()}
            onRename={(id) => runRename(id)}
          />

          <div className="flex-1 min-h-0 flex">
            {activeTab && (
              <div className="flex-1 min-w-0">
                <MonacoPane
                  tab={activeTab}
                  settings={settings}
                  onChange={(v) => store.setContent(activeTab.id, v)}
                  onCursor={(line, column, total) => setCursor({ line, column, total })}
                  onMount={(ed, m) => { editorRef.current = ed; monacoRef.current = m; }}
                />
              </div>
            )}
            {splitView && activeTab && (
              <div className="flex-1 min-w-0 border-l border-border">
                <MonacoPane
                  tab={activeTab}
                  settings={settings}
                  onChange={(v) => store.setContent(activeTab.id, v)}
                  onCursor={() => {}}
                />
              </div>
            )}
            {showPreview && activeTab && (
              <div className="w-[40%] min-w-[280px] border-l border-border">
                <PreviewPane tab={activeTab} />
              </div>
            )}
          </div>

          <StatusBar tab={activeTab} settings={settings} cursor={cursor} />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept=".txt,.html,.htm,.css,.js,.jsx,.ts,.tsx,.json,.md,.markdown,.py,.sql,.xml,.svg"
        onChange={(e) => onFilesPicked(e.target.files)}
      />

      <CommandPalette open={palette} onClose={() => setPalette(false)} actions={commands} />
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} store={store} />
      <PromptDialog
        open={prompt.kind !== null}
        title={
          prompt.kind === "rename" ? "Rename tab" :
          prompt.kind === "saveAs" ? "Save as (download)" :
          prompt.kind === "goto" ? "Go to line" : ""
        }
        placeholder={prompt.kind === "goto" ? "Line number" : "filename.ext"}
        defaultValue={prompt.default}
        onClose={() => setPrompt({ kind: null })}
        onSubmit={handlePromptSubmit}
      />
    </div>
  );
}

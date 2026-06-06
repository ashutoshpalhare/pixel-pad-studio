import { useCallback, useEffect, useRef, useState } from "react";
import type { EditorTab, LanguageId, NotepadSettings, RecentFile } from "@/lib/notepad/types";
import { detectLanguageFromFilename, extForLanguage } from "@/lib/notepad/languages";

const STORAGE_KEY = "notepad++:session:v1";
const SETTINGS_KEY = "notepad++:settings:v1";
const RECENT_KEY = "notepad++:recent:v1";

const DEFAULT_SETTINGS: NotepadSettings = {
  theme: "vscode",
  fontSize: 14,
  wordWrap: false,
  minimap: true,
  showStatusBar: true,
  showSidebar: true,
  sidebarTab: "explorer",
};

const uid = () => Math.random().toString(36).slice(2, 10);

const makeNewTab = (overrides: Partial<EditorTab> = {}): EditorTab => ({
  id: uid(),
  name: "untitled.txt",
  language: "plaintext",
  content: "",
  savedContent: "",
  ...overrides,
});

export function useNotepadStore() {
  const [hydrated, setHydrated] = useState(false);
  const [tabs, setTabs] = useState<EditorTab[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [settings, setSettings] = useState<NotepadSettings>(DEFAULT_SETTINGS);
  const [recent, setRecent] = useState<RecentFile[]>([]);

  // hydrate
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as { tabs: EditorTab[]; activeId: string };
        if (data.tabs?.length) {
          setTabs(data.tabs);
          setActiveId(data.activeId || data.tabs[0].id);
        }
      }
      const s = localStorage.getItem(SETTINGS_KEY);
      if (s) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(s) });
      const r = localStorage.getItem(RECENT_KEY);
      if (r) setRecent(JSON.parse(r));
    } catch {
      /* noop */
    }
    setHydrated(true);
  }, []);

  // ensure at least one tab
  useEffect(() => {
    if (hydrated && tabs.length === 0) {
      const t = makeNewTab();
      setTabs([t]);
      setActiveId(t.id);
    }
  }, [hydrated, tabs.length]);

  // autosave every 5s + on change (debounced via timer)
  const tabsRef = useRef(tabs);
  tabsRef.current = tabs;
  const activeRef = useRef(activeId);
  activeRef.current = activeId;

  useEffect(() => {
    if (!hydrated) return;
    const i = setInterval(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ tabs: tabsRef.current, activeId: activeRef.current }),
        );
      } catch {/*noop*/}
    }, 5000);
    return () => clearInterval(i);
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch {/*noop*/}
  }, [settings, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, 15))); } catch {/*noop*/}
  }, [recent, hydrated]);

  const activeTab = tabs.find((t) => t.id === activeId);

  const newTab = useCallback((init?: Partial<EditorTab>) => {
    const t = makeNewTab(init);
    setTabs((prev) => [...prev, t]);
    setActiveId(t.id);
    return t.id;
  }, []);

  const closeTab = useCallback((id: string) => {
    setTabs((prev) => {
      const idx = prev.findIndex((t) => t.id === id);
      if (idx === -1) return prev;
      const next = prev.filter((t) => t.id !== id);
      if (id === activeRef.current) {
        const newActive = next[idx] ?? next[idx - 1] ?? next[0];
        setActiveId(newActive?.id ?? "");
      }
      return next;
    });
  }, []);

  const updateTab = useCallback((id: string, patch: Partial<EditorTab>) => {
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const renameTab = useCallback(
    (id: string, name: string) => {
      const lang = detectLanguageFromFilename(name);
      updateTab(id, { name, language: lang });
    },
    [updateTab],
  );

  const setContent = useCallback(
    (id: string, content: string) => {
      updateTab(id, { content });
    },
    [updateTab],
  );

  const saveTab = useCallback((id: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, savedContent: t.content } : t)),
    );
  }, []);

  const downloadTab = useCallback((id: string, asName?: string) => {
    const tab = tabsRef.current.find((t) => t.id === id);
    if (!tab) return;
    const name = asName ?? tab.name;
    const blob = new Blob([tab.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
    saveTab(id);
  }, [saveTab]);

  const openFile = useCallback(
    async (file: File) => {
      const text = await file.text();
      const lang = detectLanguageFromFilename(file.name);
      const id = newTab({ name: file.name, language: lang, content: text, savedContent: text });
      setRecent((prev) => [
        { name: file.name, language: lang, content: text, openedAt: Date.now() },
        ...prev.filter((r) => r.name !== file.name),
      ].slice(0, 15));
      return id;
    },
    [newTab],
  );

  const openFromRecent = useCallback((r: RecentFile) => {
    newTab({ name: r.name, language: r.language, content: r.content, savedContent: r.content });
  }, [newTab]);

  const setLanguage = useCallback(
    (id: string, language: LanguageId) => {
      const tab = tabsRef.current.find((t) => t.id === id);
      if (!tab) return;
      // adjust extension on rename if generic
      let name = tab.name;
      const base = name.includes(".") ? name.slice(0, name.lastIndexOf(".")) : name;
      name = `${base}.${extForLanguage(language)}`;
      updateTab(id, { language, name });
    },
    [updateTab],
  );

  return {
    hydrated,
    tabs,
    activeId,
    setActiveId,
    activeTab,
    settings,
    setSettings,
    recent,
    newTab,
    closeTab,
    renameTab,
    setContent,
    saveTab,
    downloadTab,
    openFile,
    openFromRecent,
    setLanguage,
    updateTab,
  };
}

export type NotepadStore = ReturnType<typeof useNotepadStore>;

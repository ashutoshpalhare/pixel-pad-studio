import type { NotepadStore } from "@/hooks/useNotepadStore";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  store: NotepadStore;
}

export function SettingsPanel({ open, onClose, store }: Props) {
  if (!open) return null;
  const { settings, setSettings } = store;
  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm">{label}</span>
      <div>{children}</div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center" onClick={onClose}>
      <div className="glass w-[460px] max-w-[92vw] rounded-xl border border-border shadow-2xl p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Settings</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-accent"><X className="h-4 w-4" /></button>
        </div>
        <div>
          <Row label="Theme">
            <select
              value={settings.theme}
              onChange={(e) => setSettings({ ...settings, theme: e.target.value as typeof settings.theme })}
              className="text-sm bg-background border border-border rounded px-2 py-1"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="vscode">VS Code</option>
            </select>
          </Row>
          <Row label="Font Size">
            <input
              type="number" min={10} max={32}
              value={settings.fontSize}
              onChange={(e) => setSettings({ ...settings, fontSize: Number(e.target.value) || 14 })}
              className="w-20 text-sm bg-background border border-border rounded px-2 py-1"
            />
          </Row>
          <Row label="Word Wrap">
            <input type="checkbox" checked={settings.wordWrap}
              onChange={(e) => setSettings({ ...settings, wordWrap: e.target.checked })} />
          </Row>
          <Row label="Show Minimap">
            <input type="checkbox" checked={settings.minimap}
              onChange={(e) => setSettings({ ...settings, minimap: e.target.checked })} />
          </Row>
          <Row label="Show Status Bar">
            <input type="checkbox" checked={settings.showStatusBar}
              onChange={(e) => setSettings({ ...settings, showStatusBar: e.target.checked })} />
          </Row>
          <Row label="Show Sidebar">
            <input type="checkbox" checked={settings.showSidebar}
              onChange={(e) => setSettings({ ...settings, showSidebar: e.target.checked })} />
          </Row>
        </div>
      </div>
    </div>
  );
}

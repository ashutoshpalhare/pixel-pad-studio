import type { EditorTab, NotepadSettings } from "@/lib/notepad/types";

interface Props {
  tab?: EditorTab;
  settings: NotepadSettings;
  cursor: { line: number; column: number; total: number };
}

export function StatusBar({ tab, settings, cursor }: Props) {
  if (!settings.showStatusBar) return null;
  return (
    <div className="h-6 px-3 flex items-center justify-between text-[11px] bg-statusbar text-statusbar-foreground select-none">
      <div className="flex items-center gap-4">
        <span>Ln {cursor.line}, Col {cursor.column}</span>
        <span>{cursor.total} lines</span>
        <span>{tab?.content === tab?.savedContent ? "Saved" : "Modified"}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="capitalize">{tab?.language ?? "plaintext"}</span>
        <span>UTF-8</span>
        <span>LF</span>
        <span className="capitalize">{settings.theme}</span>
      </div>
    </div>
  );
}

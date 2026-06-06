import { useEffect, useRef, useState } from "react";
import Editor, { type Monaco, type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import type { EditorTab, NotepadSettings } from "@/lib/notepad/types";

interface Props {
  tab: EditorTab;
  settings: NotepadSettings;
  onChange: (value: string) => void;
  onCursor: (line: number, column: number, totalLines: number) => void;
  onMount?: (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => void;
}

const themeForSetting = (t: NotepadSettings["theme"]) =>
  t === "light" ? "vs" : t === "dark" ? "vs-dark" : "notepad-vscode";

export function MonacoPane({ tab, settings, onChange, onCursor, onMount }: Props) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [ready, setReady] = useState(false);

  const handleMount: OnMount = (ed, monaco) => {
    editorRef.current = ed;
    monaco.editor.defineTheme("notepad-vscode", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#1e1e2e",
        "editor.foreground": "#cdd6f4",
        "editorLineNumber.foreground": "#6c7086",
        "editorCursor.foreground": "#f5e0dc",
        "editor.selectionBackground": "#585b7055",
        "editor.lineHighlightBackground": "#2a2b3c",
      },
    });
    monaco.editor.setTheme(themeForSetting(settings.theme));
    ed.onDidChangeCursorPosition((e) => {
      const model = ed.getModel();
      onCursor(e.position.lineNumber, e.position.column, model?.getLineCount() ?? 0);
    });
    setReady(true);
    onMount?.(ed, monaco);
  };

  useEffect(() => {
    if (!ready || !editorRef.current) return;
    // theme is global on monaco; setting handled via Editor `theme` prop too.
  }, [ready, settings.theme]);

  return (
    <Editor
      height="100%"
      width="100%"
      path={tab.id + "-" + tab.name}
      language={tab.language}
      value={tab.content}
      theme={themeForSetting(settings.theme)}
      onChange={(v) => onChange(v ?? "")}
      onMount={handleMount}
      options={{
        fontSize: settings.fontSize,
        wordWrap: settings.wordWrap ? "on" : "off",
        minimap: { enabled: settings.minimap },
        automaticLayout: true,
        smoothScrolling: true,
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
        formatOnPaste: true,
        autoClosingBrackets: "always",
        autoIndent: "advanced",
        folding: true,
        lineNumbers: "on",
        renderWhitespace: "selection",
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
        bracketPairColorization: { enabled: true },
        scrollBeyondLastLine: false,
      }}
    />
  );
}

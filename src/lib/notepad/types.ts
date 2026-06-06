export type LanguageId =
  | "plaintext"
  | "html"
  | "css"
  | "javascript"
  | "typescript"
  | "json"
  | "markdown"
  | "python"
  | "sql"
  | "xml";

export interface EditorTab {
  id: string;
  name: string;
  language: LanguageId;
  content: string;
  savedContent: string;
  filePath?: string;
}

export interface NotepadSettings {
  theme: "light" | "dark" | "vscode";
  fontSize: number;
  wordWrap: boolean;
  minimap: boolean;
  showStatusBar: boolean;
  showSidebar: boolean;
  sidebarTab: "explorer" | "recent" | "info";
}

export interface RecentFile {
  name: string;
  language: LanguageId;
  content: string;
  openedAt: number;
}

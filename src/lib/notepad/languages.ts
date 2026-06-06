import type { LanguageId } from "./types";

export const LANGUAGES: { id: LanguageId; label: string; ext: string[] }[] = [
  { id: "plaintext", label: "Plain Text", ext: ["txt"] },
  { id: "html", label: "HTML", ext: ["html", "htm"] },
  { id: "css", label: "CSS", ext: ["css"] },
  { id: "javascript", label: "JavaScript", ext: ["js", "jsx", "mjs", "cjs"] },
  { id: "typescript", label: "TypeScript", ext: ["ts", "tsx"] },
  { id: "json", label: "JSON", ext: ["json"] },
  { id: "markdown", label: "Markdown", ext: ["md", "markdown"] },
  { id: "python", label: "Python", ext: ["py"] },
  { id: "sql", label: "SQL", ext: ["sql"] },
  { id: "xml", label: "XML", ext: ["xml", "svg"] },
];

export function detectLanguageFromFilename(name: string): LanguageId {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  for (const l of LANGUAGES) if (l.ext.includes(ext)) return l.id;
  return "plaintext";
}

export function extForLanguage(id: LanguageId): string {
  const l = LANGUAGES.find((x) => x.id === id);
  return l?.ext[0] ?? "txt";
}

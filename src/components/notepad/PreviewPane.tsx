import { useMemo } from "react";
import type { EditorTab } from "@/lib/notepad/types";

// Minimal markdown renderer (no deps). Handles headings, bold/italic, code, lists, links.
function renderMarkdown(src: string): string {
  const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!));
  let out = esc(src);
  out = out.replace(/```([\s\S]*?)```/g, (_, c) => `<pre class="bg-muted rounded p-3 overflow-x-auto text-xs"><code>${c}</code></pre>`);
  out = out.replace(/`([^`\n]+)`/g, '<code class="bg-muted rounded px-1 text-[0.9em]">$1</code>');
  out = out.replace(/^###### (.*)$/gm, '<h6 class="text-sm font-semibold mt-3">$1</h6>');
  out = out.replace(/^##### (.*)$/gm, '<h5 class="text-sm font-semibold mt-3">$1</h5>');
  out = out.replace(/^#### (.*)$/gm, '<h4 class="text-base font-semibold mt-3">$1</h4>');
  out = out.replace(/^### (.*)$/gm, '<h3 class="text-lg font-semibold mt-4">$1</h3>');
  out = out.replace(/^## (.*)$/gm, '<h2 class="text-xl font-bold mt-5">$1</h2>');
  out = out.replace(/^# (.*)$/gm, '<h1 class="text-2xl font-bold mt-6">$1</h1>');
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="text-primary underline" href="$2" target="_blank" rel="noreferrer">$1</a>');
  out = out.replace(/^- (.*)$/gm, '<li class="ml-5 list-disc">$1</li>');
  out = out.replace(/\n{2,}/g, "<br/><br/>");
  out = out.replace(/\n/g, "<br/>");
  return out;
}

export function PreviewPane({ tab }: { tab: EditorTab }) {
  const html = useMemo(() => {
    if (tab.language === "html") return tab.content;
    if (tab.language === "markdown") {
      return `<div style="font-family: ui-sans-serif, system-ui; padding: 24px; color: inherit; line-height: 1.6;">${renderMarkdown(tab.content)}</div>`;
    }
    return `<pre style="padding:16px;white-space:pre-wrap;font-family:ui-monospace,monospace;">${tab.content
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")}</pre>`;
  }, [tab.content, tab.language]);

  return (
    <div className="h-full w-full bg-card">
      <iframe
        title="preview"
        className="w-full h-full border-0"
        sandbox="allow-scripts"
        srcDoc={`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#fff;color:#111;">${html}</body></html>`}
      />
    </div>
  );
}

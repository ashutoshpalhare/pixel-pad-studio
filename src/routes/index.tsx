import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { NotepadApp } from "@/components/notepad/NotepadApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Notepad++ Web — Modern Code Editor" },
      { name: "description", content: "A modern, browser-based Notepad++ clone with Monaco editor, multi-tab editing, themes, live preview, and command palette." },
      { property: "og:title", content: "Notepad++ Web" },
      { property: "og:description", content: "A modern Notepad++ clone in your browser." },
    ],
  }),
  component: Index,
});

function Index() {
  // Monaco needs the browser; render only after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background text-muted-foreground">
        Loading Notepad++…
      </div>
    );
  }
  return <NotepadApp />;
}

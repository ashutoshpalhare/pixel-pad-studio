import { useEffect, useMemo, useState } from "react";

interface Action {
  id: string;
  label: string;
  shortcut?: string;
  run: () => void;
}

interface Props {
  open: boolean;
  onClose: () => void;
  actions: Action[];
}

export function CommandPalette({ open, onClose, actions }: Props) {
  const [q, setQ] = useState("");
  useEffect(() => { if (open) setQ(""); }, [open]);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return actions.filter((a) => a.label.toLowerCase().includes(s));
  }, [q, actions]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/40" onClick={onClose}>
      <div
        className="glass w-[520px] max-w-[92vw] rounded-xl border border-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Type a command…"
          className="w-full px-4 py-3 bg-transparent text-sm outline-none border-b border-border"
        />
        <div className="max-h-80 overflow-y-auto">
          {filtered.length === 0 && <div className="px-4 py-6 text-sm text-muted-foreground">No commands</div>}
          {filtered.map((a) => (
            <button
              key={a.id}
              onClick={() => { a.run(); onClose(); }}
              className="w-full flex items-center justify-between gap-4 px-4 py-2 text-sm hover:bg-accent text-left"
            >
              <span>{a.label}</span>
              {a.shortcut && <span className="text-xs text-muted-foreground">{a.shortcut}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

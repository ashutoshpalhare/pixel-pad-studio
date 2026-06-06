import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  title: string;
  defaultValue?: string;
  onClose: () => void;
  onSubmit: (v: string) => void;
  placeholder?: string;
}

export function PromptDialog({ open, title, defaultValue = "", onClose, onSubmit, placeholder }: Props) {
  const [v, setV] = useState(defaultValue);
  useEffect(() => { if (open) setV(defaultValue); }, [open, defaultValue]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <form
        onSubmit={(e) => { e.preventDefault(); onSubmit(v); onClose(); }}
        onClick={(e) => e.stopPropagation()}
        className="glass w-[420px] max-w-[92vw] rounded-xl border border-border shadow-2xl p-4"
      >
        <div className="text-sm font-medium mb-3">{title}</div>
        <input
          autoFocus
          value={v}
          onChange={(e) => setV(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 rounded-md bg-background border border-border text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs rounded-md hover:bg-accent">Cancel</button>
          <button type="submit" className="px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground hover:opacity-90">OK</button>
        </div>
      </form>
    </div>
  );
}

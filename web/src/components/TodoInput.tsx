import { useState, useRef, useEffect } from "react";
import type { Priority } from "../types";

interface TodoInputProps {
  onAdd: (text: string, priority: Priority, dueDate: string | null) => void;
  todayISO: () => string;
  defaultDueToday?: boolean;
}

const priorityLabels: Record<Priority, { label: string; color: string }> = {
  low: { label: "Low", color: "var(--success)" },
  medium: { label: "Med", color: "var(--warning)" },
  high: { label: "High", color: "var(--error)" },
};

export function TodoInput({ onAdd, todayISO, defaultDueToday }: TodoInputProps) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState<string>(defaultDueToday ? todayISO() : "");
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultDueToday) {
      setDueDate(todayISO());
    }
  }, [defaultDueToday, todayISO]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text, priority, dueDate || null);
    setText("");
    setPriority("medium");
    if (!defaultDueToday) setDueDate("");
    setExpanded(false);
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-2 transition-colors"
      style={{
        borderRadius: "1.25rem",
        borderColor: expanded ? "var(--accent)" : "var(--line)",
        background: "var(--panel)",
        overflow: "hidden",
      }}
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <span
          className="text-xl"
          style={{ color: "var(--accent)", lineHeight: 1 }}
        >
          +
        </span>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setExpanded(true)}
          placeholder="Add a new task..."
          className="flex-1 bg-transparent outline-none text-sm font-medium"
          style={{ color: "var(--ink)" }}
        />
        {text.trim() && (
          <button
            type="submit"
            className="px-4 py-1.5 text-sm font-semibold text-white transition-transform active:scale-95"
            style={{ borderRadius: "0.75rem", background: "var(--accent)" }}
          >
            Add
          </button>
        )}
      </div>

      {expanded && (
        <div
          className="flex items-center gap-3 px-4 py-2.5 border-t flex-wrap"
          style={{ borderColor: "var(--line)" }}
        >
          {/* Priority selector */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium mr-1" style={{ color: "var(--muted)" }}>
              Priority:
            </span>
            {(["low", "medium", "high"] as Priority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className="px-2.5 py-1 text-xs font-semibold transition-colors"
                style={{
                  borderRadius: "0.5rem",
                  background:
                    priority === p
                      ? priorityLabels[p].color
                      : "var(--line)",
                  color: priority === p ? "#fff" : "var(--muted)",
                }}
              >
                {priorityLabels[p].label}
              </button>
            ))}
          </div>

          {/* Due date */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>
              Due:
            </span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="text-xs px-2 py-1 bg-transparent border outline-none"
              style={{
                borderRadius: "0.5rem",
                borderColor: "var(--line)",
                color: "var(--ink)",
              }}
            />
          </div>
        </div>
      )}
    </form>
  );
}

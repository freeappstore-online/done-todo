import { useState, useRef, useEffect } from "react";
import type { Todo } from "../types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

const priorityDot: Record<string, string> = {
  low: "var(--success)",
  medium: "var(--warning)",
  high: "var(--error)",
};

function formatDueDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.getTime() === today.getTime()) return "Today";
  if (date.getTime() === tomorrow.getTime()) return "Tomorrow";

  const diff = date.getTime() - today.getTime();
  if (diff < 0) return "Overdue";
  if (diff < 7 * 86400000) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getDueDateColor(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = date.getTime() - today.getTime();
  if (diff < 0) return "var(--error)";
  if (diff === 0) return "var(--accent)";
  return "var(--muted)";
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [swiped, setSwiped] = useState(false);
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && editRef.current) {
      editRef.current.focus();
      editRef.current.select();
    }
  }, [editing]);

  const handleEditSubmit = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText);
    } else {
      setEditText(todo.text);
    }
    setEditing(false);
  };

  return (
    <div
      className="group flex items-center gap-3 px-4 py-3 transition-all"
      style={{
        borderRadius: "1.25rem",
        background: swiped ? "var(--error)" : "var(--panel)",
        opacity: todo.completed ? 0.6 : 1,
      }}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className="shrink-0 flex items-center justify-center w-6 h-6 border-2 transition-all"
        style={{
          borderRadius: "0.5rem",
          borderColor: todo.completed ? "var(--accent)" : "var(--line-strong)",
          background: todo.completed ? "var(--accent)" : "transparent",
        }}
        aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
      >
        {todo.completed && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>

      {/* Priority dot */}
      {!todo.completed && (
        <span
          className="shrink-0 w-2 h-2 rounded-full"
          style={{ background: priorityDot[todo.priority] }}
        />
      )}

      {/* Text */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            ref={editRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEditSubmit();
              if (e.key === "Escape") {
                setEditText(todo.text);
                setEditing(false);
              }
            }}
            className="w-full bg-transparent outline-none text-sm font-medium"
            style={{ color: "var(--ink)" }}
          />
        ) : (
          <div
            className="text-sm font-medium truncate cursor-pointer"
            onDoubleClick={() => {
              if (!todo.completed) {
                setEditing(true);
              }
            }}
            style={{
              color: "var(--ink)",
              textDecoration: todo.completed ? "line-through" : "none",
            }}
          >
            {todo.text}
          </div>
        )}

        {/* Due date badge */}
        {todo.dueDate && !todo.completed && (
          <span
            className="text-[11px] font-semibold mt-0.5 inline-block"
            style={{ color: getDueDateColor(todo.dueDate) }}
          >
            {formatDueDate(todo.dueDate)}
          </span>
        )}
      </div>

      {/* Delete button */}
      <button
        onClick={() => onDelete(todo.id)}
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1"
        style={{ color: "var(--muted)" }}
        aria-label="Delete todo"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      </button>

      {/* Mobile: tap to show delete */}
      <button
        onClick={() => setSwiped(!swiped)}
        className="shrink-0 md:hidden p-1"
        style={{ color: swiped ? "#fff" : "var(--muted)" }}
        aria-label="More options"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>

      {swiped && (
        <button
          onClick={() => onDelete(todo.id)}
          className="shrink-0 md:hidden px-3 py-1 text-xs font-bold text-white"
          style={{ borderRadius: "0.5rem", background: "#fff3" }}
        >
          Delete
        </button>
      )}
    </div>
  );
}

import { useState, useMemo } from "react";
import { Shell } from "./components/Shell";
import type { View } from "./components/Shell";
import { TodoInput } from "./components/TodoInput";
import { TodoItem } from "./components/TodoItem";
import { EmptyState } from "./components/EmptyState";
import { useTodos } from "./hooks/useTodos";

export default function App() {
  const [activeView, setActiveView] = useState<View>("inbox");
  const {
    inboxTodos,
    todayTodos,
    completedTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    todayISO,
  } = useTodos();

  const counts = useMemo(
    () => ({
      inbox: inboxTodos.length,
      today: todayTodos.length,
      completed: completedTodos.length,
    }),
    [inboxTodos.length, todayTodos.length, completedTodos.length]
  );

  const viewConfig: Record<
    View,
    { title: string; subtitle: string; emptyIcon: string; emptyTitle: string; emptyDesc: string }
  > = {
    inbox: {
      title: "Inbox",
      subtitle: `${inboxTodos.length} task${inboxTodos.length !== 1 ? "s" : ""}`,
      emptyIcon: "📥",
      emptyTitle: "All clear!",
      emptyDesc: "You have no pending tasks. Add one above to get started.",
    },
    today: {
      title: "Today",
      subtitle: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
      emptyIcon: "☀️",
      emptyTitle: "Nothing due today",
      emptyDesc: "Tasks with today's due date will appear here.",
    },
    completed: {
      title: "Completed",
      subtitle: `${completedTodos.length} task${completedTodos.length !== 1 ? "s" : ""} done`,
      emptyIcon: "🎉",
      emptyTitle: "No completed tasks yet",
      emptyDesc: "Complete a task and it will show up here.",
    },
  };

  const currentView = viewConfig[activeView];

  const activeTodos =
    activeView === "inbox"
      ? inboxTodos
      : activeView === "today"
        ? todayTodos
        : completedTodos;

  // Sort: high priority first, then medium, then low
  const sortedTodos = useMemo(() => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return [...activeTodos].sort((a, b) => {
      if (activeView === "completed") {
        // Completed: most recently completed first
        return (
          new Date(b.completedAt || 0).getTime() -
          new Date(a.completedAt || 0).getTime()
        );
      }
      // Active: by priority, then by creation date
      const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (pDiff !== 0) return pDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [activeTodos, activeView]);

  return (
    <Shell activeView={activeView} onNavigate={setActiveView} counts={counts}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1
            className="text-2xl md:text-3xl font-bold mb-1"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            {currentView.title}
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {currentView.subtitle}
          </p>
        </div>

        {/* Input (not on completed view) */}
        {activeView !== "completed" && (
          <div className="mb-6">
            <TodoInput
              onAdd={addTodo}
              todayISO={todayISO}
              defaultDueToday={activeView === "today"}
            />
          </div>
        )}

        {/* Todo list */}
        {sortedTodos.length === 0 ? (
          <EmptyState
            icon={currentView.emptyIcon}
            title={currentView.emptyTitle}
            description={currentView.emptyDesc}
          />
        ) : (
          <div className="space-y-2">
            {sortedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))}
          </div>
        )}

        {/* Clear completed */}
        {activeView === "completed" && completedTodos.length > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={clearCompleted}
              className="px-5 py-2.5 text-sm font-semibold transition-colors"
              style={{
                borderRadius: "0.75rem",
                background: "var(--line)",
                color: "var(--muted)",
              }}
            >
              Clear all completed
            </button>
          </div>
        )}

        {/* Stats bar for inbox */}
        {activeView === "inbox" && inboxTodos.length > 0 && (
          <div
            className="mt-8 flex items-center justify-center gap-6 py-3 px-4 text-xs font-medium"
            style={{
              borderRadius: "1.25rem",
              background: "var(--panel)",
              color: "var(--muted)",
            }}
          >
            <span className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--error)" }}
              />
              {inboxTodos.filter((t) => t.priority === "high").length} high
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--warning)" }}
              />
              {inboxTodos.filter((t) => t.priority === "medium").length} medium
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--success)" }}
              />
              {inboxTodos.filter((t) => t.priority === "low").length} low
            </span>
          </div>
        )}
      </div>
    </Shell>
  );
}

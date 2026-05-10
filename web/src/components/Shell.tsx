import type { ReactNode } from "react";

export type View = "inbox" | "today" | "completed";

interface NavItem {
  id: View;
  label: string;
  icon: ReactNode;
  count?: number;
}

interface ShellProps {
  children: ReactNode;
  activeView: View;
  onNavigate: (view: View) => void;
  counts: { inbox: number; today: number; completed: number };
}

const navItems = (counts: ShellProps["counts"]): NavItem[] => [
  {
    id: "inbox",
    label: "Inbox",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </svg>
    ),
    count: counts.inbox,
  },
  {
    id: "today",
    label: "Today",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    count: counts.today,
  },
  {
    id: "completed",
    label: "Completed",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    count: counts.completed,
  },
];

export function Shell({ children, activeView, onNavigate, counts }: ShellProps) {
  const items = navItems(counts);

  return (
    <>
      {/* Desktop layout */}
      <div className="hidden md:flex h-screen">
        <aside
          className="flex flex-col border-r h-full shrink-0"
          style={{ width: "17rem", borderColor: "var(--line)", background: "var(--panel)" }}
        >
          <div className="p-6 font-bold text-xl" style={{ fontFamily: "Fraunces, serif" }}>
            ✓ Done
          </div>
          <nav className="flex-1 px-3 space-y-1">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors"
                style={{
                  borderRadius: "0.75rem",
                  background: activeView === item.id ? "var(--accent)" : "transparent",
                  color: activeView === item.id ? "#fff" : "var(--ink)",
                }}
              >
                <span style={{ opacity: activeView === item.id ? 1 : 0.6 }}>{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className="text-xs font-semibold px-2 py-0.5"
                    style={{
                      borderRadius: "9999px",
                      background: activeView === item.id ? "rgba(255,255,255,0.2)" : "var(--line)",
                      color: activeView === item.id ? "#fff" : "var(--muted)",
                    }}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="p-4 text-xs" style={{ color: "var(--muted)" }}>
            <a
              href="https://freeappstore.online"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: "var(--muted)" }}
            >
              Part of FreeAppStore — free forever
            </a>
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>

      {/* Mobile layout */}
      <div className="flex flex-col h-screen md:hidden">
        <header
          className="flex items-center px-4 h-14 border-b shrink-0"
          style={{ borderColor: "var(--line)", background: "var(--panel)" }}
        >
          <span className="font-bold text-lg" style={{ fontFamily: "Fraunces, serif" }}>
            ✓ Done
          </span>
        </header>
        <main className="flex-1 overflow-auto p-4">{children}</main>
        <nav
          className="flex items-center justify-around h-16 border-t shrink-0"
          style={{ borderColor: "var(--line)", background: "var(--dock)" }}
        >
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 transition-colors relative"
              style={{
                color: activeView === item.id ? "var(--accent)" : "var(--muted)",
              }}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span
                  className="absolute -top-0.5 right-0 text-[9px] font-bold px-1.5 py-0.5"
                  style={{
                    borderRadius: "9999px",
                    background: "var(--accent)",
                    color: "#fff",
                    minWidth: "1rem",
                    textAlign: "center",
                  }}
                >
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}

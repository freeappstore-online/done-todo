interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3
        className="text-lg font-bold mb-1"
        style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}
      >
        {title}
      </h3>
      <p className="text-sm max-w-xs" style={{ color: "var(--muted)" }}>
        {description}
      </p>
    </div>
  );
}

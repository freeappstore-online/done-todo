export type Priority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  dueDate: string | null; // ISO date string
  createdAt: string; // ISO date string
  completedAt: string | null; // ISO date string
}

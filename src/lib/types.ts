export type ProjectStatus = "active" | "archived";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  notes: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TimeEntry {
  id: string;
  projectId: string;
  taskId: string | null;
  startedAt: string;
  endedAt: string | null;
  note: string | null;
  createdAt: string;
}

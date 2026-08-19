import { create } from "zustand";
import { getDb } from "../lib/db";
import { createId } from "../lib/id";
import type { Task, TaskPriority, TaskStatus } from "../lib/types";

interface TaskRow {
  id: string;
  project_id: string;
  title: string;
  notes: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_at: string | null;
  created_at: string;
  updated_at: string;
}

function mapRow(row: TaskRow): Task {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    notes: row.notes,
    status: row.status,
    priority: row.priority,
    dueAt: row.due_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

interface TasksState {
  tasks: Task[];
  loading: boolean;
  loaded: boolean;
  fetchTasks: () => Promise<void>;
  createTask: (input: {
    projectId: string;
    title: string;
    notes?: string;
    priority?: TaskPriority;
    dueAt?: string;
  }) => Promise<Task>;
  updateTask: (
    id: string,
    patch: Partial<{
      title: string;
      notes: string | null;
      status: TaskStatus;
      priority: TaskPriority;
      dueAt: string | null;
    }>,
  ) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const columnByField: Record<string, string> = {
  dueAt: "due_at",
};

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  loading: false,
  loaded: false,

  async fetchTasks() {
    set({ loading: true });
    const db = await getDb();
    const rows = await db.select<TaskRow[]>(
      "SELECT * FROM tasks ORDER BY created_at DESC",
    );
    set({ tasks: rows.map(mapRow), loading: false, loaded: true });
  },

  async createTask(input) {
    const db = await getDb();
    const id = createId();
    await db.execute(
      "INSERT INTO tasks (id, project_id, title, notes, priority, due_at) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        id,
        input.projectId,
        input.title,
        input.notes ?? null,
        input.priority ?? "medium",
        input.dueAt ?? null,
      ],
    );
    await get().fetchTasks();
    const created = get().tasks.find((t) => t.id === id);
    if (!created) throw new Error("Failed to load created task");
    return created;
  },

  async updateTask(id, patch) {
    const db = await getDb();
    const fields: string[] = [];
    const values: unknown[] = [];
    let i = 1;

    for (const [key, value] of Object.entries(patch)) {
      const column = columnByField[key] ?? key;
      fields.push(`${column} = $${i}`);
      values.push(value);
      i++;
    }
    if (fields.length === 0) return;

    fields.push(`updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`);
    values.push(id);
    await db.execute(
      `UPDATE tasks SET ${fields.join(", ")} WHERE id = $${i}`,
      values,
    );
    await get().fetchTasks();
  },

  async deleteTask(id) {
    const db = await getDb();
    await db.execute("DELETE FROM tasks WHERE id = $1", [id]);
    set({ tasks: get().tasks.filter((t) => t.id !== id) });
  },
}));

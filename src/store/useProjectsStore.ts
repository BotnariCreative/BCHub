import { create } from "zustand";
import { getDb } from "../lib/db";
import { createId } from "../lib/id";
import type { Project, ProjectStatus } from "../lib/types";

interface ProjectRow {
  id: string;
  name: string;
  description: string | null;
  color: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

function mapRow(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    color: row.color,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  loaded: boolean;
  fetchProjects: () => Promise<void>;
  createProject: (input: { name: string; description?: string; color?: string }) => Promise<Project>;
  updateProject: (
    id: string,
    patch: Partial<Pick<Project, "name" | "description" | "color" | "status">>,
  ) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  loading: false,
  loaded: false,

  async fetchProjects() {
    set({ loading: true });
    const db = await getDb();
    const rows = await db.select<ProjectRow[]>(
      "SELECT * FROM projects ORDER BY created_at DESC",
    );
    set({ projects: rows.map(mapRow), loading: false, loaded: true });
  },

  async createProject(input) {
    const db = await getDb();
    const id = createId();
    const color = input.color ?? "#6366f1";
    await db.execute(
      "INSERT INTO projects (id, name, description, color) VALUES ($1, $2, $3, $4)",
      [id, input.name, input.description ?? null, color],
    );
    await get().fetchProjects();
    const created = get().projects.find((p) => p.id === id);
    if (!created) throw new Error("Failed to load created project");
    return created;
  },

  async updateProject(id, patch) {
    const db = await getDb();
    const fields: string[] = [];
    const values: unknown[] = [];
    let i = 1;

    for (const [key, value] of Object.entries(patch)) {
      fields.push(`${key} = $${i}`);
      values.push(value);
      i++;
    }
    if (fields.length === 0) return;

    fields.push(`updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`);
    values.push(id);
    await db.execute(
      `UPDATE projects SET ${fields.join(", ")} WHERE id = $${i}`,
      values,
    );
    await get().fetchProjects();
  },

  async deleteProject(id) {
    const db = await getDb();
    await db.execute("DELETE FROM projects WHERE id = $1", [id]);
    set({ projects: get().projects.filter((p) => p.id !== id) });
  },
}));

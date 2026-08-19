import { create } from "zustand";
import { getDb } from "../lib/db";
import { createId } from "../lib/id";
import type { TimeEntry } from "../lib/types";

interface TimeEntryRow {
  id: string;
  project_id: string;
  task_id: string | null;
  started_at: string;
  ended_at: string | null;
  note: string | null;
  created_at: string;
}

function mapRow(row: TimeEntryRow): TimeEntry {
  return {
    id: row.id,
    projectId: row.project_id,
    taskId: row.task_id,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    note: row.note,
    createdAt: row.created_at,
  };
}

interface TimeEntriesState {
  entries: TimeEntry[];
  loading: boolean;
  loaded: boolean;
  fetchEntries: () => Promise<void>;
  startTimer: (projectId: string, taskId?: string | null) => Promise<void>;
  stopTimer: (entryId: string) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  activeEntry: () => TimeEntry | undefined;
}

export const useTimeEntriesStore = create<TimeEntriesState>((set, get) => ({
  entries: [],
  loading: false,
  loaded: false,

  async fetchEntries() {
    set({ loading: true });
    const db = await getDb();
    const rows = await db.select<TimeEntryRow[]>(
      "SELECT * FROM time_entries ORDER BY started_at DESC",
    );
    set({ entries: rows.map(mapRow), loading: false, loaded: true });
  },

  async startTimer(projectId, taskId = null) {
    const active = get().activeEntry();
    if (active) {
      await get().stopTimer(active.id);
    }
    const db = await getDb();
    const id = createId();
    const startedAt = new Date().toISOString();
    await db.execute(
      "INSERT INTO time_entries (id, project_id, task_id, started_at) VALUES ($1, $2, $3, $4)",
      [id, projectId, taskId, startedAt],
    );
    await get().fetchEntries();
  },

  async stopTimer(entryId) {
    const db = await getDb();
    await db.execute(
      "UPDATE time_entries SET ended_at = $1 WHERE id = $2",
      [new Date().toISOString(), entryId],
    );
    await get().fetchEntries();
  },

  async deleteEntry(id) {
    const db = await getDb();
    await db.execute("DELETE FROM time_entries WHERE id = $1", [id]);
    set({ entries: get().entries.filter((e) => e.id !== id) });
  },

  activeEntry() {
    return get().entries.find((e) => e.endedAt === null);
  },
}));

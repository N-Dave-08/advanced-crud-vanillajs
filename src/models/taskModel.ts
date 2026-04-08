import type {
  Task,
  AppState,
  Priority,
  FilterType,
  SortType,
} from "../types.js";

export default class TaskModel {
  private state: AppState;

  constructor() {
    this.state = {
      tasks: JSON.parse(localStorage.getItem("tasks") || "[]"),
      filter: "all",
      sortBy: "newest",
      searchQuery: "",
    };
  }

  private _save(): void {
    localStorage.setItem("tasks", JSON.stringify(this.state.tasks));
  }

  addTask(text: string, priority: Priority): void {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      priority,
      completed: false,
      createdAt: Date.now(),
    };
    this.state.tasks.unshift(newTask);
    this._save();
  }

  updateTask(id: string, newText: string): void {
    const task = this.state.tasks.find((t) => t.id === id);
    if (task && newText.trim()) {
      task.text = newText.trim();
      this._save();
    }
  }

  deleteTask(id: string): void {
    this.state.tasks = this.state.tasks.filter((t) => t.id !== id);
    this._save();
  }

  toggleTask(id: string): void {
    const task = this.state.tasks.find((t) => t.id === id);
    if (task) task.completed = !task.completed;
    this._save();
  }

  reorder(fromIndex: number, toIndex: number): void {
    const [movedItem] = this.state.tasks.splice(fromIndex, 1);
    if (movedItem) {
      this.state.tasks.splice(toIndex, 0, movedItem);
      this._save();
    }
  }

  setFilter(filter: FilterType): void {
    this.state.filter = filter;
  }

  setSort(sortBy: SortType): void {
    this.state.sortBy = sortBy;
  }

  setSearch(query: string): void {
    this.state.searchQuery = query.toLowerCase();
  }

  getProcessedTasks(): Task[] {
    let filtered = [...this.state.tasks];

    if (this.state.filter === "active")
      filtered = filtered.filter((t) => !t.completed);
    if (this.state.filter === "completed")
      filtered = filtered.filter((t) => t.completed);

    if (this.state.searchQuery) {
      filtered = filtered.filter((t) =>
        t.text.toLowerCase().includes(this.state.searchQuery),
      );
    }

    if (this.state.sortBy === "priority") {
      const weights: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
      filtered.sort((a, b) => weights[b.priority] - weights[a.priority]);
    } else {
      filtered.sort((a, b) => b.createdAt - a.createdAt);
    }
    return filtered;
  }
}

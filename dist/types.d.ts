export type Priority = "low" | "medium" | "high";
export type FilterType = "all" | "active" | "completed";
export type SortType = "newest" | "priority";
export interface Task {
    id: string;
    text: string;
    priority: Priority;
    completed: boolean;
    createdAt: number;
}
export interface AppState {
    tasks: Task[];
    filter: FilterType;
    sortBy: SortType;
    searchQuery: string;
}
//# sourceMappingURL=types.d.ts.map